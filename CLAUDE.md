# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **zero-code development platform** built with a metadata-driven approach. The platform allows users to visually build applications through drag-and-drop interfaces and generates code from metadata configurations.

### Architecture
- **Frontend**: React 18 + TypeScript + Vite + Ant Design
- **Backend**: NestJS + TypeScript + Prisma ORM
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
# Install dependencies
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
# Frontend build
cd frontend && npm run build

# Backend build
cd backend && npm run build
```

### Linting and Formatting

```bash
# Frontend linting
cd frontend && npm run lint
cd frontend && npm run lint:fix

# Backend linting
cd backend && npm run lint

# Format code
cd frontend && npm run format
cd backend && npm run format
```

### Testing

```bash
# Frontend tests (not yet implemented)
cd frontend && npm run test

# Backend tests (not yet implemented)
cd backend && npm run test
```

## Key Architecture Components

### Frontend Structure
- `src/components/` - Reusable UI components
- `src/pages/` - Page-level components
- `src/store/` - State management (likely Redux/Zustand)
- `src/hooks/` - Custom React hooks
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions

### Backend Structure
- `src/modules/` - Feature modules (NestJS structure)
- `src/common/` - Shared utilities and decorators
- `src/config/` - Application configuration
- `prisma/schema.prisma` - Database schema definition

### Database Schema
Core entities:
- **User**: User authentication and profile
- **Project**: Container for applications being built
- **Page**: Individual pages within projects with metadata

### Data Flow
The platform uses a metadata-driven approach where:
1. User interactions in the visual editor generate metadata
2. Metadata is stored in PostgreSQL (JSON columns)
3. Frontend renders components dynamically from metadata
4. Code generation can produce static code from metadata

### Docker Services
- `postgres`: PostgreSQL database (port 5432)
- `redis`: Redis cache (port 6379)  
- `backend`: NestJS API server (port 3001)
- `frontend`: React dev server (port 3000)

## Development Notes

- Uses TypeScript strict mode across the stack
- Frontend uses ESLint + Prettier for code quality
- Database migrations handled through Prisma
- Follows conventional Git commit messages
- Both frontend and backend support hot reload in development

## Important Files

- `docker-compose.yml` - Development environment setup
- `frontend/vite.config.ts` - Frontend build configuration
- `backend/prisma/schema.prisma` - Database schema
- `docs/整体架构.md` - Detailed architecture documentation (in Chinese)
- `docs/开发指南.md` - Development guide (in Chinese)