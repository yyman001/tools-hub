/**
 * 全局错误处理工具
 */

export interface AppError {
  code: string
  message: string
  details?: any
}

export class ErrorHandler {
  static handle(error: any, context?: string): AppError {
    console.error(`❌ 错误 [${context || 'Unknown'}]:`, error)
    
    // Supabase 认证错误
    if (error?.message?.includes('HTTP 403')) {
      return {
        code: 'AUTH_FORBIDDEN',
        message: '认证失败，请重新登录',
        details: error
      }
    }
    
    // 网络错误
    if (error?.message?.includes('fetch')) {
      return {
        code: 'NETWORK_ERROR',
        message: '网络连接失败，请检查网络设置',
        details: error
      }
    }
    
    // 数据格式错误
    if (error?.message?.includes('Cannot read properties')) {
      return {
        code: 'DATA_FORMAT_ERROR',
        message: '数据格式错误，请刷新页面重试',
        details: error
      }
    }
    
    // 默认错误
    return {
      code: 'UNKNOWN_ERROR',
      message: error?.message || '未知错误',
      details: error
    }
  }
  
  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    context?: string,
    fallback?: T
  ): Promise<T | null> {
    try {
      return await operation()
    } catch (error) {
      const appError = ErrorHandler.handle(error, context)
      
      // 在开发环境显示详细错误
      if (import.meta.env.DEV) {
        console.error('详细错误信息:', appError)
      }
      
      return fallback || null
    }
  }
}

export default ErrorHandler
