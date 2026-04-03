Page({
  data: {
    userInfo: null,
    isLoggedIn: false,
    menuList: [
      { icon: '📅', name: '我的预约', path: '/pages/appointment/my-appointments' },
      { icon: '⭐', name: '我的收藏', path: '/pages/user/favorites/favorites' },
      { icon: '📞', name: '联系客服', action: 'contact' },
      { icon: 'ℹ️', name: '关于我们', path: '/pages/about/about' }
    ]
  },

  onShow() {
    this.checkLogin();
  },

  checkLogin() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ isLoggedIn: true, userInfo });
    }
  },

  login() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const userInfo = res.userInfo;
        wx.setStorageSync('userInfo', userInfo);
        this.setData({ isLoggedIn: true, userInfo });
      }
    });
  },

  onMenuTap(e) {
    const { item } = e.currentTarget.dataset;
    
    if (item.action === 'contact') {
      wx.makePhoneCall({ phoneNumber: '400-888-8888' });
    } else if (item.action === 'about') {
      wx.showModal({
        title: '关于华南留学',
        content: '华南留学是一家专业的留学咨询机构，专注于香港、新加坡、英国等留学申请服务。',
        showCancel: false
      });
    } else if (item.path) {
      wx.navigateTo({ url: item.path });
    }
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo');
          this.setData({ isLoggedIn: false, userInfo: null });
          wx.showToast({ title: '已退出', icon: 'success' });
        }
      }
    });
  }
});
