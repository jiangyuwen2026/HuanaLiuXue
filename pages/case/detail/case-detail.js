const api = require('../../../utils/api.js')

Page({
  data: {
    caseInfo: null,
    loading: true,
    id: null,
    isCollected: false
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      this.setData({ id })
      this.loadCaseDetail(id)
    } else {
      wx.showToast({
        title: '案例ID不存在',
        icon: 'none'
      })
      wx.navigateBack()
    }
  },

  async loadCaseDetail(id) {
    this.setData({ loading: true })
    
    try {
      const res = await api.getCaseDetail(id)
      
      if (res.success && res.data) {
        const caseData = this.formatCaseDetail(res.data)
        this.setData({
          caseInfo: caseData,
          loading: false
        })
        // 检查收藏状态
        this.checkCollectStatus()
      } else {
        throw new Error(res.message || '加载失败')
      }
    } catch (error) {
      console.error('加载案例详情失败:', error)
      this.setData({ loading: false })
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 格式化案例详情数据
  formatCaseDetail(item) {
    // 解析录取结果
    const admissionResult = item.admission_result || ''
    const parts = admissionResult.split(/[\s\-]+/)
    const school = parts[0] || '知名院校'
    const major = parts.slice(1).join(' ') || item.target_major || '热门专业'
    
    // 解析学位
    let degree = '硕士'
    if (admissionResult.includes('本科') || item.degree === '本科') {
      degree = '本科'
    } else if (admissionResult.includes('博士') || item.degree === '博士') {
      degree = '博士'
    }
    
    // 国家/地区
    const country = item.target_country || '其他'
    
    // 尝试解析背景信息中的GPA和语言成绩
    const { gpa, language, university } = this.parseBackground(item)
    
    return {
      id: item.id,
      studentName: item.student_name || '优秀学员',
      title: item.title || `${item.student_name || '学员'}的录取案例`,
      degree: degree,
      result: admissionResult,
      offerSchool: school,
      offerMajor: major,
      country: country,
      qsRank: item.school_rank || '前100',
      
      // 背景信息
      background: university,
      major: item.target_major || major,
      gpa: gpa,
      language: language,
      gre: item.gre || item.gmat || '无',
      experience: item.experience || item.internship || '有相关实习/科研经历',
      
      // 申请故事
      story: item.story || item.description || `${item.student_name || '该同学'}在申请过程中展现了出色的学术能力和综合素质，最终成功获得${school}的录取。`,
      
      // 奖学金
      scholarship: item.scholarship,
      
      // 首图
      cover: item.cover,
      
      // 申请材料（默认列表）
      materials: item.materials || [
        '个人简历 (CV/Resume)',
        '个人陈述 (Personal Statement)',
        '推荐信 (Recommendation Letters)',
        '成绩单 (Transcripts)',
        '语言成绩单',
        '在读证明/学位证'
      ],
      
      // 顾问点评（从 consultant 对象或字段中获取）
      consultant: item.consultant ? {
        name: item.consultant.name || '资深顾问',
        title: item.consultant.title || '留学申请专家',
        avatar: item.consultant.avatar || ''
      } : {
        name: item.consultant_name || '资深顾问',
        title: item.consultant_title || '留学申请专家',
        avatar: item.consultant_avatar || ''
      },
      review: item.consultant_review || item.review || `这位同学在申请过程中积极配合，准备充分。通过针对性的背景提升和文书打磨，最终成功获得了理想院校的录取。`,
      
      // 原始数据
      originalData: item
    }
  },

  // 解析背景信息
  parseBackground(item) {
    let gpa = item.gpa || '优秀'
    let language = item.language_score || '雅思7.0/托福100+'
    let university = item.university || item.background || '国内知名院校'
    
    // 如果 background 字段包含 GPA 或语言成绩信息，尝试解析
    const bg = item.background || ''
    
    // 匹配 GPA
    const gpaMatch = bg.match(/GPA[\s:]*([\d.]+)/i)
    if (gpaMatch && !item.gpa) {
      gpa = gpaMatch[1]
    }
    
    // 匹配雅思/托福
    const ieltsMatch = bg.match(/雅思[\s:]*(\d[\d.]?)/i)
    const toeflMatch = bg.match(/托福[\s:]*(\d+)/i)
    if (ieltsMatch && !item.language_score) {
      language = `雅思${ieltsMatch[1]}`
    } else if (toeflMatch && !item.language_score) {
      language = `托福${toeflMatch[1]}`
    }
    
    return { gpa, language, university }
  },

  // 头像加载失败
  onAvatarError(e) {
    // 头像加载失败时不做特殊处理，使用默认占位背景
    console.log('头像加载失败')
  },

  // 预约咨询
  makeAppointment() {
    wx.navigateTo({
      url: '/pages/appointment/appointment'
    })
  },

  // 图片预览
  previewImage(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.previewImage({
        urls: [url],
        current: url
      })
    }
  },

  // 切换收藏
  toggleCollect() {
    const { id, isCollected } = this.data
    
    if (isCollected) {
      // 取消收藏
      this.cancelCollect(id)
    } else {
      // 添加收藏
      this.addCollect(id)
    }
  },

  // 添加收藏
  addCollect(id) {
    // 获取当前收藏的ID列表
    const favorites = wx.getStorageSync('favorites_case') || []
    if (!favorites.includes(id)) {
      favorites.push(id)
      wx.setStorageSync('favorites_case', favorites)
    }
    
    this.setData({ isCollected: true })
    wx.showToast({ title: '收藏成功', icon: 'success' })
  },

  // 取消收藏
  cancelCollect(id) {
    let favorites = wx.getStorageSync('favorites_case') || []
    favorites = favorites.filter(itemId => itemId !== id)
    wx.setStorageSync('favorites_case', favorites)
    
    this.setData({ isCollected: false })
    wx.showToast({ title: '取消收藏', icon: 'none' })
  },

  // 检查是否已收藏
  checkCollectStatus() {
    const { id } = this.data
    const favorites = wx.getStorageSync('favorites_case') || []
    this.setData({ isCollected: favorites.includes(parseInt(id)) })
  },

  // 下拉刷新
  onPullDownRefresh() {
    if (this.data.id) {
      this.loadCaseDetail(this.data.id)
    }
    wx.stopPullDownRefresh()
  },

  // 分享给朋友
  onShareAppMessage() {
    const caseInfo = this.data.caseInfo
    return {
      title: caseInfo ? `${caseInfo.studentName}的${caseInfo.offerSchool}录取案例` : '成功案例分享',
      path: `/pages/case/detail/case-detail?id=${this.data.id}`,
      imageUrl: caseInfo?.cover || '/images/share-case.png'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    const caseInfo = this.data.caseInfo
    return {
      title: caseInfo ? `${caseInfo.studentName}的${caseInfo.offerSchool}录取案例` : '成功案例分享',
      query: `id=${this.data.id}`,
      imageUrl: caseInfo?.cover || '/images/share-case.png'
    }
  }
})
