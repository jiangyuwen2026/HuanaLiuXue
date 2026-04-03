/**
 * 自动化测试运行器
 * 用于执行小程序的功能测试
 */

const performance = require('./performance.js')

class TestRunner {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      tests: []
    }
    this.suites = []
  }

  /**
   * 添加测试套件
   */
  describe(name, fn) {
    const suite = {
      name,
      tests: [],
      beforeAll: null,
      afterAll: null,
      beforeEach: null,
      afterEach: null
    }
    this.currentSuite = suite
    fn()
    this.suites.push(suite)
  }

  /**
   * 添加测试用例
   */
  it(name, fn) {
    const test = {
      name,
      fn,
      status: 'pending',
      duration: 0,
      error: null
    }
    this.currentSuite.tests.push(test)
  }

  /**
   * 运行所有测试
   */
  async run() {
    console.log('\n🧪 ========== 开始测试 ==========\n')

    const startTime = Date.now()

    for (const suite of this.suites) {
      await this.runSuite(suite)
    }

    const duration = Date.now() - startTime
    this.printReport(duration)

    return this.results
  }

  /**
   * 运行测试套件
   */
  async runSuite(suite) {
    console.log(`📦 ${suite.name}`)
    console.log('─'.repeat(50))

    // 执行beforeAll
    if (suite.beforeAll) {
      await suite.beforeAll()
    }

    // 执行所有测试
    for (const test of suite.tests) {
      await this.runTest(suite, test)
    }

    // 执行afterAll
    if (suite.afterAll) {
      await suite.afterAll()
    }

    console.log('')
  }

  /**
   * 运行单个测试
   */
  async runTest(suite, test) {
    // 执行beforeEach
    if (suite.beforeEach) {
      await suite.beforeEach()
    }

    // 执行测试
    const testStartTime = Date.now()
    test.status = 'running'

    try {
      await test.fn()
      test.status = 'passed'
      test.duration = Date.now() - testStartTime
      console.log(`  ✅ ${test.name} (${test.duration}ms)`)

      this.results.passed++
    } catch (error) {
      test.status = 'failed'
      test.duration = Date.now() - testStartTime
      test.error = error.message

      console.log(`  ❌ ${test.name} (${test.duration}ms)`)
      console.log(`     错误：${error.message}`)

      this.results.failed++
    }

    this.results.total++

    // 执行afterEach
    if (suite.afterEach) {
      await suite.afterEach()
    }
  }

  /**
   * 打印测试报告
   */
  printReport(duration) {
    console.log('\n' + '='.repeat(50))
    console.log('📊 测试报告')
    console.log('='.repeat(50))
    console.log(`总测试数：${this.results.total}`)
    console.log(`通过：${this.results.passed}`)
    console.log(`失败：${this.results.failed}`)
    console.log(`通过率：${this.getPassRate()}%`)
    console.log(`总耗时：${duration}ms`)
    console.log('='.repeat(50))

    if (this.results.failed > 0) {
      console.log('\n❌ 失败的测试：')
      for (const suite of this.suites) {
        for (const test of suite.tests) {
          if (test.status === 'failed') {
            console.log(`  - ${suite.name} > ${test.name}`)
            console.log(`    错误：${test.error}`)
          }
        }
      }
    }
  }

  /**
   * 获取通过率
   */
  getPassRate() {
    if (this.results.total === 0) return 0
    return ((this.results.passed / this.results.total) * 100).toFixed(2)
  }

  /**
   * 断言工具
   */
  expect(actual) {
    return {
      toBe(expected) {
        if (actual !== expected) {
          throw new Error(`期望 ${expected}，实际得到 ${actual}`)
        }
      },
      toEqual(expected) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(`期望 ${JSON.stringify(expected)}，实际得到 ${JSON.stringify(actual)}`)
        }
      },
      toBeTruthy() {
        if (!actual) {
          throw new Error(`期望为真，实际得到 ${actual}`)
        }
      },
      toBeFalsy() {
        if (actual) {
          throw new Error(`期望为假，实际得到 ${actual}`)
        }
      },
      toContain(item) {
        if (!Array.isArray(actual)) {
          throw new Error('期望是数组')
        }
        if (!actual.includes(item)) {
          throw new Error(`期望包含 ${item}`)
        }
      },
      toBeNull() {
        if (actual !== null) {
          throw new Error(`期望为null，实际得到 ${actual}`)
        }
      },
      toBeUndefined() {
        if (actual !== undefined) {
          throw new Error(`期望为undefined，实际得到 ${actual}`)
        }
      },
      toBeGreaterThan(expected) {
        if (actual <= expected) {
          throw new Error(`期望大于 ${expected}，实际得到 ${actual}`)
        }
      },
      toBeLessThan(expected) {
        if (actual >= expected) {
          throw new Error(`期望小于 ${expected}，实际得到 ${actual}`)
        }
      }
    }
  }
}

