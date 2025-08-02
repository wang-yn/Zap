import React from 'react';
import {
  Input,
  InputNumber,
  Select,
  Switch,
  ColorPicker,
  Typography,
  Space,
  Card,
  Slider
} from 'antd';
import { type ComponentConfig, ComponentType, type TextConfig, type ButtonConfig, type InputConfig, type ImageConfig, type ContainerConfig, type DividerConfig } from '../../types/editor';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

/**
 * 属性面板属性
 */
interface PropertyPanelProps {
  selectedComponent: ComponentConfig | null;
  onComponentUpdate: (updatedComponent: ComponentConfig) => void;
}

/**
 * 文本组件属性编辑器
 */
const TextPropertyEditor: React.FC<{
  config: TextConfig;
  onChange: (config: TextConfig) => void;
}> = ({ config, onChange }) => {
  const handleChange = (field: string, value: any) => {
    const updatedConfig = {
      ...config,
      props: {
        ...config.props,
        [field]: value
      }
    };
    onChange(updatedConfig);
  };

  const handleStyleChange = (field: string, value: any) => {
    const updatedConfig = {
      ...config,
      style: {
        ...config.style,
        [field]: value
      }
    };
    onChange(updatedConfig);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <div>
        <Text strong>内容</Text>
        <TextArea
          value={config.props.content}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="请输入文本内容"
          autoSize={{ minRows: 2, maxRows: 4 }}
        />
      </div>

      <div>
        <Text strong>字体大小</Text>
        <InputNumber
          value={config.props.fontSize}
          onChange={(value) => handleChange('fontSize', value)}
          min={12}
          max={48}
          style={{ width: '100%' }}
        />
      </div>

      <div>
        <Text strong>字体粗细</Text>
        <Select
          value={config.props.fontWeight}
          onChange={(value) => handleChange('fontWeight', value)}
          style={{ width: '100%' }}
        >
          <Option value="normal">正常</Option>
          <Option value="bold">粗体</Option>
          <Option value="lighter">细体</Option>
        </Select>
      </div>

      <div>
        <Text strong>文字颜色</Text>
        <ColorPicker
          value={config.props.color}
          onChange={(color) => handleChange('color', color.toHexString())}
          style={{ width: '100%' }}
        />
      </div>

      <div>
        <Text strong>对齐方式</Text>
        <Select
          value={config.props.textAlign}
          onChange={(value) => handleChange('textAlign', value)}
          style={{ width: '100%' }}
        >
          <Option value="left">左对齐</Option>
          <Option value="center">居中</Option>
          <Option value="right">右对齐</Option>
        </Select>
      </div>

      <div>
        <Text strong>外边距</Text>
        <InputNumber
          value={parseInt(config.style.margin as string) || 4}
          onChange={(value) => handleStyleChange('margin', `${value}px`)}
          min={0}
          max={50}
          style={{ width: '100%' }}
        />
      </div>
    </Space>
  );
};

/**
 * 按钮组件属性编辑器
 */
const ButtonPropertyEditor: React.FC<{
  config: ButtonConfig;
  onChange: (config: ButtonConfig) => void;
}> = ({ config, onChange }) => {
  const handleChange = (field: string, value: any) => {
    const updatedConfig = {
      ...config,
      props: {
        ...config.props,
        [field]: value
      }
    };
    onChange(updatedConfig);
  };

  const handleStyleChange = (field: string, value: any) => {
    const updatedConfig = {
      ...config,
      style: {
        ...config.style,
        [field]: value
      }
    };
    onChange(updatedConfig);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <div>
        <Text strong>按钮文字</Text>
        <Input
          value={config.props.text}
          onChange={(e) => handleChange('text', e.target.value)}
          placeholder="请输入按钮文字"
        />
      </div>

      <div>
        <Text strong>按钮类型</Text>
        <Select
          value={config.props.type}
          onChange={(value) => handleChange('type', value)}
          style={{ width: '100%' }}
        >
          <Option value="primary">主要按钮</Option>
          <Option value="default">默认按钮</Option>
          <Option value="dashed">虚线按钮</Option>
          <Option value="link">链接按钮</Option>
          <Option value="text">文字按钮</Option>
        </Select>
      </div>

      <div>
        <Text strong>按钮大小</Text>
        <Select
          value={config.props.size}
          onChange={(value) => handleChange('size', value)}
          style={{ width: '100%' }}
        >
          <Option value="large">大号</Option>
          <Option value="middle">中号</Option>
          <Option value="small">小号</Option>
        </Select>
      </div>

      <div>
        <Text strong>禁用状态</Text>
        <Switch
          checked={config.props.disabled}
          onChange={(checked) => handleChange('disabled', checked)}
        />
      </div>

      <div>
        <Text strong>外边距</Text>
        <InputNumber
          value={parseInt(config.style.margin as string) || 4}
          onChange={(value) => handleStyleChange('margin', `${value}px`)}
          min={0}
          max={50}
          style={{ width: '100%' }}
        />
      </div>
    </Space>
  );
};

