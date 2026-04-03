Page({
  data: {
    banners: [
      {
        id: 1,
        image: 'https://picsum.photos/750/400?random=1',
        link: '/pages/news/news'
      },
      {
        id: 2,
        image: 'https://picsum.photos/750/400?random=2',
        link: '/pages/service/service'
      },
      {
        id: 3,
        image: 'https://picsum.photos/750/400?random=3',
        link: '/pages/case/case'
      }
    ],
    quickLinks: [
      { name: '留学资讯', icon: '📰', path: '/pages/news/news' },
      { name: '产品服务', icon: '🎁', path: '/pages/service/service' },
      { name: '成功案例', icon: '🏆', path: '/pages/case/case' },
      { name: '免费咨询', icon: '💬', path: '/pages/appointment/appointment' }
    ]
  },

  onLoad() {
    // 首页加载
  },

  goToPage(e) {
    const path = e.currentTarget.dataset.path;
    // 判断是否为 tabBar 页面
    const tabBarPaths = ['/pages/index/index', '/pages/service/service', '/pages/case/case', '/pages/user/user'];
    if (tabBarPaths.includes(path)) {
      wx.switchTab({ url: path });
    } else {
      wx.navigateTo({ url: path });
    }
  },

  onBannerTap(e) {
    const index = e.currentTarget.dataset.index;
    const banner = this.data.banners[index];
    if (banner.link) {
      wx.switchTab({ url: banner.link });
    }
  }
});
