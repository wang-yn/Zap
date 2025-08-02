# 零代码开发平台 MVP 实现方案

## 1. 实现概述

### 1.1 方案目标
基于现有项目架构，实现零代码开发平台的MVP版本，包含：
- 用户认证系统
- 可视化编辑器
- 基础组件库
- 页面管理系统
- 简单代码生成功能

### 1.2 技术现状
- **前端**：React 18 + TypeScript + Vite + Ant Design（已配置）
- **后端**：NestJS + TypeScript + Prisma（基础架构已搭建）
- **数据库**：PostgreSQL（schema已定义）
- **缓存**：Redis（已配置）
- **容器化**：Docker Compose（已配置）

### 1.3 实现策略
采用渐进式开发方式，按模块优先级依次实现核心功能，确保每个阶段都有可用的产品演示。

## 2. 核心功能实现设计

### 2.1 用户认证系统

#### 2.1.1 数据模型（已存在）
```typescript
// Prisma Schema 已定义
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
```

#### 2.1.2 后端实现
```typescript
// 需实现的模块结构 - 领域驱动设计
backend/src/
├── modules/                    // 应用层模块
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   └── guards/
│   │       └── jwt-auth.guard.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   └── users.service.ts
│   └── projects/
│       ├── projects.module.ts
│       ├── projects.controller.ts
│       └── projects.service.ts
├── domain/                     // 领域层
│   ├── entities/
│   │   ├── project.entity.ts
│   │   ├── page.entity.ts
│   │   ├── component.entity.ts
│   │   └── user.entity.ts
│   ├── value-objects/
│   │   ├── component-props.vo.ts
│   │   ├── page-layout.vo.ts
│   │   └── project-config.vo.ts
│   ├── events/
│   │   ├── project-created.event.ts
│   │   ├── page-published.event.ts
│   │   └── component-added.event.ts
│   ├── services/
│   │   ├── project.service.ts
│   │   └── page.service.ts
│   └── repositories/
│       ├── project.repository.ts
│       ├── page.repository.ts
│       └── user.repository.ts
├── infrastructure/             // 基础设施层
│   ├── database/
│   │   ├── repositories/
│   │   │   ├── prisma-project.repository.ts
│   │   │   ├── prisma-page.repository.ts
│   │   │   └── prisma-user.repository.ts
│   │   └── mappers/
│   │       ├── project.mapper.ts
│   │       ├── page.mapper.ts
│   │       └── user.mapper.ts
│   └── events/
│       ├── domain-event-dispatcher.ts
│       └── event-handlers/
│           ├── project-created.handler.ts
│           └── page-published.handler.ts
└── application/                // 应用服务层
    ├── services/
    │   ├── project-application.service.ts
    │   └── page-application.service.ts
    ├── commands/
    │   ├── create-project.command.ts
    │   └── create-page.command.ts
    └── queries/
        ├── get-project.query.ts
        └── get-pages.query.ts
```

#### 2.1.3 前端实现
```typescript
// 需实现的页面结构
frontend/src/pages/
├── auth/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── components/
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
└── dashboard/
    ├── DashboardPage.tsx
    └── ProjectList.tsx

// 状态管理
frontend/src/store/
├── auth/
│   ├── authSlice.ts
│   └── authApi.ts
└── projects/
    ├── projectsSlice.ts
    └── projectsApi.ts
```

### 2.2 可视化编辑器

#### 2.2.1 编辑器架构
```typescript
// 编辑器核心组件结构
frontend/src/components/editor/
├── Editor.tsx              // 主编辑器容器
├── ComponentPanel.tsx      // 组件面板
├── Canvas.tsx             // 画布区域
├── PropertyPanel.tsx      // 属性面板
├── LayerPanel.tsx         // 图层面板
├── Toolbar.tsx            // 工具栏
└── components/            // 可拖拽的基础组件
    ├── DraggableButton.tsx
    ├── DraggableText.tsx
    ├── DraggableImage.tsx
    └── DraggableInput.tsx
```

#### 2.2.2 拖拽实现方案
使用 `react-dnd` 实现拖拽功能：

