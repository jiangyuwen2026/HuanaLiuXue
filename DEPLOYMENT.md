# 华南留学小程序部署指南

## 一、准备工作

### 1.1 注册微信小程序账号

1. **访问微信公众平台**
   - 网址：https://mp.weixin.qq.com/
   - 点击"立即注册"
   - 选择"小程序"类型

2. **填写基本信息**
   - 账号名称：华南留学
   - 帐号简介：专注于香港、新加坡、马来西亚及英联邦国家留学服务的专业平台
   - 服务类目：教育 → 留学服务 / 教育培训

3. **完成邮箱验证**
   - 使用企业邮箱完成验证
   - 登录邮箱点击激活链接

4. **信息登记**
   - 选择"企业"类型
   - 填写企业信息：
     - 企业名称：[请填写您的公司全称]
     - 营业执照注册号：[填写营业执照号码]
     - 法人信息：[填写法人姓名和身份证号]
   - 上传营业执照照片
   - 上传运营者身份证照片

5. **管理员信息确认**
   - 扫码确认管理员身份
   - 绑定管理员微信

### 1.2 获取小程序AppID

1. 登录微信公众平台：https://mp.weixin.qq.com/
2. 进入"开发" → "开发设置"
3. 找到"开发者ID" → 复制 `AppID`
4. **保存AppID，后续配置需要使用**

---

## 二、微信开发者工具配置

### 2.1 下载安装微信开发者工具

1. **下载地址**
   - Windows: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
   - macOS: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

2. **安装步骤**
   - 下载对应平台的安装包
   - 运行安装程序
   - 使用微信扫码登录

### 2.2 导入项目

1. 打开微信开发者工具
2. 点击"导入项目"
3. **填写项目信息**
   - 项目名称：华南留学
   - 目录：选择 `/Users/jiangyuwen/WorkBuddy/20260310085315`
   - AppID：粘贴刚才获取的AppID
   - 开发模式：小程序
   - 后端服务：不使用云服务（如需要可改为"使用云服务"）

4. 点击"导入"

### 2.3 配置AppID

**方法一：在开发者工具中配置**
1. 点击右上角"详情"
2. 在"本地设置"中确认AppID已正确填写

**方法二：直接修改配置文件**
```bash
# 编辑 project.config.json 文件
{
  "appid": "你的AppID",
  "projectname": "华南留学",
  ...
}
```

---

## 三、项目配置检查

### 3.1 检查基本信息

在微信开发者工具中确认：

✅ 项目名称显示为"华南留学"  
✅ AppID显示正确（以 `wx` 开头）  
✅ 项目目录路径正确  
✅ 没有报错信息

### 3.2 检查pages.json配置

确认 `app.json` 中的页面路径配置完整：

```json
{
  "pages": [
    "pages/index/index",
    "pages/news/news",
    "pages/news/detail/news-detail",
    "pages/school/school",
    "pages/school/detail/school-detail",
    "pages/major/major",
    "pages/major/detail/major-detail",
    "pages/guide/guide",
    "pages/consultant/consultant",
    "pages/consultant/detail/consultant-detail",
    "pages/appointment/appointment",
    "pages/appointment/my-appointments",
    "pages/case/case",
    "pages/case/detail/case-detail",
    "pages/user/user"
  ]
}
```

### 3.3 检查TabBar配置

确认底部导航栏配置正确：

```json
{
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#1890ff",
    "backgroundColor": "#ffffff",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "images/tab/home.png",
        "selectedIconPath": "images/tab/home-active.png"
      },
      {
        "pagePath": "pages/school/school",
        "text": "学校",
        "iconPath": "images/tab/school.png",
        "selectedIconPath": "images/tab/school-active.png"
      },
      {
        "pagePath": "pages/consultant/consultant",
        "text": "顾问",
        "iconPath": "images/tab/consultant.png",
        "selectedIconPath": "images/tab/consultant-active.png"
      },
      {
        "pagePath": "pages/appointment/appointment",
        "text": "预约",
        "iconPath": "images/tab/appointment.png",
        "selectedIconPath": "images/tab/appointment-active.png"
      },
      {
        "pagePath": "pages/user/user",
        "text": "我的",
        "iconPath": "images/tab/user.png",
        "selectedIconPath": "images/tab/user-active.png"
      }
    ]
  }
}
```

---

## 四、准备图片资源

### 4.1 TabBar图标（必需）

需要准备10个图标文件（5个选中+5个未选中）：

