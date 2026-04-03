# TabBar图标使用指南

## ✅ 图标准备完成

本目录应包含以下8个PNG图标文件：

```
images/tab/
├── home.png              # 首页图标（未选中 - 灰色）
├── home-active.png       # 首页图标（选中 - 蓝色）
├── news.png              # 资讯图标（未选中 - 灰色）
├── news-active.png       # 资讯图标（选中 - 蓝色）
├── consult.png           # 咨询图标（未选中 - 灰色）
├── consult-active.png    # 咨询图标（选中 - 蓝色）
├── user.png              # 我的图标（未选中 - 灰色）
└── user-active.png       # 我的图标（选中 - 蓝色）
```

---

## 🚀 快速获取图标

### 方法一：使用在线工具（推荐最快）

1. 打开项目根目录下的 `icon-generator.html` 文件
2. 在浏览器中查看（直接双击打开）
3. 点击下载按钮下载所需图标
4. 将下载的PNG文件放到本目录

### 方法二：使用在线转换工具

1. 打开 `icons.md` 文件
2. 复制对应的SVG代码
3. 访问：https://cloudconvert.com/svg-to-png
4. 粘贴SVG代码
5. 设置宽度为81px，高度为81px
6. 转换并下载PNG

### 方法三：使用Node.js脚本

1. 安装依赖：`npm install sharp`
2. 运行脚本：`node generate-icons.js`
3. 等待图标生成完成

---

## 📋 图标规格检查清单

下载或生成图标后，请检查：

- [ ] 文件名是否正确
- [ ] 尺寸是否为 81×81 像素
- [ ] 格式是否为 PNG
- [ ] 背景是否透明
- [ ] 未选中状态颜色是否为灰色 (#999999)
- [ ] 选中状态颜色是否为蓝色 (#1890ff)
- [ ] 图标线条是否清晰

---

## 🎨 自定义图标

如果您需要修改图标样式：

### 修改颜色

**当前配色：**
- 未选中：#999999
- 选中：#1890ff

**修改方法：**
1. 使用Photoshop、GIMP等工具打开PNG
2. 使用色相/饱和度工具调整颜色
3. 导出为PNG格式

### 修改图标设计

**在线工具：**
- Figma：https://www.figma.com/（推荐）
- Canva：https://www.canva.com/
- Sketch（Mac）
- Adobe XD

**设计步骤：**
1. 创建 81×81 画布
2. 导入SVG图标作为参考
3. 修改路径或重新设计
4. 导出为PNG（81×81，透明背景）

---

## 📱 配置小程序

图标文件准备好后，更新 `app.json` 中的 TabBar 配置：

```json
{
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#1890ff",
    "backgroundColor": "#ffffff",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "images/tab/home.png",
        "selectedIconPath": "images/tab/home-active.png"
      },
      {
        "pagePath": "pages/news/news",
        "text": "资讯",
        "iconPath": "images/tab/news.png",
        "selectedIconPath": "images/tab/news-active.png"
      },
      {
        "pagePath": "pages/appointment/appointment",
        "text": "咨询",
        "iconPath": "images/tab/consult.png",
        "selectedIconPath": "images/tab/consult-active.png"
      },
      {
        "pagePath": "pages/user/user",
        "text": "我的",
        "iconPath": "images/tab/user.png",
        "selectedIconPath": "images/tab/user-active.png"
      }
    ]
  }
}
```

---

## ✅ 验证步骤

1. 将图标文件放到 `images/tab/` 目录
2. 打开微信开发者工具
3. 点击"编译"按钮
4. 查看 TabBar 是否正确显示图标

**如果图标没有显示：**
- 检查文件路径是否正确
- 检查文件名是否与配置一致
- 检查文件是否存在
- 尝试重新编译

---

## 💡 推荐图标资源

### 免费图标网站

1. **IconFont（阿里巴巴）**
   - https://www.iconfont.cn/
   - 国内最大图标库
   - 下载SVG/PNG

2. **IconPark（字节跳动）**
   - https://iconpark.oceanengine.com/
   - 图标质量高
   - 可直接下载PNG

3. **Flaticon**
   - https://www.flaticon.com/
   - 国际知名图标库
   - 大量免费图标

4. **Feather Icons**
   - https://feathericons.com/
   - 简洁线性风格
   - 开源免费

### 设计工具

1. **Figma**（推荐）
   - https://www.figma.com/
   - 免费个人版
   - 强大的设计功能

2. **Adobe XD**
   - https://www.adobe.com/products/xd.html
   - 专业设计工具

3. **Sketch**（Mac）
   - macOS原生应用
   - 界面设计专业

---

## 🎯 快速开始

**最快的方法：**

1. 打开 `icon-generator.html`（双击文件）
2. 点击"下载全部8个图标"按钮
3. 等待所有文件下载完成
4. 将下载的PNG文件移动到 `images/tab/` 目录
5. 在微信开发者工具中重新编译

---

**华南留学 - TabBar图标资源**

如有问题，请参考 `icons.md` 或 `icon-generator.html` 中的详细说明。