```typescript
// 拖拽类型定义
export const ItemTypes = {
  COMPONENT: 'component',
} as const;

// 可拖拽组件接口
interface DraggableComponent {
  id: string;
  type: string;
  props: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

// 画布拖拽目标
const Canvas: React.FC = () => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.COMPONENT,
    drop: (item: DraggableComponent, monitor) => {
      const offset = monitor.getDropResult();
      addComponent(item, offset);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
};
```

#### 2.2.3 元数据管理
```typescript
// 页面元数据结构
interface PageMetadata {
  id: string;
  name: string;
  components: ComponentMetadata[];
  layout: LayoutConfig;
  theme: ThemeConfig;
}

interface ComponentMetadata {
  id: string;
  type: 'Button' | 'Text' | 'Image' | 'Input';
  props: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  events?: EventConfig[];
}
```

### 2.3 基础组件库

#### 2.3.1 组件定义
```typescript
// 组件注册表
export const ComponentRegistry = {
  Button: {
    name: 'Button',
    icon: 'button',
    category: 'Basic',
    defaultProps: {
      text: 'Button',
      type: 'primary',
      size: 'middle',
    },
    configurable: ['text', 'type', 'size', 'disabled'],
    events: ['onClick'],
  },
  Text: {
    name: 'Text',
    icon: 'font-size',
    category: 'Basic',
    defaultProps: {
      content: 'Sample Text',
      fontSize: 14,
      color: '#000000',
    },
    configurable: ['content', 'fontSize', 'color', 'fontWeight'],
    events: [],
  },
  Input: {
    name: 'Input',
    icon: 'input',
    category: 'Form',
    defaultProps: {
      placeholder: 'Please input',
      type: 'text',
      size: 'middle',
    },
    configurable: ['placeholder', 'type', 'size', 'required'],
    events: ['onChange', 'onBlur'],
  },
  Image: {
    name: 'Image',
    icon: 'image',
    category: 'Media',
    defaultProps: {
      src: 'https://via.placeholder.com/150',
      alt: 'Image',
      width: 150,
      height: 150,
    },
    configurable: ['src', 'alt', 'width', 'height'],
    events: ['onClick'],
  },
};
```

#### 2.3.2 动态渲染引擎
```typescript
// 组件渲染器
export const ComponentRenderer: React.FC<{ metadata: ComponentMetadata }> = ({ metadata }) => {
  const { type, props, events } = metadata;
  
  const renderComponent = () => {
    switch (type) {
      case 'Button':
        return (
          <Button
            {...props}
            onClick={() => handleEvent('onClick', events?.onClick)}
          >
            {props.text}
          </Button>
        );
      case 'Text':
        return (
          <span
            style={{
              fontSize: props.fontSize,
              color: props.color,
              fontWeight: props.fontWeight,
            }}
          >
            {props.content}
          </span>
        );
      case 'Input':
        return (
          <Input
            {...props}
            onChange={(e) => handleEvent('onChange', events?.onChange, e.target.value)}
          />
        );
      case 'Image':
        return (
          <img
            src={props.src}
            alt={props.alt}
            width={props.width}
            height={props.height}
            onClick={() => handleEvent('onClick', events?.onClick)}
          />
        );
      default:
        return <div>Unknown Component</div>;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: metadata.position.x,
        top: metadata.position.y,
        width: metadata.size.width,
        height: metadata.size.height,
      }}
    >
      {renderComponent()}
    </div>
  );
};
```

### 2.4 页面管理系统

#### 2.4.1 数据模型（已存在）
```typescript
// Prisma Schema 已定义
model Page {
  id          String   @id @default(cuid())
  projectId   String
  name        String
  path        String
  components  Json     @default("[]")
  layout      Json     @default("{}")
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  project Project @relation(fields: [projectId], references: [id])
}
```

