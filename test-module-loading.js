/**
 * 模块加载测试脚本
 * 用于测试 utils 模块是否能正常加载
 */

console.log('========================================');
console.log('开始测试模块加载...');
console.log('========================================\n');

// 测试 1: 加载 dataManager
console.log('测试 1: 加载 dataManager 模块...');
try {
  const dataManager = require('./utils/dataManager');
  console.log('✓ dataManager 模块加载成功');
  console.log('  导出的函数:', Object.keys(dataManager));
  
  // 测试 getAllUniversities 函数
  if (typeof dataManager.getAllUniversities === 'function') {
    const universities = dataManager.getAllUniversities();
    console.log('  ✓ getAllUniversities() 可用，返回', universities.length, '所学校');
  } else {
    console.log('  ✗ getAllUniversities() 不可用');
  }
  
} catch (error) {
  console.log('✗ dataManager 模块加载失败:', error.message);
  console.log('  错误堆栈:', error.stack);
}

console.log('\n测试 2: 加载 newsManager 模块...');
try {
  const newsManager = require('./utils/newsManager');
  console.log('✓ newsManager 模块加载成功');
  console.log('  导出的函数:', Object.keys(newsManager));
  
  // 测试 getAllNews 函数
  if (typeof newsManager.getAllNews === 'function') {
    const news = newsManager.getAllNews();
    console.log('  ✓ getAllNews() 可用，返回', news.length, '条新闻');
  } else {
    console.log('  ✗ getAllNews() 不可用');
  }
  
} catch (error) {
  console.log('✗ newsManager 模块加载失败:', error.message);
  console.log('  错误堆栈:', error.stack);
}

console.log('\n测试 3: 加载 universityData 模块...');
try {
  const universityData = require('./utils/universityData');
  console.log('✓ universityData 模块加载成功');
  console.log('  导出的数据:', Object.keys(universityData));
  
  // 检查数据结构
  if (universityData.hongKong) {
    console.log('  ✓ hongKong 数据存在，包含', universityData.hongKong.length, '所学校');
  }
  if (universityData.singapore) {
    console.log('  ✓ singapore 数据存在，包含', universityData.singapore.length, '所学校');
  }
  
} catch (error) {
  console.log('✗ universityData 模块加载失败:', error.message);
  console.log('  错误堆栈:', error.stack);
}

console.log('\n========================================');
console.log('模块加载测试完成！');
console.log('========================================');
