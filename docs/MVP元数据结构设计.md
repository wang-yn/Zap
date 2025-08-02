# MVP版本元数据结构设计方案

## 概述

本文档定义了ZAP零代码开发平台MVP版本的元数据结构设计方案。设计遵循简单实用的原则，不引入复杂的定位、样式等功能，仅支持流式布局，专注于核心功能的快速实现。

## 1. 数据库表结构

基于项目现有的Prisma schema，扩展必要字段：

```prisma
// 保持原有的核心表结构
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  projects Project[]
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  userId      String
  status      String   @default("draft") // draft, published
  config      Json     @default("{}")    // 项目配置
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user        User     @relation(fields: [userId], references: [id])
  pages       Page[]
}

// 简化的页面表
model Page {
  id          String   @id @default(cuid())
  projectId   String
  name        String
  path        String
  title       String?
  
  // 核心元数据 - 全部存储在JSON字段中
  components  Json     @default("[]")    // 组件配置数组
  layout      Json     @default("{}")    // 页面布局配置
  isPublished Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  project     Project  @relation(fields: [projectId], references: [id])
  
  @@unique([projectId, path])
}
```

## 2. 组件元数据结构

### 2.1 基础组件定义

```typescript
// 组件基础结构
interface Component {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  children?: Component[];
}

// MVP支持的组件类型
type ComponentType = 
  | 'Text'      // 文本
  | 'Button'    // 按钮  
  | 'Input'     // 输入框
  | 'Image'     // 图片
  | 'Container' // 容器
  | 'Divider';  // 分割线
```

### 2.2 组件配置示例

```typescript
const componentExamples = {
  Text: {
    id: 'text_001',
    type: 'Text',
    props: {
      content: '这是一段文本',
      size: 'medium',      // small, medium, large
      color: 'default',    // default, primary, secondary
      align: 'left'        // left, center, right
    }
  },
  
  Button: {
    id: 'btn_001', 
    type: 'Button',
    props: {
      text: '点击按钮',
      type: 'primary',     // primary, default, dashed, link
      size: 'medium',      // small, medium, large
      disabled: false,
      action: {            // 简单的动作配置
        type: 'navigate',  // navigate, submit, custom
        target: '/about'   // 导航目标或自定义处理
      }
    }
  },
  
  Input: {
    id: 'input_001',
    type: 'Input', 
    props: {
      placeholder: '请输入内容',
      required: false,
      type: 'text',        // text, password, email, number
      maxLength: 100
    }
  },
  
  Image: {
    id: 'img_001',
    type: 'Image',
    props: {
      src: '/images/placeholder.jpg',
      alt: '图片描述',
      width: 'auto',       // auto, 数字(px)
      height: 'auto'
    }
  },
  
  Container: {
    id: 'container_001',
    type: 'Container',
    props: {
      padding: 'medium',   // none, small, medium, large
      background: 'none',  // none, light, dark
      border: false
    },
    children: [
      // 子组件数组
    ]
  },
  
  Divider: {
    id: 'divider_001',
    type: 'Divider',
    props: {
      style: 'solid',      // solid, dashed
      spacing: 'medium'    // small, medium, large
    }
  }
};
```

### 2.3 组件注册表

```typescript
// 组件定义注册表 - 定义每种组件的默认配置
interface ComponentDefinition {
  type: ComponentType;
  name: string;
  defaultProps: Record<string, any>;
  configurable: string[];  // 可配置的属性列表
}

const ComponentRegistry: Record<ComponentType, ComponentDefinition> = {
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
```

## 3. 页面配置结构

### 3.1 页面元数据

```typescript
// 页面完整配置
interface PageConfig {
  // 基本信息
  meta: {
    title: string;
    description?: string;
  };
  
  // 简单的布局配置 - 只支持流式布局
  layout: {
    maxWidth: number | 'full';     // 页面最大宽度，如1200px或'full'
    padding: 'none' | 'small' | 'medium' | 'large';
    spacing: 'compact' | 'normal' | 'loose';  // 组件间距
  };
  
  // 组件列表 - 按顺序渲染
  components: Component[];
}
```

### 3.2 页面配置示例

