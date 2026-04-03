/**
 * 我的收藏页面
 * 支持收藏学校、案例、资讯
 */

const api = require('../../../utils/api')

Page({
  data: {
    activeTab: 'school',
    tabs: [
      { key: 'school', label: '院校' },
      { key: 'case', label: '案例' },
      { key: 'news', label: '资讯' }
    ],
    favorites: {
      school: [],
      case: [],
      news: []
    },
    loading: false
  },

  onShow() {
    this.loadFavorites()
  },

  /**
   * 切换标签
   */
  switchTab(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ activeTab: key })
    this.loadFavoritesByType(key)
  },

  /**
   * 加载所有收藏
   */
  async loadFavorites() {
    this.setData({ loading: true })
    
    try {
      // 从本地存储获取收藏数据（实际应从后端API获取）
      const favorites = wx.getStorageSync('myFavorites') || {
        school: [],
        case: [],
        news: []
      }
      
      this.setData({
        favorites: favorites,
        loading: false
      })
      
      // 加载当前标签的数据
      this.loadFavoritesByType(this.data.activeTab)
    } catch (error) {
      console.error('加载收藏失败:', error)
      this.setData({ loading: false })
    }
  },

  /**
   * 按类型加载收藏
   */
  async loadFavoritesByType(type) {
    // 这里应该调用后端API获取具体数据
    // 目前使用本地存储模拟
    const favorites = this.data.favorites[type] || []
    
    // 如果没有数据，尝试从本地存储获取ID列表并加载详情
    if (favorites.length === 0) {
      const ids = wx.getStorageSync(`favorites_${type}`) || []
      if (ids.length > 0) {
        // 模拟加载数据
        this.loadMockData(type, ids)
      }
    }
  },

  /**
   * 加载模拟数据（实际应从后端API获取）
   */
  loadMockData(type, ids) {
    let mockData = []
    
    if (type === 'school') {
      mockData = [
        { id: 1, name: '香港大学', country: '香港', ranking: 'QS #26', logo: '' },
        { id: 2, name: '新加坡国立大学', country: '新加坡', ranking: 'QS #8', logo: '' }
      ]
    } else if (type === 'case') {
      mockData = [
        { id: 1, studentName: '张同学', school: '香港大学', major: '计算机科学', highlight: '名校录取' },
        { id: 2, studentName: '李同学', school: '新加坡国立大学', major: '金融工程', highlight: '双非逆袭' }
      ]
    } else if (type === 'news') {
      mockData = [
        { id: 1, title: '2025年香港留学申请指南', category: '申请攻略', publishTime: '2025-01-15' },
        { id: 2, title: '新加坡留学签证最新政策', category: '签证资讯', publishTime: '2025-01-10' }
      ]
    }
    
    // 过滤出已收藏的项目
    const filteredData = mockData.filter(item => ids.includes(item.id))
    
    this.setData({
      [`favorites.${type}`]: filteredData
    })
  },

  /**
   * 取消收藏
   */
  async cancelFavorite(e) {
    const { id, type } = e.currentTarget.dataset
    
    const res = await wx.showModal({
      title: '确认取消',
      content: '确定要取消收藏吗？',
      confirmColor: '#2C5F7C'
    })
    
    if (!res.confirm) return
    
    try {
      // 从列表中移除
      const list = this.data.favorites[type].filter(item => item.id !== id)
      this.setData({
        [`favorites.${type}`]: list
      })
      
      // 更新本地存储
      const storageKey = `favorites_${type}`
      const ids = wx.getStorageSync(storageKey) || []
      const newIds = ids.filter(itemId => itemId !== id)
      wx.setStorageSync(storageKey, newIds)
      
      wx.showToast({ title: '已取消收藏', icon: 'success' })
    } catch (error) {
      wx.showToast({ title: '操作失败', icon: 'none' })
    }
  },

  /**
   * 跳转到详情
   */
  goToDetail(e) {
    const { id, type } = e.currentTarget.dataset
    
    let url = ''
    if (type === 'school') {
      url = `/pages/school/detail/school-detail?id=${id}`
    } else if (type === 'case') {
      url = `/pages/case/detail/case-detail?id=${id}`
    } else if (type === 'news') {
      url = `/pages/news/detail/news-detail?id=${id}`
    }
    
    if (url) {
      wx.navigateTo({ url })
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadFavorites().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 去发现更多
   */
  goToExplore() {
    wx.switchTab({
      url: '/pages/news/news'
    })
  }
})
