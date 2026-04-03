# 小程序升级改造总结

## 一句话概括

将小程序从「本地静态数据」改造为「后台API驱动」，实现**后台配置一次，官网+小程序同步更新**。

---

## 核心变化对比

```
┌─────────────────────────────────────────────────────────────────┐
│                         现有 v1.0                                │
├─────────────────────────────────────────────────────────────────┤
│  数据写死在JS文件里                                               │
│  更新内容需要修改代码 → 提交审核 → 等待发布                        │
│  小程序和官网数据可能不一致                                        │
└─────────────────────────────────────────────────────────────────┘
                              ⬇️ 改造
┌─────────────────────────────────────────────────────────────────┐
│                         目标 v2.0                                │
├─────────────────────────────────────────────────────────────────┤
│  数据来自后端API                                                  │
│  运营人员在后台配置 → 立刻同步到小程序                              │
│  官网和小程序数据完全一致                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 改造范围速览

### 页面结构变化

| 现有 | 变化 | V2.0 |
|------|------|------|
| 首页 | ✅改造 | 对接API，新增热门学校区 |
| 资讯 | ✅改造 | 重写，对接API |
| 咨询Tab | ❌移除 | 改为首页入口 |
| 我的 | ✅保留 | 对接用户信息 |
| 学校 | ✅改造 | 对接API，支持分页 |
| 案例 | ✅改造 | 对接API |
| 顾问 | ✅改造 | 对接API |
| 预约 | ✅改造 | 真实提交 |
| 专业 | ❌移除 | 合并到学校详情 |
| 指导 | ❌移除 | 合并到首页 |

### TabBar简化

```
现有: [首页] [资讯] [咨询] [我的]  (4个)
         ⬇️
V2.0: [首页] [资讯] [我的]  (3个)

