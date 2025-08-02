import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AppLayout from './components/Layout/AppLayout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PlaceholderPage from './pages/Placeholder/PlaceholderPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import './App.css';

// 简单的认证状态管理
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  
  React.useEffect(() => {
    // 检查本地存储中的token
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('auth_token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};

// 受保护的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const [selectedKey, setSelectedKey] = React.useState('dashboard');
  const { logout } = useAuth();

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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* 受保护的主应用 */}
            <Route path="/*" element={
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
          </Routes>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
