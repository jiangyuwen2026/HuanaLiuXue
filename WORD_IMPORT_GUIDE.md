# Word 文档导入功能实现指南

## 功能概述

实现了完整的 Word 文档 (.docx) 导入功能，支持：

- ✅ **文本格式**: 粗体、斜体、下划线、字体、字号、颜色
- ✅ **段落格式**: 对齐方式、首行缩进、悬挂缩进
- ✅ **图片导入**: 自动提取并转为 base64
- ✅ **分页符**: 检测并显示分页标记
- ✅ **公式导入**: 提取 Word OMML 公式（显示为占位符）
- ✅ **表格导入**: 支持基本表格结构
- ✅ **标题识别**: 自动识别一级/二级/三级标题

## 项目结构

```
/Users/jiangyuwen/WorkBuddy/20260310085315/
├── python-service/              # Python FastAPI 后端
│   ├── app/
│   │   ├── api/
│   │   │   └── import_doc.py    # Word 导入核心逻辑
│   │   └── main.py              # FastAPI 主应用
│   ├── requirements.txt         # Python 依赖
│   └── start.py                 # 启动脚本
│
└── huananliu-web/
    └── frontend/
        └── admin/
            └── src/
                └── components/
                    └── editor/
                        ├── EditableContent.jsx      # 编辑器内容渲染
                        ├── FormulaRenderer.jsx      # 公式渲染组件
                        ├── WordImportButton.jsx     # 导入按钮组件
                        └── index.js                 # 组件导出
```

## 后端部署

### 1. 安装依赖

```bash
cd /Users/jiangyuwen/WorkBuddy/20260310085315/python-service
pip install -r requirements.txt
```

### 2. 启动服务

```bash
# 默认端口 8000
python start.py

# 指定端口
python start.py --port 8080

# 开发模式（自动重启）
python start.py --reload
```

### 3. API 接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/import/docx` | POST | 上传 Word 文档 |
| `/api/import/formats` | GET | 获取支持格式 |
| `/health` | GET | 健康检查 |

### 4. 返回数据结构

```json
{
  "success": true,
  "content": [
    {
      "type": "paragraph",
      "align": "center",
      "firstLineIndent": 2,
      "children": [
        { "text": "示例文本", "bold": true, "fontFamily": "SimSun" }
      ]
    }
  ],
  "statistics": {
    "paragraphs": 10,
    "headings": 2,
    "images": 3,
    "tables": 1,
    "page_breaks": 2,
    "formulas": 1
  },
  "fonts": ["宋体", "Times New Roman"]
}
```

## 前端集成

### 1. 导入组件

```jsx
import { WordImportButton, EditableContent } from './components/editor';

function MyEditor() {
  const [content, setContent] = useState([]);
  
  const handleImport = (importedContent) => {
    setContent(importedContent);
  };
  
  return (
    <div>
      <WordImportButton onImport={handleImport} />
      <EditableContent value={content} />
    </div>
  );
}
```

### 2. 与 ReactQuill 集成

要在 ReactQuill 中使用 Word 导入的内容，需要转换为 HTML:

```jsx
import { wordImportService } from './components/editor';

// 在 ReactQuill 中导入
const handleWordImport = async (file) => {
  const result = await wordImportService.importDocument(file);
  if (result.success) {
    // 使用 result.html 或转换 result.content
    quillRef.current.root.innerHTML = result.html;
  }
};
```

## 分页符处理

### 检测逻辑

```python
def has_page_break_in_para(para) -> bool:
    # 方法1: 检查 w:br w:type="page"
    for run in para.runs:
        for child in run._r:
            if child.tag.endswith('br'):
                br_type = child.get(qn('w:type'))
                if br_type == 'page':
                    return True
    
    # 方法2: 检查 w:sectPr（分节符）
    pPr = para._p.find(qn('w:pPr'))
    if pPr is not None:
        sectPr = pPr.find(qn('w:sectPr'))
        if sectPr is not None:
            return True
    return False
```

