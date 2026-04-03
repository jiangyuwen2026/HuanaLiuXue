# 关于我们页面后台配置功能

## 功能概述

已实现官网"关于我们"页面的后台可配置功能，可以在后台管理界面灵活配置页面内容。

## 文件结构

```
backend/
├── models/
│   └── About.js              # 数据库模型
├── routes/
│   └── about.js              # API路由
└── index.js                  # 添加路由引用

frontend/admin/
├── src/
│   ├── pages/
│   │   └── About.jsx         # 后台管理页面
│   ├── components/
│   │   └── Layout.jsx        # 添加菜单项
│   └── App.jsx               # 添加路由
└── ...

frontend/website/
└── src/
    └── pages/
        └── About.jsx         # 前台页面（从API获取数据）
```

## 可配置内容

### 1. Hero 区域
- 副标题
- 主标题
- 描述文字
- 背景图

### 2. 统计数据
- 数值（如：15+）
- 标签（如：年行业经验）
- 描述（如：深耕留学服务领域）

### 3. 使命与愿景
- 使命标题和内容
- 愿景标题和内容

### 4. 核心价值观
- 标题、描述
- 渐变色配置
- 图标选择

### 5. 发展历程
- 年份
- 事件标题
- 事件描述

### 6. 为什么选择我们
- 标题、副标题
- 区域图片
- 优势列表（序号、标题、描述）

### 7. 核心团队
- 标题、副标题
- 成员信息（姓名、职位、简介、头像）

### 8. 合作院校
- 标题、副标题
- 院校名称列表

## 使用说明

### 访问后台管理

1. 登录后台管理：http://localhost:3002
2. 进入「网站管理」→「关于我们」
3. 在各个 Tab 中编辑内容
4. 点击「保存配置」生效

### API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/about` | GET | 前台获取关于我们数据 |
| `/api/about/admin` | GET | 后台获取关于我们数据 |
| `/api/about/admin` | PUT | 更新关于我们数据 |

## 数据库表结构

表名：`abouts`

| 字段 | 类型 | 说明 |
|------|------|------|
| hero_title | VARCHAR(200) | Hero主标题 |
| hero_subtitle | VARCHAR(100) | Hero副标题 |
| hero_description | TEXT | Hero描述 |
| hero_background | VARCHAR(500) | Hero背景图URL |
| stats | JSON | 统计数据数组 |
| mission_title | VARCHAR(100) | 使命标题 |
| mission_content | TEXT | 使命内容 |
| vision_title | VARCHAR(100) | 愿景标题 |
| vision_content | TEXT | 愿景内容 |
| values | JSON | 核心价值观数组 |
| timeline | JSON | 发展历程数组 |
| advantages_title | VARCHAR(100) | 优势区域标题 |
| advantages_subtitle | VARCHAR(200) | 优势区域副标题 |
| advantages | JSON | 优势列表数组 |
| advantages_image | VARCHAR(500) | 优势区域图片 |
| team_title | VARCHAR(100) | 团队标题 |
| team_subtitle | VARCHAR(200) | 团队副标题 |
| team | JSON | 团队成员数组 |
| partners_title | VARCHAR(100) | 合作院校标题 |
| partners_subtitle | VARCHAR(200) | 合作院校副标题 |
| partners | JSON | 合作院校名称数组 |

## 默认值

系统首次访问时会自动创建默认数据，包含示例内容。您可以在后台修改这些内容。

## 注意事项

1. 图片上传使用现有的上传接口，存储在 `uploads/schools` 目录
2. JSON 字段在后台以表格形式编辑，支持增删改
3. 所有修改需要点击「保存配置」按钮才会生效
4. 前台页面会自动获取最新的配置数据
