/**
 * ============================================================================
 * 华南留学小程序 - 配置文件 v2.0
 * 说明: 对接官网后端API
 * @status FROZEN - 此版本已冻结，禁止修改
 * @date 2026-03-27
 * ============================================================================
 */

// 环境配置
const ENV = 'development'; // development | production

// 基础配置
const BASE_CONFIG = {
  appId: 'wx7882270d386b1f0b',
  appName: '华南留学',
  version: '2.0.0',
  env: ENV
};

// 开发环境
const DEVELOPMENT_CONFIG = {
  // 后端API地址 - 对接官网后端
  baseUrl: 'http://localhost:3001/api',
  
  // 图片CDN前缀
  imageBaseUrl: 'http://localhost:3001/uploads',
  
  // 调试模式
  debug: true
};

// 生产环境
const PRODUCTION_CONFIG = {
  baseUrl: 'https://api.huananliuxue.com/api',
  imageBaseUrl: 'https://api.huananliuxue.com/uploads',
  debug: false
};

// 当前环境配置
const currentConfig = ENV === 'production' ? PRODUCTION_CONFIG : DEVELOPMENT_CONFIG;

module.exports = {
  ...BASE_CONFIG,
  ...currentConfig,
  ENV
};
