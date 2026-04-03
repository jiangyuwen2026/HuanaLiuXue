# 华南留学 Web 官网及管理后台项目

## 项目概述

- **项目名称**: 华南留学 Web 官网 + 管理后台
- **项目类型**: 全栈 Web 应用
- **核心功能**: 展示学校/顾问/案例/新闻信息，提供在线咨询，与小程序共用MySQL数据库
- **目标用户**: 准留学生、家长、留学顾问

## 技术栈

### 前端
- **官网**: React 18 + TailwindCSS + React Router
- **管理后台**: React 18 + Ant Design 5 + React Router
- **HTTP客户端**: Axios
- **状态管理**: React Context

### 后端
- **框架**: Node.js + Express
- **数据库**: MySQL 8.0
- **ORM**: Sequelize
- **认证**: JWT + bcrypt

### 开发工具
- **包管理**: npm
- **构建工具**: Vite

## 目录结构

```
huananliu-web/
├── web-admin/                    # 项目根目录
│   ├── backend/                  # 后端服务
│   │   ├── config/               # 配置文件
│   │   ├── controllers/          # 控制器
│   │   ├── models/               # 数据模型
│   │   ├── routes/               # 路由
│   │   ├── middleware/           # 中间件
│   │   ├── utils/                # 工具函数
│   │   ├── database/             # 数据库脚本
│   │   └── index.js              # 入口文件
│   │
│   ├── frontend/                 # 前端根目录
│   │   ├── website/              # 官网前端
│   │   │   ├── src/
│   │   │   └── public/
│   │   │
│   │   └── admin/                # 管理后台
│   │       ├── src/
│   │       └── public/
│   │
│   └── docs/                     # 项目文档
│
└── SPEC.md                       # 项目规范文档
```

## 核心功能

### 官网功能
1. **首页**: 轮播图、热门学校、热门顾问、留学资讯
2. **学校列表**: 按国家/专业筛选、搜索、排序
3. **学校详情**: 院校介绍、排名、优势专业
4. **顾问列表**: 按服务类型/地区筛选
5. **顾问详情**: 个人简介、案例展示、用户评价
6. **成功案例**: 案例展示、申请过程分享
7. **新闻资讯**: 留学政策、申请攻略、院校动态
8. **在线咨询**: 在线留言、客服聊天入口
9. **关于我们**: 公司介绍、联系方式

### 管理后台功能
1. **内容管理**
   - 学校管理（CRUD）
   - 顾问管理（CRUD）
   - 案例管理（CRUD）
   - 新闻管理（CRUD）
   - 轮播图管理
   - 留言管理

2. **用户管理**
   - 用户列表
   - 角色权限
   - 操作日志

3. **数据统计**
   - 访问统计
   - 留言统计
   - 数据报表

## API 接口设计

### 公开接口
- `GET /api/schools` - 学校列表
- `GET /api/schools/:id` - 学校详情
- `GET /api/consultants` - 顾问列表
- `GET /api/consultants/:id` - 顾问详情
- `GET /api/cases` - 成功案例列表
- `GET /api/cases/:id` - 案例详情
- `GET /api/news` - 新闻列表
- `GET /api/news/:id` - 新闻详情
- `POST /api/messages` - 提交留言

### 管理后台接口（需认证）
- `POST /api/admin/login` - 管理员登录
- `GET /api/admin/schools` - 学校管理
- `POST /api/admin/schools` - 创建学校
- `PUT /api/admin/schools/:id` - 更新学校
- `DELETE /api/admin/schools/:id` - 删除学校
- `GET /api/admin/consultants` - 顾问管理
- `POST /api/admin/consultants` - 创建顾问
- `PUT /api/admin/consultants/:id` - 更新顾问
- `DELETE /api/admin/consultants/:id` - 删除顾问
- `GET /api/admin/cases` - 案例管理
- `POST /api/admin/cases` - 创建案例
- `PUT /api/admin/cases/:id` - 更新案例
- `DELETE /api/admin/cases/:id` - 删除案例
- `GET /api/admin/news` - 新闻管理
- `POST /api/admin/news` - 创建新闻
- `PUT /api/admin/news/:id` - 更新新闻
- `DELETE /api/admin/news/:id` - 删除新闻
- `GET /api/admin/messages` - 留言列表
- `PUT /api/admin/messages/:id` - 处理留言
- `GET /api/admin/stats` - 数据统计

## 数据库表设计

### schools（学校表）
- id: 主键
- name_cn: 中文名
- name_en: 英文名
- country: 国家
- city: 城市
- rank: 排名
- logo: logo URL
- banner: banner URL
- description: 简介
- features: 优势专业 (JSON)
- requirements: 申请要求 (JSON)
- tuition: 学费范围
- website: 官网链接
- status: 状态 (0: 下架, 1: 上架)
- view_count: 浏览量
- created_at: 创建时间
- updated_at: 更新时间

### consultants（顾问表）
- id: 主键
- name: 姓名
- avatar: 头像 URL
- title: 职位
- service_type: 服务类型
- region: 地区
- experience: 从业年限
- education: 教育背景
- specialties: 专长领域 (JSON)
- bio: 个人简介
- success_cases: 成功案例数
- rating: 评分
- status: 状态
- created_at: 创建时间
- updated_at: 更新时间

### cases（成功案例表）
- id: 主键
- title: 案例标题
- student_name: 学生姓名 (脱敏)
- avatar: 学生头像
- consultant_id: 顾问ID
- school_id: 申请学校ID
- original_school: 高考/原学校
- target_country: 目标国家
- target_major: 目标专业
- admission_result: 录取结果
- scholarship: 奖学金
- story: 申请故事
- images: 相关图片 (JSON)
- status: 状态
- view_count: 浏览量
- created_at: 创建时间
- updated_at: 更新时间

### news（新闻表）
- id: 主键
- title: 标题
- cover: 封面图
- category: 分类
- summary: 摘要
- content: 内容 (Markdown/富文本)
- author: 作者
- source: 来源
- tags: 标签 (JSON)
- status: 状态
- view_count: 浏览量
- published_at: 发布时间
- created_at: 创建时间
- updated_at: 更新时间

### messages（留言表）
- id: 主键
- name: 姓名
- phone: 电话
- email: 邮箱
- country: 意向国家
- message: 留言内容
- status: 状态 (0: 未处理, 1: 已处理)
- remark: 备注
- created_at: 创建时间
- updated_at: 更新时间

### banners（轮播图表）
- id: 主键
- title: 标题
- image: 图片 URL
- link_type: 链接类型 (school/consultant/case/news/url)
- link_id: 链接ID
- link_url: 外部链接
- sort: 排序
- status: 状态
- created_at: 创建时间
- updated_at: 更新时间

### admins（管理员表）
- id: 主键
- username: 用户名
- password: 密码 (加密)
- name: 姓名
- role: 角色 (super_admin/admin/editor)
- status: 状态
- last_login: 最后登录时间
- created_at: 创建时间
- updated_at: 更新时间

## 验收标准

### 功能验收
- [ ] 官网首页正常显示轮播图和热门内容
- [ ] 学校/顾问/案例/新闻列表页正常加载
- [ ] 各详情页内容完整展示
- [ ] 在线留言功能正常工作
- [ ] 管理后台登录正常
- [ ] 管理后台CRUD操作正常
- [ ] 数据统计功能正常

### 性能验收
- [ ] 首页加载时间 < 3秒
- [ ] API响应时间 < 500ms
- [ ] 移动端正常显示

### 代码质量
- [ ] 前后端代码规范
- [ ] 关键函数有注释
- [ ] 无明显安全漏洞
