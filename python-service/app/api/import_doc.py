"""Word Import API - 文档导入接口

底层技术分析:
1. DOCX 字体层级: Run.rPr.rFonts -> Paragraph.pPr.rPr.rFonts -> Style.rPr.rFonts -> docDefaults.rPr.rFonts
2. python-docx 的 run.font.name 只读取 ascii 属性，中文(eastAsia)需要手动解析 XML
3. 格式继承链: Run -> Paragraph -> Style -> docDefaults
4. 图片处理: docx2python 提取图片和占位符，python-docx 提供格式信息
5. 公式处理: Word 使用 OMML (Office Math Markup Language) 存储公式
"""
import io
import os
import re
import base64
import tempfile
import shutil
from html.parser import HTMLParser
from typing import List, Dict, Any, Optional, Tuple
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel

# 尝试导入 docx2python，如果没有则使用备选方案
try:
    from docx2python import docx2python
    HAS_DOCX2PYTHON = True
except ImportError:
    HAS_DOCX2PYTHON = False

try:
    from docx import Document
    from docx.table import Table
    from docx.text.paragraph import Paragraph
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.oxml.ns import qn
    HAS_PYTHON_DOCX = True
except ImportError:
    HAS_PYTHON_DOCX = False

router = APIRouter(tags=["import"])


class ImportResponse(BaseModel):
    """导入响应"""
    success: bool
    content: List[Dict[str, Any]]
    html: Optional[str] = None
    title: Optional[str] = None
    statistics: Dict[str, Any]
    fonts: List[str] = []  # 文档中使用的字体列表
    message: Optional[str] = None


class ImportPreviewResponse(BaseModel):
    """导入预览响应"""
    success: bool
    html: str
    title: Optional[str] = None
    statistics: Dict[str, int]


def strip_html_tags(html_text: str) -> str:
    """去除 HTML 标签"""
    clean = re.sub(r'<[^>]+>', '', html_text)
    clean = clean.replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&')
    return clean


def detect_heading_level(text: str) -> str:
    """检测文本的标题级别"""
    # 一级标题: 短文本 + 居中关键词
    if len(text) < 20 and re.match(r'^(?:发明专利|实用新型|外观设计|专利交底书|说明书)', text):
        return "heading-one"
    
    # 二级标题: 章节标题
    if re.match(r'^[一二三四五六七八九十]+[、.]|第[一二三四五六七八九十0-9]+[章节]|^\d+[、.．]', text):
        return "heading-two"
    
    # 三级标题: 小节标题
    if re.match(r'^[（(][一二三四五六七八九十0-9]+[)）]', text):
        return "heading-three"
    
    # 步骤标题
    if re.match(r'^步骤\d+[:：]', text):
        return "heading-two"
    
    return "paragraph"


def get_alignment_from_docx(alignment) -> Optional[str]:
    """从 python-docx 对齐值转换为字符串"""
    if alignment == WD_ALIGN_PARAGRAPH.CENTER:
        return "center"
    elif alignment == WD_ALIGN_PARAGRAPH.RIGHT:
        return "right"
    elif alignment == WD_ALIGN_PARAGRAPH.JUSTIFY:
        return "justify"
    elif alignment == WD_ALIGN_PARAGRAPH.LEFT:
        return "left"
    return None


def extract_image_paths(text: str) -> List[str]:
    """从文本中提取所有图片路径"""
    paths = []
    pattern1 = r'----(media/[^-]+)----'
    pattern2 = r'----Image alt text---->[^<]*<----(media/[^-]+)----'
    
    for match in re.finditer(pattern1, text):
        paths.append(match.group(1))
    for match in re.finditer(pattern2, text):
        paths.append(match.group(1))
    
    return paths


def remove_image_placeholders(text: str) -> str:
    """移除图片占位符，返回清理后的文本"""
    # 移除带 alt 文本的图片占位符
    text = re.sub(r'----Image alt text---->[^<]*<----media/[^-]+----', '', text)
    # 移除普通图片占位符
    text = re.sub(r'----media/[^-]+----', '', text)
    return text.strip()


def create_image_node(image_path: str, base64_data: Optional[str] = None) -> Dict[str, Any]:
    """创建 Slate 图片节点"""
    if base64_data:
        src = f"data:image/png;base64,{base64_data}"
    else:
        src = image_path
    
    return {
        "type": "image",
        "src": src,
        "alt": "图片",
        "width": 600,
        "align": "center",
        "uploadStatus": "completed",
        "children": [{"text": ""}]
    }


