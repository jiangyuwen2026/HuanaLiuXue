# 华南留学小程序重构设计方案
## Mini Program Redesign Specification

> **版本**: v2.0.0  
> **设计日期**: 2026-03-25  
> **目标**: 对接官网后台数据，实现后台配置统一管控多端展示

---

## 1. 设计目标 (Design Goals)

### 1.1 核心目标
- **数据同源**: 小程序与官网共用一套后台数据
- **配置统一**: 后台管理配置的内容自动同步到小程序
- **功能精简**: 保留移动端核心场景，专注用户转化路径

### 1.2 数据对接原则
```
┌─────────────────────────────────────────────────────────────────┐
│                        后台管理系统                               │
│                    (Admin Dashboard)                             │
├─────────────────────────────────────────────────────────────────┤
│  Banner管理 │ 学校管理 │ 案例管理 │ 顾问管理 │ 新闻管理 │ 服务管理 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      后端API服务 (Node.js)                       │
│              统一数据接口 /api/* 供多端调用                       │
└─────────────────────────────────────────────────────────────────┘
              │                           │
              ▼                           ▼
    ┌─────────────────┐         ┌─────────────────┐
    │    官网前端      │         │    小程序端      │
    │  (React+Tailwind)│         │   (微信小程序)   │
    │   localhost:3000 │         │   微信客户端    │
    └─────────────────┘         └─────────────────┘
```

---

## 2. 功能架构设计 (Functional Architecture)

### 2.1 小程序页面结构

```
┌─────────────────────────────────────────────────────────────────┐
│                      小程序页面结构 v2.0                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    首页       │  │    资讯       │  │    我的       │          │
│  │   (index)    │  │   (news)     │  │   (user)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│       TabBar          TabBar           TabBar                  │
│                                                                 │
│  首页包含:                                                       │
│  ├── 轮播图 (Banner)            ← 后台Banner管理                │
│  ├── 快捷入口 (8宫格)            ← 固定功能导航                  │
│  ├── 明星案例卡片               ← 后台案例管理-明星案例设置       │
│  ├── 热门学校推荐               ← 后台学校管理-is_hot            │
│  └── 推荐资讯列表               ← 后台新闻管理-推荐新闻设置       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                      二级页面 (非Tab)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   学校列表    │  │   案例列表    │  │   顾问列表    │          │
│  │  /school/list│  │  /case/list  │  │/consultant/..│          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│       ↑ 后台数据            ↑ 后台数据         ↑ 后台数据        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   学校详情    │  │   案例详情    │  │   资讯详情    │          │
│  │/school/detail│  │ /case/detail │  │ /news/detail │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   服务列表    │  │   在线咨询    │  │   我的预约    │          │
│  │ /service/list│  │/consult/form │  │/appointment/..│          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│       ↑ 后台数据            ↑ 表单提交         ↑ 用户数据        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 TabBar 设计

```json
{
  "tabBar": {
    "color": "#8C8C8C",
    "selectedColor": "#2C5F7C",
    "backgroundColor": "#FFFFFF",
    "list": [
      { "pagePath": "pages/index/index", "text": "首页" },
      { "pagePath": "pages/news/news", "text": "资讯" },
      { "pagePath": "pages/user/user", "text": "我的" }
    ]
  }
}
```

**精简原因**: 原"咨询"Tab改为首页快捷入口，减少层级提升转化。

---

## 3. 数据对接设计 (Data Integration)

### 3.1 API接口映射表

| 小程序页面 | 后端API | 后台管理入口 | 数据字段说明 |
|-----------|---------|-------------|-------------|
| 首页轮播图 | `GET /api/banners` | Banner管理 | image, link, sort |
| 热门学校 | `GET /api/schools/hot/list` | 学校管理-is_hot | name, name_en, logo, country |
| 明星案例 | `GET /api/cases/featured/list` | 案例管理-设为明星 | student_name, school.name_cn, feature_highlight, feature_bg |
| 推荐资讯 | `GET /api/news/recommended/list` | 新闻管理-推荐到首页 | title, summary, cover_image, category |
| 学校列表 | `GET /api/schools` | 学校管理 | 分页列表，支持country筛选 |
| 案例列表 | `GET /api/cases` | 案例管理 | 分页列表，支持country筛选 |
| 顾问列表 | `GET /api/consultants` | 顾问管理 | 分页列表 |
| 服务列表 | `GET /api/services` | 服务管理 | title, icon, description |

### 3.2 数据字段映射

#### 首页轮播图 ← Banner管理
```javascript
// 后台配置
Banner: {
  id,              // ID
  image,           // 图片URL
  link,            // 跳转链接（小程序路径）
  sort,            // 排序
  status           // 状态
}

