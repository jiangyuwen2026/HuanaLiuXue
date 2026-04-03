/**
 * ============================================================================
 * 华南留学小程序 - 首页 v2.0
 * 说明: 对接官网后台数据，动态展示Banner、明星案例、热门学校、推荐资讯
 * 数据来源:
 *   - 轮播图: 后台 Banner管理
 *   - 明星案例: 后台 案例管理-设为明星
 *   - 热门学校: 后台 学校管理-热门学校
 *   - 推荐资讯: 后台 新闻管理-推荐到首页
 * ============================================================================
 */

const api = require('../../utils/api-v2');
const util = require('../../utils/util');

Page({
  data: {
    // 加载状态
    loading: true,
    
    // 轮播图数据
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
    
    // 明星案例
    featuredCases: [],
    
    // 热门学校
    hotSchools: [],
    
    // 推荐资讯
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
        featuredCases: casesRes.data || [],
        hotSchools: schoolsRes.data || [],
        recommendedNews: newsRes.data || [],
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
      // 外部链接 - 使用web-view或复制链接
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
      wx.openCustomerServiceChat({
        extInfo: { url: '' },
        corpId: '',
        success: () => {},
        fail: () => {
          wx.makePhoneCall({ phoneNumber: '400-888-8888' });
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
