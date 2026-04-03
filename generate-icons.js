// 图标生成脚本
// 使用方法：node generate-icons.js
// 需要：npm install sharp

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

// 颜色配置
const colors = {
  inactive: '#999999', // 未选中：灰色
  active: '#1890ff'    // 选中：蓝色
}

// 图标SVG路径配置
const icons = {
  home: {
    name: '首页',
    path: 'M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H15V16H9V22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z',
    viewBox: '0 0 24 24'
  },
  news: {
    name: '资讯',
    path: 'M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z M14 2V8H20 M16 13H8 M16 17H8 M10 9H8',
    viewBox: '0 0 24 24'
  },
  consult: {
    name: '咨询',
    path: 'M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H17L19 19V17H15C15.5304 17 16.0391 16.7893 16.4142 16.4142C16.7893 16.0391 17 15.5304 17 15V5C17 4.46957 16.7893 3.96086 16.4142 3.58579C16.0391 3.21071 15.5304 3 15 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V15C3 15.5304 3.21071 16.0391 3.58579 16.4142C3.96086 16.7893 4.46957 17 5 17H7V19L9 17H15',
    viewBox: '0 0 24 24'
  },
  user: {
    name: '我的',
    path: 'M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21 M12 11A4 4 0 1 0 12 7A4 4 0 1 0 12 11Z',
    viewBox: '0 0 24 24'
  }
}

/**
 * 生成SVG内容
 */
function generateSVG(iconKey, color) {
  const icon = icons[iconKey]
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="81" height="81" viewBox="${icon.viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="${icon.path}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
  return svgContent
}

/**
 * 生成PNG图标
 */
async function generateIconPNG(iconKey, state) {
  const color = state === 'active' ? colors.active : colors.inactive
  const filename = `${iconKey}${state === 'active' ? '-active' : ''}.png`
  const outputPath = path.join(__dirname, 'images', 'tab', filename)

  // 生成SVG
  const svgContent = generateSVG(iconKey, color)

  // 使用Sharp转换为PNG
  try {
    const buffer = Buffer.from(svgContent)
    await sharp(buffer)
      .resize(81, 81, {
        kernel: sharp.kernel.lanczos3,
        fit: 'contain'
      })
      .png()
      .toFile(outputPath)

    console.log(`✅ 成功生成: ${filename}`)
  } catch (error) {
    console.error(`❌ 生成失败 ${filename}:`, error.message)
  }
}

/**
 * 批量生成所有图标
 */
async function generateAllIcons() {
  console.log('🚀 开始生成TabBar图标...\n')

  // 确保目录存在
  const outputDir = path.join(__dirname, 'images', 'tab')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
    console.log(`📁 创建目录: ${outputDir}`)
  }

  // 生成所有图标
  const iconKeys = Object.keys(icons)
  const promises = []

  iconKeys.forEach(iconKey => {
    promises.push(generateIconPNG(iconKey, 'inactive'))
    promises.push(generateIconPNG(iconKey, 'active'))
  })

  await Promise.all(promises)

  console.log('\n🎉 所有图标生成完成！')
  console.log(`\n📍 输出目录: ${outputDir}`)
  console.log(`\n📋 生成的文件:`)
  iconKeys.forEach(key => {
    console.log(`   - ${key}.png`)
    console.log(`   - ${key}-active.png`)
  })
}

// 主函数
if (require.main === module) {
  generateAllIcons().catch(console.error)
}

module.exports = {
  generateAllIcons,
  generateIconPNG
}
