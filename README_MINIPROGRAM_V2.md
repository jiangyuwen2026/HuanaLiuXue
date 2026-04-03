# 华南留学小程序 v2.0 重构文档索引

## 概述

本次重构将小程序从静态数据驱动改造为**对接官网后台API**，实现后台管理配置的内容自动同步到小程序展示。

```
┌─────────────────────────────────────────────────────────────┐
│                      后台管理系统                             │
│         (Banner/学校/案例/顾问/新闻/服务 管理)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     后端API服务 (Node.js)                     │
│              统一接口供官网和小程序调用                         │
└─────────────────────────────────────────────────────────────┘
              │                           │
              ▼                           ▼
    ┌─────────────────┐         ┌─────────────────┐
    │    官网前端      │         │    小程序端      │
    │  (React+Tailwind)│         │   (微信小程序)   │
    └─────────────────┘         └─────────────────┘
```

---

## 文档清单

### 📋 核心设计文档

| 文档 | 路径 | 说明 |
|------|------|------|
| **重构设计说明书** | [MINIPROGRAM_DESIGN.md](./MINIPROGRAM_DESIGN.md) | 完整的功能架构、数据对接、页面设计 |
| **快速迁移指南** | [MINIPROGRAM_MIGRATION_GUIDE.md](./MINIPROGRAM_MIGRATION_GUIDE.md) | 快速开始、改造清单、常见问题 |

### 💻 参考代码文件

| 文件 | 路径 | 说明 |
|------|------|------|
| **配置文件** | [config.js](./config.js) | 小程序配置文件，设置API地址 |
| **API封装** | [utils/api-v2.js](./utils/api-v2.js) | 对接后端API的请求封装 |
| **页面配置** | [app-v2.json](./app-v2.json) | 更新后的页面结构和TabBar |
| **首页逻辑** | [pages/index/index-v2.js](./pages/index/index-v2.js) | 首页JS，展示API对接方式 |
| **首页模板** | [pages/index/index-v2.wxml](./pages/index/index-v2.wxml) | 首页WXML模板 |

### 📚 关联文档

| 文档 | 路径 | 说明 |
|------|------|------|
| **官网设计说明书** | [huananliu-web/DESIGN_MANUAL.md](./huananliu-web/DESIGN_MANUAL.md) | 官网技术架构设计 |
| **官网产品说明书** | [huananliu-web/PRODUCT_MANUAL.md](./huananliu-web/PRODUCT_MANUAL.md) | 产品功能规格说明 |
| **AI上下文文档** | [huananliu-web/AI_CONTEXT.md](./huananliu-web/AI_CONTEXT.md) | 供AI理解的编码指南 |

---

## 快速导航

### 如果你是产品经理/运营
→ 阅读 [MINIPROGRAM_DESIGN.md](./MINIPROGRAM_DESIGN.md) 的：
- 第1章：设计目标
- 第2章：功能架构设计
- 第8章：配置检查清单

### 如果你是前端开发者
→ 按顺序阅读：
1. [MINIPROGRAM_MIGRATION_GUIDE.md](./MINIPROGRAM_MIGRATION_GUIDE.md) - 快速开始
2. [MINIPROGRAM_DESIGN.md](./MINIPROGRAM_DESIGN.md) - 详细设计
3. 参考代码文件：`config.js`, `utils/api-v2.js`, `pages/index/index-v2.js`

### 如果你是后端开发者
→ 无需修改，复用现有API：
- 所有接口已支持，见 [huananliu-web/DESIGN_MANUAL.md](./huananliu-web/DESIGN_MANUAL.md) 第3章

---

## 核心功能对照

| 功能 | 后台管理入口 | 小程序展示位置 | API接口 |
|------|-------------|---------------|---------|
| 轮播图 | Banner管理 | 首页顶部 | `GET /api/banners` |
| 明星案例 | 案例管理-设为明星 | 首页-明星案例区 | `GET /api/cases/featured/list` |
| 热门学校 | 学校管理-热门设置 | 首页-热门名校区 | `GET /api/schools/hot/list` |
| 推荐资讯 | 新闻管理-推荐到首页 | 首页-推荐资讯区 | `GET /api/news/recommended/list` |
| 学校列表 | 学校管理 | 学校列表页 | `GET /api/schools` |
| 案例列表 | 案例管理 | 案例列表页 | `GET /api/cases` |
| 顾问列表 | 顾问管理 | 顾问列表页 | `GET /api/consultants` |

---

## 实施步骤概览

```
Step 1: 准备阶段 (30分钟)
   ├── 确认后端服务运行正常
   ├── 复制配置文件
   └── 替换API封装文件

Step 2: 首页改造 (2小时)
   ├── 更新app.json页面结构
   ├── 重写首页逻辑(index.js)
   └── 重写首页模板(index.wxml)

Step 3: 列表页改造 (2小时)
   ├── 学校列表页
   ├── 案例列表页
   └── 资讯列表页

Step 4: 详情页改造 (1.5小时)
   ├── 学校详情页
   ├── 案例详情页
   └── 资讯详情页

Step 5: 功能页改造 (1小时)
   ├── 预约表单页
   └── 个人中心页

Step 6: 测试验收 (1小时)
   ├── 功能测试
   ├── 数据一致性测试
   └── 性能测试
```

---

## 重要提示

1. **数据同步**: 小程序展示的数据完全依赖后台配置，请确保后台已配置好相关内容
2. **图片域名**: 小程序要求图片使用HTTPS，且域名需在小程序后台配置白名单
3. **版本兼容**: 建议基础库版本 2.19.4+

---

## 问题反馈

如有问题，请参考详细设计文档或查看官网后端API文档。