#### 2.4.2 后端API设计
```typescript
// pages.controller.ts
@Controller('projects/:projectId/pages')
export class PagesController {
  @Get()
  async getPages(@Param('projectId') projectId: string) {
    // 获取项目下的所有页面
  }

  @Post()
  async createPage(@Param('projectId') projectId: string, @Body() createPageDto: CreatePageDto) {
    // 创建新页面
  }

  @Get(':pageId')
  async getPage(@Param('pageId') pageId: string) {
    // 获取页面详情
  }

  @Put(':pageId')
  async updatePage(@Param('pageId') pageId: string, @Body() updatePageDto: UpdatePageDto) {
    // 更新页面内容
  }

  @Post(':pageId/publish')
  async publishPage(@Param('pageId') pageId: string) {
    // 发布页面
  }

  @Get(':pageId/preview')
  async previewPage(@Param('pageId') pageId: string) {
    // 预览页面
  }
}
```

#### 2.4.3 前端页面管理
```typescript
// 页面管理界面
frontend/src/pages/editor/
├── EditorLayout.tsx       // 编辑器布局
├── PageEditor.tsx         // 页面编辑器
├── PagePreview.tsx        // 页面预览
└── components/
    ├── PageList.tsx       // 页面列表
    ├── PageSettings.tsx   // 页面设置
    └── PublishDialog.tsx  // 发布对话框
```

### 2.5 代码生成功能

#### 2.5.1 代码生成器架构
```typescript
// 代码生成器模块
backend/src/modules/codegen/
├── codegen.module.ts
├── codegen.controller.ts
├── codegen.service.ts
├── templates/
│   ├── component.template.ts
│   ├── page.template.ts
│   └── api.template.ts
└── generators/
    ├── react-generator.ts
    ├── api-generator.ts
    └── build-generator.ts
```

#### 2.5.2 模板引擎
```typescript
// 组件模板
export const ComponentTemplate = `
import React from 'react';
import { {{imports}} } from 'antd';

interface {{componentName}}Props {
  {{propsInterface}}
}

const {{componentName}}: React.FC<{{componentName}}Props> = ({{propsDestructuring}}) => {
  return (
    <div className="{{className}}">
      {{componentContent}}
    </div>
  );
};

export default {{componentName}};
`;

// 页面模板
export const PageTemplate = `
import React from 'react';
{{componentImports}}

const {{pageName}}: React.FC = () => {
  return (
    <div className="page-container">
      {{pageContent}}
    </div>
  );
};

export default {{pageName}};
`;
```

#### 2.5.3 生成器实现
```typescript
// React组件生成器
export class ReactGenerator {
  generateComponent(metadata: ComponentMetadata): string {
    const template = this.getTemplate(metadata.type);
    return this.renderTemplate(template, {
      componentName: this.getComponentName(metadata),
      imports: this.getImports(metadata),
      propsInterface: this.generatePropsInterface(metadata),
      propsDestructuring: this.generatePropsDestructuring(metadata),
      componentContent: this.generateComponentContent(metadata),
      className: this.generateClassName(metadata),
    });
  }

  generatePage(pageMetadata: PageMetadata): string {
    const components = pageMetadata.components.map(comp => 
      this.generateComponent(comp)
    );
    
    return this.renderTemplate(PageTemplate, {
      pageName: pageMetadata.name,
      componentImports: this.generateComponentImports(components),
      pageContent: this.generatePageContent(pageMetadata),
    });
  }
}
```

## 3. 实现路线图

### 3.1 第一阶段：基础架构完善（1周）

#### 任务清单
- [x] ✅ 完善后端模块结构 - 领域驱动设计
  - [ ] 创建领域实体层 (Project, Page, Component)
  - [ ] 实现值对象 (ComponentProps, PageLayout, ProjectConfig)
  - [ ] 定义领域事件系统
  - [ ] 创建仓储接口
  - [ ] 实现领域服务
  - [ ] 创建应用服务层
  - [ ] 实现基础设施层 (Prisma 仓储实现)
  - [ ] 配置事件分发器
  - [ ] 创建传统模块 (auth, users, projects)
  - [ ] 配置 JWT 认证
  - [ ] 设置 Swagger API 文档

- [x] ✅ 完善前端架构
  - [ ] 配置 Redux Toolkit
  - [ ] 设置路由结构
  - [ ] 创建基础布局组件
  - [ ] 配置 Ant Design 主题

#### 交付物
- 完整的领域驱动设计后端结构
- 配置完整的前端状态管理
- API 文档和接口规范
- 领域事件系统基础设施

