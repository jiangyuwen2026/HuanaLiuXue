Page({
  data: {
    targetCountry: '',
    targetDegree: '',
    gpa: '',
    languageScore: '',
    name: '',
    phone: ''
  },

  submitAssessment() {
    if (!this.data.name || !this.data.phone) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    wx.showToast({ title: '提交成功，顾问将尽快联系您', icon: 'success' });
    setTimeout(() => wx.navigateBack(), 1500);
  }
});
