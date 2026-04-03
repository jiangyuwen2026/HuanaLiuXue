# 调试快速参考手册

## 🚀 立即开始调试

### 1. 打开开发者工具调试面板

- **Console**：查看日志输出
- **Sources**：设置断点、单步调试
- **Network**：查看网络请求
- **Storage**：查看存储数据
- **AppData**：查看和修改页面数据

### 2. 常用调试代码

```javascript
// 输出日志
console.log('日志信息')
console.error('错误信息')
console.warn('警告信息')
console.table(data) // 表格形式输出

// 查看页面数据
console.log(this.data)

// 查看当前页面
console.log(getCurrentPages())

// 查看App实例
console.log(getApp())

// 设置断点
debugger;

// 计时
console.time('load')
// ... 代码
console.timeEnd('load')
```

### 3. 网络请求调试

```javascript
// 基础请求
wx.request({
  url: 'https://api.example.com/data',
  success: (res) => {
    console.log('成功：', res.data)
  },
  fail: (err) => {
    console.error('失败：', err)
  }
})
```

**查看请求：**
1. 切换到 Network 面板
2. 点击请求查看详情
3. 查看 Headers、Preview、Response

### 4. 数据存储调试

```javascript
// 存储
wx.setStorageSync('key', 'value')

// 读取
const value = wx.getStorageSync('key')
console.log(value)

// 清空
wx.clearStorageSync()

// 查看所有存储
wx.getStorageInfo({
  success: (res) => {
    console.log('存储信息：', res)
  }
})
```

**在Storage面板中：**
- 直接查看所有存储数据
- 双击值可以修改
- 右键删除

### 5. 页面数据调试

```javascript
Page({
  data: {
    title: '初始标题'
  },

  onLoad() {
    // 查看初始数据
    console.log('页面加载：', this.data)
  },

  updateData() {
    // 使用setData更新
    this.setData({
      title: '新标题'
    })
    console.log('更新后：', this.data)
  }
})
```

**在AppData面板中：**
- 实时查看data数据
- 直接修改值测试效果
- 页面会自动更新

### 6. 事件调试

```javascript
Page({
  handleTap(e) {
    console.log('事件触发')
    console.log('事件对象：', e)
    console.log('数据：', e.currentTarget.dataset)
  }
})
```

```html
<view bindtap="handleTap" data-id="123">点击</view>
```

### 7. 断点调试

**设置断点：**
1. 在Sources面板点击行号
2. 或在代码中写 `debugger;`

**断点操作：**
- F8：继续执行
- F10：单步跳过
- F11：单步进入

### 8. 真机调试

**开启真机调试：**
1. 点击"真机调试"按钮
2. 扫码在手机打开
3. 可以查看真实环境问题

**开启vConsole：**
```javascript
// app.js
wx.setEnableDebug({ enableDebug: true })
```

在手机上右上角 "..." → "打开调试"

### 9. 常见问题快速解决

| 问题 | 解决方法 |
|------|----------|
| 页面打不开 | 检查app.json中是否注册了页面路径 |
| 数据不更新 | 使用setData，不要直接修改this.data |
| 样式不生效 | 检查Wxml面板中实际应用的样式 |
| 事件不触发 | 检查事件绑定是否正确（bindtap） |
| 网络请求失败 | 开发环境勾选"不校验合法域名" |

### 10. 性能监控

```javascript
Page({
  onLoad() {
    const start = Date.now()
    // ... 代码
    const end = Date.now()
    console.log(`耗时：${end - start}ms`)
  }
})
```

查看性能：切换到 Performance 面板，录制并分析

---

## 💡 实用技巧

### 快速定位问题

1. **页面无法加载**
   - 查看Console错误信息
   - 检查app.json中页面路径
   - 确认文件是否存在

2. **数据不更新**
   - 在AppData面板查看数据
   - 确认使用setData更新
   - 检查数据是否在data中

3. **网络请求失败**
   - 查看Network面板
   - 检查请求URL和参数
   - 查看 statusCode 和响应数据

### 调试最佳实践

- ✅ 使用有意义的日志标签
- ✅ 区分日志级别（log、warn、error）
- ✅ 定时代码执行耗时
- ✅ 使用表格输出复杂数据
- ✅ 及时清理console.log

---

## 📱 常用调试面板功能

| 面板 | 用途 | 快捷操作 |
|------|------|----------|
| Console | 查看日志 | 输入代码执行 |
| Sources | 断点调试 | F8/F10/F11 |
| Network | 网络请求 | 点击查看详情 |
| Storage | 本地存储 | 双击修改值 |
| AppData | 页面数据 | 直接修改测试 |
| Wxml | 页面结构 | 查看组件和样式 |

---

**遇到问题？查看完整的 DEBUG_GUIDE.md 文档！**
