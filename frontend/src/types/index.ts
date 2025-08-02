// 用户相关类型
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 项目相关类型
export interface Project {
  id: string;
  name: string;
  description?: string;
  userId: string;
  status: 'draft' | 'published';
  config: ProjectConfig;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectConfig {
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
  };
  layout?: {
    type: 'flex' | 'grid';
    direction?: 'row' | 'column';
    gap?: number;
  };
}

// 页面相关类型
export interface Page {
  id: string;
  projectId: string;
  name: string;
  path: string;
  components: ComponentMetadata[];
  layout: LayoutMetadata;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComponentMetadata {
  id: string;
  type: string;
  props: Record<string, any>;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  events?: EventMetadata[];
}

export interface LayoutMetadata {
  type: 'flex' | 'grid';
  direction?: 'row' | 'column';
  gap?: number;
  padding?: number;
}

export interface EventMetadata {
  type: string;
  handler: string;
  params?: Record<string, any>;
}

// 组件库相关类型
export interface ComponentTemplate {
  id: string;
  name: string;
  category: string;
  icon: string;
  defaultProps: Record<string, any>;
  events: string[];
  codeTemplate: string;
}

// 模板相关类型
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  pages: Page[];
  components: ComponentMetadata[];
  createdAt: Date;
  updatedAt: Date;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// 导航相关类型
export type MenuKey = 
  | 'dashboard'
  | 'all-projects'
  | 'recent-projects'
  | 'favorite-projects'
  | 'templates'
  | 'components'
  | 'settings';

export interface MenuItem {
  key: MenuKey;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}