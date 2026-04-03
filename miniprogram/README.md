# 华南留学小程序

## 项目结构

```
miniprogram/
├── app.js                 # 小程序入口
├── app.json               # 全局配置
├── app.wxss               # 全局样式
├── config.js              # API配置
├── sitemap.json           # 站点地图
├── project.config.json    # 项目配置
├── pages/                 # 页面目录
│   ├── index/             # 首页
│   ├── school/            # 学校模块
│   ├── case/              # 案例模块
│   ├── consultant/        # 顾问模块
│   ├── news/              # 资讯模块
│   ├── appointment/       # 预约模块
│   ├── user/              # 用户中心
│   └── ...
├── utils/                 # 工具函数
│   ├── api.js             # API封装
│   └── util.js            # 通用工具
├── images/                # 图片资源
└── components/            # 公共组件
```

## 开发说明

1. 使用微信开发者工具导入此目录
2. 确保后端服务已启动 (http://localhost:3001)
3. 参考根目录的 TESTING_GUIDE.md 进行测试

## 版本

- v2.0 - API驱动版本
