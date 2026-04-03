# 华南留学 - 整体视觉设计方案

## 🎨 设计理念

### 核心定位
- **时尚大方**: 现代简约设计语言，国际留学机构的高端形象
- **专业度高**: 信赖感强的配色体系，清晰的视觉层次
- **用户友好**: 舒适的视觉体验，流畅的交互反馈

---

## 🌈 色彩系统

### 主色调 (Primary Colors)
| 色值 | 用途 | 说明 |
|------|------|------|
| `#2C5F7C` | 主品牌色 | 深海蓝 - 专业、信赖、稳重 |
| `#3A7CA5` | 辅助品牌色 | 科技蓝 - 现代、创新、活力 |
| `#F5F5F5` | 背景色 | 浅灰 - 干净、透气 |

### 功能色 (Functional Colors)
| 色值 | 用途 | 说明 |
|------|------|------|
| `#52C41A` | 成功/录取 | 积极向上，传递希望 |
| `#FAAD14` | 警告/待办 | 温和提醒，不会引起焦虑 |
| `#FF4D4F` | 错误/拒绝 | 清晰提示，易于识别 |
| `#8C8C8C` | 中性/辅助 | 不抢主色，视觉和谐 |

### 渐变色 (Gradients)
```css
/* 主品牌渐变 */
--gradient-primary: linear-gradient(135deg, #2C5F7C 0%, #3A7CA5 100%);

/* 强调渐变 */
--gradient-accent: linear-gradient(135deg, #3A7CA5 0%, #4A9FD4 100%);

/* 卡片渐变 */
--gradient-card: linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%);
```

---

## 📐 排版系统

### 字体大小 (Typography Scale)
| 级别 | 大小 | 用途 | 行高 |
|------|------|------|------|
| H1 | 48rpx | 页面主标题 | 1.3 |
| H2 | 40rpx | 区块标题 | 1.4 |
| H3 | 32rpx | 卡片标题 | 1.5 |
| Body-L | 28rpx | 正文大号 | 1.6 |
| Body-M | 26rpx | 正文常规 | 1.6 |
| Body-S | 24rpx | 辅助文字 | 1.5 |
| Caption | 20rpx | 说明文字 | 1.4 |

### 字重 (Font Weight)
| 级别 | 数值 | 用途 |
|------|------|------|
| Regular | 400 | 正文 |
| Medium | 500 | 次级标题 |
| Semibold | 600 | 重点强调 |
| Bold | 700 | 主标题 |

### 字体族
```css
font-family: -apple-system, 
             BlinkMacSystemFont, 
             'PingFang SC', 
             'Hiragino Sans GB', 
             'Microsoft YaHei', 
             'Helvetica Neue', 
             sans-serif;
```

---

## 📦 间距系统

### 基础间距单位: 8rpx
| 标记 | 数值 | 用途 |
|------|------|------|
| xs | 8rpx | 极小间距 |
| sm | 16rpx | 小间距 |
| md | 24rpx | 中间距 |
| lg | 32rpx | 大间距 |
| xl | 48rpx | 超大间距 |
| xxl | 64rpx | 区块间距 |

### 间距应用
- **页面边距**: 24rpx
- **卡片内边距**: 24rpx
- **卡片间距**: 20rpx
- **区块间距**: 48rpx
- **元素间距**: 16rpx

---

## 🔲 圆角系统

| 级别 | 数值 | 用途 |
|------|------|------|
| sm | 4rpx | 标签、小按钮 |
| md | 8rpx | 按钮、输入框 |
| lg | 12rpx | 卡片、卡片内的图片 |
| xl | 16rpx | 大卡片、对话框 |
| circle | 50% | 头像、圆形按钮 |

---

## 🌫️ 阴影系统

### 卡片阴影
```css
/* 浅层阴影 - 普通卡片 */
--shadow-sm: 0 2rpx 8rpx rgba(44, 95, 124, 0.06);

/* 中层阴影 - 重要卡片 */
--shadow-md: 0 4rpx 16rpx rgba(44, 95, 124, 0.1);

/* 深层阴影 - 悬浮卡片 */
--shadow-lg: 0 8rpx 32rpx rgba(44, 95, 124, 0.15);

/* 悬停阴影 - 交互元素 */
--shadow-hover: 0 12rpx 40rpx rgba(44, 95, 124, 0.2);
```

---

## 🔘 按钮系统

### 按钮类型
| 类型 | 主色 | 文字色 | 用途 |
|------|------|--------|------|
| Primary | #2C5F7C | #FFFFFF | 主要操作 |
| Secondary | #F5F5F5 | #333333 | 次要操作 |
| Ghost | transparent | #2C5F7C | 链接式操作 |
| Danger | #FF4D4F | #FFFFFF | 危险操作 |

### 按钮尺寸
| 尺寸 | 高度 | 字号 | 圆角 | 内边距 |
|------|------|------|------|--------|
| small | 64rpx | 24rpx | 6rpx | 0 24rpx |
| medium | 80rpx | 28rpx | 8rpx | 0 32rpx |
| large | 96rpx | 32rpx | 10rpx | 0 48rpx |

---

## 🏷️ 卡片系统

### 标准卡片
- 背景: #FFFFFF
- 圆角: 12rpx
- 阴影: --shadow-sm
- 内边距: 24rpx

