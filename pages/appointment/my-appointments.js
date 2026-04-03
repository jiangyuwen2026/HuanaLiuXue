/**
 * 我的预约页
 * 对接后端API获取预约列表
 */

const api = require('../../utils/api')

Page({
  data: {
    appointmentList: [],
    loading: false
  },

  onShow() {
    this.loadAppointments()
  },

  /**
   * 加载预约列表
   */
  async loadAppointments() {
    this.setData({ loading: true })
    
    try {
      const res = await api.getMyAppointments()
      
      if (res.success && res.data) {
        const list = (res.data.list || res.data || []).map(item => ({
          ...item,
          status_text: this.getStatusText(item.status),
          created_at: this.formatTime(item.created_at)
        }))
        
        this.setData({
          appointmentList: list,
          loading: false
        })
      } else {
        this.setData({
          appointmentList: [],
          loading: false
        })
      }
    } catch (error) {
      console.error('加载预约列表失败:', error)
      this.setData({ loading: false })
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  /**
   * 获取状态文本
   */
  getStatusText(status) {
    const statusMap = {
      'pending': '待确认',
      'confirmed': '已确认',
      'completed': '已完成',
      'cancelled': '已取消'
    }
    return statusMap[status] || '待确认'
  },

  /**
   * 格式化时间
   */
  formatTime(dateStr) {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  },

  /**
   * 取消预约
   */
  async cancelAppointment(e) {
    const id = e.currentTarget.dataset.id
    
    const res = await wx.showModal({
      title: '确认取消',
      content: '确定要取消这个预约吗？',
      confirmColor: '#2C5F7C'
    })
    
    if (!res.confirm) return
    
    try {
      await api.cancelAppointment(id)
      wx.showToast({ title: '取消成功', icon: 'success' })
      this.loadAppointments()
    } catch (error) {
      wx.showToast({
        title: error.message || '取消失败',
        icon: 'none'
      })
    }
  },

  /**
   * 重新预约
   */
  rebook() {
    wx.navigateTo({
      url: '/pages/appointment/appointment'
    })
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadAppointments().then(() => {
      wx.stopPullDownRefresh()
    })
  }
})
