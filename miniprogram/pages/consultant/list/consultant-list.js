/**
 * 顾问列表页 - v2.0
 * 对接后端API，支持分页
 */

const api = require('../../../utils/api');

Page({
  data: {
    consultantList: [],
    page: 1,
    limit: 10,
    total: 0,
    hasMore: true,
    loading: false
  },

  onLoad() {
    this.loadConsultantList();
  },

  onPullDownRefresh() {
    this.setData({ 
      page: 1, 
      consultantList: [], 
      hasMore: true 
    });
    this.loadConsultantList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 });
      this.loadConsultantList();
    }
  },

  /**
   * 加载顾问列表
   */
  async loadConsultantList() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      const params = {
        page: this.data.page,
        limit: this.data.limit
      };
      
      const res = await api.getConsultantList(params);
      const newList = res.data.list || [];
      
      this.setData({
        consultantList: this.data.page === 1 ? newList : [...this.data.consultantList, ...newList],
        total: res.data.total || 0,
        hasMore: newList.length === this.data.limit,
        loading: false
      });
      
    } catch (error) {
      console.error('加载顾问列表失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  /**
   * 查看详情
   */
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/consultant/detail/consultant-detail?id=${id}`
    });
  },

  /**
   * 立即咨询
   */
  consultNow(e) {
    const consultant = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/appointment/appointment?consultantId=${consultant.id}&consultantName=${consultant.name}`
    });
  }
});
