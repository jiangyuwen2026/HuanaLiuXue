# 回滚状态说明

## 操作说明
已于 2026-03-26 放弃V2.0设计，恢复为原来的小程序方案。

## 恢复内容

### ✅ 已恢复
- [x] app.json - 恢复为4个Tab（首页/资讯/咨询/我的）
- [x] pages/index/index.js - 恢复为静态数据版本
- [x] pages/index/index.wxml - 恢复为原模板
- [x] pages/school/school.js - 恢复为使用 dataManager
- [x] pages/case/case.js - 恢复为静态数据版本
- [x] pages/news/news.js - 恢复为原版本
- [x] utils/dataManager.js - 已重新创建
- [x] app.js - 移除 config.js 依赖

### ❌ 已删除（V2.0文件）
- [x] pages/school/list/ - V2.0列表页
- [x] pages/case/list/ - V2.0列表页
- [x] pages/consultant/list/ - V2.0列表页
- [x] pages/service/ - V2.0服务页
- [x] pages/user/favorites.* - V2.0收藏页
- [x] pages/user/history.* - V2.0历史页
- [x] utils/api-v2.js - V2.0 API封装
- [x] config.js - V2.0配置文件

## 当前状态

### 页面结构
```
pages/
├── index/              # 首页（静态数据）
├── news/               # 资讯
├── school/             # 学校（使用dataManager）
├── major/              # 专业
├── guide/              # 指导
├── consultant/         # 顾问
├── appointment/        # 预约
├── case/               # 案例
├── user/               # 用户中心
└── customer-service/   # 客服
```

### TabBar（4个）
1. 首页
2. 资讯
3. 咨询
4. 我的

## 注意事项
1. 如需重新启用V2.0，请参考 backup/ 目录或 git 历史
2. V2.0文档（TESTING_GUIDE.md 等）仍保留在根目录供参考
3. miniprogram/ 目录是V2.0版本，如需使用可单独导入
