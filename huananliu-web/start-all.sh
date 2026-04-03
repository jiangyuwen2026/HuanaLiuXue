#!/bin/bash

echo "启动所有服务..."

# 启动后端
echo "1. 启动后端服务 (端口3001)..."
cd /Users/jiangyuwen/WorkBuddy/20260310085315/huananliu-web/backend
node index.js > /tmp/backend.log 2>&1 &
sleep 2

# 启动官网
echo "2. 启动官网前端 (端口3000)..."
cd /Users/jiangyuwen/WorkBuddy/20260310085315/huananliu-web/frontend/website
npm run dev > /tmp/website.log 2>&1 &
sleep 2

# 启动管理后台
echo "3. 启动管理后台 (端口3002)..."
cd /Users/jiangyuwen/WorkBuddy/20260310085315/huananliu-web/frontend/admin
npm run dev > /tmp/admin.log 2>&1 &
sleep 2

echo ""
echo "✅ 所有服务已启动！"
echo ""
echo "官网: http://localhost:3000"
echo "管理后台: http://localhost:3002"
echo "后端API: http://localhost:3001"
echo ""
echo "管理后台登录信息:"
echo "  用户名: admin"
echo "  密码: admin123"