// 小程序展示
swiper-item > image[src=image]
```

#### 明星案例 ← 案例管理-明星案例设置
```javascript
// 后台配置
Case: {
  id,
  student_name,           // 学生姓名
  is_featured: 1,         // 设为明星案例
  feature_sort: 1,        // 排序
  feature_highlight: "逆袭G5",  // 亮点标签
  feature_bg: "from-violet-500 to-purple-600",  // 背景渐变
  school: { name_cn }     // 关联学校
}

// 小程序展示
featured-card > gradient-bg + highlight-tag + student-name + school-name
```

#### 推荐资讯 ← 新闻管理-推荐新闻
```javascript
// 后台配置
News: {
  id,
  title,                  // 标题
  summary,                // 摘要
  cover_image,            // 封面图
  is_recommended: 1,      // 设为推荐
  recommend_sort: 1,      // 推荐排序
  category                // 分类
}

// 小程序展示
news-item > cover-image + category-tag + title + summary
```

---

## 4. 页面详细设计 (Page Specifications)

### 4.1 首页 (pages/index/index)

#### 布局结构
```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐   │ ← 轮播图 (Swiper)
│  │      Banner轮播              │   │   数据: /api/banners
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │ ← 快捷入口 (Grid 2x4)
│  │学校│ │案例│ │顾问│ │服务│      │   固定8个入口
│  └────┘ └────┘ └────┘ └────┘      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
│  │资讯│ │评估│ │预约│ │客服│      │
│  └────┘ └────┘ └────┘ └────┘      │
├─────────────────────────────────────┤
│  ⭐ 明星案例              更多 >   │ ← 明星案例区
│  ┌─────────────────────────────┐   │   数据: /api/cases/featured/list
│  │  [渐变背景卡片]              │   │   横向滚动
│  │   "逆袭G5"                   │   │
│  │   张同学 · 香港大学          │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  🏫 热门名校              更多 >   │ ← 热门学校区
│  ┌────┐ ┌────┐ ┌────┐             │   数据: /api/schools/hot/list
│  │Logo│ │Logo│ │Logo│ ...          │   横向滚动，最多6个
│  │港大│ │新国│ │UCL │             │
│  └────┘ └────┘ └────┘             │
├─────────────────────────────────────┤
│  📰 推荐资讯              更多 >   │ ← 推荐资讯区
│  ┌─────────────────────────────┐   │   数据: /api/news/recommended/list
│  │ [图] 香港2024硕士申请...    │   │   纵向列表，3条
│  │      香港 · 2天前            │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### 数据加载逻辑
```javascript
Page({
  data: {
    banners: [],        // 轮播图
    featuredCases: [],  // 明星案例
    hotSchools: [],     // 热门学校
    recommendedNews: [] // 推荐资讯
  },
  
  onLoad() {
    this.loadHomeData();
  },
  
  async loadHomeData() {
    // 并行加载所有数据
    const [banners, cases, schools, news] = await Promise.all([
      api.getBanners(),
      api.getFeaturedCases(),
      api.getHotSchools(),
      api.getRecommendedNews()
    ]);
    
    this.setData({
      banners: banners.data,
      featuredCases: cases.data,
      hotSchools: schools.data,
      recommendedNews: news.data
    });
  }
});
```

### 4.2 资讯页 (pages/news/news)

