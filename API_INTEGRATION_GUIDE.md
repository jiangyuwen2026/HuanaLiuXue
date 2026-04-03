# 小程序 API 对接指南

## 已完成的对接

### 留学资讯 - 已对接后台新闻管理

小程序 `pages/news/news.js` 现在从后台管理系统的**新闻管理**模块获取数据。

## 后端接口信息

### 新闻相关接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取新闻列表 | GET | `/api/news` | 支持分类筛选 |
| 获取新闻详情 | GET | `/api/news/:id` | 获取单条新闻 |
| 获取分类列表 | GET | `/api/news/options/categories` | 获取所有分类 |

### 请求参数

**获取新闻列表**
```
GET /api/news?page=1&limit=10&category=香港

参数：
- page: 页码（默认1）
- limit: 每页数量（默认10）
- category: 分类筛选（可选）
```

**返回格式**
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": 1,
        "title": "标题",
        "summary": "摘要",
        "content": "内容",
        "cover_image": "图片URL",
        "category": "香港",
        "view_count": 1200,
        "published_at": "2024-01-01 10:00:00"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

## 配置说明

### 1. 修改 API 地址

编辑 `app.js`：
```javascript
// 开发环境
const API_BASE_URL = 'http://localhost:3001/api';

// 生产环境（上线时切换）
// const API_BASE_URL = 'https://api.huananliuxue.com/api';
```

### 2. 后台数据准备

在 **华南留学后台管理** 中配置：

1. **访问后台**：`http://localhost:3002`（开发）
2. **进入菜单**：新闻管理
3. **添加新闻**：
   - 标题
   - 摘要
   - 封面图
   - 分类（香港/新加坡/英国/澳洲等）
   - 内容
   - 发布时间

### 3. 确保后端服务启动

```bash
cd huananliu-web/backend
npm run dev

# 服务运行在 http://localhost:3001
```

## 功能特性

### 已实现
- ✅ 从后台 API 加载新闻列表
- ✅ 自动加载分类标签
- ✅ 分类筛选功能
- ✅ 下拉刷新
- ✅ 上拉加载更多
- ✅ 智能时间显示（刚刚/X分钟前/X小时前/X天前）
- ✅ 空状态提示
- ✅ 加载状态提示

### 数据字段映射

| 后台字段 | 小程序字段 | 说明 |
|----------|-----------|------|
| `id` | `id` | 新闻ID |
| `title` | `title` | 标题 |
| `summary` | `summary` | 摘要（后台填写）或内容截取 |
| `cover_image` | `coverImage` | 封面图URL |
| `category` | `category` | 分类 |
| `view_count` | `views` | 浏览量 |
| `published_at` | `time` | 发布时间（格式化后） |

## 测试步骤

1. 启动后端服务：`cd huananliu-web/backend && npm run dev`
2. 启动后台管理：`cd huananliu-web/frontend/admin && npm run dev`
3. 在后台添加几条测试新闻
4. 打开小程序，进入"留学资讯"页面
5. 测试分类切换、下拉刷新、上拉加载

## 常见问题

### Q: 新闻列表显示为空？
A: 检查：
1. 后端服务是否启动
2. 后台是否已添加新闻数据
3. 网络请求是否正常（开发者工具 Network 面板）

### Q: 分类标签不显示？
A: 检查 `/api/news/options/categories` 接口是否正常返回

### Q: 图片无法显示？
A: 确保 `cover_image` 使用 HTTPS 地址，或开启开发者工具"不校验合法域名"
