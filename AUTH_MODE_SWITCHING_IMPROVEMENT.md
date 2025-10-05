# 认证模式切换和会话管理改进

## 概述

本次更新解决了登录会话容易失效的问题，并添加了认证模式切换功能，让用户可以在HTTP模式和SDK模式之间自由选择。

## 主要改进

### 1. 认证模式切换功能

- **登录页面增加模式选择器**：用户可以在登录时选择使用SDK模式或HTTP模式
- **动态模式切换**：支持运行时切换认证模式，无需重启应用
- **用户偏好保存**：系统会记住用户选择的认证模式

### 2. 会话管理优化

#### SDK模式（推荐）
- ✅ 自动管理会话状态
- ✅ 自动刷新token
- ✅ 更稳定的登录状态
- ✅ 不易失效

#### HTTP模式
- ⚠️ 手动管理会话
- 🔄 自动检测token过期
- 🔄 定时刷新机制（每30分钟检查一次）
- 🔄 支持手动刷新token

### 3. 认证状态监控

- **实时状态显示**：显示当前认证模式、登录状态、token状态
- **过期时间提醒**：显示token剩余有效时间
- **手动刷新按钮**：HTTP模式下可手动刷新token
- **开发模式自动显示**：开发环境下自动显示监控器

### 4. 测试页面

新增 `/auth-test` 页面，提供：
- 认证状态查看
- 模式切换测试
- token信息查看
- 各种认证操作测试

## 使用方法

### 1. 登录时选择模式

访问登录页面，可以看到认证模式选择器：
- **SDK模式**：推荐选择，自动管理会话，更稳定
- **HTTP模式**：手动管理会话，可能会失效

### 2. 查看认证状态

- **开发模式**：右下角自动显示认证状态监控器
- **生产模式**：访问 `/auth-test` 页面查看详细状态

### 3. 切换认证模式

1. 访问 `/auth-test` 页面
2. 选择新的认证模式
3. 点击"切换模式"按钮
4. 重新登录以使新模式生效

### 4. 手动刷新token（HTTP模式）

- 在认证监控器中点击"手动刷新Token"按钮
- 或在测试页面中点击"手动刷新Token"按钮

## 技术实现

### 1. 动态认证模式

```typescript
const getAuthMode = () => {
  // 优先使用临时设置的模式（用于登录页面切换）
  if ((window as any).__TEMP_AUTH_MODE__) {
    return (window as any).__TEMP_AUTH_MODE__
  }
  
  // 其次使用用户偏好设置
  const preferredMode = localStorage.getItem('preferred_auth_mode')
  if (preferredMode && ['http', 'sdk'].includes(preferredMode)) {
    return preferredMode
  }
  
  // 最后使用环境变量默认值
  return import.meta.env.VITE_AUTH_MODE || 'sdk'
}
```

### 2. 自动刷新机制

```typescript
const setupAutoRefresh = () => {
  const currentAuthMode = getAuthMode()
  if (currentAuthMode === 'http') {
    // HTTP模式下，每30分钟检查一次token是否需要刷新
    refreshTimer = setInterval(async () => {
      const token = localStorage.getItem('token')
      if (token && isTokenExpired(token)) {
        console.log('🔄 定时检查发现token过期，自动刷新...')
        await refreshToken()
      }
    }, 30 * 60 * 1000) // 30分钟
  }
}
```

### 3. Token过期检测

```typescript
const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp && payload.exp < currentTime
  } catch (error) {
    return true // 如果无法解析，认为已过期
  }
}
```

## 配置说明

### 环境变量

```env
# 默认认证模式改为SDK模式（更稳定）
VITE_AUTH_MODE=sdk
```

### 用户偏好

- `preferred_auth_mode`: 用户选择的认证模式
- `show_auth_monitor`: 是否显示认证监控器

## 问题解决

### 1. 会话失效问题

**原因**：HTTP模式下token过期后没有自动刷新机制

**解决方案**：
- 推荐使用SDK模式（自动管理）
- HTTP模式下添加自动检测和刷新机制
- 提供手动刷新功能

### 2. 用户体验问题

**原因**：用户不知道当前认证状态和剩余时间

**解决方案**：
- 添加认证状态监控器
- 显示token过期时间
- 提供实时状态更新

## 建议

1. **推荐使用SDK模式**：更稳定，自动管理会话
2. **开发时启用监控器**：便于调试认证问题
3. **定期检查认证状态**：特别是长时间使用的情况
4. **遇到问题时切换模式**：如果一种模式有问题，可以尝试另一种

## 测试步骤

1. 访问 `/login` 页面，测试模式选择功能
2. 使用不同模式登录，观察会话稳定性
3. 访问 `/auth-test` 页面，测试各种功能
4. 长时间使用，观察token自动刷新情况
5. 手动刷新token，验证功能正常

## 注意事项

- 切换认证模式后需要重新登录
- HTTP模式下需要确保有refresh_token
- 开发模式下会自动显示监控器
- 生产环境建议使用SDK模式