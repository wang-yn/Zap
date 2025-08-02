import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AppLayout from './components/Layout/AppLayout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PlaceholderPage from './pages/Placeholder/PlaceholderPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
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

function App() {
  const [selectedKey, setSelectedKey] = React.useState('dashboard');
  const { logout, initializeAuth } = useAppStore();
  
  // 初始化认证状态
  React.useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const handleMenuClick = (key: string) => {
    setSelectedKey(key);
    console.log('导航到:', key);
  };

  const handleUserMenuClick = (key: string) => {
    if (key === 'logout') {
      logout();
    }
    console.log('用户操作:', key);
  };

  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <DashboardPage />;
      case 'all-projects':
      case 'recent-projects':
      case 'favorite-projects':
        return (
          <PlaceholderPage 
            title="项目管理"
            feature={`当前页面：${
              selectedKey === 'all-projects' ? '所有项目' : 
              selectedKey === 'recent-projects' ? '最近项目' : '收藏项目'
            }`}
          />
        );
      case 'templates':
        return (
          <PlaceholderPage 
            title="模板中心"
            feature="丰富的模板库，快速开始您的项目"
          />
        );
      case 'components':
        return (
          <PlaceholderPage 
            title="组件库"
            feature="丰富的组件库，支持拖拽使用"
          />
        );
      case 'settings':
        return (
          <PlaceholderPage 
            title="系统设置"
            feature="配置您的系统偏好和账户信息"
          />
        );
      default:
        return (
          <PlaceholderPage 
            title="页面开发中"
            description="该功能正在开发中，敬请期待..."
          />
        );
    }
  };

  return (
    <ConfigProvider locale={zhCN}>
      <AntApp>
        <Router>
          <Routes>
            {/* 认证页面 */}
            <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
            
            {/* 受保护的主应用 */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout
                  selectedKey={selectedKey}
                  onMenuClick={handleMenuClick}
                  onUserMenuClick={handleUserMenuClick}
                >
                  {renderContent()}
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* 其他受保护的路由 */}
            <Route path="/projects/*" element={
              <ProtectedRoute>
                <AppLayout
                  selectedKey={selectedKey}
                  onMenuClick={handleMenuClick}
                  onUserMenuClick={handleUserMenuClick}
                >
                  {renderContent()}
                </AppLayout>
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