### 3.2 第二阶段：用户系统实现（1周）

#### 任务清单
- [ ] 🔄 用户认证后端实现
  - [ ] 实现用户领域实体和值对象
  - [ ] 创建用户仓储接口和实现
  - [ ] 实现用户注册/登录应用服务
  - [ ] JWT token 生成和验证
  - [ ] 密码加密存储
  - [ ] 用户信息管理 API

- [ ] 🔄 用户认证前端实现
  - [ ] 登录页面组件
  - [ ] 注册页面组件
  - [ ] 认证状态管理
  - [ ] 路由守卫实现

- [ ] 🔄 项目管理功能
  - [ ] 项目领域服务实现
  - [ ] 项目应用服务实现
  - [ ] 项目创建/编辑/删除 API
  - [ ] 项目列表和详情页面
  - [ ] 项目权限控制
  - [ ] 项目相关领域事件处理

#### 交付物
- 完整的用户认证系统
- 项目管理功能
- 用户权限控制机制

### 3.3 第三阶段：编辑器核心功能（2周）

#### 任务清单
- [ ] 🔄 编辑器基础架构
  - [ ] 编辑器主布局组件
  - [ ] 组件面板实现
  - [ ] 画布区域实现
  - [ ] 属性面板实现

- [ ] 🔄 拖拽功能实现
  - [ ] 配置 react-dnd
  - [ ] 组件拖拽逻辑
  - [ ] 画布放置逻辑
  - [ ] 组件选择和编辑

- [ ] 🔄 基础组件库
  - [ ] Button 组件
  - [ ] Text 组件
  - [ ] Input 组件
  - [ ] Image 组件
  - [ ] 组件注册机制

- [ ] 🔄 元数据管理
  - [ ] 页面领域实体和组件管理
  - [ ] 组件值对象和属性验证
  - [ ] 页面布局值对象
  - [ ] 页面和组件相关领域事件
  - [ ] 页面应用服务实现
  - [ ] 实时预览功能
  - [ ] 撤销/重做功能

#### 交付物
- 功能完整的可视化编辑器
- 基础组件库
- 实时预览系统

### 3.4 第四阶段：页面管理和发布（1周）

#### 任务清单
- [ ] 🔄 页面管理后端
  - [ ] 页面领域服务完善
  - [ ] 页面仓储实现优化
  - [ ] 页面 CRUD API
  - [ ] 页面元数据存储
  - [ ] 页面发布状态管理
  - [ ] 页面预览接口
  - [ ] 页面发布相关领域事件

- [ ] 🔄 页面管理前端
  - [ ] 页面列表管理
  - [ ] 页面设置界面
  - [ ] 页面预览功能
  - [ ] 页面发布流程

#### 交付物
- 页面管理系统
- 页面预览和发布功能
- 完整的用户操作流程

### 3.5 第五阶段：代码生成功能（1.5周）

#### 任务清单
- [ ] 🔄 代码生成引擎
  - [ ] 模板引擎实现
  - [ ] React 组件生成器
  - [ ] 页面代码生成器
  - [ ] 构建脚本生成

- [ ] 🔄 代码生成接口
  - [ ] 代码生成 API
  - [ ] 生成结果预览
  - [ ] 代码下载功能
  - [ ] 部署脚本生成

#### 交付物
- 代码生成引擎
- 完整的代码导出功能
- 构建和部署脚本

### 3.6 第六阶段：测试和优化（0.5周）  

#### 任务清单
- [ ] 🔄 功能测试
  - [ ] 端到端测试用例
  - [ ] 用户操作流程测试
  - [ ] 兼容性测试
  - [ ] 性能测试

- [ ] 🔄 优化改进
  - [ ] 用户体验优化
  - [ ] 性能优化
  - [ ] 错误处理完善
  - [ ] 文档补充

#### 交付物
- 完整的测试报告
- 性能优化报告
- 用户使用文档

## 4. 技术实现细节

### 4.1 状态管理设计

