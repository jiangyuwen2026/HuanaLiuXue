# 华南留学 - 视觉设计应用指南

## 🎨 一键更新说明

本指南提供将设计方案应用到小程序的具体操作步骤和代码示例。

---

## 📦 第一步：更新全局样式 (app.wxss)

### 完整的新样式代码

```css
/* ==================== 设计变量 ==================== */
:root {
  /* 主色调 */
  --color-primary: #2C5F7C;
  --color-primary-light: #3A7CA5;
  --color-primary-lighter: #4A9FD4;

  /* 功能色 */
  --color-success: #52C41A;
  --color-warning: #FAAD14;
  --color-danger: #FF4D4F;
  --color-neutral: #8C8C8C;

  /* 文字颜色 */
  --color-text-primary: #333333;
  --color-text-secondary: #666666;
  --color-text-tertiary: #999999;
  --color-text-quaternary: #CCCCCC;

  /* 背景色 */
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F5F5F5;
  --color-bg-tertiary: #FAFAFA;

  /* 边框色 */
  --color-border: #E8E8E8;
  --color-border-light: #F0F0F0;

  /* 阴影 */
  --shadow-sm: 0 2rpx 8rpx rgba(44, 95, 124, 0.06);
  --shadow-md: 0 4rpx 16rpx rgba(44, 95, 124, 0.1);
  --shadow-lg: 0 8rpx 32rpx rgba(44, 95, 124, 0.15);
  --shadow-hover: 0 12rpx 40rpx rgba(44, 95, 124, 0.2);

  /* 圆角 */
  --radius-sm: 4rpx;
  --radius-md: 8rpx;
  --radius-lg: 12rpx;
  --radius-xl: 16rpx;

  /* 间距 */
  --spacing-xs: 8rpx;
  --spacing-sm: 16rpx;
  --spacing-md: 24rpx;
  --spacing-lg: 32rpx;
  --spacing-xl: 48rpx;
  --spacing-xxl: 64rpx;
}

/* ==================== 全局基础样式 ==================== */
page {
  background-color: var(--color-bg-secondary);
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB',
               'Microsoft YaHei', 'Helvetica Neue', sans-serif;
  color: var(--color-text-primary);
  font-size: 26rpx;
  line-height: 1.6;
}

/* ==================== 布局容器 ==================== */
.container {
  padding: var(--spacing-md);
  min-height: 100vh;
  box-sizing: border-box;
}

.container-full {
  padding: 0;
  min-height: 100vh;
  box-sizing: border-box;
}

/* ==================== 卡片系统 ==================== */
.card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.card:active {
  transform: translateY(2rpx);
  box-shadow: var(--shadow-sm);
}

.card-large {
  padding: var(--spacing-lg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.card-highlight {
  background: linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%);
  border: 1rpx solid rgba(44, 95, 124, 0.08);
}

/* ==================== 按钮系统 ==================== */
.btn {
  background: var(--color-primary);
  color: #FFFFFF;
  border-radius: var(--radius-md);
  padding: 20rpx 32rpx;
  text-align: center;
  font-size: 28rpx;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-sizing: border-box;
}

.btn:active {
  opacity: 0.8;
  transform: scale(0.98);
}

.btn-large {
  padding: 24rpx 48rpx;
  font-size: 32rpx;
  border-radius: var(--radius-lg);
}

.btn-small {
  padding: 12rpx 24rpx;
  font-size: 24rpx;
  border-radius: var(--radius-sm);
}

.btn-secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.btn-ghost {
  background: transparent;
  color: var(--color-primary);
  padding: 16rpx 24rpx;
}

.btn-danger {
  background: var(--color-danger);
}

/* ==================== 标签系统 ==================== */
.tag {
  display: inline-flex;
  align-items: center;
  padding: 6rpx 16rpx;
  border-radius: var(--radius-sm);
  font-size: 22rpx;
  margin-right: var(--spacing-sm);
  border: 1rpx solid transparent;
  white-space: nowrap;
}

.tag-primary {
  background: rgba(44, 95, 124, 0.08);
  color: var(--color-primary);
  border-color: rgba(44, 95, 124, 0.16);
}

.tag-success {
  background: rgba(82, 196, 26, 0.08);
  color: var(--color-success);
  border-color: rgba(82, 196, 26, 0.16);
}

.tag-warning {
  background: rgba(250, 173, 20, 0.08);
  color: var(--color-warning);
  border-color: rgba(250, 173, 20, 0.16);
}

.tag-danger {
  background: rgba(255, 77, 79, 0.08);
  color: var(--color-danger);
  border-color: rgba(255, 77, 79, 0.16);
}

.tag-neutral {
  background: rgba(140, 140, 140, 0.08);
  color: var(--color-neutral);
}

/* ==================== 文字系统 ==================== */
.text-h1 {
  font-size: 48rpx;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.3;
}

.text-h2 {
  font-size: 40rpx;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.4;
}

.text-h3 {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.5;
}

.text-title {
  font-size: 30rpx;
  font-weight: 500;
  color: var(--color-text-primary);
}

.text-body-large {
  font-size: 28rpx;
  color: var(--color-text-primary);
  line-height: 1.6;
}

.text-body {
  font-size: 26rpx;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.text-body-small {
  font-size: 24rpx;
  color: var(--color-text-tertiary);
  line-height: 1.5;
}

.text-caption {
  font-size: 20rpx;
  color: var(--color-text-tertiary);
  line-height: 1.4;
}

.text-primary {
  color: var(--color-primary);
}

.text-secondary {
  color: var(--color-text-secondary);
}

.text-tertiary {
  color: var(--color-text-tertiary);
}

.text-success {
  color: var(--color-success);
}

.text-warning {
  color: var(--color-warning);
}

.text-danger {
  color: var(--color-danger);
}

/* ==================== 区块标题 ==================== */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-sm);
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--color-text-primary);
  padding-left: 16rpx;
  border-left: 4rpx solid var(--color-primary);
  line-height: 1.2;
}

.more-link {
  font-size: 26rpx;
  color: var(--color-primary);
  display: flex;
  align-items: center;
}

/* ==================== 布局工具类 ==================== */
.flex {
  display: flex;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-around {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.flex-1 {
  flex: 1;
}

.flex-wrap {
  flex-wrap: wrap;
}

/* ==================== 图片系统 ==================== */
.image-cover {
  border-radius: var(--radius-lg);
  object-fit: cover;
}

.image-card {
  border-radius: var(--radius-md);
  object-fit: cover;
}

.image-avatar {
  border-radius: 50%;
  object-fit: cover;
}

/* ==================== 输入框系统 ==================== */
.input {
  background: var(--color-bg-primary);
  border: 1rpx solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 20rpx var(--spacing-md);
  font-size: 28rpx;
  color: var(--color-text-primary);
  transition: all 0.3s ease;
}

.input::placeholder {
  color: var(--color-text-quaternary);
}

.input:active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2rpx rgba(44, 95, 124, 0.08);
}

.input-group {
  margin-bottom: var(--spacing-md);
}

.input-label {
  font-size: 26rpx;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
  display: block;
}

/* ==================== 分割线 ==================== */
.divider {
  height: 1rpx;
  background: var(--color-border);
  margin: var(--spacing-md) 0;
}

.divider-dashed {
  height: 1rpx;
  background: repeating-linear-gradient(
    to right,
    var(--color-border) 0,
    var(--color-border) 8rpx,
    transparent 8rpx,
    transparent 16rpx
  );
  margin: var(--spacing-md) 0;
}

/* ==================== 空状态 ==================== */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  color: var(--color-text-tertiary);
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: var(--spacing-md);
  opacity: 0.4;
}

.empty-text {
  font-size: 26rpx;
  margin-bottom: var(--spacing-sm);
}

.empty-tip {
  font-size: 24rpx;
  color: var(--color-text-quaternary);
}

/* ==================== 加载状态 ==================== */
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) 0;
}

.loading-text {
  margin-left: var(--spacing-sm);
  color: var(--color-text-tertiary);
  font-size: 26rpx;
}

/* ==================== 间距工具类 ==================== */
.mt-xs { margin-top: var(--spacing-xs); }
.mt-sm { margin-top: var(--spacing-sm); }
.mt-md { margin-top: var(--spacing-md); }
.mt-lg { margin-top: var(--spacing-lg); }
.mt-xl { margin-top: var(--spacing-xl); }

.mb-xs { margin-bottom: var(--spacing-xs); }
.mb-sm { margin-bottom: var(--spacing-sm); }
.mb-md { margin-bottom: var(--spacing-md); }
.mb-lg { margin-bottom: var(--spacing-lg); }
.mb-xl { margin-bottom: var(--spacing-xl); }

.pt-xs { padding-top: var(--spacing-xs); }
.pt-sm { padding-top: var(--spacing-sm); }
.pt-md { padding-top: var(--spacing-md); }
.pt-lg { padding-top: var(--spacing-lg); }
.pt-xl { padding-top: var(--spacing-xl); }

.pb-xs { padding-bottom: var(--spacing-xs); }
.pb-sm { padding-bottom: var(--spacing-sm); }
.pb-md { padding-bottom: var(--spacing-md); }
.pb-lg { padding-bottom: var(--spacing-lg); }
.pb-xl { padding-bottom: var(--spacing-xl); }

/* ==================== 渐变背景 ==================== */
.gradient-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
}

.gradient-accent {
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary-lighter) 100%);
}

.gradient-card {
  background: linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%);
}
```

