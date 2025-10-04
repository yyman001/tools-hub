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

async function testAuth() {
    console.log('🔐 测试 Supabase 认证功能...\n')

    try {
        // 测试注册功能
        console.log('📝 测试用户注册...')
        const testEmail = `test_${Date.now()}@example.com`
        const testPassword = 'test123456'

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
                data: {
                    username: 'testuser'
                }
            }
        })

        if (signUpError) {
            console.log('⚠️  注册测试:', signUpError.message)
        } else {
            console.log('✅ 注册功能正常')
            console.log('   用户ID:', signUpData.user?.id)
            console.log('   邮箱:', signUpData.user?.email)
        }

        // 测试登录功能
        console.log('\n🔑 测试用户登录...')
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: testEmail,
            password: testPassword
        })

        if (signInError) {
            console.log('⚠️  登录测试:', signInError.message)
        } else {
            console.log('✅ 登录功能正常')
            console.log('   会话ID:', signInData.session?.access_token?.substring(0, 20) + '...')
        }

        // 测试获取用户信息
        console.log('\n👤 测试获取用户信息...')
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError) {
            console.log('⚠️  获取用户信息:', userError.message)
        } else {
            console.log('✅ 获取用户信息正常')
            console.log('   用户邮箱:', userData.user?.email)
            console.log('   用户名:', userData.user?.user_metadata?.username)
        }

        // 测试登出
        console.log('\n🚪 测试用户登出...')
        const { error: signOutError } = await supabase.auth.signOut()

        if (signOutError) {
            console.log('⚠️  登出测试:', signOutError.message)
        } else {
            console.log('✅ 登出功能正常')
        }

        console.log('\n🎉 认证功能测试完成！')

    } catch (error) {
        console.error('❌ 认证测试失败:', error.message)
    }
}

testAuth()