#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// 读取 .env 文件
const envContent = fs.readFileSync('.env', 'utf8')
const envLines = envContent.split('\n')
const env = {}

envLines.forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    env[key.trim()] = value.trim()
  }
})

const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 缺少 Supabase 环境变量')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkEmailStatus(email) {
  console.log(`🔍 检查邮箱状态: ${email}\n`)

  try {
    // 尝试重发验证邮件来检查状态
    console.log('📧 尝试重发验证邮件...')
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    })

    if (error) {
      console.log('❌ 重发失败:', error.message)
      
      if (error.message?.includes('already confirmed')) {
        console.log('✅ 状态: 邮箱已注册并验证')
        console.log('💡 建议: 用户应该直接登录')
      } else if (error.message?.includes('not found')) {
        console.log('❓ 状态: 邮箱未注册')
        console.log('💡 建议: 可以正常注册')
      } else {
        console.log('⚠️  状态: 未知错误')
        console.log('💡 建议: 检查网络连接或 Supabase 配置')
      }
    } else {
      console.log('✅ 重发成功')
      console.log('📮 状态: 邮箱已注册但未验证')
      console.log('💡 建议: 引导用户到验证页面')
    }

    console.log('\n🔧 解决方案:')
    console.log('1. 如果邮箱已验证 → 引导用户登录')
    console.log('2. 如果邮箱未验证 → 跳转到验证页面')
    console.log('3. 如果邮箱未注册 → 正常注册流程')

  } catch (error) {
    console.error('❌ 检查失败:', error.message)
  }
}

// 从命令行参数获取邮箱，或使用默认邮箱
const email = process.argv[2] || 'yyman001@gmail.com'
checkEmailStatus(email)