/**
 * 创建测试运行器实例
 */
const runner = new TestRunner()

/**
 * 快捷方法
 */
const describe = (name, fn) => runner.describe(name, fn)
const it = (name, fn) => runner.it(name, fn)
const expect = (actual) => runner.expect(actual)

/**
 * 测试示例
 */
describe('API测试', () => {
  it('应该成功获取资讯列表', async () => {
    const api = require('./api.js')
    const result = await api.getNewsList({ page: 1, pageSize: 10 })
    expect(result).toBeTruthy()
    expect(result.data).toBeTruthy()
    expect(result.data.list).toBeTruthy()
    expect(result.data.list.length).toBeGreaterThan(0)
  })

  it('应该成功获取学校列表', async () => {
    const api = require('./api.js')
    const result = await api.getSchoolList({ page: 1, pageSize: 10 })
    expect(result).toBeTruthy()
    expect(result.data).toBeTruthy()
    expect(result.data.list).toBeTruthy()
  })

  it('应该成功获取专业列表', async () => {
    const api = require('./api.js')
    const result = await api.getMajorList({ page: 1, pageSize: 10 })
    expect(result).toBeTruthy()
    expect(result.data).toBeTruthy()
    expect(result.data.list).toBeTruthy()
  })
})

describe('规则引擎测试', () => {
  it('应该成功匹配学校相关问题', () => {
    const ruleEngine = require('./ruleEngine.js')
    const result = ruleEngine.match('香港大学怎么样？')
    expect(result).toBeTruthy()
    expect(result.content).toContain('香港大学')
  })

  it('应该成功匹配费用相关问题', () => {
    const ruleEngine = require('./ruleEngine.js')
    const result = ruleEngine.match('留学费用多少？')
    expect(result).toBeTruthy()
    expect(result.content).toContain('费用')
  })

  it('应该成功匹配申请流程问题', () => {
    const ruleEngine = require('./ruleEngine.js')
    const result = ruleEngine.match('申请流程是什么？')
    expect(result).toBeTruthy()
    expect(result.content).toContain('申请')
  })
})

describe('性能测试', () => {
  it('首页加载应该小于2秒', async () => {
    const loadTime = await performance.measureAsync('首页加载', async () => {
      // 模拟首页加载
      await new Promise(resolve => setTimeout(resolve, 1500))
    })
    expect(loadTime).toBeLessThan(2000)
  })

  it('API响应应该小于1秒', async () => {
    const responseTime = await performance.measureAsync('API响应', async () => {
      const api = require('./api.js')
      await api.getNewsList({ page: 1, pageSize: 10 })
    })
    expect(responseTime).toBeLessThan(1000)
  })
})

/**
 * 运行所有测试
 */
async function runAllTests() {
  return await runner.run()
}

module.exports = {
  runner,
  describe,
  it,
  expect,
  runAllTests
}
