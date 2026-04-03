#!/bin/bash
# 修改端口配置脚本

# 新端口配置
ADMIN_PORT=8082    # 后台管理
API_PORT=8081      # API服务
WEBSITE_PORT=8080  # 官网（暂时占用，如不需要可跳过）

echo "=========================================="
echo "修改端口配置"
echo "=========================================="
echo "API端口: $API_PORT"
echo "后台管理端口: $ADMIN_PORT"
echo "官网端口: $WEBSITE_PORT"
echo "=========================================="

# 1. 停止现有服务
echo "[1/4] 停止现有服务..."
pm2 stop huananliu-api 2>/dev/null || true

# 2. 修改后端 .env
echo "[2/4] 修改后端端口配置..."
cd /home/ubuntu/huananliu-v2.1.0-20260327/backend

sed -i "s/PORT=.*/PORT=$API_PORT/" .env

cat > .env << EOF
NODE_ENV=production
PORT=$API_PORT

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=huananliu2024
DB_NAME=huananliu

JWT_SECRET=huananliu_secret_key_2026
JWT_EXPIRES_IN=7d

WX_APPID=wx7882270d386b1f0b
WX_SECRET=

CORS_ORIGIN=http://159.75.91.195:$ADMIN_PORT,http://159.75.91.195:$WEBSITE_PORT
EOF

echo "后端端口已改为: $API_PORT"

# 3. 配置 Nginx - 后台管理 (8082)
echo "[3/4] 配置 Nginx (后台管理端口: $ADMIN_PORT)..."

sudo tee /etc/nginx/sites-available/huananliu-admin > /dev/null << EOF
server {
    listen $ADMIN_PORT;
    server_name 159.75.91.195;
    client_max_body_size 50M;
    
    location / {
        root /home/ubuntu/huananliu-v2.1.0-20260327/admin;
        try_files \$uri \$uri/ /index.html;
        index index.html;
    }
    
    location /api {
        proxy_pass http://localhost:$API_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    location /uploads {
        proxy_pass http://localhost:$API_PORT;
    }
}
EOF

# 4. 配置 Nginx - 官网 (8080)
echo "[4/4] 配置 Nginx (官网端口: $WEBSITE_PORT)..."

sudo tee /etc/nginx/sites-available/huananliu-website > /dev/null << EOF
server {
    listen $WEBSITE_PORT;
    server_name 159.75.91.195;
    client_max_body_size 50M;
    
    location / {
        root /home/ubuntu/huananliu-v2.1.0-20260327/website;
        try_files \$uri \$uri/ /index.html;
        index index.html;
    }
    
    location /api {
        proxy_pass http://localhost:$API_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

# 启用配置
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/huananliu-admin /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/huananliu-website /etc/nginx/sites-enabled/

# 检查并重载 Nginx
sudo nginx -t && sudo systemctl reload nginx

# 5. 开放防火墙端口
echo "开放防火墙端口..."
sudo ufw allow $ADMIN_PORT/tcp 2>/dev/null || true
sudo ufw allow $API_PORT/tcp 2>/dev/null || true
sudo ufw allow $WEBSITE_PORT/tcp 2>/dev/null || true

# 6. 启动后端服务
echo "启动后端服务..."
cd /home/ubuntu/huananliu-v2.1.0-20260327/backend
pm2 delete huananliu-api 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save

echo ""
echo "=========================================="
echo "✅ 端口修改完成！"
echo "=========================================="
echo ""
echo "访问地址:"
echo "  后台管理: http://159.75.91.195:$ADMIN_PORT"
echo "  API服务:  http://159.75.91.195:$API_PORT"
echo "  官网:     http://159.75.91.195:$WEBSITE_PORT"
echo ""
echo "请确保腾讯云安全组已开放这些端口！"
echo "=========================================="
