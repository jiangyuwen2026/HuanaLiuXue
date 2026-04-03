// pages/appointment/appointment.js
const app = getApp()

Page({
  data: {
    selectedConsultant: {},
    selectedType: 'free',
    selectedDate: '',
    selectedTime: '',
    dateList: [],
    timeList: [],
    requirement: '',
    name: '',
    phone: '',
    wechat: '',
    submitting: false
  },

  onLoad(options) {
    // 从页面参数获取预选信息
    if (options.consultantId) {
      this.setData({
        'selectedConsultant.id': options.consultantId,
        'selectedConsultant.name': options.consultantName
      });
    }
    if (options.schoolName) {
      const requirement = `我想咨询${options.schoolName}的留学相关信息`;
      this.setData({ requirement });
    }
    if (options.majorName) {
      const requirement = `我想咨询${options.majorName}专业的申请信息`;
      this.setData({ requirement });
    }

    this.initDateList();
    this.initTimeList();
  },

  // 初始化日期列表
  initDateList() {
    const today = new Date();
    const dateList = [];
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekday = '周' + weekdays[date.getDay()];

      dateList.push({
        date: `${month}-${day}`,
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

  // 初始化时间列表
  initTimeList() {
    const timeList = [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: true },
      { time: '14:00', available: true },
      { time: '15:00', available: false },
      { time: '16:00', available: true },
      { time: '17:00', available: true }
    ];

    this.setData({ timeList });
  },

  // 选择顾问
  selectConsultant() {
    wx.navigateTo({
      url: '/pages/consultant/consultant?select=true'
    });
  },

  // 选择咨询类型
  onSelectType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ selectedType: type });
  },

  // 选择日期
  onSelectDate(e) {
    const date = e.currentTarget.dataset.date;
    this.setData({ selectedDate: date });
  },

  // 选择时间
  onSelectTime(e) {
    const time = e.currentTarget.dataset.time;
    const available = e.currentTarget.dataset.available;

    if (!available) {
      app.showError('该时段已约满');
      return;
    }

    this.setData({ selectedTime: time });
  },

  // 咨询需求输入
  onRequirementInput(e) {
    this.setData({ requirement: e.detail.value });
  },

  // 姓名输入
  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  // 手机号输入
  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  // 微信号输入
  onWechatInput(e) {
    this.setData({ wechat: e.detail.value });
  },

  // 提交预约
  submitAppointment() {
    // 验证表单
    if (!this.data.selectedConsultant.id) {
      app.showError('请选择顾问');
      return;
    }

    if (!this.data.selectedDate || !this.data.selectedTime) {
      app.showError('请选择预约时间');
      return;
    }

    if (!this.data.name.trim()) {
      app.showError('请输入姓名');
      return;
    }

    if (!this.data.phone.trim()) {
      app.showError('请输入手机号');
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(this.data.phone)) {
      app.showError('请输入正确的手机号');
      return;
    }

    if (!this.data.requirement.trim()) {
      app.showError('请输入咨询需求');
      return;
    }

    this.setData({ submitting: true });

    // TODO: 调用后端API提交预约
    // wx.request({
    //   url: app.globalData.baseUrl + '/appointment/create',
    //   method: 'POST',
    //   data: {
    //     consultantId: this.data.selectedConsultant.id,
    //     type: this.data.selectedType,
    //     date: this.data.selectedDate,
    //     time: this.data.selectedTime,
    //     requirement: this.data.requirement,
    //     name: this.data.name,
    //     phone: this.data.phone,
    //     wechat: this.data.wechat
    //   },
    //   success: (res) => {
    //     app.showSuccess('预约成功');
    //     setTimeout(() => {
    //       wx.navigateBack();
    //     }, 1500);
    //   },
    //   complete: () => {
    //     this.setData({ submitting: false });
    //   }
    // });

    // 模拟提交
    setTimeout(() => {
      this.setData({ submitting: false });
      wx.showModal({
        title: '预约成功',
        content: `您已成功预约${this.data.selectedConsultant.name}顾问的咨询服务\n时间：${this.data.selectedDate} ${this.data.selectedTime}\n我们将通过电话或微信与您联系`,
        showCancel: false,
        success() {
          wx.navigateBack();
        }
      });
    }, 1000);
  }
})
