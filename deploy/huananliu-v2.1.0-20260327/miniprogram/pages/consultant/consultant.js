// pages/consultant/consultant.js
const app = getApp()

Page({
  data: {
    keyword: '',
    selectedExpertise: '',
    consultantList: []
  },

  onLoad() {
    this.loadConsultantList();
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({
      keyword: e.detail.value
    });
  },

  // 搜索
  onSearch() {
    this.loadConsultantList();
  },

  // 筛选专长
  onFilterExpertise(e) {
    const expertise = e.currentTarget.dataset.expertise;
    this.setData({
      selectedExpertise: expertise
    });
    this.loadConsultantList();
  },

  // 加载顾问列表
  loadConsultantList() {
    // TODO: 从后端API获取数据
    // wx.request({
    //   url: app.globalData.baseUrl + '/consultant/list',
    //   data: {
    //     keyword: this.data.keyword,
    //     expertise: this.data.selectedExpertise
    //   },
    //   success: (res) => {
    //     this.setData({ consultantList: res.data.data });
    //   }
    // });

    // 模拟数据
    this.setData({
      consultantList: [
        {
          id: 1,
          name: '陈伟',
          title: '资深留学顾问',
          avatar: 'https://picsum.photos/seed/consultant1/160/160',
          experience: '从业10年',
          caseCount: 500,
          successRate: 95,
          isSenior: true,
          expertise: ['香港', '新加坡', '硕士申请']
        },
        {
          id: 2,
          name: '刘芳',
          title: '首席留学专家',
          avatar: 'https://picsum.photos/seed/consultant2/160/160',
          experience: '从业12年',
          caseCount: 800,
          successRate: 98,
          isSenior: true,
          expertise: ['英国', '博士申请', '奖学金申请']
        },
        {
          id: 3,
          name: '张明',
          title: '高级咨询顾问',
          avatar: 'https://picsum.photos/seed/consultant3/160/160',
          experience: '从业6年',
          caseCount: 300,
          successRate: 92,
          isSenior: false,
          expertise: ['马来西亚', '本科申请', '语言学校']
        },
        {
          id: 4,
          name: '王婷',
          title: '留学规划师',
          avatar: 'https://picsum.photos/seed/consultant4/160/160',
          experience: '从业5年',
          caseCount: 250,
          successRate: 90,
          isSenior: false,
          expertise: ['香港', '商科', 'MBA申请']
        },
        {
          id: 5,
          name: '李娜',
          title: '资深顾问',
          avatar: 'https://picsum.photos/seed/consultant5/160/160',
          experience: '从业8年',
          caseCount: 400,
          successRate: 94,
          isSenior: true,
          expertise: ['新加坡', '工程专业', '奖学金申请']
        }
      ]
    });
  },

  // 查看详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/consultant/detail/consultant-detail?id=${id}`
    });
  }
})
