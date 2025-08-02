import React from 'react';
import { Button as AntButton, Input as AntInput, Image as AntImage, Divider as AntDivider, Flex } from 'antd';
import { type ComponentConfig, ComponentType, type TextConfig, type ButtonConfig, type InputConfig, type ImageConfig, type ContainerConfig, type DividerConfig } from '../../types/editor';

/**
 * 可渲染组件的属性接口
 */
interface RenderableComponentProps {
  config: ComponentConfig;
  isSelected?: boolean;
  onClick?: (config: ComponentConfig) => void;
  children?: React.ReactNode;
}

/**
 * 文本组件
 */
export const TextComponent: React.FC<{ config: TextConfig; isSelected?: boolean; onClick?: (config: ComponentConfig) => void }> = ({ 
  config, 
  isSelected, 
  onClick 
}) => {
  return (
    <div
      style={{
        ...config.style,
        fontSize: config.props.fontSize || 14,
        fontWeight: config.props.fontWeight || 'normal',
        color: config.props.color || '#000',
        textAlign: config.props.textAlign || 'left',
        cursor: 'pointer',
        border: isSelected ? '2px solid #1890ff' : '1px solid transparent',
        padding: '4px',
        minHeight: '20px',
        minWidth: '50px'
      }}
      onClick={() => onClick?.(config)}
    >
      {config.props.content || '文本内容'}
    </div>
  );
};

/**
 * 按钮组件
 */
export const ButtonComponent: React.FC<{ config: ButtonConfig; isSelected?: boolean; onClick?: (config: ComponentConfig) => void }> = ({ 
  config, 
  isSelected, 
  onClick 
}) => {
  return (
    <div
      style={{
        ...config.style,
        border: isSelected ? '2px solid #1890ff' : '1px solid transparent',
        padding: '4px',
        display: 'inline-block'
      }}
      onClick={() => onClick?.(config)}
    >
      <AntButton
        type={config.props.type || 'default'}
        size={config.props.size || 'middle'}
        disabled={config.props.disabled}
        style={{ pointerEvents: 'none' }} // 禁用按钮点击，只响应外层点击
      >
        {config.props.text || '按钮'}
      </AntButton>
    </div>
  );
};

/**
 * 输入框组件
 */
export const InputComponent: React.FC<{ config: InputConfig; isSelected?: boolean; onClick?: (config: ComponentConfig) => void }> = ({ 
  config, 
  isSelected, 
  onClick 
}) => {
  return (
    <div
      style={{
        ...config.style,
        border: isSelected ? '2px solid #1890ff' : '1px solid transparent',
        padding: '4px',
        display: 'inline-block'
      }}
      onClick={() => onClick?.(config)}
    >
      <AntInput
        placeholder={config.props.placeholder || '请输入'}
        value={config.props.value}
        disabled={config.props.disabled}
        size={config.props.size || 'middle'}
        type={config.props.type || 'text'}
        style={{ pointerEvents: 'none' }} // 禁用输入，只响应外层点击
      />
    </div>
  );
};

/**
 * 图片组件
 */
export const ImageComponent: React.FC<{ config: ImageConfig; isSelected?: boolean; onClick?: (config: ComponentConfig) => void }> = ({ 
  config, 
  isSelected, 
  onClick 
}) => {
  return (
    <div
      style={{
        ...config.style,
        border: isSelected ? '2px solid #1890ff' : '1px solid transparent',
        padding: '4px',
        display: 'inline-block'
      }}
      onClick={() => onClick?.(config)}
    >
      <AntImage
        src={config.props.src || 'https://via.placeholder.com/150x100?text=Image'}
        alt={config.props.alt || '图片'}
        width={config.props.width || 150}
        height={config.props.height || 100}
        style={{ 
          objectFit: config.props.fit || 'cover',
          pointerEvents: 'none'
        }}
        preview={false}
      />
    </div>
  );
};

/**
 * 分割线组件
 */
export const DividerComponent: React.FC<{ config: DividerConfig; isSelected?: boolean; onClick?: (config: ComponentConfig) => void }> = ({ 
  config, 
  isSelected, 
  onClick 
}) => {
  return (
    <div
      style={{
        ...config.style,
        border: isSelected ? '2px solid #1890ff' : '1px solid transparent',
        padding: '4px'
      }}
      onClick={() => onClick?.(config)}
    >
      <AntDivider
        orientation={config.props.orientation || 'center'}
        type={config.props.type || 'horizontal'}
        dashed={config.props.dashed}
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};

/**
 * 容器组件
 */
export const ContainerComponent: React.FC<{ config: ContainerConfig; isSelected?: boolean; onClick?: (config: ComponentConfig) => void; children?: React.ReactNode }> = ({ 
  config, 
  isSelected, 
  onClick,
  children 
}) => {
  return (
    <div
      style={{
        ...config.style,
        border: isSelected ? '2px solid #1890ff' : '1px dashed #d9d9d9',
        padding: config.props.padding || 16,
        background: config.props.background || 'transparent',
        minHeight: '60px',
        minWidth: '100px'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(config);
      }}
    >
      <Flex
        vertical={config.props.layout === 'vertical'}
        justify={config.props.justify || 'start'}
        align={config.props.align || 'start'}
        gap={config.props.gap || 8}
        style={{ height: '100%', width: '100%' }}
      >
        {children || <div style={{ color: '#999', fontSize: '12px' }}>拖拽组件到这里</div>}
      </Flex>
    </div>
  );
};

/**
 * 通用组件渲染器
 */
export const ComponentRenderer: React.FC<RenderableComponentProps> = ({ 
  config, 
  isSelected, 
  onClick, 
  children 
}) => {
  const commonProps = { config, isSelected, onClick };

  switch (config.type) {
    case ComponentType.TEXT:
      return <TextComponent {...commonProps} config={config as TextConfig} />;
    case ComponentType.BUTTON:
      return <ButtonComponent {...commonProps} config={config as ButtonConfig} />;
    case ComponentType.INPUT:
      return <InputComponent {...commonProps} config={config as InputConfig} />;
    case ComponentType.IMAGE:
      return <ImageComponent {...commonProps} config={config as ImageConfig} />;
    case ComponentType.DIVIDER:
      return <DividerComponent {...commonProps} config={config as DividerConfig} />;
    case ComponentType.CONTAINER:
      return <ContainerComponent {...commonProps} config={config as ContainerConfig}>{children}</ContainerComponent>;
    default:
      return <div style={{ color: 'red' }}>未知组件类型</div>;
  }
};