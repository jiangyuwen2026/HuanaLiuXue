const api = require('../../utils/api.js')

// 本地默认案例数据（当API调用失败时使用）
const DEFAULT_CASES = [
  {
    id: 1,
    studentName: '张同学',
    background: '985本科 GPA 3.5 雅思7.0',
    school: '香港大学',
    major: '计算机科学',
    degree: '硕士',
    country: '香港',
    highlight: '名校录取',
    isFeatured: true
  },
  {
    id: 2,
    studentName: '李同学',
    background: '211本科 雅思7.0',
    school: '新加坡国立大学',
    major: '金融工程',
    degree: '硕士',
    country: '新加坡',
    highlight: '双非逆袭',
    isFeatured: true
  },
  {
    id: 3,
    studentName: '王同学',
    background: '双非本科 GPA 3.8 雅思7.5',
    school: '伦敦大学学院',
    major: '教育学',
    degree: '硕士',
    country: '英国',
    highlight: '低GPA录取',
    isFeatured: true
  },
  {
    id: 4,
    studentName: '陈同学',
    background: '985本科 GPA 3.7 雅思7.5',
    school: '悉尼大学',
    major: '商科',
    degree: '硕士',
    country: '澳洲',
    highlight: '快速录取',
    isFeatured: false
  },
  {
    id: 5,
    studentName: '刘同学',
    background: '211本科 GPA 3.6 雅思8.0',
    school: '墨尔本大学',
    major: '传媒',
    degree: '硕士',
    country: '澳洲',
    highlight: '奖学金录取',
    isFeatured: false
  }
]

