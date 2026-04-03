/**
 * ============================================================================
 * 华南留学小程序 - 首页 v2.0
 * 说明: 对接官网后台数据，动态展示Banner、明星案例、热门学校、推荐资讯
 * ============================================================================
 */

const api = require('../../utils/api');
const util = require('../../utils/util');

Page({
  data: {
    // 加载状态
    loading: true,
    
    // 轮播图数据 - 来自后台Banner管理
    banners: [],
    currentBanner: 0,
    
    // 快捷入口 (固定8个)
    quickEntries: [
      { id: 1, name: '学校查询', icon: '/images/icon/school.png', path: '/pages/school/list/school-list' },
      { id: 2, name: '成功案例', icon: '/images/icon/case.png', path: '/pages/case/list/case-list' },
      { id: 3, name: '顾问风采', icon: '/images/icon/consultant.png', path: '/pages/consultant/list/consultant-list' },
      { id: 4, name: '服务介绍', icon: '/images/icon/service.png', path: '/pages/service/list/service-list' },
      { id: 5, name: '留学资讯', icon: '/images/icon/news.png', path: '/pages/news/news' },
      { id: 6, name: '快速评估', icon: '/images/icon/assessment.png', path: '/pages/assessment/assessment' },
      { id: 7, name: '预约咨询', icon: '/images/icon/appointment.png', path: '/pages/appointment/appointment' },
      { id: 8, name: '联系客服', icon: '/images/icon/service.png', type: 'contact' }
    ],
    
    // 明星案例 - 来自后台案例管理-设为明星
    featuredCases: [],
    
    // 热门学校 - 来自后台学校管理-热门设置
    hotSchools: [],
    
    // 推荐资讯 - 来自后台新闻管理-推荐到首页
    recommendedNews: []
  },

  onLoad() {
    this.loadHomeData();
  },
  
  onPullDownRefresh() {
    this.loadHomeData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 加载首页所有数据
   * 并行请求: Banner、明星案例、热门学校、推荐资讯
   */
  async loadHomeData() {
    this.setData({ loading: true });
    
    try {
      // 并行加载所有数据
      const [bannersRes, casesRes, schoolsRes, newsRes] = await Promise.all([
        api.getBanners(),
        api.getFeaturedCases(),
        api.getHotSchools(),
        api.getRecommendedNews(6)
      ]);
      
      this.setData({
        banners: bannersRes.data || [],
        featuredCases: this.formatFeaturedCases(casesRes.data || []),
        hotSchools: schoolsRes.data || [],
        recommendedNews: this.formatNews(newsRes.data || []),
        loading: false
      });
      
    } catch (error) {
      console.error('首页数据加载失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '数据加载失败',
        icon: 'none'
      });
    }
  },

  /**
   * 格式化明星案例数据
   */
  formatFeaturedCases(cases) {
    return cases.map(item => {
      // 处理背景色渐变
      let bgGradient = item.feature_bg;
      if (!bgGradient) {
        // 默认渐变
        const gradients = [
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        ];
        bgGradient = gradients[item.id % gradients.length];
      } else if (bgGradient.includes('from-')) {
        // 转换Tailwind格式为CSS渐变
        bgGradient = this.convertTailwindGradient(bgGradient);
      }
      
      return {
        ...item,
        bgGradient
      };
    });
  },

  /**
   * 格式化资讯数据
   */
  formatNews(news) {
    return news.map(item => ({
      ...item,
      publishTime: util.formatDate(item.published_at, 'MM-DD')
    }));
  },

  /**
   * 转换Tailwind渐变格式为CSS
   */
  convertTailwindGradient(twGradient) {
    const colorMap = {
      'from-blue-500': '#3b82f6',
      'to-cyan-500': '#06b6d4',
      'from-violet-500': '#8b5cf6',
      'to-purple-600': '#9333ea',
      'from-amber-500': '#f59e0b',
      'to-orange-500': '#f97316',
      'from-emerald-500': '#10b981',
      'to-teal-600': '#0d9488',
      'from-rose-500': '#f43f5e',
      'to-pink-600': '#db2777',
      'from-indigo-500': '#6366f1',
      'to-blue-600': '#2563eb'
    };
    
    const colors = twGradient.split(' ');
    const fromColor = colorMap[colors[0]] || '#667eea';
    const toColor = colorMap[colors[1]] || '#764ba2';
    
    return `linear-gradient(135deg, ${fromColor} 0%, ${toColor} 100%)`;
  },

  // ==================== 轮播图事件 ====================
  
  onBannerChange(e) {
    this.setData({
      currentBanner: e.detail.current
    });
  },
  
  onBannerTap(e) {
    const { index } = e.currentTarget.dataset;
    const banner = this.data.banners[index];
    
    if (!banner || !banner.link) return;
    
    // 处理跳转链接
    if (banner.link.startsWith('http')) {
      // 外部链接 - 复制链接
      wx.setClipboardData({
        data: banner.link,
        success: () => {
          wx.showToast({ title: '链接已复制', icon: 'success' });
        }
      });
    } else {
      // 内部页面跳转
      wx.navigateTo({
        url: banner.link,
        fail: () => {
          wx.switchTab({ url: banner.link });
        }
      });
    }
  },

  // ==================== 快捷入口事件 ====================
  
  onQuickEntryTap(e) {
    const { item } = e.currentTarget.dataset;
    
    if (item.type === 'contact') {
      // 联系客服
      wx.makePhoneCall({
        phoneNumber: '400-888-8888',
        fail: () => {
          wx.showToast({ title: '拨打失败', icon: 'none' });
        }
      });
    } else if (item.path) {
      wx.navigateTo({
        url: item.path,
        fail: () => {
          wx.switchTab({ url: item.path });
        }
      });
    }
  },

  // ==================== 明星案例事件 ====================
  
  onFeaturedCaseTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/case/detail/case-detail?id=${id}`
    });
  },

  onMoreCasesTap() {
    wx.navigateTo({
      url: '/pages/case/list/case-list'
    });
  },

  // ==================== 热门学校事件 ====================
  
  onHotSchoolTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/school/detail/school-detail?id=${id}`
    });
  },
  
  onMoreSchoolsTap() {
    wx.navigateTo({
      url: '/pages/school/list/school-list'
    });
  },

  // ==================== 推荐资讯事件 ====================
  
  onNewsTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/news/detail/news-detail?id=${id}`
    });
  },
  
  onMoreNewsTap() {
    wx.switchTab({
      url: '/pages/news/news'
    });
  },

  // ==================== 分享 ====================
  
  onShareAppMessage() {
    return {
      title: '华南留学 - 专业的留学咨询平台',
      path: '/pages/index/index',
      imageUrl: '/images/share.png'
    };
  },
  
  onShareTimeline() {
    return {
      title: '华南留学 - 专业的留学咨询平台',
      imageUrl: '/images/share.png'
    };
  }
});
