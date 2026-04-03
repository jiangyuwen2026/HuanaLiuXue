// utils/api.js
const app = getApp()

/**
 * API基础请求函数
 */
const request = (url, method = 'GET', data = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.baseUrl + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          // token过期，重新登录
          wx.removeStorageSync('token')
          wx.removeStorageSync('openid')
          app.globalData.userInfo = null
          wx.showModal({
            title: '提示',
            content: '登录已过期，请重新登录',
            showCancel: false
          })
          reject(res)
        } else {
          reject(res)
        }
      },
      fail: reject
    })
  })
}

/**
 * GET请求
 */
const get = (url, data = {}) => {
  return request(url, 'GET', data)
}

/**
 * POST请求
 */
const post = (url, data = {}) => {
  return request(url, 'POST', data)
}

/**
 * PUT请求
 */
const put = (url, data = {}) => {
  return request(url, 'PUT', data)
}

/**
 * DELETE请求
 */
const del = (url, data = {}) => {
  return request(url, 'DELETE', data)
}

// ==================== 用户相关 ====================

/**
 * 微信登录
 */
const wxLogin = (code) => {
  return post('/auth/login', { code })
}

/**
 * 获取用户信息
 */
const getUserInfo = () => {
  return get('/user/info')
}

/**
 * 更新用户信息
 */
const updateUserInfo = (data) => {
  return put('/user/info', data)
}

/**
 * 获取用户统计数据
 */
const getUserStats = () => {
  return get('/user/stats')
}

// ==================== 资讯相关 ====================

/**
 * 获取资讯列表
 */
const getNewsList = (params) => {
  return get('/news/list', params)
}

/**
 * 获取资讯详情
 */
const getNewsDetail = (id) => {
  return get('/news/detail', { id })
}

/**
 * 收藏资讯
 */
const collectNews = (id) => {
  return post('/news/collect', { id })
}

/**
 * 取消收藏资讯
 */
const uncollectNews = (id) => {
  return post('/news/uncollect', { id })
}

// ==================== 学校相关 ====================

/**
 * 获取学校列表
 */
const getSchoolList = (params) => {
  return get('/school/list', params)
}

/**
 * 获取学校详情
 */
const getSchoolDetail = (id) => {
  return get('/school/detail', { id })
}

/**
 * 收藏学校
 */
const collectSchool = (id) => {
  return post('/school/collect', { id })
}

/**
 * 取消收藏学校
 */
const uncollectSchool = (id) => {
  return post('/school/uncollect', { id })
}

// ==================== 专业相关 ====================

/**
 * 获取专业列表
 */
const getMajorList = (params) => {
  return get('/major/list', params)
}

/**
 * 获取专业详情
 */
const getMajorDetail = (id) => {
  return get('/major/detail', { id })
}

/**
 * 收藏专业
 */
const collectMajor = (id) => {
  return post('/major/collect', { id })
}

/**
 * 取消收藏专业
 */
const uncollectMajor = (id) => {
  return post('/major/uncollect', { id })
}

// ==================== 顾问相关 ====================

/**
 * 获取顾问列表
 */
const getConsultantList = (params) => {
  return get('/consultant/list', params)
}

/**
 * 获取顾问详情
 */
const getConsultantDetail = (id) => {
  return get('/consultant/detail', { id })
}

// ==================== 预约相关 ====================

/**
 * 创建预约
 */
const createAppointment = (data) => {
  return post('/appointment/create', data)
}

/**
 * 获取我的预约列表
 */
const getMyAppointments = () => {
  return get('/appointment/my')
}

/**
 * 取消预约
 */
const cancelAppointment = (id) => {
  return post('/appointment/cancel', { id })
}

// ==================== 案例相关 ====================

/**
 * 获取案例列表
 */
const getCaseList = (params) => {
  return get('/case/list', params)
}

/**
 * 获取案例详情
 */
const getCaseDetail = (id) => {
  return get('/case/detail', { id })
}

module.exports = {
  request,
  get,
  post,
  put,
  del,
  wxLogin,
  getUserInfo,
  updateUserInfo,
  getUserStats,
  getNewsList,
  getNewsDetail,
  collectNews,
  uncollectNews,
  getSchoolList,
  getSchoolDetail,
  collectSchool,
  uncollectSchool,
  getMajorList,
  getMajorDetail,
  collectMajor,
  uncollectMajor,
  getConsultantList,
  getConsultantDetail,
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  getCaseList,
  getCaseDetail
}
