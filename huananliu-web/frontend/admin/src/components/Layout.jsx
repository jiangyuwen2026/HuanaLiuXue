import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu } from 'antd';
import {
  DashboardOutlined,
  BankOutlined,
  TeamOutlined,
  FileTextOutlined,
  ReadOutlined,
  MessageOutlined,
  CalendarOutlined,
  GlobalOutlined,
  PictureOutlined,
  SettingOutlined,
  ShoppingOutlined,
  FormOutlined,
  BookOutlined,
  TrophyOutlined,
  ExperimentOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  ThunderboltOutlined,
  UserOutlined,
  UserSwitchOutlined,
  QuestionCircleOutlined,
  FileDoneOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = AntLayout;

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 获取当前选中的菜单项（处理子菜单情况）
  const getSelectedKeys = () => {
    const pathname = location.pathname;
    // 如果是子菜单项，也返回父菜单的 key
    if (pathname === '/banners' || pathname === '/config' || pathname === '/about') {
      return [pathname, '/website'];
    }
    if (pathname.startsWith('/services/')) {
      return [pathname, '/services'];
    }
    if (pathname === '/services') {
      return ['/services', '/services'];
    }
    if (pathname === '/admin-users' || pathname === '/customers') {
      return [pathname, '/user-management'];
    }
    if (pathname === '/question-bank' || pathname === '/exam-papers') {
      return [pathname, '/question-bank'];
    }
    return [pathname];
  };
  
  const getOpenKeys = () => {
    const pathname = location.pathname;
    // 如果当前是子菜单，展开父菜单
    if (pathname === '/banners' || pathname === '/config' || pathname === '/about') {
      return ['/website'];
    }
    if (pathname.startsWith('/services/')) {
      return ['/services'];
    }
    if (pathname === '/admin-users' || pathname === '/customers') {
      return ['/user-management'];
    }
    if (pathname === '/question-bank' || pathname === '/exam-papers') {
      return ['/question-bank'];
    }
    return [];
  };
  
  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: '首页' },
    { key: '/schools', icon: <BankOutlined />, label: '学校管理' },
    { key: '/consultants', icon: <TeamOutlined />, label: '顾问管理' },
    { key: '/cases', icon: <FileTextOutlined />, label: '案例管理' },
    { key: '/news', icon: <ReadOutlined />, label: '新闻管理' },
    { key: '/messages', icon: <MessageOutlined />, label: '留言管理' },
    { key: '/appointments', icon: <CalendarOutlined />, label: '预约管理' },
    {
      key: '/services',
      icon: <ShoppingOutlined />,
      label: '产品服务',
      children: [
        { key: '/services', icon: <ShoppingOutlined />, label: '服务列表' },
        { key: '/services/study-abroad', icon: <FormOutlined />, label: '留学申请' },
        { key: '/services/english-training', icon: <BookOutlined />, label: '英语培训' },
        { key: '/services/competition', icon: <TrophyOutlined />, label: '竞赛规划' },
        { key: '/services/competition-management', icon: <TrophyOutlined />, label: '竞赛管理' },
        { key: '/services/research', icon: <ExperimentOutlined />, label: '科研提升' },
      ]
    },
    {
      key: '/website',
      icon: <GlobalOutlined />,
      label: '网站管理',
      children: [
        { key: '/banners', icon: <PictureOutlined />, label: '轮播图管理' },
        { key: '/config', icon: <SettingOutlined />, label: '网站配置' },
        { key: '/about', icon: <InfoCircleOutlined />, label: '关于我们' },
      ]
    },
    {
      key: '/user-management',
      icon: <UserSwitchOutlined />,
      label: '用户管理',
      children: [
        { key: '/admin-users', icon: <UserOutlined />, label: '后台用户' },
        { key: '/customers', icon: <TeamOutlined />, label: '注册客户' },
      ]
    },
    {
      key: '/question-bank',
      icon: <QuestionCircleOutlined />,
      label: '题库管理',
      children: [
        { key: '/question-bank', icon: <QuestionCircleOutlined />, label: '题库管理' },
        { key: '/exam-papers', icon: <FileDoneOutlined />, label: '试卷管理' },
      ]
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider theme="dark" breakpoint="lg" collapsedWidth="0">
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 18, fontWeight: 'bold' }}>
          华南留学管理后台
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={({ key }) => {
            if (key !== 'logout') {
              navigate(key);
            }
          }}
        />
        <div style={{ position: 'absolute', bottom: 50, width: '100%', textAlign: 'center' }}>
          <Menu
            theme="dark"
            mode="inline"
            items={[{ key: 'logout', icon: <LogoutOutlined />, label: '退出登录' }]}
            onClick={handleLogout}
          />
        </div>
      </Sider>
      <AntLayout>
        <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <span>欢迎，管理员</span>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: '#fff', minHeight: 280 }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
}

export default Layout;
