/**
 * 编辑器组件配置
 */

// API 基础 URL - 根据环境自动选择
const getApiBaseUrl = () => {
  // 开发环境：通过 Vite 代理访问
  // 生产环境：使用相对路径
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

// 默认显示模式
export const DEFAULT_DISPLAY_MODE = 'pages';

// 页面尺寸配置（A4）
export const PAGE_CONFIG = {
  width: 794,       // px (210mm at 96dpi)
  height: 1123,     // px (297mm at 96dpi)
  padding: {
    top: 60,
    right: 80,
    bottom: 60,
    left: 80
  }
};
