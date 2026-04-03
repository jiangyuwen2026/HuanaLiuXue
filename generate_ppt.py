#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
华南留学项目介绍PPT生成器
面向留学渠道合作方
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor as RgbColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from lxml import etree

# 品牌色
PRIMARY = RgbColor(0x2C, 0x5F, 0x7C)      # 深海蓝
SECONDARY = RgbColor(0x3A, 0x7C, 0xA5)    # 科技蓝
ACCENT = RgbColor(0xE8, 0xB4, 0x6E)       # 点缀金
WHITE = RgbColor(0xFF, 0xFF, 0xFF)
DARK = RgbColor(0x1A, 0x2A, 0x3A)
GRAY = RgbColor(0x66, 0x66, 0x66)
LIGHT_BG = RgbColor(0xF5, 0xF7, 0xFA)

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

def add_title_shape(slide, text, left, top, width, height, font_size=44, bold=True, color=DARK, align=PP_ALIGN.LEFT):
    shape = slide.shapes.add_textbox(left, top, width, height)
    tf = shape.text_frame
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(font_size)
    p.font.bold = bold
    p.font.color.rgb = color
    p.font.name = "Microsoft YaHei"
    p.alignment = align
    return shape

def add_body_text(slide, text, left, top, width, height, font_size=18, color=GRAY, align=PP_ALIGN.LEFT, line_space=1.5):
    shape = slide.shapes.add_textbox(left, top, width, height)
    tf = shape.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(font_size)
    p.font.color.rgb = color
    p.font.name = "Microsoft YaHei"
    p.alignment = align
    p.line_rule = True
    p.space_before = Pt(0)
    p.space_after = Pt(8)
    return shape

def add_bullet_text(slide, items, left, top, width, height, font_size=18, color=DARK):
    shape = slide.shapes.add_textbox(left, top, width, height)
    tf = shape.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.text = f"• {item}"
        p.font.size = Pt(font_size)
        p.font.color.rgb = color
        p.font.name = "Microsoft YaHei"
        p.space_after = Pt(12)
    return shape

def add_rect(slide, left, top, width, height, color):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()
    # 移到最底层
    spTree = slide.shapes._spTree
    sp = shape._element
    spTree.remove(sp)
    spTree.insert(2, sp)
    return shape

def add_number_card(slide, number, label, left, top, width, height):
    # 背景卡片
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = WHITE
    card.line.color.rgb = PRIMARY
    card.line.width = Pt(1)
    
    # 数字
    add_title_shape(slide, number, left, top + Inches(0.25), width, Inches(0.9), font_size=36, bold=True, color=PRIMARY, align=PP_ALIGN.CENTER)
    # 标签
    add_body_text(slide, label, left, top + Inches(1.05), width, Inches(0.5), font_size=14, color=GRAY, align=PP_ALIGN.CENTER)

# ==================== 第1页：封面 ====================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_rect(slide, Inches(0), Inches(0), Inches(13.333), Inches(7.5), PRIMARY)
# 装饰条
add_rect(slide, Inches(0), Inches(5.8), Inches(13.333), Inches(0.08), ACCENT)
# 主标题
add_title_shape(slide, "华南留学", Inches(0.8), Inches(2.2), Inches(12), Inches(1), font_size=60, bold=True, color=WHITE, align=PP_ALIGN.LEFT)
add_title_shape(slide, "项目合作介绍", Inches(0.8), Inches(3.1), Inches(12), Inches(0.8), font_size=48, bold=False, color=WHITE, align=PP_ALIGN.LEFT)
# 副标题
add_body_text(slide, "专注港澳新留学 · 专业顾问团队 · 数字化服务平台", Inches(0.8), Inches(4.2), Inches(10), Inches(0.6), font_size=20, color=RgbColor(0xCC, 0xDD, 0xEE), align=PP_ALIGN.LEFT)
# 底部信息
add_body_text(slide, "2026年4月", Inches(0.8), Inches(6.2), Inches(4), Inches(0.5), font_size=16, color=WHITE, align=PP_ALIGN.LEFT)

