// pages/about/about.js
const api = require('../../utils/api.js')

Page({
  data: {
    companyInfo: {
      name: '华南留学',
      slogan: '专业留学服务，助您圆梦名校',
      description: '华南留学是一家专业的国际教育咨询机构，致力于帮助学生进入世界顶尖学府。我们提供香港、新加坡、英国、澳洲等国家和地区的留学申请服务。',
      founded: '2009年',
      headquarters: '深圳'
    },
    contactInfo: {
      phone: '400-888-8888',
      email: 'contact@huananliu.com',
      address: '深圳市福田区中心商务大厦',
      workTime: '周一至周日 9:00-21:00'
    },
    version: '1.0.0',
    features: [
      { icon: '🎯', title: '专业专注', desc: '深耕留学行业15年' },
      { icon: '🌍', title: '全球资源', desc: '覆盖100+顶尖院校' },
      { icon: '👨‍🎓', title: '精英团队', desc: '200+资深顾问' },
      { icon: '✅', title: '高成功率', desc: '98%录取成功率' }
    ],
    loading: false
  },

  onLoad() {
    // 加载配置信息
    this.loadConfig()
  },

  // 加载配置信息
  loadConfig() {
    this.setData({ loading: true })
    
    const app = getApp()
    const baseUrl = app.globalData.baseUrl || 'http://localhost:3001/api'
    
    wx.request({
      url: baseUrl + '/config/public',
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          const config = res.data.data
          
          this.setData({
            companyInfo: {
              name: config.site_name || '华南留学',
              slogan: config.site_slogan || '专业留学服务，助您圆梦名校',
              description: config.seo_description || this.data.companyInfo.description,
              founded: '2009年',
              headquarters: '广州'
            },
            contactInfo: {
              phone: config.phone || '400-888-8888',
              email: config.email || 'contact@huananliu.com',
              address: config.address_full || config.address || '广州市天河区',
              workTime: config.business_hours || '周一至周日 9:00-21:00'
            },
            loading: false
          })
        } else {
          this.setData({ loading: false })
        }
      },
      fail: (err) => {
        console.log('获取配置失败:', err)
        this.setData({ loading: false })
      }
    })
  },

  // 拨打电话
  makePhoneCall() {
    const phone = this.data.contactInfo.phone.replace(/-/g, '')
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  // 复制邮箱
  copyEmail() {
    wx.setClipboardData({
      data: this.data.contactInfo.email,
      success: () => {
        wx.showToast({ title: '邮箱已复制', icon: 'success' })
      }
    })
  },

  // 打开地图
  openMap() {
    const address = this.data.contactInfo.address
    wx.showModal({
      title: '导航',
      content: `地址：${address}\n\n是否复制地址用于导航？`,
      confirmText: '复制',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: address,
            success: () => {
              wx.showToast({ title: '地址已复制', icon: 'success' })
            }
          })
        }
      }
    })
  },

  // 服务条款
  showServiceTerms() {
    wx.navigateTo({
      url: '/pages/about/terms/terms'
    })
  },

  // 隐私政策
  showPrivacyPolicy() {
    wx.navigateTo({
      url: '/pages/about/privacy/privacy'
    })
  }
})
