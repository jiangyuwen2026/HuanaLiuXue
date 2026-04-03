# 微信小程序调试指南

## 📋 目录

1. [微信开发者工具调试](#一微信开发者工具调试)
2. [真机调试](#二真机调试)
3. [网络请求调试](#三网络请求调试)
4. [常见问题调试](#四常见问题调试)
5. [性能优化调试](#五性能优化调试)
6. [数据存储调试](#六数据存储调试)

---

## 一、微信开发者工具调试

### 1.1 调试面板介绍

微信开发者工具提供了强大的调试工具，位于开发工具的右侧：

#### 📊 调试器面板

**Console（控制台）**
- 查看日志输出
- 执行JavaScript代码
- 查看错误信息
- 使用 `console.log()` 输出调试信息

**Sources（源代码）**
- 查看所有源文件
- 设置断点
- 单步调试
- 查看变量值

**Network（网络）**
- 查看所有网络请求
- 查看请求和响应数据
- 查看请求耗时
- 查看请求头和响应头

**Storage（存储）**
- 查看 Storage 数据
- 查看 CacheStorage
- 可以清空缓存

**AppData（应用数据）**
- 查看页面数据（data）
- 实时修改数据测试效果
- 查看全局数据

**Sensor（传感器）**
- 模拟地理位置
- 模拟设备方向
- 模拟屏幕亮度

**Trace（追踪）**
- 查看函数调用栈
- 性能分析

**Wxml（页面结构）**
- 查看页面DOM结构
- 查看组件属性
- 查看样式

**Console（模拟器控制台）**
- 查看模拟器日志

### 1.2 Console调试技巧

#### 输出日志

```javascript
// 基础日志
console.log('普通日志')
console.warn('警告信息')
console.error('错误信息')

// 格式化输出
console.log('用户信息：', userInfo)
console.log('当前页面：', currentPage)

// 表格形式输出（适合数组/对象）
console.table([
  { name: '张三', age: 20 },
  { name: '李四', age: 22 }
])

// 分组输出
console.group('用户数据')
console.log('用户ID：', userId)
console.log('用户名：', userName)
console.groupEnd()

// 计时
console.time('数据加载')
// ... 代码执行
console.timeEnd('数据加载')

// 断言（条件为false时输出）
console.assert(condition, '条件不满足')

// 计数
console.count('点击次数')
```

#### 在小程序中使用

```javascript
// Page.js
Page({
  onLoad() {
    console.log('页面加载完成')
    console.log('页面参数：', this.data)
  },

  getData() {
    console.log('开始获取数据...')

    wx.request({
      url: 'https://api.example.com/data',
      success: (res) => {
        console.log('数据获取成功：', res.data)
        this.setData({ dataList: res.data })
      },
      fail: (err) => {
        console.error('数据获取失败：', err)
      }
    })
  }
})
```

### 1.3 断点调试

#### 设置断点

1. **在Sources面板中设置断点**
   - 点击代码行号左侧设置断点
   - 断点会显示为红色圆点

2. **在代码中设置断点**
   ```javascript
   debugger; // 程序执行到这里会暂停
   ```

#### 断点操作

- **继续执行**：F8 或点击 "Resume script execution"
- **单步跳过**：F10 或点击 "Step over"
- **单步进入**：F11 或点击 "Step into"
- **单步跳出**：Shift+F11 或点击 "Step out"

#### 查看变量

- 在断点处暂停时，鼠标悬停在变量上查看值
- 在 Scope 面板中查看所有变量
- 在 Console 中输入变量名查看值

### 1.4 Network调试

#### 查看网络请求

1. 切换到 Network 面板
2. 触发网络请求
3. 查看请求列表

#### 请求信息查看

- **Headers**：请求头、响应头
- **Preview**：响应数据预览
- **Response**：原始响应数据
- **Timing**：请求耗时

#### 过滤请求

- 点击 "All" 下拉菜单
- 选择 "XHR" 查看Ajax请求
- 选择 "Doc" 查看文档请求
- 搜索框输入关键词过滤

### 1.5 Storage调试

#### 查看 Storage

```javascript
// 存储数据
wx.setStorageSync('userInfo', { name: '张三', age: 20 })
wx.setStorageSync('token', 'abc123')

// 读取数据
const userInfo = wx.getStorageSync('userInfo')
console.log('用户信息：', userInfo)

// 删除数据
wx.removeStorageSync('token')

// 清空所有数据
wx.clearStorageSync()
```

#### 在Storage面板中

- 查看所有存储的键值对
- 双击值可以修改
- 右键可以删除或清空

### 1.6 AppData调试

#### 查看页面数据

1. 切换到 AppData 面板
2. 查看当前页面的 data 数据
3. 点击展开查看详细内容

#### 实时修改数据

1. 在 AppData 面板中直接修改数据值
2. 页面会实时更新显示
3. 适合快速测试不同数据的效果

```javascript
// 例如修改页面数据
Page({
  data: {
    title: '华南留学',
    count: 0
  },

  onLoad() {
    // 可以在 AppData 面板中手动修改 count 的值
    // 页面会自动更新
  }
})
```

### 1.7 性能监控

#### Performance面板

1. 切换到 Trace 或 Performance 面板
2. 点击录制按钮
3. 执行需要监控的操作
4. 停止录制
5. 查看性能分析报告

#### 关注指标

- **首屏渲染时间**：页面首次渲染完成时间
- **脚本执行时间**：JavaScript执行时间
- **网络请求时间**：API请求耗时
- **渲染时间**：页面渲染耗时

---

## 二、真机调试

### 2.1 真机调试模式

#### 开启真机调试

1. 点击微信开发者工具顶部的"真机调试"按钮
2. 使用微信扫描二维码
3. 在手机微信中打开小程序
4. 可以在开发者工具中查看和控制手机上的小程序

#### 真机调试特点

- 在真实设备上运行
- 可以查看真实环境的问题
- 可以使用设备真实功能（摄像头、定位等）
- 调试信息同步到开发者工具

### 2.2 真机调试技巧

#### 查看日志

```javascript
// 真机调试时，日志会同步到开发者工具的Console
console.log('这是真机调试日志')

// 使用vConsole（需要引入）
wx.setEnableDebug({
  enableDebug: true
})
```

#### 查看错误

- 真机上的错误会同步到开发者工具
- 在Console中查看错误信息
- 在Sources中定位错误代码

#### 真机性能分析

- 真机可以测试真实性能
- 注意低端设备的性能问题
- 测试不同品牌和型号的手机

### 2.3 远程调试

#### 使用vConsole

vConsole是微信内置的移动端调试工具：

```javascript
// app.js
App({
  onLaunch() {
    // 开启vConsole
    wx.setEnableDebug({
      enableDebug: true
    })
  }
})
```

在手机上查看：
1. 小程序右上角点击 "..."
2. 选择"打开调试"
3. 屏幕右下角会出现 vConsole 按钮
4. 点击查看日志和网络请求

---

## 三、网络请求调试

### 3.1 wx.request调试

#### 基础调试

```javascript
// 发起请求
wx.request({
  url: 'https://api.example.com/data',
  method: 'GET',
  data: {
    page: 1,
    size: 10
  },
  header: {
    'content-type': 'application/json',
    'Authorization': 'Bearer token'
  },
  success: (res) => {
    console.log('请求成功')
    console.log('状态码：', res.statusCode)
    console.log('响应数据：', res.data)
    console.log('请求头：', res.header)
  },
  fail: (err) => {
    console.error('请求失败')
    console.error('错误信息：', err.errMsg)
    console.error('完整错误：', err)
  },
  complete: () => {
    console.log('请求完成')
  }
})
```

#### 请求拦截封装

```javascript
// utils/request.js
const BASE_URL = 'https://api.example.com/api'

const request = (options) => {
  console.log('=== 请求开始 ===')
  console.log('URL：', BASE_URL + options.url)
  console.log('方法：', options.method || 'GET')
  console.log('参数：', options.data)

  return wx.request({
    url: BASE_URL + options.url,
    method: options.method || 'GET',
    data: options.data,
    header: {
      'content-type': 'application/json',
      'Authorization': wx.getStorageSync('token'),
      ...options.header
    },
    success: (res) => {
      console.log('=== 请求成功 ===')
      console.log('状态码：', res.statusCode)
      console.log('响应数据：', res.data)

      if (res.statusCode === 200) {
        options.success && options.success(res.data)
      } else {
        console.error('业务错误：', res.data)
        wx.showToast({
          title: res.data.message || '请求失败',
          icon: 'none'
        })
        options.fail && options.fail(res.data)
      }
    },
    fail: (err) => {
      console.error('=== 请求失败 ===')
      console.error('错误信息：', err.errMsg)
      console.error('完整错误：', err)

      wx.showToast({
        title: '网络错误，请稍后重试',
        icon: 'none'
      })
      options.fail && options.fail(err)
    }
  })
}

module.exports = { request }
```

#### 使用封装的请求

```javascript
// pages/index/index.js
const { request } = require('../../utils/request.js')

Page({
  loadData() {
    request({
      url: '/news',
      data: { page: 1 },
      success: (data) => {
        this.setData({ newsList: data.list })
      }
    })
  }
})
```

### 3.2 不校验合法域名

#### 开发阶段配置

1. 微信开发者工具右上角点击"详情"
2. 选择"本地设置"
3. 勾选"不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书"

**注意：** 只能在开发环境使用，正式发布必须配置合法域名

### 3.3 网络错误处理

#### 常见错误及解决方案

```javascript
// 1. 网络超时
// 解决：增加timeout配置
wx.request({
  url: 'https://api.example.com/data',
  timeout: 10000, // 10秒超时
  success: (res) => {}
})

// 2. 域名未配置
// 解决：在微信公众平台配置服务器域名
// 或开发阶段勾选"不校验合法域名"

// 3. HTTPS证书问题
// 解决：确保使用有效的HTTPS证书

// 4. 跨域问题
// 解决：小程序不存在跨域问题，但需要配置合法域名

// 5. 请求被拦截
// 解决：检查request合法域名配置
```

### 3.4 Mock数据调试

#### 使用本地Mock数据

```javascript
// utils/mock.js
const mockData = {
  news: [
    { id: 1, title: '香港留学政策更新', date: '2024-01-01' },
    { id: 2, title: '新加坡留学优势', date: '2024-01-02' }
  ],
  schools: [
    { id: 1, name: '香港大学', country: '香港' },
    { id: 2, name: '新加坡国立大学', country: '新加坡' }
  ]
}

module.exports = { mockData }
```

```javascript
// 页面中使用
const { mockData } = require('../../utils/mock.js')

Page({
  data: {
    useMock: true // 开关，切换真实/模拟数据
  },

  loadData() {
    if (this.data.useMock) {
      console.log('使用Mock数据')
      this.setData({ newsList: mockData.news })
    } else {
      // 真实请求
      this.requestNews()
    }
  }
})
```

---

## 四、常见问题调试

### 4.1 页面无法加载

#### 调试步骤

1. **检查Console错误**
   ```javascript
   // 页面加载失败通常会在Console显示错误
   // 例如：navigateTo:fail page "pages/xxx/xxx" is not found
   ```

2. **检查页面配置**
   ```json
   // app.json 中是否注册了页面路径
   {
     "pages": [
       "pages/index/index",
       "pages/news/news"  // 确保路径正确
     ]
   }
   ```

3. **检查文件是否存在**
   - 确认 `.js`、`.wxml`、`.wxss`、`.json` 四个文件都存在
   - 文件名必须小写

4. **检查页面跳转代码**
   ```javascript
   // 正确的跳转方式
   wx.navigateTo({
     url: '/pages/news/news?id=1'  // 必须以/开头
   })

   // 错误的跳转方式
   wx.navigateTo({
     url: 'pages/news/news'  // 缺少/
   })
   ```

### 4.2 数据不更新

#### 调试方法

```javascript
Page({
  data: {
    title: '初始标题',
    count: 0
  },

  // 方法1：使用setData更新
  updateTitle() {
    console.log('更新前：', this.data.title)
    this.setData({
      title: '新标题'
    })
    console.log('更新后：', this.data.title)
  },

  // 方法2：直接修改（不会触发视图更新）
  updateDirect() {
    console.log('❌ 直接修改不会更新视图')
    this.data.count = 100
    console.log('data中的值：', this.data.count)
    // 但视图不会更新！
  },

  // 方法3：正确的方式
  updateCorrect() {
    console.log('✅ 使用setData更新')
    this.setData({
      count: this.data.count + 1
    })
  }
})
```

#### 在AppData中查看

1. 切换到AppData面板
2. 查看data中的值
3. 手动修改值测试视图更新

### 4.3 事件不触发

#### 检查事件绑定

```html
<!-- 正确的绑定方式 -->
<view bindtap="handleTap">点击我</view>
<button bind:tap="handleClick">按钮</button>
<view catchtap="handleCatchTap">阻止冒泡</view>

<!-- 错误的绑定方式 -->
<view onclick="handleTap">HTML事件无效</view>
<view bindclick="handleTap">错误的事件名</view>
```

```javascript
Page({
  handleTap(e) {
    console.log('点击事件触发')
    console.log('事件对象：', e)
    console.log('当前时间戳：', e.timeStamp)
    console.log('当前target：', e.currentTarget)
    console.log('dataset：', e.currentTarget.dataset)
  },

  handleClick(e) {
    console.log('按钮点击')
  },

  handleCatchTap(e) {
    console.log('阻止冒泡事件')
  }
})
```

#### 调试技巧

1. 在事件处理函数中添加 `console.log`
2. 检查事件对象 `e`
3. 查看是否有报错

### 4.4 样式不生效

#### 检查样式

1. **Wxml面板检查**
   - 切换到 Wxml 面板
   - 查看元素实际应用的样式
   - 检查样式优先级

2. **样式加载顺序**
   ```css
   /* 样式优先级：行内 > ID > 类 > 标签 */
   /* app.wxss (全局样式) */
   .title {
     color: red;
   }

   /* page.wxss (页面样式) */
   .title {
     color: blue;  /* 会覆盖全局样式 */
   }

   /* 行内样式 */
   <view style="color: green">优先级最高</view>
   ```

3. **使用rpx单位**
   ```css
   /* 小程序推荐使用rpx响应式单位 */
   .container {
     width: 750rpx;  /* 等于屏幕宽度 */
     padding: 30rpx;
   }
   ```

### 4.5 异步操作调试

#### Promise调试

```javascript
Page({
  loadData() {
    console.log('1. 开始加载数据')

    // 方式1：使用Promise
    this.fetchData()
      .then(data => {
        console.log('3. 数据获取成功', data)
        this.setData({ list: data })
      })
      .catch(err => {
        console.error('数据获取失败', err)
      })

    console.log('2. Promise已创建，异步执行')
  },

  fetchData() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://api.example.com/data',
        success: (res) => {
          console.log('请求完成')
          resolve(res.data)
        },
        fail: reject
      })
    })
  }
})
```

#### async/await调试

```javascript
Page({
  async loadAllData() {
    console.log('开始加载所有数据')

    try {
      // 并行加载
      const [newsData, schoolData] = await Promise.all([
        this.getNews(),
        this.getSchools()
      ])

      console.log('新闻数据：', newsData)
      console.log('学校数据：', schoolData)

      this.setData({
        newsList: newsData,
        schoolList: schoolData
      })
    } catch (err) {
      console.error('加载失败：', err)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  getNews() {
    return new Promise((resolve) => {
      wx.request({
        url: 'https://api.example.com/news',
        success: (res) => resolve(res.data)
      })
    })
  },

  getSchools() {
    return new Promise((resolve) => {
      wx.request({
        url: 'https://api.example.com/schools',
        success: (res) => resolve(res.data)
      })
    })
  }
})
```

---

## 五、性能优化调试

### 5.1 渲染性能

#### 检查渲染耗时

```javascript
Page({
  onLoad() {
    const startTime = Date.now()

    this.setData({
      dataList: largeArray  // 大数组数据
    })

    const endTime = Date.now()
    console.log(`渲染耗时：${endTime - startTime}ms`)
  }
})
```

#### 优化建议

1. **减少setData调用频率**
   ```javascript
   // ❌ 不好的方式
   for (let i = 0; i < 100; i++) {
     this.setData({ count: i })  // 触发100次渲染
   }

   // ✅ 好的方式
   const count = 100
   this.setData({ count })  // 只触发1次渲染
   ```

2. **减少data数据量**
   ```javascript
   // ❌ 不好的方式
   this.setData({
     hugeObject: { ... }  // 大对象
   })

   // ✅ 好的方式
   this.setData({
     id: hugeObject.id,  // 只存储需要的字段
     name: hugeObject.name
   })
   ```

### 5.2 数据加载优化

#### 分页加载

```javascript
Page({
  data: {
    page: 1,
    pageSize: 10,
    list: [],
    loading: false
  },

  onLoad() {
    this.loadData()
  },

  onReachBottom() {
    // 触底加载更多
    if (!this.data.loading) {
      this.loadMore()
    }
  },

  loadData() {
    console.log('加载第1页数据')
    this.setData({ loading: true })

    wx.request({
      url: 'https://api.example.com/list',
      data: {
        page: this.data.page,
        size: this.data.pageSize
      },
      success: (res) => {
        console.log('数据加载成功', res.data)
        this.setData({
          list: res.data.list,
          loading: false
        })
      },
      fail: (err) => {
        console.error('加载失败', err)
        this.setData({ loading: false })
      }
    })
  },

  loadMore() {
    console.log('加载更多数据')
    this.setData({
      page: this.data.page + 1,
      loading: true
    })

    wx.request({
      url: 'https://api.example.com/list',
      data: {
        page: this.data.page,
        size: this.data.pageSize
      },
      success: (res) => {
        console.log('更多数据加载成功', res.data)
        this.setData({
          list: this.data.list.concat(res.data.list),
          loading: false
        })
      },
      fail: (err) => {
        console.error('加载更多失败', err)
        this.setData({
          page: this.data.page - 1,  // 回退页码
          loading: false
        })
      }
    })
  }
})
```

### 5.3 图片优化

#### 图片懒加载

```html
<!-- 使用lazy-load实现懒加载 -->
<image lazy-load src="{{item.image}}" />
```

#### 图片压缩

```javascript
Page({
  // 选择并压缩图片
  chooseImage() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]

        // 压缩图片
        wx.compressImage({
          src: tempFilePath,
          quality: 80,  // 压缩质量
          success: (compressRes) => {
            console.log('压缩后路径：', compressRes.tempFilePath)
            this.uploadImage(compressRes.tempFilePath)
          }
        })
      }
    })
  },

  uploadImage(filePath) {
    wx.uploadFile({
      url: 'https://api.example.com/upload',
      filePath: filePath,
      name: 'file',
      success: (res) => {
        console.log('上传成功', res.data)
      }
    })
  }
})
```

---

## 六、数据存储调试

### 6.1 Storage调试

#### 查看存储数据

```javascript
// 存储
wx.setStorageSync('key', 'value')
wx.setStorageSync('userInfo', { name: '张三', age: 20 })

// 读取
const value = wx.getStorageSync('key')
console.log('存储的值：', value)

const userInfo = wx.getStorageSync('userInfo')
console.log('用户信息：', userInfo)

// 获取所有存储信息
wx.getStorageInfo({
  success: (res) => {
    console.log('存储信息：', res)
    console.log('当前存储大小：', res.currentSize, 'KB')
    console.log('存储上限：', res.limitSize, 'KB')
    console.log('所有keys：', res.keys)
  }
})
```

#### 在Storage面板查看

1. 切换到Storage面板
2. 查看所有存储的键值对
3. 可以直接修改值
4. 可以删除单个或清空所有

### 6.2 Cache调试

```javascript
// 缓存数据
const cacheKey = 'news_list'
const cacheTime = 'news_list_time'

// 存储到缓存
wx.setStorageSync(cacheKey, newsList)
wx.setStorageSync(cacheTime, Date.now())

// 读取缓存
const newsList = wx.getStorageSync(cacheKey)
const cacheTime = wx.getStorageSync(cacheTime)

// 检查是否过期（例如1小时）
const isExpired = Date.now() - cacheTime > 3600000

if (!newsList || isExpired) {
  // 缓存不存在或已过期，重新请求
  console.log('缓存过期，重新获取')
  this.loadData()
} else {
  // 使用缓存
  console.log('使用缓存数据')
  this.setData({ list: newsList })
}
```

---

## 七、调试最佳实践

### 7.1 调试日志规范

```javascript
// 定义日志级别
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
}

// 封装日志函数
const log = {
  error: (tag, message, data) => {
    console.error(`[${LOG_LEVELS.ERROR}] ${tag}:`, message, data)
  },
  warn: (tag, message, data) => {
    console.warn(`[${LOG_LEVELS.WARN}] ${tag}:`, message, data)
  },
  info: (tag, message, data) => {
    console.log(`[${LOG_LEVELS.INFO}] ${tag}:`, message, data)
  },
  debug: (tag, message, data) => {
    // 生产环境不输出debug日志
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${LOG_LEVELS.DEBUG}] ${tag}:`, message, data)
    }
  }
}

// 使用
Page({
  loadData() {
    log.info('首页', '开始加载数据')

    wx.request({
      url: 'https://api.example.com/data',
      success: (res) => {
        log.info('首页', '数据获取成功', res.data)
      },
      fail: (err) => {
        log.error('首页', '数据获取失败', err)
      }
    })
  }
})
```

### 7.2 错误监控

```javascript
// app.js
App({
  onError(error) {
    console.error('全局错误：', error)
    // 可以上报错误信息到服务器
    this.reportError(error)
  },

  reportError(error) {
    wx.request({
      url: 'https://api.example.com/error',
      method: 'POST',
      data: {
        error: error.toString(),
        stack: error.stack,
        page: getCurrentPages().pop().route,
        time: new Date().toISOString()
      }
    })
  }
})
```

### 7.3 性能监控

```javascript
Page({
  onLoad() {
    // 监控页面加载性能
    const startTime = Date.now()

    this.onReady(() => {
      const endTime = Date.now()
      const loadTime = endTime - startTime
      console.log(`页面加载耗时：${loadTime}ms`)

      // 上报性能数据
      this.reportPerformance({
        type: 'page_load',
        time: loadTime,
        page: this.route
      })
    })
  },

  reportPerformance(data) {
    wx.request({
      url: 'https://api.example.com/performance',
      method: 'POST',
      data: data
    })
  }
})
```

---

## 八、调试技巧总结

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| F8 | 继续执行 |
| F10 | 单步跳过 |
| F11 | 单步进入 |
| Shift+F11 | 单步跳出 |
| Ctrl+Shift+I | 打开开发者工具 |

### 常用调试命令

```javascript
// 查看当前页面
console.log(getCurrentPages())

// 查看页面数据
console.log(this.data)

// 查看全局App实例
console.log(getApp())

// 手动触发setData
const page = getCurrentPages().pop()
page.setData({ title: '新标题' })

// 清空Storage
wx.clearStorageSync()

// 重新加载页面
wx.reLaunch({
  url: '/pages/index/index'
})
```

### 调试检查清单

- [ ] Console中没有错误
- [ ] Network请求正常
- [ ] Storage数据正确
- [ ] AppData数据更新正常
- [ ] 页面渲染正常
- [ ] 事件触发正常
- [ ] 样式显示正常
- [ ] 性能符合要求
- [ ] 真机测试正常
- [ ] 不同设备兼容性正常

---

**祝您调试顺利！🔧**