#### 布局结构
```
┌─────────────────────────────────────┐
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │ ← 分类筛选 (ScrollView)
│  │全部│ │香港│ │新加坡│ │英国│      │   数据: /api/news/categories
│  └────┘ └────┘ └────┘ └────┘      │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │ ← 资讯列表 (Waterfall/Card)
│  │ [封面图]                     │   │   数据: /api/news
│  │ 香港2024硕士申请时间表...    │   │   分页加载
│  │ 📁 香港  👁 1.2k  📅 01-15  │   │
│  └─────────────────────────────┘   │
│              ...                    │
└─────────────────────────────────────┘
```

### 4.3 我的页 (pages/user/user)

#### 布局结构
```
┌─────────────────────────────────────┐
│  ┌────┐                             │
│  │头像│  微信用户                    │ ← 用户信息
│  └────┘  点击查看个人资料            │
├─────────────────────────────────────┤
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │ ← 快捷统计
│  │  0  │ │  0  │ │  0  │ │  0  │      │   收藏/浏览/预约/消息
│  │收藏│ │浏览│ │预约│ │消息│      │
│  └────┘ └────┘ └────┘ └────┘      │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ 📅 我的预约           >     │   │ ← 功能入口列表
│  │ ⭐ 我的收藏           >     │   │
│  │ 📝 浏览记录           >     │   │
│  ├─────────────────────────────┤   │
│  │ 📞 联系客服           >     │   │
│  │ ℹ️ 关于我们           >     │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 5. API封装设计 (API Wrapper)

### 5.1 更新 utils/api.js

```javascript
// utils/api.js - v2.0 对接官网后端API

const app = getApp();

// 基础请求
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
        if (res.statusCode === 200 && res.data.success) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      },
      fail: reject
    });
  });
};

// ===== 首页数据 =====

// 获取轮播图
const getBanners = () => request('/banners');

// 获取明星案例
const getFeaturedCases = () => request('/cases/featured/list');

// 获取热门学校
const getHotSchools = () => request('/schools/hot/list');

// 获取推荐资讯
const getRecommendedNews = (limit = 6) => request('/news/recommended/list', 'GET', { limit });

// ===== 学校相关 =====

// 获取学校列表
const getSchoolList = (params = {}) => request('/schools', 'GET', params);

// 获取学校详情
const getSchoolDetail = (id) => request(`/schools/${id}`);

// ===== 案例相关 =====

// 获取案例列表
const getCaseList = (params = {}) => request('/cases', 'GET', params);

// 获取案例详情
const getCaseDetail = (id) => request(`/cases/${id}`);

// ===== 顾问相关 =====

// 获取顾问列表
const getConsultantList = (params = {}) => request('/consultants', 'GET', params);

// 获取顾问详情
const getConsultantDetail = (id) => request(`/consultants/${id}`);

// ===== 资讯相关 =====

// 获取资讯列表
const getNewsList = (params = {}) => request('/news', 'GET', params);

// 获取资讯详情
const getNewsDetail = (id) => request(`/news/${id}`);

// 获取资讯分类
const getNewsCategories = () => request('/news/options/categories');

// ===== 服务相关 =====

// 获取服务列表
const getServiceList = () => request('/services');

// ===== 预约相关 =====

// 创建预约
const createAppointment = (data) => request('/appointments', 'POST', data);

// 获取我的预约
const getMyAppointments = () => request('/appointments/my');

