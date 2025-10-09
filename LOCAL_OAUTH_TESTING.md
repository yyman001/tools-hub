# 🧪 本地环境 OAuth 测试指南

## 🔧 问题解决

### 1. GitHub 邮箱验证问题

你遇到的错误：
```
error=access_denied&error_code=provider_email_needs_verification&error_description=Unverified+email+with+github
```

**原因**: GitHub 账户的主邮箱地址未验证

**解决方案**:
1. 前往 [GitHub 邮箱设置](https://github.com/settings/emails)
2. 找到你的主邮箱地址
3. 如果显示 "Unverified"，点击 "Resend verification email"
4. 检查邮箱并点击验证链接
5. 验证完成后重新尝试登录

### 2. 本地开发环境配置

#### Supabase 重定向 URL 配置

在 Supabase 控制台的 Authentication > URL Configuration 中添加：

```
Site URL: http://localhost:5173
Redirect URLs:
- http://localhost:5173/auth/callback
- http://localhost:3000/auth/callback  (如果你使用 3000 端口)
- https://your-production-domain.com/auth/callback
```

#### GitHub OAuth 应用配置

在 [GitHub Developer Settings](https://github.com/settings/developers) 中：

```
Application name: Your App Name (Dev)
Homepage URL: http://localhost:5173
Authorization callback URL: https://your-project-ref.supabase.co/auth/v1/callback
```

**注意**: GitHub OAuth 的回调 URL 必须是 Supabase 的回调地址，不是你的应用地址。

#### Google OAuth 应用配置

在 [Google Cloud Console](https://console.cloud.google.com/) 中：

```
Authorized JavaScript origins:
- http://localhost:5173
- https://your-production-domain.com

Authorized redirect URIs:
- https://your-project-ref.supabase.co/auth/v1/callback
```

## 🚀 测试流程

### 本地测试步骤

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **访问登录页面**
   ```
   http://localhost:5173/login
   ```

3. **点击第三方登录按钮**
   - 会跳转到对应的 OAuth 提供商
   - 完成授权后跳转回 Supabase
   - Supabase 处理后跳转到你的回调页面

4. **验证回调处理**
   - 检查 `/auth/callback` 页面是否正常显示
   - 验证用户信息是否正确获取
   - 确认登录状态是否正常

### 调试技巧

#### 1. 检查浏览器控制台
```javascript
// 在回调页面打开控制台，查看详细日志
console.log('当前URL:', window.location.href)
console.log('URL参数:', new URLSearchParams(window.location.search))
console.log('Hash参数:', new URLSearchParams(window.location.hash.substring(1)))
```

#### 2. 检查 Supabase 会话
```javascript
// 在控制台执行
import { supabase } from '@/lib/supabase'
const { data, error } = await supabase.auth.getSession()
console.log('会话数据:', data)
console.log('会话错误:', error)
```

#### 3. 检查用户信息
```javascript
// 检查获取的用户信息
const { data: { user } } = await supabase.auth.getUser()
console.log('用户信息:', user)
console.log('用户元数据:', user?.user_metadata)
```

## 🐛 常见问题及解决方案

### 问题 1: "Invalid redirect URI"
**原因**: OAuth 应用配置的重定向 URI 与实际请求不匹配
**解决**: 确保 OAuth 应用配置中的回调 URL 是 Supabase 的回调地址

### 问题 2: "Access denied"
**原因**: 用户拒绝授权或邮箱未验证
**解决**: 
- 检查 GitHub/Google 账户邮箱是否已验证
- 确认用户在授权页面点击了"允许"

### 问题 3: 回调页面显示错误
**原因**: Supabase 配置问题或网络问题
**解决**: 
- 检查 Supabase 项目配置
- 验证环境变量是否正确
- 检查网络连接

### 问题 4: 用户信息获取不完整
**原因**: OAuth 权限范围不足
**解决**: 
- GitHub: 确保请求了 `user:email` 权限
- Google: 确保请求了 `email` 和 `profile` 权限

## 🔒 安全注意事项

### 开发环境
- 使用不同的 OAuth 应用（开发版和生产版）
- 不要在开发环境使用生产环境的密钥
- 定期轮换 OAuth 应用密钥

### 生产环境
- 确保所有重定向 URL 使用 HTTPS
- 限制 OAuth 应用的权限范围
- 监控异常登录行为

## 📱 移动端测试

如果需要在移动设备上测试：

1. **使用 ngrok 或类似工具**
   ```bash
   npx ngrok http 5173
   ```

2. **更新 OAuth 配置**
   - 将 ngrok 提供的 HTTPS URL 添加到重定向 URL 列表
   - 更新 Supabase 的 Site URL 配置

3. **测试移动端体验**
   - 验证按钮大小是否适合触摸
   - 检查弹窗和重定向是否正常工作

## 🎯 最佳实践

1. **错误处理**
   - 为每种可能的错误提供清晰的用户提示
   - 提供重试机制和替代登录方式

2. **用户体验**
   - 显示加载状态和进度指示
   - 提供取消登录的选项

3. **性能优化**
   - 缓存用户信息以减少 API 调用
   - 使用适当的会话过期时间

4. **监控和日志**
   - 记录 OAuth 登录成功和失败的情况
   - 监控异常的重定向和错误模式