/**
 * 资讯列表页 - v2.0
 * 对接后端API，支持分类和分页
 */

const api = require('../../utils/api');
const util = require('../../utils/util');

Page({
  data: {
    categoryList: ['全部'],
    selectedCategory: '',
    newsList: [],
    page: 1,
    limit: 10,
    total: 0,
    hasMore: true,
    loading: false
  },

  onLoad() {
    this.loadCategories();
    this.loadNewsList();
  },

  onPullDownRefresh() {
    this.setData({ 
      page: 1, 
      newsList: [], 
      hasMore: true 
    });
    this.loadNewsList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 });
      this.loadNewsList();
    }
  },

  /**
   * 加载分类
   */
  async loadCategories() {
    try {
      const res = await api.getNewsCategories();
      const categories = res.data || [];
      this.setData({
        categoryList: ['全部', ...categories]
      });
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  },

  /**
   * 加载资讯列表
   */
  async loadNewsList() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      const params = {
        page: this.data.page,
        limit: this.data.limit
      };
      
      if (this.data.selectedCategory) {
        params.category = this.data.selectedCategory;
      }
      
      const res = await api.getNewsList(params);
      const newList = (res.data.list || []).map(item => ({
        ...item,
        publishTime: util.formatDate(item.published_at, 'MM-DD')
      }));
      
      this.setData({
        newsList: this.data.page === 1 ? newList : [...this.data.newsList, ...newList],
        total: res.data.total || 0,
        hasMore: newList.length === this.data.limit,
        loading: false
      });
      
    } catch (error) {
      console.error('加载资讯列表失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  /**
   * 筛选分类
   */
  onFilterCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      selectedCategory: category === '全部' ? '' : category,
      page: 1,
      newsList: [],
      hasMore: true
    });
    this.loadNewsList();
  },

  /**
   * 查看详情
   */
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/news/detail/news-detail?id=${id}`
    });
  }
});
