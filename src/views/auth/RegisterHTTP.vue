<template>
  <div class="min-h-[calc(100vh-4rem)] bg-elevated flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-slate-100">
          {{ $t('auth.register') }}
        </h2>
        <p class="mt-2 text-center text-sm text-muted">
          {{ $t('auth.registerPrompt') }}
          <router-link to="/login" class="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
            {{ $t('auth.loginNow') }}
          </router-link>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-slate-300">
              {{ $t('auth.username') }}
            </label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              required
              class="input-field mt-1"
              :placeholder="$t('auth.username')"
            >
          </div>
          
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
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-slate-300">
              {{ $t('auth.confirmPassword') }}
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="input-field mt-1"
              :placeholder="$t('auth.confirmPassword')"
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

        <div v-if="successMessage" class="text-green-600 dark:text-green-400 text-sm text-center">
          {{ successMessage }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full btn-primary disabled:opacity-50"
          >
            {{ isLoading ? $t('auth.registering') : $t('auth.registerButton') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)
const apiStatus = ref('等待中...')
const debugInfo = ref('')

let supabaseUrl = ''
let supabaseAnonKey = ''

// 使用HTTP API注册
const registerViaHTTP = async (email: string, password: string, username: string) => {
  try {
    console.log('📡 使用HTTP API注册...')
    
    const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify({
        email: email,
        password: password,
        data: {
          username: username
        }
      })
    })
    
    console.log('HTTP注册响应状态:', response.status)
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error('HTTP注册错误:', errorData)
      throw new Error(`HTTP ${response.status}: ${errorData}`)
    }
    
    const data = await response.json()
    console.log('HTTP注册成功响应:', data)
    
    return { data, error: null }
  } catch (error: any) {
    console.error('HTTP注册异常:', error)
    return { data: null, error }
  }
}

// 处理注册
const handleRegister = async () => {
  if (!form.value.username || !form.value.email || !form.value.password) {
    errorMessage.value = t('auth.errors.required')
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = t('auth.errors.passwordMismatch')
    return
  }

  if (form.value.password.length < 6) {
    errorMessage.value = t('auth.errors.passwordTooShort')
    return
  }

  // 邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    errorMessage.value = '请输入有效的邮箱地址'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  apiStatus.value = '注册中...'

  try {
    console.log('🔐 开始HTTP模式注册:', form.value.email)
    
    const { data, error } = await registerViaHTTP(
      form.value.email,
      form.value.password,
      form.value.username
    )
    
    if (error) {
      console.error('❌ HTTP注册失败:', error)
      apiStatus.value = '注册失败'
      errorMessage.value = 'HTTP注册失败：' + error.message
    } else if (data) {
      console.log('✅ HTTP注册成功!')
      apiStatus.value = '注册成功'
      
      if (data.session) {
        // 注册成功并自动登录
        successMessage.value = '注册成功！正在跳转...'
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        // 需要邮箱验证
        successMessage.value = '注册成功！请检查您的邮箱进行验证。'
        setTimeout(() => {
          router.push({
            name: 'EmailVerification',
            query: { email: form.value.email }
          })
        }, 3000)
      }
    } else {
      console.error('❌ 注册响应无效')
      apiStatus.value = '响应无效'
      errorMessage.value = '注册响应无效，请重试'
    }
  } catch (error: any) {
    console.error('❌ 注册处理异常:', error)
    apiStatus.value = '异常错误'
    errorMessage.value = '注册过程中发生错误，请重试'
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
  
  console.log('📄 HTTP注册页面初始化完成')
}

// 页面加载时初始化
init()
</script>