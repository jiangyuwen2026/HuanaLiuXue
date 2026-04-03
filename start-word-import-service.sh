#!/bin/bash
# Word 导入服务启动脚本

set -e

cd "$(dirname "$0")/python-service"

echo "=========================================="
echo "  Word 导入服务启动工具"
echo "=========================================="
echo ""

# 检查 uv
if ! command -v uv &> /dev/null; then
    echo "❌ 需要安装 uv"
    echo "   安装: curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

# 创建虚拟环境（如果不存在）
if [ ! -d ".venv" ]; then
    echo "📦 创建虚拟环境..."
    uv venv
fi

# 激活虚拟环境
source .venv/bin/activate

# 检查依赖
if ! python -c "import fastapi, docx, docx2python" 2>/dev/null; then
    echo "📦 安装依赖..."
    uv pip install -r requirements.txt
fi

echo ""
echo "🚀 启动服务..."
echo ""
echo "=========================================="
echo "  服务信息:"
echo "  - 端口: 8080 (避免与 8000 冲突)"
echo "  - API 文档: http://localhost:8080/docs"
echo "  - 健康检查: http://localhost:8080/health"
echo "=========================================="
echo ""

# 启动服务
python start.py --port 8080
