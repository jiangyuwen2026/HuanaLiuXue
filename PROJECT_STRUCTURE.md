# 华南留学项目 - 完整结构文档

## 📁 项目概述

| 项目 | 内容 |
|------|------|
| 项目名称 | 华南留学 (Huanan Liu - South China Study Abroad) |
| 版本 | v2.1.0 |
| 状态 | 开发完成，待部署 |
| 最后更新 | 2026-03-27 |

---

## 🏗️ 项目架构

```
/Users/jiangyuwen/WorkBuddy/20260310085315/
├── 📱 miniprogram/                    # 微信小程序前端
├── 🌐 huananliu-web/                  # 官网Web系统
│   ├── backend/                       # Node.js后端API
│   └── frontend/
│       ├── admin/                     # React管理后台
│       └── website/                   # Vue官网前端
├── 📄 pages/                          # 小程序页面备份
├── 🖼️ images/                         # 图片资源
├── 📦 data/                           # 数据文件
├── 📝 文档目录                        # 各类说明文档
└── 🔧 配置文件                        # 项目配置
```

---

## 📱 一、小程序 (miniprogram/)

### 1.1 目录结构
```
miniprogram/
├── app.js                      # 小程序入口 (v2.0.0-FINAL)
├── app.json                    # 全局配置
├── app.wxss                    # 全局样式
├── config.js                   # 环境配置 (v2.0.0-FINAL)
├── sitemap.json                # 站点地图
├── README.md                   # 小程序说明文档
│
├── components/                 # 公共组件
│   └── (业务组件)
│
├── images/                     # 图片资源
│   ├── bg/                     # 背景图
│   ├── icon/                   # 图标
│   ├── images/                 # 其他图片
│   └── tab/                    # Tab栏图标
│
├── pages/                      # 页面目录
│   ├── index/                  # 首页 - 留学资讯
│   ├── service/                # 服务页 - 四分类
│   ├── cases/                  # 案例页
│   ├── schools/                # 学校页
│   ├── news/                   # 资讯页
│   ├── user/                   # 用户中心
│   │   └── favorites/          # 我的收藏
│   ├── appointment/            # 预约相关
│   └── about/                  # 关于我们
│
└── utils/                      # 工具函数
    ├── api.js                  # API封装
    └── util.js                 # 通用工具
```

### 1.2 功能模块
| 模块 | 功能 |
|------|------|
| 首页 | 轮播图、头条资讯、明星案例、热门院校 |
| 服务 | 留学申请、英语培训、竞赛规划、科研提升 |
| 案例 | 成功案例列表、详情、收藏、分享 |
| 我的 | 微信登录、手机号绑定、我的预约、我的收藏 |

### 1.3 技术规格
- **框架**: 微信小程序原生框架
- **基础库**: 2.30.0+
- **样式**: WXSS (类似CSS)
- **数据**: 对接后端API

---

## 🌐 二、官网后端 (huananliu-web/backend/)

### 2.1 目录结构
```
backend/
├── index.js                    # 服务入口 (v2.1.0-DEVELOPING)
├── config/                     # 配置文件
│   └── index.js
├── package.json                # 依赖管理
│
├── models/                     # 数据模型
│   ├── index.js                # 模型导出
│   ├── User.js                 # 小程序用户
│   ├── Admin.js                # 管理员
│   ├── School.js               # 学校
│   ├── Case.js                 # 案例
│   ├── News.js                 # 资讯
│   ├── Consultant.js           # 顾问
│   ├── Appointment.js          # 预约
│   └── ...
│
├── routes/                     # API路由
│   ├── auth.js                 # 认证
│   ├── admin-users.js          # 后台用户管理 (v2.1.0)
│   ├── customers.js            # 客户管理 (v2.1.0)
│   ├── schools.js              # 学校
│   ├── cases.js                # 案例
│   ├── news.js                 # 资讯
│   └── ...
│
├── middleware/                 # 中间件
│   └── auth.js                 # 认证中间件
│
└── uploads/                    # 上传文件目录
```

### 2.2 API 列表

#### 认证相关
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/wx-login | 微信登录 |
| POST | /api/auth/decrypt-phone | 解密手机号 |

#### 后台管理
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/admin/users | 管理员列表 |
| POST | /api/admin/users | 创建管理员 |
| PUT | /api/admin/users/:id | 更新管理员 |
| DELETE | /api/admin/users/:id | 删除管理员 |
| GET | /api/admin/customers | 客户列表 |
| GET | /api/admin/customers/:id | 客户详情 |

#### 业务数据
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/schools | 学校列表 |
| GET | /api/cases | 案例列表 |
| GET | /api/news | 资讯列表 |
| POST | /api/appointments | 创建预约 |

### 2.3 技术规格
- **框架**: Express.js 4.x
- **数据库**: MySQL 8.0
- **ORM**: Sequelize 6.x
- **认证**: JWT

---

## 🖥️ 三、管理后台 (huananliu-web/frontend/admin/)

