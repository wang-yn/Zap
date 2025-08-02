/**
 * 编辑器相关类型定义
 */

// 组件类型枚举
export enum ComponentType {
  TEXT = 'text',
  BUTTON = 'button', 
  INPUT = 'input',
  IMAGE = 'image',
  CONTAINER = 'container',
  DIVIDER = 'divider'
}

// 基础组件配置接口
export interface BaseComponentConfig {
  id: string;
  type: ComponentType;
  name: string;
  props: Record<string, any>;
  style: React.CSSProperties;
  children?: ComponentConfig[];
}

// 具体组件配置类型
export interface TextConfig extends BaseComponentConfig {
  type: ComponentType.TEXT;
  props: {
    content: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
}

export interface ButtonConfig extends BaseComponentConfig {
  type: ComponentType.BUTTON;
  props: {
    text: string;
    type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
    size?: 'large' | 'middle' | 'small';
    disabled?: boolean;
    onClick?: string; // 事件处理函数名
  };
}

export interface InputConfig extends BaseComponentConfig {
  type: ComponentType.INPUT;
  props: {
    placeholder?: string;
    value?: string;
    disabled?: boolean;
    size?: 'large' | 'middle' | 'small';
    type?: 'text' | 'password' | 'email' | 'number';
  };
}

export interface ImageConfig extends BaseComponentConfig {
  type: ComponentType.IMAGE;
  props: {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  };
}

export interface ContainerConfig extends BaseComponentConfig {
  type: ComponentType.CONTAINER;
  props: {
    layout?: 'vertical' | 'horizontal';
    justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
    align?: 'start' | 'end' | 'center' | 'stretch';
    gap?: number;
    padding?: number;
    background?: string;
  };
}

export interface DividerConfig extends BaseComponentConfig {
  type: ComponentType.DIVIDER;
  props: {
    orientation?: 'left' | 'right' | 'center';
    type?: 'horizontal' | 'vertical';
    dashed?: boolean;
  };
}

// 联合类型
export type ComponentConfig = 
  | TextConfig 
  | ButtonConfig 
  | InputConfig 
  | ImageConfig 
  | ContainerConfig 
  | DividerConfig;

// 页面配置
export interface PageConfig {
  id: string;
  name: string;
  path: string;
  title?: string;
  components: ComponentConfig[];
  layout: {
    width?: number;
    height?: number;
    background?: string;
    padding?: number;
  };
}

// 项目配置  
export interface ProjectConfig {
  id: string;
  name: string;
  description?: string;
  pages: PageConfig[];
  settings: {
    theme?: 'light' | 'dark';
    primaryColor?: string;
    fontSize?: number;
  };
}

// 拖拽项目类型
export interface DragItem {
  type: string;
  componentType: ComponentType;
  config?: Partial<ComponentConfig>;
}

// 编辑器状态
export interface EditorState {
  selectedComponentId: string | null;
  selectedPageId: string | null;
  project: ProjectConfig | null;
  history: {
    past: PageConfig[];
    present: PageConfig | null;
    future: PageConfig[];
  };
  isPreviewMode: boolean;
}