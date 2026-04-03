#!/usr/bin/env python3
"""
Word 导入服务诊断工具
"""
import socket
import subprocess
import sys
import os

def check_port(port):
    """检查端口是否被占用"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', port))
    sock.close()
    return result == 0

def get_port_process(port):
    """获取占用端口的进程"""
    try:
        result = subprocess.run(['lsof', '-ti', f':{port}'], 
                              capture_output=True, text=True)
        pids = result.stdout.strip().split('\n')
        if pids and pids[0]:
            pid = pids[0]
            # 获取进程信息
            info = subprocess.run(['ps', '-p', pid, '-o', 'pid,command'],
                                capture_output=True, text=True)
            return info.stdout.strip()
    except:
        pass
    return None

def check_dependencies():
    """检查依赖"""
    deps = ['fastapi', 'uvicorn', 'docx', 'docx2python']
    missing = []
    
    for dep in deps:
        try:
            if dep == 'docx':
                __import__('docx')
            elif dep == 'docx2python':
                __import__('docx2python')
            else:
                __import__(dep)
        except ImportError:
            missing.append(dep)
    
    return missing

def main():
    print("=" * 50)
    print("Word 导入服务诊断")
    print("=" * 50)
    print()
    
    # 1. 检查端口
    print("1. 端口检查")
    port = 8000
    if check_port(port):
        print(f"   ⚠️  端口 {port} 已被占用")
        process = get_port_process(port)
        if process:
            print(f"   占用进程:\n{process}")
        print(f"\n   建议: 使用其他端口启动")
        print(f"   python start.py --port 8080")
    else:
        print(f"   ✅ 端口 {port} 可用")
    
    print()
    
    # 2. 检查依赖
    print("2. 依赖检查")
    missing = check_dependencies()
    if missing:
        print(f"   ❌ 缺少依赖: {', '.join(missing)}")
        print(f"   运行: pip install -r requirements.txt")
    else:
        print("   ✅ 所有依赖已安装")
    
    print()
    
    # 3. 检查服务
    print("3. 服务状态")
    for port in [8000, 8080]:
        if check_port(port):
            try:
                import urllib.request
                req = urllib.request.urlopen(f'http://localhost:{port}/health', timeout=2)
                data = req.read().decode()
                print(f"   ✅ 端口 {port} 有服务响应: {data}")
            except:
                print(f"   ⚠️  端口 {port} 有进程但无响应")
    
    print()
    print("=" * 50)
    print("启动命令:")
    print("   python start.py              # 默认端口 8000")
    print("   python start.py --port 8080  # 使用端口 8080")
    print("=" * 50)

if __name__ == "__main__":
    main()