# ==================== 第2页：关于华南留学 ====================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_rect(slide, Inches(0), Inches(0), Inches(0.15), Inches(7.5), PRIMARY)
add_title_shape(slide, "关于华南留学", Inches(0.6), Inches(0.5), Inches(12), Inches(0.9), font_size=40, bold=True, color=DARK)
add_rect(slide, Inches(0.6), Inches(1.3), Inches(1.8), Inches(0.06), ACCENT)

content = """华南留学是一家专注于香港、澳门、新加坡地区留学服务的专业机构，致力于为学生提供从规划到录取的一站式留学解决方案。

我们通过自研的数字化平台（官网 + 管理后台 + 小程序），整合院校资源、顾问服务和案例数据，打造高效的留学服务生态。

对于渠道合作伙伴，我们提供：透明的合作机制、专业的顾问支持、丰富的院校资源、以及可追踪的服务流程。"""
add_body_text(slide, content, Inches(0.6), Inches(1.7), Inches(7), Inches(3.5), font_size=20, color=DARK, line_space=1.6)

# 右侧关键词
keywords = ["港澳新专注", "数字化平台", "全链路服务", "渠道赋能"]
for i, kw in enumerate(keywords):
    y = Inches(1.7 + i * 1.1)
    add_rect(slide, Inches(8.2), y, Inches(4.2), Inches(0.85), LIGHT_BG)
    add_body_text(slide, kw, Inches(8.4), y + Inches(0.22), Inches(3.8), Inches(0.5), font_size=22, color=PRIMARY, align=PP_ALIGN.LEFT)

# ==================== 第3页：核心资源优势 - 院校网络 ====================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_rect(slide, Inches(0), Inches(0), Inches(0.15), Inches(7.5), PRIMARY)
add_title_shape(slide, "核心资源：覆盖港澳新的优质院校网络", Inches(0.6), Inches(0.5), Inches(12), Inches(0.9), font_size=36, bold=True, color=DARK)
add_rect(slide, Inches(0.6), Inches(1.3), Inches(1.8), Inches(0.06), ACCENT)

# 数据卡片
add_number_card(slide, "26+", "合作院校", Inches(0.6), Inches(1.8), Inches(2.6), Inches(1.6))
add_number_card(slide, "6", "香港名校", Inches(3.5), Inches(1.8), Inches(2.6), Inches(1.6))
add_number_card(slide, "6", "澳门高校", Inches(6.4), Inches(1.8), Inches(2.6), Inches(1.6))
add_number_card(slide, "4+", "新加坡名校", Inches(9.3), Inches(1.8), Inches(2.6), Inches(1.6))

# 院校列表
schools_hk = ["香港大学", "香港中文大学", "香港科技大学", "香港城市大学", "香港理工大学", "香港浸会大学"]
schools_mo = ["澳门大学", "澳门理工大学", "澳门科技大学", "澳门城市大学", "澳门旅游大学", "澳门镜湖护理学院"]
schools_sg = ["新加坡国立大学", "南洋理工大学", "新加坡管理大学", "新加坡科技设计大学"]

add_body_text(slide, "香港地区", Inches(0.6), Inches(3.8), Inches(3.8), Inches(0.5), font_size=16, color=PRIMARY, align=PP_ALIGN.LEFT)
add_bullet_text(slide, schools_hk, Inches(0.6), Inches(4.2), Inches(3.8), Inches(2.8), font_size=15, color=DARK)

add_body_text(slide, "澳门地区", Inches(4.8), Inches(3.8), Inches(3.8), Inches(0.5), font_size=16, color=PRIMARY, align=PP_ALIGN.LEFT)
add_bullet_text(slide, schools_mo, Inches(4.8), Inches(4.2), Inches(3.8), Inches(2.8), font_size=15, color=DARK)

add_body_text(slide, "新加坡地区", Inches(9.0), Inches(3.8), Inches(3.8), Inches(0.5), font_size=16, color=PRIMARY, align=PP_ALIGN.LEFT)
add_bullet_text(slide, schools_sg, Inches(9.0), Inches(4.2), Inches(3.8), Inches(2.8), font_size=15, color=DARK)

# ==================== 第4页：核心资源优势 - 顾问团队 ====================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_rect(slide, Inches(0), Inches(0), Inches(0.15), Inches(7.5), PRIMARY)
add_title_shape(slide, "核心资源：资深顾问团队", Inches(0.6), Inches(0.5), Inches(12), Inches(0.9), font_size=36, bold=True, color=DARK)
add_rect(slide, Inches(0.6), Inches(1.3), Inches(1.8), Inches(0.06), ACCENT)