Page({
  data: {
    countryTab: 0,
    degreeTab: 0,
    countryTabs: ['全部', '香港', '新加坡', '英国', '澳洲', '美国', '加拿大'],
    degreeTabs: ['全部', '本科', '硕士', '博士'],
    featuredCases: [],
    caseList: [],
    allCases: [],
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10,
    useLocalData: false
  },

  onLoad() {
    this.loadCaseList()
  },

  onShow() {
    if (this.data.allCases.length === 0) {
      this.loadCaseList()
    }
  },

  // 加载案例列表
  async loadCaseList(refresh = false) {
    if (this.data.loading) return
    
    this.setData({ loading: true })
    
    if (refresh) {
      this.setData({ page: 1, hasMore: true, useLocalData: false })
    }

    try {
      const params = {
        page: refresh ? 1 : this.data.page,
        limit: this.data.pageSize
      }
      
      if (this.data.countryTab > 0) {
        params.country = this.data.countryTabs[this.data.countryTab]
      }
      if (this.data.degreeTab > 0) {
        params.degree = this.data.degreeTabs[this.data.degreeTab]
      }

      const res = await api.getCaseList(params)
      
      if (res.success && res.data) {
        const cases = res.data.list || []
        
        if (cases.length === 0 && refresh) {
          // API返回空数据，使用默认数据
          this.useDefaultData()
          return
        }
        
        const formattedCases = cases.map(item => this.formatCaseData(item))
        
        const featuredCases = formattedCases
          .filter(item => item.isFeatured)
          .sort((a, b) => (a.featureSort || 0) - (b.featureSort || 0))
          .slice(0, 5)
          .map((item, index) => ({
            ...item,
            bgColor: this.parseBgColor(item.featureBg, index)
          }))
        
        if (refresh) {
          this.setData({
            allCases: formattedCases,
            caseList: formattedCases,
            featuredCases: featuredCases.length > 0 ? featuredCases : this.getDefaultFeaturedCases(formattedCases),
            page: 2,
            hasMore: cases.length >= this.data.pageSize,
            useLocalData: false
          })
        } else {
          const allCases = [...this.data.allCases, ...formattedCases]
          this.setData({
            allCases: allCases,
            caseList: allCases,
            featuredCases: this.data.featuredCases.length > 0 ? this.data.featuredCases : (featuredCases.length > 0 ? featuredCases : this.getDefaultFeaturedCases(allCases)),
            page: this.data.page + 1,
            hasMore: cases.length >= this.data.pageSize
          })
        }
        
        this.applyFilter()
      } else {
        throw new Error(res.message || '接口返回错误')
      }
    } catch (error) {
      console.error('加载案例列表失败:', error)
      
      // API调用失败，使用默认数据
      if (refresh || this.data.allCases.length === 0) {
        this.useDefaultData()
      }
    } finally {
      this.setData({ loading: false })
      wx.stopPullDownRefresh()
    }
  },

  // 使用默认本地数据
  useDefaultData() {
    console.log('使用本地默认案例数据')
    const formattedCases = DEFAULT_CASES.map(item => ({
      ...item,
      bgColor: this.getFeaturedBgColor(item.id)
    }))
    
    const featuredCases = formattedCases
      .filter(item => item.isFeatured)
      .slice(0, 3)
      .map((item, index) => ({
        ...item,
        bgColor: this.getFeaturedBgColor(index)
      }))
    
    this.setData({
      allCases: formattedCases,
      caseList: formattedCases,
      featuredCases: featuredCases,
      useLocalData: true,
      hasMore: false
    })
    
    wx.showToast({
      title: '使用演示数据',
      icon: 'none',
      duration: 2000
    })
  },

  // 格式化案例数据
  formatCaseData(item) {
    const admissionResult = item.admission_result || ''
    const parts = admissionResult.split(/[\s\-]+/)
    const school = parts[0] || item.school || '知名院校'
    const major = parts.slice(1).join(' ') || item.major || item.target_major || '热门专业'
    
    let degree = '硕士'
    if (admissionResult.includes('本科') || item.degree === '本科') {
      degree = '本科'
    } else if (admissionResult.includes('博士') || item.degree === '博士') {
      degree = '博士'
    }
    
    const country = item.target_country || item.country || '其他'
    
    return {
      id: item.id,
      studentName: item.student_name || '优秀学员',
      title: item.title || `${item.student_name || '学员'}的${school}录取案例`,
      background: item.background || '优秀背景',
      school: school,
      major: major,
      degree: degree,
      country: country,
      highlight: item.feature_highlight || item.highlight || '成功录取',
      isFeatured: item.is_featured === 1,
      featureSort: item.feature_sort,
      featureBg: item.feature_bg,
      cover: item.cover,
      originalData: item
    }
  },

  // 获取默认精选案例
  getDefaultFeaturedCases(cases) {
    return cases
      .slice(0, 3)
      .map((item, index) => ({
        ...item,
        bgColor: this.getFeaturedBgColor(index)
      }))
  },

  // 解析后台设置的背景色
  parseBgColor(featureBg, index) {
    if (!featureBg) {
      return this.getFeaturedBgColor(index)
    }
    
    const colorMap = {
      'from-blue-500 to-cyan-600': 'linear-gradient(135deg, #3b82f6 0%, #0891b2 100%)',
      'from-violet-500 to-purple-600': 'linear-gradient(135deg, #8b5cf6 0%, #9333ea 100%)',
      'from-amber-500 to-orange-600': 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
      'from-emerald-500 to-teal-600': 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
      'from-rose-500 to-pink-600': 'linear-gradient(135deg, #f43f5e 0%, #db2777 100%)',
      'from-indigo-500 to-blue-600': 'linear-gradient(135deg, #6366f1 0%, #2563eb 100%)'
    }
    
    return colorMap[featureBg] || this.getFeaturedBgColor(index)
  },

  // 获取精选卡片背景色
  getFeaturedBgColor(index) {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    ]
    return colors[index % colors.length]
  },

  // 应用筛选
  applyFilter() {
    let filtered = this.data.allCases
    
    if (this.data.countryTab > 0) {
      const country = this.data.countryTabs[this.data.countryTab]
      filtered = filtered.filter(item => item.country === country)
    }
    
    if (this.data.degreeTab > 0) {
      const degree = this.data.degreeTabs[this.data.degreeTab]
      filtered = filtered.filter(item => item.degree === degree)
    }
    
    this.setData({ caseList: filtered })
  },

  switchCountryTab(e) {
    const index = e.currentTarget.dataset.index
    this.setData({ countryTab: index }, () => {
      this.applyFilter()
    })
  },

  switchDegreeTab(e) {
    const index = e.currentTarget.dataset.index
    this.setData({ degreeTab: index }, () => {
      this.applyFilter()
    })
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    if (this.data.useLocalData) {
      // 使用本地数据时，显示提示
      wx.showToast({
        title: '演示数据，无详情',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: `/pages/case/detail/case-detail?id=${id}`
    })
  },

  onPullDownRefresh() {
    this.loadCaseList(true)
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading && !this.data.useLocalData) {
      this.loadCaseList()
    }
  }
})
