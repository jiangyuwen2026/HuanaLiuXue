// pages/index/index.js
const app = getApp()

Page({
  data: {
    // 轮播图
    banners: [
      {
        id: 1,
        image: 'https://picsum.photos/750/400?random=1',
        link: '/pages/guide/guide'
      },
      {
        id: 2,
        image: 'https://picsum.photos/750/400?random=2',
        link: '/pages/guide/guide'
      },
      {
        id: 3,
        image: 'https://picsum.photos/750/400?random=3',
        link: '/pages/appointment/appointment'
      }
    ],

    // 功能入口（4个等距网格）
    functions: [
      {
        id: 1,
        name: '学校查询',
        icon: 'https://img.icons8.com/ios-filled/100/1E3A5F/school.png',
        path: '/pages/school/school'
      },
      {
        id: 2,
        name: '成功案例',
        icon: 'https://img.icons8.com/ios-filled/100/1E3A5F/prize.png',
        path: '/pages/case/case'
      },
      {
        id: 3,
        name: '顾问风采',
        icon: 'https://img.icons8.com/ios-filled/100/1E3A5F/conference.png',
        path: '/pages/consultant/consultant'
      },
      {
        id: 4,
        name: '申请指导',
        icon: 'https://img.icons8.com/ios-filled/100/1E3A5F/task.png',
        path: '/pages/guide/guide'
      }
    ],

    // 资讯列表
    newsList: [
      {
        id: 1,
        title: '香港2024年硕士申请时间表及要求更新',
        summary: '香港各大高校2024年秋季入学硕士申请已陆续开放，本文详细介绍申请时间...',
        coverImage: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=400x300&fit=crop',
        country: '香港',
        publishTime: '2024-01-15'
      },
      {
        id: 2,
        title: '新加坡国立大学新增专业解读',
        summary: '新加坡国立大学近期新增多个热门硕士专业，为申请人提供更多选择...',
        coverImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400x300&fit=crop',
        country: '新加坡',
        publishTime: '2024-01-12'
      },
      {
        id: 3,
        title: '马来西亚留学费用全解析',
        summary: '马来西亚作为高性价比留学目的地，吸引了众多学生。本文详细分析...',
        coverImage: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=400x300&fit=crop',
        country: '马来西亚',
        publishTime: '2024-01-10'
      }
    ],

    // 案例列表
    caseList: [
      {
        id: 1,
        studentName: '张同学',
        background: '985本科 GPA 3.5',
        target: '香港大学硕士',
        result: '已录取',
        offer: 'HKU 计算机硕士'
      },
      {
        id: 2,
        studentName: '李同学',
        background: '211本科 雅思7.0',
        target: '新加坡国立大学',
        result: '已录取',
        offer: 'NUS 金融工程硕士'
      },
      {
        id: 3,
        studentName: '王同学',
        background: '双非本科 GPA 3.8',
        target: '英国G5',
        result: '已录取',
        offer: 'UCL 教育学硕士'
      }
    ],

    // 顾问列表
    consultantList: [
      {
        id: 1,
        name: '陈顾问',
        title: '资深留学顾问',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=chen&backgroundColor=b6e3f4'
      },
      {
        id: 2,
        name: '刘顾问',
        title: '首席留学专家',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=liu&backgroundColor=c0aede'
      },
      {
        id: 3,
        name: '张顾问',
        title: '高级咨询顾问',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=zhang&backgroundColor=d1d4f9'
      },
      {
        id: 4,
        name: '王顾问',
        title: '留学规划师',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=wang&backgroundColor=ffd5dc'
      }
    ]
  },

  onLoad() {
    // 加载首页数据
    this.loadHomeData();
  },

  // 加载首页数据
  loadHomeData() {
    // TODO: 从后端API获取数据
    // wx.request({
    //   url: app.globalData.baseUrl + '/home',
    //   success: (res) => {
    //     this.setData({
    //       banners: res.data.banners,
    //       newsList: res.data.news,
    //       caseList: res.data.cases,
    //       consultantList: res.data.consultants
    //     })
    //   }
    // });
  },

  // 轮播图点击
  onBannerTap(e) {
    const id = e.currentTarget.dataset.id;
    const banner = this.data.banners.find(item => item.id === id);
    if (banner && banner.link) {
      this.navigateTo({ currentTarget: { dataset: { path: banner.link } } });
    }
  },

  // 页面跳转
  navigateTo(e) {
    const path = e.currentTarget.dataset.path;
    if (path) {
      wx.navigateTo({
        url: path
      });
    }
  },

  onShareAppMessage() {
    return {
      title: '华南留学 - 专业的留学咨询平台',
      path: '/pages/index/index'
    };
  }
})
