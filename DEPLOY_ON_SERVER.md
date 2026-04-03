# 腾讯云服务器部署指南

## 🖥️ 服务器信息
- **IP**: 159.75.91.195
- **系统**: CentOS/Ubuntu (待确认)
- **项目**: 华南留学 v2.1.0

---

## 📋 部署前准备

### 1. 登录服务器
```bash
# 使用控制台或SSH登录
ssh root@159.75.91.195
```

### 2. 安装必要软件
```bash
# 更新系统
apt update && apt upgrade -y  # Ubuntu/Debian
# 或
yum update -y  # CentOS

# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# 验证安装
node -v  # v18.x.x
npm -v   # 9.x.x

# 安装 PM2
npm install -g pm2

# 安装 MySQL 8.0
apt install -y mysql-server

# 安装 Nginx
apt install -y nginx

# 安装 Git
apt install -y git
```

---

## 🚀 一键部署脚本

在服务器上执行以下命令：

```bash
# 创建项目目录
mkdir -p /var/www/huananliu
cd /var/www/huananliu

# 下载部署包（需要先将部署包上传到服务器）
# 方式1: 从本地上传
# scp huananliu-v2.1.0-20260327.tar.gz root@159.75.91.195:/var/www/huananliu/

# 方式2: 从GitHub/GitLab下载
# wget https://your-repo/huananliu-v2.1.0-20260327.tar.gz

# 解压
tar -xzf huananliu-v2.1.0-20260327.tar.gz
cd huananliu-v2.1.0-20260327
```

---

## 🔧 详细部署步骤

### 1. 部署后端服务

```bash
cd /var/www/huananliu/huananliu-v2.1.0-20260327/backend

# 安装依赖
npm install

# 创建日志目录
mkdir -p logs

# 创建环境变量文件
cat > .env << 'EOF'
NODE_ENV=production
PORT=3001

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=huananliu

# JWT配置
JWT_SECRET=huananliu_secret_key_2024
JWT_EXPIRES_IN=7d

# 微信小程序配置
WX_APPID=wx7882270d386b1f0b
WX_SECRET=your_wx_secret

# CORS配置
CORS_ORIGIN=http://localhost:3000,http://159.75.91.195
EOF

# 创建数据库
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS huananliu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 启动服务
pm2 start ecosystem.config.js --env production

# 保存PM2配置
pm2 save
pm2 startup
```

### 2. 配置 Nginx

```bash
# 创建Nginx配置
cat > /etc/nginx/sites-available/huananliu << 'EOF'
server {
    listen 80;
    server_name 159.75.91.195;
    
    # 管理后台
    location / {
        root /var/www/huananliu/huananliu-v2.1.0-20260327/admin;
        try_files $uri $uri/ /index.html;
        index index.html;
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
    }
    
    # 上传文件
    location /uploads {
        proxy_pass http://localhost:3001;
    }
}
EOF

# 启用配置
ln -sf /etc/nginx/sites-available/huananliu /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试并重载
nginx -t
systemctl reload nginx
```

### 3. 配置防火墙

```bash
# 开放80端口
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3001/tcp  # 后端API端口（可选，如果通过Nginx代理则不需要）
ufw enable
```

---

## ✅ 验证部署

### 1. 检查后端服务
```bash
# 查看进程
pm2 status

# 查看日志
pm2 logs huananliu-api

# 健康检查
curl http://localhost:3001/api/health
```

### 2. 检查前端访问
```bash
# 浏览器访问
http://159.75.91.195
```

### 3. 检查API
```bash
# 测试API
curl http://159.75.91.195/api/health
```

---

## 🔐 安全配置

### 1. 修改默认密码
```bash
# MySQL root密码
mysql_secure_installation

# 为应用创建专用数据库用户
mysql -u root -p -e "
CREATE USER 'huananliu'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON huananliu.* TO 'huananliu'@'localhost';
FLUSH PRIVILEGES;
"
```

### 2. 配置SSL (可选)
```bash
# 使用Let's Encrypt
certbot --nginx -d your-domain.com
```

---

## 🆘 常见问题

### 1. 后端启动失败
```bash
# 检查日志
pm2 logs huananliu-api

# 检查端口占用
lsof -i :3001

# 检查数据库连接
mysql -u root -p -e "SHOW DATABASES;"
```

### 2. 前端访问404
```bash
# 检查Nginx配置
nginx -t

# 检查文件是否存在
ls -la /var/www/huananliu/huananliu-v2.1.0-20260327/admin/

# 查看错误日志
tail -f /var/log/nginx/error.log
```

### 3. API请求失败
```bash
# 检查后端是否运行
pm2 status

# 直接测试后端
curl http://localhost:3001/api/health

# 检查Nginx代理
curl http://159.75.91.195/api/health
```

---

## 📝 部署后配置

### 1. 创建初始管理员账户
```bash
# 进入后端目录
cd /var/www/huananliu/huananliu-v2.1.0-20260327/backend

# 创建管理员（通过API或直接操作数据库）
node -e "
const bcrypt = require('bcryptjs');
const password = bcrypt.hashSync('admin123', 10);
console.log('Password hash:', password);
"
```

### 2. 配置微信小程序
- 登录微信公众平台
- 配置服务器域名: `159.75.91.195`
- 配置业务域名和JS接口安全域名

---

## 🎉 完成

部署完成后，可以通过以下地址访问：

| 服务 | 地址 |
|------|------|
| 管理后台 | http://159.75.91.195 |
| API | http://159.75.91.195/api |
| 健康检查 | http://159.75.91.195/api/health |

---

**部署版本**: v2.1.0  
**部署时间**: 2026-03-27  
**服务器**: 腾讯云 159.75.91.195
