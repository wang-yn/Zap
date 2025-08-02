import React from 'react';
import { Card, Typography, Space } from 'antd';
import { useDrag } from 'react-dnd';
import { 
  FontSizeOutlined, 
  ControlOutlined, 
  PictureOutlined, 
  LineOutlined,
  BorderOutlined,
  FormOutlined
} from '@ant-design/icons';
import { ComponentType, type DragItem } from '../../types/editor';

const { Text } = Typography;

/**
 * 拖拽项目常量
 */
const DRAG_TYPE = 'component';

/**
 * 组件定义
 */
interface ComponentDef {
  type: ComponentType;
  name: string;
  icon: React.ReactNode;
  description: string;
  defaultConfig: any;
}

const COMPONENT_DEFINITIONS: ComponentDef[] = [
  {
    type: ComponentType.TEXT,
    name: '文本',
    icon: <FontSizeOutlined />,
    description: '显示文本内容',
    defaultConfig: {
      props: {
        content: '文本内容',
        fontSize: 14,
        color: '#000',
        textAlign: 'left'
      },
      style: {
        margin: '4px'
      }
    }
  },
  {
    type: ComponentType.BUTTON,
    name: '按钮',
    icon: <ControlOutlined />,
    description: '可点击的按钮',
    defaultConfig: {
      props: {
        text: '按钮',
        type: 'default',
        size: 'middle'
      },
      style: {
        margin: '4px'
      }
    }
  },
  {
    type: ComponentType.INPUT,
    name: '输入框',
    icon: <FormOutlined />,
    description: '文本输入框',
    defaultConfig: {
      props: {
        placeholder: '请输入',
        type: 'text',
        size: 'middle'
      },
      style: {
        margin: '4px'
      }
    }
  },
  {
    type: ComponentType.IMAGE,
    name: '图片',
    icon: <PictureOutlined />,
    description: '显示图片',
    defaultConfig: {
      props: {
        src: 'https://via.placeholder.com/150x100?text=Image',
        alt: '图片',
        width: 150,
        height: 100,
        fit: 'cover'
      },
      style: {
        margin: '4px'
      }
    }
  },
  {
    type: ComponentType.CONTAINER,
    name: '容器',
    icon: <BorderOutlined />,
    description: '布局容器',
    defaultConfig: {
      props: {
        layout: 'vertical',
        justify: 'start',
        align: 'start',
        gap: 8,
        padding: 16
      },
      style: {
        margin: '4px',
        minHeight: '60px',
        minWidth: '100px'
      }
    }
  },
  {
    type: ComponentType.DIVIDER,
    name: '分割线',
    icon: <LineOutlined />,
    description: '分割线',
    defaultConfig: {
      props: {
        orientation: 'center',
        type: 'horizontal',
        dashed: false
      },
      style: {
        margin: '4px'
      }
    }
  }
];

/**
 * 可拖拽的组件项
 */
interface DraggableComponentItemProps {
  componentDef: ComponentDef;
}

const DraggableComponentItem: React.FC<DraggableComponentItemProps> = ({ componentDef }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DRAG_TYPE,
    item: (): DragItem => ({
      type: DRAG_TYPE,
      componentType: componentDef.type,
      config: componentDef.defaultConfig
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab'
      }}
    >
      <Card
        size="small"
        hoverable
        style={{
          marginBottom: 8,
          border: '1px solid #d9d9d9'
        }}
        bodyStyle={{ padding: '8px 12px' }}
      >
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <Space>
            {componentDef.icon}
            <Text strong>{componentDef.name}</Text>
          </Space>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {componentDef.description}
          </Text>
        </Space>
      </Card>
    </div>
  );
};

/**
 * 组件面板
 */
export const ComponentPalette: React.FC = () => {
  return (
    <div style={{ padding: '16px', height: '100%', overflow: 'auto' }}>
      <Typography.Title level={5} style={{ marginBottom: 16 }}>
        组件库
      </Typography.Title>
      <div>
        {COMPONENT_DEFINITIONS.map((componentDef) => (
          <DraggableComponentItem
            key={componentDef.type}
            componentDef={componentDef}
          />
        ))}
      </div>
    </div>
  );
};

export { DRAG_TYPE };