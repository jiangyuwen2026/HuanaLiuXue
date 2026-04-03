# 华南留学平台 - 设计说明书
# South China Study Abroad Platform - Design Manual

> **版本**: v1.0.0-FINAL  
> **发布日期**: 2026-03-25  
> **状态**: 已冻结 (FROZEN)  
> **目标读者**: 开发者、架构师、AI助手

---

## 文档导航

| 文档 | 说明 | 目标读者 |
|------|------|----------|
| PRODUCT_MANUAL.md | 产品说明书 | 用户、运营、产品 |
| DESIGN_MANUAL.md | 设计说明书 (本文件) | 开发者、架构师 |
| AI_CONTEXT.md | AI上下文文档 | AI助手、自动化工具 |
| VERSION | 版本标记文件 | AI快速识别 |

---

## 1. 架构设计

### 1.1 系统架构图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              客户端层 (Client Layer)                     │
├─────────────────────────┬───────────────────────────────────────────────┤
│      官网前端            │           后台管理前端                          │
│   React + Tailwind      │        React + Ant Design                      │
│      Port: 3000         │           Port: 3002                           │
└───────────┬─────────────┴───────────────────────┬───────────────────────┘
            │                                      │
            │           HTTP/REST API              │
            └──────────────────┬───────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────────┐
│                          API网关层 (Port: 3001)                          │
│                      Express.js + JWT认证                                │
├─────────────────────────────────────────────────────────────────────────┤
│                          业务逻辑层 (Service Layer)                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐   │
│  │ Schools │ │  Cases  │ │Consult- │ │  News   │ │  Testimonials   │   │
│  │         │ │         │ │ ants    │ │         │ │                 │   │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────────┬────────┘   │
│       └────────────┴───────────┴───────────┴────────────────┘           │
│                              │                                          │
│                    Sequelize ORM (Models)                               │
└──────────────────────────────┼──────────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────────┐
│                        数据持久层 (MySQL Database)                       │
│     Schools / Cases / Consultants / News / Testimonials / Users...       │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 目录结构

```
huananliu-web/
├── VERSION                    # 版本标记文件
├── PRODUCT_MANUAL.md          # 产品说明书
├── DESIGN_MANUAL.md           # 设计说明书 (本文件)
├── AI_CONTEXT.md              # AI上下文文档
│
├── frontend/
│   ├── website/               # 官网前端
│   │   ├── src/
│   │   │   ├── components/    # 公共组件
│   │   │   ├── pages/         # 页面组件
│   │   │   ├── utils/         # 工具函数
│   │   │   ├── main.jsx       # 入口 (含版本标记)
│   │   │   └── App.jsx
│   │   ├── package.json       # v1.0.0-FINAL
│   │   └── vite.config.js
│   │
│   └── admin/                 # 后台管理前端
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── utils/
│       │   ├── main.jsx       # 入口 (含版本标记)
│       │   └── App.jsx
│       ├── package.json       # v1.0.0-FINAL
│       └── vite.config.js
│
└── backend/                   # 后端服务
    ├── index.js               # 入口 (含版本标记)
    ├── package.json           # v1.0.0-FINAL
    ├── config.js              # 配置文件
    ├── models/                # Sequelize模型
    │   ├── index.js
    │   ├── School.js
    │   ├── Case.js
    │   ├── Consultant.js
    │   ├── News.js
    │   ├── Testimonial.js
    │   └── ...
    ├── routes/                # API路由
    │   ├── schools.js
    │   ├── cases.js
    │   ├── consultants.js
    │   ├── news.js
    │   ├── testimonials.js
    │   └── ...
    └── uploads/               # 上传文件存储
```

---

## 2. 数据模型设计

### 2.1 核心实体关系图

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Schools    │◄────────┤    Cases     │         │ Consultants  │
├──────────────┤    1:N  ├──────────────┤         ├──────────────┤
│ id (PK)      │         │ id (PK)      │         │ id (PK)      │
│ name         │         │ student_name │         │ name         │
│ name_en      │         │ school_id(FK)│         │ title        │
│ country      │         │ major        │         │ avatar       │
│ ranking      │         │ degree       │         │ specialties  │
│ logo         │         │ is_featured  │         │ experience   │
│ ...          │         │ feature_sort │         │ ...          │
└──────────────┘         │ ...          │         └──────────────┘
                         └──────────────┘
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│     News     │         │Testimonials  │         │   Services   │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │         │ id (PK)      │         │ id (PK)      │
│ title        │         │ student_name │         │ title        │
│ content      │         │ avatar       │         │ description  │
│ is_recommend │         │ school       │         │ icon         │
│ recommend_so │         │ major        │         │ sort_order   │
│ ...          │         │ content      │         │ ...          │
└──────────────┘         │ sort_order   │         └──────────────┘
                         └──────────────┘
