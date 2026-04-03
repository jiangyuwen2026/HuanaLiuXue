// pages/appointment/appointment.js
const app = getApp()
const api = require('../../utils/api')

Page({
  data: {
    currentStep: 1,
    selectedConsultant: null,
    selectedType: '留学申请',
    // 咨询类型列表
    consultTypes: [
      { id: '留学申请', name: '留学申请', icon: '🎓', desc: '本硕博全阶段申请' },
      { id: '英语培训', name: '英语培训', icon: '📚', desc: '雅思托福专业培训' },
      { id: '竞赛规划', name: '竞赛规划', icon: '🏆', desc: '国际竞赛辅导' },
      { id: '科研提升', name: '科研提升', icon: '🔬', desc: '科研项目指导' }
    ],
    selectedDate: '',
    selectedTime: '',
    dateList: [],
    timeList: [],
    requirement: '',
    name: '',
    phone: '',
    wechat: '',
    submitting: false,
    canSubmit: false,
    loadingConsultants: true,
    // 顾问列表数据（从后台拉取）
    consultantList: []
  },

  onLoad(options) {
    // 加载顾问列表
    this.loadConsultants(options);
    
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

  // 从后台加载顾问列表
  async loadConsultants(options) {
    this.setData({ loadingConsultants: true });
    
    try {
      const res = await api.getConsultantList({ limit: 10 });
      
      if (res.success && res.data && res.data.list) {
        // 格式化顾问数据
        const consultantList = res.data.list.map(item => {
          // 解析专长数组
          let specialties = item.specialties;
          if (typeof specialties === 'string') {
            try {
              specialties = JSON.parse(specialties);
            } catch (e) {
              specialties = [specialties];
            }
          }
          
          return {
            id: item.id,
            name: item.name,
            title: item.title,
            avatar: item.avatar,
            specialties: specialties && specialties.length > 0 ? specialties[0] : '留学咨询',
            experience: `${item.experience}年`,
            cases: item.success_cases || 0
          };
        });
        
        this.setData({ 
          consultantList,
          loadingConsultants: false 
        });
        
        // 如果从页面参数传入了顾问ID，自动选中
        if (options.consultantId) {
          const consultant = consultantList.find(c => c.id == options.consultantId);
          if (consultant) {
            this.setData({ selectedConsultant: consultant });
          }
        }
      } else {
        this.setData({ loadingConsultants: false });
        wx.showToast({ title: '加载顾问失败', icon: 'none' });
      }
    } catch (error) {
      console.error('加载顾问失败:', error);
      this.setData({ loadingConsultants: false });
      wx.showToast({ title: '加载顾问失败', icon: 'none' });
    }
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
        fullDate: `${date.getFullYear()}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        month: month,
        day: day,
        weekday: i === 0 ? '今天' : weekday
      });
    }

    this.setData({
      dateList,
      selectedDate: dateList[0].fullDate
    });
  },

  // 初始化时间列表
  initTimeList() {
    const timeList = [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: true },
      { time: '14:00', available: true },
      { time: '15:00', available: true },
      { time: '16:00', available: true },
      { time: '17:00', available: true }
    ];

    this.setData({ timeList });
  },

  // 选择顾问
  selectConsultant(e) {
    const consultant = e.currentTarget.dataset.item;
    this.setData({ 
      selectedConsultant: consultant,
      currentStep: 2
    });
    this.checkCanSubmit();
  },

  // 选择咨询类型
  onSelectType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ selectedType: type });
    this.checkCanSubmit();
  },

  // 选择日期
  onSelectDate(e) {
    const date = e.currentTarget.dataset.date;
    this.setData({ selectedDate: date });
    this.checkCanSubmit();
  },

  // 选择时间
  onSelectTime(e) {
    const time = e.currentTarget.dataset.time;
    const available = e.currentTarget.dataset.available;

    if (!available) {
      wx.showToast({ title: '该时段已约满', icon: 'none' });
      return;
    }

    this.setData({ selectedTime: time });
    this.checkCanSubmit();
  },

  // 检查是否可以提交
  checkCanSubmit() {
    const { selectedConsultant, selectedDate, selectedTime, name, phone } = this.data;
    const canSubmit = selectedConsultant && selectedDate && selectedTime && name && phone;
    this.setData({ canSubmit: !!canSubmit });
  },

  // 咨询需求输入
  onRequirementInput(e) {
    this.setData({ requirement: e.detail.value });
  },

  // 姓名输入
  onNameInput(e) {
    this.setData({ name: e.detail.value });
    this.checkCanSubmit();
  },

  // 手机号输入
  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
    this.checkCanSubmit();
  },

  // 微信号输入
  onWechatInput(e) {
    this.setData({ wechat: e.detail.value });
  },

  // 提交预约
  submitAppointment() {
    // 验证表单
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
