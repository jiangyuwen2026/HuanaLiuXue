/**
 * 性能监控工具
 * 用于监控小程序的性能指标
 */

const app = getApp()

const performance = {
  // 性能指标
  metrics: {
    pageLoadTime: {},      // 页面加载时间
    apiResponseTime: {},   // API响应时间
    renderTime: {},        // 渲染时间
    memoryUsage: []        // 内存使用
  },

  // 开始计时
  startMeasure(name) {
    this.metrics[name] = {
      startTime: Date.now(),
      page: getCurrentPages().pop()?.route
    }
    console.log(`📊 [性能] 开始测量：${name}`)
  },

  // 结束计时
  endMeasure(name) {
    if (!this.metrics[name]) {
      console.warn(`⚠️ [性能] 未找到测量：${name}`)
      return null
    }

    const duration = Date.now() - this.metrics[name].startTime
    const page = this.metrics[name].page

    console.log(`✅ [性能] 测量完成：${name} - ${duration}ms`)

    // 记录到性能数据
    this.recordMetric(name, duration, page)

    // 清理
    delete this.metrics[name]

    return duration
  },

  // 异步测量
  async measureAsync(name, fn) {
    this.startMeasure(name)
    try {
      const result = await fn()
      this.endMeasure(name)
      return result
    } catch (error) {
      this.endMeasure(name)
      throw error
    }
  },

  // 记录性能指标
  recordMetric(name, duration, page) {
    const metric = {
      name,
      duration,
      page,
      timestamp: Date.now()
    }

    // 根据类型分类存储
    if (name.startsWith('page_')) {
      this.metrics.pageLoadTime[name] = metric
    } else if (name.startsWith('api_')) {
      this.metrics.apiResponseTime[name] = metric
    } else if (name.startsWith('render_')) {
      this.metrics.renderTime[name] = metric
    }

    // 上报到服务器（生产环境）
    if (!app.globalData.debug) {
      this.reportMetric(metric)
    }
  },

  // 上报性能指标
  reportMetric(metric) {
    wx.request({
      url: app.globalData.baseUrl + '/monitor/performance',
      method: 'POST',
      data: metric,
      fail: (err) => {
        console.error('[性能] 指标上报失败：', err)
      }
    })
  },

  // 获取性能报告
  getReport() {
    const report = {
      pageLoad: this.calculateAvg(this.metrics.pageLoadTime),
      apiResponse: this.calculateAvg(this.metrics.apiResponseTime),
      renderTime: this.calculateAvg(this.metrics.renderTime),
      memoryUsage: this.getMemoryUsage()
    }

    console.log('📊 [性能报告]', report)
    return report
  },

  // 计算平均值
  calculateAvg(metrics) {
    const values = Object.values(metrics).map(m => m.duration)
    if (values.length === 0) return null

    const sum = values.reduce((a, b) => a + b, 0)
    const avg = Math.round(sum / values.length)
    const max = Math.max(...values)
    const min = Math.min(...values)

    return {
      count: values.length,
      avg,
      max,
      min
    }
  },

  // 获取内存使用
  getMemoryUsage() {
    // 微信小程序暂不支持获取内存使用
    // 这里使用模拟数据
    return {
      used: 50,
      total: 100,
      percentage: 50
    }
  },

  // 清除性能数据
  clear() {
    this.metrics = {
      pageLoadTime: {},
      apiResponseTime: {},
      renderTime: {},
      memoryUsage: []
    }
    console.log('🧹 [性能] 性能数据已清除')
  }
}

/**
 * 使用示例
 */
// 1. 页面加载性能
Page({
  onLoad() {
    performance.startMeasure('page_index_load')
    // ... 加载数据
    performance.endMeasure('page_index_load')
  }
})

// 2. API请求性能
const api = require('./api.js')

async function fetchData() {
  return performance.measureAsync('api_news_list', async () => {
    return await api.getNewsList()
  })
}

// 3. 获取性能报告
function getPerformanceReport() {
  const report = performance.getReport()
  console.log('性能报告：', report)
}

module.exports = performance