def create_page_break_node() -> Dict[str, Any]:
    """创建分页符节点"""
    return {
        "type": "page-break",
        "children": [{"text": ""}]
    }


def create_formula_node(math_xml: str) -> Dict[str, Any]:
    """创建公式节点
    
    Word 公式使用 OMML (Office Math Markup Language)
    我们提取 XML 作为原始数据，前端可以使用 MathJax 或 KaTeX 渲染
    """
    return {
        "type": "formula",
        "mathXml": math_xml,
        "children": [{"text": ""}]
    }


def extract_math_from_run(run) -> Optional[str]:
    """从 run 中提取数学公式 (OMML)
    
    Word 公式结构:
    <w:r>
        <m:oMath> 或 <m:oMathPara>
            ... 数学内容 ...
        </m:oMath>
    </w:r>
    """
    try:
        # OMML 命名空间
        MATH_NS = "{http://schemas.openxmlformats.org/officeDocument/2006/math}"
        
        for child in run._r:
            # 检查是否是 m:oMath 或 m:oMathPara
            if child.tag == f"{MATH_NS}oMath" or child.tag == f"{MATH_NS}oMathPara":
                # 返回整个数学 XML
                return f"<math xmlns='http://schemas.openxmlformats.org/officeDocument/2006/math'>{''.join(str(c) for c in child)}</math>"
    except Exception:
        pass
    return None


def has_formula_in_para(para) -> bool:
    """检查段落是否包含公式"""
    MATH_NS = "{http://schemas.openxmlformats.org/officeDocument/2006/math}"
    for run in para.runs:
        for child in run._r:
            if child.tag == f"{MATH_NS}oMath" or child.tag == f"{MATH_NS}oMathPara":
                return True
    return False


def get_document_default_fonts(doc: Document) -> Dict[str, str]:
    """从 docDefaults 获取文档默认字体"""
    defaults = {'ascii': None, 'eastAsia': None, 'hAnsi': None}
    
    try:
        doc_defaults = doc.styles.element.find(qn('w:docDefaults'))
        if doc_defaults is not None:
            rPrDefault = doc_defaults.find(qn('w:rPrDefault'))
            if rPrDefault is not None:
                rPr = rPrDefault.find(qn('w:rPr'))
                if rPr is not None:
                    rFonts = rPr.find(qn('w:rFonts'))
                    if rFonts is not None:
                        defaults['ascii'] = rFonts.get(qn('w:ascii'))
                        defaults['eastAsia'] = rFonts.get(qn('w:eastAsia'))
                        defaults['hAnsi'] = rFonts.get(qn('w:hAnsi'))
    except Exception:
        pass
    
    return defaults


def get_run_font_from_xml(run, doc_defaults: Dict[str, str]) -> Optional[str]:
    """从 XML 直接读取 run 的字体，正确处理中文(eastAsia)和英文(ascii)"""
    try:
        rPr = run._element.find(qn('w:rPr'))
        if rPr is None:
            return None
        
        rFonts = rPr.find(qn('w:rFonts'))
        if rFonts is None:
            return None
        
        text = run.text or ""
        has_chinese = any('\u4e00' <= char <= '\u9fff' for char in text)
        
        if has_chinese:
            eastAsia = rFonts.get(qn('w:eastAsia'))
            if eastAsia:
                return eastAsia
            cs = rFonts.get(qn('w:cs'))
            if cs:
                return cs
            if doc_defaults.get('eastAsia'):
                return doc_defaults['eastAsia']
        
        ascii_font = rFonts.get(qn('w:ascii'))
        if ascii_font:
            return ascii_font
        
        hAnsi = rFonts.get(qn('w:hAnsi'))
        if hAnsi:
            return hAnsi
        
        if doc_defaults.get('ascii'):
            return doc_defaults['ascii']
    except Exception:
        pass
    
    return None


def get_run_font_name(run, para, doc, doc_defaults: Dict[str, str]) -> Optional[str]:
    """获取 run 的字体名称，完整处理继承链"""
    xml_font = get_run_font_from_xml(run, doc_defaults)
    if xml_font:
        return xml_font
    
    if run.font.name:
        return run.font.name
    
    if para.style and para.style.font and para.style.font.name:
        return para.style.font.name
    
    text = run.text or ""
    has_chinese = any('\u4e00' <= char <= '\u9fff' for char in text)
    
    if has_chinese and doc_defaults.get('eastAsia'):
        return doc_defaults['eastAsia']
    if doc_defaults.get('ascii'):
        return doc_defaults['ascii']
    
    return '宋体' if has_chinese else 'Times New Roman'


