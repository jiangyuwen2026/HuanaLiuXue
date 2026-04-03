// utils/util.js
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
 * 获取图片完整路径
 */
const getImgUrl = (path) => {
  return `/images/${path}`
}

/**
 * 格式化日期
 */
const formatDate = (dateStr, format = 'YYYY-MM-DD') => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return format
    .replace('YYYY', year)
    .replace('MM', formatNumber(month))
    .replace('DD', formatNumber(day))
}

/**
 * 防抖函数
 */
const debounce = (fn, delay) => {
  let timer = null
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 */
const throttle = (fn, delay) => {
  let last = 0
  return function(...args) {
    const now = Date.now()
    if (now - last > delay) {
      last = now
      fn.apply(this, args)
    }
  }
}

/**
 * 验证手机号
 */
const isValidPhone = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 验证邮箱
 */
const isValidEmail = (email) => {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)
}

/**
 * 复制到剪贴板
 */
const copyToClipboard = (text) => {
  return new Promise((resolve, reject) => {
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success'
        })
        resolve()
      },
      fail: reject
    })
  })
}

/**
 * 拨打电话
 */
const makePhoneCall = (phoneNumber) => {
  wx.showModal({
    title: '拨打电话',
    content: `是否拨打 ${phoneNumber}？`,
    success: (res) => {
      if (res.confirm) {
        wx.makePhoneCall({
          phoneNumber
        })
      }
    }
  })
}

/**
 * 显示加载
 */
const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载
 */
const hideLoading = () => {
  wx.hideLoading()
}

/**
 * 显示成功提示
 */
const showSuccess = (message) => {
  wx.showToast({
    title: message,
    icon: 'success',
    duration: 2000
  })
}

/**
 * 显示错误提示
 */
const showError = (message) => {
  wx.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  })
}

/**
 * 显示确认对话框
 */
const showModal = (content, title = '提示') => {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      success: (res) => {
        resolve(res.confirm)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

module.exports = {
  formatTime,
  formatDate,
  getImgUrl,
  debounce,
  throttle,
  isValidPhone,
  isValidEmail,
  copyToClipboard,
  makePhoneCall,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  showModal
}
