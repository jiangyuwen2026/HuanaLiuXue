// pages/case/case.js
const app = getApp()

Page({
  data: {
    selectedCountry: '',
    selectedDegree: '',
    caseList: []
  },

  onLoad() {
    this.loadCaseList();
  },

  // 筛选国家
  onFilterCountry(e) {
    const country = e.currentTarget.dataset.country;
    this.setData({
      selectedCountry: country
    });
    this.loadCaseList();
  },

  // 筛选学位
  onFilterDegree(e) {
    const degree = e.currentTarget.dataset.degree;
    this.setData({
      selectedDegree: degree
    });
    this.loadCaseList();
  },

  // 加载案例列表
  loadCaseList() {
    // TODO: 从后端API获取数据
    // wx.request({
    //   url: app.globalData.baseUrl + '/case/list',
    //   data: {
    //     country: this.data.selectedCountry,
    //     degree: this.data.selectedDegree
    //   },
    //   success: (res) => {
    //     this.setData({ caseList: res.data.data });
    //   }
    // });

    // 模拟数据
    this.setData({
      caseList: [
        {
          id: 1,
          studentName: '张同学',
          degree: '硕士',
          background: '985大学 计算机专业',
          major: '计算机科学',
          gpa: '3.5/4.0',
          language: '雅思 7.0',
          result: '已录取',
          offerSchool: '香港大学',
          country: '香港'
        },
        {
          id: 2,
          studentName: '李同学',
          degree: '硕士',
          background: '211大学 金融专业',
          major: '金融工程',
          gpa: '3.8/4.0',
          language: '雅思 7.5',
          result: '已录取',
          offerSchool: '新加坡国立大学'
        },
        {
          id: 3,
          studentName: '王同学',
          degree: '博士',
          background: '双非大学 材料专业',
          major: '材料科学',
          gpa: '3.9/4.0',
          language: '雅思 6.5',
          result: '已录取',
          offerSchool: '南洋理工大学'
        },
        {
          id: 4,
          studentName: '刘同学',
          degree: '本科',
          background: '国际高中',
          major: '经济学',
          gpa: 'A-Level AAA',
          language: '雅思 7.0',
          result: '已录取',
          offerSchool: '伦敦大学学院 (UCL)'
        },
        {
          id: 5,
          studentName: '陈同学',
          degree: '硕士',
          background: '普通一本 工商管理',
          major: 'MBA',
          gpa: '3.6/4.0',
          language: '雅思 6.5',
          result: '已录取',
          offerSchool: '香港中文大学'
        },
        {
          id: 6,
          studentName: '赵同学',
          degree: '本科',
          background: '高中',
          major: '商科',
          gpa: '高考 580分',
          language: '雅思 6.0',
          result: '已录取',
          offerSchool: '马来亚大学'
        }
      ]
    });
  },

  // 查看详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/case/detail/case-detail?id=${id}`
    });
  }
})
