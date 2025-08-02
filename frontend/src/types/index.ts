export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface EventMetadata {
  type: string;
  handler: string;
  params?: Record<string, any>;
}

export interface LayoutMetadata {
  type: 'flex' | 'grid';
  direction?: 'row' | 'column';
  gap?: number;
  padding?: number;
}

export interface ProjectConfig {
  theme: {
    primaryColor?: string;
    backgroundColor?: string;
  };
  routing: {
    type: 'hash' | 'browser';
    basePath?: string;
  };
}