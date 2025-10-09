// 环境检测和配置工具

/**
 * 检测当前运行环境
 */
export const getEnvironment = () => {
  const hostname = window.location.hostname
  const protocol = window.location.protocol
  const port = window.location.port
  
  // 开发环境检测
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('.local')) {
    return 'development'
  }
  
  // 预览/测试环境检测（如 Vercel 预览部署）
  if (hostname.includes('vercel.app') || hostname.includes('netlify.app') || hostname.includes('surge.sh')) {
    return 'preview'
  }
  
  // 生产环境
  return 'production'
}

/**
 * 获取当前域名信息
 */
export const getDomainInfo = () => {
  const origin = window.location.origin
  const hostname = window.location.hostname
  const protocol = window.location.protocol
  const port = window.location.port
  const environment = getEnvironment()
  
  return {
    origin,
    hostname,
    protocol,
    port,
    environment,
    isSecure: protocol === 'https:',
    isDevelopment: environment === 'development',
    isProduction: environment === 'production'
  }
}

/**
 * 获取 OAuth 重定向 URL
 */
export const getOAuthRedirectUrl = (path: string = '/auth/callback'): string => {
  const domainInfo = getDomainInfo()
  
  console.log('🌐 域名信息:', domainInfo)
  
  // 开发环境
  if (domainInfo.isDevelopment) {
    const redirectUrl = `${domainInfo.origin}${path}`
    console.log('🔧 开发环境重定向URL:', redirectUrl)
    return redirectUrl
  }
  
  // 生产环境 - 确保使用 HTTPS
  let redirectUrl = domainInfo.origin
  
  // 如果不是 HTTPS，强制转换为 HTTPS
  if (!domainInfo.isSecure && domainInfo.isProduction) {
    redirectUrl = redirectUrl.replace('http://', 'https://')
    console.log('🔒 强制使用 HTTPS:', redirectUrl)
  }
  
  const finalUrl = `${redirectUrl}${path}`
  console.log('🚀 生产环境重定向URL:', finalUrl)
  
  return finalUrl
}

/**
 * 获取密码重置 URL
 */
export const getPasswordResetUrl = (): string => {
  return getOAuthRedirectUrl('/reset-password')
}

/**
 * 检查是否为安全连接
 */
export const isSecureConnection = (): boolean => {
  return window.location.protocol === 'https:' || window.location.hostname === 'localhost'
}

/**
 * 获取 Supabase 配置
 */
export const getSupabaseConfig = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase 配置缺失')
    throw new Error('Supabase 配置缺失，请检查环境变量')
  }
  
  console.log('✅ Supabase 配置:', {
    url: supabaseUrl,
    hasAnonKey: !!supabaseAnonKey
  })
  
  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey
  }
}

/**
 * 调试信息输出
 */
export const logEnvironmentInfo = () => {
  const domainInfo = getDomainInfo()
  const supabaseConfig = getSupabaseConfig()
  
  console.group('🔍 环境信息')
  console.log('域名信息:', domainInfo)
  console.log('Supabase URL:', supabaseConfig.url)
  console.log('OAuth 重定向URL:', getOAuthRedirectUrl())
  console.log('密码重置URL:', getPasswordResetUrl())
  console.groupEnd()
}