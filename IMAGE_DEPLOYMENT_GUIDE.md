# 华南留学小程序 - 图片部署操作手册

## 📋 目录

1. [概述](#概述)
2. [图片规范](#图片规范)
3. [准备工作](#准备工作)
4. [部署流程](#部署流程)
5. [图片分类](#图片分类)
6. [检查清单](#检查清单)
7. [常见问题](#常见问题)
8. [维护指南](#维护指南)

---

## 概述

本文档指导如何为华南留学小程序部署和管理图片资源。

### 图片用途分类

| 分类 | 说明 | 示例 |
|------|------|------|
| 轮播图 | 首页轮播广告 | 活动宣传、品牌展示 |
| 功能图标 | 首页菜单图标 | 学校查询、专业查询等 |
| 学校图片 | 学校展示 | 校园照片、建筑图 |
| 资讯封面 | 资讯列表缩略图 | 文章封面 |
| 顾问头像 | 顾问团队展示 | 个人照片 |
| TabBar图标 | 底部导航图标 | 首页、资讯等 |
| 其他图标 | 各类功能图标 | 按钮、标签等 |

---

## 图片规范

### 尺寸规范

| 图片类型 | 尺寸 | 格式 | 大小限制 |
|---------|------|------|----------|
| 轮播图 | 750 × 360 px | JPG/PNG | ≤ 500KB |
| 功能图标 | 96 × 96 px | PNG (透明) | ≤ 50KB |
| 学校封面 | 750 × 500 px | JPG/PNG | ≤ 300KB |
| 资讯封面 | 400 × 300 px | JPG/PNG | ≤ 200KB |
| 顾问头像 | 120 × 120 px | JPG/PNG | ≤ 100KB |
| TabBar图标 | 81 × 81 px | PNG (透明) | ≤ 20KB |

### 命名规范

#### 文件命名规则

```
[类型]_[标识]_[序号].[扩展名]
```

**示例：**

```
# 轮播图
banner_home_01.jpg
banner_activity_02.jpg

# 功能图标
icon_school.png
icon_major.png
icon_guide.png

# 学校图片
school_hku_cover.jpg
school_nus_building_01.jpg

# 资讯封面
news_hk_2025_01.jpg
news_sg_policy.jpg

# 顾问头像
consultant_chen_avatar.jpg
consultant_liu_avatar.jpg
```

#### 命名注意事项

- ✅ 使用小写字母
- ✅ 使用下划线分隔
- ✅ 使用数字编号
- ❌ 避免使用中文字符
- ❌ 避免使用特殊符号
- ❌ 避免使用空格

---

## 准备工作

### 1. 确定图片存储方案

#### 方案一：小程序本地存储

**适用场景：** 图片数量少，不常更新

```javascript
// images 目录结构
images/
├── banner/
│   ├── banner_01.jpg
│   └── banner_02.jpg
├── icons/
│   ├── icon_school.png
│   └── icon_major.png
├── schools/
│   └── hku_cover.jpg
├── news/
│   └── news_01.jpg
└── consultants/
    └── avatar_01.jpg
```

**优点：**
- 加载速度快
- 无需服务器配置
- 简单易用

**缺点：**
- 占用小程序包体积
- 不适合大量图片
- 更新需要重新上传

#### 方案二：CDN 云存储（推荐）

**适用场景：** 图片数量多，需要经常更新

**支持的云存储：**
- 腾讯云 COS
- 阿里云 OSS
- 七牛云
- 微信云开发存储

**优点：**
- 不占用小程序体积
- 支持大量图片
- 更新方便
- CDN 加速

**缺点：**
- 需要配置云服务
- 需要网络加载

### 2. 工具准备

| 工具 | 用途 | 推荐版本 |
|------|------|----------|
| Photoshop | 图片编辑 | CC 2020+ |
| TinyPNG | 图片压缩 | 在线工具 |
| 图片格式转换工具 | 格式转换 | 在线工具 |
| 批量重命名工具 | 文件重命名 | Bulk Rename Utility |

---

## 部署流程

### 步骤一：图片准备

#### 1.1 收集原始图片

```
检查清单：
□ 收集所有需要的原始图片
□ 确认图片版权合规
□ 确认图片质量清晰
```

#### 1.2 图片编辑

使用 Photoshop 或其他工具编辑图片：

```javascript
// Photoshop 批处理设置
1. 打开 Photoshop
2. 文件 → 脚本 → 图像处理器
3. 选择图片文件夹
4. 设置目标尺寸
5. 选择输出格式和质量
6. 运行批处理
```

#### 1.3 图片压缩

使用 TinyPNG 或类似工具压缩图片：

```
在线工具：
- https://tinypng.com/
- https://squoosh.app/
- https://compress-or-die.com/

压缩目标：
- 轮播图：压缩至 500KB 以下
- 功能图标：压缩至 50KB 以下
- 其他图片：压缩至规范大小以下
```

#### 1.4 图片命名

按照命名规范批量重命名：

```
Windows 批量重命名：
1. 选中所有图片
2. 右键 → 重命名
3. 输入第一个文件名（如 banner_home_）
4. 系统会自动编号

使用工具（推荐）：
- Bulk Rename Utility
- Advanced Renamer
```

### 步骤二：上传图片

#### 方案一：上传到小程序本地

```bash
# 1. 在项目根目录创建 images 文件夹
mkdir -p images/banner
mkdir -p images/icons
mkdir -p images/schools
mkdir -p images/news
mkdir -p images/consultants

# 2. 将图片复制到对应文件夹
cp /path/to/images/* images/banner/
cp /path/to/icons/* images/icons/
```

#### 方案二：上传到 CDN（以腾讯云 COS 为例）

```javascript
// 1. 登录腾讯云控制台
// https://console.cloud.tencent.com/cos

// 2. 创建存储桶
- 名称：huananliuxue-images
- 地域：选择离用户最近的地区
- 访问权限：公共读私有写

// 3. 上传图片
// 通过控制台上传或使用 SDK 上传

// 4. 配置 CDN 加速（可选）
// 设置图片缓存策略
// 设置 HTTPS 访问
```

**使用 SDK 上传示例：**

```javascript
// 安装 SDK
npm install cos-wx-sdk-v5

// 上传代码
const COS = require('cos-wx-sdk-v5');

const cos = new COS({
  SecretId: '你的SecretId',
  SecretKey: '你的SecretKey',
});

function uploadImage(filePath, fileName) {
  return new Promise((resolve, reject) => {
    cos.postObject({
      Bucket: 'huananliuxue-images',
      Region: 'ap-guangzhou',
      Key: fileName,
      FilePath: filePath,
    }, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// 使用示例
uploadImage('/local/path/image.jpg', 'banner/banner_01.jpg')
  .then(res => {
    console.log('上传成功', res);
  })
  .catch(err => {
    console.error('上传失败', err);
  });
```

### 步骤三：更新代码

#### 3.1 更新数据文件

```javascript
// 更新 universityData.js
const universities = [
  {
    id: 'hku',
    name: '香港大学',
    coverImage: '/images/schools/hku_cover.jpg',  // 本地路径
    // 或
    coverImage: 'https://cdn.example.com/schools/hku_cover.jpg',  // CDN 路径
    // ...
  }
];
```

```javascript
// 更新 newsData.js
const news = [
  {
    id: 1,
    title: '香港2025年留学政策',
    coverImage: '/images/news/hk_policy_2025.jpg',
    publishTime: '2025-01-15',
    // ...
  }
];
```

```javascript
// 更新 index.js
Page({
  data: {
    banners: [
      {
        id: 1,
        image: '/images/banner/banner_01.jpg',
        link: '/pages/guide/guide'
      },
      {
        id: 2,
        image: '/images/banner/banner_02.jpg',
        link: '/pages/appointment/appointment'
      }
    ],
    functions: [
      {
        id: 1,
        name: '学校查询',
        icon: '/images/icons/icon_school.png',
        path: '/pages/school/school'
      },
      // ...
    ]
  }
});
```

#### 3.2 更新 WXML 文件

```html
<!-- 使用本地图片 -->
<image src="/images/banner/banner_01.jpg" mode="aspectFill"></image>

<!-- 使用 CDN 图片 -->
<image src="https://cdn.example.com/banner/banner_01.jpg" mode="aspectFill"></image>
```

#### 3.3 更新 app.json（TabBar 图标）

```json
{
  "tabBar": {
    "color": "#8C8C8C",
    "selectedColor": "#2C5F7C",
    "backgroundColor": "#FFFFFF",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "/images/tab/home.png",
        "selectedIconPath": "/images/tab/home-active.png"
      },
      {
        "pagePath": "pages/news/news",
        "text": "资讯",
        "iconPath": "/images/tab/news.png",
        "selectedIconPath": "/images/tab/news-active.png"
      },
      {
        "pagePath": "pages/appointment/appointment",
        "text": "咨询",
        "iconPath": "/images/tab/consult.png",
        "selectedIconPath": "/images/tab/consult-active.png"
      },
      {
        "pagePath": "pages/user/user",
        "text": "我的",
        "iconPath": "/images/tab/user.png",
        "selectedIconPath": "/images/tab/user-active.png"
      }
    ]
  }
}
```

### 步骤四：测试验证

```javascript
// 测试检查清单
□ 首页轮播图显示正常
□ 功能图标显示正常
□ 学校封面显示正常
□ 资讯封面显示正常
□ 顾问头像显示正常
□ TabBar 图标显示正常
□ 图片加载速度正常
□ 图片在不同设备上显示正常
□ 图片点击交互正常
```

#### 4.1 本地测试

```bash
# 1. 在微信开发者工具中打开项目
# 2. 点击"编译"按钮
# 3. 检查各个页面的图片显示
# 4. 测试图片加载性能
```

#### 4.2 真机测试

```bash
# 1. 点击"预览"按钮
# 2. 扫码在真机上预览
# 3. 检查图片显示效果
# 4. 测试不同网络环境下的加载
```

### 步骤五：提交审核

```javascript
// 提交前检查
□ 所有图片已上传
□ 所有代码已更新
□ 本地测试通过
□ 真机测试通过
□ 图片版权确认
□ 图片大小符合规范
```

```bash
# 提交到微信小程序后台
1. 登录微信小程序后台
2. 版本管理 → 上传代码
3. 填写版本号和更新说明
4. 提交审核
```

---

## 图片分类

### 轮播图 (Banner)

**用途：** 首页轮播展示

**要求：**
- 尺寸：750 × 360 px
- 格式：JPG/PNG
- 大小：≤ 500KB
- 数量：建议 3-5 张

**内容建议：**
- 品牌宣传
- 活动推广
- 热门服务
- 优惠信息

**部署位置：**
```
images/banner/
├── banner_01.jpg
├── banner_02.jpg
└── banner_03.jpg
```

**代码引用：**
```javascript
// pages/index/index.js
data: {
  banners: [
    { id: 1, image: '/images/banner/banner_01.jpg', link: '/pages/guide/guide' },
    { id: 2, image: '/images/banner/banner_02.jpg', link: '/pages/appointment/appointment' }
  ]
}
```

### 功能图标 (Function Icons)

**用途：** 首页功能入口

**要求：**
- 尺寸：96 × 96 px
- 格式：PNG（透明背景）
- 大小：≤ 50KB
- 风格：统一风格

**图标列表：**
| 图标 | 文件名 | 用途 |
|------|--------|------|
| 学校查询 | icon_school.png | 学校查询入口 |
| 专业查询 | icon_major.png | 专业查询入口 |
| 申请指导 | icon_guide.png | 申请指导入口 |
| 在线咨询 | icon_consult.png | 在线咨询入口 |
| 成功案例 | icon_case.png | 成功案例入口 |
| 顾问团队 | icon_team.png | 顾问团队入口 |

**部署位置：**
```
images/icons/
├── icon_school.png
├── icon_major.png
├── icon_guide.png
├── icon_consult.png
├── icon_case.png
└── icon_team.png
```

**代码引用：**
```javascript
// pages/index/index.js
data: {
  functions: [
    { id: 1, name: '学校查询', icon: '/images/icons/icon_school.png', path: '/pages/school/school' },
    { id: 2, name: '专业查询', icon: '/images/icons/icon_major.png', path: '/pages/major/major' }
  ]
}
```

### 学校图片 (School Images)

**用途：** 学校详情展示

**要求：**
- 封面：750 × 500 px
- 缩略图：400 × 300 px
- 格式：JPG/PNG
- 大小：≤ 300KB

**部署位置：**
```
images/schools/
├── hku_cover.jpg        # 香港大学封面
├── hku_building_01.jpg  # 香港大学建筑
├── nus_cover.jpg        # 新加坡国立大学封面
├── nus_campus_01.jpg    # 新加坡国立大学校园
└── ...
```

**代码引用：**
```javascript
// utils/universityData.js
const universities = [
  {
    id: 'hku',
    name: '香港大学',
    coverImage: '/images/schools/hku_cover.jpg',
    images: [
      '/images/schools/hku_building_01.jpg',
      '/images/schools/hku_campus_01.jpg'
    ]
  }
];
```

### 资讯封面 (News Covers)

**用途：** 资讯列表缩略图

**要求：**
- 尺寸：400 × 300 px
- 格式：JPG/PNG
- 大小：≤ 200KB
- 风格：统一风格

**部署位置：**
```
images/news/
├── news_hk_2025_01.jpg
├── news_sg_2025_01.jpg
├── news_policy_01.jpg
└── ...
```

**代码引用：**
```javascript
// utils/newsData.js
const news = [
  {
    id: 1,
    title: '香港2025年留学政策',
    coverImage: '/images/news/news_hk_2025_01.jpg',
    publishTime: '2025-01-15'
  }
];
```

### 顾问头像 (Consultant Avatars)

**用途：** 顾问团队展示

**要求：**
- 尺寸：120 × 120 px
- 格式：JPG/PNG
- 大小：≤ 100KB
- 风格：统一背景

**部署位置：**
```
images/consultants/
├── avatar_chen.jpg
├── avatar_liu.jpg
├── avatar_zhang.jpg
└── ...
```

**代码引用：**
```javascript
// pages/index/index.js
data: {
  consultantList: [
    {
      id: 1,
      name: '陈顾问',
      title: '资深留学顾问',
      avatar: '/images/consultants/avatar_chen.jpg'
    }
  ]
}
```

### TabBar 图标 (TabBar Icons)

**用途：** 底部导航图标

**要求：**
- 尺寸：81 × 81 px
- 格式：PNG（透明背景）
- 大小：≤ 20KB
- 风格：线性图标

**图标列表：**
| 图标 | 文件名 | 用途 |
|------|--------|------|
| 首页 | home.png | 首页入口 |
| 首页（选中） | home-active.png | 首页入口（选中状态） |
| 资讯 | news.png | 资讯入口 |
| 资讯（选中） | news-active.png | 资讯入口（选中状态） |
| 咨询 | consult.png | 咨询入口 |
| 咨询（选中） | consult-active.png | 咨询入口（选中状态） |
| 我的 | user.png | 个人中心 |
| 我的（选中） | user-active.png | 个人中心（选中状态） |

**部署位置：**
```
images/tab/
├── home.png
├── home-active.png
├── news.png
├── news-active.png
├── consult.png
├── consult-active.png
├── user.png
└── user-active.png
```

**代码引用：**
```json
// app.json
{
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "images/tab/home.png",
        "selectedIconPath": "images/tab/home-active.png"
      }
    ]
  }
}
```

---

## 检查清单

### 部署前检查

```
□ 图片尺寸符合规范
□ 图片格式符合要求
□ 图片大小在限制范围内
□ 图片命名符合规范
□ 图片版权已确认
□ 图片质量清晰
□ 图片风格统一
```

### 上传前检查

```
□ 所有图片已压缩
□ 所有图片已重命名
□ 所有图片已分类
□ 图片文件夹结构正确
□ 图片路径配置正确
```

### 部署后检查

```
□ 所有图片已上传
□ 代码已更新
□ 本地测试通过
□ 真机测试通过
□ 图片显示正常
□ 图片加载速度正常
□ 图片在不同设备上显示正常
□ 图片点击交互正常
```

### 提交前检查

```
□ 所有检查项通过
□ 无图片加载错误
□ 无图片显示异常
□ 性能测试通过
□ 兼容性测试通过
```

---

## 常见问题

### Q1: 图片上传后无法显示

**可能原因：**
1. 图片路径错误
2. 图片格式不支持
3. 图片大小超限
4. CDN 配置错误

**解决方案：**
```javascript
// 1. 检查图片路径
// 确保路径以 / 开头（本地）或完整的 URL（CDN）
✅ /images/banner/banner_01.jpg
✅ https://cdn.example.com/banner/banner_01.jpg
❌ images/banner/banner_01.jpg
❌ ./images/banner/banner_01.jpg

// 2. 检查图片格式
// 小程序支持的格式：JPG, PNG, WEBP
✅ banner_01.jpg
✅ banner_01.png
❌ banner_01.bmp
❌ banner_01.gif

// 3. 检查图片大小
// 本地图片：建议单张不超过 500KB
// CDN 图片：建议单张不超过 1MB

// 4. 检查 CDN 配置
// 确保存储桶权限为"公共读"
// 确保域名已配置并已备案
```

### Q2: 图片加载速度慢

**可能原因：**
1. 图片太大
2. 未使用 CDN
3. 网络环境差

**解决方案：**
```javascript
// 1. 压缩图片
// 使用 TinyPNG 或类似工具压缩
// 目标：压缩至规范大小的 50% 以下

// 2. 使用 CDN
// 将图片上传到 CDN 并配置加速
// 推荐服务商：
// - 腾讯云 COS
// - 阿里云 OSS
// - 七牛云

// 3. 使用图片懒加载
<image lazy-load="{{true}}" src="{{item.image}}" mode="aspectFill"></image>

// 4. 使用 WebP 格式（如果支持）
// WebP 格式比 JPG/PNG 小 30-50%
```

### Q3: 图片在不同设备上显示异常

**可能原因：**
1. 图片尺寸不规范
2. mode 属性设置不当
3. CSS 样式问题

**解决方案：**
```javascript
// 1. 使用正确的 mode 属性
<image src="{{image}}" mode="aspectFill"></image>  // 裁剪填充
<image src="{{image}}" mode="aspectFit"></image>   // 等比缩放
<image src="{{image}}" mode="widthFix"></image>   // 宽度固定
<image src="{{image}}" mode="heightFix"></image>  // 高度固定

// 2. 设置图片容器的尺寸
.image-container {
  width: 100%;
  height: 360rpx;
  overflow: hidden;
}

// 3. 使用 rpx 单位适配不同屏幕
// 1rpx = 0.5px (iPhone 6)
// 会根据屏幕宽度自动缩放
```

### Q4: 小程序包体积超限

**可能原因：**
1. 本地图片太多
2. 图片未压缩

**解决方案：**
```javascript
// 1. 将图片迁移到 CDN
// 将 images 文件夹中的图片上传到 CDN
// 更新代码中的图片路径

// 2. 压缩图片
// 使用 TinyPNG 或类似工具
// 目标：压缩至原大小的 50% 以下

// 3. 按需加载
// 只加载当前页面需要的图片
// 使用分包加载

// 4. 使用分包加载
{
  "pages": [
    "pages/index/index"
  ],
  "subpackages": [
    {
      "root": "packageA",
      "pages": [
        "pages/school/school",
        "pages/major/major"
      ]
    }
  ]
}
```

---

## 维护指南

### 定期维护任务

#### 每周任务

```
□ 检查图片加载情况
□ 统计图片访问数据
□ 清理无用图片
□ 更新热点图片
```

#### 每月任务

```
□ 优化图片加载速度
□ 更新图片资源
□ 备份重要图片
□ 检查 CDN 流量
```

#### 季度任务

```
□ 重新设计图片风格
□ 批量优化图片
□ 清理历史图片
□ 评估图片方案
```

### 图片更新流程

```javascript
// 1. 准备新图片
// - 收集新图片
// - 编辑和压缩
// - 按规范命名

// 2. 上传新图片
// - 上传到本地或 CDN
// - 测试图片访问

// 3. 更新代码
// - 更新图片路径
// - 测试图片显示

// 4. 删除旧图片（可选）
// - 删除本地旧图片
// - 或从 CDN 删除

// 5. 提交审核
// - 本地测试
// - 真机测试
// - 提交审核
```

### 图片监控

```javascript
// 使用微信小程序后台监控
1. 登录小程序后台
2. 统计 → 性能监控
3. 查看图片加载失败率
4. 查看图片加载耗时

// 使用第三方监控工具
- 阿里云 ARMS
- 腾讯云监控
- 自定义监控
```

### 备份策略

```javascript
// 本地备份
// 定期备份 images 文件夹

// CDN 备份
// 开启 CDN 的版本控制
// 定期导出图片列表

// 云存储备份
// 开启云存储的版本控制
// 配置跨区域备份

// 备份频率
// - 每日增量备份
// - 每周全量备份
// - 每月归档备份
```

---

## 附录

### A. 图片压缩工具

| 工具 | 平台 | 地址 |
|------|------|------|
| TinyPNG | 在线 | https://tinypng.com/ |
| Squoosh | 在线 | https://squoosh.app/ |
| ImageOptim | Mac | https://imageoptim.com/ |
| FileOptimizer | Windows | https://nikkhokkho.sourceforge.io/ |

### B. 图片设计工具

| 工具 | 平台 | 用途 |
|------|------|------|
| Photoshop | 全平台 | 图片编辑 |
| Figma | 在线 | 界面设计 |
| Sketch | Mac | 界面设计 |
| Canva | 在线 | 快速设计 |

### C. 图标库

| 图标库 | 特点 | 地址 |
|--------|------|------|
| Iconfont | 阿里图标库 | https://www.iconfont.cn/ |
| IconPark | 字节图标库 | https://iconpark.oceanengine.com/ |
| Remix Icon | 开源图标 | https://remixicon.com/ |

---

**文档版本：** v1.0
**最后更新：** 2026-03-11
**维护者：** 华南留学技术团队