"咨询"移到首页作为快捷入口
```

---

## 关键改造点

### 1. 首页改造 (重点⭐)

**现有问题**: 所有数据都是写死的

```javascript
// 现在
banners: [
  { id: 1, image: 'https://picsum.photos/...' }, // 死数据
  ...
]
```

**V2.0改造**: 从后台API加载

```javascript
// 改造后
const bannersRes = await api.getBanners();  // 从后台Banner管理读取
const featuredRes = await api.getFeaturedCases();  // 后台设置的明星案例
const hotSchoolsRes = await api.getHotSchools();  // 后台热门学校
const newsRes = await api.getRecommendedNews();  // 后台推荐资讯
```

### 2. 列表页改造

**现有**: 从本地JS文件加载
```javascript
const dataManager = require('../../../utils/dataManager');
const schools = dataManager.getAllUniversities();  // 本地数据
```

**V2.0**: 从API加载，支持分页
```javascript
const res = await api.getSchoolList({
  country: '香港',
  page: 1,
  limit: 10
});
// res.data.list - 列表数据
// res.data.total - 总数量
```

### 3. API路径修正

**大量API路径写错了，需要修正**:

| 功能 | 现有写法(错误) | V2.0写法(正确) |
|------|---------------|---------------|
| 资讯列表 | `/news/list` | `/news` |
| 学校列表 | `/school/list` | `/schools` |
| 案例列表 | `/case/list` | `/cases` |
| 顾问列表 | `/consultant/list` | `/consultants` |

### 4. 移除本地数据文件

这些文件不再需要，删除:
- ❌ `utils/dataManager.js`
- ❌ `utils/universityData.js`
- ❌ `utils/newsManager.js`

---

## 改造工作量

| 模块 | 工时 | 优先级 |
|------|------|--------|
| API工具层 | 2h | P0 |
| 首页 | 4h | P0 |
| 学校列表/详情 | 5h | P0 |
| 案例列表/详情 | 3h | P0 |
| 资讯列表/详情 | 5h | P0 |
| 预约功能 | 3h | P1 |
| 个人中心 | 2h | P1 |
| 测试调试 | 4h | - |
| **总计** | **~28h (4天)** | |

---

## 后台配置对照

小程序展示的内容，都需要在后台配置：

| 小程序看到的 | 后台配置入口 | 必须配置 |
|-------------|-------------|---------|
| 首页轮播图 | Banner管理 | ✅是 |
| 明星案例 | 案例管理 → 设为明星 | ✅是 |
| 热门学校 | 学校管理 → 设为热门 | ✅是 |
| 推荐资讯 | 新闻管理 → 推荐到首页 | ✅是 |
| 学校列表 | 学校管理 | ✅是 |
| 案例列表 | 案例管理 | ✅是 |
| 顾问列表 | 顾问管理 | ✅是 |
| 服务列表 | 服务管理 | ⭕否 |

---

## 实施步骤

### 第一步：准备工作 (30分钟)
1. 确认后端服务运行正常
2. 复制 `config.js` 和 `utils/api-v2.js`
3. 用 `app-v2.json` 替换 `app.json`

### 第二步：改造首页 (半天)
1. 参考 `index-v2.js` 重写首页
2. 测试轮播图、明星案例、热门学校、推荐资讯

### 第三步：改造列表页 (1天)
1. 学校列表 + 筛选
2. 案例列表 + 筛选
3. 资讯列表 + 分类

### 第四步：改造详情页 (半天)
1. 学校详情
2. 案例详情
3. 资讯详情

### 第五步：改造功能页 (半天)
1. 预约提交
2. 我的预约
3. 个人中心

### 第六步：测试发布 (半天)
1. 功能测试
2. 数据一致性测试
3. 提交审核

---

## 风险提醒

### ⚠️ 需要注意的问题

1. **专业搜索功能**
   - 现有版本支持按专业搜索学校
   - V2.0后端可能不支持此功能
   - **建议**: 评估是否需要保留

2. **收藏功能**
   - 现有版本点击收藏无实际功能
   - V2.0需要后端支持收藏接口
   - **建议**: 第一版可先隐藏此功能

3. **预约时间选择**
   - 现有版本的时间段是写死的
   - V2.0需要从后端获取可约时间
   - **建议**: 确认后端是否有此接口

4. **图片显示**
   - 小程序要求图片必须是HTTPS
   - 后台上传的图片域名需配置白名单
   - **建议**: 提前配置好图片CDN

---

## 文件清单

### 参考文件 (已提供)
- `MINIPROGRAM_DESIGN.md` - 详细设计文档
- `MINIPROGRAM_MIGRATION_GUIDE.md` - 快速迁移指南
- `MINIPROGRAM_UPGRADE_ANALYSIS.md` - 完整对比分析 (本文档)
- `config.js` - 配置文件
- `utils/api-v2.js` - API封装
- `app-v2.json` - 页面配置
- `pages/index/index-v2.js` - 首页参考代码
- `pages/index/index-v2.wxml` - 首页模板参考

### 需要修改的文件
```
pages/
├── index/           # 重写数据加载
├── school/          # 重写数据加载 + 路径调整
├── case/            # 重写数据加载 + 路径调整
├── news/            # 完全重写
├── consultant/      # 重写
├── appointment/     # 重写提交逻辑
└── user/            # 对接用户信息

utils/
├── api.js           # 替换为api-v2.js
├── dataManager.js   # 删除
├── universityData.js # 删除
└── newsManager.js   # 删除

根目录/
├── app.json         # 替换为app-v2.json
└── config.js        # 新增
```

---

## 快速开始

```bash
# 1. 备份现有文件
mkdir backup
cp app.json backup/
cp -r utils/api.js backup/
cp -r pages/index/index.js backup/

# 2. 复制V2.0文件
cp config.js .
cp utils/api-v2.js utils/api.js
cp app-v2.json app.json

# 3. 参考V2.0代码改造页面
# 参考 pages/index/index-v2.js 重写首页
# ...

# 4. 删除无用文件
rm utils/dataManager.js
rm utils/universityData.js
rm utils/newsManager.js
```

---

## 需要帮助？

详细参考文档:
1. `README_MINIPROGRAM_V2.md` - 文档索引
2. `MINIPROGRAM_DESIGN.md` - 详细设计
3. `MINIPROGRAM_MIGRATION_GUIDE.md` - 迁移指南
4. `huananliu-web/DESIGN_MANUAL.md` - 后端API文档
