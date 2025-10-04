// Supabase 认证错误处理工具

export interface AuthError {
  code: string
  message: string
  userMessage: string
}

export const getAuthErrorMessage = (error: any): string => {
  if (!error) return '未知错误'

  const errorMessage = error.message || error.error_description || ''
  
  // 常见错误映射
  const errorMap: Record<string, string> = {
    'Invalid login credentials': '邮箱或密码错误',
    'Email not confirmed': '请先验证您的邮箱',
    'User already registered': '该邮箱已被注册',
    'Password should be at least 6 characters': '密码至少需要6个字符',
    'Invalid email': '邮箱格式不正确',
    'Too many requests': '请求过于频繁，请稍后再试',
    'Signup is disabled': '注册功能已关闭',
    'Email rate limit exceeded': '邮件发送频率超限，请稍后再试',
    'Invalid refresh token': '登录已过期，请重新登录',
    'Network request failed': '网络连接失败，请检查网络连接',
    'Failed to fetch': '无法连接到服务器，请检查网络连接',
    'fetch': '网络连接问题，请检查网络设置',
    'CORS': '跨域请求被阻止，请检查服务器配置',
    'timeout': '请求超时，请重试'
  }

  // 检查是否有匹配的错误消息
  for (const [key, value] of Object.entries(errorMap)) {
    if (errorMessage.includes(key)) {
      return value
    }
  }

  // 如果没有匹配的，返回原始错误消息或默认消息
  return errorMessage || '操作失败，请重试'
}

export const isNetworkError = (error: any): boolean => {
  const message = error?.message || ''
  return message.includes('Network') || 
         message.includes('fetch') || 
         message.includes('connection')
}

export const isAuthError = (error: any): boolean => {
  return error?.message?.includes('auth') || 
         error?.code?.startsWith('auth')
}