def font_name_to_css(font_name: str) -> str:
    """将 Word 字体名转换为 CSS font-family"""
    font_mapping = {
        '宋体': 'SimSun, 宋体, serif',
        '黑体': 'SimHei, 黑体, sans-serif',
        '楷体': 'KaiTi, 楷体, serif',
        '仿宋': 'FangSong, 仿宋, serif',
        '微软雅黑': 'Microsoft YaHei, 微软雅黑, sans-serif',
        'Times New Roman': 'Times New Roman, serif',
        'Calibri': 'Calibri, sans-serif',
        'Arial': 'Arial, sans-serif',
        'Wingdings': 'Wingdings, sans-serif',
        'Wingdings 2': 'Wingdings 2, sans-serif',
        'Wingdings 3': 'Wingdings 3, sans-serif',
    }
    return font_mapping.get(font_name, font_name)


def parse_run_formatting(run, para, doc, doc_defaults: Dict[str, str]) -> Optional[Dict[str, Any]]:
    """解析 run 的格式和字体信息，返回 Slate text 节点"""
    text = run.text or ""
    if not text.strip():
        return None
    
    node = {"text": text}
    
    if run.bold:
        node["bold"] = True
    if run.italic:
        node["italic"] = True
    if run.underline:
        node["underline"] = True
    if run.font.superscript:
        node["superscript"] = True
    if run.font.subscript:
        node["subscript"] = True
    if run.font.strike:
        node["strikethrough"] = True
    
    font_name = get_run_font_name(run, para, doc, doc_defaults)
    if font_name:
        node["fontFamily"] = font_name_to_css(font_name)
    
    if run.font.size:
        try:
            size_pt = run.font.size.pt
            if size_pt:
                node["fontSize"] = int(size_pt)
        except:
            pass
    
    return node


def parse_paragraph_with_formatting(para, doc, doc_defaults: Dict[str, str], node_type: str = "paragraph") -> Optional[Dict[str, Any]]:
    """解析段落，包含完整的格式和字体信息"""
    align = get_alignment_from_docx(para.paragraph_format.alignment)
    
    # 获取缩进信息（转换为字符数）
    indent = None
    first_line_indent = None
    
    # 从 XML 直接读取缩进值（更准确）
    pPr = para._p.find(qn('w:pPr'))
    if pPr is not None:
        ind = pPr.find(qn('w:ind'))
        if ind is not None:
            # 首行缩进 - 优先使用 w:firstLineChars (单位是 1/100 字符)
            first_line_chars = ind.get(qn('w:firstLineChars'))
            if first_line_chars:
                val = int(first_line_chars)
                # 忽略负值（悬挂缩进会单独处理）
                if val > 0:
                    first_line_indent = int(val / 100)
            else:
                # 回退到 w:firstLine (twips, 1/20 pt)
                first_line = ind.get(qn('w:firstLine'))
                if first_line:
                    val = int(first_line)
                    # 正值是首行缩进，负值是悬挂缩进
                    if val > 0:
                        first_line_indent = int(val / 20 / 16)
            
            # 检查悬挂缩进 (hanging indent)
            hanging_chars = ind.get(qn('w:hangingChars'))
            if hanging_chars:
                # 悬挂缩进：首行不缩进，后续行缩进
                first_line_indent = 0
                indent = int(int(hanging_chars) / 100)
            else:
                hanging = ind.get(qn('w:hanging'))
                if hanging:
                    first_line_indent = 0
                    indent = int(int(hanging) / 20 / 16)
            
            # 左缩进（如果还没设置）
            if indent is None:
                left_chars = ind.get(qn('w:leftChars'))
                if left_chars:
                    val = int(left_chars)
                    if val > 0:
                        indent = int(val / 100)
                else:
                    left = ind.get(qn('w:left'))
                    if left:
                        val = int(left)
                        if val > 0:
                            indent = int(val / 20 / 16)
    
    # 回退到 python-docx API
    if first_line_indent is None and para.paragraph_format.first_line_indent:
        pt = para.paragraph_format.first_line_indent.pt
        if pt > 0:
            first_line_indent = int(pt / 16)
    
    if indent is None and para.paragraph_format.left_indent:
        pt = para.paragraph_format.left_indent.pt
        if pt > 0:
            indent = int(pt / 16)
    
    text_nodes = []
    formula_count = 0
    
    for run in para.runs:
        # 先检查是否是公式
        math_xml = extract_math_from_run(run)
        if math_xml:
            # 是公式，创建公式节点
            formula_node = create_formula_node(math_xml)
            # 公式作为独立的 inline 元素
            text_nodes.append({
                "type": "formula-inline",
                "mathXml": math_xml,
                "children": [{"text": ""}]
            })
            formula_count += 1
        else:
            # 普通文本 run
            node = parse_run_formatting(run, para, doc, doc_defaults)
            if node:
                text_nodes.append(node)
    
    if not text_nodes:
        return None
    
    result: Dict[str, Any] = {
        "type": node_type,
        "children": text_nodes
    }
    if align:
        result["align"] = align
    if indent:
        result["indent"] = indent
    if first_line_indent is not None:
        result["firstLineIndent"] = first_line_indent
    
    return result


