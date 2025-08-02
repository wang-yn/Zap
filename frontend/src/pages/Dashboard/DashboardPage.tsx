import React from 'react';
import { Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  return (
    <>
      {/* 欢迎区域 */}
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 12,
        color: 'white',
        marginBottom: 32
      }}>
        <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
          欢迎使用 ZAP 零代码开发平台
        </Title>
        <Title level={3} style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'normal' }}>
          5分钟内创建您的第一个应用
        </Title>
        <div style={{ marginTop: 32 }}>
          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />}
            style={{ 
              height: 48, 
              padding: '0 32px',
              fontSize: 16,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.2)',
              border: '2px solid rgba(255,255,255,0.3)'
            }}
          >
            开始创建项目
          </Button>
        </div>
      </div>

      {/* 功能卡片区域 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: 24,
        marginTop: 32
      }}>
        {/* 快速开始卡片 */}
        <div style={{ 
          padding: 24, 
          border: '1px solid #f0f0f0', 
          borderRadius: 8,
          background: '#fafafa'
        }}>
          <Title level={4} style={{ marginBottom: 16 }}>
            🚀 快速开始
          </Title>
          <p style={{ color: '#666', marginBottom: 16 }}>
            使用预设模板快速创建应用，无需从零开始
          </p>
          <Button type="link" style={{ padding: 0 }}>
            查看模板 →
          </Button>
        </div>

        {/* 可视化编辑卡片 */}
        <div style={{ 
          padding: 24, 
          border: '1px solid #f0f0f0', 
          borderRadius: 8,
          background: '#fafafa'
        }}>
          <Title level={4} style={{ marginBottom: 16 }}>
            🎨 可视化编辑
          </Title>
          <p style={{ color: '#666', marginBottom: 16 }}>
            拖拽式组件编辑，所见即所得的开发体验
          </p>
          <Button type="link" style={{ padding: 0 }}>
            开始编辑 →
          </Button>
        </div>

        {/* 代码生成卡片 */}
        <div style={{ 
          padding: 24, 
          border: '1px solid #f0f0f0', 
          borderRadius: 8,
          background: '#fafafa'
        }}>
          <Title level={4} style={{ marginBottom: 16 }}>
            ⚡ 代码生成
          </Title>
          <p style={{ color: '#666', marginBottom: 16 }}>
            一键生成高质量代码，支持多种技术栈
          </p>
          <Button type="link" style={{ padding: 0 }}>
            了解更多 →
          </Button>
        </div>
      </div>

      {/* 最近项目区域 */}
      <div style={{ marginTop: 48 }}>
        <Title level={3} style={{ marginBottom: 24 }}>
          最近项目
        </Title>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: 16
        }}>
          {/* 示例项目卡片 */}
          <div 
            className="project-card"
            style={{ 
              padding: 20, 
              border: '1px solid #e8e8e8', 
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <div style={{ 
              width: '100%', 
              height: 120, 
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              borderRadius: 6,
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 24,
              fontWeight: 'bold'
            }}>
              示例项目
            </div>
            <Title level={5} style={{ marginBottom: 8 }}>
              电商管理后台
            </Title>
            <p style={{ color: '#666', fontSize: 12, marginBottom: 12 }}>
              最后编辑：2小时前
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button size="small">编辑</Button>
              <Button size="small" type="text">预览</Button>
            </div>
          </div>

          <div 
            className="project-card"
            style={{ 
              padding: 20, 
              border: '1px solid #e8e8e8', 
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <div style={{ 
              width: '100%', 
              height: 120, 
              background: 'linear-gradient(45deg, #f093fb, #f5576c)',
              borderRadius: 6,
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 24,
              fontWeight: 'bold'
            }}>
              示例项目
            </div>
            <Title level={5} style={{ marginBottom: 8 }}>
              数据可视化面板
            </Title>
            <p style={{ color: '#666', fontSize: 12, marginBottom: 12 }}>
              最后编辑：1天前
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button size="small">编辑</Button>
              <Button size="small" type="text">预览</Button>
            </div>
          </div>

          <div style={{ 
            padding: 20, 
            border: '1px solid #e8e8e8', 
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'all 0.3s',
            borderStyle: 'dashed',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999'
          }}>
            <PlusOutlined style={{ fontSize: 32, marginBottom: 12 }} />
            <span>创建新项目</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage; 