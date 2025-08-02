import React, { useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { type ComponentConfig, ComponentType, type DragItem, type ContainerConfig } from '../../types/editor';
import { ComponentRenderer } from './ComponentRenderer';
import { DRAG_TYPE } from './ComponentPalette';
import { generateId } from '../../utils';

/**
 * 编辑器画布属性
 */
interface EditorCanvasProps {
  components: ComponentConfig[];
  selectedComponentId: string | null;
  onComponentAdd: (component: ComponentConfig, targetId?: string) => void;
  onComponentSelect: (component: ComponentConfig) => void;
}

/**
 * 递归渲染组件树
 */
const renderComponentTree = (
  components: ComponentConfig[],
  selectedComponentId: string | null,
  onComponentSelect: (component: ComponentConfig) => void,
  onComponentAdd: (component: ComponentConfig, targetId?: string) => void
): React.ReactNode => {
  return components.map((component) => {
    const isSelected = component.id === selectedComponentId;

    // 如果是容器组件，需要递归渲染子组件
    if (component.type === ComponentType.CONTAINER) {
      const containerConfig = component as ContainerConfig;
      const children = containerConfig.children ? renderComponentTree(
        containerConfig.children,
        selectedComponentId,
        onComponentSelect,
        onComponentAdd
      ) : null;

      return (
        <DroppableContainer
          key={component.id}
          config={containerConfig}
          isSelected={isSelected}
          onComponentSelect={onComponentSelect}
          onComponentAdd={onComponentAdd}
        >
          {children}
        </DroppableContainer>
      );
    }

    // 普通组件直接渲染
    return (
      <ComponentRenderer
        key={component.id}
        config={component}
        isSelected={isSelected}
        onClick={onComponentSelect}
      />
    );
  });
};

/**
 * 可放置的容器组件
 */
interface DroppableContainerProps {
  config: ContainerConfig;
  isSelected: boolean;
  onComponentSelect: (component: ComponentConfig) => void;
  onComponentAdd: (component: ComponentConfig, targetId?: string) => void;
  children?: React.ReactNode;
}

const DroppableContainer: React.FC<DroppableContainerProps> = ({
  config,
  isSelected,
  onComponentSelect,
  onComponentAdd,
  children
}) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: DRAG_TYPE,
    drop: (item: DragItem) => {
      if (item.config && item.componentType) {
        const newComponent: ComponentConfig = {
          id: generateId(),
          type: item.componentType,
          name: `${item.componentType}_${Date.now()}`,
          props: item.config.props || {},
          style: item.config.style || {}
        } as ComponentConfig;
        onComponentAdd(newComponent, config.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop()
    })
  }));

  const dropStyle = useMemo(() => ({
    backgroundColor: isOver && canDrop ? '#e6f7ff' : 'transparent',
    border: isOver && canDrop ? '2px dashed #1890ff' : undefined
  }), [isOver, canDrop]);

  return (
    <div ref={drop} style={dropStyle}>
      <ComponentRenderer
        config={config}
        isSelected={isSelected}
        onClick={onComponentSelect}
      >
        {children}
      </ComponentRenderer>
    </div>
  );
};

/**
 * 主编辑器画布
 */
export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  components,
  selectedComponentId,
  onComponentAdd,
  onComponentSelect
}) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: DRAG_TYPE,
    drop: (item: DragItem, monitor) => {
      // 只处理直接丢到画布上的组件（不是容器内的）
      if (!monitor.didDrop() && item.config && item.componentType) {
        const newComponent: ComponentConfig = {
          id: generateId(),
          type: item.componentType,
          name: `${item.componentType}_${Date.now()}`,
          props: item.config.props || {},
          style: item.config.style || {}
        } as ComponentConfig;
        onComponentAdd(newComponent);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop()
    })
  }));

  const canvasStyle = useMemo(() => ({
    minHeight: '400px',
    width: '100%',
    padding: '16px',
    backgroundColor: isOver && canDrop ? '#f6ffed' : '#fafafa',
    border: isOver && canDrop ? '2px dashed #52c41a' : '1px solid #d9d9d9',
    borderRadius: '6px',
    position: 'relative' as const
  }), [isOver, canDrop]);

  return (
    <div ref={drop} style={canvasStyle}>
      {components.length === 0 ? (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#999',
            fontSize: '16px',
            textAlign: 'center'
          }}
        >
          拖拽组件到这里开始设计页面
        </div>
      ) : (
        renderComponentTree(
          components,
          selectedComponentId,
          onComponentSelect,
          onComponentAdd
        )
      )}
    </div>
  );
};