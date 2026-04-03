# 服务器域名和API配置 - 快速检查清单

## ✅ 完整配置流程

### 第一步：域名准备
- [ ] 已注册域名（如：api.huananliuxue.com）
- [ ] 域名已完成备案（中国大陆）
- [ ] 域名DNS解析已配置
- [ ] 已申请HTTPS证书

### 第二步：后端API部署
- [ ] 后端服务已部署
- [ ] API接口可正常访问
- [ ] HTTPS配置正确
- [ ] CORS跨域已配置
- [ ] 测试接口返回正常

### 第三步：微信公众平台配置
- [ ] 登录微信公众平台
- [ ] 进入"开发" → "开发管理" → "开发设置"
- [ ] 配置 request 合法域名
- [ ] 配置 uploadFile 合法域名（如需要）
- [ ] 配置 downloadFile 合法域名（如需要）
- [ ] 配置 socket 合法域名（如需要）

### 第四步：小程序代码配置
- [ ] 复制 config.example.js 为 config.js
- [ ] 修改 config.js 中的API地址
- [ ] 修改 app.js 中的 baseUrl
- [ ] 配置 utils/aiService.js 中的AI密钥
- [ ] config.js 已添加到 .gitignore

### 第五步：测试验证
- [ ] 在微信开发者工具中测试
- [ ] 真机预览测试
- [ ] 所有API接口调用正常
- [ ] AI服务调用正常
- [ ] 文件上传/下载正常

---

## 📋 详细检查项

### 域名检查

| 检查项 | 状态 | 说明 |
|--------|------|------|
| 域名已注册 | ⬜ | 确保域名可访问 |
| 域名已备案 | ⬜ | 国内域名必须备案 |
| DNS解析正常 | ⬜ | nslookup 测试通过 |
| HTTPS证书有效 | ⬜ | 证书未过期 |
| HTTPS证书可信 | ⬜ | 不使用自签名证书 |

### 微信公众平台配置

| 检查项 | 状态 | 说明 |
|--------|------|------|
| request域名 | ⬜ | https://api.huananliuxue.com |
| uploadFile域名 | ⬜ | https://api.huananliuxue.com |
| downloadFile域名 | ⬜ | https://api.huananliuxue.com |
| 配置已生效 | ⬜ | 等待5-10分钟后生效 |

### 代码配置

#### app.js
```javascript
// 检查项
baseUrl: 'https://api.huananliuxue.com/api'  ⬜ 已配置正确
```

#### config.js
```javascript
// 检查项
- config.js 文件存在              ⬜
- appId 已配置                     ⬜
- baseUrl 已配置                   ⬜
- aiBaseUrl 已配置                 ⬜
- aiSecretId 已配置                ⬜
- aiSecretKey 已配置               ⬜
- ENV 环境设置正确                ⬜
```

#### utils/api.js
```javascript
// 检查项
- 使用 app.globalData.baseUrl       ⬜
- Token认证逻辑正确                ⬜
- 错误处理完善                     ⬜
```

#### utils/aiService.js
```javascript
// 检查项
- baseURL 已配置                    ⬜
- secretId 已配置                   ⬜
- secretKey 已配置                  ⬜
- model 已配置                     ⬜
```

### API接口测试

| 接口 | 测试结果 | 说明 |
|------|----------|------|
| POST /auth/login | ⬜ | 微信登录 |
| GET /user/info | ⬜ | 获取用户信息 |
| GET /news/list | ⬜ | 资讯列表 |
| GET /school/list | ⬜ | 学校列表 |
| POST /appointment/create | ⬜ | 创建预约 |

### AI服务测试

| 测试项 | 测试结果 | 说明 |
|--------|----------|------|
| AI问答功能 | ⬜ | 规则匹配 |
| AI问答功能 | ⬜ | AI生成 |
| 图片识别 | ⬜ | 上传图片 |
| AI响应时间 | ⬜ | < 3秒 |

---

## 🔧 配置文件模板

### app.js
```javascript
App({
  globalData: {
    userInfo: null,
    openid: null,
    baseUrl: 'https://api.huananliuxue.com/api' // ✅ 确认已配置
  }
})
```

