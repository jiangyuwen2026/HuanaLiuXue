# 华南留学 - 视觉设计速查表

## 🎨 主色调速查

| 颜色名称 | 色值 | 用途 | CSS 变量 |
|---------|------|------|----------|
| **主品牌色** | `#2C5F7C` | 按钮、标签、强调文字 | `--color-primary` |
| **辅助品牌色** | `#3A7CA5` | 渐变、次要强调 | `--color-primary-light` |
| **浅品牌色** | `#4A9FD4` | 渐变末尾 | `--color-primary-lighter` |
| **成功色** | `#52C41A` | 录取、成功状态 | `--color-success` |
| **警告色** | `#FAAD14` | 待办、提醒 | `--color-warning` |
| **危险色** | `#FF4D4F` | 拒绝、错误 | `--color-danger` |
| **中性色** | `#8C8C8C` | 禁用、普通文字 | `--color-neutral` |

---

## 📝 文字色速查

| 级别 | 色值 | 用途 | 类名 |
|------|------|------|------|
| 一级文字 | `#333333` | 标题、重要信息 | `.text-primary` 或直接用 `color` |
| 二级文字 | `#666666` | 正文内容 | `.text-secondary` |
| 三级文字 | `#999999` | 辅助说明 | `.text-tertiary` |
| 四级文字 | `#CCCCCC` | 占位符、禁用 | - |

---

## 📏 字号速查

| 类名 | 大小 | 用途 |
|------|------|------|
| `.text-h1` | 48rpx | 页面主标题 |
| `.text-h2` | 40rpx | 区块标题 |
| `.text-h3` | 32rpx | 卡片标题 |
| `.text-title` | 30rpx | 次级标题 |
| `.text-body-large` | 28rpx | 正文大号 |
| `.text-body` | 26rpx | 正文常规 |
| `.text-body-small` | 24rpx | 辅助文字 |
| `.text-caption` | 20rpx | 说明文字 |

---

## 📦 间距速查

| 类名 | 大小 | 用途 |
|------|------|------|
| `--spacing-xs` | 8rpx | 极小间距 |
| `--spacing-sm` | 16rpx | 小间距 |
| `--spacing-md` | 24rpx | 中间距（常用） |
| `--spacing-lg` | 32rpx | 大间距 |
| `--spacing-xl` | 48rpx | 超大间距 |
| `--spacing-xxl` | 64rpx | 区块间距 |

### 间距工具类
```css
/* 外边距 */
.mt-xs, .mt-sm, .mt-md, .mt-lg, .mt-xl
.mb-xs, .mb-sm, .mb-md, .mb-lg, .mb-xl

/* 内边距 */
.pt-xs, .pt-sm, .pt-md, .pt-lg, .pt-xl
.pb-xs, .pb-sm, .pb-md, .pb-lg, .pb-xl
```

---

## 🔲 圆角速查

| 类名 | 大小 | 用途 |
|------|------|------|
| `--radius-sm` | 4rpx | 标签、小按钮 |
| `--radius-md` | 8rpx | 按钮、输入框 |
| `--radius-lg` | 12rpx | 卡片（常用） |
| `--radius-xl` | 16rpx | 大卡片、对话框 |

---

## 🌫️ 阴影速查

| 类名 | 用途 |
|------|------|
| `--shadow-sm` | 普通卡片 |
| `--shadow-md` | 重要卡片 |
| `--shadow-lg` | 悬浮卡片 |
| `--shadow-hover` | 悬停效果 |

---

## 🔘 按钮速查

| 类名 | 效果 | 用途 |
|------|------|------|
| `.btn` | 蓝色实心 | 主要操作 |
| `.btn-large` | 大号蓝色 | 重要操作 |
| `.btn-small` | 小号蓝色 | 次要操作 |
| `.btn-secondary` | 灰色背景 | 次要操作 |
| `.btn-outline` | 蓝色边框 | 链接式 |
| `.btn-danger` | 红色背景 | 危险操作 |

### 按钮使用示例
```html
<!-- 主按钮 -->
<button class="btn">确认提交</button>

<!-- 大按钮 -->
<button class="btn btn-large">立即咨询</button>

<!-- 次要按钮 -->
<button class="btn btn-secondary">取消</button>

<!-- 幽灵按钮 -->
<button class="btn btn-outline">了解更多</button>
```

---

## 🏷️ 标签速查

