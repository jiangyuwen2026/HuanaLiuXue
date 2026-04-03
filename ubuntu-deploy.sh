#!/bin/bash

# ============================================================================
# 华南留学 v2.1.0 - Ubuntu 22.04 部署脚本
# 在腾讯云服务器终端直接执行
# ============================================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
print_step() { echo -e "${BLUE}[STEP]${NC} $1"; }

VERSION="v2.1.0"
PROJECT_DIR="/var/www/huananliu"
DEPLOY_DIR="huananliu-v2.1.0-20260327"

clear
print_info "=========================================="
print_info "华南留学 ${VERSION} 部署脚本"
print_info "系统: Ubuntu 22.04 LTS"
print_info "=========================================="

# 检查是否在项目目录
if [ ! -f "deploy.sh" ] && [ ! -d "huananliu-v2.1.0-20260327" ]; then
    print_error "请在项目目录中执行此脚本"
    print_info "请先上传部署包并解压"
    exit 1
fi

# 如果存在部署包，先解压
if [ -f "huananliu-v2.1.0-20260327.tar.gz" ] && [ ! -d "huananliu-v2.1.0-20260327" ]; then
    print_step "解压部署包..."
    tar -xzf huananliu-v2.1.0-20260327.tar.gz
fi

if [ ! -d "$DEPLOY_DIR" ]; then
    print_error "未找到部署目录: $DEPLOY_DIR"
    exit 1
fi

cd $DEPLOY_DIR

# 1. 安装依赖
print_step "1/8 安装系统依赖..."
sudo apt-get update -qq
sudo apt-get install -y -qq curl wget git nginx mysql-server build-essential

# 2. 安装 Node.js 18
print_step "2/8 安装 Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y -qq nodejs
fi
print_info "Node.js 版本: $(node -v)"
print_info "NPM 版本: $(npm -v)"

# 3. 安装 PM2
print_step "3/8 安装 PM2..."
sudo npm install -g pm2

# 4. 配置 MySQL
print_step "4/8 配置 MySQL..."
sudo systemctl start mysql
sudo systemctl enable mysql

# 设置 MySQL root 密码
print_warn "请设置 MySQL root 密码:"
read -s -p "请输入 MySQL root 密码: " DB_PASSWORD
echo ""

# 创建数据库
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$DB_PASSWORD';" 2>/dev/null || true
sudo mysql -u root -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS huananliu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || {
    print_warn "数据库可能已存在，继续..."
}

# 5. 部署后端
print_step "5/8 部署后端服务..."
cd backend

# 安装依赖
npm install --production 2>&1 | tail -5

# 创建日志目录
mkdir -p logs uploads

# 创建环境变量文件
print_step "创建后端配置文件..."
cat > .env << EOF
NODE_ENV=production
PORT=3001

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=$DB_PASSWORD
DB_NAME=huananliu

# JWT配置
JWT_SECRET=huananliu_secret_key_$(date +%s)
JWT_EXPIRES_IN=7d

# 微信小程序
WX_APPID=wx7882270d386b1f0b
WX_SECRET=your_wx_secret_here

# CORS
CORS_ORIGIN=http://159.75.91.195,http://localhost:3000
EOF

print_info "后端配置文件已创建"

# 启动服务
print_step "启动后端服务..."
pm2 start ecosystem.config.js --env production 2>/dev/null || pm2 restart ecosystem.config.js --env production
pm2 save

# 设置开机启动
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root 2>/dev/null || true

cd ..

# 6. 配置 Nginx
print_step "6/8 配置 Nginx..."

# 获取当前目录的绝对路径
CURRENT_DIR=$(pwd)

sudo tee /etc/nginx/sites-available/huananliu > /dev/null << EOF
server {
    listen 80;
    server_name 159.75.91.195;
    
    client_max_body_size 50M;
    
    # 管理后台
    location / {
        root $CURRENT_DIR/admin;
        try_files \$uri \$uri/ /index.html;
        index index.html;
        expires -1;
    }
    
    # API代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # 上传文件
    location /uploads {
        proxy_pass http://localhost:3001;
        expires 30d;
    }
}
EOF

# 启用配置
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/huananliu /etc/nginx/sites-enabled/

# 测试并重载
sudo nginx -t && sudo systemctl reload nginx

# 7. 配置防火墙
print_step "7/8 配置防火墙..."
sudo ufw allow 80/tcp 2>/dev/null || true
sudo ufw allow 443/tcp 2>/dev/null || true
sudo ufw allow 22/tcp 2>/dev/null || true
sudo ufw --force enable 2>/dev/null || true

# 8. 创建管理员账户
print_step "8/8 创建初始管理员账户..."
print_warn "请设置管理员账户:"
read -p "管理员用户名 [admin]: " ADMIN_USER
ADMIN_USER=${ADMIN_USER:-admin}
read -s -p "管理员密码 [admin123]: " ADMIN_PASS
ADMIN_PASS=${ADMIN_PASS:-admin123}
echo ""

# 生成密码哈希
PASSWORD_HASH=$(node -e "console.log(require('bcryptjs').hashSync('$ADMIN_PASS', 10))")

# 插入数据库
sudo mysql -u root -p$DB_PASSWORD huananliu -e "
INSERT INTO admins (username, password, name, role, status, created_at, updated_at) 
VALUES ('$ADMIN_USER', '$PASSWORD_HASH', '管理员', 'super', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
password = '$PASSWORD_HASH', 
role = 'super',
updated_at = NOW();
" 2>/dev/null || {
    print_warn "管理员账户可能已存在，跳过创建"
}

# 完成
print_info "=========================================="
print_info "✅ 部署完成！"
print_info "=========================================="
print_info ""
print_info "访问地址:"
print_info "  管理后台: http://159.75.91.195"
print_info "  API文档:  http://159.75.91.195/api/health"
print_info ""
print_info "管理员账户:"
print_info "  用户名: $ADMIN_USER"
print_info "  密码: $ADMIN_PASS"
print_info ""
print_info "常用命令:"
print_info "  pm2 status       # 查看服务状态"
print_info "  pm2 logs         # 查看后端日志"
print_info "  sudo nginx -t    # 检查Nginx配置"
print_info "  sudo systemctl status nginx  # 查看Nginx状态"
print_info "=========================================="
print_warn "注意: 请记录好管理员密码！"
print_info "=========================================="
