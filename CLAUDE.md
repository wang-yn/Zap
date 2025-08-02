# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **zero-code development platform** built with a metadata-driven approach. The platform allows users to visually build applications through drag-and-drop interfaces and generates code from metadata configurations.

### Architecture
- **Frontend**: React 19 + TypeScript + Vite + Ant Design 5.x + Zustand
- **Backend**: NestJS 10 + TypeScript + Prisma ORM
- **Database**: PostgreSQL with Redis for caching
- **Containerization**: Docker + Docker Compose

## Development Commands

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 15.0
- Redis >= 7.0
- Docker (optional but recommended)

### Setup and Development

```bash
# Install dependencies (project uses pnpm)
cd frontend && pnpm install
cd backend && pnpm install

# Start services using Docker (recommended)
docker-compose up -d postgres redis

# Initialize database schema and seed data
cd backend && npx prisma db push    # Apply database schema
cd backend && npm run db:seed       # Create default admin user

# Start backend development server
cd backend && npm run start:dev

# Start frontend development server  
cd frontend && npm run dev
```

### Build Commands

```bash
# Frontend build (includes TypeScript compilation)
cd frontend && npm run build

# Backend build
cd backend && npm run build
```

### Linting and Formatting

```bash
# Frontend linting and formatting
cd frontend && npm run lint
cd frontend && npm run lint:fix
cd frontend && npm run format

# Backend linting and formatting
cd backend && npm run lint
cd backend && npm run format
```

### Database Management

```bash
# Database schema operations
cd backend && npx prisma db push           # Push schema changes to database
cd backend && npx prisma migrate deploy    # Deploy migrations in production
cd backend && npx prisma studio            # Open Prisma Studio GUI

# Database seeding
cd backend && npm run db:seed               # Create default admin user (admin@zap.com / admin123)
```

### Testing

```bash
# Backend testing (Jest with comprehensive test suites)
cd backend && npm run test          # Run all tests
cd backend && npm run test:watch    # Run tests in watch mode
cd backend && npm run test:cov      # Run tests with coverage
cd backend && npm run test:e2e      # Run end-to-end tests

# Frontend tests (not yet implemented)
cd frontend && npm run test
```

## Key Architecture Components

### Frontend Structure
- `src/components/` - Reusable UI components
  - `Layout/AppLayout.tsx` - Main application layout wrapper
- `src/pages/` - Page-level components
  - `Dashboard/` - Dashboard page implementation
  - `Placeholder/` - Placeholder page components
- `src/store/` - State management using Zustand
- `src/hooks/` - Custom React hooks
  - `useLocalStorage.ts` - Local storage utility hook
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions

### Backend Structure
采用领域驱动设计(DDD)架构：

- `src/domain/` - 领域层 (Domain Layer)
  - `entities/` - 领域实体 (Project, Page, Component)
  - `value-objects/` - 值对象 (ComponentProps, PageLayout, ProjectConfig)
  - `events/` - 领域事件 (ProjectCreated, PagePublished, ComponentAdded)
  - `services/` - 领域服务 (ProjectService, PageService)
  - `repositories/` - 仓储接口 (ProjectRepository, PageRepository)

- `src/application/` - 应用服务层 (Application Layer)
  - `services/` - 应用服务 (ProjectApplicationService, PageApplicationService)
  - `commands/` - 命令对象 (CreateProjectCommand, CreatePageCommand)
  - `queries/` - 查询对象 (GetProjectQuery, GetPagesQuery)

- `src/infrastructure/` - 基础设施层 (Infrastructure Layer)
  - `database/` - 数据库实现
    - `repositories/` - Prisma仓储实现
    - `mappers/` - 数据映射器
  - `events/` - 事件基础设施
    - `domain-event-dispatcher.ts` - 事件分发器
    - `event-handlers/` - 事件处理器

- `src/modules/` - 传统NestJS模块 (Presentation Layer)
  - `auth/` - 认证模块 (JWT策略)
  - `users/` - 用户管理模块
  - `projects/` - 项目管理模块

- `src/common/` - 共享工具和装饰器
  - `prisma/` - Prisma服务
- `src/config/` - 应用配置
- `prisma/schema.prisma` - 数据库schema定义

### Database Schema
Core entities with metadata-driven design:
- **User**: User authentication and profile (`id`, `email`, `username`, `password`, `avatar`)
- **Project**: Container for applications (`id`, `name`, `description`, `userId`, `status`, `config` JSON)
- **Page**: Individual pages with metadata (`id`, `projectId`, `name`, `path`, `components` JSON, `layout` JSON, `isPublished`)

#### Default Admin User
The system automatically creates a default administrator account during database seeding:
- **Email**: `admin@zap.com`
- **Username**: `admin`
- **Password**: `admin123`
- **Purpose**: Initial system access and user management

### Data Flow
The platform uses a domain-driven metadata approach where:
1. User interactions in the visual editor trigger domain commands
2. Domain entities (Project, Page, Component) validate business rules
3. Domain events are published for cross-cutting concerns
4. Metadata is stored in PostgreSQL JSON columns (`components`, `layout`, `config`)
5. Frontend renders components dynamically from metadata using React DnD
6. Code generation can produce static code from metadata configurations

### Domain Model
Key business concepts encapsulated in domain entities:
- **Project Entity**: Manages project lifecycle, validation, and business rules
- **Page Entity**: Handles page components, layout, and publishing logic
- **Component Entity**: Encapsulates component properties and validation
- **Value Objects**: ComponentProps, PageLayout, ProjectConfig ensure data consistency
- **Domain Events**: Enable loose coupling and event-driven architecture

### Docker Services
- `postgres`: PostgreSQL 15 database (port 5432, database: `zapdb`)
- `redis`: Redis 7 cache (port 6379)  
- `backend`: NestJS API server (port 3001)
- `frontend`: React dev server (port 3000, proxies /api to backend)

## Development Notes

- Uses TypeScript strict mode across the stack
- Frontend uses ESLint 9 + TypeScript-ESLint + Prettier for code quality
- Backend uses NestJS CLI for scaffolding and Jest for testing
- Database migrations handled through Prisma with PostgreSQL
- Follows conventional Git commit messages (feat/fix/docs/style/refactor/test/chore)
- Both frontend and backend support hot reload in development
- Frontend uses Vite with path aliases (@/ for src/)
- Backend includes JWT authentication with Passport and bcrypt

## Key Dependencies

### Frontend
- **UI**: `antd` (5.26.7), `@ant-design/icons`
- **State**: `zustand` (4.5.0)
- **Drag & Drop**: `react-dnd`, `react-dnd-html5-backend`
- **Build**: `vite` (7.0.4), `@vitejs/plugin-react`

### Backend  
- **Core**: `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
- **Auth**: `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcrypt`
- **Database**: `@prisma/client`, `prisma`
- **Validation**: `class-validator`, `class-transformer`

## Important Files

- `docker-compose.yml` - Development environment setup with PostgreSQL/Redis
- `frontend/vite.config.ts` - Frontend build configuration with proxy
- `backend/prisma/schema.prisma` - Database schema with User/Project/Page models
- `backend/prisma/seed.ts` - Database seeding script for default admin user
- `database/init.sql` - Database initialization script with setup instructions
- `docs/整体架构.md` - Detailed architecture documentation (in Chinese)
- `docs/开发指南.md` - Development guide (in Chinese)
- `docs/MVP实现方案.md` - MVP implementation plan (in Chinese)
- `docs/MVP元数据结构设计.md` - MVP metadata structure with domain-driven design (in Chinese)

## Recommended Practices

- 使用pnpm，而不是npm