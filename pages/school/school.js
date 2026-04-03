// pages/school/school.js
const api = require('../../utils/api.js')

// 本地默认学校数据（API失败时使用）
const DEFAULT_SCHOOLS = [
  {
    id: 1,
    name: '香港大学',
    english_name: 'The University of Hong Kong',
    country: '香港',
    type: '公立',
    ranking: 'QS #26',
    founded: 1911,
    location: '香港岛薄扶林',
    tags: ['世界顶尖', '医学强校', '商科强校'],
    majors: ['医学', '法律', '商科', '工程'],
    logo: '/images/schools/hku.png'
  },
  {
    id: 2,
    name: '香港中文大学',
    english_name: 'The Chinese University of Hong Kong',
    country: '香港',
    type: '公立',
    ranking: 'QS #47',
    founded: 1963,
    location: '新界沙田',
    tags: ['研究型大学', '人文社科强校'],
    majors: ['中文', '翻译', '商科', '计算机'],
    logo: '/images/schools/cuhk.png'
  },
  {
    id: 3,
    name: '新加坡国立大学',
    english_name: 'National University of Singapore',
    country: '新加坡',
    type: '公立',
    ranking: 'QS #8',
    founded: 1905,
    location: '新加坡肯特岗',
    tags: ['亚洲第一', '工程强校', '计算机强校'],
    majors: ['计算机', '工程', '商科', '法学'],
    logo: '/images/schools/nus.png'
  },
  {
    id: 4,
    name: '南洋理工大学',
    english_name: 'Nanyang Technological University',
    country: '新加坡',
    type: '公立',
    ranking: 'QS #26',
    founded: 1981,
    location: '新加坡裕廊西',
    tags: ['年轻大学', '工程强校', '材料科学强校'],
    majors: ['材料科学', '工程', '商科', '传媒'],
    logo: '/images/schools/ntu.png'
  }
]

