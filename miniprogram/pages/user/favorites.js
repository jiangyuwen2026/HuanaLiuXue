Page({
  data: {
    favorites: [],
    loading: false
  },

  onLoad() {
    this.loadFavorites();
  },

  loadFavorites() {
    // 预留：收藏功能待后端支持
    this.setData({
      favorites: [],
      loading: false
    });
  },

  goToDetail(e) {
    const { type, id } = e.currentTarget.dataset;
    const paths = {
      school: '/pages/school/detail/school-detail',
      case: '/pages/case/detail/case-detail',
      news: '/pages/news/detail/news-detail'
    };
    if (paths[type]) {
      wx.navigateTo({ url: `${paths[type]}?id=${id}` });
    }
  }
});
