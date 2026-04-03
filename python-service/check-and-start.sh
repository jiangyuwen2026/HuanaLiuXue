#!/bin/bash
# 检查并启动 Word 导入服务

echo "=== Word 导入服务诊断工具 ==="
echo ""

# 检查端口占用
echo "1. 检查端口 8000 占用情况..."
PID_8000=$(lsof -ti:8000 2>/dev/null)
if [ -n "$PID_8000" ]; then
    echo "   ⚠️ 端口 8000 被占用 (PID: $PID_8000)"
    echo "   进程信息:"
    ps -p $PID_8000 -o pid,command | tail -1
    echo ""
    echo "   选项:"
    echo "   a) 使用其他端口启动 (推荐)"
    echo "   b) 停止占用进程并启动"
    echo "   c) 检查该服务是否可用"
    echo ""
    
    # 自动检查是否为 Word 导入服务
    if ps -p $PID_8000 -o command | grep -q "import_doc\|word.*import"; then
        echo "   ✅ 检测到 Word 导入服务已在运行!"
        echo ""
        echo "   测试服务..."
        curl -s http://localhost:8000/health 2>/dev/null && echo "   ✅ 服务正常" || echo "   ❌ 服务无响应"
        echo ""
        echo "   API 文档: http://localhost:8000/docs"
        exit 0
    fi
else
    echo "   ✅ 端口 8000 可用"
fi

echo ""
echo "2. 检查 Python 环境..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "   ✅ Python: $PYTHON_VERSION"
else
    echo "   ❌ 未找到 Python"
    exit 1
fi

echo ""
echo "3. 检查依赖..."
cd "$(dirname "$0")"
python3 -c "import fastapi, uvicorn, docx, docx2python" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ 所有依赖已安装"
else
    echo "   ⚠️ 缺少依赖，正在安装..."
    pip install -r requirements.txt
fi

echo ""
echo "4. 启动服务..."
echo "   方式 1: 默认端口 8000"
echo "   方式 2: 使用其他端口 (如 8080)"
echo ""

# 如果端口被占用，使用 8080
if [ -n "$PID_8000" ]; then
    PORT=8080
    echo "   端口 8000 被占用，使用端口 $PORT"
else
    PORT=8000
fi

echo ""
echo "   启动中... (端口: $PORT)"
python3 start.py --port $PORT &

sleep 2

echo ""
echo "5. 验证服务..."
if curl -s http://localhost:$PORT/health > /dev/null; then
    echo "   ✅ 服务启动成功!"
    echo ""
    echo "   ==============================="
    echo "   📚 API 文档: http://localhost:$PORT/docs"
    echo "   🔍 健康检查: http://localhost:$PORT/health"
    echo "   📤 导入接口: POST http://localhost:$PORT/api/import/docx"
    echo "   ==============================="
else
    echo "   ❌ 服务启动失败，检查日志:"
    tail -20 /tmp/uvicorn.log 2>/dev/null || echo "   无日志文件"
fi
