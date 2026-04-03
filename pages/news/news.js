const api = require('../../utils/api');

Page({
  data: {
    currentTab: 0,
    tabs: ['全部'],
    newsList: [],
    loading: false,
    page: 1,
    limit: 10,
    hasMore: true
  },

  onLoad() {
    this.loadCategories();
    this.loadNewsList();
  },

  onPullDownRefresh() {
    this.setData({ page: 1, hasMore: true });
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

  // 加载分类
  async loadCategories() {
    try {
      const res = await api.get('/news/options/categories');
      if (res.success) {
        const categories = res.data || [];
        this.setData({
          tabs: ['全部', ...categories]
        });
      }
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  },

  // 加载新闻列表
  async loadNewsList() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      const params = {
        page: this.data.page,
        limit: this.data.limit
      };
      
      // 如果不是"全部"，添加分类筛选
      if (this.data.currentTab > 0) {
        params.category = this.data.tabs[this.data.currentTab];
      }
      
      const res = await api.get('/news', params);
      
      if (res.success) {
        const newList = res.data.list || [];
        // 格式化数据
        const formattedList = newList.map(item => {
          // 处理图片URL - 支持多种可能的字段名
          let imageUrl = item.cover || item.cover_image || item.image || '';
          // 如果是相对路径，拼接完整URL
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = `http://localhost:3001${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
          }
          
          // 调试日志
          console.log('新闻图片URL:', item.id, imageUrl);
          
          return {
            id: item.id,
            title: item.title,
            summary: item.summary || (item.content ? item.content.substring(0, 100) + '...' : ''),
            coverImage: imageUrl,
            category: item.category,
            views: item.view_count || item.views || 0,
            time: this.formatTime(item.published_at || item.publish_date || item.created_at)
          };
        });
        
        this.setData({
          newsList: this.data.page === 1 ? formattedList : [...this.data.newsList, ...formattedList],
          hasMore: newList.length === this.data.limit,
          loading: false
        });
      }
    } catch (error) {
      console.error('加载新闻失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  // 格式化时间
  formatTime(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    
    // 小于1小时显示"X分钟前"
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return minutes < 1 ? '刚刚' : `${minutes}分钟前`;
    }
    // 小于24小时显示"X小时前"
    if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}小时前`;
    }
    // 小于7天显示"X天前"
    if (diff < 604800000) {
      return `${Math.floor(diff / 86400000)}天前`;
    }
    // 否则显示日期
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  },

  // 切换标签
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index,
      page: 1,
      newsList: [],
      hasMore: true
    });
    this.loadNewsList();
  },

  // 查看详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/news/detail/news-detail?id=${id}`
    });
  },

  // 图片加载错误处理
  onImageError(e) {
    const index = e.currentTarget.dataset.index;
    console.log('图片加载失败，使用默认图片:', index);
    // 设置默认占位图
    const key = `newsList[${index}].coverImage`;
    this.setData({
      [key]: 'https://via.placeholder.com/300x200?text=News'
    });
  }
});
