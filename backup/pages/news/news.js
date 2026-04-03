// pages/news/news.js - 最小化测试版本
const app = getApp()

console.log('news.js 开始加载...');

// 尝试加载 newsManager
let newsManager = null;
try {
  newsManager = require('../../../utils/newsManager');
  console.log('✓ newsManager 加载成功:', newsManager);
  console.log('  newsManager.test():', newsManager.test ? newsManager.test() : 'test 方法不存在');
} catch (error) {
  console.error('✗ newsManager 加载失败:', error);
  console.error('  错误信息:', error.message);
  console.error('  错误堆栈:', error.stack);
}

Page({
  data: {
    testMessage: '测试消息',
    newsList: [],
    loading: true
  },

  onLoad: function(options) {
    console.log('news 页面 onLoad');
    
    if (newsManager) {
      try {
        const result = newsManager.test();
        console.log('newsManager.test() 结果:', result);
        
        this.setData({
          testMessage: result,
          loading: false
        });
      } catch (error) {
        console.error('调用 newsManager 方法失败:', error);
        this.setData({
          testMessage: '调用失败: ' + error.message,
          loading: false
        });
      }
    } else {
      this.setData({
        testMessage: 'newsManager 未加载',
        loading: false
      });
    }
  },

  onShow: function() {
    console.log('news 页面 onShow');
  }
})

console.log('news.js 加载完成');
