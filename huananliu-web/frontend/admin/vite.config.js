import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const proxyConfig = {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true
  },
  '/uploads': {
    target: 'http://localhost:3001',
    changeOrigin: true
  },
  // Word 导入服务代理
  '/api/import': {
    target: 'http://localhost:8081',
    changeOrigin: true
  }
};

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3002,
    proxy: proxyConfig
  },
  preview: {
    host: '0.0.0.0',
    port: 3002,
    proxy: proxyConfig
  },
  build: {
    sourcemap: false,
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // 将大型依赖单独打包
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd', '@ant-design/icons'],
          // 富文本编辑器（体积大，按需加载）
          'editor-vendor': ['react-quill']
        }
      }
    },
    chunkSizeWarningLimit: 800
  }
});
