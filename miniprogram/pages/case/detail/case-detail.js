Page({
  data: {
    caseInfo: null,
    loading: true
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.loadCaseDetail(id);
    }
  },

  async loadCaseDetail(id) {
    const api = require('../../../utils/api');
    try {
      const res = await api.getCaseDetail(id);
      this.setData({
        caseInfo: res.data,
        loading: false
      });
    } catch (error) {
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  }
});