```typescript
const pageExample: PageConfig = {
  meta: {
    title: '首页',
    description: '网站首页'
  },
  
  layout: {
    maxWidth: 1200,
    padding: 'medium', 
    spacing: 'normal'
  },
  
  components: [
    {
      id: 'header_text',
      type: 'Text',
      props: {
        content: '欢迎使用ZAP平台',
        size: 'large',
        color: 'primary',
        align: 'center'
      }
    },
    {
      id: 'banner_container', 
      type: 'Container',
      props: {
        padding: 'large',
        background: 'light',
        border: true
      },
      children: [
        {
          id: 'banner_text',
          type: 'Text', 
          props: {
            content: '零代码快速开发平台',
            size: 'medium',
            align: 'center'
          }
        },
        {
          id: 'cta_button',
          type: 'Button',
          props: {
            text: '立即开始',
            type: 'primary',
            size: 'large',
            action: {
              type: 'navigate',
              target: '/dashboard'
            }
          }
        }
      ]
    },
    {
      id: 'divider_1',
      type: 'Divider',
      props: {
        style: 'solid',
        spacing: 'large'
      }
    }
  ]
};
```

### 3.3 项目配置

```typescript
// 项目级别的配置
interface ProjectConfig {
  // 全局样式配置
  theme: {
    primaryColor: string;     // 主色调
    fontSize: 'small' | 'medium' | 'large';
    fontFamily: 'default' | 'serif' | 'monospace';
  };
  
  // 导航配置
  navigation?: {
    showHeader: boolean;
    headerTitle: string;
    menuItems: Array<{
      label: string;
      path: string;
    }>;
  };
}

// 项目配置示例
const projectConfigExample: ProjectConfig = {
  theme: {
    primaryColor: '#1890ff',
    fontSize: 'medium', 
    fontFamily: 'default'
  },
  
  navigation: {
    showHeader: true,
    headerTitle: 'ZAP平台',
    menuItems: [
      { label: '首页', path: '/' },
      { label: '关于', path: '/about' },
      { label: '联系', path: '/contact' }
    ]
  }
};
```

## 4. 简单事件系统

### 4.1 基础事件类型

```typescript
// 简化的事件配置 - 只支持最基础的交互
interface ComponentAction {
  type: ActionType;
  target?: string;  // 目标页面路径或其他参数
}

type ActionType = 
  | 'navigate'    // 页面跳转
  | 'submit'      // 表单提交  
  | 'none';       // 无动作

// 事件配置示例
const actionExamples = {
  // 导航到其他页面
  navigate: {
    type: 'navigate',
    target: '/about'
  },
  
  // 表单提交（后续扩展）
  submit: {
    type: 'submit',
    target: '/api/contact'
  },
  
  // 无动作
  none: {
    type: 'none'
  }
};
```

## 5. API接口设计

### 5.1 页面管理API

```typescript
// 页面相关的API接口
interface PageAPI {
  // 获取页面配置
  'GET /api/pages/:id': {
    id: string;
    name: string;
    path: string;
    title: string;
    config: PageConfig;
  };
  
  // 更新页面配置
  'PUT /api/pages/:id': {
    config: PageConfig;
  };
  
  // 创建新页面
  'POST /api/pages': {
    projectId: string;
    name: string;
    path: string;
    title: string;
    config: PageConfig;
  };
}
```

### 5.2 组件操作API

```typescript
// 组件操作API
interface ComponentAPI {
  // 添加组件到页面
  'POST /api/pages/:pageId/components': {
    component: Component;
    position?: number;  // 插入位置，不传则添加到末尾
  };
  
  // 更新组件配置
  'PUT /api/components/:componentId': {
    props: Record<string, any>;
  };
  
  // 删除组件
  'DELETE /api/components/:componentId': void;
  
  // 调整组件顺序
  'PUT /api/pages/:pageId/components/reorder': {
    componentIds: string[];  // 新的组件顺序
  };
}
```

## 6. 前端渲染器设计

### 6.1 组件渲染器

