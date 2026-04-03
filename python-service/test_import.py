#!/usr/bin/env python3
"""
Word 导入功能测试脚本

用法:
    python test_import.py test.docx
    python test_import.py --create  # 创建测试文档并测试
"""
import argparse
import json
import sys
import os

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_import(file_path):
    """测试导入功能"""
    try:
        from app.api.import_doc import parse_with_combined_approach
        
        print(f"📄 正在导入: {file_path}")
        
        with open(file_path, 'rb') as f:
            content_bytes = f.read()
        
        result = parse_with_combined_approach(content_bytes)
        
        print("\n✅ 导入成功!")
        print(f"\n📊 统计信息:")
        
        # 统计
        stats = {
            "paragraphs": len([n for n in result["content"] if n.get("type") == "paragraph"]),
            "headings": len([n for n in result["content"] if n.get("type", "").startswith("heading-")]),
            "tables": len([n for n in result["content"] if n.get("type") == "table"]),
            "images": len([n for n in result["content"] if n.get("type") == "image"]),
            "page_breaks": len([n for n in result["content"] if n.get("type") == "page-break"]),
            "formulas": 0,
            "total": len(result["content"])
        }
        
        # 统计公式
        for node in result["content"]:
            if node.get("type") == "formula":
                stats["formulas"] += 1
            children = node.get("children", [])
            for child in children:
                if isinstance(child, dict) and child.get("type") == "formula-inline":
                    stats["formulas"] += 1
        
        print(f"  段落: {stats['paragraphs']}")
        print(f"  标题: {stats['headings']}")
        print(f"  表格: {stats['tables']}")
        print(f"  图片: {stats['images']}")
        print(f"  分页符: {stats['page_breaks']}")
        print(f"  公式: {stats['formulas']}")
        print(f"  总计: {stats['total']}")
        
        if result.get("fonts"):
            print(f"\n📝 检测到的字体:")
            for font in result["fonts"]:
                print(f"  - {font}")
        
        print(f"\n📄 内容预览 (前3个节点):")
        for i, node in enumerate(result["content"][:3]):
            print(f"\n  节点 {i+1}:")
            print(f"    类型: {node.get('type')}")
            if 'align' in node:
                print(f"    对齐: {node['align']}")
            if 'firstLineIndent' in node:
                print(f"    首行缩进: {node['firstLineIndent']}")
            if 'indent' in node:
                print(f"    缩进: {node['indent']}")
            if 'children' in node:
                children_preview = str(node['children'])[:100]
                print(f"    子节点: {children_preview}...")
        
        # 保存完整结果到文件
        output_file = "test_result.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        print(f"\n💾 完整结果已保存到: {output_file}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ 导入失败: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    parser = argparse.ArgumentParser(description='Word 导入测试')
    parser.add_argument('file', nargs='?', help='要导入的 Word 文件')
    parser.add_argument('--create', action='store_true', help='创建测试文档并测试')
    args = parser.parse_args()
    
    if args.create:
        print("📝 创建测试文档...")
        from create_test_doc import create_test_document
        test_file = create_test_document()
        print()
        test_import(test_file)
    elif args.file:
        if not os.path.exists(args.file):
            print(f"❌ 文件不存在: {args.file}")
            sys.exit(1)
        test_import(args.file)
    else:
        parser.print_help()
        print("\n示例:")
        print("  python test_import.py document.docx")
        print("  python test_import.py --create")

if __name__ == "__main__":
    main()
