import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AppLayout from './components/Layout/AppLayout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import { ProjectsPage } from './pages/Projects/ProjectsPage';
import { ProjectPagesPage } from './pages/Projects/ProjectPagesPage';
import PlaceholderPage from './pages/Placeholder/PlaceholderPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import { EditorPage } from './pages/Editor/EditorPage';
import { PreviewPage } from './pages/Preview/PreviewPage';
import { useUser, useAppStore } from './store';
import './App.css';

// 受保护的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// 认证路由组件（已登录用户不能访问登录/注册页）
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useUser();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// 布局包装器组件
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { logout } = useAppStore();

  // 根据路由确定选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path.startsWith('/projects')) return 'all-projects';
    if (path === '/templates') return 'templates';
    if (path === '/components') return 'components';
    if (path === '/settings') return 'settings';
    return 'dashboard';
  };

  const handleMenuClick = (key: string) => {
    // 菜单点击现在通过路由导航处理
    console.log('导航到:', key);
  };

  const handleUserMenuClick = (key: string) => {
    if (key === 'logout') {
      logout();
    }
    console.log('用户操作:', key);
  };

  return (
    <AppLayout
      selectedKey={getSelectedKey()}
      onMenuClick={handleMenuClick}
      onUserMenuClick={handleUserMenuClick}
    >
      {children}
    </AppLayout>
  );
};

function App() {
  const { initializeAuth } = useAppStore();
  
  // 初始化认证状态
  React.useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <ConfigProvider locale={zhCN}>
      <AntApp>
        <Router>
          <Routes>
            {/* 认证页面 */}
            <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
            
            {/* 主应用路由 */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <DashboardPage />
                </LayoutWrapper>
              </ProtectedRoute>
            } />

            {/* 项目相关路由 */}
            <Route path="/projects" element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <ProjectsPage />
                </LayoutWrapper>
              </ProtectedRoute>
            } />

            {/* 项目页面管理路由 */}
            <Route path="/projects/:projectId/pages" element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <ProjectPagesPage />
                </LayoutWrapper>
              </ProtectedRoute>
            } />

            {/* 编辑器路由 */}
            <Route path="/projects/:projectId/editor" element={
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            } />

            <Route path="/projects/:projectId/pages/:pageId" element={
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            } />

            {/* 预览路由（不需要布局） */}
            <Route path="/preview/:projectId/:pageId" element={
              <ProtectedRoute>
                <PreviewPage />
              </ProtectedRoute>
            } />

            {/* 其他功能页面 */}
            <Route path="/templates" element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <PlaceholderPage 
                    title="模板中心"
                    feature="丰富的模板库，快速开始您的项目"
                  />
                </LayoutWrapper>
              </ProtectedRoute>
            } />

            <Route path="/components" element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <PlaceholderPage 
                    title="组件库"
                    feature="丰富的组件库，支持拖拽使用"
                  />
                </LayoutWrapper>
              </ProtectedRoute>
            } />

            <Route path="/settings" element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <PlaceholderPage 
                    title="系统设置"
                    feature="配置您的系统偏好和账户信息"
                  />
                </LayoutWrapper>
              </ProtectedRoute>
            } />
            
            {/* 默认路由重定向 */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 其他所有路由都重定向到dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
