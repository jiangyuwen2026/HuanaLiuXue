/**
 * 案例列表页 - v2.0
 * 对接后端API，支持分页和筛选
 */

const api = require('../../../utils/api');

Page({
  data: {
    selectedCountry: '',
    selectedDegree: '',
    countryList: ['全部', '香港', '新加坡', '英国', '澳大利亚', '美国'],
    degreeList: ['全部', '本科', '硕士', '博士'],
    caseList: [],
    page: 1,
    limit: 10,
    total: 0,
    hasMore: true,
    loading: false
  },

  onLoad() {
    this.loadCaseList();
  },

  onPullDownRefresh() {
    this.setData({ 
      page: 1, 
      caseList: [], 
      hasMore: true 
    });
    this.loadCaseList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 });
      this.loadCaseList();
    }
  },

  /**
   * 加载案例列表
   */
  async loadCaseList() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      const params = {
        page: this.data.page,
        limit: this.data.limit
      };
      
      if (this.data.selectedCountry) {
        params.country = this.data.selectedCountry;
      }
      
      if (this.data.selectedDegree) {
        params.degree = this.data.selectedDegree;
      }
      
      const res = await api.getCaseList(params);
      const newList = res.data.list || [];
      
      this.setData({
        caseList: this.data.page === 1 ? newList : [...this.data.caseList, ...newList],
        total: res.data.total || 0,
        hasMore: newList.length === this.data.limit,
        loading: false
      });
      
    } catch (error) {
      console.error('加载案例列表失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  /**
   * 筛选国家
   */
  onFilterCountry(e) {
    const country = e.currentTarget.dataset.country;
    this.setData({
      selectedCountry: country === '全部' ? '' : country,
      page: 1,
      caseList: [],
      hasMore: true
    });
    this.loadCaseList();
  },

  /**
   * 筛选学位
   */
  onFilterDegree(e) {
    const degree = e.currentTarget.dataset.degree;
    this.setData({
      selectedDegree: degree === '全部' ? '' : degree,
      page: 1,
      caseList: [],
      hasMore: true
    });
    this.loadCaseList();
  },

  /**
   * 查看详情
   */
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/case/detail/case-detail?id=${id}`
    });
  }
});
