Page({
  data: {
    consultant: null,
    loading: true
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.loadConsultantDetail(id);
    }
  },

  async loadConsultantDetail(id) {
    const api = require('../../../utils/api');
    try {
      const res = await api.getConsultantDetail(id);
      this.setData({
        consultant: res.data,
        loading: false
      });
    } catch (error) {
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  goToAppointment() {
    const { consultant } = this.data;
    wx.navigateTo({
      url: `/pages/appointment/appointment?consultantId=${consultant.id}&consultantName=${consultant.name}`
    });
  }
});
