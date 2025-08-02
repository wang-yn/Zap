// MVP支持的组件类型
export type ComponentType = 
  | 'Text'      // 文本
  | 'Button'    // 按钮  
  | 'Input'     // 输入框
  | 'Image'     // 图片
  | 'Container' // 容器
  | 'Divider';  // 分割线

// 动作类型
export type ActionType = 
  | 'navigate'    // 页面跳转
  | 'submit'      // 表单提交  
  | 'none';       // 无动作

// 组件动作配置接口
export interface ComponentAction {
  type: ActionType;
  target?: string;  // 目标页面路径或其他参数
}

// 组件定义注册表接口
export interface ComponentDefinition {
  type: ComponentType;
  name: string;
  defaultProps: Record<string, any>;
  configurable: string[];  // 可配置的属性列表
}

// 组件注册表
export const ComponentRegistry: Record<ComponentType, ComponentDefinition> = {
  Text: {
    type: 'Text',
    name: '文本',
    defaultProps: {
      content: '文本内容',
      size: 'medium',
      color: 'default', 
      align: 'left'
    },
    configurable: ['content', 'size', 'color', 'align']
  },
  
  Button: {
    type: 'Button', 
    name: '按钮',
    defaultProps: {
      text: '按钮',
      type: 'primary',
      size: 'medium',
      disabled: false
    },
    configurable: ['text', 'type', 'size', 'disabled', 'action']
  },
  
  Input: {
    type: 'Input',
    name: '输入框', 
    defaultProps: {
      placeholder: '请输入',
      required: false,
      type: 'text'
    },
    configurable: ['placeholder', 'required', 'type', 'maxLength']
  },
  
  Image: {
    type: 'Image',
    name: '图片',
    defaultProps: {
      src: '/images/placeholder.jpg',
      alt: '图片',
      width: 'auto',
      height: 'auto'
    },
    configurable: ['src', 'alt', 'width', 'height']
  },
  
  Container: {
    type: 'Container',
    name: '容器',
    defaultProps: {
      padding: 'medium',
      background: 'none', 
      border: false
    },
    configurable: ['padding', 'background', 'border']
  },
  
  Divider: {
    type: 'Divider',
    name: '分割线',
    defaultProps: {
      style: 'solid',
      spacing: 'medium'
    },
    configurable: ['style', 'spacing']
  }
};