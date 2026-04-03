Page({
  data: {
    history: [],
    loading: false
  },

  onLoad() {
    this.loadHistory();
  },

  loadHistory() {
    // 从本地存储读取浏览记录
    const history = wx.getStorageSync('browseHistory') || [];
    this.setData({ history });
  },

  goToDetail(e) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({ url });
  },

  clearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定清空浏览记录？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('browseHistory');
          this.setData({ history: [] });
          wx.showToast({ title: '已清空', icon: 'success' });
        }
      }
    });
  }
});
