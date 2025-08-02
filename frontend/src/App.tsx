import React from 'react';
import AppLayout from './components/Layout/AppLayout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PlaceholderPage from './pages/Placeholder/PlaceholderPage';
import './App.css';

function App() {
  const [selectedKey, setSelectedKey] = React.useState('dashboard');

  // 处理菜单点击
  const handleMenuClick = (key: string) => {
    setSelectedKey(key);
    console.log('导航到:', key);
  };

  // 处理用户菜单点击
  const handleUserMenuClick = (key: string) => {
    console.log('用户操作:', key);
  };

  // 渲染主内容区域
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
    <AppLayout
      selectedKey={selectedKey}
      onMenuClick={handleMenuClick}
      onUserMenuClick={handleUserMenuClick}
    >
      {renderContent()}
    </AppLayout>
  );
}

export default App;