/**
 * 输入框组件属性编辑器
 */
const InputPropertyEditor: React.FC<{
  config: InputConfig;
  onChange: (config: InputConfig) => void;
}> = ({ config, onChange }) => {
  const handleChange = (field: string, value: any) => {
    const updatedConfig = {
      ...config,
      props: {
        ...config.props,
        [field]: value
      }
    };
    onChange(updatedConfig);
  };

  const handleStyleChange = (field: string, value: any) => {
    const updatedConfig = {
      ...config,
      style: {
        ...config.style,
        [field]: value
      }
    };
    onChange(updatedConfig);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <div>
        <Text strong>占位符</Text>
        <Input
          value={config.props.placeholder}
          onChange={(e) => handleChange('placeholder', e.target.value)}
          placeholder="请输入占位符文字"
        />
      </div>

      <div>
        <Text strong>默认值</Text>
        <Input
          value={config.props.value}
          onChange={(e) => handleChange('value', e.target.value)}
          placeholder="请输入默认值"
        />
      </div>

      <div>
        <Text strong>输入框类型</Text>
        <Select
          value={config.props.type}
          onChange={(value) => handleChange('type', value)}
          style={{ width: '100%' }}
        >
          <Option value="text">文本</Option>
          <Option value="password">密码</Option>
          <Option value="email">邮箱</Option>
          <Option value="number">数字</Option>
        </Select>
      </div>

      <div>
        <Text strong>输入框大小</Text>
        <Select
          value={config.props.size}
          onChange={(value) => handleChange('size', value)}
          style={{ width: '100%' }}
        >
          <Option value="large">大号</Option>
          <Option value="middle">中号</Option>
          <Option value="small">小号</Option>
        </Select>
      </div>

      <div>
        <Text strong>禁用状态</Text>
        <Switch
          checked={config.props.disabled}
          onChange={(checked) => handleChange('disabled', checked)}
        />
      </div>

      <div>
        <Text strong>外边距</Text>
        <InputNumber
          value={parseInt(config.style.margin as string) || 4}
          onChange={(value) => handleStyleChange('margin', `${value}px`)}
          min={0}
          max={50}
          style={{ width: '100%' }}
        />
      </div>
    </Space>
  );
};

/**
 * 图片组件属性编辑器
 */
