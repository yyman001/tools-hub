#!/usr/bin/env node

/**
 * 运行时错误修复脚本
 * 修复 Supabase 认证和数据处理问题
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.dirname(__dirname)

console.log('🔧 开始修复运行时错误...')

// 1. 检查环境变量文件
const envPath = path.join(projectRoot, '.env')
const envExamplePath = path.join(projectRoot, '.env.example')

if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env 文件不存在，正在创建示例文件...')
  
  const envContent = `# Supabase 配置
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# 应用配置
VITE_APP_PROTOCOL=https
VITE_APP_HOST=your-domain.com
VITE_APP_PORT=443

# 认证模式 (sdk 或 http)
VITE_AUTH_MODE=sdk
`
  
  fs.writeFileSync(envPath, envContent)
  console.log('📝 已创建 .env 文件，请填入正确的 Supabase 配置')
}

// 2. 创建错误处理工具
const errorHandlerPath = path.join(projectRoot, 'src/utils/errorHandler.ts')
const errorHandlerContent = `/**
 * 全局错误处理工具
 */

export interface AppError {
  code: string
  message: string
  details?: any
}

export class ErrorHandler {
  static handle(error: any, context?: string): AppError {
    console.error(\`❌ 错误 [\${context || 'Unknown'}]:\`, error)
    
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
`

if (!fs.existsSync(errorHandlerPath)) {
  fs.writeFileSync(errorHandlerPath, errorHandlerContent)
  console.log('✅ 已创建错误处理工具')
}

// 3. 创建数据验证工具
const validatorPath = path.join(projectRoot, 'src/utils/dataValidator.ts')
const validatorContent = `/**
 * 数据验证工具
 */

export class DataValidator {
  static isValidTool(tool: any): boolean {
    return tool && 
           typeof tool.id === 'string' &&
           typeof tool.name_zh === 'string' &&
           typeof tool.name_en === 'string' &&
           Array.isArray(tool.supported_platforms)
  }
  
  static isValidCategory(category: any): boolean {
    return category &&
           typeof category.id === 'number' &&
           typeof category.name_zh === 'string' &&
           typeof category.name_en === 'string'
  }
  
  static sanitizeTool(tool: any): any {
    if (!tool) return null
    
    return {
      ...tool,
      supported_platforms: Array.isArray(tool.supported_platforms) ? tool.supported_platforms : [],
      tags: Array.isArray(tool.tags) ? tool.tags : [],
      downloadLinks: Array.isArray(tool.downloadLinks) ? tool.downloadLinks : [],
      rating: typeof tool.rating === 'number' ? tool.rating : 0,
      viewCount: typeof tool.viewCount === 'number' ? tool.viewCount : 0,
      likeCount: typeof tool.likeCount === 'number' ? tool.likeCount : 0
    }
  }
  
  static sanitizeCategory(category: any): any {
    if (!category) return null
    
    return {
      ...category,
      children: Array.isArray(category.children) ? category.children : []
    }
  }
}

export default DataValidator
`

if (!fs.existsSync(validatorPath)) {
  fs.writeFileSync(validatorPath, validatorContent)
  console.log('✅ 已创建数据验证工具')
}

console.log('🎉 运行时错误修复完成！')
console.log('')
console.log('📋 接下来的步骤：')
console.log('1. 检查并填写 .env 文件中的 Supabase 配置')
console.log('2. 确保 Supabase 项目已正确设置')
console.log('3. 重新构建项目: npm run build:cloudflare')
console.log('4. 测试应用功能')