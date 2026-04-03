Page({
  data: {
    news: null,
    loading: true
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.loadNewsDetail(id);
    }
  },

  async loadNewsDetail(id) {
    const api = require('../../../utils/api');
    try {
      const res = await api.getNewsDetail(id);
      this.setData({
        news: res.data,
        loading: false
      });
    } catch (error) {
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  }
});
