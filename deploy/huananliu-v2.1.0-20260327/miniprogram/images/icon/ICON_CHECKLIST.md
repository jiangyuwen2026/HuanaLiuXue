# 图标清单与下载指南

## 📋 概述

本文档列出了小程序所需的所有图标及其规格，方便从 IconPark 下载和配置。

## 🎨 图标总览

### TabBar 图标（4个功能 × 2种状态 = 8个文件）

| 功能 | 未选中 | 选中 | IconPark 搜索关键词 | 尺寸 | 颜色 |
|------|--------|------|-------------------|------|------|
| 首页 | home.png | home-active.png | home, 房子 | 81×81 | #999999 / #2C5F7C |
| 资讯 | news.png | news-active.png | news, 消息 | 81×81 | #999999 / #2C5F7C |
| 咨询 | consult.png | consult-active.png | chat, 对话 | 81×81 | #999999 / #2C5F7C |
| 我的 | user.png | user-active.png | user, 用户 | 81×81 | #999999 / #2C5F7C |

### 功能入口图标（6个文件）

| 功能 | 文件名 | IconPark 搜索关键词 | 尺寸 | 颜色 |
|------|--------|-------------------|------|------|
| 学校查询 | school.png | school, 学校 | 96×96 | #2C5F7C |
| 专业查询 | major.png | book, 书本 | 96×96 | #52C41A |
| 申请指导 | guide.png | document, 文档 | 96×96 | #FAAD14 |
| 在线咨询 | consult2.png | search, 搜索 | 96×96 | #FF4D4F |
| 成功案例 | case.png | case, 案例 | 96×96 | #722ED1 |
| 顾问团队 | consultant.png | people, 人物 | 96×96 | #EB2F96 |

## 🌐 IconPark 下载步骤

### 方法一：使用图标下载助手（推荐）

1. 打开 `images/icon/icon-downloader.html`
2. 点击每个图标的"搜索图标"链接
3. 在 IconPark 中选择图标
4. 点击下载按钮，选择 PNG 格式
5. 设置尺寸：TabBar 图标 81×81，功能图标 96×96
6. 下载后重命名并放到对应目录

### 方法二：直接访问 IconPark

1. 访问官网：https://iconpark.oceanengine.com/
2. 在搜索框输入关键词（参考上表）
3. 选择合适的图标风格（线性或填充）
4. 点击下载按钮
5. 配置下载选项：
   - 格式：PNG
   - 尺寸：根据图标类型设置
   - 颜色：可自定义或下载后修改
6. 点击下载

## 📁 文件放置位置

```
项目根目录/
├── images/
│   ├── tab/           # TabBar 图标
│   │   ├── home.png
│   │   ├── home-active.png
│   │   ├── news.png
│   │   ├── news-active.png
│   │   ├── consult.png
│   │   ├── consult-active.png
│   │   ├── user.png
│   │   └── user-active.png
│   └── icon/          # 功能图标
│       ├── school.png
│       ├── major.png
│       ├── guide.png
│       ├── consult2.png
│       ├── case.png
│       └── consultant.png
```

## 🔧 图标修改指南

如果下载的图标需要调整颜色，可以使用以下工具：

### 在线工具

- **Photopea**: https://www.photopea.com/（类似 Photoshop）
- **Canva**: https://www.canva.com/
- **iloveimg**: https://www.iloveimg.com/zh

### 本地软件

- Photoshop
- GIMP（免费）
- Sketch
- Figma

### 颜色代码

**TabBar 图标**
- 未选中：`#999999`（灰色）
- 选中：`#2C5F7C`（品牌蓝色）

**功能图标**
- 学校：`#2C5F7C`（深蓝）
- 专业：`#52C41A`（绿色）
- 指导：`#FAAD14`（橙色）
- 咨询：`#FF4D4F`（红色）
- 案例：`#722ED1`（紫色）
- 顾问：`#EB2F96`（粉色）

## ✅ 下载清单

请按以下清单逐一下载图标：

### TabBar 图标（8个）
- [ ] home.png
- [ ] home-active.png
- [ ] news.png
- [ ] news-active.png
- [ ] consult.png
- [ ] consult-active.png
- [ ] user.png
- [ ] user-active.png

### 功能图标（6个）
- [ ] school.png
- [ ] major.png
- [ ] guide.png
- [ ] consult2.png
- [ ] case.png
- [ ] consultant.png

## 🎯 图标选择建议

### 风格统一性

1. **线条粗细**：选择相同线条粗细的图标
2. **圆角处理**：保持一致的圆角半径
3. **设计风格**：全部使用线性风格或全部使用填充风格

### 推荐的 IconPark 图标风格

- **线性风格**：简洁清晰，适合 TabBar
- **填充风格**：更有层次感，适合功能图标
- **双色风格**：可增加视觉吸引力

### TabBar 图标建议

TabBar 图标建议使用线性风格，原因：
- 选中/未选中状态对比更明显
- 在小尺寸下保持清晰
- 符合主流设计趋势

## 🔍 图标验证

下载完成后，检查以下要点：

1. **文件命名**：严格按照清单中的命名
2. **文件格式**：必须是 PNG 格式
3. **文件尺寸**：
   - TabBar：81×81 像素
   - 功能图标：96×96 像素
4. **背景**：必须透明背景
5. **颜色**：是否符合要求的颜色代码

## 💡 常见问题

**Q: 为什么图标在小程序中不显示？**

A: 检查以下几点：
- 文件路径是否正确
- 文件名是否完全匹配（区分大小写）
- 文件格式是否为 PNG
- 文件尺寸是否正确
- 是否已重新编译小程序

**Q: 如何批量修改图标颜色？**

A: 可以使用：
1. 批量图像处理工具（如 XnConvert）
2. Photoshop 的批处理功能
3. 在线批量转换工具

**Q: 图标尺寸不对怎么办？**

A: 使用图像调整工具：
- 在线：https://www.iloveimg.com/resize-image
- 本地：Photoshop、GIMP 等

## 📚 相关文档

- [TabBar 图标制作指南](../tab/icons.md)
- [图标下载助手](icon-downloader.html)
- [SVG 模板](svg-templates.js)

## 🆘 获取帮助

如果遇到问题：
1. 查看本文档的"常见问题"部分
2. 使用 `icon-downloader.html` 辅助工具
3. 参考 IconPark 官方文档：https://iconpark.oceanengine.com/docs