**文件规格要求：**
- 尺寸：81px × 81px
- 格式：PNG
- 背景：透明

**所需文件：**
```
images/tab/
├── home.png              # 首页图标（未选中）
├── home-active.png       # 首页图标（选中）
├── school.png            # 学校图标（未选中）
├── school-active.png     # 学校图标（选中）
├── consultant.png        # 顾问图标（未选中）
├── consultant-active.png # 顾问图标（选中）
├── appointment.png       # 预约图标（未选中）
├── appointment-active.png # 预约图标（选中）
├── user.png              # 我的图标（未选中）
└── user-active.png       # 我的图标（选中）
```

**设计建议：**
- 未选中图标：灰色（#999999）
- 选中图标：蓝色（#1890ff）
- 图标简洁明了，符合各页面主题

### 4.2 页面图片资源

根据设计需求准备以下图片：

```
images/
├── bg/
│   ├── banner-home.jpg      # 首页Banner
│   ├── banner-school.jpg    # 学校页Banner
│   └── banner-consultant.jpg # 顾问页Banner
├── icon/
│   ├── arrow-right.png      # 箭头图标
│   ├── search.png           # 搜索图标
│   └── placeholder.png      # 默认占位图
└── temp/
    └── avatar-default.png   # 默认头像
```

### 4.3 替换占位图片

将准备好的图标文件复制到对应目录：

```bash
# 将图标文件复制到 images/tab/ 目录
# 将背景图复制到 images/bg/ 目录
# 将小图标复制到 images/icon/ 目录
```

**临时解决方案：**

如果暂时没有设计好的图标，可以使用以下方法：

1. **使用纯色图标**：在每个 `iconPath` 和 `selectedIconPath` 中暂时注释掉，使用文字标签
2. **使用在线图标库**：从 iconfont、iconfinder 等网站下载免费图标
3. **使用设计师制作**：找UI设计师制作专业图标

---

## 五、配置服务器域名

### 5.1 了解域名配置需求

小程序对网络请求有限制，需要将以下域名添加到"服务器域名"白名单：

- **request合法域名**：API接口域名
- **uploadFile合法域名**：文件上传域名
- **downloadFile合法域名**：文件下载域名
- **socket合法域名**：WebSocket连接域名

### 5.2 配置步骤

1. **登录微信公众平台**
   - 进入"开发" → "开发设置"

2. **添加服务器域名**
   - 在"服务器域名"区域点击"修改"
   - 根据后端服务配置添加相应域名

3. **示例配置**
   ```
   request合法域名: https://api.huananliuxue.com
   uploadFile合法域名: https://api.huananliuxue.com
   downloadFile合法域名: https://api.huananliuxue.com
   ```

**注意：**
- 域名必须使用HTTPS协议
- 域名需要ICP备案
- 每个月只能修改5次
- 开发阶段可以使用"不校验合法域名"（仅用于开发）

### 5.3 配置项目API地址

修改 `utils/api.js` 文件，配置后端接口地址：

```javascript
// 配置API基础URL
const BASE_URL = 'https://api.huananliuxue.com/api'

// 示例：根据实际情况修改
const BASE_URL = 'https://your-domain.com/api'
```

---

## 六、本地测试

### 6.1 编译预览

1. 点击开发者工具顶部的"编译"按钮
2. 查看模拟器中的小程序界面
3. 测试各个功能模块

### 6.2 功能测试清单

**基础功能测试：**
- ✅ 首页加载正常
- ✅ TabBar导航切换正常
- ✅ 页面跳转正常
- ✅ 返回按钮正常

**核心功能测试：**
- ✅ 资讯列表加载、详情查看
- ✅ 学校/专业列表加载、筛选功能
- ✅ 申请指导内容展示
- ✅ 顾问列表、详情展示
- ✅ 预约表单提交
- ✅ 成功案例浏览
- ✅ 用户中心功能

**交互测试：**
- ✅ 点击响应及时
- ✅ 加载状态显示
- ✅ 错误提示友好
- ✅ 下拉刷新
- ✅ 上拉加载更多

### 6.3 真机预览

1. 点击"预览"按钮
2. 使用微信扫描二维码
3. 在手机上查看实际效果
4. 测试真机兼容性

### 6.4 调试工具

使用开发者工具的调试功能：
- **Console**：查看日志输出
- **Network**：查看网络请求
- **Storage**：查看本地存储
- **AppData**：查看页面数据

---

## 七、提交审核

### 7.1 提交前检查清单