```typescript
// 简单的组件渲染器
import React from 'react';
import { Button, Typography, Input, Image, Space, Divider } from 'antd';

const { Text, Title } = Typography;

interface ComponentRendererProps {
  component: Component;
  onAction?: (action: ComponentAction) => void;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ 
  component, 
  onAction 
}) => {
  const handleAction = (action?: ComponentAction) => {
    if (action && onAction) {
      onAction(action);
    }
  };

  const renderComponent = () => {
    switch (component.type) {
      case 'Text':
        return (
          <Text 
            style={{
              fontSize: component.props.size === 'large' ? 18 : component.props.size === 'small' ? 12 : 14,
              color: component.props.color === 'primary' ? '#1890ff' : undefined,
              textAlign: component.props.align
            }}
          >
            {component.props.content}
          </Text>
        );
        
      case 'Button':
        return (
          <Button
            type={component.props.type}
            size={component.props.size}
            disabled={component.props.disabled}
            onClick={() => handleAction(component.props.action)}
          >
            {component.props.text}
          </Button>
        );
        
      case 'Input':
        return (
          <Input
            placeholder={component.props.placeholder}
            type={component.props.type}
            maxLength={component.props.maxLength}
            required={component.props.required}
          />
        );
        
      case 'Image':
        return (
          <img
            src={component.props.src}
            alt={component.props.alt}
            style={{
              width: component.props.width === 'auto' ? 'auto' : component.props.width,
              height: component.props.height === 'auto' ? 'auto' : component.props.height,
              maxWidth: '100%'
            }}
          />
        );
        
      case 'Container':
        return (
          <div
            style={{
              padding: getPaddingValue(component.props.padding),
              backgroundColor: component.props.background === 'light' ? '#fafafa' : 
                              component.props.background === 'dark' ? '#f0f0f0' : 'transparent',
              border: component.props.border ? '1px solid #d9d9d9' : 'none',
              borderRadius: component.props.border ? '6px' : 0
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {component.children?.map(child => (
                <ComponentRenderer 
                  key={child.id} 
                  component={child} 
                  onAction={onAction}
                />
              ))}
            </Space>
          </div>
        );
        
      case 'Divider':
        return (
          <Divider 
            style={{ 
              margin: getSpacingValue(component.props.spacing),
              borderStyle: component.props.style
            }} 
          />
        );
        
      default:
        return <div>Unknown Component: {component.type}</div>;
    }
  };

  return renderComponent();
};

// 辅助函数
const getPaddingValue = (size: string) => {
  switch (size) {
    case 'small': return '8px';
    case 'medium': return '16px'; 
    case 'large': return '24px';
    default: return '0px';
  }
};

const getSpacingValue = (size: string) => {
  switch (size) {
    case 'small': return '8px 0';
    case 'medium': return '16px 0';
    case 'large': return '24px 0';
    default: return '16px 0';
  }
};
```

## 7. 数据存储示例

### 7.1 数据库存储格式

```sql
-- Page表中的实际数据示例
INSERT INTO Page (id, projectId, name, path, title, components, layout) VALUES (
  'page_home_001',
  'project_001', 
  'home',
  '/',
  '首页',
  '[
    {
      "id": "text_001",
      "type": "Text",
      "props": {
        "content": "欢迎使用ZAP平台",
        "size": "large",
        "color": "primary",
        "align": "center"
      }
    },
    {
      "id": "container_001",
      "type": "Container", 
      "props": {
        "padding": "large",
        "background": "light",
        "border": true
      },
      "children": [
        {
          "id": "button_001",
          "type": "Button",
          "props": {
            "text": "立即开始",
            "type": "primary",
            "size": "large",
            "action": {
              "type": "navigate",
              "target": "/dashboard"
            }
          }
        }
      ]
    }
  ]',
  '{
    "maxWidth": 1200,
    "padding": "medium",
    "spacing": "normal"
  }'
);
```

## 8. 实现优先级

### 8.1 第一阶段：基础组件
- [x] Text组件
- [x] Button组件
- [x] Container组件
- [ ] Input组件
- [ ] Image组件
- [ ] Divider组件

### 8.2 第二阶段：编辑器功能
- [ ] 组件拖拽添加
- [ ] 属性面板编辑
- [ ] 组件删除和排序
- [ ] 页面预览

### 8.3 第三阶段：扩展功能
- [ ] 页面导航
- [ ] 表单提交
- [ ] 主题配置
- [ ] 响应式布局

## 9. 领域对象设计

为了避免页面直接操作数据表，增加领域对象层来封装业务逻辑和数据访问。

### 9.1 领域实体设计