```

### 2.2 模型详细定义

#### School 模型
```javascript
{
  id: INTEGER PK AUTO_INCREMENT,
  name: STRING(100),           // 中文名
  name_en: STRING(200),        // 英文名
  country: STRING(50),         // 国家
  city: STRING(50),            // 城市
  ranking: INTEGER,            // 排名
  description: TEXT,           // 简介
  logo: STRING(500),           // Logo URL
  images: TEXT,                // JSON数组
  is_hot: TINYINT DEFAULT 0,   // 是否热门
  sort_order: INTEGER,         // 排序
  status: TINYINT DEFAULT 1,   // 状态
  created_at: DATE,
  updated_at: DATE
}
```

#### Case 模型
```javascript
{
  id: INTEGER PK AUTO_INCREMENT,
  student_name: STRING(50),           // 学生姓名
  school_id: INTEGER FK,              // 录取学校
  major: STRING(100),                 // 专业
  degree: STRING(50),                 // 学位
  background: TEXT,                   // 背景
  result: STRING(200),                // 结果
  content: TEXT,                      // 详情
  
  // 明星案例字段
  is_featured: TINYINT DEFAULT 0,     // 是否明星案例
  feature_sort: INTEGER DEFAULT 0,    // 明星案例排序
  feature_highlight: STRING(100),     // 亮点标签
  feature_bg: STRING(100),            // 背景渐变
  
  status: TINYINT DEFAULT 1,
  created_at: DATE,
  updated_at: DATE
}
```

#### News 模型
```javascript
{
  id: INTEGER PK AUTO_INCREMENT,
  title: STRING(200),                 // 标题
  content: TEXT,                      // 内容
  summary: STRING(500),               // 摘要
  cover_image: STRING(500),           // 封面图
  category: STRING(50),               // 分类
  
  // 推荐字段
  is_recommended: TINYINT DEFAULT 0,  // 是否推荐
  recommend_sort: INTEGER DEFAULT 0,  // 推荐排序
  
  status: TINYINT DEFAULT 1,
  created_at: DATE,
  updated_at: DATE
}
```

#### Testimonial 模型
```javascript
{
  id: INTEGER PK AUTO_INCREMENT,
  student_name: STRING(50),           // 学生姓名
  avatar: STRING(500),                // 头像
  school: STRING(100),                // 学校
  major: STRING(100),                 // 专业
  content: TEXT,                      // 评价内容
  sort_order: INTEGER DEFAULT 0,      // 排序
  status: TINYINT DEFAULT 1,
  created_at: DATE,
  updated_at: DATE
}
```

---

## 3. API 设计

### 3.1 RESTful API 规范

所有API统一以 `/api` 为前缀，返回格式统一为：

```javascript
{
  "success": boolean,      // 操作是否成功
  "message": string,       // 提示信息
  "data": any,             // 返回数据
  "total": number          // 列表总数(可选)
}
```

### 3.2 公共API (Public)

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/banners | 获取Banner列表 |
| GET | /api/schools | 获取学校列表 |
| GET | /api/schools/:id | 获取学校详情 |
| GET | /api/cases | 获取案例列表 |
| GET | /api/cases/featured/list | 获取明星案例 |
| GET | /api/consultants | 获取顾问列表 |
| GET | /api/news | 获取新闻列表 |
| GET | /api/news/recommended | 获取推荐新闻 |
| GET | /api/services | 获取服务列表 |
| GET | /api/testimonials | 获取评价列表 |
| POST | /api/messages | 提交咨询消息 |
| POST | /api/appointments | 提交预约 |

### 3.3 管理API (Admin) - 需JWT认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/admin/login | 管理员登录 |
| GET | /api/schools/admin | 学校列表(管理) |
| POST | /api/schools/admin | 创建学校 |
| PUT | /api/schools/admin/:id | 更新学校 |
| DELETE | /api/schools/admin/:id | 删除学校 |
| PUT | /api/cases/admin/:id/featured | 设置明星案例 |
| PUT | /api/news/admin/:id/recommend | 设置推荐新闻 |
| ... | ... | 其他管理接口 |

---

## 4. 前端架构

### 4.1 官网前端 (Website)

**技术栈**: React 18 + Vite + TailwindCSS + React Router

**关键目录**:
```
src/
├── components/           # 公共组件
│   ├── Header.jsx       # 页头导航
│   ├── Footer.jsx       # 页脚
│   └── PageHeader.jsx   # 页面标题
├── pages/               # 页面
│   ├── Home.jsx         # 首页
│   ├── Schools.jsx      # 学校列表
│   ├── SchoolDetail.jsx # 学校详情
│   ├── Cases.jsx        # 案例列表
│   ├── CaseDetail.jsx   # 案例详情
│   ├── Consultants.jsx  # 顾问列表
│   ├── News.jsx         # 新闻列表
│   ├── NewsDetail.jsx   # 新闻详情
│   ├── Services.jsx     # 服务列表
│   ├── Assessment.jsx   # 评估表单
│   └── About.jsx        # 关于我们
├── utils/
│   ├── api.js           # API封装
│   └── helpers.js       # 工具函数
└── main.jsx             # 入口 (含版本标记)
```

### 4.2 后台前端 (Admin)

**技术栈**: React 18 + Vite + Ant Design + React Router

**关键目录**:
```
src/
├── components/           # 公共组件
├── pages/               # 页面
│   ├── Login.jsx        # 登录
│   ├── Dashboard.jsx    # 仪表盘
│   ├── Banners.jsx      # Banner管理
│   ├── Schools.jsx      # 学校管理
│   ├── Cases.jsx        # 案例管理
│   ├── Consultants.jsx  # 顾问管理
│   ├── News.jsx         # 新闻管理
│   ├── Services.jsx     # 服务管理
│   └── Testimonials.jsx # 评价管理
├── utils/
│   ├── api.js           # API封装
│   └── request.js       # Axios配置
└── main.jsx             # 入口 (含版本标记)
```

---

## 5. 关键功能实现

### 5.1 明星案例功能

**数据流**:
1. 后台设置 `is_featured=1` 并配置 `feature_highlight`, `feature_bg`
2. 前端调用 `GET /api/cases/featured/list` 获取列表
3. 首页展示带渐变背景的卡片

**代码位置**:
- 后端: `backend/routes/cases.js` -> `router.get('/featured/list', ...)`
- 前端: `frontend/website/src/pages/Home.jsx` -> Featured Cases Section
- 后台: `frontend/admin/src/pages/Cases.jsx` -> Featured Tab

### 5.2 推荐新闻功能

**数据流**:
1. 后台设置 `is_recommended=1` 和 `recommend_sort`
2. 前端调用 `GET /api/news/recommended` 获取列表
3. 首页展示推荐新闻区域

### 5.3 评价轮播

**实现方式**: CSS动画无限滚动

```css
.animate-marquee {
  animation: marquee 30s linear infinite;
}
```

**代码位置**: `frontend/website/src/pages/Cases.jsx`

---

## 6. 扩展指南

### 6.1 新增功能模块

如需新增功能模块，请参考以下步骤：

1. **数据库**: 在 `backend/models/` 创建新模型
2. **API**: 在 `backend/routes/` 创建新路由
3. **官网**: 在 `frontend/website/src/pages/` 创建新页面
4. **后台**: 在 `frontend/admin/src/pages/` 创建管理页面

### 6.2 修改现有功能

由于版本已冻结，修改现有功能时：

1. 检查 `PRODUCT_MANUAL.md` 确认功能规格
2. 检查本文件确认技术实现
3. 在代码中添加修改标记和注释
4. 更新 `AI_CONTEXT.md` 中的变更记录

---

## 7. 配置说明

### 7.1 后端配置 (config.js)

```javascript
module.exports = {
  jwt: {
    secret: 'your-secret-key',
    expiresIn: '24h'
  },
  database: {
    host: 'localhost',
    port: 3306,
    name: 'huananliu',
    user: 'root',
    password: 'password'
  },
  server: {
    port: 3001,
    corsOrigin: ['http://localhost:3000', 'http://localhost:3002']
  }
};
```

### 7.2 端口配置

| 服务 | 端口 | 说明 |
|------|------|------|
| 官网 | 3000 | React开发服务器 |
| 后端 | 3001 | Express API服务 |
| 后台 | 3002 | React开发服务器 |
| MySQL | 3306 | 数据库 |

---

## 8. 部署说明

### 8.1 开发环境启动

```bash
# 1. 启动后端
cd backend
npm install
npm run dev

# 2. 启动官网
cd frontend/website
npm install
npm run dev

# 3. 启动后台
cd frontend/admin
npm install
npm run dev
```

### 8.2 生产环境构建

```bash
# 官网构建
cd frontend/website
npm run build

# 后台构建
cd frontend/admin
npm run build

# 后端部署
cd backend
npm start
```

---

## 9. 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0.0-FINAL | 2026-03-25 | 功能完成冻结版本 |

---

## 10. AI辅助编码提示

如果你是AI助手，在处理此项目时：

1. **首先阅读**: VERSION 文件获取版本状态
2. **功能查询**: 查阅 PRODUCT_MANUAL.md
3. **技术实现**: 查阅 DESIGN_MANUAL.md (本文件)
4. **上下文**: 查阅 AI_CONTEXT.md 获取代码模式

**重要**: 此版本已冻结，修改时请：
- 保持原有代码风格
- 添加充分的修改注释
- 不要破坏现有功能
- 更新相关文档
