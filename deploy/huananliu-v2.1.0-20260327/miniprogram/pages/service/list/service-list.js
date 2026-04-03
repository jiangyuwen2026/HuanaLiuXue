const api = require('../../../utils/api');

Page({
  data: {
    serviceList: [],
    loading: false
  },

  onLoad() {
    this.loadServiceList();
  },

  async loadServiceList() {
    this.setData({ loading: true });
    try {
      const res = await api.getServiceList();
      this.setData({
        serviceList: res.data || [],
        loading: false
      });
    } catch (error) {
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  }
});
