# 零代码开发平台

一个基于元数据驱动的零代码开发平台，支持可视化页面构建、动态数据模型设计和代码生成。

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- PostgreSQL >= 15.0
- Redis >= 7.0
- Docker >= 20.0 (可选)

### 安装依赖

```bash
# 安装前端依赖
cd frontend && pnpm install

# 安装后端依赖
cd backend && pnpm install
```

### 开发环境启动

```bash
# 启动数据库和Redis
docker-compose up -d postgres redis

# 启动后端服务
cd backend && npm run start:dev

# 启动前端服务
cd frontend && npm run dev
```

## 📁 项目结构

```
zap/
├── frontend/          # React前端应用
├── backend/           # NestJS后端服务
├── database/          # 数据库配置和迁移
├── docs/              # 项目文档
├── shared/            # 共享类型和工具
└── docker-compose.yml # 容器编排配置
```

## 📖 文档

- [整体架构设计](docs/整体架构.md)
- [MVP规划](docs/MVP规划.md)
- [开发指南](docs/开发指南.md)

## 🤝 贡献

欢迎提交Issue和Pull Request。

## 📄 许可证

MIT License