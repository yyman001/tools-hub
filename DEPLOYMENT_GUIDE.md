# Cloudflare Pages 部署指南

## 🎉 修复完成

所有主要问题已修复：
- ✅ vue-i18n 国际化问题
- ✅ Supabase 服务层错误
- ✅ 组件数据访问问题
- ✅ 构建配置优化

## 📦 部署准备

### 1. 环境变量配置

在 Cloudflare Pages 项目设置中添加以下环境变量：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_AUTH_MODE=sdk
VITE_APP_PROTOCOL=https
VITE_APP_HOST=your-domain.pages.dev
VITE_APP_PORT=443
```

### 2. Supabase 项目配置

确保 Supabase 项目正确配置：

#### Authentication Settings
- **Site URL**: `https://your-domain.pages.dev`
- **Redirect URLs**: `https://your-domain.pages.dev/**`

#### Database Tables
确保以下表存在并有正确的权限：
- `categories`
- `tools`
- `tags`
- `tool_tags`
- `download_links`

## 🚀 部署方法

### 方法一：Git 自动部署（推荐）

1. **连接 Git 仓库**
   - 登录 Cloudflare Dashboard
   - 进入 Pages → Create a project
   - 连接你的 Git 仓库

2. **配置构建设置**
   ```
   Build command: npm run build:cloudflare
   Build output directory: dist
   Root directory: /
   Node.js version: 18
   ```

3. **设置环境变量**
   - 在项目设置中添加上述环境变量

4. **部署**
   ```bash
   git add .
   git commit -m "feat: 完成 Cloudflare Pages 优化"
   git push origin main
   ```

### 方法二：Wrangler CLI 部署

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **构建项目**
   ```bash
   npm run build:cloudflare
   ```

4. **部署**
   ```bash
   wrangler pages deploy dist --project-name=tool-hub
   ```

### 方法三：手动上传

1. **构建项目**
   ```bash
   npm run build:cloudflare
   ```

2. **打包 dist 目录**
   ```bash
   # Windows
   Compress-Archive -Path dist/* -DestinationPath dist.zip
   
   # macOS/Linux
   cd dist && zip -r ../dist.zip . && cd ..
   ```

3. **上传到 Cloudflare Pages**
   - 登录 Cloudflare Dashboard
   - 进入 Pages → Create a project
   - 选择 "Upload assets"
   - 上传 dist.zip

## 🔧 构建脚本说明

### `npm run build:cloudflare`

这个脚本会：
1. 清理旧的构建文件
2. 运行 Vite 构建
3. 创建 `_redirects` 文件（支持 SPA 路由）
4. 创建 `_headers` 文件（优化缓存策略）
5. 验证构建结果

### 生成的文件

- **`_redirects`**: 确保所有路由都指向 `index.html`
- **`_headers`**: 设置静态资源缓存策略
- **`assets/`**: 优化后的 JS、CSS 和其他静态资源

## 🔍 部署后验证

### 1. 基本功能检查
- [ ] 页面正常加载
- [ ] 语言切换功能正常
- [ ] 路由导航正常
- [ ] 暗模式切换正常

### 2. 数据功能检查（需要 Supabase 配置）
- [ ] 工具列表加载
- [ ] 分类列表加载
- [ ] 搜索功能
- [ ] 用户认证（如果配置了 Supabase）

### 3. 性能检查
- [ ] 首屏加载时间 < 3秒
- [ ] 静态资源正确缓存
- [ ] 无 JavaScript 错误

## 🐛 故障排除

### 常见问题

#### 1. 页面显示 404
**原因**: `_redirects` 文件未生效
**解决**: 确保使用 `npm run build:cloudflare` 构建

#### 2. 语言切换不工作
**原因**: i18n 配置问题
**解决**: 检查浏览器控制台错误，确保语言文件正确加载

#### 3. 数据加载失败
**原因**: Supabase 配置错误
**解决**: 
- 检查环境变量是否正确设置
- 验证 Supabase 项目状态
- 检查数据库表权限

#### 4. 认证失败 (HTTP 403)
**原因**: Supabase 认证配置问题
**解决**:
- 检查 Site URL 和 Redirect URLs 配置
- 验证 API 密钥是否正确
- 确保认证模式设置正确

### 调试步骤

1. **检查构建日志**
   ```bash
   npm run build:cloudflare
   ```

2. **检查浏览器控制台**
   - 打开开发者工具
   - 查看 Console 和 Network 标签页
   - 记录错误信息

3. **验证环境变量**
   ```javascript
   // 在浏览器控制台运行
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
   console.log('Auth Mode:', import.meta.env.VITE_AUTH_MODE)
   ```

## 📈 性能优化

### 已实现的优化

1. **代码分割**: vue-i18n 单独打包
2. **资源压缩**: 使用 esbuild 压缩
3. **缓存策略**: 静态资源长期缓存
4. **懒加载**: 路由组件按需加载

### 进一步优化建议

1. **图片优化**: 使用 WebP 格式
2. **CDN 加速**: 利用 Cloudflare 的全球 CDN
3. **预加载**: 关键资源预加载
4. **Service Worker**: 离线支持

## 🔄 持续集成

### GitHub Actions 示例

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build:cloudflare
    
    - name: Deploy to Cloudflare Pages
      uses: cloudflare/pages-action@v1
      with:
        apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        projectName: tool-hub
        directory: dist
```

## 📞 支持

如果遇到问题，请检查：
1. [CLOUDFLARE_I18N_FIX.md](./CLOUDFLARE_I18N_FIX.md) - i18n 问题修复
2. [RUNTIME_ERRORS_FIX.md](./RUNTIME_ERRORS_FIX.md) - 运行时错误修复
3. Cloudflare Pages 文档
4. Supabase 文档

---

🎉 **恭喜！你的项目现在已经准备好部署到 Cloudflare Pages 了！**