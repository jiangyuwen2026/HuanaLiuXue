import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Spin } from 'antd';
import Layout from './components/Layout';

// 立即加载登录页（首屏）
import Login from './pages/Login';

// 懒加载其他页面
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Schools = lazy(() => import('./pages/Schools'));
const Consultants = lazy(() => import('./pages/Consultants'));
const Cases = lazy(() => import('./pages/Cases'));
const News = lazy(() => import('./pages/News'));
const Messages = lazy(() => import('./pages/Messages'));
const Appointments = lazy(() => import('./pages/Appointments'));
const Banners = lazy(() => import('./pages/Banners'));
const Config = lazy(() => import('./pages/Config'));
const Services = lazy(() => import('./pages/Services'));
const StudyAbroadApplication = lazy(() => import('./pages/StudyAbroadApplication'));
const EnglishTraining = lazy(() => import('./pages/EnglishTraining'));
const CompetitionPlanning = lazy(() => import('./pages/CompetitionPlanning'));
const CompetitionManagement = lazy(() => import('./pages/CompetitionManagement'));
const ResearchDevelopment = lazy(() => import('./pages/ResearchDevelopment'));
const About = lazy(() => import('./pages/About'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const Customers = lazy(() => import('./pages/Customers'));
const WordImportTest = lazy(() => import('./pages/WordImportTest'));

// 加载中组件
const PageLoading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" tip="页面加载中..." />
  </div>
);

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<Suspense fallback={<PageLoading />}><Dashboard /></Suspense>} />
        <Route path="schools" element={<Suspense fallback={<PageLoading />}><Schools /></Suspense>} />
        <Route path="consultants" element={<Suspense fallback={<PageLoading />}><Consultants /></Suspense>} />
        <Route path="cases" element={<Suspense fallback={<PageLoading />}><Cases /></Suspense>} />
        <Route path="news" element={<Suspense fallback={<PageLoading />}><News /></Suspense>} />
        <Route path="messages" element={<Suspense fallback={<PageLoading />}><Messages /></Suspense>} />
        <Route path="appointments" element={<Suspense fallback={<PageLoading />}><Appointments /></Suspense>} />
        <Route path="services" element={<Suspense fallback={<PageLoading />}><Services /></Suspense>} />
        <Route path="services/study-abroad" element={<Suspense fallback={<PageLoading />}><StudyAbroadApplication /></Suspense>} />
        <Route path="services/english-training" element={<Suspense fallback={<PageLoading />}><EnglishTraining /></Suspense>} />
        <Route path="services/competition" element={<Suspense fallback={<PageLoading />}><CompetitionPlanning /></Suspense>} />
        <Route path="services/competition-management" element={<Suspense fallback={<PageLoading />}><CompetitionManagement /></Suspense>} />
        <Route path="services/research" element={<Suspense fallback={<PageLoading />}><ResearchDevelopment /></Suspense>} />
        <Route path="banners" element={<Suspense fallback={<PageLoading />}><Banners /></Suspense>} />
        <Route path="config" element={<Suspense fallback={<PageLoading />}><Config /></Suspense>} />
        <Route path="about" element={<Suspense fallback={<PageLoading />}><About /></Suspense>} />
        <Route path="admin-users" element={<Suspense fallback={<PageLoading />}><AdminUsers /></Suspense>} />
        <Route path="customers" element={<Suspense fallback={<PageLoading />}><Customers /></Suspense>} />
        <Route path="word-import" element={<Suspense fallback={<PageLoading />}><WordImportTest /></Suspense>} />
      </Route>
    </Routes>
  );
}

export default App;
