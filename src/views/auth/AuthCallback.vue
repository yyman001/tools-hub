<template>
  <div class="min-h-[calc(100vh-4rem)] bg-elevated flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <!-- 加载状态 -->
      <div v-if="isProcessing" class="space-y-6">
        <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-primary-100 dark:bg-primary-900/30">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
        
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            {{ $t('auth.callback.processing') }}
          </h2>
          <p class="text-muted">
            {{ $t('auth.callback.processingDescription') }}
          </p>
        </div>
      </div>

      <!-- 成功状态 -->
      <div v-else-if="isSuccess" class="space-y-6">
        <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30">
          <svg class="h-10 w-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            {{ $t('auth.callback.success') }}
          </h2>
          <p class="text-muted mb-4">
            {{ $t('auth.callback.successDescription') }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ $t('auth.callback.redirecting') }}
          </p>
        </div>
      </div>

      <!-- GitHub 邮箱验证错误 -->
      <div v-else-if="isGitHubEmailError" class="space-y-6">
        <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
          <svg class="h-10 w-10 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
            GitHub 邮箱需要验证
          </h2>
          
          <GitHubEmailVerification @retry="handleRetryFromGitHub" />
        </div>
      </div>

      <!-- 其他错误状态 -->
      <div v-else-if="errorMessage" class="space-y-6">
        <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30">
          <svg class="h-10 w-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            {{ $t('auth.callback.error') }}
          </h2>
          <p class="text-red-600 dark:text-red-400 mb-4">
            {{ errorMessage }}
          </p>
          
          <div class="space-y-3">
            <button
              @click="retryAuth"
              class="w-full btn-primary"
            >
              {{ $t('auth.callback.retry') }}
            </button>
            
            <router-link
              to="/login"
              class="block w-full btn-secondary"
            >
              {{ $t('auth.callback.backToLogin') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores'
import GitHubEmailVerification from '@/components/GitHubEmailVerification.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const userStore = useUserStore()

const isProcessing = ref(true)
const isSuccess = ref(false)
const errorMessage = ref('')
const isGitHubEmailError = ref(false)

onMounted(async () => {
  await handleAuthCallback()
})

const handleAuthCallback = async () => {
  try {
    console.log('🔐 处理 OAuth 回调...')
    console.log('当前URL:', window.location.href)
    
    // 首先检查URL中是否有错误参数
    const urlParams = new URLSearchParams(window.location.search)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    
    // 检查查询参数中的错误
    const error = urlParams.get('error') || hashParams.get('error')
    const errorCode = urlParams.get('error_code') || hashParams.get('error_code')
    const errorDescription = urlParams.get('error_description') || hashParams.get('error_description')
    
    if (error) {
      console.error('OAuth 错误:', { error, errorCode, errorDescription })
      
      // 特殊处理 GitHub 邮箱验证错误
      if (error === 'access_denied' && errorCode === 'provider_email_needs_verification') {
        isProcessing.value = false
        isGitHubEmailError.value = true
        return
      }
      
      throw new Error(getOAuthErrorMessage(error, errorCode, errorDescription))
    }
    
    // 检查是否有access_token或code
    const accessToken = hashParams.get('access_token')
    const code = urlParams.get('code')
    
    if (!accessToken && !code) {
      // 尝试获取当前会话
      const { data, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('获取会话失败:', sessionError)
        throw sessionError
      }

      if (data.session) {
        await handleSuccessfulAuth(data.session)
        return
      } else {
        throw new Error('未找到有效的认证信息')
      }
    }
    
    // 如果有access_token，设置会话
    if (accessToken) {
      const refreshToken = hashParams.get('refresh_token')
      const { data, error: setSessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || ''
      })
      
      if (setSessionError) {
        console.error('设置会话失败:', setSessionError)
        throw setSessionError
      }
      
      if (data.session) {
        await handleSuccessfulAuth(data.session)
        return
      }
    }
    
    // 如果有code，让Supabase处理
    if (code) {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('交换code失败:', exchangeError)
        throw exchangeError
      }
      
      if (data.session) {
        await handleSuccessfulAuth(data.session)
        return
      }
    }
    
    throw new Error('未找到有效的登录会话')
    
  } catch (error: any) {
    console.error('OAuth 回调处理失败:', error)
    isProcessing.value = false
    errorMessage.value = getAuthErrorMessage(error)
  }
}

const handleSuccessfulAuth = async (session: any) => {
  console.log('✅ OAuth 登录成功:', session.user.email)
  console.log('用户信息:', session.user)
  
  // 直接设置用户状态
  userStore.user = {
    id: session.user.id,
    email: session.user.email || '',
    username: session.user.user_metadata?.full_name || 
              session.user.user_metadata?.name || 
              session.user.user_metadata?.user_name ||
              session.user.user_metadata?.preferred_username ||
              session.user.email?.split('@')[0] || 
              'User',
    avatar: session.user.user_metadata?.avatar_url || 
            session.user.user_metadata?.picture || '',
    createdAt: session.user.created_at,
    toolCount: 0,
    favoriteCount: 0
  }

  // 设置token
  userStore.token = session.access_token
  localStorage.setItem('token', session.access_token)
  
  console.log('✅ 用户状态已更新:', userStore.user)
  console.log('✅ 登录状态:', userStore.isLoggedIn)
  
  isProcessing.value = false
  isSuccess.value = true
  
  // 清理URL中的敏感信息
  window.history.replaceState({}, document.title, window.location.pathname)
  
  // 2秒后跳转
  setTimeout(() => {
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  }, 2000)
}

const retryAuth = async () => {
  isProcessing.value = true
  errorMessage.value = ''
  isGitHubEmailError.value = false
  await handleAuthCallback()
}

const handleRetryFromGitHub = () => {
  router.push('/login')
}

const getOAuthErrorMessage = (error: string, errorCode?: string, errorDescription?: string): string => {
  switch (error) {
    case 'access_denied':
      if (errorCode === 'provider_email_needs_verification') {
        return 'GitHub 邮箱未验证。请前往 GitHub 设置验证您的邮箱地址，然后重试登录。'
      }
      return '访问被拒绝，请重试或使用其他登录方式'
    case 'unauthorized_client':
      return 'OAuth 应用配置错误，请联系管理员'
    case 'invalid_request':
      return '登录请求无效，请重试'
    case 'server_error':
      return '服务器错误，请稍后重试'
    default:
      return errorDescription ? decodeURIComponent(errorDescription) : '登录失败，请重试'
  }
}

const getAuthErrorMessage = (error: any): string => {
  switch (error.message) {
    case 'Invalid login credentials':
      return '登录凭据无效'
    case 'Email not confirmed':
      return '邮箱未验证，请先验证邮箱'
    case 'Too many requests':
      return '请求过于频繁，请稍后再试'
    case 'Network request failed':
      return '网络连接失败，请检查网络'
    default:
      return error.message || '认证失败，请重试'
  }
}
</script>