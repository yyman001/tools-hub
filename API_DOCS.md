# Tool Hub API 接口文档

## 基础信息
- 基础URL: `http://localhost:3001/api`
- 认证方式: Bearer Token (JWT)
- 响应格式: JSON

## 通用响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

## 错误码说明
- 200: 成功
- 400: 请求参数错误
- 401: 未授权
- 403: 禁止访问
- 404: 资源不存在
- 500: 服务器内部错误

## 1. 用户相关接口

### 1.1 用户注册
- **POST** `/auth/register`
- **参数:**
```json
{
  "username": "string",
  "email": "string", 
  "password": "string"
}
```

### 1.2 用户登录
- **POST** `/auth/login`
- **参数:**
```json
{
  "email": "string",
  "password": "string"
}
```

### 1.3 获取用户信息
- **GET** `/auth/profile`
- **Headers:** `Authorization: Bearer {token}`

## 2. 工具相关接口

### 2.1 获取工具列表
- **GET** `/tools`
- **查询参数:**
  - `page`: 页码 (默认: 1)
  - `pageSize`: 每页数量 (默认: 20)
  - `category`: 分类ID
  - `keyword`: 搜索关键词
  - `tags`: 标签 (多个用逗号分隔)
  - `sortBy`: 排序字段 (createdAt|rating|viewCount|likeCount)
  - `sortOrder`: 排序方向 (asc|desc)

### 2.2 获取工具详情
- **GET** `/tools/{id}`

### 2.3 创建工具
- **POST** `/tools`
- **Headers:** `Authorization: Bearer {token}`
- **参数:**
```json
{
  "name": "string",
  "description": "string",
  "url": "string",
  "category": "string",
  "tags": ["string"],
  "screenshot": "string",
  "isPublic": true
}
```

### 2.4 更新工具
- **PUT** `/tools/{id}`
- **Headers:** `Authorization: Bearer {token}`

### 2.5 删除工具
- **DELETE** `/tools/{id}`
- **Headers:** `Authorization: Bearer {token}`

### 2.6 点赞工具
- **POST** `/tools/{id}/like`
- **Headers:** `Authorization: Bearer {token}`

### 2.7 收藏工具
- **POST** `/tools/{id}/favorite`
- **Headers:** `Authorization: Bearer {token}`

## 3. 分类相关接口

### 3.1 获取分类列表
- **GET** `/categories`

### 3.2 获取分类详情
- **GET** `/categories/{id}`

### 3.3 创建分类 (管理员)
- **POST** `/categories`
- **Headers:** `Authorization: Bearer {token}`
- **参数:**
```json
{
  "name": "string",
  "description": "string",
  "icon": "string",
  "color": "string"
}
```

## 4. 文章相关接口

### 4.1 获取文章列表
- **GET** `/articles`
- **查询参数:**
  - `page`: 页码
  - `pageSize`: 每页数量
  - `category`: 分类
  - `keyword`: 搜索关键词

### 4.2 获取文章详情
- **GET** `/articles/{id}`

### 4.3 创建文章
- **POST** `/articles`
- **Headers:** `Authorization: Bearer {token}`
- **参数:**
```json
{
  "title": "string",
  "content": "string",
  "summary": "string",
  "category": "string",
  "tags": ["string"],
  "isPublished": true
}
```

## 5. 搜索接口

### 5.1 全局搜索
- **GET** `/search`
- **查询参数:**
  - `q`: 搜索关键词
  - `type`: 搜索类型 (tools|articles|all)
  - `page`: 页码
  - `pageSize`: 每页数量

## 6. 统计接口

### 6.1 获取首页统计数据
- **GET** `/stats/dashboard`
- **响应:**
```json
{
  "totalTools": 1234,
  "totalUsers": 567,
  "totalCategories": 12,
  "totalArticles": 89,
  "popularTools": [],
  "recentTools": [],
  "popularCategories": []
}
```

## 7. 用户个人中心接口

### 7.1 获取我的工具
- **GET** `/user/tools`
- **Headers:** `Authorization: Bearer {token}`

### 7.2 获取我的收藏
- **GET** `/user/favorites`
- **Headers:** `Authorization: Bearer {token}`

### 7.3 获取我的文章
- **GET** `/user/articles`
- **Headers:** `Authorization: Bearer {token}`