### 前端显示

```jsx
// EditableContent.jsx 中的分页符渲染
<div className="page-break">
  <div className="border-t-2 border-dashed border-gray-300" />
  <span className="page-break-label">分页符</span>
</div>
```

## 公式处理

### 公式提取

Word 使用 OMML (Office Math Markup Language) 存储公式:

```xml
<m:oMath xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math">
  <m:rad>
    <m:radPr>...</m:radPr>
    <m:deg><m:r><m:t>2</m:t></m:r></m:deg>
    <m:e><m:r><m:t>x</m:t></m:r></m:e>
  </m:rad>
</m:oMath>
```

### 当前实现

由于 OMML 到 MathML 的完整转换较为复杂，当前实现：

1. **提取 OMML XML**: 后端提取原始 OMML
2. **显示占位符**: 前端显示 `[公式]` 占位符
3. **预留扩展**: 结构支持后续接入 MathJax

### 扩展 MathJax 支持

如需完整渲染公式:

```jsx
// FormulaRenderer.jsx
// 设置 mode="mathjax"
<FormulaRenderer mathXml={mathXml} mode="mathjax" />
```

## 字体处理

### 继承链

Word 字体层级（从高到低）：

1. Run 级别 XML (`w:rFonts`)
2. Run 级别 API (`run.font.name`)
3. Paragraph Style (`para.style.font.name`)
4. docDefaults (`docDefaults.rPr.rFonts`)
5. 智能默认（中文→宋体，英文→Times New Roman）

### 中文字体支持

```python
def get_run_font_from_xml(run, doc_defaults):
    # 检测是否包含中文字符
    has_chinese = any('\u4e00' <= char <= '\u9fff' for char in text)
    
    if has_chinese:
        # 优先读取 eastAsia 属性
        eastAsia = rFonts.get(qn('w:eastAsia'))
        if eastAsia:
            return eastAsia
    
    # 英文使用 ascii 属性
    ascii_font = rFonts.get(qn('w:ascii'))
    if ascii_font:
        return ascii_font
```

## 缩进处理

### 单位转换

| Word 属性 | 单位 | 转换公式 |
|-----------|------|----------|
| `w:firstLineChars` | 1/100 字符 | `value / 100` |
| `w:firstLine` | twips (1/20 pt) | `value / 20 / 16` |
| `w:hangingChars` | 1/100 字符 | `value / 100` |
| `w:leftChars` | 1/100 字符 | `value / 100` |

### 悬挂缩进

```jsx
// 前端渲染
if (firstLineIndent === 0 && indent > 0) {
  style.paddingLeft = `${indent * 2}em`;
  style.textIndent = `-${indent * 2}em`;
}
```

## 常见问题

### 1. 服务无法启动

**问题**: `ModuleNotFoundError: No module named 'docx'`

**解决**:
```bash
pip install python-docx docx2python fastapi uvicorn
```

### 2. 分页符未检测到

**检查**: 使用 Word 的"布局"→"分隔符"→"分页符"插入的分页符才能被检测。

手动输入的换行符不会被识别为分页符。

### 3. 公式显示为 [公式]

**原因**: OMML 到 MathML 的转换需要复杂的解析。

**解决**: 如需完整渲染，可接入 MathJax 或 KaTeX 库。

### 4. 中文字体不正确

**检查**: 确保 Word 文档中的中文字体通过 `w:eastAsia` 属性设置。

## 后续优化

1. **公式渲染**: 集成 MathJax 实现 OMML→MathML→渲染
2. **样式表**: 支持更多 Word 样式（项目符号、编号等）
3. **性能优化**: 大文档分片处理
4. **图片上传**: 支持将图片上传到 CDN
5. **批处理**: 支持批量导入多个文档

## 测试

使用测试文档验证功能:

```bash
# 启动服务
python python-service/start.py

# 测试导入
curl -X POST -F "file=@test.docx" http://localhost:8000/api/import/docx
```