# 顶部统计
add_number_card(slide, "6", "全职顾问", Inches(0.6), Inches(1.7), Inches(2.8), Inches(1.4))
add_number_card(slide, "2128+", "累计服务案例", Inches(3.8), Inches(1.7), Inches(2.8), Inches(1.4))
add_number_card(slide, "10年+", "平均从业经验", Inches(7.0), Inches(1.7), Inches(2.8), Inches(1.4))
add_number_card(slide, "100%", "顾问资质认证", Inches(10.2), Inches(1.7), Inches(2.3), Inches(1.4))

consultants = [
    ("ADA", "留学规划总监", "15年经验 | 620个案例"),
    ("Vic", "资深留学规划师", "12年经验 | 486个案例"),
    ("Simon", "博士申请专家", "10年经验 | 256个案例"),
    ("Summer", "高级留学顾问", "8年经验 | 328个案例"),
    ("Gigi", "艺术留学顾问", "7年经验 | 30个案例"),
    ("Shawn", "语言培训主管", "6年经验 | 412个案例"),
]

cols_x = [0.6, 4.6, 8.6]
for i, (name, title, desc) in enumerate(consultants):
    col = i % 3
    row = i // 3
    x = Inches(cols_x[col])
    y = Inches(3.4 + row * 1.8)
    # 卡片背景
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(3.6), Inches(1.55))
    card.fill.solid()
    card.fill.fore_color.rgb = LIGHT_BG
    card.line.fill.background()
    # 名字
    add_title_shape(slide, name, x + Inches(0.2), y + Inches(0.15), Inches(3.2), Inches(0.5), font_size=22, bold=True, color=PRIMARY)
    # 职位
    add_body_text(slide, title, x + Inches(0.2), y + Inches(0.6), Inches(3.2), Inches(0.4), font_size=15, color=DARK)
    # 描述
    add_body_text(slide, desc, x + Inches(0.2), y + Inches(0.95), Inches(3.2), Inches(0.5), font_size=13, color=GRAY)

# ==================== 第5页：服务体系 ====================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_rect(slide, Inches(0), Inches(0), Inches(0.15), Inches(7.5), PRIMARY)
add_title_shape(slide, "全流程服务体系", Inches(0.6), Inches(0.5), Inches(12), Inches(0.9), font_size=36, bold=True, color=DARK)
add_rect(slide, Inches(0.6), Inches(1.3), Inches(1.8), Inches(0.06), ACCENT)

services = [
    ("1", "留学评估", "免费背景评估，定制留学方案"),
    ("2", "院校规划", "精准匹配目标院校与专业"),
    ("3", "申请指导", "文书打磨、材料准备、流程跟进"),
    ("4", "面试辅导", "模拟面试、技巧培训、心态调整"),
    ("5", "签证服务", "签证材料审核、递签指导"),
    ("6", "行前准备", "住宿安排、入学指导、校友对接"),
]

for i, (num, title, desc) in enumerate(services):
    col = i % 3
    row = i // 3
    x = Inches(0.6 + col * 4.2)
    y = Inches(1.8 + row * 2.6)
    # 圆圈编号
    circle = slide.shapes.add_shape(MSO_SHAPE.OVAL, x, y, Inches(0.7), Inches(0.7))
    circle.fill.solid()
    circle.fill.fore_color.rgb = PRIMARY
    circle.line.fill.background()
    add_title_shape(slide, num, x, y + Inches(0.08), Inches(0.7), Inches(0.5), font_size=24, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    # 标题
    add_title_shape(slide, title, x + Inches(0.9), y, Inches(3.0), Inches(0.5), font_size=22, bold=True, color=DARK)
    # 描述
    add_body_text(slide, desc, x + Inches(0.9), y + Inches(0.55), Inches(3.0), Inches(0.8), font_size=16, color=GRAY)
    # 连接线（除最后一个）
    if i < 5 and col < 2:
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x + Inches(3.6), y + Inches(0.3), Inches(0.5), Inches(0.04))
        line.fill.solid()
        line.fill.fore_color.rgb = ACCENT
        line.line.fill.background()

