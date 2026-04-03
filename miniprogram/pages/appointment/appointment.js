/**
 * 预约咨询页 - v2.0
 * 对接后端API提交预约
 */

const api = require('../../utils/api');
const util = require('../../utils/util');

Page({
  data: {
    selectedConsultant: null,
    selectedDate: '',
    selectedTime: '',
    dateList: [],
    timeList: [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: true },
      { time: '14:00', available: true },
      { time: '15:00', available: true },
      { time: '16:00', available: true },
      { time: '17:00', available: true }
    ],
    requirement: '',
    name: '',
    phone: '',
    wechat: '',
    submitting: false
  },

  onLoad(options) {
    // 从页面参数获取预选顾问
    if (options.consultantId) {
      this.setData({
        selectedConsultant: {
          id: options.consultantId,
          name: options.consultantName || '未知顾问'
        }
      });
    }
    
    this.initDateList();
  },

  // 初始化日期列表
  initDateList() {
    const today = new Date();
    const dateList = [];
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekday = '周' + weekdays[date.getDay()];

      dateList.push({
        date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        displayDate: `${month}-${day}`,
        month: month,
        day: day,
        weekday: i === 0 ? '今天' : weekday
      });
    }

    this.setData({
      dateList,
      selectedDate: dateList[0].date
    });
  },

  // 选择顾问
  selectConsultant() {
    wx.navigateTo({
      url: '/pages/consultant/list/consultant-list?select=true'
    });
  },

  // 选择日期
  onSelectDate(e) {
    const date = e.currentTarget.dataset.date;
    this.setData({ selectedDate: date });
  },

  // 选择时间
  onSelectTime(e) {
    const time = e.currentTarget.dataset.time;
    this.setData({ selectedTime: time });
  },

  // 输入处理
  onRequirementInput(e) {
    this.setData({ requirement: e.detail.value });
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onWechatInput(e) {
    this.setData({ wechat: e.detail.value });
  },

  // 提交预约
  async submitAppointment() {
    // 表单验证
    if (!this.data.selectedConsultant) {
      wx.showToast({ title: '请选择顾问', icon: 'none' });
      return;
    }

    if (!this.data.selectedDate || !this.data.selectedTime) {
      wx.showToast({ title: '请选择预约时间', icon: 'none' });
      return;
    }

    if (!this.data.name.trim()) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }

    if (!this.data.phone.trim()) {
      wx.showToast({ title: '请输入手机号', icon: 'none' });
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(this.data.phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    try {
      const res = await api.createAppointment({
        consultant_id: this.data.selectedConsultant.id,
        appointment_date: this.data.selectedDate,
        appointment_time: this.data.selectedTime,
        name: this.data.name,
        phone: this.data.phone,
        wechat: this.data.wechat,
        requirement: this.data.requirement
      });

      wx.showModal({
        title: '预约成功',
        content: `您已成功预约${this.data.selectedConsultant.name}顾问的咨询服务\n时间：${this.data.selectedDate} ${this.data.selectedTime}\n我们将通过电话或微信与您联系`,
        showCancel: false,
        success: () => {
          wx.navigateBack();
        }
      });

    } catch (error) {
      console.error('预约失败:', error);
      wx.showToast({
        title: error.message || '预约失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ submitting: false });
    }
  }
});
