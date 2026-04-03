#!/usr/bin/env python3
"""
Word 导入服务启动脚本

使用方法:
    python start.py          # 默认在 8000 端口启动
    python start.py --port 8080  # 在指定端口启动

环境要求:
    - Python 3.8+
    - pip install -r requirements.txt
"""
import argparse
import sys
import os

# 检查依赖
try:
    import fastapi
    import uvicorn
    import docx
    import docx2python
except ImportError as e:
    print(f"❌ 缺少依赖: {e}")
    print("请先安装依赖: pip install -r requirements.txt")
    sys.exit(1)

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def main():
    parser = argparse.ArgumentParser(description='Word 导入服务')
    parser.add_argument('--port', type=int, default=8000, help='服务端口 (默认: 8000)')
    parser.add_argument('--host', type=str, default='0.0.0.0', help='绑定地址 (默认: 0.0.0.0)')
    parser.add_argument('--reload', action='store_true', help='开发模式: 代码变更自动重启')
    args = parser.parse_args()
    
    print(f"""
╔══════════════════════════════════════════════════════════╗
║           Word 导入服务 - FastAPI                        ║
╠══════════════════════════════════════════════════════════╣
║  API 文档: http://localhost:{args.port}/docs                   ║
║  健康检查: http://localhost:{args.port}/health                 ║
║  导入接口: POST http://localhost:{args.port}/api/import/docx   ║
╚══════════════════════════════════════════════════════════╝
    """)
    
    uvicorn.run(
        "app.main:app",
        host=args.host,
        port=args.port,
        reload=args.reload,
        log_level="info"
    )

if __name__ == "__main__":
    main()
