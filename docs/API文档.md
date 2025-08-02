# API文档

## 认证

### 用户注册
```
POST /api/auth/register
```

请求体：
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

### 用户登录
```
POST /api/auth/login
```

请求体：
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

响应：
```json
{
  "access_token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "username"
  }
}
```

## 项目管理

### 创建项目
```
POST /api/projects
```

请求体：
```json
{
  "name": "项目名称",
  "description": "项目描述"
}
```

### 获取项目列表
```
GET /api/projects
```

### 获取项目详情
```
GET /api/projects/:id
```

### 更新项目
```
PUT /api/projects/:id
```

### 删除项目
```
DELETE /api/projects/:id
```

## 页面管理

### 创建页面
```
POST /api/projects/:id/pages
```

请求体：
```json
{
  "name": "页面名称",
  "path": "/page-path",
  "components": [],
  "layout": {}
}
```

### 获取页面列表
```
GET /api/projects/:id/pages
```

### 获取页面详情
```
GET /api/projects/:id/pages/:pageId
```

### 更新页面
```
PUT /api/projects/:id/pages/:pageId
```

### 删除页面
```
DELETE /api/projects/:id/pages/:pageId
```

## 组件管理

### 获取组件列表
```
GET /api/components
```

### 获取组件详情
```
GET /api/components/:id
```

## 代码生成

### 生成代码
```
POST /api/projects/:id/generate
```

请求体：
```json
{
  "target": "frontend" | "backend" | "full"
}
```

### 获取生成状态
```
GET /api/projects/:id/generate/status
```

## 错误处理

所有API响应格式：
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

错误响应格式：
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误信息"
  }
}
```