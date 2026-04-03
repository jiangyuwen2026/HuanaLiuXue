/**
 * 学校列表页 - v2.0
 * 对接后端API，支持分页和筛选
 */

const api = require('../../../utils/api');

Page({
  data: {
    keyword: '',
    selectedCountry: '',
    countryList: ['全部', '香港', '新加坡', '英国', '澳大利亚', '美国'],
    schoolList: [],
    page: 1,
    limit: 10,
    total: 0,
    hasMore: true,
    loading: false,
    refreshing: false
  },

  onLoad() {
    this.loadSchoolList();
  },

  onPullDownRefresh() {
    this.setData({ 
      page: 1, 
      schoolList: [], 
      hasMore: true,
      refreshing: true 
    });
    this.loadSchoolList().then(() => {
      wx.stopPullDownRefresh();
      this.setData({ refreshing: false });
    });
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 });
      this.loadSchoolList();
    }
  },

  /**
   * 加载学校列表
   */
  async loadSchoolList() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      const params = {
        page: this.data.page,
        limit: this.data.limit
      };
      
      if (this.data.selectedCountry && this.data.selectedCountry !== '全部') {
        params.country = this.data.selectedCountry;
      }
      
      if (this.data.keyword.trim()) {
        params.keyword = this.data.keyword.trim();
      }
      
      const res = await api.getSchoolList(params);
      const newList = res.data.list || [];
      
      this.setData({
        schoolList: this.data.page === 1 ? newList : [...this.data.schoolList, ...newList],
        total: res.data.total || 0,
        hasMore: newList.length === this.data.limit,
        loading: false
      });
      
    } catch (error) {
      console.error('加载学校列表失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  /**
   * 搜索输入
   */
  onSearchInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  /**
   * 搜索
   */
  onSearch() {
    this.setData({ 
      page: 1, 
      schoolList: [], 
      hasMore: true 
    });
    this.loadSchoolList();
  },

  /**
   * 筛选国家
   */
  onFilterCountry(e) {
    const country = e.currentTarget.dataset.country;
    this.setData({
      selectedCountry: country === '全部' ? '' : country,
      page: 1,
      schoolList: [],
      hasMore: true
    });
    this.loadSchoolList();
  },

  /**
   * 查看详情
   */
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/school/detail/school-detail?id=${id}`
    });
  }
});
