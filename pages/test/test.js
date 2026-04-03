/**
 * 测试页面
 * 用于运行小程序的自动化测试
 */

const testRunner = require('../../utils/testRunner.js')

Page({
  data: {
    testResults: null,
    isRunning: false,
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      passRate: 0
    }
  },

  onLoad() {
    console.log('测试页面加载')
  },

  // 运行所有测试
  async runAllTests() {
    this.setData({ isRunning: true, testResults: null })

    wx.showLoading({ title: '测试运行中...', mask: true })

    try {
      const results = await testRunner.runAllTests()

      this.setData({
        testResults: results.tests,
        isRunning: false,
        summary: {
          total: results.total,
          passed: results.passed,
          failed: results.failed,
          passRate: results.passed / results.total * 100
        }
      })

      wx.hideLoading()

      // 显示结果
      const passRate = results.passed / results.total
      if (passRate >= 0.9) {
        wx.showModal({
          title: '测试完成',
          content: `✅ 通过率：${(passRate * 100).toFixed(2)}%`,
          showCancel: false
        })
      } else {
        wx.showModal({
          title: '测试完成',
          content: `⚠️ 通过率：${(passRate * 100).toFixed(2)}%，请查看详情`,
          showCancel: false
        })
      }

    } catch (error) {
      console.error('测试运行失败：', error)
      this.setData({ isRunning: false })
      wx.hideLoading()
      wx.showToast({
        title: '测试运行失败',
        icon: 'none'
      })
    }
  },

  // 运行API测试
  async runAPITests() {
    wx.showLoading({ title: 'API测试中...', mask: true })

    try {
      const api = require('../../utils/api.js')
      const results = []

      // 测试资讯API
      try {
        await api.getNewsList({ page: 1, pageSize: 10 })
        results.push({ name: '资讯列表', status: 'passed' })
        console.log('✅ 资讯列表API测试通过')
      } catch (error) {
        results.push({ name: '资讯列表', status: 'failed', error: error.message })
        console.error('❌ 资讯列表API测试失败', error)
      }

      // 测试学校API
      try {
        await api.getSchoolList({ page: 1, pageSize: 10 })
        results.push({ name: '学校列表', status: 'passed' })
        console.log('✅ 学校列表API测试通过')
      } catch (error) {
        results.push({ name: '学校列表', status: 'failed', error: error.message })
        console.error('❌ 学校列表API测试失败', error)
      }

      // 测试专业API
      try {
        await api.getMajorList({ page: 1, pageSize: 10 })
        results.push({ name: '专业列表', status: 'passed' })
        console.log('✅ 专业列表API测试通过')
      } catch (error) {
        results.push({ name: '专业列表', status: 'failed', error: error.message })
        console.error('❌ 专业列表API测试失败', error)
      }

      wx.hideLoading()

      const passed = results.filter(r => r.status === 'passed').length
      const total = results.length
      const passRate = (passed / total * 100).toFixed(2)

      this.setData({
        testResults: results,
        summary: { total, passed, failed: total - passed, passRate }
      })

      wx.showModal({
        title: 'API测试完成',
        content: `通过：${passed}/${total} (${passRate}%)`,
        showCancel: false
      })

    } catch (error) {
      console.error('API测试失败：', error)
      wx.hideLoading()
      wx.showToast({
        title: 'API测试失败',
        icon: 'none'
      })
    }
  },

  // 运行规则引擎测试
  runRuleEngineTests() {
    wx.showLoading({ title: '规则引擎测试中...', mask: true })

    try {
      const ruleEngine = require('../../utils/ruleEngine.js')
      const testCases = [
        { question: '香港大学怎么样？', shouldMatch: true },
        { question: '新加坡留学费用多少？', shouldMatch: true },
        { question: '申请流程是什么？', shouldMatch: true },
        { question: '今天天气怎么样？', shouldMatch: false }
      ]

      const results = []

      testCases.forEach((testCase, index) => {
        const result = ruleEngine.match(testCase.question)
        const matched = !!result

        if (matched === testCase.shouldMatch) {
          results.push({
            name: `测试${index + 1}: ${testCase.question}`,
            status: 'passed'
          })
          console.log(`✅ 测试${index + 1}通过`)
        } else {
          results.push({
            name: `测试${index + 1}: ${testCase.question}`,
            status: 'failed',
            error: `期望${testCase.shouldMatch ? '匹配' : '不匹配'}，实际${matched ? '匹配' : '不匹配'}`
          })
          console.error(`❌ 测试${index + 1}失败`)
        }
      })

      wx.hideLoading()

      const passed = results.filter(r => r.status === 'passed').length
      const total = results.length
      const passRate = (passed / total * 100).toFixed(2)

      this.setData({
        testResults: results,
        summary: { total, passed, failed: total - passed, passRate }
      })

      wx.showModal({
        title: '规则引擎测试完成',
        content: `通过：${passed}/${total} (${passRate}%)`,
        showCancel: false
      })

    } catch (error) {
      console.error('规则引擎测试失败：', error)
      wx.hideLoading()
      wx.showToast({
        title: '测试失败',
        icon: 'none'
      })
    }
  },

  // 运行AI服务测试
  async runAITests() {
    wx.showLoading({ title: 'AI服务测试中...', mask: true })

    try {
      const aiService = require('../../utils/aiService.js')
      const results = []

      // 测试AI问答
      try {
        const startTime = Date.now()
        const result = await aiService.query('香港大学怎么样？')
        const duration = Date.now() - startTime

        if (result && result.content) {
          results.push({
            name: 'AI问答功能',
            status: 'passed',
            duration: `${duration}ms`
          })
          console.log('✅ AI问答测试通过，耗时：', duration, 'ms')
        } else {
          results.push({
            name: 'AI问答功能',
            status: 'failed',
            error: '返回内容为空'
          })
          console.error('❌ AI问答测试失败')
        }
      } catch (error) {
        results.push({
          name: 'AI问答功能',
          status: 'failed',
          error: error.message
        })
        console.error('❌ AI问答测试失败', error)
      }

      wx.hideLoading()

      const passed = results.filter(r => r.status === 'passed').length
      const total = results.length
      const passRate = total > 0 ? (passed / total * 100).toFixed(2) : 0

      this.setData({
        testResults: results,
        summary: { total, passed, failed: total - passed, passRate }
      })

      wx.showModal({
        title: 'AI服务测试完成',
        content: `通过：${passed}/${total} (${passRate}%)`,
        showCancel: false
      })

    } catch (error) {
      console.error('AI服务测试失败：', error)
      wx.hideLoading()
      wx.showToast({
        title: '测试失败',
        icon: 'none'
      })
    }
  },

  // 清除测试结果
  clearResults() {
    this.setData({
      testResults: null,
      summary: { total: 0, passed: 0, failed: 0, passRate: 0 }
    })
  },

  // 导出测试报告
  exportReport() {
    if (!this.data.testResults) {
      wx.showToast({
        title: '没有测试结果',
        icon: 'none'
      })
      return
    }

    const report = {
      summary: this.data.summary,
      tests: this.data.testResults,
      timestamp: new Date().toISOString()
    }

    console.log('测试报告：', JSON.stringify(report, null, 2))

    wx.showModal({
      title: '测试报告',
      content: '测试报告已输出到控制台',
      showCancel: false
    })
  }
})
