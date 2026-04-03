# TabBar图标制作指南

## 📋 图标需求清单

需要准备8个TabBar图标文件：

| 功能 | 未选中图标 | 选中图标 | 说明 |
|------|-----------|---------|------|
| 首页 | home.png | home-active.png | 房子图标 |
| 资讯 | news.png | news-active.png | 消息/报纸图标 |
| 咨询 | consult.png | consult-active.png | 聊天气泡/咨询图标 |
| 我的 | user.png | user-active.png | 用户/个人中心图标 |

## 🎨 图标规格要求

- **尺寸**：81px × 81px
- **格式**：PNG
- **背景**：透明
- **颜色**：
  - 未选中：灰色 (#999999)
  - 选中：蓝色 (#1890ff)
- **文件大小**：建议小于10KB

---

## 🚀 快速制作方案

### 方案一：使用在线工具（推荐最快）

#### 步骤1：下载SVG图标

从以下网站下载免费SVG图标：

1. **IconFont（阿里巴巴）**
   - 网址：https://www.iconfont.cn/
   - 搜索关键词：首页、资讯、咨询、用户
   - 下载SVG格式

2. **IconPark（字节跳动）**
   - 网址：https://iconpark.oceanengine.com/
   - 选择图标 → 点击下载PNG
   - 直接选择81×81尺寸

3. **Flaticon**
   - 网址：https://www.flaticon.com/
   - 搜索并下载免费图标

#### 步骤2：转换为PNG

如果下载的是SVG，使用在线工具转换：

- https://cloudconvert.com/svg-to-png
- https://convertio.co/zh/svg-png/
- https://www.aconvert.com/cn/image/svg-to-png/

**转换设置：**
- 宽度：81px
- 高度：81px
- 背景：透明

#### 步骤3：修改颜色（如需要）

使用以下工具修改图标颜色：

- Photoshop
- GIMP（免费）
- 在线工具：https://www.iloveimg.com/zh

**颜色代码：**
- 未选中：#999999
- 选中：#1890ff

---

### 方案二：使用Figma/Sketch

#### 使用Figma（免费）

1. 访问：https://www.figma.com/
2. 注册免费账号
3. 创建新项目
4. 导入SVG图标或使用Figma内置图标库
5. 修改颜色和尺寸
6. 导出为PNG（81×81）

#### 使用Sketch（Mac）

1. 打开Sketch
2. 创建81×81画板
3. 添加图标图层
4. 修改颜色
5. 导出为PNG

---

### 方案三：使用本页SVG代码直接转换

下面的章节提供了每个图标的SVG代码，您可以直接：

1. 复制SVG代码
2. 粘贴到在线转换工具
3. 转换为PNG（81×81）
4. 修改颜色（未选中/选中）

---

## 🎯 图标SVG代码

### 1. 首页图标（Home）

#### 未选中状态（灰色）
```xml
<svg width="81" height="81" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H15V16H9V22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

#### 选中状态（蓝色）
```xml
<svg width="81" height="81" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H15V16H9V22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#1890ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 2. 资讯图标（News）

#### 未选中状态（灰色）
```xml
<svg width="81" height="81" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14 2V8H20" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="16" y1="13" x2="8" y2="13" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="16" y1="17" x2="8" y2="17" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="10" y1="9" x2="8" y2="9" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

#### 选中状态（蓝色）
```xml
<svg width="81" height="81" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#1890ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14 2V8H20" stroke="#1890ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="16" y1="13" x2="8" y2="13" stroke="#1890ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="16" y1="17" x2="8" y2="17" stroke="#1890ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="10" y1="9" x2="8" y2="9" stroke="#1890ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 3. 咨询图标（Consult）

#### 未选中状态（灰色）
```xml
<svg width="81" height="81" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H17L19 19V17H15C15.5304 17 16.0391 16.7893 16.4142 16.4142C16.7893 16.0391 17 15.5304 17 15V5C17 4.46957 16.7893 3.96086 16.4142 3.58579C16.0391 3.21071 15.5304 3 15 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V15C3 15.5304 3.21071 16.0391 3.58579 16.4142C3.96086 16.7893 4.46957 17 5 17H7V19L9 17H15" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

#### 选中状态（蓝色）
```xml
<svg width="81" height="81" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H17L19 19V17H15C15.5304 17 16.0391 16.7893 16.4142 16.4142C16.7893 16.0391 17 15.5304 17 15V5C17 4.46957 16.7893 3.96086 16.4142 3.58579C16.0391 3.21071 15.5304 3 15 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V15C3 15.5304 3.21071 16.0391 3.58579 16.4142C3.96086 16.7893 4.46957 17 5 17H7V19L9 17H15" stroke="#1890ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 4. 我的图标（User）

#### 未选中状态（灰色）
```xml
<svg width="81" height="81" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="12" cy="7" r="4" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

#### 选中状态（蓝色）
```xml
<svg width="81" height="81" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#1890ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="12" cy="7" r="4" stroke="#1890ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

---

## 🛠️ 快速转换步骤

### 使用在线转换工具（最简单）

1. **复制上面的SVG代码**
2. **访问转换网站**：https://cloudconvert.com/svg-to-png
3. **粘贴SVG代码或上传文件**
4. **设置参数**：
   - Width: 81
   - Height: 81
   - Background: Transparent
5. **点击转换**
6. **下载PNG文件**
7. **保存到对应目录**：`images/tab/home.png`

### 批量转换脚本

如果您需要批量转换，可以使用以下Python脚本：

```python
import os
from cairosvg import svg2png

# 图标配置
icons = [
    ('home', '#999999'),
    ('home-active', '#1890ff'),
    ('news', '#999999'),
    ('news-active', '#1890ff'),
    ('consult', '#999999'),
    ('consult-active', '#1890ff'),
    ('user', '#999999'),
    ('user-active', '#1890ff')
]

# SVG模板（替换颜色）
for icon_name, color in icons:
    svg_content = f"""
    <svg width="81" height="81" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 这里是对应的SVG路径，替换为上面的路径代码 -->
    </svg>
    """

    # 转换为PNG
    svg2png(bytestring=svg_content.encode(), write_to=f'images/tab/{icon_name}.png', output_width=81, output_height=81)
    print(f'已生成: {icon_name}.png')
```

---

## 📦 放置图标文件

转换完成后，将PNG文件放到对应目录：

```
华南留学小程序/images/tab/
├── home.png              # 首页（灰色）
├── home-active.png       # 首页（蓝色）
├── news.png              # 资讯（灰色）
├── news-active.png       # 资讯（蓝色）
├── consult.png           # 咨询（灰色）
├── consult-active.png    # 咨询（蓝色）
├── user.png              # 我的（灰色）
└── user-active.png       # 我的（蓝色）
```

---

## ✅ 验证图标

图标文件放置完成后：

1. **打开微信开发者工具**
2. **点击"编译"**
3. **查看TabBar是否正确显示图标**

如果图标没有显示，检查：
- 文件名是否正确
- 文件路径是否正确
- 文件格式是否为PNG
- 文件尺寸是否为81×81px

---

## 💡 其他图标资源

### 如果需要更多图标

以下网站提供免费图标资源：

1. **IconFont（推荐）**
   - https://www.iconfont.cn/
   - 国内最常用的图标库
   - 阿里巴巴出品

2. **IconPark**
   - https://iconpark.oceanengine.com/
   - 字节跳动出品
   - 图标质量高

3. **Feather Icons**
   - https://feathericons.com/
   - 简洁线性图标
   - 开源免费

4. **Heroicons**
   - https://heroicons.com/
   - Tailwind CSS官方图标库
   - SVG格式

---

## 🎨 设计建议

### 图标设计原则

1. **一致性**
   - 所有图标使用相同的线条粗细
   - 相同的圆角半径
   - 统一的设计风格

2. **识别性**
   - 图标含义清晰
   - 一眼就能识别
   - 符合用户认知

3. **简洁性**
   - 避免过多细节
   - 线条清晰
   - 视觉平衡

4. **对比性**
   - 选中状态与未选中状态有明显对比
   - 使用品牌色（蓝色）作为选中状态

### 颜色规范

- 未选中：#999999（中性灰）
- 选中：#1890ff（品牌蓝）
- 可以考虑使用渐变效果

---

**图标准备完成后，记得更新 app.json 中的 TabBar 配置！**