```typescript
// 项目领域实体
export class Project {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _description: string | null,
    private readonly _userId: string,
    private _status: ProjectStatus,
    private _config: ProjectConfig,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _pages: Page[] = []
  ) {}

  // 工厂方法
  static create(data: {
    name: string;
    description?: string;
    userId: string;
    config?: ProjectConfig;
  }): Project {
    const project = new Project(
      generateId(),
      data.name,
      data.description || null,
      data.userId,
      ProjectStatus.DRAFT,
      data.config || ProjectConfig.default(),
      new Date(),
      new Date()
    );

    // 触发领域事件
    project.addDomainEvent(new ProjectCreatedEvent(project.id, data.userId));
    return project;
  }

  // 业务方法
  updateName(name: string): void {
    this.validateName(name);
    const oldName = this._name;
    this._name = name;
    this._updatedAt = new Date();
    
    this.addDomainEvent(new ProjectNameChangedEvent(this.id, oldName, name));
  }

  addPage(pageData: { name: string; path: string; title?: string }): Page {
    this.validatePagePath(pageData.path);
    
    const page = Page.create({
      ...pageData,
      projectId: this.id
    });
    
    this._pages.push(page);
    this._updatedAt = new Date();
    
    this.addDomainEvent(new PageAddedToProjectEvent(this.id, page.id));
    return page;
  }

  publish(): void {
    this.validateCanPublish();
    this._status = ProjectStatus.PUBLISHED;
    this._updatedAt = new Date();
    
    this.addDomainEvent(new ProjectPublishedEvent(this.id, this._userId));
  }

  // 业务规则验证
  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainError('项目名称不能为空');
    }
    if (name.length > 100) {
      throw new DomainError('项目名称长度不能超过100个字符');
    }
  }

  private validatePagePath(path: string): void {
    const existingPaths = this._pages.map(p => p.path);
    if (existingPaths.includes(path)) {
      throw new DomainError(`路径 ${path} 已存在`);
    }
  }

  private validateCanPublish(): void {
    if (this._pages.length === 0) {
      throw new DomainError('项目至少需要一个页面才能发布');
    }
    if (!this._pages.some(p => p.isPublished)) {
      throw new DomainError('项目至少需要一个已发布的页面');
    }
  }

  // Getters
  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get description(): string | null { return this._description; }
  get userId(): string { return this._userId; }
  get status(): ProjectStatus { return this._status; }
  get config(): ProjectConfig { return this._config; }
  get pages(): readonly Page[] { return this._pages; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // 领域事件支持
  private _domainEvents: DomainEvent[] = [];
  
  addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }
  
  clearDomainEvents(): void {
    this._domainEvents = [];
  }
  
  get domainEvents(): readonly DomainEvent[] {
    return this._domainEvents;
  }
}

// 页面领域实体
export class Page {
  private constructor(
    private readonly _id: string,
    private readonly _projectId: string,
    private _name: string,
    private _path: string,
    private _title: string | null,
    private _components: Component[],
    private _layout: PageLayout,
    private _isPublished: boolean,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(data: {
    name: string;
    path: string;
    title?: string;
    projectId: string;
  }): Page {
    const page = new Page(
      generateId(),
      data.projectId,
      data.name,
      data.path,
      data.title || null,
      [],
      PageLayout.default(),
      false,
      new Date(),
      new Date()
    );

    page.addDomainEvent(new PageCreatedEvent(page.id, data.projectId));
    return page;
  }

  // 组件管理
  addComponent(componentType: ComponentType, props: Record<string, any>, position?: number): Component {
    const component = Component.create(componentType, props);
    
    if (position !== undefined) {
      this._components.splice(position, 0, component);
    } else {
      this._components.push(component);
    }
    
    this._updatedAt = new Date();
    this.addDomainEvent(new ComponentAddedEvent(this.id, component.id, componentType));
    
    return component;
  }

  removeComponent(componentId: string): void {
    const index = this._components.findIndex(c => c.id === componentId);
    if (index === -1) {
      throw new DomainError(`组件 ${componentId} 不存在`);
    }
    
    const component = this._components[index];
    this._components.splice(index, 1);
    this._updatedAt = new Date();
    
    this.addDomainEvent(new ComponentRemovedEvent(this.id, componentId, component.type));
  }

  updateComponent(componentId: string, props: Record<string, any>): void {
    const component = this.findComponent(componentId);
    if (!component) {
      throw new DomainError(`组件 ${componentId} 不存在`);
    }
    
    component.updateProps(props);
    this._updatedAt = new Date();
    
    this.addDomainEvent(new ComponentUpdatedEvent(this.id, componentId));
  }

  reorderComponents(componentIds: string[]): void {
    this.validateComponentOrder(componentIds);
    
    const reorderedComponents = componentIds.map(id => 
      this._components.find(c => c.id === id)!
    );
    
    this._components = reorderedComponents;
    this._updatedAt = new Date();
    
    this.addDomainEvent(new ComponentsReorderedEvent(this.id, componentIds));
  }

  publish(): void {
    this.validateCanPublish();
    this._isPublished = true;
    this._updatedAt = new Date();
    
    this.addDomainEvent(new PagePublishedEvent(this.id, this._projectId));
  }

  unpublish(): void {
    this._isPublished = false;
    this._updatedAt = new Date();
    
    this.addDomainEvent(new PageUnpublishedEvent(this.id, this._projectId));
  }

  // 业务规则验证
  private findComponent(componentId: string): Component | undefined {
    return this._components.find(c => c.id === componentId);
  }

  private validateComponentOrder(componentIds: string[]): void {
    if (componentIds.length !== this._components.length) {
      throw new DomainError('组件顺序不完整');
    }
    
    const currentIds = this._components.map(c => c.id);
    const missingIds = currentIds.filter(id => !componentIds.includes(id));
    
    if (missingIds.length > 0) {
      throw new DomainError(`缺少组件: ${missingIds.join(', ')}`);
    }
  }

  private validateCanPublish(): void {
    if (this._components.length === 0) {
      throw new DomainError('页面至少需要一个组件才能发布');
    }
  }

  // Getters
  get id(): string { return this._id; }
  get projectId(): string { return this._projectId; }
  get name(): string { return this._name; }
  get path(): string { return this._path; }
  get title(): string | null { return this._title; }
  get components(): readonly Component[] { return this._components; }
  get layout(): PageLayout { return this._layout; }
  get isPublished(): boolean { return this._isPublished; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // 领域事件支持
  private _domainEvents: DomainEvent[] = [];
  
  addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }
  
  clearDomainEvents(): void {
    this._domainEvents = [];
  }
  
  get domainEvents(): readonly DomainEvent[] {
    return this._domainEvents;
  }
}

// 组件领域实体
export class Component {
  private constructor(
    private readonly _id: string,
    private readonly _type: ComponentType,
    private _props: ComponentProps,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(type: ComponentType, props: Record<string, any>): Component {
    const componentDefinition = ComponentRegistry[type];
    if (!componentDefinition) {
      throw new DomainError(`不支持的组件类型: ${type}`);
    }

    const validatedProps = ComponentProps.create(type, props);
    
    return new Component(
      generateId(),
      type,
      validatedProps,
      new Date(),
      new Date()
    );
  }

  updateProps(props: Record<string, any>): void {
    this._props.update(props);
    this._updatedAt = new Date();
  }

  // Getters
  get id(): string { return this._id; }
  get type(): ComponentType { return this._type; }
  get props(): ComponentProps { return this._props; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
}
```

