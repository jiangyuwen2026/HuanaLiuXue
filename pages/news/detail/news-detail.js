const api = require('../../../utils/api');

Page({
  data: {
    article: null,
    loading: true,
    relatedArticles: []
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.loadNewsDetail(id);
    } else {
      wx.showToast({ title: '参数错误', icon: 'none' });
      wx.navigateBack();
    }
  },

  async loadNewsDetail(id) {
    try {
      // 先尝试获取单条详情
      let res = await api.get('/news', { id });
      
      let articleData = null;
      
      if (res.success && res.data) {
        // 如果返回的是列表，取第一条
        if (res.data.list && res.data.list.length > 0) {
          articleData = res.data.list[0];
        } else if (res.data.id) {
          // 直接返回对象
          articleData = res.data;
        }
      }
      
      if (!articleData) {
        wx.showToast({ title: '文章不存在', icon: 'none' });
        this.setData({ loading: false });
        return;
      }
      
      // 处理图片URL
      let coverImage = articleData.cover || '';
      if (coverImage && !coverImage.startsWith('http')) {
        coverImage = `http://localhost:3001${coverImage.startsWith('/') ? '' : '/'}${coverImage}`;
      }
      
      // 格式化文章数据
      const article = {
        id: articleData.id,
        title: articleData.title,
        coverImage: coverImage,
        content: articleData.content,
        category: articleData.category,
        views: articleData.view_count || 0,
        publishTime: this.formatTime(articleData.published_at),
        isCollected: false
      };
      
      console.log('文章详情:', article);
      
      this.setData({
        article: article,
        loading: false
      });
      
      // 加载相关推荐
      this.loadRelatedArticles(article.category);
      
    } catch (error) {
      console.error('加载文章失败:', error);
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  // 加载相关推荐
  async loadRelatedArticles(category) {
    try {
      const res = await api.get('/news', { 
        category,
        limit: 3,
        page: 1
      });
      
      if (res.success && res.data && res.data.list) {
        const currentId = this.data.article.id;
        const related = res.data.list
          .filter(item => item.id !== currentId)
          .slice(0, 3)
          .map(item => ({
            id: item.id,
            title: item.title,
            publishTime: this.formatTime(item.published_at)
          }));
        
        this.setData({ relatedArticles: related });
      }
    } catch (error) {
      console.log('加载相关推荐失败:', error);
    }
  },

  // 格式化时间
  formatTime(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  },

  // 图片加载失败
  onImageError() {
    this.setData({
      'article.coverImage': 'https://via.placeholder.com/750x400?text=News'
    });
  },

  // 切换收藏
  toggleCollect() {
    const isCollected = !this.data.article.isCollected;
    this.setData({
      'article.isCollected': isCollected
    });
    wx.showToast({
      title: isCollected ? '收藏成功' : '取消收藏',
      icon: 'none'
    });
  },

  // 分享 - 已改为使用 open-type="share" 按钮触发

  // 跳转相关文章
  goToRelated(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/news/detail/news-detail?id=${id}`
    });
  },

  // 跳转到咨询页面
  goToConsult() {
    wx.navigateTo({
      url: '/pages/appointment/appointment'
    });
  },

  // 分享给朋友
  onShareAppMessage() {
    const article = this.data.article;
    return {
      title: article.title,
      path: `/pages/news/detail/news-detail?id=${article.id}`,
      imageUrl: article.coverImage || '/images/share-default.png'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    const article = this.data.article;
    return {
      title: article.title,
      query: `id=${article.id}`,
      imageUrl: article.coverImage || '/images/share-default.png'
    };
  }
});
