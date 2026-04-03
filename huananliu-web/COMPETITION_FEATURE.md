# 竞赛详情页功能说明

## 功能概述

已完成竞赛详情页开发和后台管理功能，实现以下功能：

1. **前台竞赛详情页**：点击竞赛规划页面的竞赛名称，跳转到竞赛详情页
2. **后台竞赛管理**：在产品与服务菜单下新增"竞赛管理"功能

## 文件变更

### 后端 (backend/)

1. **models/index.js**
   - 添加 `Competition` 模型定义

2. **routes/competition.js** (新增)
   - 前台API：获取竞赛列表、获取竞赛详情、获取分类列表
   - 后台API：竞赛CRUD操作、状态管理、排序管理

3. **index.js**
   - 添加竞赛路由 `/api/competitions`

4. **migrations/create_competitions.sql** (新增)
   - 数据库表结构定义
   - 示例数据（AMC 8/10/12、Physics Bowl）

### 前台 (frontend/website/)

1. **src/pages/CompetitionDetail.jsx**
   - 重写为从后端获取数据的动态页面
   - 新增Tab导航：竞赛概述、赛制大纲、时间节点、奖项设置、备考资源
   - 支持HTML内容渲染（使用 DOMPurify 安全过滤）

2. **src/pages/Competition.jsx**
   - 竞赛列表添加 `slug` 字段
   - 更新链接使用 slug 而非 name

3. **src/App.jsx**
   - 路由参数从 `:name` 改为 `:slug`

### 后台管理 (frontend/admin/)

1. **src/pages/CompetitionManagement.jsx** (新增)
   - 完整的竞赛管理功能
   - Tab表单：基础信息、竞赛概述、赛制大纲、时间节点、奖项设置、历年分数线、备考资源、推荐书籍

2. **src/components/Layout.jsx**
   - 添加"竞赛管理"菜单项

3. **src/App.jsx**
   - 添加竞赛管理路由

4. **src/utils/api.js**
   - 添加竞赛相关API调用函数

## 数据库表结构

### competitions 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| slug | VARCHAR(50) | URL标识（唯一） |
| name | VARCHAR(100) | 竞赛名称 |
| name_en | VARCHAR(100) | 英文名称 |
| category | VARCHAR(50) | 分类（math/physics/chemistry/biology/computer/business） |
| level | VARCHAR(50) | 难度级别 |
| hero_tag | VARCHAR(50) | Hero区域标签 |
| hero_short_desc | TEXT | 简短描述 |
| overview | TEXT | 竞赛概述（HTML） |
| eligibility | TEXT | 参赛资格 |
| format | TEXT | 竞赛形式（HTML） |
| syllabus | TEXT | 考试大纲（HTML） |
| scoring | TEXT | 评分标准 |
| timeline | JSON | 时间节点数组 |
| awards | TEXT | 奖项说明（HTML） |
| award_details | JSON | 奖项详情数组 |
| score_history | JSON | 历年分数线数组 |
| resources | JSON | 备考资源数组 |
| recommended_books | JSON | 推荐书籍数组 |
| participants | VARCHAR(50) | 参赛人数 |
| countries | VARCHAR(20) | 参与国家数 |
| difficulty_score | INT | 难度评分（1-10） |
| recognition | VARCHAR(200) | 认可度说明 |
| logo | VARCHAR(500) | Logo图片URL |
| banner | VARCHAR(500) | Banner图片URL |
| official_url | VARCHAR(500) | 官网链接 |
| status | TINYINT | 0=下架, 1=上架 |
| sort_order | INT | 排序值 |
| view_count | INT | 浏览量 |

## 使用说明

### 1. 数据库初始化

```bash
# 登录MySQL执行
mysql -u root -p huananliu < backend/migrations/create_competitions.sql
```

### 2. 启动服务

```bash
# 启动后端
cd backend && npm start

# 启动前台
cd frontend/website && npm run dev

# 启动后台管理
cd frontend/admin && npm run dev
```

### 3. 访问页面

- 前台竞赛规划：`http://localhost:3000/competition`
- 竞赛详情页：`http://localhost:3000/competition/{slug}`
  - 示例：`http://localhost:3000/competition/amc-8-10-12`
- 后台竞赛管理：`http://localhost:3002/services/competition-management`

### 4. 添加新竞赛

1. 登录后台管理
2. 进入"产品服务" → "竞赛管理"
3. 点击"添加竞赛"按钮
4. 填写各项信息（slug为必填，用于URL）
5. 保存后前台即可访问

## 竞赛分类

| 分类ID | 名称 | 颜色主题 |
|--------|------|----------|
| math | 数学竞赛 | 蓝色 |
| physics | 物理竞赛 | 紫色 |
| chemistry | 化学竞赛 | 绿色 |
| biology | 生物竞赛 | 红色 |
| computer | 计算机竞赛 | 青色 |
| business | 商科竞赛 | 橙色 |

## 前端路由映射

前台竞赛规划页面中的竞赛链接已配置好 slug：

| 竞赛名称 | slug |
|----------|------|
| AMC 8/10/12 | amc-8-10-12 |
| AIME | aime |
| Physics Bowl | physics-bowl |
| USABO | usabo |
| BBO | bbo |
| Brain Bee | brain-bee |
| USACO | usaco |
| NEC | nec |
| ... | ... |

## 注意事项

1. **slug 必须唯一**：作为URL标识，不能重复
2. **HTML 内容安全**：使用 DOMPurify 过滤，支持富文本编辑
3. **图片上传**：Logo和Banner可以使用图片上传功能获取URL
4. **JSON 字段**：timeline、award_details、score_history、resources、recommended_books 为JSON数组格式
