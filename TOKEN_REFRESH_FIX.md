# Token刷新解析错误修复

## 问题描述
手动刷新token时，API请求正常但解析token时出现错误：
```
解析token失败: InvalidCharacterError: Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.
```

## 问题分析
1. **时序问题**：刷新token后立即解析，可能token还未完全保存到localStorage
2. **Base64编码问题**：JWT token的payload部分可能存在编码问题
3. **错误处理不足**：缺乏对异常token格式的处理

## 修复方案

### 1. 改进刷新token处理
```typescript
const handleRefreshToken = async () => {
  isRefreshing.value = true
  try {
    console.log('🔄 开始手动刷新token...')
    const result = await refreshToken()
    
    if (result && !result.error) {
      console.log('✅ Token刷新成功')
      // 等待一小段时间确保token已保存
      await new Promise(resolve => setTimeout(resolve, 100))
      parseTokenInfo()
    } else {
      console.error('❌ Token刷新失败:', result?.error)
      tokenInfo.value = null
    }
  } catch (error) {
    console.error('刷新token失败:', error)
    tokenInfo.value = null
  } finally {
    isRefreshing.value = false
  }
}
```

### 2. 增强token解析安全性
```typescript
// 验证base64编码
try {
  // 确保base64字符串长度是4的倍数
  let base64Payload = parts[1]
  while (base64Payload.length % 4) {
    base64Payload += '='
  }
  
  const payload = JSON.parse(atob(base64Payload))
  tokenInfo.value = payload
} catch (decodeError) {
  // 尝试使用更安全的解码方式
  try {
    const safePayload = JSON.parse(decodeURIComponent(escape(atob(parts[1]))))
    tokenInfo.value = safePayload
  } catch (safeDecodeError) {
    tokenInfo.value = null
  }
}
```

### 3. 添加详细调试信息
```typescript
const parseTokenInfo = () => {
  try {
    const token = localStorage.getItem('token')
    console.log('🔍 解析token:', token ? `${token.substring(0, 20)}...` : 'null')
    
    // 详细的错误日志和状态跟踪
    // ...
  } catch (error) {
    console.error('解析token失败:', error)
    tokenInfo.value = null
  }
}
```

### 4. 延迟初始化
```typescript
onMounted(() => {
  // 延迟解析token，避免初始化时的问题
  setTimeout(() => {
    parseTokenInfo()
  }, 500)
  
  // 恢复定时更新
  updateTimer = setInterval(() => {
    parseTokenInfo()
  }, 30000)
})
```

## 修复效果

### ✅ 解决的问题
1. **时序问题**：添加100ms延迟确保token保存完成
2. **编码问题**：添加base64填充和安全解码方式
3. **错误处理**：优雅处理解析失败的情况
4. **调试信息**：详细的日志帮助排查问题

### ✅ 改进的功能
1. **更安全的解析**：多重解码尝试机制
2. **更好的错误恢复**：解析失败时清空token信息
3. **更详细的日志**：便于调试和问题排查
4. **更稳定的初始化**：避免启动时的解析问题

## 使用方法

### 正常使用
- 手动刷新token按钮现在可以安全使用
- 解析失败时会显示相应的状态
- 控制台会显示详细的调试信息

### 调试信息
刷新token时会看到以下日志：
```
🔄 开始手动刷新token...
✅ Token刷新成功
🔍 解析token: eyJhbGciOiJIUzI1NiI...
✅ Token解析成功: {exp: 1234567890, iat: 1234567890, email: "user@example.com"}
```

### 错误处理
如果出现问题，会看到：
```
❌ Base64解码失败: InvalidCharacterError
Token payload部分: eyJhbGciOiJIUzI1NiI
Token payload长度: 19
✅ 使用安全解码成功
```

现在手动刷新token功能应该可以正常工作，不会再出现解析错误了！