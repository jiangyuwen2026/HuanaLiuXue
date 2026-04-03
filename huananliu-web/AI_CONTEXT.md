# 华南留学平台 - AI上下文文档
# South China Study Abroad Platform - AI Context Document

> **版本**: v1.0.0-FINAL  
> **状态**: FROZEN (已冻结)  
> **用途**: 为AI助手提供项目上下文和编码指南

---

## AI快速入门 (AI Quick Start)

如果你是AI助手，请先确认以下信息：

```yaml
项目: 华南留学平台 (huananliu-web)
版本: 1.0.0-FINAL
状态: 已冻结 - 谨慎修改
类型: 全栈留学服务平台
技术栈:
  前端: React 18 + Vite + TailwindCSS/Ant Design
  后端: Node.js + Express + Sequelize + MySQL
文档索引:
  - VERSION: 版本状态
  - PRODUCT_MANUAL.md: 产品功能规格
  - DESIGN_MANUAL.md: 技术架构设计
  - AI_CONTEXT.md: 本文件 - AI编码指南
```

---

## 1. 代码模式 (Code Patterns)

### 1.1 API请求模式

**文件**: `frontend/website/src/utils/api.js`

```javascript
// 标准API调用模式
const response = await axios.get(`${API_BASE}/endpoint`);
return response.data;

// 返回格式统一为
{
  success: boolean,
  message: string,
  data: any,
  total?: number
}
```

### 1.2 React组件模式

**函数组件 + Hooks**:
```javascript
import { useState, useEffect } from 'react';

function ComponentName() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiFunction();
      if (res.success) setData(res.data);
    } finally {
      setLoading(false);
    }
  };
  
  return (/* JSX */);
}
```

### 1.3 后端路由模式

**文件**: `backend/routes/*.js`

```javascript
const express = require('express');
const router = express.Router();
const { Model } = require('../models');

// 公共API
router.get('/', async (req, res) => {
  try {
    const data = await Model.findAll();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
```

### 1.4 Sequelize模型模式

**文件**: `backend/models/*.js`

```javascript
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('ModelName', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    // 字段定义
    status: { type: DataTypes.TINYINT, defaultValue: 1 },
  }, {
    tableName: 'table_name',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  Model.associate = (models) => {
    // 关联定义
  };
  
  return Model;
};
```

---

## 2. 关键文件位置 (Key File Locations)

### 2.1 配置文件

| 文件 | 说明 |
|------|------|
| `backend/config.js` | 后端主配置 (DB, JWT, Server) |
| `backend/models/index.js` | 数据库连接和模型导入 |
| `frontend/website/vite.config.js` | 官网构建配置 |
| `frontend/admin/vite.config.js` | 后台构建配置 |

### 2.2 核心组件

| 文件 | 说明 |
|------|------|
| `frontend/website/src/components/Header.jsx` | 官网导航头 |
| `frontend/website/src/components/Footer.jsx` | 官网页脚 |
| `frontend/admin/src/components/Layout.jsx` | 后台布局框架 |

### 2.3 工具函数

| 文件 | 说明 |
|------|------|
| `frontend/website/src/utils/api.js` | 官网API封装 |
| `frontend/admin/src/utils/api.js` | 后台API封装 |
| `frontend/admin/src/utils/request.js` | Axios拦截器配置 |

### 2.4 页面文件

**官网页面**: `frontend/website/src/pages/`
- `Home.jsx` - 首页 (含明星案例、评价轮播)
- `Schools.jsx` - 学校列表
- `SchoolDetail.jsx` - 学校详情
- `Cases.jsx` - 案例列表
- `News.jsx` - 新闻列表

**后台页面**: `frontend/admin/src/pages/`
- `Dashboard.jsx` - 仪表盘
- `Cases.jsx` - 案例管理 (含明星案例设置)
- `News.jsx` - 新闻管理 (含推荐设置)

---

## 3. 命名规范 (Naming Conventions)

### 3.1 数据库
- 表名: 小写下划线 (schools, cases, testimonials)
- 字段: 小写下划线 (name_en, is_featured, feature_sort)
- 外键: xxx_id (school_id, consultant_id)

### 3.2 JavaScript
- 变量/函数: 小写驼峰 (getSchoolList, isLoading)
- 组件: 大写驼峰 (SchoolCard, FeaturedCases)
- 常量: 大写下划线 (API_BASE, MAX_ITEMS)
- 布尔值: is_xxx 前缀 (is_featured, is_recommended)