### config.js
```javascript
const PRODUCTION_CONFIG = {
  baseUrl: 'https://api.huananliuxue.com/api',      // ✅ 确认已配置
  aiBaseUrl: 'https://aichat.tencentyun.com/v1',   // ✅ 确认已配置
  aiSecretId: 'AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxx',  // ✅ 确认已配置
  aiSecretKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',// ✅ 确认已配置
  debug: false
}
```

### utils/aiService.js
```javascript
const config = {
  baseURL: 'https://aichat.tencentyun.com/v1',     // ✅ 确认已配置
  secretId: 'AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxx',   // ✅ 确认已配置
  secretKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',  // ✅ 确认已配置
  model: 'hunyuan-lite'                             // ✅ 确认已配置
}
```

---

## 🧪 测试命令

### 1. 域名DNS检查
```bash
nslookup api.huananliuxue.com
```
**预期结果：** 返回IP地址

### 2. HTTPS证书检查
```bash
curl -I https://api.huananliuxue.com
```
**预期结果：** 返回 200 OK 或 301/302 重定向

### 3. API连通性测试
```bash
curl -X GET https://api.huananliuxue.com/api/health
```
**预期结果：** 返回JSON数据

### 4. 域名配置检查脚本
```bash
./check-domain.sh
```
**预期结果：** 显示所有检查项的结果

---

## ⚠️ 常见错误及解决方法

### 错误1: request:fail url not in domain list

**原因：** 域名未在微信公众平台配置白名单

**解决方法：**
1. 登录微信公众平台
2. 配置服务器域名白名单
3. 等待5-10分钟生效

### 错误2: request:fail -2 net::ERR_CONNECTION_REFUSED

**原因：** 后端服务未启动或端口未开放

**解决方法：**
1. 检查后端服务是否运行
2. 检查防火墙设置
3. 检查云服务器安全组

### 错误3: request:fail -2 net::ERR_NAME_NOT_RESOLVED

**原因：** 域名解析失败

**解决方法：**
1. 检查域名DNS配置
2. 等待DNS生效（最长48小时）
3. 使用 ping 测试域名

### 错误4: 401 Unauthorized

**原因：** Token过期或无效

**解决方法：**
1. 重新登录获取新Token
2. 检查Token存储逻辑
3. 检查后端Token验证逻辑

### 错误5: 网络请求超时

**原因：** 网络问题或API响应慢

**解决方法：**
1. 检查网络连接
2. 增加超时时间
3. 优化后端API性能

---

## 📝 配置记录

### 域名信息
```
主域名: api.huananliuxue.com
备案号: ___________________
证书到期: _____________
```

### 微信公众平台
```
AppID: wx7882270d386b1f0b
配置时间: _____________
生效时间: _____________
```

### API地址
```
开发环境: https://dev-api.huananliuxue.com/api
预发布: https://staging-api.huananliuxue.com/api
生产环境: https://api.huananliuxue.com/api
```

### AI服务
```
腾讯云SecretId: AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxx
腾讯云SecretKey: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🚀 发布前最终检查

在提交小程序审核前，请确认：

- [ ] 所有域名已配置白名单
- [ ] config.js 中的生产环境配置已设置
- [ ] 测试环境数据已清除
- [ ] 调试日志已关闭
- [ ] 所有API接口测试通过
- [ ] AI服务配置正确且可用
- [ ] 真机预览测试通过
- [ ] 没有使用临时域名（如ngrok）
- [ ] HTTPS证书有效且未过期
- [ ] 域名已完成备案

---

## 📞 遇到问题？

### 自助排查流程

1. **域名配置问题**
   - 检查域名是否在白名单中
   - 检查域名是否使用HTTPS
   - 检查域名是否备案

2. **网络请求问题**
   - 检查API是否可访问
   - 检查CORS配置
   - 检查防火墙设置

3. **配置文件问题**
   - 检查config.js是否正确配置
   - 检查app.js中的baseUrl
   - 检查AI服务密钥

4. **运行脚本检查**
   ```bash
   ./check-domain.sh
   ```

### 技术支持

- [微信开发者文档](https://developers.weixin.qq.com/miniprogram/dev/)
- [腾讯云文档](https://cloud.tencent.com/document/product)
- [华南留学技术支持](mailto:support@huananliuxue.com)

---

**配置完成后，建议保存此文档作为参考。**
