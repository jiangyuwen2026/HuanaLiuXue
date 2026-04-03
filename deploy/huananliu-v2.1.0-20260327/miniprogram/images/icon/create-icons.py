#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
图标生成脚本
使用 PIL 从 SVG 生成 PNG 图标
"""

from PIL import Image, ImageDraw, ImageFont
import os
import re

def create_colored_icon(width, height, color, icon_type):
    """
    创建简单的彩色图标占位符
    """
    # 创建透明背景的图片
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 解析颜色
    if color.startswith('#'):
        color = color[1:]
    r = int(color[0:2], 16)
    g = int(color[2:4], 16)
    b = int(color[4:6], 16)
    rgb = (r, g, b, 255)
    
    # 根据图标类型绘制简单的图标
    center = width // 2
    padding = width // 8
    
    if icon_type == 'home':
        # 房子图标
        # 屋顶
        points = [
            (padding, center),
            (center, padding),
            (width - padding, center)
        ]
        draw.polygon(points, fill=rgb, outline=rgb)
        # 房子主体
        draw.rectangle([padding + 4, center, width - padding - 4, height - padding], fill=rgb, outline=rgb)
        # 门
        door_width = width // 4
        draw.rectangle([center - door_width // 2, height - padding - door_width, center + door_width // 2, height - padding], fill=(255, 255, 255, 255))
    
    elif icon_type == 'news':
        # 新闻/文档图标
        corner_radius = 6
        draw.rounded_rectangle([padding, padding, width - padding, height - padding], corner_radius, fill=rgb, outline=rgb)
        # 文档线条
        line_padding = padding + 8
        line_height = 4
        line_spacing = 8
        for i in range(3):
            y = line_padding + i * (line_height + line_spacing)
            draw.rectangle([line_padding, y, width - line_padding, y + line_height], fill=(255, 255, 255, 255))
    
    elif icon_type == 'consult':
        # 聊天气泡图标
        corner_radius = 12
        draw.rounded_rectangle([padding, padding, width - padding, height - padding - 10], corner_radius, fill=rgb, outline=rgb)
        # 气泡尾巴
        tail_points = [
            (center + 10, height - padding - 10),
            (center + 20, height - padding),
            (center + 25, height - padding - 15)
        ]
        draw.polygon(tail_points, fill=rgb, outline=rgb)
        # 消息点
        dot_radius = 3
        dot_spacing = 12
        start_x = center - 12
        y = center
        for i in range(3):
            x = start_x + i * dot_spacing
            draw.ellipse([x - dot_radius, y - dot_radius, x + dot_radius, y + dot_radius], fill=(255, 255, 255, 255))
    
    elif icon_type == 'user':
        # 用户图标
        # 头
        head_radius = width // 5
        draw.ellipse([center - head_radius, center // 2 - head_radius, center + head_radius, center // 2 + head_radius], fill=rgb, outline=rgb)
        # 身体
        body_start_y = center // 2 + head_radius + 2
        draw.chord([padding, body_start_y, width - padding, height - padding], start=0, end=180, fill=rgb, outline=rgb)
        draw.rectangle([padding, body_start_y + (height - padding - body_start_y) // 2, width - padding, height - padding], fill=rgb, outline=rgb)
    
    elif icon_type == 'school':
        # 学校图标（带帽子的建筑）
        # 屋顶
        points = [
            (padding, center - 8),
            (center, padding),
            (width - padding, center - 8)
        ]
        draw.polygon(points, fill=rgb, outline=rgb)
        # 主体
        draw.rectangle([padding + 4, center - 8, width - padding - 4, height - padding], fill=rgb, outline=rgb)
        # 窗户
        window_size = 10
        window_y = center + 4
        draw.rectangle([center - 12, window_y, center - 12 + window_size, window_y + window_size], fill=(255, 255, 255, 255))
        draw.rectangle([center + 2, window_y, center + 2 + window_size, window_y + window_size], fill=(255, 255, 255, 255))
    
    elif icon_type == 'major':
        # 专业图标（书本）
        book_width = width - padding * 2
        book_height = height - padding * 2
        spine_width = 8
        
        # 书本封面
        draw.rounded_rectangle([padding, padding, width - padding, height - padding], 4, fill=rgb, outline=rgb)
        # 书脊
        draw.rectangle([center - spine_width // 2, padding, center + spine_width // 2, height - padding], fill=(r - 20, g - 20, b - 20, 255))
        # 书页线条
        for i in range(4):
            y = padding + 10 + i * 8
            line_width = 30
            draw.rectangle([center - 15, y, center - 15 + line_width, y + 2], fill=(255, 255, 255, 180))
    
    elif icon_type == 'guide':
        # 指导图标（文档）
        corner_radius = 6
        draw.rounded_rectangle([padding, padding, width - padding, height - padding], corner_radius, fill=rgb, outline=rgb)
        # 文档线条
        line_padding = padding + 10
        line_height = 3
        line_spacing = 7
        for i in range(4):
            y = line_padding + i * (line_height + line_spacing)
            draw.rectangle([line_padding, y, width - line_padding, y + line_height], fill=(255, 255, 255, 255))
    
    elif icon_type == 'consult2':
        # 搜索图标
        center_x = center - 5
        center_y = center - 5
        radius = width // 3
        draw.ellipse([center_x - radius, center_y - radius, center_x + radius, center_y + radius], outline=rgb, width=4)
        # 手柄
        handle_start_x = center_x + radius - 3
        handle_start_y = center_y + radius - 3
        handle_end_x = width - padding - 5
        handle_end_y = height - padding - 5
        draw.line([handle_start_x, handle_start_y, handle_end_x, handle_end_y], fill=rgb, width=4)
    
    elif icon_type == 'case':
        # 案例图标（文件夹+成功标记）
        # 文件夹主体
        draw.rounded_rectangle([padding, center - 8, width - padding, height - padding], 4, fill=rgb, outline=rgb)
        # 标签
        draw.rectangle([padding, center - 8, width // 3, center - 2], fill=(r - 20, g - 20, b - 20, 255))
        # 文档线
        for i in range(2):
            y = center + 6 + i * 10
            draw.rectangle([padding + 8, y, width - padding - 8, y + 3], fill=(255, 255, 255, 200))
        # 成功勾选标记
        check_center_x = width - padding - 12
        check_center_y = padding + 12
        check_radius = 8
        draw.ellipse([check_center_x - check_radius, check_center_y - check_radius, check_center_x + check_radius, check_center_y + check_radius], fill=(255, 255, 255, 255))
        # 勾号
        draw.line([check_center_x - 3, check_center_y, check_center_x - 1, check_center_y + 2], fill=rgb, width=2)
        draw.line([check_center_x - 1, check_center_y + 2, check_center_x + 3, check_center_y - 2], fill=rgb, width=2)
    
    elif icon_type == 'consultant':
        # 顾问图标（耳机）
        # 头带
        band_height = 16
        band_y = padding + 4
        draw.arc([center - 20, band_y, center + 20, band_y + band_height], start=0, end=180, fill=rgb, width=4)
        # 左耳罩
        left_ear_x = center - 22
        left_ear_y = band_y + band_height // 2
        draw.ellipse([left_ear_x - 8, left_ear_y - 12, left_ear_x + 8, left_ear_y + 12], fill=rgb, outline=rgb)
        # 右耳罩
        right_ear_x = center + 22
        right_ear_y = band_y + band_height // 2
        draw.ellipse([right_ear_x - 8, right_ear_y - 12, right_ear_x + 8, right_ear_y + 12], fill=rgb, outline=rgb)
        # 麦克风
        mic_x = right_ear_x + 12
        mic_y = right_ear_y + 8
        draw.line([right_ear_x + 8, right_ear_y + 4, mic_x, mic_y], fill=rgb, width=2)
        draw.ellipse([mic_x - 3, mic_y - 3, mic_x + 3, mic_y + 3], fill=rgb, outline=rgb)
    
    return img

def main():
    # 项目根目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    
    # TabBar 图标配置
    tabbar_icons = [
        {'name': 'home', 'type': 'home', 'color': '#999999', 'width': 81, 'height': 81},
        {'name': 'home-active', 'type': 'home', 'color': '#2C5F7C', 'width': 81, 'height': 81},
        {'name': 'news', 'type': 'news', 'color': '#999999', 'width': 81, 'height': 81},
        {'name': 'news-active', 'type': 'news', 'color': '#2C5F7C', 'width': 81, 'height': 81},
        {'name': 'consult', 'type': 'consult', 'color': '#999999', 'width': 81, 'height': 81},
        {'name': 'consult-active', 'type': 'consult', 'color': '#2C5F7C', 'width': 81, 'height': 81},
        {'name': 'user', 'type': 'user', 'color': '#999999', 'width': 81, 'height': 81},
        {'name': 'user-active', 'type': 'user', 'color': '#2C5F7C', 'width': 81, 'height': 81},
    ]
    
    # 功能图标配置
    function_icons = [
        {'name': 'school', 'type': 'school', 'color': '#2C5F7C', 'width': 96, 'height': 96},
        {'name': 'major', 'type': 'major', 'color': '#52C41A', 'width': 96, 'height': 96},
        {'name': 'guide', 'type': 'guide', 'color': '#FAAD14', 'width': 96, 'height': 96},
        {'name': 'consult2', 'type': 'consult2', 'color': '#FF4D4F', 'width': 96, 'height': 96},
        {'name': 'case', 'type': 'case', 'color': '#722ED1', 'width': 96, 'height': 96},
        {'name': 'consultant', 'type': 'consultant', 'color': '#EB2F96', 'width': 96, 'height': 96},
    ]
    
    # 生成 TabBar 图标
    print('🎨 生成 TabBar 图标...')
    tabbar_dir = os.path.join(project_root, 'images', 'tab')
    os.makedirs(tabbar_dir, exist_ok=True)
    
    for icon in tabbar_icons:
        img = create_colored_icon(icon['width'], icon['height'], icon['color'], icon['type'])
        filepath = os.path.join(tabbar_dir, f"{icon['name']}.png")
        img.save(filepath, 'PNG')
        print(f'  ✅ {icon["name"]}.png 已生成')
    
    # 生成功能图标
    print('\n🎯 生成功能图标...')
    function_dir = os.path.join(project_root, 'images', 'icon')
    os.makedirs(function_dir, exist_ok=True)
    
    for icon in function_icons:
        img = create_colored_icon(icon['width'], icon['height'], icon['color'], icon['type'])
        filepath = os.path.join(function_dir, f"{icon['name']}.png")
        img.save(filepath, 'PNG')
        print(f'  ✅ {icon["name"]}.png 已生成')
    
    print('\n✨ 所有图标生成完成！')
    print(f'\n📁 TabBar 图标位置: {tabbar_dir}')
    print(f'📁 功能图标位置: {function_dir}')

if __name__ == '__main__':
    main()
