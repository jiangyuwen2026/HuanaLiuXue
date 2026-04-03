# 小程序V2.0测试文档索引

## 📚 测试文档清单

| 文档 | 说明 | 用途 |
|------|------|------|
| **TESTING_GUIDE.md** | 完整测试方案 | 详细的测试步骤和说明 |
| **QUICK_TEST_CHECKLIST.md** | 快速测试清单 | 可打印的对照清单 |
| **huananliu-web/backend/scripts/seed-miniprogram-data.js** | 测试数据脚本 | 一键生成测试数据 |

---

## 🚀 快速开始测试

### 第一步：启动服务

```bash
# 1. 启动后端API服务
cd huananliu-web/backend
npm run dev

# 2. 启动后台管理（新开终端）
cd huananliu-web/frontend/admin
npm run dev
```

### 第二步：初始化测试数据（推荐）

```bash
# 新开终端，运行测试数据脚本
cd huananliu-web/backend
node scripts/seed-miniprogram-data.js
```

> 或者手动在后台配置：访问 http://localhost:3002

### 第三步：打开微信开发者工具

1. 导入项目：`/Users/jiangyuwen/WorkBuddy/20260310085315`
2. 勾选「不校验合法域名」
3. 开始测试

---

## 📋 测试检查要点

### 核心功能（必测）
- [ ] 首页轮播图正常显示
- [ ] 明星案例卡片显示
- [ ] 热门学校横向滚动
- [ ] 推荐资讯列表
- [ ] 学校列表分页加载
- [ ] 案例列表筛选
- [ ] 资讯列表分类
- [ ] 预约提交成功
- [ ] 我的预约显示

### API检查（必测）
在开发者工具Network面板检查：
- [ ] `/api/banners` 返回200
- [ ] `/api/schools/hot/list` 返回200
- [ ] `/api/cases/featured/list` 返回200
- [ ] `/api/news/recommended/list` 返回200

---

## 🔧 常见问题

### 图片无法显示？
- 检查「不校验合法域名」是否勾选
- 检查图片URL是否为HTTPS

### API请求404？
- 检查后端服务是否启动
- 检查端口3001是否被占用

### 数据不更新？
- 下拉刷新页面
- 检查后台是否配置了数据

---

## 📊 测试结果记录

使用 **QUICK_TEST_CHECKLIST.md** 记录测试结果：

1. 打印或打开清单
2. 逐项测试并勾选
3. 记录发现的问题
4. 签字确认

---

## 📞 需要帮助？

查看详细文档：
- 完整测试方案 → `TESTING_GUIDE.md`
- 测试清单 → `QUICK_TEST_CHECKLIST.md`
