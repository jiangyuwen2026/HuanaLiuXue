// 图标 SVG 模板 - 基于 IconPark 风格

const icons = {
  // TabBar 图标
  tabbar: {
    home: {
      normal: `<svg width="81" height="81" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.00001 20.0001L24 4.00012L43 20.0001V42.0001C43 43.1047 42.1046 44.0001 41 44.0001H31V28.0001H17V44.0001H7.00001C5.89544 44.0001 5.00001 43.1047 5.00001 42.0001V20.0001Z" stroke="#999999" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      active: `<svg width="81" height="81" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.00001 20.0001L24 4.00012L43 20.0001V42.0001C43 43.1047 42.1046 44.0001 41 44.0001H31V28.0001H17V44.0001H7.00001C5.89544 44.0001 5.00001 43.1047 5.00001 42.0001V20.0001Z" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
    },
    news: {
      normal: `<svg width="81" height="81" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M36 6H12C9.79086 6 8 7.79086 8 10V38C8 40.2091 9.79086 42 12 42H36C38.2091 42 40 40.2091 40 38V10C40 7.79086 38.2091 6 36 6Z" stroke="#999999" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18 16H30" stroke="#999999" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18 24H30" stroke="#999999" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18 32H24" stroke="#999999" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      active: `<svg width="81" height="81" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M36 6H12C9.79086 6 8 7.79086 8 10V38C8 40.2091 9.79086 42 12 42H36C38.2091 42 40 40.2091 40 38V10C40 7.79086 38.2091 6 36 6Z" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18 16H30" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18 24H30" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18 32H24" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
    },
    consult: {
      normal: `<svg width="81" height="81" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M42 30C42 31.0609 41.5786 32.0783 40.8284 32.8284C40.0783 33.5786 39.0609 34 38 34H34L38 38V34H30C31.0609 34 32.0783 33.5786 32.8284 32.8284C33.5786 32.0783 34 31.0609 34 30V10C34 8.93913 33.5786 7.92172 32.8284 7.17157C32.0783 6.42143 31.0609 6 30 6H10C8.93913 6 7.92172 6.42143 7.17157 7.17157C6.42143 7.92172 6 8.93913 6 10V30C6 31.0609 6.42143 32.0783 7.17157 32.8284C7.92172 33.5786 8.93913 34 10 34H14V38L18 34H30" stroke="#999999" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      active: `<svg width="81" height="81" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M42 30C42 31.0609 41.5786 32.0783 40.8284 32.8284C40.0783 33.5786 39.0609 34 38 34H34L38 38V34H30C31.0609 34 32.0783 33.5786 32.8284 32.8284C33.5786 32.0783 34 31.0609 34 30V10C34 8.93913 33.5786 7.92172 32.8284 7.17157C32.0783 6.42143 31.0609 6 30 6H10C8.93913 6 7.92172 6.42143 7.17157 7.17157C6.42143 7.92172 6 8.93913 6 10V30C6 31.0609 6.42143 32.0783 7.17157 32.8284C7.92172 33.5786 8.93913 34 10 34H14V38L18 34H30" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
    },
    user: {
      normal: `<svg width="81" height="81" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M42 42V38C42 35.8783 41.1571 33.8434 39.6569 32.3431C38.1566 30.8429 36.1217 30 34 30H14C11.8783 30 9.84344 30.8429 8.34315 32.3431C6.84286 33.8434 6 35.8783 6 38V42" stroke="#999999" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="24" cy="14" r="8" stroke="#999999" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      active: `<svg width="81" height="81" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M42 42V38C42 35.8783 41.1571 33.8434 39.6569 32.3431C38.1566 30.8429 36.1217 30 34 30H14C11.8783 30 9.84344 30.8429 8.34315 32.3431C6.84286 33.8434 6 35.8783 6 38V42" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="24" cy="14" r="8" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
    }
  },

  // 功能入口图标 (96x96, 使用品牌色 #2C5F7C)
  functions: {
    school: `<svg width="96" height="96" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 18L24 28L42 18M24 28V44M6 18V30C6 30 10 42 24 42C38 42 42 30 42 30V18" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M24 4L4 14L24 24L44 14L24 4Z" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    major: `<svg width="96" height="96" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24 4V44" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 14V34C4 34 8 44 24 44C40 44 44 34 44 34V14" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 14C4 14 8 24 24 24C40 24 44 14 44 14" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="24" cy="10" r="4" fill="#2C5F7C"/>
</svg>`,
    guide: `<svg width="96" height="96" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M36 8H12C9.79086 8 8 9.79086 8 12V40C8 42.2091 9.79086 44 12 44H36C38.2091 44 40 42.2091 40 40V12C40 9.79086 38.2091 8 36 8Z" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 20H32" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 28H28" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 36H24" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    consult2: `<svg width="96" height="96" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M38 24C38 31.732 31.732 38 24 38C16.268 38 10 31.732 10 24C10 16.268 16.268 10 24 10C31.732 10 38 16.268 38 24Z" stroke="#2C5F7C" stroke-width="4"/>
<path d="M34 34L42 42" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    case: `<svg width="96" height="96" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M38 12V6H10V12" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 12V42H42V12H6Z" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 20H22" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 28H26" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 36H22" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="34" cy="34" r="6" fill="#2C5F7C"/>
</svg>`,
    consultant: `<svg width="96" height="96" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24 4C15.7157 4 9 10.7157 9 19V25C9 25.5523 9.44772 26 10 26H16C16.5523 26 17 25.5523 17 25V19C17 15.134 20.134 12 24 12C27.866 12 31 15.134 31 19V25C31 25.5523 31.4477 26 32 26H38C38.5523 26 39 25.5523 39 25V19C39 10.7157 32.2843 4 24 4Z" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 26V42" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M34 26V42" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 34C9 34 14 44 24 44C34 44 39 34 39 34" stroke="#2C5F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
  }
};

module.exports = icons;
