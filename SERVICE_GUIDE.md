# 华南留学智能客服接入指南

## 📋 功能概述

智能客服系统采用**混合模式**（规则引擎 + AI大模型 + 人工客服），为用户提供7x24小时的留学咨询服务。

### 核心功能

✅ **规则引擎FAQ** - 基于关键词匹配的快速问答
✅ **AI智能问答** - 腾讯云混元大模型深度问答
✅ **人工客服接入** - 无缝转接人工服务
✅ **多模态支持** - 文本、图片、文件上传
✅ **快捷回复** - 智能推荐相关问题

---

## 🏗️ 系统架构

### 三层服务架构

```
用户输入
    ↓
┌─────────────────────────────┐
│  第一层：规则引擎FAQ库        │
│  - 关键词匹配                 │
│  - 快速响应                   │
│  - 覆盖常见问题               │
└─────────────────────────────┘
    ↓ 未匹配
┌─────────────────────────────┐
│  第二层：AI智能问答          │
│  - 腾讯云混元大模型          │
│  - 自然语言理解              │
│  - 智能推理生成              │
└─────────────────────────────┘
    ↓ 复杂问题
┌─────────────────────────────┐
│  第三层：人工客服            │
│  - 专业顾问                  │
│  - 一对一服务                │
│  - 深度咨询                  │
└─────────────────────────────┘
```

---

## 📁 文件结构

```
华南留学小程序/
├── pages/
│   └── customer-service/           # 智能客服页面
│       ├── customer-service.wxml   # 页面结构
│       ├── customer-service.wxss   # 页面样式
│       ├── customer-service.js     # 页面逻辑
│       └── customer-service.json   # 页面配置
├── utils/
│   ├── ruleEngine.js               # 规则引擎FAQ库
│   └── aiService.js                # 腾讯云AI服务
```

---

## 🔧 配置步骤

### 1. 注册腾讯云AI服务

#### 1.1 开通腾讯云账号

1. 访问腾讯云：https://cloud.tencent.com/
2. 注册/登录账号
3. 完成实名认证

#### 1.2 开通混元大模型

1. 进入腾讯云控制台
2. 搜索"混元大模型"
3. 点击"立即使用"
4. 创建密钥（SecretId、SecretKey）

**注意保存密钥，配置时需要使用！**

### 2. 配置小程序

#### 2.1 修改AI服务配置

编辑 `utils/aiService.js` 文件：

```javascript
const config = {
  baseURL: 'https://aichat.tencentyun.com/v1', // API地址
  secretId: 'YOUR_SECRET_ID',                   // 替换为你的SecretId
  secretKey: 'YOUR_SECRET_KEY',                 // 替换为你的SecretKey
  region: 'ap-guangzhou',                       // 地域
  model: 'hunyuan-lite'                         // 模型选择
}
```

#### 2.2 配置服务器域名

1. 登录微信公众平台
2. 进入"开发" → "开发设置"
3. 在"服务器域名"中添加：
   ```
   request合法域名: https://aichat.tencentyun.com
   ```

### 3. 接入腾讯云智能客服（可选）

如果使用腾讯云小钛智能客服系统：

#### 3.1 创建机器人

1. 登录腾讯云控制台
2. 进入"智能客服" → "机器人管理"
3. 创建智能客服机器人
4. 配置知识库、对话流程等
5. 记录机器人ID（productId）

#### 3.2 集成到小程序

修改 `utils/aiService.js`，使用腾讯云小钛API：

```javascript
// 使用小钛API
async function queryWithBot(question, context) {
  const botId = 'YOUR_BOT_ID' // 机器人ID
  const userId = context.userId || 'anonymous'

  // 调用小钛API
  wx.request({
    url: `https://iask.qq.com/mclient/#/client?productId=${botId}&uuid=${userId}`,
    method: 'POST',
    data: {
      question: question,
      userId: userId
    },
    success: (res) => {
      return res.data
    }
  })
}
```

---

## 📖 使用说明

### 页面入口

在任意页面添加客服入口：

```html
<!-- 方式1：按钮跳转 -->
<button bindtap="goToService">智能客服</button>

<!-- 方式2：悬浮按钮 -->
<view class="float-btn" bindtap="goToService">
  <text>💬</text>
</view>

<!-- 方式3：首页Banner -->
<view class="service-banner" bindtap="goToService">
  <image src="/images/icon/service.png"></image>
  <text>智能客服为您服务</text>