---

## 📱 第二步：更新导航栏和 TabBar (app.json)

```json
{
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#FFFFFF",
    "navigationBarTitleText": "华南留学",
    "navigationBarTextStyle": "#2C5F7C",
    "backgroundColor": "#F5F5F5",
    "navigationBarTitleColor": "#2C5F7C"
  },
  "tabBar": {
    "color": "#8C8C8C",
    "selectedColor": "#2C5F7C",
    "backgroundColor": "#FFFFFF",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页"
      },
      {
        "pagePath": "pages/news/news",
        "text": "资讯"
      },
      {
        "pagePath": "pages/appointment/appointment",
        "text": "咨询"
      },
      {
        "pagePath": "pages/user/user",
        "text": "我的"
      }
    ]
  }
}
```

---

## 🏠 第三步：更新首页样式 (pages/index/index.wxss)

```css
/* ==================== 轮播图 ==================== */
.banner {
  width: 100%;
  height: 380rpx;
  margin-bottom: var(--spacing-lg);
  border-radius: 0;
  overflow: hidden;
}

.banner swiper-item {
  border-radius: 0;
}

.banner-image {
  width: 100%;
  height: 100%;
  border-radius: 0;
}

/* ==================== 功能入口 ==================== */
.function-scroll {
  padding: var(--spacing-sm) var(--spacing-md);
  white-space: nowrap;
  background: var(--color-bg-primary);
  margin: 0 calc(var(--spacing-md) * -1) var(--spacing-lg);
}

.function-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 0 var(--spacing-sm);
  transition: transform 0.3s ease;
}

.function-item:active {
  transform: scale(0.95);
}

.function-icon {
  width: 104rpx;
  height: 104rpx;
  margin-bottom: var(--spacing-sm);
  background: linear-gradient(135deg, rgba(44, 95, 124, 0.08) 0%, rgba(58, 124, 165, 0.08) 100%);
  border-radius: var(--radius-lg);
  padding: 20rpx;
  box-sizing: border-box;
}

.function-name {
  font-size: 24rpx;
  color: var(--color-text-primary);
  font-weight: 500;
}

/* ==================== 区块样式 ==================== */
.section {
  margin-bottom: var(--spacing-xl);
}

.section-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  margin: 0 var(--spacing-md) var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

/* ==================== 资讯列表 ==================== */
.news-list {
  padding: 0 var(--spacing-md);
}

.news-item {
  display: flex;
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.news-item:active {
  transform: translateY(2rpx);
  box-shadow: var(--shadow-sm);
}

.news-image {
  width: 200rpx;
  height: 150rpx;
  border-radius: var(--radius-md);
  margin-right: var(--spacing-md);
  flex-shrink: 0;
}

.news-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-title {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.news-summary {
  font-size: 24rpx;
  color: var(--color-text-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: var(--spacing-xs);
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-sm);
}

.news-tag {
  font-size: 22rpx;
  color: var(--color-primary);
  background: rgba(44, 95, 124, 0.08);
  padding: 4rpx 12rpx;
  border-radius: var(--radius-sm);
  font-weight: 500;
}

.news-time {
  font-size: 22rpx;
  color: var(--color-text-quaternary);
}

/* ==================== 案例列表 ==================== */
.case-list {
  padding: 0 var(--spacing-md);
}

.case-item {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.case-student {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--color-text-primary);
}

.case-result {
  font-size: 26rpx;
  font-weight: 600;
}

.case-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.case-info-item {
  font-size: 24rpx;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
}

.case-info-item::before {
  content: '';
  width: 6rpx;
  height: 6rpx;
  background: var(--color-primary);
  border-radius: 50%;
  margin-right: var(--spacing-sm);
}

/* ==================== 顾问列表 ==================== */
.consultant-scroll {
  padding: var(--spacing-sm) var(--spacing-md);
  white-space: nowrap;
  background: var(--color-bg-primary);
  margin: 0 calc(var(--spacing-md) * -1);
}

.consultant-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 160rpx;
  margin-right: var(--spacing-lg);
  vertical-align: top;
  padding: var(--spacing-sm) 0;
  transition: transform 0.3s ease;
}

.consultant-item:active {
  transform: scale(0.95);
}

.consultant-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-bottom: var(--spacing-sm);
  border: 3rpx solid rgba(44, 95, 124, 0.1);
  box-sizing: border-box;
}

.consultant-name {
  font-size: 26rpx;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 4rpx;
}

.consultant-title {
  font-size: 22rpx;
  color: var(--color-text-tertiary);
}
```

