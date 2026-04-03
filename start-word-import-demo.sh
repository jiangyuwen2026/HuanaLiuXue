#!/bin/bash
# Word 导入功能演示启动脚本

echo "======================================"
echo "  Word 导入功能 - 启动工具"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Word 导入服务
check_word_service() {
    if curl -s http://localhost:8081/health > /dev/null; then
        return 0
    else
        return 1
    fi
}

# 检查前端服务
check_frontend() {
    if curl -s http://localhost:3002 > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

echo "1. 检查 Word 导入服务..."
if check_word_service; then
    echo -e "${GREEN}✓${NC} Word 导入服务已运行 (端口: 8081)"
else
    echo -e "${YELLOW}!${NC} Word 导入服务未运行，正在启动..."
    cd "$(dirname "$0")/python-service"
    source .venv/bin/activate
    python start.py --port 8081 > /tmp/word_service.log 2>&1 &
    sleep 3
    if check_word_service; then
        echo -e "${GREEN}✓${NC} Word 导入服务启动成功"
    else
        echo -e "${YELLOW}!${NC} Word 导入服务启动失败，查看日志: tail -f /tmp/word_service.log"
    fi
fi

echo ""
echo "2. 检查前端服务..."
if check_frontend; then
    echo -e "${GREEN}✓${NC} 前端服务已运行 (端口: 3002)"
else
    echo -e "${YELLOW}!${NC} 前端服务未运行"
    echo ""
    echo "启动前端服务:"
    echo "  cd /Users/jiangyuwen/WorkBuddy/20260310085315/huananliu-web/frontend/admin"
    echo "  npm run dev"
    echo ""
fi

echo ""
echo "======================================"
echo "  服务状态:"
echo "======================================"

if check_word_service; then
    echo -e "${GREEN}✓${NC} Word 导入服务: http://localhost:8081"
    echo "   API 文档: http://localhost:8081/docs"
else
    echo -e "${YELLOW}!${NC} Word 导入服务: 未运行"
fi

if check_frontend; then
    echo -e "${GREEN}✓${NC} 前端服务: http://localhost:3002"
else
    echo -e "${YELLOW}!${NC} 前端服务: 未运行"
fi

echo ""
echo "======================================"
echo "  访问地址:"
echo "======================================"

if check_word_service && check_frontend; then
    echo -e "${BLUE}http://localhost:3002${NC} ← 点击访问前端页面"
    echo ""
    echo "提示: 在页面中使用 Word 导入按钮测试功能"
else
    echo "请先启动所有服务"
fi

echo ""
echo "======================================"
