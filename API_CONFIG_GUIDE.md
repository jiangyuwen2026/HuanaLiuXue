# 华南留学小程序 - 服务器域名和API配置指南

## 📋 配置概述

本文档指导您完成微信小程序的服务器域名配置和API集成，包括：

- ✅ 服务器域名白名单配置
- ✅ 后端API地址配置
- ✅ 腾讯云AI服务配置
- ✅ 本地开发调试配置
- ✅ 环境变量管理

---

## 🌐 一、服务器域名配置

### 1.1 域名白名单说明

微信小程序对网络请求有严格限制，所有网络请求的域名必须在微信公众平台配置白名单。

**必须配置的域名类型：**
- `request` 合法域名：用于 HTTP/HTTPS 请求
- `uploadFile` 合法域名：用于文件上传
- `downloadFile` 合法域名：用于文件下载
- `socket` 合法域名：用于 WebSocket 连接

### 1.2 配置步骤

#### 步骤1：登录微信公众平台

1. 访问 [微信公众平台](https://mp.weixin.qq.com/)
2. 使用管理员账号登录
3. 进入"开发" → "开发管理" → "开发设置"

#### 步骤2：配置服务器域名

在"服务器域名"页面，根据您的实际域名填写：

```
request合法域名：
- https://api.huananliuxue.com          # 后端API
- https://aichat.tencentyun.com         # 腾讯云AI服务（可选）

uploadFile合法域名：
- https://api.huananliuxue.com          # 图片上传

downloadFile合法域名：
- https://api.huananliuxue.com          # 文件下载

socket合法域名：
- wss://api.huananliuxue.com            # WebSocket（如需要）
```

**重要提示：**
- ⚠️ 域名必须是 HTTPS（安全协议）
- ⚠️ 域名必须备案（中国大陆）
- ⚠️ 配置后需要几分钟生效
- ⚠️ 每个月只能修改5次

### 1.3 域名要求

**域名必须满足以下条件：**
1. 支持 HTTPS 证书
2. 证书有效（未过期）
3. 通过域名备案
4. 域名解析正确

**免费HTTPS证书方案：**
- Let's Encrypt（免费，需手动续期）
- 阿里云/腾讯云免费证书（1年有效期）
- Cloudflare（免费SSL）

### 1.4 域名测试工具

在配置前，建议先测试域名是否可用：

```bash
# 测试域名解析
nslookup api.huananliuxue.com

# 测试HTTPS证书
curl -I https://api.huananliuxue.com

# 测试API连通性
curl -X GET https://api.huananliuxue.com/api/health
```

---

## 🔧 二、后端API配置

### 2.1 配置API基础地址

编辑 `app.js` 文件，修改 `baseUrl`：

```javascript
// app.js
App({
  globalData: {
    userInfo: null,
    openid: null,
    baseUrl: 'https://api.huananliuxue.com/api' // 替换为您的实际API地址
  },
  // ...
})
```

### 2.2 API模块配置

小程序使用 `utils/api.js` 统一管理API接口：

#### 用户相关API

```javascript
// 微信登录
POST /auth/login
参数：{ code: string }
返回：{ token: string, userInfo: object }

// 获取用户信息
GET /user/info
Header: Authorization: Bearer {token}

// 更新用户信息
PUT /user/info
Body: { nickname, avatar, phone, email }

// 获取用户统计
GET /user/stats
返回：{ favoriteCount, appointmentCount, readCount }
```

#### 资讯相关API

```javascript
// 获取资讯列表
GET /news/list?category=xxx&page=1&pageSize=10

// 获取资讯详情
GET /news/detail?id=xxx

// 收藏资讯
POST /news/collect
Body: { id: string }

// 取消收藏
POST /news/uncollect
Body: { id: string }
```

#### 学校相关API

```javascript
// 获取学校列表
GET /school/list?country=HK&keyword=xxx&page=1

// 获取学校详情
GET /school/detail?id=xxx

// 收藏学校
POST /school/collect
Body: { id: string }
```

#### 预约相关API

```javascript
// 创建预约
POST /appointment/create
Body: {
  consultantId: string,
  appointmentDate: string,
  appointmentTime: string,
  remark: string
}

// 获取我的预约
GET /appointment/my

// 取消预约
POST /appointment/cancel
Body: { id: string }
```

### 2.3 环境变量配置

推荐使用不同环境的API地址：

```javascript
// app.js
const ENV = 'production' // development | staging | production

const CONFIG = {
  development: {
    baseUrl: 'https://dev-api.huananliuxue.com/api',
    aiBaseUrl: 'https://dev-aichat.tencentyun.com/v1'
  },
  staging: {
    baseUrl: 'https://staging-api.huananliuxue.com/api',
    aiBaseUrl: 'https://staging-aichat.tencentyun.com/v1'
  },
  production: {
    baseUrl: 'https://api.huananliuxue.com/api',
    aiBaseUrl: 'https://aichat.tencentyun.com/v1'
  }
}

App({
  globalData: {
    userInfo: null,
    openid: null,
    baseUrl: CONFIG[ENV].baseUrl,
    aiBaseUrl: CONFIG[ENV].aiBaseUrl
  }
})
```

---

## 🤖 三、腾讯云AI服务配置

### 3.1 开通腾讯云混元大模型

#### 步骤1：注册腾讯云

1. 访问 [腾讯云官网](https://cloud.tencent.com/)
2. 注册/登录账号
3. 完成实名认证

#### 步骤2：开通混元大模型

1. 进入控制台，搜索"混元大模型"
2. 点击"立即使用"
3. 选择合适的计费模式（免费额度/按量付费）

#### 步骤3：获取密钥

1. 进入"访问管理" → "API密钥管理"
2. 创建新的API密钥
3. 保存 `SecretId` 和 `SecretKey`

**⚠️ 重要：密钥仅显示一次，请妥善保存！**

### 3.2 配置AI服务

编辑 `utils/aiService.js`：

```javascript
const config = {
  // 腾讯云API配置
  baseURL: 'https://aichat.tencentyun.com/v1', // API地址
  secretId: 'AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // 替换为你的SecretId
  secretKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // 替换为你的SecretKey
  region: 'ap-guangzhou', // 地域：ap-guangzhou/ap-shanghai/ap-beijing
  model: 'hunyuan-lite' // 模型选择：hunyuan-lite/hunyuan-pro
}
```

### 3.3 配置域名白名单

在微信公众平台配置：

```
request合法域名：
- https://aichat.tencentyun.com
```

### 3.4 测试AI服务

```javascript
// 在控制台测试
const aiService = require('../../utils/aiService.js')

async function testAI() {
  try {
    const result = await aiService.query('香港大学怎么样？')
    console.log('AI回复：', result.content)
  } catch (error) {
    console.error('AI测试失败：', error)
  }
}

testAI()
```

---

## 💻 四、本地开发调试

### 4.1 开发环境配置

#### 方案一：关闭域名校验（开发阶段）

在微信开发者工具中：

1. 点击右上角"详情"
2. 在"本地设置"中勾选：
   - ✅ 不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书

**⚠️ 注意：**
- 此选项仅用于开发调试
- 真机预览和正式发布时必须配置合法域名

#### 方案二：使用内网穿透

开发时可以临时使用内网穿透工具：

**推荐工具：**
- [Ngrok](https://ngrok.com/) - 免费，稳定
- [花生壳](https://hsk.oray.com/) - 国内访问快
- [Frp](https://github.com/fatedier/frp) - 开源自建

**使用示例：**
```bash
# 使用Ngrok
ngrok http 8080

# 获得临时域名
https://abc123.ngrok.io
```

修改 `app.js`：
```javascript
baseUrl: 'https://abc123.ngrok.io/api'
```

### 4.2 Mock数据配置

在开发阶段，可以使用Mock数据进行测试：

```javascript
// utils/mock.js
const mockData = {
  '/news/list': {
    code: 200,
    data: {
      list: [
        { id: 1, title: '香港留学政策更新', category: '政策' },
        { id: 2, title: '新加坡大学排名', category: '资讯' }
      ]
    }
  },
  '/school/list': {
    code: 200,
    data: {
      list: [
        { id: 1, name: '香港大学', country: 'HK', rank: 26 },
        { id: 2, name: '新加坡国立大学', country: 'SG', rank: 8 }
      ]
    }
  }
}

// 在 utils/api.js 中使用
const request = (url, method = 'GET', data = {}) => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'development' && mockData[url]) {
      // 开发环境使用Mock数据
      setTimeout(() => resolve(mockData[url]), 500)
      return
    }

    // 正常请求...
  })
}
```

---

## 🔐 五、安全性配置

### 5.1 HTTPS证书配置

#### Nginx配置示例

```nginx
server {
    listen 443 ssl;
    server_name api.huananliuxue.com;

    ssl_certificate /path/to/your/certificate.pem;
    ssl_certificate_key /path/to/your/private.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 80;
    server_name api.huananliuxue.com;
    return 301 https://$server_name$request_uri;
}
```

### 5.2 CORS跨域配置

后端需要配置CORS以支持小程序请求：

```javascript
// Express.js 示例
const cors = require('cors')

app.use(cors({
  origin: ['https://servicewechat.com', 'https://servicewechat.cn'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

### 5.3 Token认证

小程序使用JWT进行用户认证：

```javascript
// 后端登录接口
app.post('/auth/login', async (req, res) => {
  const { code } = req.body

  // 验证微信code
  const { openid, session_key } = await verifyWechatCode(code)

  // 生成JWT token
  const token = jwt.sign(
    { openid, userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({
    code: 200,
    data: {
      token,
      userInfo: { openid, ...user }
    }
  })
})
```

---

## 📊 六、API监控和日志

### 6.1 请求日志记录

```javascript
// utils/logger.js
const logger = {
  logRequest(url, method, data, response) {
    console.log(`[API] ${method} ${url}`, {
      request: data,
      response: response,
      timestamp: new Date().toISOString()
    })

    // 发送到日志服务
    wx.request({
      url: app.globalData.baseUrl + '/log/api',
      method: 'POST',
      data: {
        url,
        method,
        requestData: data,
        responseData: response,
        timestamp: Date.now()
      },
      fail: (err) => {
        console.error('日志上传失败：', err)
      }
    })
  }
}

// 在 utils/api.js 中使用
const request = (url, method = 'GET', data = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.baseUrl + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: (res) => {
        logger.logRequest(url, method, data, res.data)
        resolve(res.data)
      },
      fail: (err) => {
        logger.logRequest(url, method, data, { error: err })
        reject(err)
      }
    })
  })
}
```

### 6.2 错误监控

```javascript
// utils/monitor.js
const monitor = {
  reportError(error, context = {}) {
    console.error('[Error]', error, context)

    // 上报错误
    wx.request({
      url: app.globalData.baseUrl + '/monitor/error',
      method: 'POST',
      data: {
        error: {
          message: error.message,
          stack: error.stack
        },
        context: {
          page: getCurrentPages().pop().route,
          userInfo: app.globalData.userInfo,
          ...context
        },
        timestamp: Date.now()
      },
      fail: (err) => {
        console.error('错误上报失败：', err)
      }
    })
  }
}

// 在页面中使用
Page({
  onLoad() {
    try {
      // 业务代码
    } catch (error) {
      monitor.reportError(error, { page: 'index' })
    }
  }
})
```

---

## ✅ 七、配置检查清单

### 7.1 发布前检查

在提交审核前，请确认以下配置：

- [ ] 服务器域名已配置白名单
- [ ] 所有域名使用HTTPS
- [ ] HTTPS证书有效
- [ ] 域名已备案
- [ ] app.js 中 `baseUrl` 已更新为生产环境
- [ ] aiService.js 中 AI密钥已配置
- [ ] 测试环境数据已清除
- [ ] 关闭了"不校验合法域名"选项
- [ ] API接口在生产环境可访问
- [ ] 登录/注册功能正常
- [ ] 数据加载和提交正常

### 7.2 域名白名单检查

在微信公众平台确认：

- [ ] request合法域名配置正确
- [ ] uploadFile合法域名配置正确
- [ ] downloadFile合法域名配置正确
- [ ] socket合法域名配置正确（如需要）

### 7.3 本地开发检查

开发时确认：

- [ ] 已关闭域名校验（开发阶段）
- [ ] Mock数据正常工作
- [ ] 本地API服务正常启动
- [ ] 内网穿透工具正常（如使用）

---

## 🔍 八、常见问题

### Q1: 域名配置后仍然报错？

**原因：**
- 域名配置未生效（需要几分钟）
- 证书无效或过期
- 域名未备案

**解决方法：**
```bash
# 检查域名解析
nslookup api.huananliuxue.com

# 检查HTTPS证书
curl -I https://api.huananliuxue.com

# 检查API连通性
curl -X GET https://api.huananliuxue.com/api/health
```

### Q2: 开发工具可以，真机预览失败？

**原因：**
- 真机需要使用合法域名
- 临时域名（如ngrok）不稳定

**解决方法：**
- 使用正式域名进行真机预览
- 或在真机上连接内网WiFi

### Q3: Token过期怎么办？

**解决方法：**
```javascript
// 在 utils/api.js 中已实现自动处理
if (res.statusCode === 401) {
  // token过期，重新登录
  wx.removeStorageSync('token')
  wx.removeStorageSync('openid')
  app.globalData.userInfo = null
  wx.showModal({
    title: '提示',
    content: '登录已过期，请重新登录',
    showCancel: false
  })
}
```

### Q4: AI服务调用失败？

**常见原因：**
- 密钥配置错误
- 域名未配置白名单
- 账户余额不足
- 超出免费额度

**解决方法：**
1. 检查密钥是否正确
2. 确认域名已添加到白名单
3. 查看腾讯云控制台余额
4. 查看API调用日志

### Q5: 如何区分开发和生产环境？

**方法：**
```javascript
// app.js
const ENV = process.env.NODE_ENV || 'development'

// 或通过编译条件
const isDev = __wxConfig.envVersion === 'develop'
const isTrial = __wxConfig.envVersion === 'trial'
const isRelease = __wxConfig.envVersion === 'release'
```

---

## 📞 九、技术支持

如有问题，请联系：

- 微信开发者文档：https://developers.weixin.qq.com/miniprogram/dev/framework/server-communication.html
- 腾讯云文档：https://cloud.tencent.com/document/product
- 开发者社区：https://developers.weixin.qq.com/community/

---

## 📚 十、参考文档

- [微信小程序网络请求](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html)
- [服务器域名配置](https://developers.weixin.qq.com/miniprogram/dev/framework/server-communication/domain-white.html)
- [腾讯云混元大模型](https://cloud.tencent.com/document/product/1729/104753)
- [HTTPS证书申请](https://letsencrypt.org/zh-cn/)

---

**配置完成后，建议进行完整的功能测试，确保所有API接口正常工作。**
