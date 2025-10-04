// 环境配置工具

/**
 * 获取当前应用的基础URL
 */
export const getBaseUrl = (): string => {
  // 在浏览器环境中，使用当前页面的origin
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // 在服务端或测试环境中，使用环境变量或默认值
  const protocol = import.meta.env.VITE_APP_PROTOCOL || 'http'
  const host = import.meta.env.VITE_APP_HOST || 'localhost'
  const port = import.meta.env.VITE_APP_PORT || '3000'
  
  return `${protocol}://${host}:${port}`
}

/**
 * 获取密码重置的重定向URL
 */
export const getPasswordResetUrl = (): string => {
  return `${getBaseUrl()}/reset-password`
}

/**
 * 获取邮箱验证的重定向URL
 */
export const getEmailVerificationUrl = (): string => {
  return `${getBaseUrl()}/email-verification`
}

/**
 * 检查是否为开发环境
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV
}

/**
 * 检查是否为生产环境
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD
}

/**
 * 获取应用配置信息
 */
export const getAppConfig = () => {
  return {
    baseUrl: getBaseUrl(),
    isDev: isDevelopment(),
    isProd: isProduction(),
    passwordResetUrl: getPasswordResetUrl(),
    emailVerificationUrl: getEmailVerificationUrl()
  }
}

/**
 * 打印当前环境配置（仅在开发环境）
 */
export const logEnvironmentInfo = () => {
  if (isDevelopment()) {
    const config = getAppConfig()
    console.log('🌍 环境配置信息:', config)
  }
}