def parse_with_combined_approach(docx_bytes: bytes) -> Dict[str, Any]:
    """使用 docx2python + python-docx 组合解析 Word 文档
    
    优势:
    - docx2python: 提取图片、表格、文本（带占位符）
    - python-docx: 提取格式信息（字体、颜色、对齐等）
    """
    content: List[Dict[str, Any]] = []
    html_parts: List[str] = []
    all_fonts: set = set()
    
    with tempfile.TemporaryDirectory() as temp_dir:
        # 保存上传的文件
        temp_docx = os.path.join(temp_dir, 'document.docx')
        with open(temp_docx, 'wb') as f:
            f.write(docx_bytes)
        
        # 1. 使用 docx2python 提取图片和原始文本
        image_base64_map = {}
        docx2python_paragraphs = []
        
        if HAS_DOCX2PYTHON:
            try:
                d2p_result = docx2python(temp_docx, temp_dir)
                
                # 收集所有图片并转换为 base64
                media_dir = os.path.join(temp_dir, 'media')
                if os.path.exists(media_dir):
                    for img_file in os.listdir(media_dir):
                        img_path = os.path.join(media_dir, img_file)
                        with open(img_path, 'rb') as img:
                            base64_data = base64.b64encode(img.read()).decode('utf-8')
                            image_base64_map[img_file] = base64_data
                
                # 提取 docx2python 的段落文本
                for item in d2p_result.body:
                    if item and len(item) > 0:
                        first_item = item[0]
                        if isinstance(first_item, (list, tuple)):
                            texts = first_item if len(first_item) > 1 else [first_item[0]]
                            for para_text in texts:
                                text_str = str(para_text)
                                if text_str.strip() and text_str != '\n':
                                    docx2python_paragraphs.append(text_str)
            except Exception as e:
                print(f"docx2python 解析出错: {e}")
        
        # 2. 使用 python-docx 提取格式信息
        if not HAS_PYTHON_DOCX:
            raise HTTPException(500, detail="python-docx 库未安装")
        
        doc = Document(temp_docx)
        doc_defaults = get_document_default_fonts(doc)
        
        def has_page_break_in_para(para) -> bool:
            """检查段落是否包含分页符"""
            # 方法1: 检查所有 run 中的 br 元素
            for run in para.runs:
                for child in run._r:
                    if child.tag.endswith('br'):
                        br_type = child.get(qn('w:type'))
                        if br_type == 'page':
                            return True
            # 方法2: 检查段落属性中的 sectPr（分节符，通常伴随分页）
            pPr = para._p.find(qn('w:pPr'))
            if pPr is not None:
                sectPr = pPr.find(qn('w:sectPr'))
                if sectPr is not None:
                    return True
            return False
        
        # 遍历 python-docx 段落并处理
        para_idx = 0
        for para in doc.paragraphs:
            para_text = para.text.strip()
            
            # 检查是否是分页符（空段落或明确包含分页符的段落）
            is_page_break = has_page_break_in_para(para)
            
            if is_page_break or (not para_text and is_page_break):
                content.append(create_page_break_node())
                html_parts.append("<hr class='page-break' />")
                if not para_text:
                    continue
            
            # 获取 docx2python 对应的段落文本（包含图片占位符）
            d2p_text = docx2python_paragraphs[para_idx] if para_idx < len(docx2python_paragraphs) else para_text
            
            # 检查是否有图片占位符
            img_paths = extract_image_paths(d2p_text)
            
            if img_paths:
                # 先添加图片节点
                for img_path in img_paths:
                    img_filename = os.path.basename(img_path)
                    base64_data = image_base64_map.get(img_filename)
                    content.append(create_image_node(img_path, base64_data))
                    html_parts.append(f'<p>[图片: {img_path}]</p>')
                
                # 清理文本后的剩余文本
                cleaned_text = remove_image_placeholders(d2p_text)
                
                if cleaned_text:
                    node_type = detect_heading_level(cleaned_text)
                    node = parse_paragraph_with_formatting(para, doc, doc_defaults, node_type)
                    if node:
                        content.append(node)
                        align = node.get("align")
                        align_style = f"text-align: {align};" if align else ""
                        html_parts.append(f"<p style='{align_style}'>{cleaned_text}</p>")
            else:
                # 普通段落
                node_type = detect_heading_level(para_text)
                node = parse_paragraph_with_formatting(para, doc, doc_defaults, node_type)
                if node:
                    content.append(node)
                    align = node.get("align")
                    align_style = f"text-align: {align};" if align else ""
                    html_parts.append(f"<p style='{align_style}'>{para_text[:100]}</p>")
            
            para_idx += 1
        
        # 解析表格
        for table in doc.tables:
            table_rows = []
            for row in table.rows:
                cells = []
                for cell in row.cells:
                    cell_nodes = []
                    for cell_para in cell.paragraphs:
                        for run in cell_para.runs:
                            if run.text:
                                cell_nodes.append(parse_run_formatting(run, cell_para, doc, doc_defaults))
                    if not cell_nodes:
                        cell_nodes = [{"text": ""}]
                    
                    cells.append({
                        "type": "table-cell",
                        "children": [{"type": "paragraph", "children": cell_nodes}]
                    })
                table_rows.append({"type": "table-row", "children": cells})
            
            if table_rows:
                content.append({
                    "type": "table",
                    "children": table_rows
                })
                html_parts.append("<p>[表格]</p>")
        
        # 收集文档中使用的所有字体
        for para in doc.paragraphs:
            for run in para.runs:
                font_name = get_run_font_name(run, para, doc, doc_defaults)
                if font_name:
                    all_fonts.add(font_name)
    
    return {
        "content": content,
        "html": "\n".join(html_parts),
        "fonts": list(all_fonts)
    }


