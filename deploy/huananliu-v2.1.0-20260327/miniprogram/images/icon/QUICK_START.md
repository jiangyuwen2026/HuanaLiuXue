# 图标快速开始指南

## 🚀 快速步骤（5分钟完成）

### 第一步：打开下载助手

用浏览器打开文件：
```
images/icon/icon-downloader.html
```

### 第二步：下载 TabBar 图标

按照页面中的指引，下载以下 8 个图标到 `images/tab/` 目录：

| 图标 | 文件名 | 搜索关键词 | 尺寸 |
|------|--------|-----------|------|
| 首页 | home.png | home | 81×81 |
| 首页（选中） | home-active.png | home | 81×81 |
| 资讯 | news.png | news | 81×81 |
| 资讯（选中） | news-active.png | news | 81×81 |
| 咨询 | consult.png | chat | 81×81 |
| 咨询（选中） | consult-active.png | chat | 81×81 |
| 我的 | user.png | user | 81×81 |
| 我的（选中） | user-active.png | user | 81×81 |

**颜色说明：**
- 未选中图标：灰色 (#999999)
- 选中图标：蓝色 (#2C5F7C)

### 第三步：下载功能图标

下载以下 6 个图标到 `images/icon/` 目录：

| 图标 | 文件名 | 搜索关键词 | 尺寸 | 颜色 |
|------|--------|-----------|------|------|
| 学校查询 | school.png | school | 96×96 | #2C5F7C |
| 专业查询 | major.png | book | 96×96 | #52C41A |
| 申请指导 | guide.png | document | 96×96 | #FAAD14 |
| 在线咨询 | consult2.png | search | 96×96 | #FF4D4F |
| 成功案例 | case.png | case | 96×96 | #722ED1 |
| 顾问团队 | consultant.png | people | 96×96 | #EB2F96 |

### 第四步：编译验证

1. 打开微信开发者工具
2. 点击"编译"
3. 检查 TabBar 是否显示图标
4. 检查首页功能入口图标是否正常

## 📋 完整清单打印版

```
☐ TabBar 图标（8个）
  ☐ images/tab/home.png
  ☐ images/tab/home-active.png
  ☐ images/tab/news.png
  ☐ images/tab/news-active.png
  ☐ images/tab/consult.png
  ☐ images/tab/consult-active.png
  ☐ images/tab/user.png
  ☐ images/tab/user-active.png

☐ 功能图标（6个）
  ☐ images/icon/school.png
  ☐ images/icon/major.png
  ☐ images/icon/guide.png
  ☐ images/icon/consult2.png
  ☐ images/icon/case.png
  ☐ images/icon/consultant.png
```

## 🔧 在 IconPark 下载图标的具体步骤

1. **点击搜索链接**：在 `icon-downloader.html` 中点击"搜索图标"按钮
2. **选择图标**：浏览搜索结果，点击选择合适的图标
3. **调整样式**（可选）：
   - 风格：选择"线性"或"填充"
   - 线条粗细：默认即可
   - 颜色：可设置为 #999999 或 #2C5F7C
4. **点击下载**：点击图标右上角的下载按钮
5. **配置下载**：
   - 格式：选择 PNG
   - 尺寸：输入 81 或 96（根据图标类型）
   - 点击确认下载
6. **重命名文件**：将下载的文件重命名为清单中的文件名
7. **移动文件**：将文件放到对应目录

## 💡 提示

- **批量下载**：IconPark 支持多选图标批量下载
- **颜色调整**：可以在 IconPark 中直接设置颜色，也可以下载后用图像软件修改
- **尺寸选择**：确保 TabBar 图标是 81×81，功能图标是 96×96
- **文件格式**：必须是 PNG 格式，背景透明

## ❓ 常见问题

**Q: 图标下载后如何修改颜色？**

A: 可以使用在线工具 Photopea (https://www.photopea.com/)，它是免费版的 Photoshop，功能强大。

**Q: 找不到合适的图标怎么办？**

A: 尝试更换搜索关键词，如：
- 学校 → education, campus, building
- 专业 → major, study, graduation
- 指导 → guide, help, tips
- 案例 → success, trophy, star

**Q: 图标在小程序中不显示？**

A: 检查：
1. 文件名是否完全匹配（区分大小写）
2. 文件是否在正确的目录
3. 文件格式是否为 PNG
4. 是否已重新编译小程序

## 📚 更多帮助

- 详细清单：[ICON_CHECKLIST.md](ICON_CHECKLIST.md)
- TabBar 指南：[../tab/icons.md](../tab/icons.md)
- SVG 模板：[svg-templates.js](svg-templates.js)

---

**开始下载图标：[打开下载助手](icon-downloader.html)**
