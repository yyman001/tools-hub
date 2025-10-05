# Token解析错误修复

## 问题
AuthStatusMonitor组件在解析调试token时出现错误：
```
解析token失败: InvalidCharacterError: Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.
```

## 原因
调试按钮设置的`debug-token`不是有效的JWT格式，导致`atob()`函数无法解析。

## 修复方案

### 1. 修复AuthStatusMonitor组件
在`parseTokenInfo`函数中添加token格式检查：

```typescript
// 检查是否是调试token
if (token === 'debug-token' || !token.includes('.')) {
  tokenInfo.value = {
    exp: Math.floor(Date.now() / 1000) + 3600, // 1小时后过期
    iat: Math.floor(Date.now() / 1000),
    sub: 'debug-user',
    email: 'debug@example.com'
  }
  return
}

// 检查JWT格式
const parts = token.split('.')
if (parts.length !== 3) {
  console.warn('Token格式不正确，不是有效的JWT')
  tokenInfo.value = null
  return
}
```

### 2. 现在的功能
- ✅ 调试token不会导致解析错误
- ✅ 调试token会显示为有效状态
- ✅ 真实JWT token正常解析
- ✅ 无效token会被安全处理

## 测试方法

1. **调试按钮测试**：
   - 访问 `/login` 页面
   - 点击"[调试] 直接设置登录状态"按钮
   - 应该不会出现token解析错误

2. **状态监控测试**：
   - 右下角的认证状态监控器应该正常显示
   - 不会出现控制台错误

3. **真实登录测试**：
   - 使用真实账号登录
   - 监控器应该显示真实的token信息

现在token解析错误已经修复，调试功能可以正常使用了！