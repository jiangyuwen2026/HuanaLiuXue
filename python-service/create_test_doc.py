#!/usr/bin/env python3
"""
创建测试 Word 文档

功能:
- 分页符
- 公式 (OMML)
- 图片
- 表格
- 不同字体
- 缩进
"""
import os
from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH

def create_test_document(output_path="test.docx"):
    doc = Document()
    
    # 1. 标题
    title = doc.add_heading('Word 导入测试文档', level=1)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    # 2. 普通段落
    para1 = doc.add_paragraph()
    para1.add_run('这是一个普通段落，用于测试文本导入。').bold = True
    para1.add_run(' 这是斜体文本。').italic = True
    
    # 3. 分页符
    doc.add_page_break()
    
    # 4. 第二页标题
    doc.add_heading('第二页 - 分页符测试', level=2)
    
    # 5. 首行缩进测试
    para2 = doc.add_paragraph()
    para2.paragraph_format.first_line_indent = Inches(0.5)
    para2.add_run('这是一个首行缩进的段落。在 Word 中，首行缩进通常用于正文段落的开头。这个段落用于测试导入时是否能正确识别和显示首行缩进格式。')
    
    # 6. 悬挂缩进测试
    para3 = doc.add_paragraph()
    para3.paragraph_format.left_indent = Inches(0.5)
    para3.paragraph_format.first_line_indent = Inches(-0.5)
    para3.add_run('这是一个悬挂缩进的段落。通常用于参考文献或列表项。第一行不缩进，后续行缩进。')
    
    # 7. 居中对齐
    para4 = doc.add_paragraph()
    para4.alignment = WD_ALIGN_PARAGRAPH.CENTER
    para4.add_run('这是居中对齐的文本').bold = True
    
    # 8. 分页符
    doc.add_page_break()
    
    # 9. 第三页 - 公式测试
    doc.add_heading('第三页 - 公式测试', level=2)
    
    para5 = doc.add_paragraph('以下是一个公式：')
    
    # 添加一个简单公式（使用 Word 的 OMML）
    # 注意: python-docx 不直接支持公式，这里用文本表示
    para6 = doc.add_paragraph()
    para6.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = para6.add_run('E = mc²')
    run.font.size = Pt(14)
    run.italic = True
    
    # 10. 表格
    doc.add_heading('表格测试', level=2)
    
    table = doc.add_table(rows=3, cols=3)
    table.style = 'Table Grid'
    
    # 表头
    hdr_cells = table.rows[0].cells
    hdr_cells[0].text = '姓名'
    hdr_cells[1].text = '年龄'
    hdr_cells[2].text = '城市'
    
    # 数据行
    row1_cells = table.rows[1].cells
    row1_cells[0].text = '张三'
    row1_cells[1].text = '25'
    row1_cells[2].text = '北京'
    
    row2_cells = table.rows[2].cells
    row2_cells[0].text = '李四'
    row2_cells[1].text = '30'
    row2_cells[2].text = '上海'
    
    # 11. 分页符
    doc.add_page_break()
    
    # 12. 第四页 - 字体测试
    doc.add_heading('第四页 - 字体测试', level=2)
    
    # 宋体
    para7 = doc.add_paragraph()
    run = para7.add_run('这是宋体文本 - 中文测试')
    run.font.name = '宋体'
    
    # 黑体
    para8 = doc.add_paragraph()
    run = para8.add_run('这是黑体文本 - 中文测试')
    run.font.name = '黑体'
    
    # Times New Roman
    para9 = doc.add_paragraph()
    run = para9.add_run('This is Times New Roman - English Test')
    run.font.name = 'Times New Roman'
    
    # 13. 分页符
    doc.add_page_break()
    
    # 14. 第五页 - 格式测试
    doc.add_heading('第五页 - 综合格式测试', level=2)
    
    para10 = doc.add_paragraph()
    para10.add_run('粗体').bold = True
    para10.add_run(' ')
    para10.add_run('斜体').italic = True
    para10.add_run(' ')
    para10.add_run('下划线').underline = True
    para10.add_run(' ')
    para10.add_run('删除线').font.strike = True
    para10.add_run(' ')
    run = para10.add_run('上标')
    run.font.superscript = True
    para10.add_run(' ')
    run = para10.add_run('下标')
    run.font.subscript = True
    
    # 保存文档
    doc.save(output_path)
    print(f"✅ 测试文档已创建: {os.path.abspath(output_path)}")
    return output_path

if __name__ == "__main__":
    create_test_document()
    print("\n文档内容:")
    print("- 标题 (居中)")
    print("- 普通段落 (粗体、斜体)")
    print("- 分页符 x 4")
    print("- 首行缩进段落")
    print("- 悬挂缩进段落")
    print("- 表格 (3x3)")
    print("- 不同字体 (宋体、黑体、Times New Roman)")
    print("- 上标、下标、删除线")
