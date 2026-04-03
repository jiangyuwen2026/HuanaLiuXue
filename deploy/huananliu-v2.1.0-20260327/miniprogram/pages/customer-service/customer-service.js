// 智能客服页面逻辑
const ruleEngine = require('../../../utils/ruleEngine.js')
const aiService = require('../../../utils/aiService.js')

Page({
  data: {
    isOnline: true,
    showWelcome: false,
    isLoading: false,
    inputValue: '',
    scrollToView: '',
    messages: [],
    quickReplies: [
      '查询香港留学政策',
      '查询新加坡大学',
      '申请流程指导',
      '留学费用评估',
      '预约顾问咨询'
    ],
    robotAvatar: 'https://via.placeholder.com/80',
    userAvatar: 'https://via.placeholder.com/80',
    humanAvatar: 'https://via.placeholder.com/80',
    currentMode: 'ai', // ai/human
    showTransferModal: false,
    sessionId: ''
  },

  onLoad() {
    console.log('客服页面加载')
    this.initSession()
    this.showWelcomeMessage()
  },

  // 初始化会话
  initSession() {
    this.setData({
      sessionId: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    })
    console.log('会话ID：', this.data.sessionId)
  },

  // 显示欢迎消息
  showWelcomeMessage() {
    setTimeout(() => {
      this.setData({
        showWelcome: true
      })
      this.scrollToBottom()
    }, 500)
  },

  // 输入框输入
  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  // 发送消息
  sendMessage() {
    const content = this.data.inputValue.trim()
    if (!content) return

    // 添加用户消息
    this.addMessage({
      type: 'user',
      messageType: 'text',
      content: content,
      time: this.getCurrentTime()
    })

    // 清空输入框
    this.setData({
      inputValue: ''
    })

    // 显示加载中
    this.setData({
      isLoading: true
    })

    // 处理消息
    this.processMessage(content)
  },

  // 快捷回复
  sendQuickReply(e) {
    const content = e.currentTarget.dataset.content
    this.setData({
      inputValue: content
    })
    this.sendMessage()
  },

  // 处理消息
  async processMessage(content) {
    try {
      let response = null

      // 如果是人工模式，发送给人工客服
      if (this.data.currentMode === 'human') {
        response = await this.sendToHuman(content)
      } else {
        // 先尝试规则匹配
        response = ruleEngine.match(content)

        if (response) {
          console.log('规则匹配成功')
          response.showTransferHuman = true
        } else {
          // 规则匹配失败，使用AI
          console.log('规则匹配失败，使用AI')
          response = await aiService.query(content)
          response.showTransferHuman = true
        }
      }

      // 添加机器人回复
      this.addMessage({
        type: this.data.currentMode === 'human' ? 'human' : 'robot',
        messageType: 'text',
        content: response.content,
        time: this.getCurrentTime(),
        quickReplies: response.quickReplies || [],
        showTransferHuman: response.showTransferHuman
      })

    } catch (error) {
      console.error('处理消息失败：', error)

      // 显示错误提示
      this.addMessage({
        type: 'robot',
        messageType: 'text',
        content: '抱歉，我暂时无法回答您的问题，请稍后再试或转接人工客服。',
        time: this.getCurrentTime(),
        showTransferHuman: true
      })
    } finally {
      this.setData({
        isLoading: false
      })
    }
  },

  // 发送给人工客服
  async sendToHuman(content) {
    // 这里调用后端接口发送给人工客服
    // 暂时返回模拟回复
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          content: '您好，我是人工客服。请问有什么可以帮助您的？',
          quickReplies: []
        })
      }, 1000)
    })
  },

  // 添加消息
  addMessage(message) {
    const messages = [...this.data.messages, {
      ...message,
      id: Date.now()
    }]
    this.setData({
      messages: messages,
      scrollToView: `msg-${message.id}`
    })
  },

  // 选择图片
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]

        // 添加图片消息
        this.addMessage({
          type: 'user',
          messageType: 'image',
          content: tempFilePath,
          time: this.getCurrentTime()
        })

        // 处理图片消息
        this.processImageMessage(tempFilePath)
      }
    })
  },

  // 处理图片消息
  async processImageMessage(imagePath) {
    this.setData({
      isLoading: true
    })

    try {
      // 调用AI服务识别图片
      const response = await aiService.analyzeImage(imagePath)

      this.addMessage({
        type: 'robot',
        messageType: 'text',
        content: response.content,
        time: this.getCurrentTime(),
        showTransferHuman: true
      })
    } catch (error) {
      console.error('图片识别失败：', error)

      this.addMessage({
        type: 'robot',
        messageType: 'text',
        content: '抱歉，我无法识别这张图片，请尝试用文字描述您的问题。',
        time: this.getCurrentTime(),
        showTransferHuman: true
      })
    } finally {
      this.setData({
        isLoading: false
      })
    }
  },

  // 选择文件（文档）
  chooseFile() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        const file = res.tempFiles[0]

        wx.showToast({
          title: '文件上传中...',
          icon: 'loading'
        })

        // 这里上传文件到服务器
        // 暂时只显示文件名
        setTimeout(() => {
          this.addMessage({
            type: 'robot',
            messageType: 'text',
            content: `已收到您的文件：${file.name}\n\n请用文字描述您需要咨询的问题，我会尽力为您解答。`,
            time: this.getCurrentTime()
          })

          wx.hideToast()
        }, 1500)
      }
    })
  },

  // 预览图片
  previewImage(e) {
    const url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: [url],
      current: url
    })
  },

  // 转人工客服
  transferToHuman() {
    this.setData({
      showTransferModal: true
    })
  },

  // 确认转人工
  confirmTransfer() {
    this.setData({
      showTransferModal: false,
      currentMode: 'human',
      isLoading: true
    })

    // 添加系统消息
    this.addMessage({
      type: 'robot',
      messageType: 'text',
      content: '正在为您转接人工客服，请稍候...',
      time: this.getCurrentTime()
    })

    // 模拟转接过程
    setTimeout(() => {
      this.setData({
        isLoading: false
      })

      // 人工客服接入
      this.addMessage({
        type: 'human',
        messageType: 'text',
        content: '您好，我是人工客服。请问有什么可以帮助您的？',
        time: this.getCurrentTime()
      })
    }, 2000)
  },

  // 取消转人工
  cancelTransfer() {
    this.setData({
      showTransferModal: false
    })
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 阻止弹窗内部点击事件冒泡
  },

  // 返回
  goBack() {
    wx.navigateBack()
  },

  // 获取当前时间
  getCurrentTime() {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  },

  // 滚动到底部
  scrollToBottom() {
    this.setData({
      scrollToView: ''
    })
    setTimeout(() => {
      const lastMessage = this.data.messages[this.data.messages.length - 1]
      if (lastMessage) {
        this.setData({
          scrollToView: `msg-${lastMessage.id}`
        })
      }
    }, 100)
  }
})