| 类名 | 效果 | 用途 |
|------|------|------|
| `.tag` | 灰色 | 默认标签 |
| `.tag-primary` | 浅蓝背景 | 主要标签 |
| `.tag-success` | 浅绿背景 | 成功、录取 |
| `.tag-warning` | 浅黄背景 | 警告、待审 |
| `.tag-danger` | 浅红背景 | 危险、拒绝 |

### 标签使用示例
```html
<text class="tag tag-primary">香港</text>
<text class="tag tag-success">已录取</text>
<text class="tag tag-warning">待审核</text>
<text class="tag tag-danger">已拒绝</text>
```

---

## 🃏 卡片速查

| 类名 | 效果 | 用途 |
|------|------|------|
| `.card` | 白色背景 + 小阴影 | 普通卡片 |
| `.card-large` | 大圆角 + 中阴影 | 重点卡片 |
| `.card-highlight` | 渐变背景 + 边框 | 强调卡片 |

### 卡片使用示例
```html
<!-- 普通卡片 -->
<view class="card">
  <view class="text-h3">标题</view>
  <view class="text-body">内容</view>
</view>

<!-- 重点卡片 -->
<view class="card card-large">
  <view class="text-h2">大标题</view>
  <view class="text-body-large">内容</view>
</view>
```

---

## 📐 布局工具类速查

| 类名 | 效果 |
|------|------|
| `.flex` | Flex 布局 |
| `.flex-center` | 水平垂直居中 |
| `.flex-between` | 两端对齐 |
| `.flex-around` | 环绕对齐 |
| `.flex-column` | 纵向布局 |
| `.flex-1` | flex: 1 |
| `.flex-wrap` | 允许换行 |

### 布局示例
```html
<!-- 水平垂直居中 -->
<view class="flex-center">
  <text>居中文字</text>
</view>

<!-- 两端对齐 -->
<view class="flex-between">
  <text>左侧</text>
  <text>右侧</text>
</view>
```

---

## 🎯 常用组合示例

### 1. 区块标题 + 卡片列表
```html
<view class="section">
  <view class="section-header">
    <text class="section-title">区块标题</text>
    <text class="more-link">更多 ></text>
  </view>
  <view class="card">
    <text class="text-title">卡片标题</text>
    <text class="text-body mb-sm">卡片内容</text>
    <text class="tag tag-primary">标签</text>
  </view>
</view>
```

### 2. 表单样式
```html
<view class="input-group">
  <text class="input-label">输入框标题</text>
  <input class="input" placeholder="请输入内容" />
</view>
```

### 3. 按钮组合
```html
<view class="flex" style="gap: 16rpx;">
  <button class="btn flex-1">确认</button>
  <button class="btn btn-secondary flex-1">取消</button>
</view>
```

### 4. 分割线
```html
<view class="divider"></view>
<view class="divider-dashed"></view>
```

---

## 🔍 快速对照表

### 旧颜色 → 新颜色
| 旧色值 | 新色值 | 说明 |
|--------|--------|------|
| `#1890ff` | `#2C5F7C` | 主色调 |
| `#e6f7ff` | `rgba(44, 95, 124, 0.08)` | 浅蓝背景 |
| `#333` | `#333333` | 主要文字 |
| `#666` | `#666666` | 次要文字 |
| `#999` | `#999999` | 辅助文字 |
| `#ccc` | `#CCCCCC` | 占位文字 |

### 旧类名 → 新类名
| 旧类名 | 新类名 | 说明 |
|--------|--------|------|
| 无 | `.text-title` | 新增标题类 |
| 无 | `.text-body-small` | 新增小正文类 |
| 无 | `.text-caption` | 新增说明类 |
| `.btn-outline` | `.btn-outline` | 保留，样式更新 |
| 无 | `.card-large` | 新增大卡片类 |
| 无 | `.card-highlight` | 新增强调卡片类 |

---

## 📋 开发检查清单

### 新页面开发时
- [ ] 使用 CSS 变量定义颜色
- [ ] 使用统一的间距变量
- [ ] 使用正确的字号类名
- [ ] 使用合适的圆角
- [ ] 添加适当的阴影
- [ ] 实现交互动效

### 样式修改时
- [ ] 检查是否符合设计系统
- [ ] 确认颜色使用规范
- [ ] 验证间距一致性
- [ ] 测试交互动效
- [ ] 检查响应式适配

---

*本速查表提供最常用的设计元素，开发时可快速查阅使用。*
