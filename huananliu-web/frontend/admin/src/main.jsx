/**
 * ============================================================================
 * 华南留学后台管理系统 - 版本标记
 * ============================================================================
 * @version      1.0.0-FINAL
 * @release_date 2026-03-25
 * @status       FROZEN - 此版本已冻结，禁止修改
 * @description  华南留学后台管理React前端应用
 * @tech_stack   React 18 + Vite + Ant Design + React Router
 * ============================================================================
 * 修改历史：
 * - v1.0.0-FINAL (2026-03-25): 功能完成冻结版本
 * ============================================================================
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>
);