#### 4.1.1 Redux Store 结构
```typescript
// store 结构设计
interface RootState {
  auth: {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
  };
  projects: {
    list: Project[];
    current: Project | null;
    loading: boolean;
  };
  editor: {
    currentPage: PageMetadata | null;
    components: ComponentMetadata[];
    selectedComponent: string | null;
    history: EditorHistory[];
    clipboard: ComponentMetadata[];
  };
  ui: {
    sidebarCollapsed: boolean;
    activePanel: 'components' | 'properties' | 'layers';
    theme: 'light' | 'dark';
  };
}
```

#### 4.1.2 API 集成
```typescript
// RTK Query API 设计
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Project', 'Page'],
  endpoints: (builder) => ({
    // 认证相关
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    // 项目相关
    getProjects: builder.query<Project[], void>({
      query: () => 'projects',
      providesTags: ['Project'],
    }),
    
    // 页面相关
    getPages: builder.query<Page[], string>({
      query: (projectId) => `projects/${projectId}/pages`,
      providesTags: ['Page'],
    }),
    
    updatePage: builder.mutation<Page, { id: string; data: Partial<Page> }>({
      query: ({ id, data }) => ({
        url: `pages/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Page'],
    }),
  }),
});
```

### 4.2 数据库优化

#### 4.2.1 索引优化
```sql
-- 为常用查询添加索引
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_pages_project_id ON pages(project_id);  
CREATE INDEX idx_pages_published ON pages(is_published);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

#### 4.2.2 查询优化
```typescript
// 优化的查询示例
export class ProjectsService {
  async getProjectsWithPages(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      include: {
        pages: {
          select: {
            id: true,
            name: true,
            path: true,
            isPublished: true,
            updatedAt: true,
          },
        },
        _count: {
          select: { pages: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
```

### 4.3 性能优化策略

#### 4.3.1 前端优化
```typescript
// 组件懒加载
const Editor = lazy(() => import('./components/Editor'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// 虚拟化长列表
import { FixedSizeList as List } from 'react-window';

const ComponentList: React.FC = () => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ComponentItem component={components[index]} />
    </div>
  );

  return (
    <List
      height={400}
      itemCount={components.length}
      itemSize={60}
    >
      {Row}
    </List>
  );
};

// 防抖的属性更新
const useDebounceUpdate = (callback: Function, delay: number) => {
  return useMemo(
    () => debounce(callback, delay),
    [callback, delay]
  );
};
```

#### 4.3.2 后端优化
```typescript
// 缓存策略
@Injectable()
export class CacheService {
  constructor(private redis: Redis) {}

  async getOrSet<T>(
    key: string,
    getter: () => Promise<T>,
    ttl: number = 3600
  ): Promise<T> {
    const cached = await this.redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    const data = await getter();
    await this.redis.setex(key, ttl, JSON.stringify(data));
    return data;
  }
}

// 分页查询
@Get()
async getPages(
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
  @Query('search') search?: string,
) {
  const skip = (page - 1) * limit;
  
  const where = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { path: { contains: search, mode: 'insensitive' } },
    ],
  } : {};

  const [pages, total] = await Promise.all([
    this.prisma.page.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' },
    }),
    this.prisma.page.count({ where }),
  ]);

  return {
    data: pages,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
```

## 5. 部署方案