### 3.1 目录结构
```
admin/
├── main.jsx                    # 入口文件
├── App.jsx                     # 路由配置
├── index.css                   # 全局样式
├── package.json                # 依赖管理
│
├── components/                 # 公共组件
│   └── Layout.jsx              # 布局组件
│
├── pages/                      # 页面
│   ├── Login.jsx               # 登录页
│   ├── Dashboard.jsx           # 仪表盘
│   ├── AdminUsers.jsx          # 后台用户管理 (v2.1.0)
│   ├── Customers.jsx           # 客户管理 (v2.1.0)
│   ├── Schools.jsx             # 学校管理
│   ├── Cases.jsx               # 案例管理
│   ├── News.jsx                # 新闻管理
│   ├── Appointments.jsx        # 预约管理
│   ├── Services.jsx            # 服务管理
│   ├── Banners.jsx             # 轮播图管理
│   ├── Config.jsx              # 网站配置
│   └── ...
│
├── utils/                      # 工具
│   └── api.js                  # API封装
│
└── dist/                       # 构建输出
```

### 3.2 功能模块
| 模块 | 功能 |
|------|------|
| 后台用户管理 | 管理员CRUD、角色权限、密码重置 |
| 客户管理 | 用户列表、详情查看、数据统计、导出 |
| 学校管理 | 学校CRUD、专业管理 |
| 案例管理 | 案例CRUD、明星案例设置 |
| 预约管理 | 预约列表、状态管理 |

### 3.3 技术规格
- **框架**: React 18 + Vite
- **UI库**: Ant Design 5.x
- **路由**: React Router 6
- **HTTP**: Axios

---

## 📄 四、文档分类

### 4.1 产品文档
| 文档 | 说明 |
|------|------|
| `产品说明书.md` | 产品功能、用户流程、技术规格 |
| `程序设计说明书.md` | 系统架构、数据库设计、API文档 |
| `PROJECT_SUMMARY.md` | 项目整体概述 |
| `VERSION.md` | 版本管理、变更历史 |

### 4.2 部署文档
| 文档 | 说明 |
|------|------|
| `DEPLOYMENT.md` | 部署指南 |
| `API_CONFIG_GUIDE.md` | API配置说明 |
| `CONFIG_README.md` | 配置说明 |

### 4.3 开发文档
| 文档 | 说明 |
|------|------|
| `DESIGN_SUMMARY.md` | 设计规范 |
| `DESIGN_SYSTEM.md` | 设计系统 |
| `DEBUG_GUIDE.md` | 调试指南 |
| `TEST_GUIDE.md` | 测试指南 |

### 4.4 小程序文档
| 文档 | 说明 |
|------|------|
| `MINIPROGRAM_DESIGN.md` | 小程序设计 |
| `MINIPROGRAM_MIGRATION_GUIDE.md` | 迁移指南 |
| `小程序/README.md` | 小程序说明 |

### 4.5 功能文档
| 文档 | 说明 |
|------|------|
| `SERVICE_GUIDE.md` | 服务功能 |
| `LISTING_GUIDE.md` | 列表功能 |
| `NEWS_LISTING_GUIDE.md` | 资讯功能 |
| `ICON_GUIDE.md` | 图标规范 |

---

## 📦 五、配置文件

### 5.1 小程序配置
| 文件 | 说明 |
|------|------|
| `miniprogram/app.json` | 小程序全局配置 |
| `miniprogram/config.js` | 环境配置 |
| `miniprogram/project.config.json` | 项目配置 |

### 5.2 后端配置
| 文件 | 说明 |
|------|------|
| `backend/config/index.js` | 数据库、端口等配置 |
| `backend/package.json` | Node依赖 |

### 5.3 前端配置
| 文件 | 说明 |
|------|------|
| `frontend/admin/package.json` | React依赖 |
| `frontend/website/package.json` | Vue依赖 |

---

## 🗂️ 六、数据文件

| 文件 | 说明 |
|------|------|
| `data/*.json` | 示例数据 |
| `data/NEWS_STATISTICS.md` | 资讯统计 |
| `data/STATISTICS_REPORT.md` | 数据报告 |

---

## 🖼️ 七、资源文件

| 目录 | 内容 |
|------|------|
| `images/` | 根目录图片资源 |
| `miniprogram/images/` | 小程序图片资源 |
| `backend/uploads/` | 后端上传目录 |

---

## 📝 八、版本信息

### 当前版本: v2.1.0

#### 小程序: v2.0.0-FINAL (已冻结)
- 发布日期: 2026-03-27
- 状态: 已冻结

#### 后端: v2.1.0-DEVELOPING
- 发布日期: 2026-03-27
- 状态: 开发完成，待测试
- 新增: 用户管理、客户管理

#### 管理后台: v2.1.0
- 发布日期: 2026-03-27
- 状态: 开发完成
- 新增: AdminUsers、Customers页面

---

## 🚀 九、部署清单

### 9.1 后端部署
- [x] 代码文件
- [x] package.json
- [x] 数据库模型
- [x] API路由
- [ ] 环境变量配置
- [ ] 数据库迁移
- [ ] PM2配置

### 9.2 前端部署
- [x] 管理后台构建文件 (dist/)
- [ ] Nginx配置
- [ ] 域名配置
- [ ] SSL证书

### 9.3 小程序部署
- [x] 代码文件
- [ ] 微信开发者工具上传
- [ ] 版本提交审核

---

## 📞 十、联系方式

| 项目 | 内容 |
|------|------|
| 客服电话 | 400-888-8888 |
| 服务时间 | 周一至周日 9:00-21:00 |

---

**文档版本**: v2.1.0  
**最后更新**: 2026-03-27  
**维护者**: 开发团队