### 9.2 值对象设计

```typescript
// 组件属性值对象
export class ComponentProps {
  private constructor(
    private readonly _type: ComponentType,
    private _values: Record<string, any>
  ) {}

  static create(type: ComponentType, props: Record<string, any>): ComponentProps {
    const definition = ComponentRegistry[type];
    const validatedProps = this.validateProps(type, props, definition);
    
    return new ComponentProps(type, validatedProps);
  }

  update(props: Record<string, any>): void {
    const definition = ComponentRegistry[this._type];
    const validatedProps = ComponentProps.validateProps(this._type, props, definition);
    
    this._values = { ...this._values, ...validatedProps };
  }

  private static validateProps(
    type: ComponentType, 
    props: Record<string, any>,
    definition: ComponentDefinition
  ): Record<string, any> {
    const validated: Record<string, any> = {};
    
    // 应用默认值
    Object.assign(validated, definition.defaultProps);
    
    // 验证可配置属性
    for (const [key, value] of Object.entries(props)) {
      if (!definition.configurable.includes(key)) {
        throw new DomainError(`组件 ${type} 不支持属性 ${key}`);
      }
      
      // 根据组件类型和属性进行特定验证
      this.validatePropValue(type, key, value);
      validated[key] = value;
    }
    
    return validated;
  }

  private static validatePropValue(type: ComponentType, key: string, value: any): void {
    switch (type) {
      case 'Text':
        if (key === 'content' && (!value || typeof value !== 'string')) {
          throw new DomainError('文本内容不能为空');
        }
        if (key === 'size' && !['small', 'medium', 'large'].includes(value)) {
          throw new DomainError('文本大小必须为 small、medium 或 large');
        }
        break;
        
      case 'Button':
        if (key === 'text' && (!value || typeof value !== 'string')) {
          throw new DomainError('按钮文本不能为空');
        }
        if (key === 'action' && value && !this.isValidAction(value)) {
          throw new DomainError('按钮动作配置无效');
        }
        break;
        
      case 'Input':
        if (key === 'type' && !['text', 'password', 'email', 'number'].includes(value)) {
          throw new DomainError('输入框类型无效');
        }
        break;
        
      case 'Image':
        if (key === 'src' && (!value || typeof value !== 'string')) {
          throw new DomainError('图片地址不能为空');
        }
        break;
    }
  }

  private static isValidAction(action: any): boolean {
    return action.type && ['navigate', 'submit', 'none'].includes(action.type);
  }

  get values(): Record<string, any> {
    return { ...this._values };
  }

  get(key: string): any {
    return this._values[key];
  }
}

// 页面布局值对象
export class PageLayout {
  private constructor(
    private readonly _maxWidth: number | 'full',
    private readonly _padding: 'none' | 'small' | 'medium' | 'large',
    private readonly _spacing: 'compact' | 'normal' | 'loose'
  ) {}

  static create(config: {
    maxWidth?: number | 'full';
    padding?: 'none' | 'small' | 'medium' | 'large';
    spacing?: 'compact' | 'normal' | 'loose';
  }): PageLayout {
    return new PageLayout(
      config.maxWidth || 1200,
      config.padding || 'medium',
      config.spacing || 'normal'
    );
  }

  static default(): PageLayout {
    return PageLayout.create({});
  }

  get maxWidth(): number | 'full' { return this._maxWidth; }
  get padding(): string { return this._padding; }
  get spacing(): string { return this._spacing; }

  toJSON() {
    return {
      maxWidth: this._maxWidth,
      padding: this._padding,
      spacing: this._spacing
    };
  }
}

// 项目配置值对象
export class ProjectConfig {
  private constructor(
    private readonly _theme: ThemeConfig,
    private readonly _navigation?: NavigationConfig
  ) {}

  static create(config: {
    theme?: ThemeConfig;
    navigation?: NavigationConfig;
  }): ProjectConfig {
    return new ProjectConfig(
      config.theme || ThemeConfig.default(),
      config.navigation
    );
  }

  static default(): ProjectConfig {
    return ProjectConfig.create({});
  }

  get theme(): ThemeConfig { return this._theme; }
  get navigation(): NavigationConfig | undefined { return this._navigation; }

  toJSON() {
    return {
      theme: this._theme.toJSON(),
      navigation: this._navigation?.toJSON()
    };
  }
}

// 主题配置值对象
export class ThemeConfig {
  private constructor(
    private readonly _primaryColor: string,
    private readonly _fontSize: 'small' | 'medium' | 'large',
    private readonly _fontFamily: 'default' | 'serif' | 'monospace'
  ) {}

  static create(config: {
    primaryColor?: string;
    fontSize?: 'small' | 'medium' | 'large';
    fontFamily?: 'default' | 'serif' | 'monospace';
  }): ThemeConfig {
    return new ThemeConfig(
      config.primaryColor || '#1890ff',
      config.fontSize || 'medium',
      config.fontFamily || 'default'
    );
  }

  static default(): ThemeConfig {
    return ThemeConfig.create({});
  }

  get primaryColor(): string { return this._primaryColor; }
  get fontSize(): string { return this._fontSize; }
  get fontFamily(): string { return this._fontFamily; }

  toJSON() {
    return {
      primaryColor: this._primaryColor,
      fontSize: this._fontSize,
      fontFamily: this._fontFamily
    };
  }
}

// 枚举和类型定义
export enum ProjectStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export type ComponentType = 'Text' | 'Button' | 'Input' | 'Image' | 'Container' | 'Divider';

// 基础领域错误
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}
```