**代码检查：**
- ✅ 所有页面可正常访问
- ✅ 没有明显的Bug
- ✅ 错误提示友好清晰
- ✅ 加载状态显示
- ✅ 网络请求处理完善

**内容检查：**
- ✅ 小程序名称与备案一致：华南留学
- ✅ 小程序头像已上传
- ✅ 小程序简介已填写
- ✅ 服务类目选择正确
- ✅ 测试账号已提供（如有需要）

**资源检查：**
- ✅ TabBar图标已配置
- ✅ 页面图片已替换
- ✅ 没有使用未经授权的素材

### 7.2 上传代码

1. **点击"上传"按钮**
2. **填写版本信息**
   - 版本号：1.0.0
   - 项目备注：华南留学小程序首次上线

3. **等待上传完成**

### 7.3 提交审核

1. **登录微信公众平台**
2. 进入"版本管理"
3. 找到刚才上传的版本
4. 点击"提交审核"
5. **填写审核信息**
   - 测试账号：（如需要登录功能，提供测试账号）
   - 功能页面：选择主要功能入口页面
   - 备注说明：简要说明小程序功能

### 7.4 审核时间

- 正常审核时间：1-7个工作日
- 可以通过"审核状态"查看进度
- 审核通过后会收到微信通知

### 7.5 常见审核问题

**内容类问题：**
- 服务类目与实际功能不符
- 小程序名称与备案信息不一致
- 内容含有违规信息
- 测试账号无法登录

**技术类问题：**
- 页面无法正常加载
- 存在明显Bug
- 用户权限申请不合理
- 隐私协议不规范

**解决方法：**
- 根据审核反馈修改问题
- 重新上传代码
- 再次提交审核

---

## 八、审核通过后发布

### 8.1 发布上线

1. 审核通过后，登录微信公众平台
2. 进入"版本管理"
3. 点击"发布"
4. 确认发布信息
5. 等待发布完成

### 8.2 发布后检查

1. 在微信中搜索"华南留学"
2. 查看小程序是否能正常打开
3. 测试核心功能是否正常
4. 收集用户反馈

---

## 九、后期维护

### 9.1 版本更新

1. 在开发者工具中修改代码
2. 上传新版本
3. 提交审核
4. 审核通过后发布

### 9.2 数据监控

登录微信公众平台查看：
- 用户访问数据
- 页面访问分析
- 用户留存率
- 功能使用情况

### 9.3 用户反馈

- 在"客服"功能中回复用户消息
- 收集用户建议
- 持续优化产品

---

## 十、常见问题

### Q1: TabBar图标不显示？

**原因：** 图片路径或格式不对

**解决：**
- 检查文件路径是否正确
- 确认图片是PNG格式
- 确认图片尺寸是81px×81px
- 重新编译项目

### Q2: 页面打不开？

**原因：** 页面路径配置错误

**解决：**
- 检查 `app.json` 中 `pages` 数组
- 确认路径与实际目录结构一致
- 重启开发者工具

### Q3: 网络请求失败？

**原因：** 域名未配置或未使用HTTPS

**解决：**
- 在微信公众后台配置服务器域名
- 确认使用HTTPS协议
- 开发阶段可勾选"不校验合法域名"

### Q4: 审核不通过？

**原因：** 内容或技术问题

**解决：**
- 仔细阅读审核反馈
- 修改相应问题
- 重新提交审核

### Q5: 小程序名称被占用？

**原因：** 名称已被其他小程序使用

**解决：**
- 更换小程序名称
- 或加后缀区分（如：华南留学服务）

---

## 十一、联系方式

如有问题，可咨询：

- 微信开放社区：https://developers.weixin.qq.com/community/
- 微信官方客服：通过微信公众平台联系
- 技术支持：小程序文档 https://developers.weixin.qq.com/miniprogram/dev/framework/

---

## 十二、部署时间表建议

| 阶段 | 任务 | 预计时间 |
|------|------|----------|
| 准备阶段 | 注册账号、获取AppID | 1-2天 |
| 配置阶段 | 配置开发者工具、准备图片 | 1天 |
| 开发阶段 | 后端开发、数据对接 | 7-14天 |
| 测试阶段 | 功能测试、Bug修复 | 3-5天 |
| 提交审核 | 提交审核、等待结果 | 1-7天 |
| 上线发布 | 正式发布 | 1天 |

**总计：约2-4周**

---

**祝您的华南留学小程序上线成功！🎉**