module.exports = {
  // 首页
  getBanners,
  getFeaturedCases,
  getHotSchools,
  getRecommendedNews,
  // 学校
  getSchoolList,
  getSchoolDetail,
  // 案例
  getCaseList,
  getCaseDetail,
  // 顾问
  getConsultantList,
  getConsultantDetail,
  // 资讯
  getNewsList,
  getNewsDetail,
  getNewsCategories,
  // 服务
  getServiceList,
  // 预约
  createAppointment,
  getMyAppointments
};
```

---

## 6. 数据库模型复用 (Database Models)

小程序直接复用官网后端的数据库模型，无需新建表：

| 模型文件 | 用途 | 小程序使用场景 |
|---------|------|---------------|
| `models/School.js` | 学校数据 | 学校列表、详情、热门推荐 |
| `models/Case.js` | 案例数据 | 案例列表、详情、明星案例 |
| `models/Consultant.js` | 顾问数据 | 顾问列表、详情 |
| `models/News.js` | 新闻数据 | 资讯列表、详情、推荐资讯 |
| `models/Banner.js` | 轮播图数据 | 首页轮播 |
| `models/Service.js` | 服务数据 | 服务列表 |
| `models/Appointment.js` | 预约数据 | 在线咨询表单 |

---

## 7. 实施步骤 (Implementation Steps)

### Phase 1: 基础改造
1. [ ] 更新 `app.json` - 调整页面结构和TabBar
2. [ ] 更新 `utils/api.js` - 对接后端API
3. [ ] 创建 `config.js` - 配置API基础地址

### Phase 2: 首页重构
1. [ ] 重写 `pages/index/index` - 对接Banner、明星案例、热门学校、推荐资讯
2. [ ] 实现快捷入口Grid组件
3. [ ] 实现明星案例横向滚动卡片

### Phase 3: 列表页对接
1. [ ] 重写 `pages/school/school` - 对接学校列表API
2. [ ] 重写 `pages/case/case` - 对接案例列表API
3. [ ] 重写 `pages/news/news` - 对接资讯列表API
4. [ ] 重写 `pages/consultant/consultant` - 对接顾问列表API

### Phase 4: 详情页对接
1. [ ] 重写 `pages/school/detail/school-detail`
2. [ ] 重写 `pages/case/detail/case-detail`
3. [ ] 重写 `pages/news/detail/news-detail`
4. [ ] 重写 `pages/consultant/detail/consultant-detail`

### Phase 5: 功能页完善
1. [ ] 重写 `pages/appointment/appointment` - 预约表单
2. [ ] 重写 `pages/user/user` - 个人中心

---

## 8. 配置检查清单 (Configuration Checklist)

### 后台管理配置项

确保以下后台配置已完成，小程序才能正常展示数据：

- [ ] **Banner管理** - 至少上传3张轮播图，状态设为"启用"
- [ ] **学校管理** - 至少添加6所学校，热门学校设置 `is_hot=1`
- [ ] **案例管理** - 至少设置3个明星案例 (`is_featured=1`)
- [ ] **新闻管理** - 至少设置3条推荐新闻 (`is_recommended=1`)
- [ ] **顾问管理** - 至少添加3位顾问
- [ ] **服务管理** - 至少添加4项服务

### 小程序配置项

- [ ] `config.js` - 配置正确的 `baseUrl`
- [ ] `app.json` - 配置合法域名
- [ ] 微信小程序后台 - 配置服务器域名白名单

---

## 9. 与官网功能对比 (Feature Comparison)

| 功能 | 官网 | 小程序 | 说明 |
|------|------|--------|------|
| Banner轮播 | ✅ | ✅ | 同数据源 |
| 学校展示 | ✅ | ✅ | 同数据源 |
| 案例展示 | ✅ | ✅ | 同数据源 |
| 明星案例 | ✅ | ✅ | 同数据源 |
| 顾问展示 | ✅ | ✅ | 同数据源 |
| 新闻资讯 | ✅ | ✅ | 同数据源 |
| 推荐新闻 | ✅ | ✅ | 同数据源 |
| 服务展示 | ✅ | ✅ | 同数据源 |
| 用户评价 | ✅ | ❌ | 小程序暂不实现 |
| 留学评估 | ✅ | ✅ | 简化版表单 |
| 在线预约 | ✅ | ✅ | 同数据源 |
| 后台管理 | ✅ | N/A | 仅官网使用 |

---

## 10. 注意事项 (Notes)

### 10.1 图片处理
- 小程序图片建议使用 CDN 加速
- 后台上传的图片需配置 HTTPS 域名
- 图片尺寸建议：Banner 750x400px, 封面图 400x300px

### 10.2 性能优化
- 列表页使用分页加载 (limit=10)
- 首页数据并行加载 (Promise.all)
- 图片使用懒加载 (lazy-load)

### 10.3 兼容性
- 基础库版本要求: 2.19.4+
- 支持 iOS 9+ / Android 5+

---

## 附录: 相关文档

- [官网设计说明书](./huananliu-web/DESIGN_MANUAL.md)
- [官网产品说明书](./huananliu-web/PRODUCT_MANUAL.md)
- [后端API文档](./huananliu-web/API_CONFIG_GUIDE.md)
