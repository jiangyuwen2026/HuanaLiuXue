/**
 * 我的预约页 - v2.0
 * 对接后端API获取预约列表
 */

const api = require('../../utils/api');
const util = require('../../utils/util');

Page({
  data: {
    appointmentList: [],
    loading: false
  },

  onShow() {
    this.loadAppointments();
  },

  /**
   * 加载预约列表
   */
  async loadAppointments() {
    this.setData({ loading: true });
    
    try {
      const res = await api.getMyAppointments();
      const list = (res.data || []).map(item => ({
        ...item,
        dateTime: `${item.appointment_date} ${item.appointment_time}`
      }));
      
      this.setData({
        appointmentList: list,
        loading: false
      });
      
    } catch (error) {
      console.error('加载预约列表失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  /**
   * 取消预约
   */
  async cancelAppointment(e) {
    const id = e.currentTarget.dataset.id;
    
    const confirmed = await util.showModal('确定要取消这个预约吗？');
    if (!confirmed) return;
    
    try {
      await api.cancelAppointment(id);
      wx.showToast({ title: '取消成功', icon: 'success' });
      this.loadAppointments();
      
    } catch (error) {
      wx.showToast({
        title: error.message || '取消失败',
        icon: 'none'
      });
    }
  },

  /**
   * 重新预约
   */
  rebook() {
    wx.navigateTo({
      url: '/pages/appointment/appointment'
    });
  }
});