### 5.1 开发环境部署
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: zapuser
      POSTGRES_PASSWORD: zappass
      POSTGRES_DB: zapdb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://zapuser:zappass@postgres:5432/zapdb
      REDIS_URL: redis://redis:6379
      JWT_SECRET: dev-secret-key
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run start:dev

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: http://localhost:3001
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev
```

### 5.2 生产环境部署
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - app-network

  backend:
    build:
      context: ./backend
      target: production
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    depends_on:
      - postgres
      - redis
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
      target: production
    environment:
      VITE_API_URL: ${API_URL}
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

## 6. 质量保证

### 6.1 测试策略

#### 6.1.1 单元测试
```typescript
// 组件测试示例
describe('ComponentRenderer', () => {
  it('should render Button component correctly', () => {
    const metadata: ComponentMetadata = {
      id: '1',
      type: 'Button',
      props: { text: 'Test Button', type: 'primary' },
      position: { x: 0, y: 0 },
      size: { width: 100, height: 32 },
    };

    render(<ComponentRenderer metadata={metadata} />);
    
    expect(screen.getByText('Test Button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('ant-btn-primary');
  });
});

// 服务测试示例
describe('ProjectsService', () => {
  it('should create project successfully', async () => {
    const projectData = {
      name: 'Test Project',
      description: 'Test Description',
      userId: 'user-1',
    };

    const result = await projectsService.create(projectData);
    
    expect(result).toMatchObject(projectData);
    expect(result.id).toBeDefined();
  });
});
```

#### 6.1.2 集成测试
```typescript
// API 集成测试
describe('Projects API', () => {
  it('should create and retrieve project', async () => {
    const authToken = await getAuthToken();
    
    // 创建项目
    const createResponse = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Integration Test Project',
        description: 'Test Description',
      })
      .expect(201);

    const projectId = createResponse.body.id;

    // 获取项目
    const getResponse = await request(app.getHttpServer())
      .get(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(getResponse.body.name).toBe('Integration Test Project');
  });
});
```

#### 6.1.3 E2E 测试
```typescript
// Cypress E2E 测试
describe('Editor Workflow', () => {
  it('should create a page and add components', () => {
    // 登录
    cy.login('user@example.com', 'password');
    
    // 创建项目
    cy.visit('/dashboard');
    cy.get('[data-testid=create-project]').click();
    cy.get('[data-testid=project-name]').type('Test Project');
    cy.get('[data-testid=create-button]').click();
    
    // 进入编辑器
    cy.get('[data-testid=edit-project]').click();
    
    // 拖拽组件
    cy.get('[data-testid=component-button]').drag('[data-testid=canvas]');
    
    // 验证组件已添加
    cy.get('[data-testid=canvas]').should('contain', 'Button');
    
    // 保存页面
    cy.get('[data-testid=save-page]').click();
    cy.get('[data-testid=success-message]').should('be.visible');
  });
});
```

### 6.2 代码质量检查

#### 6.2.1 ESLint 配置
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": "warn"
  }
}
```

#### 6.2.2 Prettier 配置
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

## 7. 监控和日志

### 7.1 应用监控
```typescript
// 性能监控中间件
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const request = context.switchToHttp().getRequest();
    
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        console.log(`${request.method} ${request.url} - ${duration}ms`);
        
        // 记录慢查询
        if (duration > 1000) {
          console.warn(`Slow request: ${request.method} ${request.url} - ${duration}ms`);
        }
      })
    );
  }
}
```

### 7.2 错误处理
```typescript
// 全局错误处理
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : 500;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception instanceof Error ? exception.message : 'Internal server error',
    };

    // 记录错误日志
    console.error('Exception caught:', {
      ...errorResponse,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(status).json(errorResponse);
  }
}
```

## 8. 成功标准

### 8.1 技术指标
- [ ] 页面加载时间 < 3秒
- [ ] API 响应时间 < 500ms
- [ ] 单元测试覆盖率 > 80%
- [ ] 构建时间 < 5分钟

### 8.2 功能指标
- [ ] 支持 4 种基础组件类型
- [ ] 支持拖拽编辑功能
- [ ] 支持实时预览
- [ ] 支持代码生成和导出

### 8.3 用户体验指标
- [ ] 从注册到创建第一个页面 < 5分钟
- [ ] 编辑器操作响应时间 < 100ms
- [ ] 支持撤销/重做功能
- [ ] 错误提示友好清晰

## 9. 风险控制

### 9.1 技术风险应对
- **拖拽性能问题**：使用虚拟化和节流技术
- **状态管理复杂**：采用模块化的 Redux 设计
- **代码生成质量**：建立完善的模板和测试机制

### 9.2 进度风险应对
- **任务延期**：每周进度检查，及时调整优先级
- **资源不足**：重点保证核心功能，扩展功能可后置
- **技术难点**：预研技术方案，寻求社区支持

## 10. 总结

本实现方案基于现有项目架构，采用渐进式开发方式，在 6.5 周内完成 MVP 版本。重点实现用户认证、可视化编辑器、基础组件库、页面管理和代码生成五大核心功能。

通过合理的技术选型、完善的测试策略和有效的风险控制，确保 MVP 版本能够验证产品核心价值，为后续迭代奠定坚实基础。