---

## 📊 第四步：更新资讯页样式 (pages/news/news.wxss)

```css
/* ==================== 资讯分类 ==================== */
.category-scroll {
  background: var(--color-bg-primary);
  padding: var(--spacing-md);
  margin: 0 calc(var(--spacing-md) * -1) var(--spacing-lg);
  white-space: nowrap;
  box-shadow: 0 2rpx 12rpx rgba(44, 95, 124, 0.06);
}

.category-item {
  display: inline-flex;
  align-items: center;
  padding: 12rpx 28rpx;
  margin-right: var(--spacing-md);
  border-radius: 50rpx;
  font-size: 26rpx;
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
  transition: all 0.3s ease;
}

.category-item.active {
  background: var(--color-primary);
  color: #FFFFFF;
  font-weight: 500;
}

/* ==================== 资讯卡片 ==================== */
.news-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.news-card:active {
  transform: translateY(2rpx);
  box-shadow: var(--shadow-md);
}

.news-card-large {
  .news-card {
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
  }
}

.news-card-cover {
  width: 100%;
  height: 360rpx;
}

.news-card-content {
  padding: var(--spacing-md);
}

.news-card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.5;
}

.news-card-summary {
  font-size: 26rpx;
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.news-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.news-card-tags {
  display: flex;
  gap: var(--spacing-sm);
}

.news-card-actions {
  display: flex;
  gap: var(--spacing-lg);
}

.news-action {
  display: flex;
  align-items: center;
  color: var(--color-text-tertiary);
  font-size: 22rpx;
}

.news-action-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: var(--spacing-xs);
}
```