const ImagePropertyEditor: React.FC<{
  config: ImageConfig;
  onChange: (config: ImageConfig) => void;
}> = ({ config, onChange }) => {
  const handleChange = (field: string, value: any) => {
    const updatedConfig = {
      ...config,
      props: {
        ...config.props,
        [field]: value
      }
    };
    onChange(updatedConfig);
  };

  const handleStyleChange = (field: string, value: any) => {
    const updatedConfig = {
      ...config,
      style: {
        ...config.style,
        [field]: value
      }
    };
    onChange(updatedConfig);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <div>
        <Text strong>图片链接</Text>
        <Input
          value={config.props.src}
          onChange={(e) => handleChange('src', e.target.value)}
          placeholder="请输入图片链接"
        />
      </div>

      <div>
        <Text strong>替代文字</Text>
        <Input
          value={config.props.alt}
          onChange={(e) => handleChange('alt', e.target.value)}
          placeholder="请输入替代文字"
        />
      </div>

      <div>
        <Text strong>宽度</Text>
        <InputNumber
          value={config.props.width}
          onChange={(value) => handleChange('width', value)}
          min={50}
          max={1000}
          style={{ width: '100%' }}
        />
      </div>

      <div>
        <Text strong>高度</Text>
        <InputNumber
          value={config.props.height}
          onChange={(value) => handleChange('height', value)}
          min={50}
          max={1000}
          style={{ width: '100%' }}
        />
      </div>

      <div>
        <Text strong>适应方式</Text>
        <Select
          value={config.props.fit}
          onChange={(value) => handleChange('fit', value)}
          style={{ width: '100%' }}
        >
          <Option value="fill">填充</Option>
          <Option value="contain">包含</Option>
          <Option value="cover">覆盖</Option>
          <Option value="none">原始</Option>
          <Option value="scale-down">缩小</Option>
        </Select>
      </div>

      <div>
        <Text strong>外边距</Text>
        <InputNumber
          value={parseInt(config.style.margin as string) || 4}
          onChange={(value) => handleStyleChange('margin', `${value}px`)}
          min={0}
          max={50}
          style={{ width: '100%' }}
        />
      </div>
    </Space>
  );
};

/**
 * 容器组件属性编辑器
 */
const ContainerPropertyEditor: React.FC<{
  config: ContainerConfig;
  onChange: (config: ContainerConfig) => void;
}> = ({ config, onChange }) => {
  const handleChange = (field: string, value: any) => {
    const updatedConfig = {
      ...config,
      props: {
        ...config.props,
        [field]: value
      }
    };
    onChange(updatedConfig);
  };

  const handleStyleChange = (field: string, value: any) => {
    const updatedConfig = {
      ...config,
      style: {
        ...config.style,
        [field]: value
      }
    };
    onChange(updatedConfig);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <div>
        <Text strong>布局方向</Text>
        <Select
          value={config.props.layout}
          onChange={(value) => handleChange('layout', value)}
          style={{ width: '100%' }}
        >
          <Option value="vertical">垂直</Option>
          <Option value="horizontal">水平</Option>
        </Select>
      </div>

      <div>
        <Text strong>主轴对齐</Text>
        <Select
          value={config.props.justify}
          onChange={(value) => handleChange('justify', value)}
          style={{ width: '100%' }}
        >
          <Option value="start">开始</Option>
          <Option value="center">居中</Option>
          <Option value="end">结束</Option>
          <Option value="space-around">环绕</Option>
          <Option value="space-between">两端</Option>
        </Select>
      </div>

      <div>
        <Text strong>交叉轴对齐</Text>
        <Select
          value={config.props.align}
          onChange={(value) => handleChange('align', value)}
          style={{ width: '100%' }}
        >
          <Option value="start">开始</Option>
          <Option value="center">居中</Option>
          <Option value="end">结束</Option>
          <Option value="stretch">拉伸</Option>
        </Select>
      </div>

      <div>
        <Text strong>间距</Text>
        <Slider
          value={config.props.gap}
          onChange={(value) => handleChange('gap', value)}
          min={0}
          max={50}
          marks={{ 0: '0', 25: '25', 50: '50' }}
        />
      </div>

      <div>
        <Text strong>内边距</Text>
        <Slider
          value={config.props.padding}
          onChange={(value) => handleChange('padding', value)}
          min={0}
          max={50}
          marks={{ 0: '0', 25: '25', 50: '50' }}
        />
      </div>

      <div>
        <Text strong>背景色</Text>
        <ColorPicker
          value={config.props.background}
          onChange={(color) => handleChange('background', color.toHexString())}
          style={{ width: '100%' }}
        />
      </div>

      <div>
        <Text strong>外边距</Text>
        <InputNumber
          value={parseInt(config.style.margin as string) || 4}
          onChange={(value) => handleStyleChange('margin', `${value}px`)}
          min={0}
          max={50}
          style={{ width: '100%' }}
        />
      </div>
    </Space>
  );
};

