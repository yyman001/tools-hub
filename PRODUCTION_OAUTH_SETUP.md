# 🚀 生产环境 OAuth 配置指南

## ❌ 你遇到的问题

线上部署后，OAuth 回调跳转到了：
```
http://localhost:3000/#access_token=...
```

这说明 Supabase 控制台中的重定向 URL 配置不正确。

## 🎯 问题原因

1. **Supabase 控制台配置问题** - Site URL 和 Redirect URLs 仍然指向 localhost
2. **OAuth 应用配置问题** - GitHub/Google OAuth 应用的回调 URL 可能不正确
3. **环境变量问题** - 生产环境可能使用了错误的 Supabase 配置

## ✅ 解决方案

### 1. 更新 Supabase 控制台配置

登录 [Supabase 控制台](https://supabase.com/dashboard)，进入你的项目：

#### Authentication > URL Configuration

```
Site URL: https://your-production-domain.com
Redirect URLs:
- https://your-production-domain.com/auth/callback
- http://localhost:5173/auth/callback (保留用于开发)
- http://localhost:3000/auth/callback (如果需要)
```

**重要**: 确保生产域名的 URL 在列表的最前面！

### 2. 检查 OAuth 应用配置

#### GitHub OAuth 应用
在 [GitHub Developer Settings](https://github.com/settings/developers) 中：

```
Homepage URL: https://your-production-domain.com
Authorization callback URL: https://your-project-ref.supabase.co/auth/v1/callback
```

#### Google OAuth 应用
在 [Google Cloud Console](https://console.cloud.google.com/) 中：

```
Authorized JavaScript origins:
- https://your-production-domain.com
- http://localhost:5173 (开发环境)

Authorized redirect URIs:
- https://your-project-ref.supabase.co/auth/v1/callback
```

### 3. 环境变量检查

确保生产环境的环境变量正确：

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### 4. 部署平台配置

#### Vercel
在 Vercel 项目设置中添加环境变量：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

#### Netlify
在 Netlify 项目设置 > Environment variables 中添加相同的环境变量。

#### 其他平台
确保在部署平台的环境变量配置中设置了正确的 Supabase 配置。

## 🔧 代码优化

让我为你创建一个更智能的重定向 URL 处理：