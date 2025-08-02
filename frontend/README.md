# ZAP 零代码开发平台 - 前端

## 项目概述

ZAP 是一个现代化的零代码开发平台，提供可视化编辑、组件库管理和代码生成功能。

## 技术栈

- **框架**: React 18 + TypeScript
- **UI组件库**: Ant Design 5.x
- **构建工具**: Vite
- **拖拽库**: react-dnd
- **图标**: @ant-design/icons

## 快速开始

### 安装依赖

```bash
npm install
# 或者使用 pnpm
pnpm install
```

### 启动开发服务器

```bash
npm run dev
# 或者使用 pnpm
pnpm dev
```

开发服务器将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
# 或者使用 pnpm
pnpm build
```

## 项目结构

```
src/
├── components/          # 可复用组件
├── pages/              # 页面组件
├── store/              # 状态管理
├── hooks/              # 自定义 Hooks
├── utils/              # 工具函数
├── types/              # TypeScript 类型定义
├── assets/             # 静态资源
├── App.tsx             # 主应用组件
└── main.tsx            # 应用入口
```

## 当前功能

### ✅ 已实现功能

1. **现代化布局**
   - 响应式侧边栏导航
   - 顶部导航栏
   - 可折叠菜单

2. **首页仪表盘**
   - 欢迎区域
   - 功能特性展示
   - 最近项目展示
   - 快速操作按钮

3. **导航系统**
   - 仪表盘
   - 项目管理（所有项目、最近项目、收藏项目）
   - 模板中心
   - 组件库
   - 系统设置

4. **用户界面**
   - 用户头像和下拉菜单
   - 搜索功能
   - 通知系统
   - 创建项目按钮

### 🚧 开发中功能

- 用户认证系统
- 项目管理功能
- 可视化编辑器
- 模板中心
- 组件库管理

## 开发指南

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码

### 组件开发

- 使用函数式组件
- 使用 TypeScript 类型定义
- 遵循 Ant Design 设计规范

### 样式指南

- 优先使用 Ant Design 组件样式
- 自定义样式使用 CSS 类名
- 响应式设计支持移动端

## 部署

### 开发环境

```bash
npm run dev
```

### 生产环境

```bash
npm run build
npm run preview
```

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
