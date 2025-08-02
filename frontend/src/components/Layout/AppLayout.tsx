import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  PlusOutlined,
  BellOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface AppLayoutProps {
  children: React.ReactNode;
  selectedKey?: string;
  onMenuClick?: (key: string) => void;
  onUserMenuClick?: (key: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  selectedKey = 'dashboard',
  onMenuClick,
  onUserMenuClick,
}) => {
  const [collapsed, setCollapsed] = React.useState(false);

  // 侧边栏菜单项
  const sidebarMenuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: '仪表盘',
    },
    {
      key: 'projects',
      icon: <AppstoreOutlined />,
      label: '项目管理',
      children: [
        {
          key: 'all-projects',
          label: '所有项目',
        },
        {
          key: 'recent-projects',
          label: '最近项目',
        },
        {
          key: 'favorite-projects',
          label: '收藏项目',
        },
      ],
    },
    {
      key: 'templates',
      icon: <AppstoreOutlined />,
      label: '模板中心',
    },
    {
      key: 'components',
      icon: <AppstoreOutlined />,
      label: '组件库',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ];

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      label: '个人资料',
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: '账户设置',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: '退出登录',
    },
  ];

  // 处理菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    onMenuClick?.(key);
  };

  // 处理用户菜单点击
  const handleUserMenuClick = ({ key }: { key: string }) => {
    onUserMenuClick?.(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: '#001529',
        }}
      >
        <div className="logo" style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'white',
          fontSize: collapsed ? '16px' : '20px',
          fontWeight: 'bold',
          borderBottom: '1px solid #303030'
        }}>
          {collapsed ? 'Z' : 'ZAP'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={['projects']}
          items={sidebarMenuItems}
          style={{ borderRight: 0 }}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout>
        {/* 顶部导航栏 */}
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          {/* 左侧：折叠按钮和面包屑 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <Title level={4} style={{ margin: 0, marginLeft: 16 }}>
              零代码开发平台
            </Title>
          </div>

          {/* 右侧：搜索、通知、用户信息 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* 搜索框 */}
            <Button 
              type="text" 
              icon={<SearchOutlined />}
              style={{ fontSize: '16px' }}
            />
            
            {/* 通知 */}
            <Button 
              type="text" 
              icon={<BellOutlined />}
              style={{ fontSize: '16px' }}
            />

            {/* 创建项目按钮 */}
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              style={{ borderRadius: 6 }}
            >
              创建项目
            </Button>

            {/* 用户头像和下拉菜单 */}
            <Dropdown
              menu={{ 
                items: userMenuItems,
                onClick: handleUserMenuClick
              }}
              placement="bottomRight"
              arrow
            >
              <Space style={{ cursor: 'pointer', padding: '8px' }}>
                <Avatar 
                  size={32} 
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1890ff' }}
                />
                <span style={{ color: '#333' }}>开发者</span>
              </Space>
            </Dropdown>
          </div>
        </Header>

        {/* 主内容区域 */}
        <Content style={{ 
          margin: '24px', 
          padding: '24px', 
          background: '#fff', 
          borderRadius: 8,
          minHeight: 280 
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 