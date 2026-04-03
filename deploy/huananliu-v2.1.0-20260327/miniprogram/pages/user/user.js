const api = require('../../utils/api');

Page({
  data: {
    userInfo: null,
    isLoggedIn: false,
    isLogging: false,
    stats: {
      favorites: 0,
      appointments: 0,
      consults: 0
    },
    menuList: [
      { icon: '/images/icons/appointment.png', name: '我的预约', path: 'appointments' },
      { icon: '/images/icons/favorite.png', name: '我的收藏', path: 'favorites' },
      { icon: '/images/icons/history.png', name: '浏览历史', path: 'history' },
      { icon: '/images/icons/contact.png', name: '联系客服', action: 'contact' },
      { icon: '/images/icons/about.png', name: '关于我们', path: 'about' }
    ]
  },

  onShow() {
    this.checkLoginStatus();
  },

  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token && userInfo) {
      this.setData({ 
        isLoggedIn: true,
        userInfo: userInfo
      });
      this.loadUserStats();
    } else {
      this.setData({ 
        isLoggedIn: false,
        userInfo: null
      });
    }
  },

  async loadUserInfo() {
    try {
      const res = await api.getUserInfo();
      const userInfo = res.data;
      wx.setStorageSync('userInfo', userInfo);
      this.setData({ userInfo });
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  },

  async loadUserStats() {
    try {
      const res = await api.getMyAppointments();
      const appointments = res.data || [];
      this.setData({ 'stats.appointments': appointments.length });
      
      // 获取收藏数量
      const favorites = wx.getStorageSync('favorites') || [];
      this.setData({ 'stats.favorites': favorites.length });
    } catch (error) {
      console.error('加载统计失败:', error);
    }
  },

  // 点击登录按钮
  handleLogin() {
    if (this.data.isLogging) return;
    
    this.setData({ isLogging: true });
    
    wx.login({
      success: (res) => {
        if (res.code) {
          // 先尝试获取用户信息
          wx.getUserProfile({
            desc: '用于完善用户资料',
            success: (userRes) => {
              const userInfo = userRes.userInfo;
              // 登录并传递用户信息
              this.doLogin(res.code, userInfo);
            },
            fail: () => {
              // 用户拒绝授权，仍然可以登录，只是没有头像昵称
              this.doLogin(res.code, null);
            }
          });
        } else {
          wx.showToast({ title: '登录失败', icon: 'none' });
          this.setData({ isLogging: false });
        }
      },
      fail: () => {
        wx.showToast({ title: '登录失败', icon: 'none' });
        this.setData({ isLogging: false });
      }
    });
  },

  // 执行登录
  async doLogin(code, userInfo) {
    try {
      const res = await api.wxLogin(code, userInfo);
      const { token, data: serverUserInfo } = res.data;
      
      // 保存登录信息
      wx.setStorageSync('token', token);
      wx.setStorageSync('userInfo', serverUserInfo);
      
      this.setData({ 
        isLoggedIn: true, 
        userInfo: serverUserInfo,
        isLogging: false
      });
      
      this.loadUserStats();
      
      // 提示绑定手机号（如果还没有）
      if (!serverUserInfo.hasPhone) {
        wx.showModal({
          title: '提示',
          content: '建议您绑定手机号，方便顾问联系您',
          confirmText: '去绑定',
          cancelText: '暂不',
          success: (modalRes) => {
            if (modalRes.confirm) {
              // 引导用户点击绑定手机号按钮
            }
          }
        });
      }
      
      wx.showToast({ title: '登录成功', icon: 'success' });
    } catch (err) {
      wx.showToast({ title: err.message || '登录失败', icon: 'none' });
      this.setData({ isLogging: false });
    }
  },

  // 获取手机号
  async getPhoneNumber(e) {
    if (!this.data.isLoggedIn) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      const { encryptedData, iv } = e.detail;
      
      // 重新获取code（getPhoneNumber后需要新的code）
      wx.login({
        success: async (res) => {
          if (res.code) {
            try {
              const result = await api.decryptPhone(res.code, encryptedData, iv);
              const phone = result.data.phone;
              
              // 更新本地存储的用户信息
              const userInfo = wx.getStorageSync('userInfo') || {};
              userInfo.phone = phone;
              userInfo.hasPhone = true;
              wx.setStorageSync('userInfo', userInfo);
              
              this.setData({ userInfo });
              
              wx.showToast({ title: '绑定成功', icon: 'success' });
            } catch (err) {
              wx.showToast({ title: err.message || '绑定失败', icon: 'none' });
            }
          }
        }
      });
    } else {
      wx.showToast({ title: '您拒绝了授权', icon: 'none' });
    }
  },

  // 菜单点击处理
  handleMenuClick(e) {
    const { path, action } = e.currentTarget.dataset;
    
    if (action === 'contact') {
      this.contactService();
      return;
    }
    
    if (!this.data.isLoggedIn && path !== 'about') {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    
    switch (path) {
      case 'favorites':
        wx.navigateTo({ url: '/pages/user/favorites/favorites' });
        break;
      case 'appointments':
        wx.navigateTo({ url: '/pages/appointment/my-appointments' });
        break;
      case 'history':
        wx.showToast({ title: '功能开发中', icon: 'none' });
        break;
      case 'about':
        wx.navigateTo({ url: '/pages/about/about' });
        break;
    }
  },

  goToFavorites() {
    if (!this.data.isLoggedIn) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: '/pages/user/favorites/favorites' });
  },

  goToAppointments() {
    if (!this.data.isLoggedIn) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: '/pages/appointment/my-appointments' });
  },

  goToHistory() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  goToAbout() {
    wx.navigateTo({ url: '/pages/about/about' });
  },

  contactService() {
    wx.makePhoneCall({ 
      phoneNumber: '400-888-8888',
      fail: () => {
        wx.showToast({ title: '拨打失败', icon: 'none' });
      }
    });
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          this.setData({ 
            isLoggedIn: false, 
            userInfo: null, 
            stats: { favorites: 0, appointments: 0, consults: 0 } 
          });
          wx.showToast({ title: '已退出登录', icon: 'success' });
        }
      }
    });
  }
});
