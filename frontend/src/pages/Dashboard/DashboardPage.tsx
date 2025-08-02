import React from 'react';
import { Button, Typography, Card, Row, Col, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

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

      {/* 添加更多内容来测试滚动 */}
      <Divider />
      
      <Title level={3}>平台特性</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card title="零代码开发" bordered={false}>
            <Paragraph>
              无需编写任何代码，通过可视化界面快速构建应用。支持拖拽式组件编辑，
              所见即所得的开发体验，让非技术人员也能轻松创建专业级应用。
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card title="模板中心" bordered={false}>
            <Paragraph>
              丰富的模板库，涵盖电商、管理后台、数据可视化等多种场景。
              一键使用模板，快速开始项目开发，大幅提升开发效率。
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card title="组件库" bordered={false}>
            <Paragraph>
              海量组件库，包含基础组件、业务组件、图表组件等。
              支持组件自定义和扩展，满足各种业务需求。
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Title level={3}>技术优势</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Card title="高性能" bordered={false}>
            <Paragraph>
              • 基于React 18和TypeScript构建，性能优异<br/>
              • 虚拟化渲染，支持大量数据展示<br/>
              • 代码分割和懒加载，优化首屏加载速度<br/>
              • 缓存机制，提升用户体验
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card title="可扩展" bordered={false}>
            <Paragraph>
              • 插件化架构，支持功能扩展<br/>
              • 自定义组件开发，满足特殊需求<br/>
              • API集成能力，连接第三方服务<br/>
              • 多租户支持，企业级部署
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Title level={3}>使用指南</Title>
      <Card bordered={false}>
        <Paragraph>
          <strong>第一步：</strong>注册账号并登录平台<br/>
          <strong>第二步：</strong>选择模板或创建空白项目<br/>
          <strong>第三步：</strong>使用可视化编辑器设计页面<br/>
          <strong>第四步：</strong>配置数据源和业务逻辑<br/>
          <strong>第五步：</strong>预览和发布应用
        </Paragraph>
      </Card>

      {/* 添加更多测试内容 */}
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} style={{ marginTop: 32 }}>
          <Title level={4}>测试内容 {index + 1}</Title>
          <Paragraph>
            这是为了测试滚动功能而添加的额外内容。当内容较多时，
            只有右侧的内容区域应该可以滚动，左侧导航栏和顶部导航栏应该保持固定。
          </Paragraph>
          <div style={{ 
            height: 200, 
            background: `linear-gradient(45deg, #${Math.floor(Math.random()*16777215).toString(16)}, #${Math.floor(Math.random()*16777215).toString(16)})`,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold'
          }}>
            测试区块 {index + 1}
          </div>
        </div>
      ))}
    </>
  );
};

export default DashboardPage; 