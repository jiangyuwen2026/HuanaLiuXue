const api = require('../../../utils/api.js')

// 默认学校详情数据
const DEFAULT_SCHOOL_DETAIL = {
  id: 1,
  name: '香港大学',
  english_name: 'The University of Hong Kong',
  country: '香港',
  type: '公立',
  ranking: 'QS #26',
  founded: 1911,
  location: '香港岛薄扶林道',
  city: '香港',
  website: 'https://www.hku.hk',
  description: '香港大学是香港历史最悠久的高等教育院校，成立于1911年。作为一所世界顶尖的研究型大学，港大在教学和研究方面享有极高声誉。',
  tags: ['世界顶尖', '医学强校', '商科强校', '百年名校'],
  majors: ['医学', '法律', '商科', '工程', '计算机科学', '建筑', '教育'],
  cover: '/images/schools/hku-cover.jpg',
  logo: '/images/schools/hku.png',
  features: [
    {
      title: '学术声誉',
      content: '香港大学在2024年QS世界大学排名中位列第26位，是香港排名最高的大学。'
    },
    {
      title: '优势学科',
      content: '牙科、教育学、语言学、法律、建筑学等多个学科位列全球前列。'
    },
    {
      title: '国际化',
      content: '超过40%的学生来自香港以外地区，拥有高度国际化的校园环境。'
    }
  ]
}

Page({
  data: {
    school: null,
    loading: true,
    useLocalData: false
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      this.loadSchoolDetail(id)
    } else {
      wx.showToast({
        title: '学校ID不存在',
        icon: 'none'
      })
      wx.navigateBack()
    }
  },

  async loadSchoolDetail(id) {
    this.setData({ loading: true })

    try {
      const res = await api.getSchoolDetail(id)

      if (res.success && res.data) {
        const schoolData = this.formatSchoolDetail(res.data)
        this.setData({
          school: schoolData,
          loading: false,
          useLocalData: false
        })
      } else {
        throw new Error(res.message || '接口返回错误')
      }
    } catch (error) {
      console.error('加载学校详情失败:', error)
      
      // 使用默认数据
      this.useDefaultData()
    }
  },

  // 使用默认数据
  useDefaultData() {
    console.log('使用本地默认学校详情数据')
    this.setData({
      school: DEFAULT_SCHOOL_DETAIL,
      loading: false,
      useLocalData: true
    })

    wx.showToast({
      title: '使用演示数据',
      icon: 'none',
      duration: 2000
    })
  },

  // 格式化学校详情数据
  formatSchoolDetail(item) {
    return {
      id: item.id,
      name: item.name,
      english_name: item.english_name,
      country: item.country || '其他',
      type: item.type || '公立',
      ranking: item.ranking || item.qs_ranking || '',
      founded: item.founded || item.established_year || '-',
      location: item.location || item.address || '',
      city: item.city || '',
      website: item.website || '',
      description: item.description || item.introduction || '暂无简介',
      tags: item.tags ? item.tags.split(',').map(t => t.trim()) : [],
      majors: item.majors ? item.majors.split(',').map(m => m.trim()) : 
              (item.top_majors || ['商科', '工程', '计算机']),
      cover: item.cover || item.banner || '/images/schools/default-cover.jpg',
      logo: item.logo || '/images/schools/default.png',
      features: item.features ? (typeof item.features === 'string' ? JSON.parse(item.features) : item.features) : [],
      admission: item.admission || '申请者需具备学士学位或同等学历，雅思6.5或托福90分以上。',
      tuition: item.tuition || '请咨询具体专业学费',
      scholarships: item.scholarships || '提供多种奖学金，详情请咨询招生办公室。',
      originalData: item
    }
  },

  goToAppointment() {
    const { school } = this.data
    if (school) {
      wx.navigateTo({
        url: `/pages/appointment/appointment?schoolName=${school.name}`
      })
    }
  },

  // 预览图片
  previewImage(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.previewImage({
        urls: [url],
        current: url
      })
    }
  },

  // 复制网站链接
  copyWebsite() {
    const { school } = this.data
    if (school && school.website) {
      wx.setClipboardData({
        data: school.website,
        success: () => {
          wx.showToast({
            title: '链接已复制',
            icon: 'success'
          })
        }
      })
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    const { school } = this.data
    if (school && school.id) {
      this.loadSchoolDetail(school.id)
    }
    wx.stopPullDownRefresh()
  },

  // 分享给朋友
  onShareAppMessage() {
    const { school } = this.data
    return {
      title: school ? `${school.name} - 留学申请` : '学校详情',
      path: `/pages/school/detail/school-detail?id=${school ? school.id : ''}`
    }
  }
})