Page({
  data: {
    keyword: '',
    majorKeyword: '',
    selectedCountry: '',
    schoolList: [],
    filteredList: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    allSchoolsLoaded: false,
    showMajorSearch: false,
    majorSearchResults: [],
    useLocalData: false,
    allSchools: [] // 存储所有学校数据用于筛选
  },

  onLoad() {
    this.loadSchoolList()
  },

  onShow() {
    if (this.data.schoolList.length === 0) {
      this.loadSchoolList()
    }
  },

  // 切换专业搜索
  toggleMajorSearch() {
    const showMajorSearch = !this.data.showMajorSearch
    this.setData({
      showMajorSearch: showMajorSearch,
      majorKeyword: '',
      majorSearchResults: []
    })
  },

  // 学校名称搜索输入
  onSearchInput(e) {
    this.setData({
      keyword: e.detail.value
    })
  },

  // 专业搜索输入
  onMajorSearchInput(e) {
    this.setData({
      majorKeyword: e.detail.value
    })
  },

  // 学校搜索
  onSearch() {
    const keyword = this.data.keyword.trim()
    if (keyword) {
      // 在本地数据中搜索
      const results = this.data.allSchools.filter(school => 
        school.name.includes(keyword) || 
        (school.english_name && school.english_name.toLowerCase().includes(keyword.toLowerCase()))
      )
      this.setData({
        schoolList: results.slice(0, this.data.pageSize),
        filteredList: results,
        hasMore: results.length > this.data.pageSize,
        page: 1
      })
    } else {
      this.loadSchoolList()
    }
  },

  // 专业搜索
  async onMajorSearch() {
    const keyword = this.data.majorKeyword.trim()
    if (!keyword) {
      wx.showToast({
        title: '请输入专业关键词',
        icon: 'none'
      })
      return
    }

    this.setData({ loading: true })

    // 使用本地数据搜索专业
    const results = []
    const schoolMap = {}

    this.data.allSchools.forEach(school => {
      let matched = false
      const matchedMajors = []

      // 检查优势专业是否匹配
      if (school.majors && school.majors.length > 0) {
        school.majors.forEach(major => {
          if (major.includes(keyword)) {
            matched = true
            matchedMajors.push({
              name: major,
              type: '本科/硕士'
            })
          }
        })
      }

      // 检查tags是否匹配
      if (!matched && school.tags) {
        school.tags.forEach(tag => {
          if (tag.includes(keyword)) {
            matched = true
          }
        })
      }

      if (matched) {
        if (!schoolMap[school.id]) {
          schoolMap[school.id] = {
            schoolId: school.id,
            schoolName: school.name,
            schoolCountry: school.country,
            schoolRanking: this.extractRanking(school.ranking),
            logo: school.logo,
            majors: matchedMajors,
            programs: []
          }
        } else {
          schoolMap[school.id].majors.push(...matchedMajors)
        }
      }
    })

    const searchResults = Object.values(schoolMap)
    searchResults.sort((a, b) => {
      const aCount = a.majors.length + a.programs.length
      const bCount = b.majors.length + b.programs.length
      if (bCount !== aCount) return bCount - aCount
      return (a.schoolRanking || 999) - (b.schoolRanking || 999)
    })

    this.setData({
      majorSearchResults: searchResults.slice(0, 20),
      loading: false
    })

    if (searchResults.length === 0) {
      wx.showToast({
        title: '未找到相关专业',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: `找到${searchResults.length}所学校`,
        icon: 'success'
      })
    }
  },

  // 提取排名数字
  extractRanking(rankingStr) {
    if (!rankingStr) return 999
    const match = rankingStr.match(/#(\d+)/)
    return match ? parseInt(match[1]) : 999
  },

  // 筛选国家
  onFilterCountry(e) {
    const country = e.currentTarget.dataset.country

    if (country === '') {
      this.setData({
        selectedCountry: '',
        schoolList: this.data.allSchools.slice(0, this.data.pageSize),
        filteredList: this.data.allSchools,
        hasMore: this.data.allSchools.length > this.data.pageSize,
        page: 1
      })
    } else {
      const filteredSchools = this.data.allSchools.filter(s => s.country === country)
      this.setData({
        selectedCountry: country,
        schoolList: filteredSchools.slice(0, this.data.pageSize),
        filteredList: filteredSchools,
        hasMore: filteredSchools.length > this.data.pageSize,
        page: 1
      })
    }
  },

  // 加载学校列表
  async loadSchoolList() {
    if (this.data.loading) return

    this.setData({ loading: true })

    try {
      const res = await api.getSchoolList({
        page: 1,
        limit: 100
      })

      if (res.success && res.data && res.data.list && res.data.list.length > 0) {
        const schools = res.data.list.map(item => this.formatSchoolData(item))
        
        // 按排名排序
        schools.sort((a, b) => this.extractRanking(a.ranking) - this.extractRanking(b.ranking))

        this.setData({
          schoolList: schools.slice(0, this.data.pageSize),
          filteredList: schools,
          allSchools: schools,
          hasMore: schools.length > this.data.pageSize,
          allSchoolsLoaded: true,
          loading: false,
          useLocalData: false
        })
      } else {
        // API返回空数据，使用默认数据
        this.useDefaultData()
      }
    } catch (error) {
      console.error('加载学校列表失败:', error)
      this.useDefaultData()
    }
  },

  // 使用默认本地数据
  useDefaultData() {
    console.log('使用本地默认学校数据')
    const schools = DEFAULT_SCHOOLS
    
    this.setData({
      schoolList: schools.slice(0, this.data.pageSize),
      filteredList: schools,
      allSchools: schools,
      hasMore: schools.length > this.data.pageSize,
      allSchoolsLoaded: true,
      loading: false,
      useLocalData: true
    })

    wx.showToast({
      title: '使用演示数据',
      icon: 'none',
      duration: 2000
    })
  },

  // 格式化学校数据
  formatSchoolData(item) {
    return {
      id: item.id,
      name: item.name,
      english_name: item.english_name,
      country: item.country || '其他',
      type: item.type || '公立',
      ranking: item.ranking || item.qs_ranking || '',
      founded: item.founded || item.established_year || '-',
      location: item.location || item.city || '',
      tags: item.tags ? item.tags.split(',').map(t => t.trim()) : [],
      majors: item.majors ? item.majors.split(',').map(m => m.trim()) : 
              (item.top_majors || ['商科', '工程', '计算机']),
      logo: item.logo || item.cover || '/images/schools/default.png',
      description: item.description || '',
      originalData: item
    }
  },

  // 查看详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/school/detail/school-detail?id=${id}`
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      page: 1,
      schoolList: [],
      hasMore: true,
      allSchoolsLoaded: false,
      selectedCountry: ''
    })
    this.loadSchoolList()
    wx.stopPullDownRefresh()
  },

  // 上拉加载
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ loading: true })

      const currentList = this.data.schoolList
      const nextStart = this.data.page * this.data.pageSize
      const nextEnd = nextStart + this.data.pageSize
      const moreItems = this.data.filteredList.slice(nextStart, nextEnd)

      if (moreItems.length > 0) {
        this.setData({
          schoolList: [...currentList, ...moreItems],
          page: this.data.page + 1,
          hasMore: this.data.filteredList.length > nextEnd,
          loading: false
        })
      } else {
        this.setData({
          hasMore: false,
          loading: false
        })
      }
    }
  },

  // 导航到指定页面
  navigateTo(e) {
    const path = e.currentTarget.dataset.path
    wx.navigateTo({
      url: path
    })
  }
})