# ==================== 第6页：成功案例 ====================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_rect(slide, Inches(0), Inches(0), Inches(0.15), Inches(7.5), PRIMARY)
add_title_shape(slide, "真实录取案例（部分展示）", Inches(0.6), Inches(0.5), Inches(12), Inches(0.9), font_size=36, bold=True, color=DARK)
add_rect(slide, Inches(0.6), Inches(1.3), Inches(1.8), Inches(0.06), ACCENT)

cases = [
    ("刘同学", "数学", "牛津大学 数学本科"),
    ("陈同学", "计算机科学", "帝国理工学院 计算机本科"),
    ("黄同学", "金融学", "香港中文大学 金融学硕士"),
    ("周同学", "教育学", "香港大学 教育学硕士"),
    ("赵同学", "物理学", "剑桥大学 物理学博士"),
]

for i, (name, major, result) in enumerate(cases):
    y = Inches(1.7 + i * 1.05)
    # 左侧条
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), y, Inches(0.08), Inches(0.85))
    bar.fill.solid()
    bar.fill.fore_color.rgb = PRIMARY
    bar.line.fill.background()
    # 姓名
    add_title_shape(slide, name, Inches(0.9), y + Inches(0.08), Inches(1.5), Inches(0.5), font_size=20, bold=True, color=DARK)
    # 专业
    add_body_text(slide, major, Inches(2.6), y + Inches(0.15), Inches(2.5), Inches(0.5), font_size=16, color=GRAY)
    # 箭头
    arrow = slide.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, Inches(5.3), y + Inches(0.25), Inches(0.6), Inches(0.35))
    arrow.fill.solid()
    arrow.fill.fore_color.rgb = ACCENT
    arrow.line.fill.background()
    # 录取结果
    add_body_text(slide, result, Inches(6.1), y + Inches(0.08), Inches(6.5), Inches(0.6), font_size=18, color=PRIMARY)

# 底部统计
add_rect(slide, Inches(0.6), Inches(6.2), Inches(12), Inches(0.9), LIGHT_BG)
add_body_text(slide, "累计服务案例 2,128+  |  本科录取率 92%  |  硕士录取率 96%  |  博士录取率 88%", Inches(0.8), Inches(6.4), Inches(11.5), Inches(0.5), font_size=18, color=DARK, align=PP_ALIGN.CENTER)

# ==================== 第7页：数字化平台能力 ====================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_rect(slide, Inches(0), Inches(0), Inches(0.15), Inches(7.5), PRIMARY)
add_title_shape(slide, "数字化平台：官网 + 后台 + 小程序", Inches(0.6), Inches(0.5), Inches(12), Inches(0.9), font_size=36, bold=True, color=DARK)
add_rect(slide, Inches(0.6), Inches(1.3), Inches(1.8), Inches(0.06), ACCENT)

platforms = [
    ("官网前端", "品牌展示、院校查询、在线咨询、案例展示", "React 18 + TailwindCSS + Vite"),
    ("管理后台", "内容管理、客户跟进、数据统计、渠道协作", "React 18 + Ant Design + Vite"),
    ("后端 API", "RESTful 接口、JWT 认证、文件上传、数据同步", "Node.js + Express + Sequelize + MySQL"),
    ("微信小程序", "移动端服务、预约咨询、智能客服", "微信小程序原生开发"),
]

