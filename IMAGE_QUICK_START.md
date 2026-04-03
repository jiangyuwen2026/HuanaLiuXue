# 图片部署快速开始指南

## 🚀 5 分钟快速部署

### 步骤一：准备图片（2 分钟）

#### 1.1 调整图片尺寸

使用图片编辑工具（如 Photoshop）批量调整尺寸：

```
轮播图：750 × 360 px
功能图标：96 × 96 px
学校封面：750 × 500 px
资讯封面：400 × 300 px
顾问头像：120 × 120 px
TabBar 图标：81 × 81 px
```

#### 1.2 压缩图片

访问 https://tinypng.com/ 上传图片自动压缩。

#### 1.3 重命名文件

按照以下格式命名：

```
banner_01.jpg, banner_02.jpg
icon_school.png, icon_major.png
school_hku_cover.jpg
news_hk_2025_01.jpg
avatar_chen.jpg
home.png, home-active.png
```

### 步骤二：上传图片（1 分钟）

#### 方案 A：本地存储（简单）

```bash
# 在项目根目录创建文件夹
mkdir -p images/banner
mkdir -p images/icons
mkdir -p images/schools
mkdir -p images/news
mkdir -p images/consultants
mkdir -p images/tab

# 复制图片到对应文件夹
# 将准备好的图片复制到对应文件夹中
```

#### 方案 B：CDN 存储（推荐）

```javascript
// 1. 注册腾讯云 COS
// https://console.cloud.tencent.com/cos

// 2. 创建存储桶
// - 名称：huananliuxue-images
// - 地域：选择最近的地区
// - 权限：公共读私有写

// 3. 上传图片
// 通过控制台上传或使用 SDK

// 4. 配置 CDN
// 在 COS 控制台开启 CDN 加速
```

### 步骤三：更新代码（1 分钟）

#### 3.1 更新数据文件

```javascript
// utils/universityData.js
const universities = [
  {
    id: 'hku',
    name: '香港大学',
    coverImage: '/images/schools/school_hku_cover.jpg',  // 本地
    // 或
    coverImage: 'https://cdn.example.com/schools/school_hku_cover.jpg',  // CDN
  }
];

// utils/newsData.js
const news = [
  {
    id: 1,
    title: '香港2025年留学政策',
    coverImage: '/images/news/news_hk_2025_01.jpg',
    publishTime: '2025-01-15',
  }
];
```

#### 3.2 更新首页数据

```javascript
// pages/index/index.js
Page({
  data: {
    banners: [
      { id: 1, image: '/images/banner/banner_01.jpg', link: '/pages/guide/guide' },
      { id: 2, image: '/images/banner/banner_02.jpg', link: '/pages/appointment/appointment' }
    ],
    functions: [
      { id: 1, name: '学校查询', icon: '/images/icons/icon_school.png', path: '/pages/school/school' },
      { id: 2, name: '专业查询', icon: '/images/icons/icon_major.png', path: '/pages/major/major' },
      { id: 3, name: '申请指导', icon: '/images/icons/icon_guide.png', path: '/pages/guide/guide' },
      { id: 4, name: '在线咨询', icon: '/images/icons/icon_consult.png', path: '/pages/appointment/appointment' },
      { id: 5, name: '成功案例', icon: '/images/icons/icon_case.png', path: '/pages/case/case' },
      { id: 6, name: '顾问团队', icon: '/images/icons/icon_team.png', path: '/pages/consultant/consultant' }
    ]
  }
});
```

#### 3.3 更新 TabBar 配置

