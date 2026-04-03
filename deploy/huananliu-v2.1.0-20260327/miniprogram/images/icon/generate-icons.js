#!/usr/bin/env node

/**
 * 图标生成脚本
 * 从 SVG 模板生成 PNG 图标文件
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 项目根目录
const projectRoot = path.resolve(__dirname, '..');

// 图标配置
const iconConfig = {
  tabbar: [
    { name: 'home', type: 'normal' },
    { name: 'home', type: 'active' },
    { name: 'news', type: 'normal' },
    { name: 'news', type: 'active' },
    { name: 'consult', type: 'normal' },
    { name: 'consult', type: 'active' },
    { name: 'user', type: 'normal' },
    { name: 'user', type: 'active' }
  ],
  functions: [
    { name: 'school', color: '#2C5F7C' },
    { name: 'major', color: '#52C41A' },
    { name: 'guide', color: '#FAAD14' },
    { name: 'consult2', color: '#FF4D4F' },
    { name: 'case', color: '#722ED1' },
    { name: 'consultant', color: '#EB2F96' }
  ]
};

/**
 * 方法1: 使用 sharp 库（推荐，需要安装）
 */
function generateWithSharp() {
  try {
    const sharp = require('sharp');
    const icons = require('./svg-templates');

    console.log('🎨 使用 sharp 库生成图标...');

    // 生成 TabBar 图标
    iconConfig.tabbar.forEach(config => {
      const svg = icons.tabbar[config.name][config.type];
      const fileName = config.type === 'active' 
        ? `${config.name}-active.png` 
        : `${config.name}.png`;
      
      const outputPath = path.join(projectRoot, 'images', 'tab', fileName);
      
      sharp(Buffer.from(svg))
        .resize(81, 81)
        .png()
        .toFile(outputPath)
        .then(() => console.log(`✅ ${fileName} 已生成`))
        .catch(err => console.error(`❌ ${fileName} 生成失败:`, err.message));
    });

    // 生成功能图标
    iconConfig.functions.forEach(config => {
      const svg = icons.functions[config.name];
      const fileName = `${config.name}.png`;
      const outputPath = path.join(projectRoot, 'images', 'icon', fileName);
      
      // 修改颜色
      let coloredSvg = svg.replace(/#2C5F7C/g, config.color);
      
      sharp(Buffer.from(coloredSvg))
        .resize(96, 96)
        .png()
        .toFile(outputPath)
        .then(() => console.log(`✅ ${fileName} 已生成`))
        .catch(err => console.error(`❌ ${fileName} 生成失败:`, err.message));
    });

  } catch (error) {
    console.log('⚠️  sharp 库未安装，尝试其他方法...');
    console.log('💡 安装命令: npm install sharp');
    return false;
  }
  return true;
}

/**
 * 方法2: 使用在线转换工具的手动说明
 */
function showManualInstructions() {
  console.log('\n📋 手动生成图标指南：\n');
  console.log('1. 访问 IconPark: https://iconpark.oceanengine.com/\n');
  
  console.log('2. 搜索并下载以下图标：\n');
  
  console.log('TabBar 图标 (81×81, PNG格式):');
  console.log('  - 首页: 搜索 "home" 或 "房子"');
  console.log('  - 资讯: 搜索 "news" 或 "消息"');
  console.log('  - 咨询: 搜索 "chat" 或 "对话"');
  console.log('  - 我的: 搜索 "user" 或 "用户"\n');
  
  console.log('功能图标 (96×96, PNG格式):');
  console.log('  - 学校: 搜索 "school" 或 "学校"');
  console.log('  - 专业: 搜索 "book" 或 "书本"');
  console.log('  - 指导: 搜索 "document" 或 "文档"');
  console.log('  - 咨询: 搜索 "search" 或 "搜索"');
  console.log('  - 案例: 搜索 "case" 或 "案例"');
  console.log('  - 顾问: 搜索 "people" 或 "人物"\n');
  
  console.log('3. 在 IconPark 中：');
  console.log('   - 选择图标');
  console.log('   - 点击"下载"按钮');
  console.log('   - 选择尺寸: TabBar用81×81, 功能图标用96×96');
  console.log('   - 选择格式: PNG');
  console.log('   - 点击下载\n');
  
  console.log('4. 将下载的文件重命名并放到对应目录：');
  console.log('   images/tab/   - TabBar图标');
  console.log('   images/icon/  - 功能图标\n');
  
  console.log('📁 文件命名规范：');
  console.log('TabBar: home.png, home-active.png, news.png, news-active.png, etc.');
  console.log('功能: school.png, major.png, guide.png, etc.\n');
}

/**
 * 方法3: 使用 SVG 转 PNG 的命令行工具
 */
function tryCommandTools() {
  const tools = [
    { name: 'convert (ImageMagick)', cmd: 'convert -version' },
    { name: 'inkscape', cmd: 'inkscape --version' },
    { name: 'rsvg-convert', cmd: 'rsvg-convert --version' }
  ];
  
  for (const tool of tools) {
    try {
      execSync(tool.cmd, { stdio: 'ignore' });
      console.log(`✅ 检测到 ${tool.name}`);
      console.log(`💡 可以使用 ${tool.name} 批量转换 SVG 文件`);
      console.log('   请参考工具文档进行转换\n');
      return;
    } catch (e) {
      continue;
    }
  }
  
  console.log('⚠️  未检测到命令行转换工具\n');
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 图标生成工具\n');
  console.log('=' .repeat(50) + '\n');
  
  // 尝试使用 sharp
  const sharpSuccess = generateWithSharp();
  
  if (sharpSuccess) {
    console.log('\n✨ 图标生成完成！');
    console.log('📁 TabBar 图标位置: images/tab/');
    console.log('📁 功能图标位置: images/icon/\n');
    
    console.log('📝 下一步：');
    console.log('   1. 检查生成的图标是否符合要求');
    console.log('   2. 如需调整颜色或样式，可修改 svg-templates.js');
    console.log('   3. 重新运行此脚本\n');
  } else {
    // 尝试命令行工具
    tryCommandTools();
    
    // 显示手动指南
    showManualInstructions();
    
    console.log('💡 推荐方案：');
    console.log('   方案1: 安装 sharp 库 (npm install sharp)');
    console.log('   方案2: 从 IconPark 网站直接下载 PNG 图标');
    console.log('   方案3: 使用 Figma/Sketch 等设计工具\n');
  }
  
  console.log('=' .repeat(50));
}

// 运行主函数
main();