for i, (name, func, tech) in enumerate(platforms):
    y = Inches(1.7 + i * 1.35)
    # 左侧色块
    block = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), y, Inches(2.2), Inches(1.1))
    block.fill.solid()
    block.fill.fore_color.rgb = PRIMARY
    block.line.fill.background()
    add_body_text(slide, name, Inches(0.6), y + Inches(0.35), Inches(2.2), Inches(0.5), font_size=18, color=WHITE, align=PP_ALIGN.CENTER)
    # 功能描述
    add_body_text(slide, func, Inches(3.1), y + Inches(0.15), Inches(5.5), Inches(0.5), font_size=17, color=DARK)
    # 技术栈
    add_body_text(slide, tech, Inches(3.1), y + Inches(0.65), Inches(5.5), Inches(0.5), font_size=14, color=GRAY)
    # 右侧价值标签
    tags = ["高效", "稳定", "可扩展"]
    tag_color = [RgbColor(0xE8, 0xF4, 0xF8), RgbColor(0xF0, 0xF8, 0xF0), RgbColor(0xFF, 0xF5, 0xE6)]
    tag_text = [PRIMARY, RgbColor(0x2E, 0x7D, 0x32), RgbColor(0xE6, 0x5C, 0x00)]
    for j, (t, tc, tt) in enumerate(zip(tags, tag_color, tag_text)):
        tx = Inches(9.0 + j * 1.4)
        tag_shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, tx, y + Inches(0.3), Inches(1.25), Inches(0.5))
        tag_shape.fill.solid()
        tag_shape.fill.fore_color.rgb = tc
        tag_shape.line.fill.background()
        add_body_text(slide, t, tx, y + Inches(0.35), Inches(1.25), Inches(0.4), font_size=13, color=tt, align=PP_ALIGN.CENTER)

# ==================== 第8页：渠道合作价值 ====================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_rect(slide, Inches(0), Inches(0), Inches(0.15), Inches(7.5), PRIMARY)
add_title_shape(slide, "为什么选择华南留学作为合作伙伴？", Inches(0.6), Inches(0.5), Inches(12), Inches(0.9), font_size=34, bold=True, color=DARK)
add_rect(slide, Inches(0.6), Inches(1.3), Inches(1.8), Inches(0.06), ACCENT)

values = [
    ("🎓", "院校资源丰富", "覆盖港澳新 26+ 所优质院校，满足不同层次学生的申请需求，渠道获客更有底气。"),
    ("👔", "顾问专业可靠", "6 位全职资深顾问，平均从业 10 年+，累计服务 2,128+ 案例，转化率高、口碑好。"),
    ("💻", "平台支撑高效", "自研数字化平台实现全流程在线化管理，渠道可实时查看进度，协作透明高效。"),
    ("📊", "案例数据真实", "真实录取案例库持续更新，渠道可直接引用，增强客户信任，提升成交转化率。"),
    ("🤝", "合作机制灵活", "支持多种合作模式，分润透明、结算及时， dedicated 渠道经理一对一服务。"),
]

for i, (icon, title, desc) in enumerate(values):
    y = Inches(1.7 + i * 1.08)
    # 图标背景
    icon_bg = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(0.6), y, Inches(0.7), Inches(0.7))
    icon_bg.fill.solid()
    icon_bg.fill.fore_color.rgb = PRIMARY
    icon_bg.line.fill.background()
    add_title_shape(slide, icon, Inches(0.6), y + Inches(0.08), Inches(0.7), Inches(0.5), font_size=22, bold=False, color=WHITE, align=PP_ALIGN.CENTER)
    # 标题
    add_title_shape(slide, title, Inches(1.5), y + Inches(0.05), Inches(3.2), Inches(0.5), font_size=20, bold=True, color=DARK)
    # 描述
    add_body_text(slide, desc, Inches(1.5), y + Inches(0.55), Inches(10.8), Inches(0.5), font_size=16, color=GRAY)

# ==================== 第9页：合作支持体系 ====================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_rect(slide, Inches(0), Inches(0), Inches(0.15), Inches(7.5), PRIMARY)
add_title_shape(slide, "我们为渠道合作伙伴提供什么支持？", Inches(0.6), Inches(0.5), Inches(12), Inches(0.9), font_size=34, bold=True, color=DARK)
add_rect(slide, Inches(0.6), Inches(1.3), Inches(1.8), Inches(0.06), ACCENT)

supports = [
    ("品牌物料支持", "提供官方宣传册、院校介绍PPT、案例海报、电子海报等标准化物料。"),
    ("培训赋能支持", "定期开展院校政策解读、申请技巧培训、销售话术培训，提升渠道专业能力。"),
    ("系统工具支持", "开放管理后台查询权限，支持线索录入、进度追踪、数据统计。"),
    ("专属顾问支持", "每个合作渠道配备专属顾问，7×12小时响应咨询，协助复杂案例处理。"),
    ("市场推广支持", "联合举办线上线下活动，提供流量扶持和区域品牌曝光资源。"),
]

