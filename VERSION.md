# 华南留学项目版本管理

## 版本历史

### v2.1.0 (部署准备完成) - 用户管理功能
**发布日期**: 2026-03-27
**状态**: **✅ 部署准备完成**
**分支**: feature/v2.1.0-user-management

#### 新增功能
- **后台用户管理**: 管理后台管理员账户，支持多账户登录
  - ✅ 管理员列表管理（分页、搜索）
  - ✅ 角色权限控制（超级管理员/普通管理员）
  - ✅ 账户启用/禁用
  - ✅ 密码重置
  - ✅ 新增/编辑/删除管理员
  - ✅ 统计数据展示
  
- **注册客户管理**: 管理官网和移动端注册用户
  - ✅ 客户列表管理（分页、筛选、搜索）
  - ✅ 用户详情查看（包含预约记录）
  - ✅ 启用/禁用账户
  - ✅ 数据统计（总用户数、新增趋势、性别分布等）
  - ✅ 数据导出（CSV格式）

#### 技术变更
- 新增后端 API 路由：`/api/admin/users` (后台用户管理)
- 新增后端 API 路由：`/api/admin/customers` (客户管理)
- 新增前端页面：`AdminUsers.jsx` (后台用户管理)
- 新增前端页面：`Customers.jsx` (注册客户管理)
- 更新 `App.jsx` 添加新路由
- 更新 `Layout.jsx` 添加用户管理菜单
- 更新后端 `index.js` 注册新路由

#### 文件清单
```
后端:
- huananliu-web/backend/routes/admin-users.js (新增)
- huananliu-web/backend/routes/customers.js (新增)
- huananliu-web/backend/index.js (修改 - 注册路由)
- huananliu-web/backend/ecosystem.config.js (新增 - PM2配置)

前端:
- huananliu-web/frontend/admin/src/pages/AdminUsers.jsx (新增)
- huananliu-web/frontend/admin/src/pages/Customers.jsx (新增)
- huananliu-web/frontend/admin/src/App.jsx (修改 - 添加路由)
- huananliu-web/frontend/admin/src/components/Layout.jsx (修改 - 添加菜单)

部署:
- deploy.sh (新增 - 部署脚本)
- DEPLOY_v2.1.0.md (新增 - 部署文档)
- PROJECT_STRUCTURE.md (新增 - 项目结构文档)
```

#### 部署清单
- [x] 后端代码准备完成
- [x] 前端构建完成
- [x] 部署脚本创建完成
- [x] 部署文档编写完成
- [x] 项目结构文档更新
- [ ] 生产环境部署
- [ ] 功能测试验证
- [ ] 正式上线

---

### v2.0.0-FINAL (已冻结)
**发布日期**: 2026-03-27
**状态**: **已冻结**
**标签**: v2.0.0-FINAL

#### 功能特性
- 四栏底部导航（首页/服务/案例/我的）
- 微信登录 + 手机号绑定
- 数据对接官网后端API
- 收藏系统、预约系统
- 关于我们页面

---

### v1.0.0 (已归档)
**发布日期**: 2026-03-10
**状态**: 已归档

#### 功能特性
- 基础框架搭建
- 静态页面实现

---

## 版本规范

### 版本号规则
采用语义化版本控制 (SemVer)：
- 主版本号：重大功能变更或架构调整
- 次版本号：新功能添加
- 修订号：问题修复

### 分支策略
```
main (生产分支)
  ↓
v2.0.0-FINAL (冻结标签)
  ↓
feature/v2.1.0-user-management (开发分支)
```

### 状态定义
- **开发中**: 正在开发，可修改
- **测试中**: 功能完成，正在测试
- **已冻结**: 版本锁定，禁止修改
- **已归档**: 历史版本，仅参考

## 变更流程

1. 从当前冻结版本创建 feature 分支
2. 在 feature 分支上开发新功能
3. 测试完成后合并到 main 分支
4. 打标签并冻结版本
5. 更新版本文档