---

## 🎯 第五步：更新按钮和表单样式

### 按钮使用示例
```html
<!-- 主按钮 -->
<button class="btn">确认提交</button>

<!-- 大按钮 -->
<button class="btn btn-large">立即咨询</button>

<!-- 次要按钮 -->
<button class="btn btn-secondary">取消</button>

<!-- 幽灵按钮 -->
<button class="btn btn-ghost">了解更多</button>

<!-- 危险按钮 -->
<button class="btn btn-danger">删除</button>
```

### 标签使用示例
```html
<text class="tag tag-primary">香港</text>
<text class="tag tag-success">已录取</text>
<text class="tag tag-warning">待审核</text>
<text class="tag tag-danger">已拒绝</text>
```

---

## 📋 更新检查清单

### 必须更新的文件
- [ ] `app.wxss` - 全局样式（使用 VISUAL_GUIDE.md 中的完整代码）
- [ ] `app.json` - 导航栏和 TabBar 配置
- [ ] `pages/index/index.wxss` - 首页样式
- [ ] `pages/news/news.wxss` - 资讯页样式
- [ ] `pages/school/school.wxss` - 学校页样式
- [ ] `pages/major/major.wxss` - 专业页样式

### 可选更新的文件
- [ ] `pages/guide/guide.wxss` - 指南页样式
- [ ] `pages/appointment/appointment.wxss` - 预约页样式
- [ ] `pages/consultant/consultant.wxss` - 顾问页样式
- [ ] `pages/case/case.wxss` - 案例页样式
- [ ] `pages/user/user.wxss` - 个人中心样式

### 验证检查项
- [ ] 导航栏背景色为白色，标题色为 #2C5F7C
- [ ] TabBar 未选中色为 #8C8C8C，选中色为 #2C5F7C
- [ ] 主色调 #2C5F7C 应用到所有主要按钮和标签
- [ ] 卡片阴影使用新的阴影系统
- [ ] 文字颜色遵循四级颜色体系
- [ ] 圆角统一使用新的圆角系统
- [ ] 间距统一使用新的间距系统

---

## 🎨 配色速查表

| 用途 | 颜色代码 |
|------|----------|
| 主品牌色 | `#2C5F7C` |
| 辅助品牌色 | `#3A7CA5` |
| 成功色 | `#52C41A` |
| 警告色 | `#FAAD14` |
| 危险色 | `#FF4D4F` |
| 中性色 | `#8C8C8C` |
| 文字一级 | `#333333` |
| 文字二级 | `#666666` |
| 文字三级 | `#999999` |
| 文字四级 | `#CCCCCC` |

---

*本指南提供可直接复制使用的代码，按照步骤逐一更新即可完成视觉升级。*
