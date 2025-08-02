import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Alert } from 'antd';
import { type PageConfig, type ComponentConfig, ComponentType } from '../../types/editor';
import { ComponentRenderer } from '../../components/Editor/ComponentRenderer';
import api from '../../services/api';

/**
 * 预览页面
 */
export const PreviewPage: React.FC = () => {
  const { pageId } = useParams<{ projectId: string; pageId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<PageConfig | null>(null);

  // 加载页面数据
  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!pageId) {
          throw new Error('页面ID不能为空');
        }

        const response = await api.get(`/pages/${pageId}`);
        const pageData = response.data;

        const pageConfig: PageConfig = {
          id: pageData.id,
          name: pageData.name,
          path: pageData.path,
          title: pageData.title,
          components: parseComponents(pageData.components),
          layout: parseLayout(pageData.layout)
        };

        setPage(pageConfig);
        
        // 设置页面标题
        document.title = pageConfig.title || pageConfig.name || '预览页面';
        
      } catch (error: any) {
        console.error('加载页面数据失败:', error);
        setError(error.response?.data?.message || error.message || '加载页面数据失败');
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, [pageId]);

  // 解析组件配置
  const parseComponents = (componentsData: any): ComponentConfig[] => {
    if (!componentsData || !Array.isArray(componentsData)) {
      return [];
    }

    return componentsData.map((comp: any) => ({
      id: comp.id,
      type: comp.type,
      name: comp.name,
      props: comp.props || {},
      style: comp.style || {},
      children: comp.children ? parseComponents(comp.children) : undefined
    }));
  };

  // 解析布局配置
  const parseLayout = (layoutData: any) => {
    return {
      width: layoutData?.width,
      height: layoutData?.height,
      background: layoutData?.background || '#ffffff',
      padding: layoutData?.padding || 16
    };
  };

  // 递归渲染组件树
  const renderComponents = (components: ComponentConfig[]): React.ReactNode => {
    return components.map((component) => {
      // 如果是容器组件，需要递归渲染子组件
      if (component.type === ComponentType.CONTAINER && (component as any).children) {
        const containerComponent = component as any;
        const children = renderComponents(containerComponent.children);

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

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: '#f0f2f5'
        }}
      >
        <Spin size="large" tip="加载页面中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: '#f0f2f5',
          padding: '20px'
        }}
      >
        <Alert
          message="页面加载失败"
          description={error}
          type="error"
          style={{ maxWidth: '500px' }}
        />
      </div>
    );
  }

  if (!page) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: '#f0f2f5'
        }}
      >
        <Alert
          message="页面不存在"
          description="请检查页面链接是否正确"
          type="warning"
          style={{ maxWidth: '500px' }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: page.layout.background || '#ffffff',
        padding: page.layout.padding || 16
      }}
    >
      <div
        style={{
          width: page.layout.width ? `${page.layout.width}px` : '100%',
          height: page.layout.height ? `${page.layout.height}px` : 'auto',
          margin: '0 auto',
          maxWidth: '1200px' // 设置最大宽度以避免在大屏幕上过宽
        }}
      >
        {page.components.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: '#999',
              fontSize: '16px',
              padding: '100px 20px',
              border: '1px dashed #d9d9d9',
              borderRadius: '6px',
              background: '#fafafa'
            }}
          >
            页面暂无内容
          </div>
        ) : (
          renderComponents(page.components)
        )}
      </div>

      {/* 预览模式水印 */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 1000,
          pointerEvents: 'none'
        }}
      >
        预览模式
      </div>
    </div>
  );
};