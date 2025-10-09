# Supabase OAuth 第三方登录配置指南

## 🔧 配置步骤

### 1. 在 Supabase 控制台配置 OAuth 提供商

#### Google OAuth 配置

1. **访问 Google Cloud Console**
   - 前往 [Google Cloud Console](https://console.cloud.google.com/)
   - 创建新项目或选择现有项目

2. **启用 Google+ API**
   - 在 API 库中搜索 "Google+ API"
   - 启用该 API

3. **创建 OAuth 2.0 凭据**
   - 转到 "凭据" 页面
   - 点击 "创建凭据" > "OAuth 2.0 客户端 ID"
   - 选择 "Web 应用程序"
   - 添加授权重定向 URI：
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     ```

4. **在 Supabase 中配置**
   - 登录 Supabase 控制台
   - 转到 Authentication > Providers
   - 启用 Google 提供商
   - 输入 Google Client ID 和 Client Secret

#### GitHub OAuth 配置

1. **访问 GitHub 设置**
   - 前往 [GitHub Developer Settings](https://github.com/settings/developers)
   - 点击 "New OAuth App"

2. **创建 OAuth 应用**
   - Application name: `Your App Name`
   - Homepage URL: `https://your-domain.com`
   - Authorization callback URL:
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     ```

3. **在 Supabase 中配置**
   - 登录 Supabase 控制台
   - 转到 Authentication > Providers
   - 启用 GitHub 提供商
   - 输入 GitHub Client ID 和 Client Secret

### 2. 配置重定向 URL

在 Supabase 控制台的 Authentication > URL Configuration 中添加：

```
Site URL: https://your-domain.com
Redirect URLs:
- https://your-domain.com/auth/callback
- http://localhost:5173/auth/callback (开发环境)
```

### 3. 环境变量配置

确保你的 `.env` 文件包含正确的 Supabase 配置：

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🔐 安全注意事项

1. **重定向 URL 验证**
   - 确保只添加可信的重定向 URL
   - 生产环境不要包含 localhost

2. **密钥管理**
   - 不要在客户端代码中暴露 Client Secret
   - 使用环境变量管理敏感信息

3. **作用域权限**
   - 只请求必要的用户信息权限
   - 定期审查和更新权限范围

## 🧪 测试流程

1. **本地开发测试**
   ```bash
   npm run dev
   # 访问 http://localhost:5173/login
   # 点击 Google 或 GitHub 登录按钮
   ```

2. **验证回调处理**
   - 登录成功后应跳转到 `/auth/callback`
   - 然后自动跳转到首页或指定页面

3. **检查用户信息**
   - 验证用户头像、姓名等信息是否正确获取
   - 检查用户会话是否正常保持

## 🐛 常见问题

### 问题 1: "Invalid redirect URI"
**解决方案**: 检查 OAuth 应用配置中的重定向 URI 是否与 Supabase 回调 URL 完全匹配

### 问题 2: "Access denied"
**解决方案**: 确保 OAuth 应用已正确配置并且用户有权限访问

### 问题 3: 回调页面显示错误
**解决方案**: 检查 Supabase 项目配置和网络连接

## 📱 移动端支持

如果需要支持移动端，需要额外配置：

1. **深度链接**
   - 配置自定义 URL scheme
   - 添加移动端重定向 URL

2. **应用内浏览器**
   - 处理应用内浏览器的回调
   - 确保正确的会话管理

## 🚀 生产部署

1. **更新重定向 URL**
   - 将生产域名添加到 OAuth 应用配置
   - 更新 Supabase 重定向 URL 设置

2. **SSL 证书**
   - 确保生产环境使用 HTTPS
   - 验证 SSL 证书有效性

3. **监控和日志**
   - 设置 OAuth 登录监控
   - 记录登录失败和异常情况

## 📊 用户体验优化

1. **加载状态**
   - 显示登录进度指示器
   - 提供清晰的错误消息

2. **回退方案**
   - 提供邮箱密码登录选项
   - 处理 OAuth 服务不可用的情况

3. **用户引导**
   - 解释第三方登录的好处
   - 提供隐私政策链接