```json
// app.json
{
  "tabBar": {
    "color": "#8C8C8C",
    "selectedColor": "#2C5F7C",
    "backgroundColor": "#FFFFFF",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "images/tab/home.png",
        "selectedIconPath": "images/tab/home-active.png"
      },
      {
        "pagePath": "pages/news/news",
        "text": "资讯",
        "iconPath": "images/tab/news.png",
        "selectedIconPath": "images/tab/news-active.png"
      },
      {
        "pagePath": "pages/appointment/appointment",
        "text": "咨询",
        "iconPath": "images/tab/consult.png",
        "selectedIconPath": "images/tab/consult-active.png"
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

### 步骤四：测试验证（1 分钟）

#### 4.1 本地测试

```bash
1. 打开微信开发者工具
2. 点击"编译"按钮
3. 检查所有图片是否显示正常
4. 测试图片点击交互
```

#### 4.2 真机测试

```bash
1. 点击"预览"按钮
2. 扫码在真机上测试
3. 检查图片显示效果
4. 测试不同网络环境
```

### 步骤五：提交发布

```bash
1. 点击"上传"按钮
2. 填写版本号和更新说明
3. 登录小程序后台提交审核
4. 等待审核通过
```

---

## 📸 示例图片清单

### 必需图片（最低要求）

#### 轮播图（3 张）
```
images/banner/banner_01.jpg
images/banner/banner_02.jpg
images/banner/banner_03.jpg
```

#### 功能图标（6 个）
```
images/icons/icon_school.png
images/icons/icon_major.png
images/icons/icon_guide.png
images/icons/icon_consult.png
images/icons/icon_case.png
images/icons/icon_team.png
```

#### TabBar 图标（8 个）
```
images/tab/home.png
images/tab/home-active.png
images/tab/news.png
images/tab/news-active.png
images/tab/consult.png
images/tab/consult-active.png
images/tab/user.png
images/tab/user-active.png
```

### 推荐图片

#### 学校图片（每个学校至少 1 张）
```
images/schools/school_hku_cover.jpg
images/schools/school_nus_cover.jpg
images/schools/school_cuhk_cover.jpg
images/schools/school_ntu_cover.jpg
...
```

#### 资讯封面（每篇文章 1 张）
```
images/news/news_hk_2025_01.jpg
images/news/news_sg_2025_01.jpg
images/news/news_policy_01.jpg
...
```

#### 顾问头像（每个顾问 1 张）
```
images/consultants/avatar_chen.jpg
images/consultants/avatar_liu.jpg
images/consultants/avatar_zhang.jpg
...
```

---

## 🔧 常用工具

### 图片压缩
- [TinyPNG](https://tinypng.com/) - 在线压缩
- [Squoosh](https://squoosh.app/) - Google 压缩工具

### 图片编辑
- [Photoshop](https://www.adobe.com/products/photoshop.html) - 专业编辑
- [Figma](https://www.figma.com/) - 在线设计

### 图标资源
- [Iconfont](https://www.iconfont.cn/) - 阿里图标库
- [IconPark](https://iconpark.oceanengine.com/) - 字节图标库

---

## ⚠️ 注意事项

### 图片路径
```javascript
// ✅ 正确的本地路径
'/images/banner/banner_01.jpg'

// ✅ 正确的 CDN 路径
'https://cdn.example.com/banner/banner_01.jpg'

// ❌ 错误的路径
'images/banner/banner_01.jpg'
'./images/banner/banner_01.jpg'
'../images/banner/banner_01.jpg'
```

### 图片格式
```javascript
// ✅ 支持的格式
.jpg
.png
.webp

// ❌ 不支持的格式
.bmp
.gif
.svg
```

### 图片大小
```
轮播图：≤ 500KB
功能图标：≤ 50KB
学校图片：≤ 300KB
资讯封面：≤ 200KB
顾问头像：≤ 100KB
TabBar 图标：≤ 20KB
```

---

## 🆘 快速故障排除

### 图片不显示
```javascript
// 检查清单
1. 路径是否正确？
2. 文件是否存在？
3. 格式是否支持？
4. 大小是否超限？

// 解决方法
// 重新检查路径
// 确认文件存在
// 转换为 JPG/PNG
// 压缩图片大小
```

### 图片加载慢
```javascript
// 解决方法
1. 压缩图片
2. 使用 CDN
3. 启用懒加载
<image lazy-load="{{true}}" src="{{image}}" />
```

### 小程序包超限
```javascript
// 解决方法
1. 迁移到 CDN
2. 压缩图片
3. 使用分包加载
```

---

## 📞 技术支持

如遇到问题，请参考：
- 详细文档：`IMAGE_DEPLOYMENT_GUIDE.md`
- 检查清单：`IMAGE_DEPLOYMENT_CHECKLIST.md`
- 技术支持：support@huananliuxue.com

---

**快速开始版本：** v1.0
**最后更新：** 2026-03-11
