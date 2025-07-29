# Tool Hub - 工具导航站

一个现代化的工具收集和分享平台，帮助用户发现、收集和分享优质的工具和资源。

## 🚀 项目特性

### 核心功能
- **工具管理**：添加、编辑、删除工具记录
- **分类系统**：按类别组织工具（开发工具、设计工具、效率工具等）
- **搜索功能**：快速查找特定工具
- **用户系统**：注册、登录、个人工具库管理
- **响应式设计**：完美适配桌面端和移动端

### 技术特性
- **现代化UI**：使用 Tailwind CSS 构建的美观界面
- **类型安全**：完整的 TypeScript 支持
- **模块化架构**：清晰的项目结构和代码组织
- **模拟数据**：内置模拟API，便于开发和演示

## 🛠️ 技术栈

### 前端框架
- **Vue 3** - 渐进式JavaScript框架
- **Composition API** - 使用 setup 语法糖
- **TypeScript** - 类型安全的JavaScript超集
- **Vite** - 快速的构建工具

### 样式和UI
- **Tailwind CSS** - 实用优先的CSS框架
- **响应式设计** - 适配各种屏幕尺寸
- **现代化组件** - 卡片、按钮、表单等精美组件

### 状态管理和路由
- **Pinia** - Vue 3 状态管理库
- **Vue Router** - 官方路由管理器
- **路由守卫** - 权限控制和页面保护

### 开发工具
- **ESLint** - 代码质量检查
- **TypeScript ESLint** - TypeScript 代码规范
- **PostCSS** - CSS 后处理器

## 📁 项目结构

```
tool-hub/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   │   ├── index.ts       # API 服务类
│   │   └── mock.ts        # 模拟数据和API
│   ├── components/        # 通用组件
│   │   ├── AppHeader.vue  # 全局导航头
│   │   └── AppFooter.vue  # 全局页脚
│   ├── router/            # 路由配置
│   │   └── index.ts       # 路由定义和守卫
│   ├── stores/            # 状态管理
│   │   └── index.ts       # Pinia stores
│   ├── types/             # TypeScript 类型定义
│   │   └── index.ts       # 全局类型
│   ├── views/             # 页面组件
│   │   ├── auth/          # 认证相关页面
│   │   │   ├── Login.vue  # 登录页面
│   │   │   └── Register.vue # 注册页面
│   │   ├── categories/    # 分类相关页面
│   │   │   ├── Categories.vue # 分类列表
│   │   │   └── CategoryDetail.vue # 分类详情
│   │   ├── tools/         # 工具相关页面
│   │   │   ├── Tools.vue  # 工具列表
│   │   │   ├── ToolDetail.vue # 工具详情
│   │   │   └── AddTool.vue # 添加工具
│   │   ├── user/          # 用户相关页面
│   │   │   └── Profile.vue # 个人中心
│   │   ├── Home.vue       # 首页
│   │   └── Search.vue     # 搜索结果页
│   ├── App.vue            # 根组件
│   ├── main.ts            # 应用入口
│   └── style.css          # 全局样式
├── API_DOCS.md            # API 接口文档
├── README.md              # 项目说明
├── package.json           # 项目配置
├── tailwind.config.js     # Tailwind 配置
├── tsconfig.json          # TypeScript 配置
└── vite.config.ts         # Vite 配置
```

## 🎨 页面设计

### 首页 (Home.vue)
- **Hero 区域**：品牌展示和搜索功能
- **热门分类**：展示主要工具分类
- **最新工具**：显示最近添加的工具

### 工具相关页面
- **工具列表** (Tools.vue)：筛选、搜索、分页功能
- **工具详情** (ToolDetail.vue)：Hero设计、详细信息、用户评价
- **添加工具** (AddTool.vue)：表单验证、标签管理

### 分类相关页面
- **分类列表** (Categories.vue)：网格布局展示所有分类
- **分类详情** (CategoryDetail.vue)：Hero设计、工具列表、视图切换

### 用户相关页面
- **登录/注册** (Login.vue, Register.vue)：简洁的表单设计
- **个人中心** (Profile.vue)：标签页设计、工具管理

## 🔧 开发指南

### 环境要求
- Node.js 16+
- npm 或 pnpm

### 安装依赖
```bash
npm install
# 或
pnpm install
```

### 开发服务器
```bash
npm run dev
# 或
pnpm dev
```

### 构建生产版本
```bash
npm run build
# 或
pnpm build
```

### 代码检查
```bash
npm run lint
# 或
pnpm lint
```

## 📱 响应式设计

### 断点设置
- **sm**: 640px+ (手机横屏)
- **md**: 768px+ (平板)
- **lg**: 1024px+ (小型桌面)
- **xl**: 1280px+ (桌面)
- **2xl**: 1536px+ (大屏幕)

### 适配策略
- 移动端优先的设计理念
- 灵活的网格布局系统
- 自适应的导航和菜单
- 触摸友好的交互设计

## 🎯 核心功能说明

### 工具管理
- 支持添加工具的基本信息（名称、描述、链接等）
- 分类和标签系统便于组织
- 评分和统计功能
- 公开/私有设置

### 搜索和筛选
- 全文搜索功能
- 按分类筛选
- 按标签筛选
- 多种排序方式（时间、评分、浏览量等）

### 用户系统
- 用户注册和登录
- 个人工具库管理
- 收藏功能
- 个人资料管理

## 🔮 未来规划

### 功能扩展
- [ ] 文章系统
- [ ] 评论和评价系统
- [ ] 工具推荐算法
- [ ] 社交分享功能
- [ ] 数据导入/导出

### 技术优化
- [ ] 服务端渲染 (SSR)
- [ ] 渐进式Web应用 (PWA)
- [ ] 国际化支持
- [ ] 性能优化
- [ ] 单元测试

## 📄 许可证

MIT License

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

---

**Tool Hub** - 让工具发现变得更简单 🛠️