### 9.3 领域事件设计

```typescript
// 基础领域事件
export abstract class DomainEvent {
  public readonly occurredAt: Date;
  public readonly eventId: string;

  constructor(
    public readonly aggregateId: string,
    public readonly eventType: string
  ) {
    this.occurredAt = new Date();
    this.eventId = generateId();
  }
}

// 项目相关事件
export class ProjectCreatedEvent extends DomainEvent {
  constructor(
    projectId: string,
    public readonly userId: string
  ) {
    super(projectId, 'ProjectCreated');
  }
}

export class ProjectNameChangedEvent extends DomainEvent {
  constructor(
    projectId: string,
    public readonly oldName: string,
    public readonly newName: string
  ) {
    super(projectId, 'ProjectNameChanged');
  }
}

export class ProjectPublishedEvent extends DomainEvent {
  constructor(
    projectId: string,
    public readonly userId: string
  ) {
    super(projectId, 'ProjectPublished');
  }
}

// 页面相关事件
export class PageCreatedEvent extends DomainEvent {
  constructor(
    pageId: string,
    public readonly projectId: string
  ) {
    super(pageId, 'PageCreated');
  }
}

export class PageAddedToProjectEvent extends DomainEvent {
  constructor(
    projectId: string,
    public readonly pageId: string
  ) {
    super(projectId, 'PageAddedToProject');
  }
}

export class PagePublishedEvent extends DomainEvent {
  constructor(
    pageId: string,
    public readonly projectId: string
  ) {
    super(pageId, 'PagePublished');
  }
}

// 组件相关事件
export class ComponentAddedEvent extends DomainEvent {
  constructor(
    pageId: string,
    public readonly componentId: string,
    public readonly componentType: ComponentType
  ) {
    super(pageId, 'ComponentAdded');
  }
}

export class ComponentRemovedEvent extends DomainEvent {
  constructor(
    pageId: string,
    public readonly componentId: string,
    public readonly componentType: ComponentType
  ) {
    super(pageId, 'ComponentRemoved');
  }
}

export class ComponentUpdatedEvent extends DomainEvent {
  constructor(
    pageId: string,
    public readonly componentId: string
  ) {
    super(pageId, 'ComponentUpdated');
  }
}

export class ComponentsReorderedEvent extends DomainEvent {
  constructor(
    pageId: string,
    public readonly newOrder: string[]
  ) {
    super(pageId, 'ComponentsReordered');
  }
}
```

