# 环境变量说明

## 配置文件说明

`config.example.js` 是环境配置文件的模板，请按照以下步骤创建自己的配置文件：

## 配置步骤

### 1. 复制配置文件

```bash
# 复制配置模板
cp config.example.js config.js
```

### 2. 修改配置内容

编辑 `config.js` 文件，根据实际环境修改以下配置：

#### 基础配置

```javascript
const BASE_CONFIG = {
  appId: 'wx7882270d386b1f0b',  // 你的小程序AppID
  appName: '华南留学',            // 小程序名称
  version: '1.0.0',              // 版本号
  env: 'development'             // 当前环境
}
```

#### 开发环境配置

```javascript
const DEVELOPMENT_CONFIG = {
  baseUrl: 'https://dev-api.huananliuxue.com/api',  // 开发环境API地址
  aiBaseUrl: 'https://dev-aichat.tencentyun.com/v1', // 开发环境AI地址
  aiSecretId: '',      // 腾讯云SecretId（开发环境）
  aiSecretKey: '',     // 腾讯云SecretKey（开发环境）
  debug: true,         // 开启调试模式
  useMock: true,       // 使用Mock数据
  logLevel: 'debug'    // 日志级别
}
```

#### 预发布环境配置

```javascript
const STAGING_CONFIG = {
  baseUrl: 'https://staging-api.huananliuxue.com/api',
  aiBaseUrl: 'https://staging-aichat.tencentyun.com/v1',
  aiSecretId: '',      // 腾讯云SecretId（预发布环境）
  aiSecretKey: '',     // 腾讯云SecretKey（预发布环境）
  debug: false,        // 关闭调试模式
  useMock: false,      // 不使用Mock数据
  logLevel: 'info'
}
```

#### 生产环境配置

```javascript
const PRODUCTION_CONFIG = {
  baseUrl: 'https://api.huananliuxue.com/api',
  aiBaseUrl: 'https://aichat.tencentyun.com/v1',
  aiSecretId: '',      // 腾讯云SecretId（生产环境，必填）
  aiSecretKey: '',     // 腾讯云SecretKey（生产环境，必填）
  debug: false,
  useMock: false,
  logLevel: 'warn'
}
```

## 配置项说明

### 1. API配置

| 配置项 | 说明 | 示例 |
|--------|------|------|
| `baseUrl` | 后端API基础地址 | `https://api.huananliuxue.com/api` |
| `aiBaseUrl` | AI服务API地址 | `https://aichat.tencentyun.com/v1` |

### 2. AI服务配置

| 配置项 | 说明 | 获取方式 |
|--------|------|----------|
| `aiSecretId` | 腾讯云SecretId | 腾讯云控制台 → 访问管理 → API密钥 |
| `aiSecretKey` | 腾讯云SecretKey | 同上 |
| `aiRegion` | 地域 | ap-guangzhou/ap-shanghai/ap-beijing |
| `aiModel` | 模型 | hunyuan-lite/hunyuan-pro |

### 3. 调试配置

| 配置项 | 说明 | 可选值 |
|--------|------|--------|
| `debug` | 是否开启调试 | true/false |
| `useMock` | 是否使用Mock数据 | true/false |
| `logLevel` | 日志级别 | debug/info/warn/error |

## 环境切换

### 方式一：修改配置文件

修改 `config.js` 中的 `ENV` 变量：

```javascript
const ENV = process.env.NODE_ENV || 'production' // 改为 production
```

### 方式二：使用环境变量

```bash
# 开发环境
NODE_ENV=development

# 预发布环境
NODE_ENV=staging

# 生产环境
NODE_ENV=production
```

### 方式三：在微信开发者工具中

在 `app.js` 中读取微信环境版本：

```javascript
const envVersion = __wxConfig.envVersion

// envVersion: develop（开发版）, trial（体验版）, release（正式版）
```

## 使用配置

### 在 app.js 中使用

```javascript
const config = require('../config.js')

App({
  globalData: {
    userInfo: null,
    openid: null,
    baseUrl: config.getConfig().baseUrl,
    aiBaseUrl: config.getConfig().aiBaseUrl
  },
  
  onLoad() {
    console.log('当前环境：', config.getConfig().env)
    console.log('API地址：', config.getConfig().baseUrl)
  }
})
```

### 在页面中使用

```javascript
const config = require('../../config.js')

Page({
  onLoad() {
    const cfg = config.getConfig()
    console.log('调试模式：', cfg.debug)
    
    if (cfg.debug) {
      console.log('调试信息')
    }
  }
})
```

### 在AI服务中使用

```javascript
const config = require('../config.js')
const cfg = config.getConfig()

const aiConfig = {
  baseURL: cfg.aiBaseUrl,
  secretId: cfg.aiSecretId,
  secretKey: cfg.aiSecretKey,
  region: cfg.aiRegion,
  model: cfg.aiModel
}
```

## 安全注意事项

⚠️ **重要提醒：**

1. **不要将 `config.js` 提交到Git仓库**
   - 添加到 `.gitignore` 文件：
   ```
   config.js
   ```

2. **生产环境密钥保密**
   - 生产环境的 `aiSecretId` 和 `aiSecretKey` 要妥善保管
   - 不要在前端代码中硬编码（可以考虑使用云函数）

3. **定期更新密钥**
   - 建议每3个月更新一次API密钥
   - 及时删除不使用的密钥

4. **不同环境使用不同密钥**
   - 开发、预发布、生产环境使用不同的密钥
   - 限制每个密钥的权限范围

## 配置示例

### 开发环境示例

```javascript
const DEVELOPMENT_CONFIG = {
  baseUrl: 'http://localhost:3000/api',  // 本地开发
  aiBaseUrl: 'https://aichat.tencentyun.com/v1',
  aiSecretId: 'AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  aiSecretKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  debug: true,
  useMock: true,
  logLevel: 'debug'
}
```

### 生产环境示例

```javascript
const PRODUCTION_CONFIG = {
  baseUrl: 'https://api.huananliuxue.com/api',
  aiBaseUrl: 'https://aichat.tencentyun.com/v1',
  aiSecretId: 'AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxx',  // 正式密钥
  aiSecretKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  debug: false,
  useMock: false,
  logLevel: 'warn'
}
```

## 常见问题

### Q1: 配置不生效？

**检查：**
1. 是否正确复制了 `config.example.js` 为 `config.js`
2. 是否修改了 `ENV` 变量
3. 是否在代码中正确引用了配置文件

### Q2: 如何在本地测试生产环境？

**方法：**
```javascript
// 临时修改 config.js
const ENV = 'production'  // 改为 production
```

### Q3: Mock数据不生效？

**检查：**
1. `useMock` 是否设置为 `true`
2. Mock数据文件是否正确配置
3. 检查 `utils/api.js` 中的Mock逻辑

## 配置检查清单

配置完成后，请检查以下项目：

- [ ] 已复制 `config.example.js` 为 `config.js`
- [ ] 已修改 `appId` 为自己的小程序AppID
- [ ] 已配置开发环境API地址
- [ ] 已配置预发布环境API地址
- [ ] 已配置生产环境API地址
- [ ] 已配置腾讯云AI密钥
- [ ] `config.js` 已添加到 `.gitignore`
- [ ] 测试环境切换是否正常
- [ ] 测试API调用是否正常
- [ ] 测试AI服务是否正常
