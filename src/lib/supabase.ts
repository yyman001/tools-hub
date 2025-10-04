import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing')
  console.error('Please check your .env file and ensure both variables are set.')
  
  throw new Error(`Missing Supabase environment variables. Please check your .env file.
Required variables:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Current values:
- VITE_SUPABASE_URL: ${supabaseUrl || 'undefined'}
- VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '[SET]' : 'undefined'}`)
}

// 创建 Supabase 客户端，添加更好的配置
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'tool-hub@1.0.0'
    }
  }
})

// 添加连接状态检查
let connectionChecked = false

export const checkSupabaseConnection = async () => {
  if (connectionChecked) return true
  
  try {
    console.log('🔗 检查 Supabase 连接...')
    const { data, error } = await supabase.from('categories').select('count').limit(1)
    
    if (error) {
      console.error('❌ Supabase 连接失败:', error.message)
      return false
    }
    
    console.log('✅ Supabase 连接正常')
    connectionChecked = true
    return true
  } catch (error) {
    console.error('❌ Supabase 连接异常:', error)
    return false
  }
}