### 3.3 文件
- 组件: 大写开头 (Header.jsx, SchoolDetail.jsx)
- 工具: 小写 (api.js, helpers.js)
- 样式: 与组件同名 (Header.css)

---

## 4. 常见任务代码模板 (Code Templates)

### 4.1 新增API端点

```javascript
// backend/routes/resource.js
router.get('/path', async (req, res) => {
  try {
    const data = await Model.findAll({
      where: { status: 1 },
      order: [['sort_order', 'ASC']]
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### 4.2 新增React组件

```javascript
// frontend/website/src/components/ComponentName.jsx
import { useState, useEffect } from 'react';
import { apiFunction } from '../utils/api';

function ComponentName() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await apiFunction();
      if (res.success) setData(res.data);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="">
      {/* JSX */}
    </div>
  );
}

export default ComponentName;
```

### 4.3 新增Sequelize模型

```javascript
// backend/models/ModelName.js
module.exports = (sequelize, DataTypes) => {
  const ModelName = sequelize.define('ModelName', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    status: { type: DataTypes.TINYINT, defaultValue: 1 },
  }, {
    tableName: 'model_names',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return ModelName;
};
```

---

## 5. 修改检查清单 (Modification Checklist)

在处理此项目时，请遵循以下检查清单：

### 5.1 修改前
- [ ] 阅读 VERSION 文件确认版本状态
- [ ] 查阅 PRODUCT_MANUAL.md 理解功能规格
- [ ] 查阅 DESIGN_MANUAL.md 理解技术实现
- [ ] 识别受影响的文件和依赖

### 5.2 修改中
- [ ] 保持原有代码风格
- [ ] 添加充分的注释说明修改原因
- [ ] 不要破坏向后兼容性
- [ ] 添加错误处理

### 5.3 修改后
- [ ] 更新相关文档
- [ ] 在 AI_CONTEXT.md 的变更日志中记录
- [ ] 验证功能正常
- [ ] 检查是否有遗漏的引用

---

## 6. 变更日志 (Change Log)

### v1.0.0-FINAL (2026-03-25)
- 版本冻结
- 功能完成：学校展示、案例展示(含明星案例)、顾问展示、新闻(含推荐)、服务、评价轮播、后台管理
- 文档完成：PRODUCT_MANUAL.md, DESIGN_MANUAL.md, AI_CONTEXT.md, VERSION

---

## 7. AI处理提示 (AI Processing Hints)

### 7.1 当你看到以下情况时：

| 情况 | 处理方式 |
|------|----------|
| 用户要求新功能 | 参考扩展指南，在不破坏现有功能前提下添加 |
| 用户报告Bug | 定位问题，最小化修改修复 |
| 用户要求重构 | 谨慎评估，冻结版本优先保持稳定性 |
| 用户询问功能 | 参考 PRODUCT_MANUAL.md 回答 |
| 用户询问技术 | 参考 DESIGN_MANUAL.md 回答 |

### 7.2 需要特别注意的代码区域：

1. **版本标记区域** - 不要删除或修改版本注释
2. **API返回格式** - 保持 `{success, message, data}` 格式
3. **数据库模型** - 修改字段可能影响多处
4. **前端路由** - 修改可能影响导航和链接

### 7.3 常用文件路径速查：

```
后端入口: backend/index.js
后端配置: backend/config.js
模型目录: backend/models/
路由目录: backend/routes/

官网入口: frontend/website/src/main.jsx
官网API:  frontend/website/src/utils/api.js
官网页面: frontend/website/src/pages/

后台入口: frontend/admin/src/main.jsx
后台API:  frontend/admin/src/utils/api.js
后台页面: frontend/admin/src/pages/
```

---

## 8. 文档索引 (Document Index)

```
huananliu-web/
├── VERSION                    [版本状态 - 最先阅读]
├── PRODUCT_MANUAL.md          [产品功能 - 用户视角]
├── DESIGN_MANUAL.md           [技术设计 - 开发视角]
└── AI_CONTEXT.md              [本文件 - AI视角]
```

**AI助手阅读顺序**: VERSION -> AI_CONTEXT.md -> (PRODUCT_MANUAL.md / DESIGN_MANUAL.md 根据问题类型)

---

*本文档由AI助手在版本冻结时生成，用于辅助后续的AI理解和代码处理。*
