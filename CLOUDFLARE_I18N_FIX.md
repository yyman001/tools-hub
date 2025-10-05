# Cloudflare Pages vue-i18n 修复方案

## 问题描述

在 Cloudflare Pages 上部署时遇到 `SyntaxError: Invalid linked format` 错误，这是由于 vue-i18n 在 Cloudflare 环境下加载语言文件时出现的兼容性问题。

## 修复方案

### 1. 语言文件格式转换

**问题**：TypeScript 格式的语言文件在构建时可能产生格式错误
**解决**：将语言文件从 `.ts` 格式转换为 `.json` 格式

- `src/locales/zh-CN.ts` → `src/locales/zh-CN.json`
- `src/locales/en-US.ts` → `src/locales/en-US.json`

### 2. i18n 配置优化

**更新文件**：`src/locales/index.ts`

**主要改进**：
- 添加 SSR 环境检查
- 增强错误处理
- 优化浏览器兼容性
- 添加更严格的类型检查

### 3. Vite 构建配置优化

**更新文件**：`vite.config.ts`

**主要改进**：
- 添加 vue-i18n 手动分块
- 优化构建输出
- 添加依赖预构建配置
- 启用代码压缩和优化

### 4. Cloudflare Pages 专用构建脚本

**新增文件**：`scripts/build-for-cloudflare.js`

**功能**：
- 自动清理旧构建文件
- 创建 `_redirects` 文件支持 SPA 路由
- 创建 `_headers` 文件优化缓存策略
- 构建结果验证

### 5. Cloudflare 配置文件

**新增文件**：`wrangler.toml`

**配置内容**：
- 构建命令和发布目录
- 重定向规则
- 缓存头部设置
- 环境变量配置

## 使用方法

### 本地开发
```bash
npm run dev
```

### 构建用于 Cloudflare Pages
```bash
npm run build:cloudflare
```

### 普通构建
```bash
npm run build
```

## 部署到 Cloudflare Pages

### 方法一：使用 Wrangler CLI
```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
wrangler pages deploy dist
```

### 方法二：通过 Cloudflare Dashboard

1. 登录 Cloudflare Dashboard
2. 进入 Pages 页面
3. 连接 Git 仓库
4. 设置构建配置：
   - **构建命令**：`npm run build:cloudflare`
   - **构建输出目录**：`dist`
   - **Node.js 版本**：`18`

## 关键修复点

### 1. 语言文件加载
- 使用静态 JSON 导入替代动态 TypeScript 导入
- 避免运行时语言文件解析错误

### 2. 环境兼容性
- 添加 `typeof window` 检查避免 SSR 错误
- 使用 try-catch 包装 localStorage 操作

### 3. 构建优化
- 手动分块 vue-i18n 避免循环依赖
- 优化资源加载和缓存策略

### 4. 路由支持
- 配置 `_redirects` 文件支持 Vue Router 的 history 模式
- 确保所有路由都能正确加载

## 验证修复

构建完成后，检查以下内容：

1. **构建成功**：无错误和警告
2. **文件完整**：`dist/` 目录包含所有必要文件
3. **语言切换**：在生产环境中测试语言切换功能
4. **路由正常**：所有页面路由都能正确访问

## 注意事项

1. **JSON 格式**：语言文件必须是有效的 JSON 格式
2. **字符编码**：确保文件使用 UTF-8 编码
3. **缓存策略**：静态资源使用长期缓存，HTML 文件不缓存
4. **环境变量**：如需要，在 Cloudflare Pages 设置中配置环境变量

## 故障排除

### 如果仍然出现错误：

1. **清理缓存**：删除 `node_modules` 和 `dist` 目录，重新安装依赖
2. **检查语法**：确保 JSON 文件语法正确
3. **版本兼容**：检查 vue-i18n 版本是否与 Vue 3 兼容
4. **网络问题**：检查 Cloudflare Pages 的构建日志

### 常见错误及解决方案：

- **Invalid linked format**：语言文件格式问题，使用 JSON 格式
- **Module not found**：导入路径错误，检查文件路径
- **localStorage is not defined**：SSR 环境问题，添加环境检查

## 更新日志

- **2024-01-01**：初始修复方案
- 转换语言文件为 JSON 格式
- 优化 i18n 配置和构建设置
- 添加 Cloudflare Pages 专用构建脚本