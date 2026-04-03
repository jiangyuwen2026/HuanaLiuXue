const api = require('../../utils/api');

Page({
  data: {
    keyword: '',
    selectedExpertise: '',
    consultantList: [],
    loading: false
  },

  onLoad() {
    this.loadConsultantList();
  },

  onPullDownRefresh() {
    this.loadConsultantList().then(() => {
      wx.stopPullDownRefresh();
    });
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
  async loadConsultantList() {
    this.setData({ loading: true });
    
    try {
      const res = await api.getConsultantList({ limit: 20 });
      
      if (res.success && res.data && res.data.list) {
        const consultants = res.data.list.map(item => ({
          id: item.id,
          name: item.name,
          title: item.title,
          avatar: item.avatar,
          experience: item.experience,
          caseCount: item.success_cases,
          successRate: Math.round((item.rating / 5) * 100),
          isSenior: item.experience >= 10,
          expertise: Array.isArray(item.specialties) 
            ? item.specialties 
            : JSON.parse(item.specialties || '[]')
        }));
        
        this.setData({
          consultantList: consultants,
          loading: false
        });
      }
    } catch (error) {
      console.error('加载顾问失败:', error);
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  // 查看详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/consultant/detail/consultant-detail?id=${id}`
    });
  }
});