/**
 * 分割线组件属性编辑器
 */
const DividerPropertyEditor: React.FC<{
  config: DividerConfig;
  onChange: (config: DividerConfig) => void;
}> = ({ config, onChange }) => {
  const handleChange = (field: string, value: any) => {
    const updatedConfig = {
      ...config,
      props: {
        ...config.props,
        [field]: value
      }
    };
    onChange(updatedConfig);
  };

  const handleStyleChange = (field: string, value: any) => {
    const updatedConfig = {
      ...config,
      style: {
        ...config.style,
        [field]: value
      }
    };
    onChange(updatedConfig);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <div>
        <Text strong>方向</Text>
        <Select
          value={config.props.type}
          onChange={(value) => handleChange('type', value)}
          style={{ width: '100%' }}
        >
          <Option value="horizontal">水平</Option>
          <Option value="vertical">垂直</Option>
        </Select>
      </div>

      <div>
        <Text strong>文字位置</Text>
        <Select
          value={config.props.orientation}
          onChange={(value) => handleChange('orientation', value)}
          style={{ width: '100%' }}
        >
          <Option value="left">左侧</Option>
          <Option value="center">居中</Option>
          <Option value="right">右侧</Option>
        </Select>
      </div>

      <div>
        <Text strong>虚线样式</Text>
        <Switch
          checked={config.props.dashed}
          onChange={(checked) => handleChange('dashed', checked)}
        />
      </div>

      <div>
        <Text strong>外边距</Text>
        <InputNumber
          value={parseInt(config.style.margin as string) || 4}
          onChange={(value) => handleStyleChange('margin', `${value}px`)}
          min={0}
          max={50}
          style={{ width: '100%' }}
        />
      </div>
    </Space>
  );
};

/**
 * 属性面板主组件
 */
export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onComponentUpdate
}) => {
  if (!selectedComponent) {
    return (
      <div style={{ padding: '16px', textAlign: 'center', color: '#999' }}>
        <Title level={5}>属性面板</Title>
        <Text>请选择一个组件来编辑属性</Text>
      </div>
    );
  }

  const renderPropertyEditor = () => {
    switch (selectedComponent.type) {
      case ComponentType.TEXT:
        return (
          <TextPropertyEditor
            config={selectedComponent as TextConfig}
            onChange={onComponentUpdate}
          />
        );
      case ComponentType.BUTTON:
        return (
          <ButtonPropertyEditor
            config={selectedComponent as ButtonConfig}
            onChange={onComponentUpdate}
          />
        );
      case ComponentType.INPUT:
        return (
          <InputPropertyEditor
            config={selectedComponent as InputConfig}
            onChange={onComponentUpdate}
          />
        );
      case ComponentType.IMAGE:
        return (
          <ImagePropertyEditor
            config={selectedComponent as ImageConfig}
            onChange={onComponentUpdate}
          />
        );
      case ComponentType.CONTAINER:
        return (
          <ContainerPropertyEditor
            config={selectedComponent as ContainerConfig}
            onChange={onComponentUpdate}
          />
        );
      case ComponentType.DIVIDER:
        return (
          <DividerPropertyEditor
            config={selectedComponent as DividerConfig}
            onChange={onComponentUpdate}
          />
        );
      default:
        return <Text>未知组件类型</Text>;
    }
  };

  return (
    <div style={{ padding: '16px', height: '100%', overflow: 'auto' }}>
      <Title level={5} style={{ marginBottom: 16 }}>
        属性面板
      </Title>
      
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <Text strong>组件信息</Text>
          <Text type="secondary">类型: {selectedComponent.type}</Text>
          <Text type="secondary">ID: {selectedComponent.id}</Text>
          <Text type="secondary">名称: {selectedComponent.name}</Text>
        </Space>
      </Card>

      <Card size="small" title="组件属性">
        {renderPropertyEditor()}
      </Card>
    </div>
  );
};