### 9.4 仓储接口设计

```typescript
// 项目仓储接口
export interface ProjectRepository {
  findById(id: string): Promise<Project | null>;
  findByUserId(userId: string): Promise<Project[]>;
  findByUserIdWithPagination(userId: string, page: number, limit: number): Promise<{
    projects: Project[];
    total: number;
  }>;
  save(project: Project): Promise<void>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}

// 页面仓储接口
export interface PageRepository {
  findById(id: string): Promise<Page | null>;
  findByProjectId(projectId: string): Promise<Page[]>;
  findByProjectIdAndPath(projectId: string, path: string): Promise<Page | null>;
  findPublishedByProjectId(projectId: string): Promise<Page[]>;
  save(page: Page): Promise<void>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}

// 用户仓储接口  
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
```

### 9.5 领域服务设计

```typescript
// 项目领域服务
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly pageRepository: PageRepository,
    private readonly eventDispatcher: DomainEventDispatcher
  ) {}

  async createProject(data: {
    name: string;
    description?: string;
    userId: string;
    config?: ProjectConfig;
  }): Promise<Project> {
    // 业务规则：检查用户项目数量限制
    const userProjects = await this.projectRepository.findByUserId(data.userId);
    if (userProjects.length >= 10) {
      throw new DomainError('用户最多只能创建10个项目');
    }

    const project = Project.create(data);
    await this.projectRepository.save(project);
    
    // 发布领域事件
    await this.eventDispatcher.dispatchEvents(project.domainEvents);
    project.clearDomainEvents();
    
    return project;
  }

  async duplicateProject(projectId: string, newName: string, userId: string): Promise<Project> {
    const originalProject = await this.projectRepository.findById(projectId);
    if (!originalProject) {
      throw new DomainError('原项目不存在');
    }

    // 创建新项目
    const newProject = Project.create({
      name: newName,
      description: `${originalProject.description} (副本)`,
      userId,
      config: originalProject.config
    });

    // 复制页面
    const originalPages = await this.pageRepository.findByProjectId(projectId);
    for (const originalPage of originalPages) {
      newProject.addPage({
        name: originalPage.name,
        path: originalPage.path,
        title: originalPage.title || undefined
      });
    }

    await this.projectRepository.save(newProject);
    
    // 发布领域事件
    await this.eventDispatcher.dispatchEvents(newProject.domainEvents);
    newProject.clearDomainEvents();
    
    return newProject;
  }
}

// 页面领域服务
export class PageService {
  constructor(
    private readonly pageRepository: PageRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly eventDispatcher: DomainEventDispatcher
  ) {}

  async createPageFromTemplate(
    projectId: string, 
    templateName: string,
    pageData: { name: string; path: string; title?: string }
  ): Promise<Page> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new DomainError('项目不存在');
    }

    // 检查路径是否已存在
    const existingPage = await this.pageRepository.findByProjectIdAndPath(projectId, pageData.path);
    if (existingPage) {
      throw new DomainError(`路径 ${pageData.path} 已存在`);
    }

    const page = Page.create({ ...pageData, projectId });
    
    // 根据模板添加组件
    const template = this.getPageTemplate(templateName);
    if (template) {
      template.components.forEach(componentConfig => {
        page.addComponent(componentConfig.type, componentConfig.props);
      });
    }

    await this.pageRepository.save(page);
    
    // 发布领域事件
    await this.eventDispatcher.dispatchEvents(page.domainEvents);
    page.clearDomainEvents();
    
    return page;
  }

  private getPageTemplate(templateName: string) {
    const templates = {
      'landing': {
        components: [
          { type: 'Text' as ComponentType, props: { content: '欢迎来到我们的网站', size: 'large', align: 'center' }},
          { type: 'Button' as ComponentType, props: { text: '开始使用', type: 'primary', size: 'large' }},
          { type: 'Divider' as ComponentType, props: { style: 'solid', spacing: 'large' }}
        ]
      },
      'about': {
        components: [
          { type: 'Text' as ComponentType, props: { content: '关于我们', size: 'large', align: 'center' }},
          { type: 'Text' as ComponentType, props: { content: '这里是关于我们的详细介绍...', size: 'medium' }}
        ]
      }
    };
    
    return templates[templateName];
  }
}

// 事件分发器接口
export interface DomainEventDispatcher {
  dispatchEvents(events: readonly DomainEvent[]): Promise<void>;
}
```

