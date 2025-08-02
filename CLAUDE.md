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
- `src/modules/` - Feature modules (NestJS structure)
  - `auth/` - Authentication module with JWT strategy
  - `users/` - User management module
- `src/common/` - Shared utilities and decorators
  - `prisma/` - Prisma service for database operations
- `src/config/` - Application configuration
- `prisma/schema.prisma` - Database schema definition

### Database Schema
Core entities with metadata-driven design:
- **User**: User authentication and profile (`id`, `email`, `username`, `password`, `avatar`)
- **Project**: Container for applications (`id`, `name`, `description`, `userId`, `status`, `config` JSON)
- **Page**: Individual pages with metadata (`id`, `projectId`, `name`, `path`, `components` JSON, `layout` JSON, `isPublished`)

### Data Flow
The platform uses a metadata-driven approach where:
1. User interactions in the visual editor generate metadata
2. Metadata is stored in PostgreSQL JSON columns (`components`, `layout`, `config`)
3. Frontend renders components dynamically from metadata using React DnD
4. Code generation can produce static code from metadata configurations

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
- `database/init.sql` - Database initialization script
- `docs/整体架构.md` - Detailed architecture documentation (in Chinese)
- `docs/开发指南.md` - Development guide (in Chinese)
- `docs/MVP实现方案.md` - MVP implementation plan (in Chinese)

## Recommended Practices

- 使用pnpm，而不是npm