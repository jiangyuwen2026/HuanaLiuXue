Page({
  data: {
    school: null,
    loading: true
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.loadSchoolDetail(id);
    }
  },

  async loadSchoolDetail(id) {
    const api = require('../../../utils/api');
    try {
      const res = await api.getSchoolDetail(id);
      this.setData({
        school: res.data,
        loading: false
      });
    } catch (error) {
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  goToAppointment() {
    const { school } = this.data;
    wx.navigateTo({
      url: `/pages/appointment/appointment?schoolName=${school.name}`
    });
  }
});
