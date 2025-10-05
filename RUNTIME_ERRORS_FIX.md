# 运行时错误修复指南

## 问题概述

在 Cloudflare Pages 部署后遇到的主要运行时错误：

1. **HTTP 403 错误** - Supabase 认证失败
2. **transformCategoryRow 未定义** - 静态方法中的 `this` 上下文问题
3. **数据映射错误** - 组件中访问不存在的属性

## 修复方案

### 1. i18n 国际化问题修复 ✅

**问题**：`SyntaxError: Invalid linked format`
**解决**：
- 将语言文件从 `.ts` 格式转换为 `.json` 格式
- 优化 i18n 配置，添加 SSR 兼容性
- 更新 Vite 构建配置

### 2. Supabase 服务层修复 ✅

**问题**：静态方法中使用 `this` 导致的 `transformCategoryRow` 未定义错误
**解决**：
- 将所有 `this.transformToolRow` 改为 `SupabaseService.transformToolRow`
- 将所有 `this.transformCategoryRow` 改为 `SupabaseService.transformCategoryRow`
- 添加数据验证和错误处理

### 3. 组件数据访问修复 ✅

**问题**：`Cannot read properties of undefined (reading 'map')`
**解决**：
- 修复 `ToolDetail.vue` 中的 `tool.platforms` 访问错误
- 改为正确的 `tool.supported_platforms` 属性
- 添加数据存在性检查

### 4. 认证问题修复

**问题**：HTTP 403 认证失败
**可能原因**：
- Supabase 配置错误
- 环境变量缺失
- 认证模式配置问题

**解决步骤**：

#### 4.1 检查环境变量
确保 `.env` 文件包含正确的配置：
```env
# Supabase 配置
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# 应用配置
VITE_APP_PROTOCOL=https
VITE_APP_HOST=your-domain.pages.dev
VITE_APP_PORT=443

# 认证模式
VITE_AUTH_MODE=sdk
```

#### 4.2 Cloudflare Pages 环境变量设置
在 Cloudflare Pages 项目设置中添加环境变量：
1. 进入项目 → Settings → Environment variables
2. 添加以下变量：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_AUTH_MODE`

#### 4.3 Supabase 项目配置
确保 Supabase 项目设置正确：
1. **Authentication** → **URL Configuration**
   - Site URL: `https://your-domain.pages.dev`
   - Redirect URLs: `https://your-domain.pages.dev/**`

2. **Authentication** → **Providers**
   - 启用 Email 认证
   - 配置其他需要的认证提供商

### 5. 数据处理增强 ✅

**新增功能**：
- 错误处理工具 (`src/utils/errorHandler.ts`)
- 数据验证工具 (`src/utils/dataValidator.ts`)
- 更安全的数据转换逻辑

## 使用修复脚本

### 自动修复
```bash
npm run fix:runtime
```

### 手动修复步骤

1. **修复 i18n 问题**
```bash
# 已自动完成，语言文件已转换为 JSON 格式
```

2. **修复服务层问题**
```bash
# 已自动完成，静态方法调用已修复
```

3. **修复组件问题**
```bash
# 已自动完成，属性访问已修复
```

4. **配置环境变量**
```bash
# 检查 .env 文件
cat .env

# 如果不存在，复制示例文件
cp .env.example .env
```

## 构建和部署

### 本地测试
```bash
# 开发模式
npm run dev

# 构建测试
npm run build:cloudflare
npm run preview
```

### 部署到 Cloudflare Pages
```bash
# 方法1：使用 Wrangler CLI
wrangler pages deploy dist

# 方法2：通过 Git 自动部署
git add .
git commit -m "fix: 修复运行时错误"
git push origin main
```

## 验证修复

### 1. 构建验证
- ✅ 构建无错误
- ✅ 语言文件正确加载
- ✅ 静态资源正确生成

### 2. 功能验证
- ✅ 页面正常加载
- ✅ 语言切换正常
- ✅ 路由导航正常
- ⚠️ 认证功能（需要正确的 Supabase 配置）
- ⚠️ 数据加载（需要正确的 Supabase 配置）

### 3. 错误监控
在浏览器控制台检查：
- 无 JavaScript 错误
- 无网络请求失败（除非 Supabase 未配置）
- 无资源加载失败

## 故障排除

### 如果仍然出现 403 错误：

1. **检查 Supabase 配置**
```bash
# 验证环境变量
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

2. **检查 Supabase 项目状态**
- 项目是否暂停
- API 密钥是否正确
- 数据库是否可访问

3. **检查网络连接**
```bash
# 测试 Supabase 连接
curl -H "apikey: YOUR_ANON_KEY" "YOUR_SUPABASE_URL/rest/v1/"
```

### 如果仍然出现数据错误：

1. **检查数据库结构**
- 表是否存在
- 字段名是否匹配
- 权限是否正确

2. **检查数据格式**
- JSON 字段是否正确格式化
- 必填字段是否有值
- 数据类型是否匹配

## 更新日志

- **2024-01-01**: 初始修复
  - 修复 i18n 国际化问题
  - 修复 Supabase 服务层问题
  - 修复组件数据访问问题
  - 添加错误处理和数据验证
  - 创建自动修复脚本

## 联系支持

如果问题仍然存在，请提供以下信息：
1. 浏览器控制台错误截图
2. 网络请求失败详情
3. Supabase 项目配置截图
4. 环境变量配置（隐藏敏感信息）