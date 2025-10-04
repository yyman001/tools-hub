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

async function testPasswordReset(email) {
  console.log(`🔐 测试密码重置功能: ${email}\n`)

  try {
    console.log('📧 发送密码重置邮件...')
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset-password'
    })

    if (error) {
      console.log('❌ 发送失败:', error.message)
      
      if (error.message?.includes('not found')) {
        console.log('💡 该邮箱未注册，请先注册账户')
      } else if (error.message?.includes('rate limit')) {
        console.log('💡 发送频率过高，请稍后再试')
      } else {
        console.log('💡 请检查邮箱地址是否正确')
      }
    } else {
      console.log('✅ 密码重置邮件发送成功')
      console.log('📮 请检查您的邮箱（包括垃圾邮件文件夹）')
      console.log('🔗 点击邮件中的链接将跳转到重置密码页面')
    }

    console.log('\n🔧 密码重置流程:')
    console.log('1. 用户访问 /forgot-password 页面')
    console.log('2. 输入邮箱地址并提交')
    console.log('3. 系统发送重置邮件到用户邮箱')
    console.log('4. 用户点击邮件中的链接')
    console.log('5. 跳转到 /reset-password 页面')
    console.log('6. 用户输入新密码并提交')
    console.log('7. 密码更新成功，自动登录')

    console.log('\n💡 注意事项:')
    console.log('- 重置链接有时效性（通常24小时）')
    console.log('- 每个链接只能使用一次')
    console.log('- 重置后会自动登录到新会话')
    console.log('- 旧的会话将失效')

  } catch (error) {
    console.error('❌ 测试失败:', error.message)
  }
}

// 从命令行参数获取邮箱，或使用默认邮箱
const email = process.argv[2] || 'yyman001@gmail.com'
testPasswordReset(email)