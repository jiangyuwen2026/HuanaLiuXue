# 华南留学小程序重构快速指南
## Mini Program Migration Quick Guide

> **目标**: 将现有小程序从静态数据改造为对接官网后台API  
> **预计工时**: 2-3天  
> **难度**: 中等

---

## 快速开始 (Quick Start)

### 1. 准备工作

确保官网后端服务已启动：
```bash
cd huananliu-web/backend
npm run dev
# 服务运行在 http://localhost:3001
```

### 2. 配置文件更新

将 `config.js` 复制到小程序根目录：
```bash
cp config.example.js config.js
```

编辑 `config.js` 设置正确的API地址：
```javascript
// 开发环境
const DEVELOPMENT_CONFIG = {
  baseUrl: 'http://localhost:3001/api',  // 后端API地址
  imageBaseUrl: 'http://localhost:3001/uploads'
};
```

### 3. API文件替换

将新API文件替换旧文件：
```bash
mv utils/api.js utils/api-legacy.js    # 备份旧文件
mv utils/api-v2.js utils/api.js         # 使用新文件
```

### 4. 页面结构更新

更新 `app.json`：
```bash
mv app.json app-legacy.json
mv app-v2.json app.json
```

---

## 页面改造清单 (Page Migration Checklist)

### 首页 (pages/index/index)

| 改造项 | 原实现 | 新实现 | 状态 |
|--------|--------|--------|------|
| 轮播图 | 静态数据 | `api.getBanners()` | ⬜ |
| 快捷入口 | 静态4个 | 静态8个 | ⬜ |
| 明星案例 | 静态数据 | `api.getFeaturedCases()` | ⬜ |
| 热门学校 | 静态数据 | `api.getHotSchools()` | ⬜ |
| 推荐资讯 | 静态数据 | `api.getRecommendedNews()` | ⬜ |

**参考文件**: `pages/index/index-v2.js`, `pages/index/index-v2.wxml`

### 学校列表 (pages/school/list)

```javascript
// 加载学校列表
async loadSchools() {
  const res = await api.getSchoolList({
    country: this.data.selectedCountry,
    page: this.data.page,
    limit: 10
  });
  this.setData({
    schools: res.data.list,
    total: res.data.total
  });
}
```

### 案例列表 (pages/case/list)

```javascript
// 加载案例列表
async loadCases() {
  const res = await api.getCaseList({
    country: this.data.selectedCountry,
    page: this.data.page,
    limit: 10
  });
  this.setData({
    cases: res.data.list
  });
}
```

### 资讯列表 (pages/news/news)

```javascript
// 加载资讯列表
async loadNews() {
  const res = await api.getNewsList({
    category: this.data.selectedCategory,
    page: this.data.page,
    limit: 10
  });
  this.setData({
    news: res.data.list
  });
}
```

---

## 后台数据准备 (Backend Data Setup)

在小程序能正常展示数据前，需要先在后台管理系统配置数据：

### 1. 配置轮播图
- 访问: `http://localhost:3002` (后台管理)
- 进入: Banner管理
- 添加3-5张轮播图，设置排序

### 2. 设置热门学校
- 进入: 学校管理
- 编辑学校 -> 勾选"热门学校"
- 至少设置6所热门学校

### 3. 设置明星案例
- 进入: 案例管理
- 选择案例 -> 点击"设为明星"
- 配置亮点标签、背景色、排序
- 至少设置3个明星案例

### 4. 设置推荐资讯
- 进入: 新闻管理
- 编辑新闻 -> 勾选"推荐到首页"
- 设置推荐排序
- 至少设置3条推荐资讯

---

## 常见问题 (FAQ)

**Q: 小程序请求后端API报CORS错误？**
A: 检查后端 `config.js` 中的 `corsOrigin` 是否包含小程序域名，开发环境可设置为 `['*']`。

**Q: 图片无法显示？**
A: 确保图片URL使用HTTPS，且域名已配置到小程序后台的下载域名白名单。

**Q: 后台配置的数据没有同步？**
A: 检查数据状态是否为"启用"，且小程序重新进入页面会触发数据加载。

**Q: 如何调试API请求？**
A: 打开微信开发者工具 -> 调试器 -> Network，查看请求详情。

---

## 文件对照表 (File Mapping)

| 新文件 | 说明 | 替换旧文件 |
|--------|------|-----------|
| `config.js` | 配置文件 | 新建 |
| `utils/api-v2.js` | API封装 | `utils/api.js` |
| `app-v2.json` | 页面配置 | `app.json` |
| `pages/index/index-v2.js` | 首页逻辑 | `pages/index/index.js` |
| `pages/index/index-v2.wxml` | 首页模板 | `pages/index/index.wxml` |

---

## 测试检查清单 (Testing Checklist)

### 功能测试
- [ ] 首页轮播图正常显示和跳转
- [ ] 明星案例横向滚动正常
- [ ] 热门学校点击跳转到详情
- [ ] 推荐资讯列表显示正确
- [ ] 学校列表分页加载正常
- [ ] 案例列表筛选功能正常
- [ ] 资讯详情页正常显示

### 数据一致性测试
- [ ] 后台修改Banner，小程序同步更新
- [ ] 后台设置明星案例，小程序首页显示
- [ ] 后台取消推荐新闻，小程序不再显示

### 性能测试
- [ ] 首页加载时间 < 2秒
- [ ] 列表页下拉刷新正常
- [ ] 上拉加载更多正常

---

## 联系方式

如有问题，请参考:
- [详细设计文档](./MINIPROGRAM_DESIGN.md)
- [官网设计说明书](./huananliu-web/DESIGN_MANUAL.md)
