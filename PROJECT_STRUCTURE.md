# Tool Hub 项目结构文档

## 📁 完整目录结构

```
tool-hub/
├── public/                          # 静态资源目录
├── src/                            # 源代码目录
│   ├── api/                        # API 接口层
│   │   ├── index.ts               # API 服务类，统一接口调用
│   │   └── mock.ts                # 模拟数据和 Mock API 实现
│   │
│   ├── components/                 # 全局通用组件
│   │   ├── AppHeader.vue          # 全局导航头组件
│   │   └── AppFooter.vue          # 全局页脚组件
│   │
│   ├── router/                     # 路由配置
│   │   └── index.ts               # Vue Router 配置和路由守卫
│   │
│   ├── stores/                     # 状态管理
│   │   └── index.ts               # Pinia stores (用户、工具、分类)
│   │
│   ├── types/                      # TypeScript 类型定义
│   │   └── index.ts               # 全局类型定义
│   │
│   ├── views/                      # 页面组件 (按功能模块组织)
│   │   ├── auth/                  # 认证相关页面
│   │   │   ├── Login.vue          # 用户登录页面
│   │   │   └── Register.vue       # 用户注册页面
│   │   │
│   │   ├── categories/            # 分类相关页面
│   │   │   ├── Categories.vue     # 分类列表页面
│   │   │   └── CategoryDetail.vue # 分类详情页面
│   │   │
│   │   ├── tools/                 # 工具相关页面
│   │   │   ├── Tools.vue          # 工具列表页面
│   │   │   ├── ToolDetail.vue     # 工具详情页面
│   │   │   └── AddTool.vue        # 添加工具页面
│   │   │
│   │   ├── user/                  # 用户相关页面
│   │   │   └── Profile.vue        # 个人中心页面
│   │   │
│   │   ├── Home.vue               # 首页
│   │   └── Search.vue             # 搜索结果页面
│   │
│   ├── App.vue                     # 根组件
│   ├── main.ts                     # 应用程序入口点
│   └── style.css                   # 全局样式文件
│
├── API_DOCS.md                     # API 接口文档
├── README.md                       # 项目说明文档
├── PROJECT_STRUCTURE.md            # 项目结构文档 (本文件)
├── package.json                    # 项目依赖和脚本配置
├── tailwind.config.js              # Tailwind CSS 配置
├── tsconfig.json                   # TypeScript 配置
├── tsconfig.node.json              # Node.js TypeScript 配置
├── vite.config.ts                  # Vite 构建工具配置
├── postcss.config.js               # PostCSS 配置
├── .eslintrc.js                    # ESLint 代码规范配置
└── .gitignore                      # Git 忽略文件配置
```

## 🎯 模块功能说明

### 1. API 层 (`src/api/`)
- **index.ts**: 统一的 API 服务类，封装所有接口调用
- **mock.ts**: 模拟数据和 Mock API，用于开发和演示

### 2. 组件层 (`src/components/`)
- **AppHeader.vue**: 全局导航头，包含 Logo、菜单、搜索、用户操作
- **AppFooter.vue**: 全局页脚，包含链接、版权信息

### 3. 路由层 (`src/router/`)
- **index.ts**: 路由配置、路由守卫、权限控制

### 4. 状态管理 (`src/stores/`)
- **useUserStore**: 用户状态管理（登录、注册、个人信息）
- **useToolStore**: 工具状态管理（工具列表、详情、创建）
- **useCategoryStore**: 分类状态管理（分类列表、详情）

### 5. 类型定义 (`src/types/`)
- **Tool**: 工具数据结构
- **Category**: 分类数据结构
- **User**: 用户数据结构
- **Article**: 文章数据结构
- **ApiResponse**: API 响应结构
- **SearchParams**: 搜索参数结构

### 6. 页面组件 (`src/views/`)

#### 认证模块 (`auth/`)
- **Login.vue**: 用户登录，表单验证，错误处理
- **Register.vue**: 用户注册，密码确认，表单验证

#### 分类模块 (`categories/`)
- **Categories.vue**: 分类网格展示，点击跳转详情
- **CategoryDetail.vue**: 分类详情，Hero 设计，工具列表，视图切换

#### 工具模块 (`tools/`)
- **Tools.vue**: 工具列表，筛选搜索，分页功能
- **ToolDetail.vue**: 工具详情，Hero 设计，详细信息，用户评价
- **AddTool.vue**: 添加工具，表单验证，标签管理

#### 用户模块 (`user/`)
- **Profile.vue**: 个人中心，标签页设计，工具管理

#### 通用页面
- **Home.vue**: 首页，Hero 区域，分类展示，最新工具
- **Search.vue**: 搜索结果，关键词高亮，结果分类

## 🎨 设计系统

### 颜色主题
- **Primary**: 蓝色系 (#3B82F6)
- **Secondary**: 灰色系
- **Success**: 绿色系
- **Warning**: 黄色系
- **Error**: 红色系

### 组件规范
- **Card**: 白色背景，圆角，阴影
- **Button**: 主要按钮、次要按钮、文本按钮
- **Input**: 统一的输入框样式
- **Badge**: 标签和徽章样式

### 响应式断点
- **sm**: 640px+ (手机横屏)
- **md**: 768px+ (平板)
- **lg**: 1024px+ (小型桌面)
- **xl**: 1280px+ (桌面)
- **2xl**: 1536px+ (大屏幕)

## 🔄 数据流

### 状态管理流程
1. **组件** → 调用 Store 方法
2. **Store** → 调用 API Service
3. **API Service** → 调用 Mock API
4. **Mock API** → 返回模拟数据
5. **Store** → 更新状态
6. **组件** → 响应状态变化

### 路由导航流程
1. **用户操作** → 触发路由跳转
2. **路由守卫** → 检查权限和认证
3. **组件加载** → 异步加载页面组件
4. **数据获取** → 组件挂载时获取数据
5. **页面渲染** → 展示最终内容

## 🚀 开发工作流

### 添加新功能
1. 在 `types/index.ts` 中定义类型
2. 在 `api/mock.ts` 中添加模拟数据
3. 在 `stores/index.ts` 中添加状态管理
4. 在 `views/` 对应模块中创建页面组件
5. 在 `router/index.ts` 中添加路由配置

### 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 ESLint 代码规范
- 使用 Composition API 和 setup 语法
- 组件命名使用 PascalCase
- 文件命名使用 PascalCase

## 📦 构建和部署

### 开发环境
```bash
npm run dev          # 启动开发服务器
npm run lint         # 代码检查
npm run lint:check   # 检查代码规范
```

### 生产环境
```bash
npm run build        # 构建生产版本
npm run preview      # 预览生产版本
```

## 🔧 配置文件说明

- **vite.config.ts**: Vite 构建配置，路径别名，插件配置
- **tailwind.config.js**: Tailwind CSS 配置，主题定制
- **tsconfig.json**: TypeScript 编译配置
- **.eslintrc.js**: ESLint 代码规范配置
- **postcss.config.js**: PostCSS 处理配置

---

这个项目结构设计遵循了模块化、可维护性和可扩展性的原则，便于团队协作和项目维护。