### 重点卡片
- 背景: --gradient-card
- 圆角: 16rpx
- 阴影: --shadow-md
- 内边距: 32rpx
- 边框: 1rpx solid rgba(44, 95, 124, 0.08)

---

## 📊 图表色彩

| 数据类型 | 色值 |
|----------|------|
| 主要数据 | #2C5F7C |
| 对比数据 | #3A7CA5 |
| 增长数据 | #52C41A |
| 下降数据 | #FF4D4F |
| 中性数据 | #8C8C8C |

---

## 🎯 视觉层次

### Z-Index 分层
| 层级 | 值 | 用途 |
|------|-----|------|
| 基础层 | 0 | 背景、占位 |
| 内容层 | 1 | 普通卡片、列表 |
| 浮动层 | 10 | 按钮、悬浮元素 |
| 弹出层 | 100 | 模态框、抽屉 |
| 遮罩层 | 99 | 遮罩层 |
| 顶层 | 1000 | Toast、提示 |

---

## ✨ 交互动效

### 过渡时间
| 类型 | 时间 | 用途 |
|------|------|------|
| 快速 | 150ms | 颜色变化、小元素 |
| 常规 | 300ms | 位移、缩放 |
| 缓慢 | 500ms | 复杂动画 |

### 缓动函数
```css
/* 标准缓动 */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);

/* 入场缓动 */
--ease-in: cubic-bezier(0.4, 0, 1, 1);

/* 出场缓动 */
--ease-out: cubic-bezier(0, 0, 0.2, 1);

/* 弹性缓动 */
--ease-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 🖼️ 图片规范

### 图片比例
| 类型 | 比例 | 用途 |
|------|------|------|
| Cover | 2:1 | 轮播图、Banner |
| News | 4:3 | 资讯封面 |
| Card | 1:1 | 卡片配图 |
| Avatar | 1:1 | 头像 |

### 图片圆角
| 类型 | 圆角 |
|------|------|
| Banner | 0rpx |
| News Cover | 12rpx |
| Card Image | 8rpx |
| Avatar | 50% |

---

## 📱 页面布局

### 顶部导航栏
- 高度: 44rpx + 状态栏
- 背景: #FFFFFF
- 标题色: #2C5F7C
- 返回按钮: 主色调

### 底部 TabBar
- 高度: 98rpx
- 背景: #FFFFFF
- 顶部边框: 1rpx solid #E8E8E8
- 未选中: #8C8C8C
- 已选中: #2C5F7C

### 页面结构
```
┌─────────────────────────┐
│     Navigation Bar       │ 44rpx + status
├─────────────────────────┤
│                         │
│      Page Content        │  内容区域
│                         │
├─────────────────────────┤
│      Tab Bar            │ 98rpx
└─────────────────────────┘
```

---

## 🎨 组件样式示例

### 标签 (Tags)
```css
/* 主要标签 */
.tag-primary {
  background: rgba(44, 95, 124, 0.08);
  color: #2C5F7C;
  border: 1rpx solid rgba(44, 95, 124, 0.16);
}

/* 成功标签 */
.tag-success {
  background: rgba(82, 196, 26, 0.08);
  color: #52C41A;
  border: 1rpx solid rgba(82, 196, 26, 0.16);
}

/* 警告标签 */
.tag-warning {
  background: rgba(250, 173, 20, 0.08);
  color: #FAAD14;
  border: 1rpx solid rgba(250, 173, 20, 0.16);
}
```

### 输入框 (Input)
```css
.input {
  background: #FFFFFF;
  border: 1rpx solid #E8E8E8;
  border-radius: 8rpx;
  padding: 20rpx 24rpx;
  font-size: 28rpx;
  transition: all 0.3s ease;
}

.input:focus {
  border-color: #2C5F7C;
  box-shadow: 0 0 0 2rpx rgba(44, 95, 124, 0.08);
}
```

---

## 📋 使用建议

### 页面配色建议
1. **首页**: 使用主色调 + 白色背景，营造专业氛围
2. **资讯页**: 使用渐变色卡片，增强视觉吸引力
3. **列表页**: 保持简洁，用主色强调重点
4. **详情页**: 充分利用留白，提升阅读体验

### 图标使用
- 主要功能: 使用线性图标 (Line Icons)
- 强调功能: 使用面性图标 (Solid Icons)
- 导航图标: 选用风格统一的图标库

### 文字颜色层级
1. **一级文字** (#333333): 标题、重要信息
2. **二级文字** (#666666): 正文内容
3. **三级文字** (#999999): 辅助说明
4. **四级文字** (#CCCCCC): 占位符、禁用状态

---

## 🔍 品牌应用

### Logo 颜色
- 主色: #2C5F7C
- 副色: #3A7CA5

### 线下应用
- 名片: 深蓝色背景 + 白色文字
- 宣传册: 浅灰底色 + 主色调强调
- 易拉宝: 渐变背景 + 大面积留白

---

## 📦 设计资源

### 推荐图标库
- Iconfont (阿里巴巴矢量图标库)
- IconPark (字节跳动图标库)
- Remix Icon

### 推荐字体
- 中文字体: 思源黑体、苹方
- 英文字体: Helvetica Neue、San Francisco

---

*本视觉设计方案旨在打造专业、时尚、国际化的留学咨询品牌形象，适用于小程序、H5、App等多端产品。*
