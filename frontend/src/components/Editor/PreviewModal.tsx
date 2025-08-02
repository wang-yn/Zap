import React from 'react';
import { Modal, Layout, Typography } from 'antd';
import { type ComponentConfig, type PageConfig, ComponentType } from '../../types/editor';
import { ComponentRenderer } from './ComponentRenderer';

const { Header, Content } = Layout;
const { Title } = Typography;

/**
 * 预览模式属性
 */
interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  page: PageConfig;
}

/**
 * 递归渲染组件树（预览模式）
 */
const renderPreviewComponents = (components: ComponentConfig[]): React.ReactNode => {
  return components.map((component) => {
    // 如果是容器组件，需要递归渲染子组件
    if (component.type === ComponentType.CONTAINER && (component as any).children) {
      const containerComponent = component as any;
      const children = renderPreviewComponents(containerComponent.children);
      
      return (
        <ComponentRenderer
          key={component.id}
          config={component}
          isSelected={false}
          onClick={() => {}} // 预览模式不响应点击
        >
          {children}
        </ComponentRenderer>
      );
    }

    // 普通组件直接渲染
    return (
      <ComponentRenderer
        key={component.id}
        config={component}
        isSelected={false}
        onClick={() => {}} // 预览模式不响应点击
      />
    );
  });
};

/**
 * 预览模态框
 */
export const PreviewModal: React.FC<PreviewModalProps> = ({
  open,
  onClose,
  page
}) => {
  return (
    <Modal
      title="页面预览"
      open={open}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ top: 20 }}
      bodyStyle={{ padding: 0, height: 'calc(100vh - 200px)' }}
    >
      <Layout style={{ height: '100%' }}>
        <Header style={{ background: '#001529', padding: '0 16px' }}>
          <Title level={4} style={{ color: 'white', margin: 0, lineHeight: '64px' }}>
            {page.title || page.name}
          </Title>
        </Header>
        <Content
          style={{
            background: page.layout.background || '#ffffff',
            padding: page.layout.padding || 16,
            overflow: 'auto'
          }}
        >
          <div
            style={{
              width: page.layout.width ? `${page.layout.width}px` : '100%',
              height: page.layout.height ? `${page.layout.height}px` : 'auto',
              margin: '0 auto'
            }}
          >
            {page.components.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  color: '#999',
                  fontSize: '16px',
                  padding: '50px',
                  border: '1px dashed #d9d9d9',
                  borderRadius: '6px'
                }}
              >
                页面暂无内容
              </div>
            ) : (
              renderPreviewComponents(page.components)
            )}
          </div>
        </Content>
      </Layout>
    </Modal>
  );
};

/**
 * 内联预览组件（用于编辑器内的实时预览）
 */
interface InlinePreviewProps {
  page: PageConfig;
  style?: React.CSSProperties;
}

export const InlinePreview: React.FC<InlinePreviewProps> = ({
  page,
  style
}) => {
  return (
    <div
      style={{
        background: page.layout.background || '#ffffff',
        padding: page.layout.padding || 16,
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        minHeight: '200px',
        overflow: 'auto',
        ...style
      }}
    >
      <div
        style={{
          width: page.layout.width ? `${page.layout.width}px` : '100%',
          height: page.layout.height ? `${page.layout.height}px` : 'auto',
          margin: '0 auto'
        }}
      >
        {page.components.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: '#999',
              fontSize: '14px',
              padding: '30px'
            }}
          >
            页面暂无内容
          </div>
        ) : (
          renderPreviewComponents(page.components)
        )}
      </div>
    </div>
  );
};