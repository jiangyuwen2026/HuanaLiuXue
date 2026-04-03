/**
 * ============================================================================
 * 华南留学小程序 - API封装 v2.0
 * 说明: 对接官网后端API，与官网/后台共享数据源
 * ============================================================================
 */

const app = getApp();
const config = require('../config');

/**
 * 基础请求函数
 */
const request = (url, method = 'GET', data = {}) => {
  return new Promise((resolve, reject) => {
    // 显示加载提示
    if (method !== 'GET') {
      wx.showLoading({ title: '加载中...', mask: true });
    }
    
    // 获取openid用于认证
    const userInfo = wx.getStorageSync('userInfo') || {};
    
    wx.request({
      url: config.baseUrl + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token'),
        'X-Openid': userInfo.openid || ''
      },
      success: (res) => {
        wx.hideLoading();
        
        if (res.statusCode === 200 && res.data.success) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // Token过期，清除登录状态
          wx.removeStorageSync('token');
          app.globalData.userInfo = null;
          wx.showModal({
            title: '提示',
            content: '登录已过期，请重新登录',
            showCancel: false
          });
          reject(res.data);
        } else {
          wx.showToast({
            title: res.data.message || '请求失败',
            icon: 'none'
          });
          reject(res.data);
        }
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，请检查网络',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};

const get = (url, data = {}) => request(url, 'GET', data);
const post = (url, data = {}) => request(url, 'POST', data);
const put = (url, data = {}) => request(url, 'PUT', data);
const del = (url, data = {}) => request(url, 'DELETE', data);

// ============================================================================
// 首页数据 API
// ============================================================================

/**
 * 获取轮播图列表
 * 数据来源: 后台管理 - Banner管理
 */
const getBanners = () => get('/banners');

/**
 * 获取明星案例列表
 * 数据来源: 后台管理 - 案例管理 - 设为明星案例
 */
const getFeaturedCases = () => get('/cases/featured/list');

/**
 * 获取热门学校列表
 * 数据来源: 后台管理 - 学校管理 - 热门学校设置
 */
const getHotSchools = () => get('/schools/hot/list');

/**
 * 获取推荐资讯列表
 * 数据来源: 后台管理 - 新闻管理 - 推荐到首页
 */
const getRecommendedNews = (limit = 6) => get('/news/recommended/list', { limit });

// ============================================================================
// 学校相关 API
// ============================================================================

/**
 * 获取学校列表
 * @param {Object} params - { country, page, limit }
 */
const getSchoolList = (params = {}) => get('/schools', params);

/**
 * 获取学校详情
 * @param {number} id - 学校ID
 */
const getSchoolDetail = (id) => get(`/schools/${id}`);

/**
 * 获取国家选项
 */
const getCountryOptions = () => get('/schools/options/countries');

// ============================================================================
// 案例相关 API
// ============================================================================

/**
 * 获取案例列表
 * @param {Object} params - { country, page, limit }
 */
const getCaseList = (params = {}) => get('/cases', params);

/**
 * 获取案例详情
 * @param {number} id - 案例ID
 */
const getCaseDetail = (id) => get(`/cases/${id}`);

// ============================================================================
// 顾问相关 API
// ============================================================================

/**
 * 获取顾问列表
 * @param {Object} params - { service_type, region, page, limit }
 */
const getConsultantList = (params = {}) => get('/consultants', params);

/**
 * 获取顾问详情
 * @param {number} id - 顾问ID
 */
const getConsultantDetail = (id) => get(`/consultants/${id}`);

/**
 * 获取热门顾问
 */
const getHotConsultants = () => get('/consultants/hot/list');

// ============================================================================
// 资讯相关 API
// ============================================================================

/**
 * 获取资讯列表
 * @param {Object} params - { category, page, limit }
 */
const getNewsList = (params = {}) => get('/news', params);

/**
 * 获取资讯详情
 * @param {number} id - 资讯ID
 */
const getNewsDetail = (id) => get(`/news/${id}`);

/**
 * 获取资讯分类
 */
const getNewsCategories = () => get('/news/options/categories');

// ============================================================================
// 服务相关 API
// ============================================================================

/**
 * 获取服务列表
 */
const getServiceList = () => get('/services');

/**
 * 获取服务详情
 * @param {number} id - 服务ID
 */
const getServiceDetail = (id) => get(`/services/${id}`);

// ============================================================================
// 预约/咨询相关 API
// ============================================================================

/**
 * 创建预约/咨询
 * @param {Object} data - 预约表单数据
 */
const createAppointment = (data) => post('/appointments', data);

/**
 * 获取我的预约列表
 */
const getMyAppointments = () => get('/appointments/my');

/**
 * 取消预约
 * @param {number} id - 预约ID
 */
const cancelAppointment = (id) => put(`/appointments/${id}/cancel`);

// ============================================================================
// 用户相关 API
// ============================================================================

/**
 * 微信登录
 * @param {string} code - 微信登录code
 * @param {Object} userInfo - 用户信息
 */
const wxLogin = (code, userInfo) => post('/auth/wx-login', { code, userInfo });

/**
 * 解密手机号
 * @param {string} code - 微信登录code
 * @param {string} encryptedData - 加密数据
 * @param {string} iv - 加密向量
 */
const decryptPhone = (code, encryptedData, iv) => post('/auth/decrypt-phone', { code, encryptedData, iv });

/**
 * 获取用户信息
 */
const getUserInfo = () => get('/auth/user-info');

/**
 * 更新用户信息
 */
const updateUserInfo = (data) => put('/auth/user-info', data);

// ============================================================================
// 导出
// ============================================================================

module.exports = {
  // 基础请求
  request,
  get,
  post,
  put,
  del,
  
  // 首页
  getBanners,
  getFeaturedCases,
  getHotSchools,
  getRecommendedNews,
  
  // 学校
  getSchoolList,
  getSchoolDetail,
  getCountryOptions,
  
  // 案例
  getCaseList,
  getCaseDetail,
  
  // 顾问
  getConsultantList,
  getConsultantDetail,
  getHotConsultants,
  
  // 资讯
  getNewsList,
  getNewsDetail,
  getNewsCategories,
  
  // 服务
  getServiceList,
  getServiceDetail,
  
  // 预约
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  
  // 用户
  wxLogin,
  decryptPhone,
  getUserInfo,
  updateUserInfo
};
