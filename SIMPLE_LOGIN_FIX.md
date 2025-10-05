# 简单直接的登录修复

## 问题
登录API成功但页面卡在"登录中"状态

## 解决方案
完全重写登录页面，去掉所有复杂逻辑，直接使用最基本的方式：

### 修复内容
1. **移除复杂的认证系统**：不再使用复杂的useAuth composable
2. **直接调用Supabase API**：SDK模式和HTTP模式都直接调用
3. **简化状态管理**：只用一个isLoading状态
4. **直接设置用户信息**：登录成功后直接设置userStore

### 核心代码
```typescript
// SDK模式
const { data, error } = await supabase.auth.signInWithPassword({
  email: form.value.email,
  password: form.value.password
})

// 直接设置用户信息和token
userStore.user = { /* 用户信息 */ }
userStore.token = data.session.access_token
localStorage.setItem('token', data.session.access_token)

// 直接跳转
router.push(redirect || '/')
```

### 测试步骤
1. 访问 `/login` 页面
2. 选择认证模式（SDK推荐）
3. 输入账号密码
4. 点击登录
5. 应该立即跳转到首页

### 预期结果
- ✅ 点击登录按钮立即显示"登录中..."
- ✅ API成功后立即跳转
- ✅ 不会卡在加载状态
- ✅ 用户信息正确设置

这个版本去掉了所有复杂的逻辑，应该能正常工作。