/**
 * 华南留学小程序 - 环境配置文件
 * 复制此文件为 config.js 并根据实际情况修改
 */

/**
 * 环境配置
 */
const ENV = process.env.NODE_ENV || 'development'

/**
 * 基础配置
 */
const BASE_CONFIG = {
  // 小程序AppID
  appId: 'wx7882270d386b1f0b',
  
  // 小程序名称
  appName: '华南留学',
  
  // 版本号
  version: '1.0.0',
  
  // 环境
  env: ENV
}

/**
 * 开发环境配置
 */
const DEVELOPMENT_CONFIG = {
  // API基础地址
  baseUrl: 'https://dev-api.huananliuxue.com/api',
  
  // AI服务配置
  aiBaseUrl: 'https://dev-aichat.tencentyun.com/v1',
  aiSecretId: '',
  aiSecretKey: '',
  aiRegion: 'ap-guangzhou',
  aiModel: 'hunyuan-lite',
  
  // 是否开启调试模式
  debug: true,
  
  // 是否使用Mock数据
  useMock: true,
  
  // 日志级别：debug, info, warn, error
  logLevel: 'debug'
}

/**
 * 预发布环境配置
 */
const STAGING_CONFIG = {
  baseUrl: 'https://staging-api.huananliuxue.com/api',
  
  aiBaseUrl: 'https://staging-aichat.tencentyun.com/v1',
  aiSecretId: '',
  aiSecretKey: '',
  aiRegion: 'ap-guangzhou',
  aiModel: 'hunyuan-lite',
  
  debug: false,
  useMock: false,
  logLevel: 'info'
}

/**
 * 生产环境配置
 */
const PRODUCTION_CONFIG = {
  baseUrl: 'https://api.huananliuxue.com/api',
  
  aiBaseUrl: 'https://aichat.tencentyun.com/v1',
  aiSecretId: '',
  aiSecretKey: '',
  aiRegion: 'ap-guangzhou',
  aiModel: 'hunyuan-lite',
  
  debug: false,
  useMock: false,
  logLevel: 'warn'
}

/**
 * 环境映射
 */
const ENV_CONFIG = {
  development: DEVELOPMENT_CONFIG,
  staging: STAGING_CONFIG,
  production: PRODUCTION_CONFIG
}

/**
 * 获取当前环境配置
 */
const getConfig = () => {
  return {
    ...BASE_CONFIG,
    ...ENV_CONFIG[ENV]
  }
}

/**
 * 导出配置
 */
module.exports = {
  getConfig,
  ENV,
  BASE_CONFIG,
  DEVELOPMENT_CONFIG,
  STAGING_CONFIG,
  PRODUCTION_CONFIG
}