</view>
```

```javascript
// 页面JS
Page({
  goToService() {
    wx.navigateTo({
      url: '/pages/customer-service/customer-service'
    })
  }
})
```

### 对话示例

#### 示例1：规则匹配

**用户**：香港大学怎么样？
**客服**：香港大学（HKU）
1. 学校概况：
- 建校于1911年，香港历史最悠久的大学
- 2024 QS世界排名：第26位
- 亚洲顶尖综合性大学
2. 热门专业：医学、法律、商科、工程、建筑学
...

#### 示例2：AI问答

**用户**：我的GPA只有3.0，能申请到香港的好大学吗？
**客服**：根据您的GPA情况，我有以下建议：

1. **保底学校**（录取概率高）：
- 香港浸会大学
- 香港教育大学
- 香港岭南大学

2. **冲刺学校**（可以尝试）：
- 香港理工大学
- 香港城市大学

3. **提升建议**：
- 提高雅思成绩（目标7.0+）
- 准备优秀的PS和推荐信
- 参加相关实习或科研
- 考虑GRE/GMAT成绩

建议您预约专业顾问进行详细评估和规划。

#### 示例3：转人工

**用户**：我想申请香港大学，具体需要准备什么材料？
**客服**：（回答后出现"转人工客服"按钮）
**用户**：（点击转人工）
**客服**：正在为您转接人工客服，请稍候...
**人工客服**：您好，我是人工客服。请问有什么可以帮助您的？

---

## 🎨 自定义配置

### 1. 扩展FAQ知识库

编辑 `utils/ruleEngine.js`：

```javascript
// 添加新的FAQ条目
{
  keywords: ['关键词1', '关键词2'],
  category: 'policy', // 分类：policy/school/guide/cost/general
  content: 'FAQ内容...',
  quickReplies: ['快捷回复1', '快捷回复2']
}
```

### 2. 自定义AI提示词

编辑 `utils/aiService.js` 中的system prompt：

```javascript
{
  role: 'system',
  content: '你是华南留学的智能客服助手，...（自定义你的提示词）'
}
```

### 3. 修改客服头像

编辑 `pages/customer-service/customer-service.js`：

```javascript
data: {
  robotAvatar: '/images/icon/robot-avatar.png',  // 机器人头像
  userAvatar: '/images/icon/user-avatar.png',     // 用户头像
  humanAvatar: '/images/icon/human-avatar.png'    // 人工客服头像
}
```

---

## 🔌 接入真实API

### 腾讯云混元大模型API调用

```javascript
// utils/aiService.js
const tencentcloud = require('tencentcloud-sdk-nodejs')

const ChatBotClient = tencentcloud.aichat.v20230301.Client

const clientConfig = {
  credential: {
    secretId: config.secretId,
    secretKey: config.secretKey,
  },
  region: config.region,
  profile: {
    httpProfile: {
      endpoint: 'aichat.tencentcloudapi.com',
    },
  },
}

const client = new ChatBotClient(clientConfig)

async function queryWithRealAPI(question, context) {
  const params = {
    Model: config.model,
    Messages: [
      {
        Role: 'user',
        Content: question
      }
    ]
  }

  try {
    const response = await client.ChatCompletions(params)
    return {
      content: response.Response.Choices[0].Message.Content,
      model: config.model
    }
  } catch (error) {
    console.error('API调用失败：', error)
    throw error
  }
}
```

### 安装依赖

```bash
npm install tencentcloud-sdk-nodejs
```

---

## 📊 数据统计（可选）

### 记录对话数据

```javascript
// utils/statistics.js
const db = wx.cloud.database()

async function recordConversation(data) {
  return db.collection('conversations').add({
    data: {
      sessionId: data.sessionId,
      userId: data.userId,
      messages: data.messages,
      mode: data.mode, // ai/human
      satisfaction: data.satisfaction,
      createTime: new Date()
    }
  })
}
```

### 查看统计

```javascript
// 查看FAQ匹配率
async function getStatistics() {
  const db = wx.cloud.database()

  const total = await db.collection('conversations').count()
  const ruleMatched = await db.collection('conversations')
    .where({ mode: 'ai' })
    .count()

  const matchRate = (ruleMatched / total * 100).toFixed(2)

  return {
    total,
    ruleMatched,
    aiUsed: total - ruleMatched,
    matchRate: `${matchRate}%`
  }
}
```

---

## 🎯 最佳实践

### 1. 优化FAQ质量

- ✅ 覆盖80%的常见问题
- ✅ 关键词设置准确
- ✅ 回答简洁清晰
- ✅ 提供快捷回复

### 2. AI提示词优化

- ✅ 明确角色定位
- ✅ 设定回答风格
- ✅ 限制回答长度
- ✅ 添加安全边界

### 3. 人工服务策略

- ✅ 工作时间：9:00-21:00
- ✅ 复杂问题自动转人工
- ✅ 用户主动转接
- ✅ 满意度反馈

### 4. 性能优化

- ✅ FAQ优先级高于AI
- ✅ AI响应添加loading
- ✅ 消息滚动平滑
- ✅ 图片压缩上传

---

## ❓ 常见问题

### Q1: AI响应很慢怎么办？

**A:**
- 检查网络连接
- 使用更轻量的模型（hunyuan-lite）
- 增加超时时间配置

### Q2: 如何提高FAQ匹配率？

**A:**
- 添加更多关键词
- 优化关键词匹配算法
- 定期分析用户问题更新FAQ

### Q3: 转人工后如何恢复AI？

**A:**
```javascript
// 在客服页面添加恢复AI按钮
restoreAI() {
  this.setData({
    currentMode: 'ai'
  })
}
```

### Q4: 如何限制AI回答长度？

**A:**
在API调用时设置max_tokens参数：
```javascript
max_tokens: 500 // 限制500个token
```

---

## 📞 技术支持

如有问题，请联系：

- 腾讯云文档：https://cloud.tencent.com/document/product
- 微信开发者社区：https://developers.weixin.qq.com/community/
- 官方客服：通过小程序"转人工"咨询

---

## 🚀 未来规划

- [ ] 支持语音输入和语音播报
- [ ] 支持视频通话
- [ ] 多轮对话上下文记忆
- [ ] 智能推荐学校和专业
- [ ] 留学申请进度查询
- [ ] 用户满意度评分

---

**华南留学智能客服，7x24小时为您服务！🎓**
