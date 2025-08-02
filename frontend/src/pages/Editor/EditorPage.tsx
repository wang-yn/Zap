import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd';
import { VisualEditor } from '../../components/Editor/VisualEditor';
import { type PageConfig, type ComponentConfig } from '../../types/editor';
import api from '../../services/api';

/**
 * 编辑器页面
 */
export const EditorPage: React.FC = () => {
  const { projectId, pageId } = useParams<{ projectId: string; pageId?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageConfig | null>(null);

  // 加载页面数据
  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        
        if (pageId) {
          // 编辑现有页面
          const response = await api.get(`/pages/${pageId}`);
          const pageData = response.data;
          
          const page: PageConfig = {
            id: pageData.id,
            name: pageData.name,
            path: pageData.path,
            title: pageData.title,
            components: parseComponents(pageData.components),
            layout: parseLayout(pageData.layout)
          };
          
          setCurrentPage(page);
        } else {
          // 创建新页面
          const newPage: PageConfig = {
            id: `temp_${Date.now()}`,
            name: '新页面',
            path: `/page-${Date.now()}`,
            title: '新页面',
            components: [],
            layout: {
              background: '#ffffff',
              padding: 16
            }
          };
          
          setCurrentPage(newPage);
        }
      } catch (error) {
        console.error('加载页面数据失败:', error);
        message.error('加载页面数据失败');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadPageData();
    }
  }, [projectId, pageId, navigate]);

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

  // 保存页面
  const handleSave = async (page: PageConfig) => {
    try {
      const pageData = {
        name: page.name,
        path: page.path,
        title: page.title,
        projectId: projectId,
        components: page.components,
        layout: page.layout,
        isPublished: false
      };

      if (pageId && pageId !== page.id) {
        // 更新现有页面
        await api.put(`/pages/${pageId}`, pageData);
        message.success('页面保存成功');
      } else {
        // 创建新页面
        const response = await api.post('/pages', pageData);
        const newPageId = response.data.id;
        
        // 更新URL为编辑模式
        navigate(`/editor/${projectId}/${newPageId}`, { replace: true });
        
        // 更新当前页面ID
        setCurrentPage(prev => prev ? { ...prev, id: newPageId } : null);
        message.success('页面创建成功');
      }
    } catch (error: any) {
      console.error('保存页面失败:', error);
      const errorMessage = error.response?.data?.message || '保存页面失败';
      message.error(errorMessage);
    }
  };

  // 预览页面
  const handlePreview = (page: PageConfig) => {
    // 打开新窗口进行预览
    const previewUrl = `/preview/${projectId}/${page.id}`;
    window.open(previewUrl, '_blank');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (!currentPage) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        页面数据加载失败
      </div>
    );
  }

  return (
    <VisualEditor
      initialPage={currentPage}
      onSave={handleSave}
      onPreview={handlePreview}
    />
  );
};