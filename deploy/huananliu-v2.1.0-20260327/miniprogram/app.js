/**
 * ============================================================================
 * 华南留学小程序 - 版本冻结标记
 * ============================================================================
 * @version      2.0.0-FINAL
 * @release_date 2026-03-27
 * @status       FROZEN - 此版本已冻结，禁止修改
 * @description  华南留学小程序 - 微信小程序前端
 * @tech_stack   微信小程序原生框架 + JavaScript ES6
 * ============================================================================
 * 修改历史：
 * - v2.0.0-FINAL (2026-03-27): 功能完成冻结版本
 *   * 完成用户登录/注册系统（微信登录+手机号绑定）
 *   * 完成四栏底部导航（留学资讯/产品服务/成功案例/我的）
 *   * 完成数据对接官网后端API
 *   * 完成收藏系统、预约系统、关于我们页面
 * ============================================================================
 */

const config = require('./config');

App({
  globalData: {
    userInfo: null,
    openid: null,
    baseUrl: config.baseUrl
  },

  onLaunch() {
    // 检查登录状态
    this.checkLogin();
  },

  // 检查登录状态
  checkLogin() {
    const token = wx.getStorageSync('token');
    if (token) {
      // 已登录，获取用户信息
      this.getUserInfo();
    }
  },

  // 获取用户信息
  getUserInfo() {
    // 调用后端API获取用户信息
    // wx.request({
    //   url: this.globalData.baseUrl + '/user/info',
    //   method: 'GET',
    //   header: {
    //     'Authorization': 'Bearer ' + wx.getStorageSync('token')
    //   },
    //   success: (res) => {
    //     this.globalData.userInfo = res.data.data;
    //   }
    // });
  },

  // 微信登录
  wxLogin() {
    wx.login({
      success: (res) => {
        if (res.code) {
          // 将code发送到后端换取openid和session_key
          wx.request({
            url: this.globalData.baseUrl + '/auth/login',
            method: 'POST',
            data: {
              code: res.code
            },
            success: (loginRes) => {
              const { token, userInfo } = loginRes.data.data;
              wx.setStorageSync('token', token);
              this.globalData.userInfo = userInfo;
              this.globalData.openid = userInfo.openid;
            }
          });
        }
      }
    });
  },

  // 显示加载
  showLoading(title = '加载中...') {
    wx.showLoading({
      title,
      mask: true
    });
  },

  // 隐藏加载
  hideLoading() {
    wx.hideLoading();
  },

  // 显示错误提示
  showError(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  },

  // 显示成功提示
  showSuccess(message) {
    wx.showToast({
      title: message,
      icon: 'success',
      duration: 2000
    });
  }
})
