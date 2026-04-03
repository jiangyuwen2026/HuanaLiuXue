// app.js
// API基础地址配置
const API_BASE_URL = 'http://localhost:3001/api';  // 开发环境
// const API_BASE_URL = 'https://api.huananliuxue.com/api';  // 生产环境

App({
  globalData: {
    userInfo: null,
    openid: null,
    baseUrl: API_BASE_URL
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
