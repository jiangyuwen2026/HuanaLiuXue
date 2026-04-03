# 华南留学 v2.1.0 部署指南

## 📋 部署概览

| 项目 | 内容 |
|------|------|
| 版本 | v2.1.0 |
| 部署日期 | 2026-03-27 |
| 部署环境 | 生产环境 |

---

## 🎯 部署内容

### 本次部署包含：
1. ✅ 后端服务 v2.1.0 - 新增用户管理、客户管理API
2. ✅ 管理后台 v2.1.0 - 新增后台用户管理、客户管理页面
3. ✅ 小程序 v2.0.0-FINAL - 已冻结版本

---

## 🖥️ 一、后端部署

### 1.1 环境要求
- Node.js 18+
- MySQL 8.0
- PM2 (进程管理)

### 1.2 部署步骤

```bash
# 1. 进入后端目录
cd /var/www/huananliu/backend

# 2. 拉取最新代码
git pull origin main

# 3. 安装依赖
npm install

# 4. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置数据库连接、JWT密钥等

# 5. 数据库迁移
npm run migrate

# 6. 重启服务
pm2 restart huananliu-api
# 或
pm2 start index.js --name huananliu-api

# 7. 查看日志
pm2 logs huananliu-api
```

### 1.3 环境变量配置 (.env)
```bash
# 服务器
NODE_ENV=production
PORT=3001

# 数据库
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=huananliu

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# 微信
WX_APPID=your_app_id
WX_SECRET=your_app_secret

# CORS
CORS_ORIGIN=https://admin.huananliuxue.com,https://www.huananliuxue.com
```

### 1.4 PM2 配置文件 (ecosystem.config.js)
```javascript
module.exports = {
  apps: [{
    name: 'huananliu-api',
    script: './index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

---

## 🖥️ 二、管理后台部署

### 2.1 构建生产包
```bash
# 1. 进入管理后台目录
cd huananliu-web/frontend/admin

# 2. 安装依赖
npm install

# 3. 构建生产包
npm run build

# 4. 构建输出在 dist/ 目录
```

### 2.2 Nginx 配置
```nginx
server {
    listen 80;
    server_name admin.huananliuxue.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.huananliu.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    # 前端静态文件
    location / {
        root /var/www/huananliu/admin/dist;
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
```

### 2.3 部署命令
```bash
# 1. 复制构建文件到服务器
scp -r dist/* root@your-server:/var/www/huananliu/admin/

# 2. 或本地复制
sudo cp -r dist/* /var/www/huananliu/admin/

# 3. 重启 Nginx
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📱 三、小程序部署

### 3.1 上传代码
1. 打开微信开发者工具
2. 导入 `miniprogram` 目录
3. 点击"上传"按钮
4. 填写版本号: v2.0.0-FINAL
5. 填写项目备注

### 3.2 提交审核
1. 登录微信公众平台
2. 进入"版本管理"
3. 找到已上传的开发版本
4. 点击"提交审核"
5. 填写审核信息

### 3.3 发布上线
审核通过后，点击"发布"即可上线。

---

## 🗄️ 四、数据库变更

### 4.1 本次变更
v2.1.0 版本无需数据库结构变更，已在 Sequelize 同步时自动完成。

### 4.2 数据迁移（如需要）
```bash
# 进入后端目录
cd huananliu-web/backend

# 执行迁移
node scripts/migrate.js
```

---

## ✅ 五、部署检查清单

### 后端检查
- [ ] Node.js 版本 18+
- [ ] MySQL 连接正常
- [ ] 环境变量配置正确
- [ ] PM2 进程运行正常
- [ ] API 接口响应正常

### 前端检查
- [ ] 构建文件已上传到服务器
- [ ] Nginx 配置正确
- [ ] SSL 证书有效
- [ ] 域名解析正常
- [ ] 页面访问正常

### 小程序检查
- [ ] 代码已上传
- [ ] 审核通过
- [ ] 已发布上线
- [ ] 功能测试正常

---

## 🐛 六、常见问题

### 6.1 后端启动失败
```bash
# 检查日志
pm2 logs huananliu-api

# 检查端口占用
lsof -i :3001

# 检查数据库连接
mysql -u root -p -e "USE huananliu; SHOW TABLES;"
```

### 6.2 前端页面空白
```bash
# 检查 Nginx 配置
sudo nginx -t

# 检查文件权限
ls -la /var/www/huananliu/admin/

# 检查错误日志
sudo tail -f /var/log/nginx/error.log
```

### 6.3 API 请求失败
```bash
# 检查后端服务
pm2 status

# 检查端口
netstat -tlnp | grep 3001

# 测试 API
curl http://localhost:3001/api/health
```

---

## 📞 七、回滚方案

如部署出现问题，可快速回滚：

```bash
# 1. 后端回滚
git reset --hard v2.0.0-FINAL
npm install
pm2 restart huananliu-api

# 2. 前端回滚
git reset --hard v2.0.0-FINAL
npm run build
sudo cp -r dist/* /var/www/huananliu/admin/

# 3. 小程序回滚
# 在微信开发者工具中上传旧版本代码
```

---

## 📊 八、部署验证

### 8.1 API 测试
```bash
# 健康检查
curl https://api.huananliuxue.com/api/health

# 登录测试
curl -X POST https://api.huananliuxue.com/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'

# 用户列表测试
curl https://api.huananliuxue.com/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 8.2 前端测试
- [ ] 登录页面正常
- [ ] 仪表盘数据显示
- [ ] 后台用户管理页面正常
- [ ] 客户管理页面正常
- [ ] 数据列表加载正常

### 8.3 小程序测试
- [ ] 首页加载正常
- [ ] 微信登录正常
- [ ] 手机号绑定正常
- [ ] 预约功能正常

---

## 📝 九、部署记录

| 时间 | 操作 | 执行人 | 状态 |
|------|------|--------|------|
| 2026-03-27 | 后端部署 | Dev | ⬜ |
| 2026-03-27 | 前端部署 | Dev | ⬜ |
| 2026-03-27 | 小程序上传 | Dev | ⬜ |
| 2026-03-27 | 功能测试 | QA | ⬜ |
| 2026-03-27 | 正式上线 | PM | ⬜ |

---

**部署文档版本**: v2.1.0  
**最后更新**: 2026-03-27
