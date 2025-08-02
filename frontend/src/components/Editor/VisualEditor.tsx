import React, { useState, useCallback } from 'react';
import { Layout, Button, Space, Typography, message } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SaveOutlined, EyeOutlined, UndoOutlined, RedoOutlined } from '@ant-design/icons';
import { ComponentPalette } from './ComponentPalette';
import { EditorCanvas } from './EditorCanvas';
import { PropertyPanel } from './PropertyPanel';
import { PreviewModal } from './PreviewModal';
import { type ComponentConfig, type EditorState, type PageConfig } from '../../types/editor';
import { generateId } from '../../utils';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

/**
 * 编辑器属性
 */
interface VisualEditorProps {
  initialPage?: PageConfig;
  onSave?: (page: PageConfig) => void;
  onPreview?: (page: PageConfig) => void;
}

/**
 * 可视化编辑器主组件
 */
export const VisualEditor: React.FC<VisualEditorProps> = ({
  initialPage,
  onSave,
  onPreview
}) => {
  // 编辑器状态
  const [editorState, setEditorState] = useState<EditorState>(() => ({
    selectedComponentId: null,
    selectedPageId: initialPage?.id || null,
    project: null,
    history: {
      past: [],
      present: initialPage || {
        id: generateId(),
        name: '新页面',
        path: '/new-page',
        title: '新页面',
        components: [],
        layout: {
          background: '#ffffff',
          padding: 16
        }
      },
      future: []
    },
    isPreviewMode: false
  }));

  // 预览模态框状态
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // 当前页面
  const currentPage = editorState.history.present;
  const selectedComponent = currentPage?.components.find(
    comp => comp.id === editorState.selectedComponentId
  );

  // 更新历史记录
  const updateHistory = useCallback((newPage: PageConfig) => {
    setEditorState(prev => ({
      ...prev,
      history: {
        past: prev.history.present ? [...prev.history.past, prev.history.present] : [],
        present: newPage,
        future: []
      }
    }));
  }, []);

  // 添加组件
  const handleComponentAdd = useCallback((component: ComponentConfig, targetId?: string, index?: number) => {
    if (!currentPage) return;

    const newComponent = {
      ...component,
      id: generateId(),
      name: `${component.type}_${Date.now()}`
    };

    let updatedComponents: ComponentConfig[];

    if (targetId) {
      // 添加到容器内
      updatedComponents = addComponentToContainer(currentPage.components, newComponent, targetId, index);
    } else {
      // 添加到根级别
      updatedComponents = [...currentPage.components, newComponent];
    }

    const updatedPage = {
      ...currentPage,
      components: updatedComponents
    };

    updateHistory(updatedPage);
    setEditorState(prev => ({ ...prev, selectedComponentId: newComponent.id }));
    message.success(`已添加${component.type}组件`);
  }, [currentPage, updateHistory]);

  // 递归添加组件到容器
  const addComponentToContainer = (
    components: ComponentConfig[],
    newComponent: ComponentConfig,
    targetId: string,
    index?: number
  ): ComponentConfig[] => {
    return components.map(comp => {
      if (comp.id === targetId && comp.type === 'container') {
        const containerComp = comp as any;
        const children = containerComp.children || [];
        const newChildren = index !== undefined
          ? [...children.slice(0, index), newComponent, ...children.slice(index)]
          : [...children, newComponent];
        
        return {
          ...containerComp,
          children: newChildren
        };
      } else if (comp.type === 'container' && (comp as any).children) {
        return {
          ...comp,
          children: addComponentToContainer((comp as any).children, newComponent, targetId, index)
        };
      }
      return comp;
    });
  };

  // 选择组件
  const handleComponentSelect = useCallback((component: ComponentConfig) => {
    setEditorState(prev => ({ ...prev, selectedComponentId: component.id }));
  }, []);

  // 更新组件
  const handleComponentUpdate = useCallback((updatedComponent: ComponentConfig) => {
    if (!currentPage) return;

    const updatedComponents = updateComponentInTree(currentPage.components, updatedComponent);
    const updatedPage = {
      ...currentPage,
      components: updatedComponents
    };

    updateHistory(updatedPage);
  }, [currentPage, updateHistory]);

  // 递归更新组件树中的组件
  const updateComponentInTree = (
    components: ComponentConfig[],
    updatedComponent: ComponentConfig
  ): ComponentConfig[] => {
    return components.map(comp => {
      if (comp.id === updatedComponent.id) {
        return updatedComponent;
      } else if (comp.type === 'container' && (comp as any).children) {
        return {
          ...comp,
          children: updateComponentInTree((comp as any).children, updatedComponent)
        };
      }
      return comp;
    });
  };

  // 撤销
  const handleUndo = useCallback(() => {
    if (editorState.history.past.length === 0) return;

    const previous = editorState.history.past[editorState.history.past.length - 1];
    const newPast = editorState.history.past.slice(0, editorState.history.past.length - 1);

    setEditorState(prev => ({
      ...prev,
      history: {
        past: newPast,
        present: previous,
        future: prev.history.present ? [prev.history.present, ...prev.history.future] : prev.history.future
      }
    }));
  }, [editorState.history]);

  // 重做
  const handleRedo = useCallback(() => {
    if (editorState.history.future.length === 0) return;

    const next = editorState.history.future[0];
    const newFuture = editorState.history.future.slice(1);

    setEditorState(prev => ({
      ...prev,
      history: {
        past: prev.history.present ? [...prev.history.past, prev.history.present] : prev.history.past,
        present: next,
        future: newFuture
      }
    }));
  }, [editorState.history]);

  // 保存
  const handleSave = useCallback(() => {
    if (currentPage && onSave) {
      onSave(currentPage);
      message.success('保存成功');
    }
  }, [currentPage, onSave]);

  // 预览
  const handlePreview = useCallback(() => {
    if (currentPage) {
      setPreviewModalOpen(true);
      if (onPreview) {
        onPreview(currentPage);
      }
    }
  }, [currentPage, onPreview]);

  const canUndo = editorState.history.past.length > 0;
  const canRedo = editorState.history.future.length > 0;

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout style={{ height: '100vh' }}>
        {/* 顶部工具栏 */}
        <Header style={{ background: '#fff', padding: '0 16px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
            <Title level={4} style={{ margin: 0 }}>
              可视化编辑器 - {currentPage?.name || '未命名页面'}
            </Title>
            <Space>
              <Button
                icon={<UndoOutlined />}
                disabled={!canUndo}
                onClick={handleUndo}
                title="撤销"
              />
              <Button
                icon={<RedoOutlined />}
                disabled={!canRedo}
                onClick={handleRedo}
                title="重做"
              />
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
              >
                保存
              </Button>
              <Button
                icon={<EyeOutlined />}
                onClick={handlePreview}
              >
                预览
              </Button>
            </Space>
          </div>
        </Header>

        <Layout>
          {/* 左侧组件面板 */}
          <Sider
            width={280}
            style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}
          >
            <ComponentPalette />
          </Sider>

          {/* 中间画布区域 */}
          <Content style={{ background: '#fff', padding: '16px', overflow: 'auto' }}>
            <EditorCanvas
              components={currentPage?.components || []}
              selectedComponentId={editorState.selectedComponentId}
              onComponentAdd={handleComponentAdd}
              onComponentSelect={handleComponentSelect}
            />
          </Content>

          {/* 右侧属性面板 */}
          <Sider
            width={320}
            style={{ background: '#fff', borderLeft: '1px solid #f0f0f0' }}
          >
            <PropertyPanel
              selectedComponent={selectedComponent || null}
              onComponentUpdate={handleComponentUpdate}
            />
          </Sider>
        </Layout>

        {/* 预览模态框 */}
        {currentPage && (
          <PreviewModal
            open={previewModalOpen}
            onClose={() => setPreviewModalOpen(false)}
            page={currentPage}
          />
        )}
      </Layout>
    </DndProvider>
  );
};