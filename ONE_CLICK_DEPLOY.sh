#!/bin/bash
# ============================================================================
# 华南留学 v2.1.0 - 一键部署脚本
# 复制此脚本到服务器终端执行
# ============================================================================

set -e

echo "=========================================="
echo "华南留学 v2.1.0 一键部署"
echo "=========================================="

# 配置
DB_PASS="huananliu2024"
ADMIN_USER="admin"
ADMIN_PASS="admin888"

# 1. 安装依赖
echo "[1/8] 安装系统依赖..."
sudo apt-get update -qq
sudo apt-get install -y -qq curl wget git nginx mysql-server build-essential

# 2. 安装 Node.js
echo "[2/8] 安装 Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y -qq nodejs

# 3. 安装 PM2
echo "[3/8] 安装 PM2..."
sudo npm install -g pm2

# 4. 配置 MySQL
echo "[4/8] 配置 MySQL..."
sudo systemctl start mysql
sudo systemctl enable mysql

# 设置 root 密码并创建数据库
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$DB_PASS';" 2>/dev/null || true
sudo mysql -u root -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS huananliu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || true

# 5. 创建项目目录
echo "[5/8] 创建项目目录..."
sudo mkdir -p /var/www/huananliu
sudo chown ubuntu:ubuntu /var/www/huananliu

# 6. 部署后端（从 GitHub 或本地复制）
echo "[6/8] 部署后端..."
cd /var/www/huananliu

# 如果本地有代码，复制过去
if [ -d "/home/ubuntu/huananliu-v2.1.0-20260327" ]; then
    cp -r /home/ubuntu/huananliu-v2.1.0-20260327 .
    cd huananliu-v2.1.0-20260327/backend
else
    echo "未找到本地部署包，需要从本地上传"
    exit 1
fi

# 安装依赖
npm install --production

# 创建日志目录
mkdir -p logs uploads

# 创建配置文件
cat > .env << EOF
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=$DB_PASS
DB_NAME=huananliu
JWT_SECRET=huananliu_secret_$(date +%s)
JWT_EXPIRES_IN=7d
WX_APPID=wx7882270d386b1f0b
WX_SECRET=
CORS_ORIGIN=http://159.75.91.195
EOF

# 启动服务
pm2 start ecosystem.config.js --env production 2>/dev/null || pm2 restart ecosystem.config.js --env production
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root 2>/dev/null || true

cd ..

# 7. 配置 Nginx
echo "[7/8] 配置 Nginx..."
CURRENT_DIR=$(pwd)

sudo tee /etc/nginx/sites-available/huananliu > /dev/null << EOF
server {
    listen 80;
    server_name 159.75.91.195;
    client_max_body_size 50M;
    
    location / {
        root $CURRENT_DIR/admin;
        try_files \$uri \$uri/ /index.html;
        index index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
    
    location /uploads {
        proxy_pass http://localhost:3001;
    }
}
EOF

sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/huananliu /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 8. 创建管理员账户
echo "[8/8] 创建管理员账户..."
cd backend
PASSWORD_HASH=$(node -e "console.log(require('bcryptjs').hashSync('$ADMIN_PASS', 10))")
sudo mysql -u root -p$DB_PASS huananliu -e "
INSERT INTO admins (username, password, name, role, status, created_at, updated_at) 
VALUES ('$ADMIN_USER', '$PASSWORD_HASH', '管理员', 'super', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE password='$PASSWORD_HASH', role='super';
" 2>/dev/null || true

echo ""
echo "=========================================="
echo "✅ 部署完成！"
echo "=========================================="
echo ""
echo "访问地址: http://159.75.91.195"
echo ""
echo "管理员账户:"
echo "  用户名: $ADMIN_USER"
echo "  密码: $ADMIN_PASS"
echo ""
echo "MySQL 密码: $DB_PASS"
echo ""
echo "常用命令:"
echo "  pm2 status    # 查看服务状态"
echo "  pm2 logs      # 查看日志"
echo "=========================================="