for i, (title, desc) in enumerate(supports):
    row = i // 2
    col = i % 2
    x = Inches(0.6 + col * 6.3)
    y = Inches(1.7 + row * 2.6)
    # 卡片
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.9), Inches(2.2))
    card.fill.solid()
    card.fill.fore_color.rgb = WHITE
    card.line.color.rgb = RgbColor(0xDD, 0xDD, 0xDD)
    card.line.width = Pt(1)
    # 序号
    num = slide.shapes.add_shape(MSO_SHAPE.OVAL, x + Inches(0.3), y + Inches(0.3), Inches(0.5), Inches(0.5))
    num.fill.solid()
    num.fill.fore_color.rgb = ACCENT
    num.line.fill.background()
    add_title_shape(slide, str(i+1), x + Inches(0.3), y + Inches(0.35), Inches(0.5), Inches(0.4), font_size=18, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    # 标题
    add_title_shape(slide, title, x + Inches(1.0), y + Inches(0.25), Inches(4.6), Inches(0.5), font_size=20, bold=True, color=DARK)
    # 描述
    add_body_text(slide, desc, x + Inches(0.3), y + Inches(0.9), Inches(5.3), Inches(1.2), font_size=16, color=GRAY, line_space=1.5)

# ==================== 第10页：合作模式 ====================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_rect(slide, Inches(0), Inches(0), Inches(0.15), Inches(7.5), PRIMARY)
add_title_shape(slide, "灵活的合作模式", Inches(0.6), Inches(0.5), Inches(12), Inches(0.9), font_size=36, bold=True, color=DARK)
add_rect(slide, Inches(0.6), Inches(1.3), Inches(1.8), Inches(0.06), ACCENT)

models = [
    ("推荐返佣模式", "渠道推荐潜在客户，成功签约后按合同金额比例返佣。\n\n适合：教培机构、国际学校、自媒体等拥有学生资源的渠道。"),
    ("联合服务模式", "渠道负责前端获客，华南留学负责后端申请服务，双方联合品牌输出。\n\n适合：地方留学中介、教育咨询公司等希望提升服务能力的渠道。"),
    ("区域独家代理", "授予特定区域的独家合作权，享受更优的分成比例和市场保护政策。\n\n适合：有一定规模和团队的地方教育服务商。"),
]

for i, (title, desc) in enumerate(models):
    y = Inches(1.7 + i * 1.8)
    # 左侧色条
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), y, Inches(0.12), Inches(1.55))
    bar.fill.solid()
    bar.fill.fore_color.rgb = PRIMARY
    bar.line.fill.background()
    # 标题
    add_title_shape(slide, title, Inches(0.9), y + Inches(0.1), Inches(11.5), Inches(0.5), font_size=22, bold=True, color=PRIMARY)
    # 描述
    add_body_text(slide, desc, Inches(0.9), y + Inches(0.65), Inches(11.5), Inches(1.0), font_size=17, color=DARK, line_space=1.5)

# ==================== 第11页：尾页 ====================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_rect(slide, Inches(0), Inches(0), Inches(13.333), Inches(7.5), PRIMARY)
add_rect(slide, Inches(0), Inches(3.7), Inches(13.333), Inches(0.08), ACCENT)

add_title_shape(slide, "期待与您携手合作", Inches(0), Inches(2.4), Inches(13.333), Inches(1), font_size=48, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
add_body_text(slide, "华南留学 · 专业留学服务，助您圆梦名校", Inches(0), Inches(3.5), Inches(13.333), Inches(0.6), font_size=22, color=RgbColor(0xCC, 0xDD, 0xEE), align=PP_ALIGN.CENTER)

contact_info = """电话：400-888-8888
邮箱：contact@hnliuxue.com
地址：广州市天河区珠江新城富力盈隆广场9层
网址：www.hnliuxue.com"""
add_body_text(slide, contact_info, Inches(0), Inches(4.5), Inches(13.333), Inches(2.0), font_size=20, color=WHITE, align=PP_ALIGN.CENTER, line_space=1.8)

# 保存
output_path = "/Users/jiangyuwen/WorkBuddy/20260310085315/华南留学项目介绍_渠道合作版.pptx"
prs.save(output_path)
print(f"✅ PPT 已生成：{output_path}")
print(f"📊 总页数：{len(prs.slides)} 页")
