#!/bin/bash

# ============================================================================
# 华南留学 v2.1.0 - 服务器端部署脚本
# 在腾讯云服务器上执行此脚本
# ============================================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

PROJECT_DIR="/var/www/huananliu"
DEPLOY_PACKAGE="/tmp/huananliu-v2.1.0-20260327.tar.gz"
VERSION="v2.1.0"

print_info "=========================================="
print_info "华南留学 ${VERSION} 服务器部署脚本"
print_info "=========================================="

# 检查root权限
if [ "$EUID" -ne 0 ]; then 
    print_error "请使用 root 权限运行此脚本"
    exit 1
fi

# 1. 安装必要软件
print_info "步骤 1/8: 安装必要软件..."
apt-get update -qq
apt-get install -y -qq curl wget git nginx mysql-server build-essential

# 2. 安装Node.js
print_info "步骤 2/8: 安装 Node.js 18..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y -qq nodejs
fi
node -v
npm -v

# 3. 安装PM2
print_info "步骤 3/8: 安装 PM2..."
npm install -g pm2

# 4. 配置MySQL
print_info "步骤 4/8: 配置 MySQL..."
systemctl start mysql
systemctl enable mysql

# 创建数据库
mysql -e "CREATE DATABASE IF NOT EXISTS huananliu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || true

# 5. 解压部署包
print_info "步骤 5/8: 解压部署包..."
if [ ! -f "$DEPLOY_PACKAGE" ]; then
    print_error "未找到部署包: $DEPLOY_PACKAGE"
    print_info "请先上传部署包到 /tmp/ 目录"
    exit 1
fi

mkdir -p $PROJECT_DIR
cd $PROJECT_DIR
tar -xzf $DEPLOY_PACKAGE

DEPLOY_DIR=$(tar -tzf $DEPLOY_PACKAGE | head -1 | cut -f1 -d"/")
cd $DEPLOY_DIR

print_info "部署目录: $(pwd)"

# 6. 部署后端
print_info "步骤 6/8: 部署后端服务..."
cd backend

# 安装依赖
npm install --production

# 创建日志目录
mkdir -p logs uploads

# 创建环境变量文件
cat > .env << 'EOF'
NODE_ENV=production
PORT=3001

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=huananliu

# JWT配置
JWT_SECRET=huananliu_secret_key_2026_v2_1_0
JWT_EXPIRES_IN=7d

# 微信小程序
WX_APPID=wx7882270d386b1f0b
WX_SECRET=

# CORS
CORS_ORIGIN=http://159.75.91.195,http://localhost:3000
EOF

print_warn "请编辑 backend/.env 文件，设置数据库密码和微信密钥"

# 启动服务
pm2 start ecosystem.config.js --env production 2>/dev/null || pm2 restart ecosystem.config.js --env production
pm2 save

# 设置开机启动
env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root

cd ..

# 7. 配置Nginx
print_info "步骤 7/8: 配置 Nginx..."
cat > /etc/nginx/sites-available/huananliu << 'EOF'
server {
    listen 80;
    server_name 159.75.91.195;
    
    client_max_body_size 50M;
    
    # 管理后台
    location / {
        root /var/www/huananliu/PROJECT_DIR/admin;
        try_files $uri $uri/ /index.html;
        index index.html;
        expires -1;
    }
    
    # API代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # 上传文件
    location /uploads {
        proxy_pass http://localhost:3001;
        expires 30d;
    }
}
EOF

# 替换实际路径
sed -i "s|PROJECT_DIR|$DEPLOY_DIR|g" /etc/nginx/sites-available/huananliu

# 启用配置
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/huananliu /etc/nginx/sites-enabled/

# 测试并重载
nginx -t && systemctl reload nginx

# 8. 配置防火墙
print_info "步骤 8/8: 配置防火墙..."
ufw allow 80/tcp 2>/dev/null || true
ufw allow 443/tcp 2>/dev/null || true
ufw allow 22/tcp 2>/dev/null || true

# 完成
print_info "=========================================="
print_info "✅ 部署完成！"
print_info "=========================================="
print_info ""
print_info "访问地址:"
print_info "  管理后台: http://159.75.91.195"
print_info "  API: http://159.75.91.195/api"
print_info "  健康检查: http://159.75.91.195/api/health"
print_info ""
print_info "下一步:"
print_info "  1. 编辑 /var/www/huananliu/$DEPLOY_DIR/backend/.env 配置数据库密码"
print_info "  2. 重启后端: pm2 restart huananliu-api"
print_info "  3. 查看日志: pm2 logs"
print_info ""
print_info "常用命令:"
print_info "  pm2 status       # 查看服务状态"
print_info "  pm2 logs         # 查看日志"
print_info "  pm2 restart all  # 重启所有服务"
print_info "  nginx -t         # 检查Nginx配置"
print_info "=========================================="