### 9.6 应用服务层设计

```typescript
// 项目应用服务
export class ProjectApplicationService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly projectRepository: ProjectRepository,
    private readonly pageRepository: PageRepository
  ) {}

  async createProject(command: CreateProjectCommand): Promise<CreateProjectResult> {
    try {
      const project = await this.projectService.createProject({
        name: command.name,
        description: command.description,
        userId: command.userId,
        config: command.config
      });

      return {
        success: true,
        projectId: project.id,
        message: '项目创建成功'
      };
    } catch (error) {
      if (error instanceof DomainError) {
        return {
          success: false,
          error: error.message
        };
      }
      throw error;
    }
  }

  async getProjectWithPages(projectId: string, userId: string): Promise<ProjectWithPagesResult> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      return { success: false, error: '项目不存在' };
    }

    if (project.userId !== userId) {
      return { success: false, error: '无权访问此项目' };
    }

    const pages = await this.pageRepository.findByProjectId(projectId);

    return {
      success: true,
      data: {
        project: {
          id: project.id,
          name: project.name,
          description: project.description,
          status: project.status,
          config: project.config.toJSON(),
          createdAt: project.createdAt,
          updatedAt: project.updatedAt
        },
        pages: pages.map(page => ({
          id: page.id,
          name: page.name,
          path: page.path,
          title: page.title,
          isPublished: page.isPublished,
          componentCount: page.components.length,
          updatedAt: page.updatedAt
        }))
      }
    };
  }
}

// 命令和结果类型定义
export interface CreateProjectCommand {
  name: string;
  description?: string;
  userId: string;
  config?: ProjectConfig;
}

export interface CreateProjectResult {
  success: boolean;
  projectId?: string;
  message?: string;
  error?: string;
}

export interface ProjectWithPagesResult {
  success: boolean;
  data?: {
    project: any;
    pages: any[];
  };
  error?: string;
}
```

## 10. 总结

这个MVP版本的元数据结构设计具有以下特点：

**简单实用**：
- 只支持6种基础组件类型
- 流式布局，无需复杂的定位
- 简化的事件系统

**易于实现**：
- 基于现有Prisma schema
- JSON字段存储配置，灵活且易于查询
- 清晰的TypeScript类型定义

**可扩展**：
- 组件注册表设计便于后续添加新组件
- 配置结构支持渐进式增强
- API设计支持增量功能开发

**领域驱动设计**：
- 领域实体封装业务逻辑和验证规则
- 值对象确保数据一致性
- 领域事件实现解耦和扩展
- 仓储接口抽象数据访问
- 应用服务协调业务流程

这个方案可以快速实现一个可用的零代码编辑器原型，后续可以根据用户反馈逐步扩展功能。