@router.post("/docx", response_model=ImportResponse)
async def import_docx(file: UploadFile = File(...)):
    """导入 Word 文档 (.docx)"""
    if not file.filename.endswith('.docx'):
        raise HTTPException(400, detail="只支持 .docx 格式")
    
    try:
        content_bytes = await file.read()
        
        if HAS_PYTHON_DOCX and HAS_DOCX2PYTHON:
            result = parse_with_combined_approach(content_bytes)
        elif HAS_PYTHON_DOCX:
            raise HTTPException(500, detail="需要 docx2python 库来处理图片")
        else:
            raise HTTPException(500, detail="没有可用的 Word 解析库")
        
        # 统计公式数量（包括 inline 公式和独立公式段落）
        formula_count = 0
        for node in result["content"]:
            if node.get("type") == "formula":
                formula_count += 1
            # 检查段落中的 inline 公式
            children = node.get("children", [])
            for child in children:
                if isinstance(child, dict) and child.get("type") == "formula-inline":
                    formula_count += 1
        
        # 统计对齐方式
        align_counts = {}
        for node in result["content"]:
            if "align" in node:
                align = node["align"]
                align_counts[align] = align_counts.get(align, 0) + 1
        
        stats = {
            "paragraphs": len([n for n in result["content"] if n.get("type") == "paragraph"]),
            "headings": len([n for n in result["content"] if n.get("type", "").startswith("heading-")]),
            "tables": len([n for n in result["content"] if n.get("type") == "table"]),
            "images": len([n for n in result["content"] if n.get("type") == "image"]),
            "page_breaks": len([n for n in result["content"] if n.get("type") == "page-break"]),
            "formulas": formula_count,
            "align_center": align_counts.get("center", 0),
            "align_right": align_counts.get("right", 0),
            "total": len(result["content"])
        }
        
        return ImportResponse(
            success=True,
            content=result["content"],
            html=result.get("html"),
            title=result.get("title") or file.filename.replace('.docx', ''),
            statistics=stats,
            fonts=result.get("fonts", [])
        )
    except Exception as e:
        raise HTTPException(500, detail=f"导入失败: {str(e)}")


@router.get("/formats")
async def get_supported_formats():
    """获取支持的导入格式"""
    return {
        "formats": [
            {
                "id": "docx",
                "name": "Word 文档",
                "extensions": [".docx"],
                "description": "Microsoft Word 2007+ 格式",
                "available": HAS_DOCX2PYTHON or HAS_PYTHON_DOCX
            }
        ],
        "libraries": {
            "docx2python": HAS_DOCX2PYTHON,
            "python-docx": HAS_PYTHON_DOCX
        }
    }
