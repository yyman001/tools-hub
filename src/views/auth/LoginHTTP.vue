<template>
  <div class="min-h-[calc(100vh-4rem)] bg-elevated flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-slate-100">
          {{ $t('auth.login') }}
        </h2>
        <p class="mt-2 text-center text-sm text-muted">
          {{ $t('auth.loginPrompt') }}
          <router-link to="/register" class="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
            {{ $t('auth.registerNow') }}
          </router-link>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-slate-300">
              {{ $t('auth.email') }}
            </label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              required
              class="input-field mt-1"
              :placeholder="$t('auth.email')"
            >
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-slate-300">
              {{ $t('auth.password') }}
            </label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="input-field mt-1"
              :placeholder="$t('auth.password')"
            >
          </div>
        </div>

        <!-- 调试信息 -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">调试信息:</p>
          <div class="text-xs space-y-1">
            <div>API状态: {{ apiStatus }}</div>
            <div v-if="debugInfo">{{ debugInfo }}</div>
          </div>
        </div>

        <div v-if="errorMessage" class="text-red-600 dark:text-red-400 text-sm text-center">
          {{ errorMessage }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full btn-primary disabled:opacity-50"
          >
            {{ isLoading ? $t('auth.loggingIn') : $t('auth.loginButton') }}
          </button>
        </div>
        
        <div class="text-center">
          <router-link 
            to="/forgot-password" 
            class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
          >
            {{ $t('auth.forgotPasswordLink') }}
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const form = ref({
  email: '',
  password: ''
})

const errorMessage = ref('')
const isLoading = ref(false)
const apiStatus = ref('等待中...')
const debugInfo = ref('')

let supabaseUrl = ''
let supabaseAnonKey = ''

// 使用HTTP API登录
const loginViaHTTP = async (email: string, password: string) => {
  try {
    console.log('📡 使用HTTP API登录...')
    
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    
    console.log('HTTP登录响应状态:', response.status)
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error('HTTP登录错误:', errorData)
      throw new Error(`HTTP ${response.status}: ${errorData}`)
    }
    
    const data = await response.json()
    console.log('HTTP登录成功响应:', data)
    
    return { data, error: null }
  } catch (error: any) {
    console.error('HTTP登录异常:', error)
    return { data: null, error }
  }
}

// 处理登录
const handleLogin = async () => {
  // 表单验证
  if (!form.value.email || !form.value.password) {
    errorMessage.value = t('auth.errors.required')
    return
  }

  // 邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    errorMessage.value = '请输入有效的邮箱地址'
    return
  }

  // 密码长度验证
  if (form.value.password.length < 6) {
    errorMessage.value = '密码至少需要6个字符'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  apiStatus.value = '登录中...'

  try {
    console.log('🔐 开始HTTP模式登录:', form.value.email)
    
    // 使用HTTP API登录
    const { data, error } = await loginViaHTTP(form.value.email, form.value.password)
    
    if (error) {
      console.error('❌ HTTP登录失败:', error)
      apiStatus.value = '登录失败'
      errorMessage.value = 'HTTP登录失败：' + error.message
    } else if (data && data.access_token) {
      console.log('✅ HTTP登录成功!')
      apiStatus.value = '登录成功'
      
      // 手动设置用户状态
      userStore.token = data.access_token
      localStorage.setItem('token', data.access_token)
      
      // 设置用户信息
      if (data.user) {
        userStore.user = {
          id: data.user.id,
          username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || '',
          email: data.user.email || '',
          avatar: data.user.user_metadata?.avatar_url,
          createdAt: data.user.created_at,
          toolCount: 0,
          favoriteCount: 0
        }
      } else {
        // 如果响应中没有用户信息，使用token获取用户信息
        console.log('响应中没有用户信息，尝试获取用户信息...')
        try {
          const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${data.access_token}`,
              'apikey': supabaseAnonKey
            }
          })
          
          if (userResponse.ok) {
            const userData = await userResponse.json()
            console.log('获取用户信息成功:', userData)
            
            userStore.user = {
              id: userData.id,
              username: userData.user_metadata?.username || userData.email?.split('@')[0] || '',
              email: userData.email || '',
              avatar: userData.user_metadata?.avatar_url,
              createdAt: userData.created_at,
              toolCount: 0,
              favoriteCount: 0
            }
          } else {
            console.error('获取用户信息失败:', userResponse.status)
          }
        } catch (userError) {
          console.error('获取用户信息异常:', userError)
        }
      }
      
      // 登录成功，跳转到首页或之前的页面
      const redirect = router.currentRoute.value.query.redirect as string
      router.push(redirect || '/')
    } else {
      console.error('❌ 登录响应无效')
      apiStatus.value = '响应无效'
      errorMessage.value = '登录响应无效，请重试'
    }
  } catch (error: any) {
    console.error('❌ 登录处理异常:', error)
    apiStatus.value = '异常错误'
    errorMessage.value = '登录过程中发生错误，请重试'
  } finally {
    isLoading.value = false
  }
}

// 初始化
const init = () => {
  // 获取环境变量
  supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    apiStatus.value = '❌ 缺少环境变量'
    errorMessage.value = '缺少Supabase配置'
    return
  }
  
  debugInfo.value = `URL: ${supabaseUrl.substring(0, 30)}...`
  apiStatus.value = '准备就绪'
  
  console.log('📄 HTTP登录页面初始化完成')
}

// 页面加载时初始化
init()
</script>