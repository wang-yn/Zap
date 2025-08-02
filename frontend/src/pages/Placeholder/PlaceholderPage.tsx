import React from 'react';
import { Typography, Button } from 'antd';
import { RocketOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface PlaceholderPageProps {
  title: string;
  description?: string;
  feature?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ 
  title, 
  description = '该功能正在开发中，敬请期待...',
  feature 
}) => {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '60px 20px',
      maxWidth: 600,
      margin: '0 auto'
    }}>
      <RocketOutlined 
        style={{ 
          fontSize: 64, 
          color: '#1890ff', 
          marginBottom: 24,
          opacity: 0.6
        }} 
      />
      
      <Title level={2} style={{ marginBottom: 16 }}>
        {title}
      </Title>
      
      {feature && (
        <Paragraph style={{ 
          color: '#666', 
          fontSize: 16, 
          marginBottom: 24,
          lineHeight: 1.6
        }}>
          {feature}
        </Paragraph>
      )}
      
      <Paragraph style={{ 
        color: '#999', 
        marginBottom: 32,
        fontSize: 14
      }}>
        {description}
      </Paragraph>
      
      <Button 
        type="primary" 
        size="large"
        icon={<RocketOutlined />}
        style={{ 
          borderRadius: 8,
          height: 48,
          padding: '0 32px'
        }}
      >
        返回首页
      </Button>
    </div>
  );
};

export default PlaceholderPage; 