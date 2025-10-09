<template>
  <div class="space-y-4">
    <!-- 第三方登录按钮 -->
    <div class="space-y-3">
      <!-- Google 登录 -->
      <button
        @click="handleGoogleLogin"
        :disabled="isLoading"
        class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span class="text-sm font-medium">
          {{ isLoading && loadingProvider === 'google' ? $t('auth.social.signingIn') : $t('auth.social.continueWithGoogle') }}
        </span>
      </button>

      <!-- GitHub 登录 -->
      <button
        @click="handleGitHubLogin"
        :disabled="isLoading"
        class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span class="text-sm font-medium">
          {{ isLoading && loadingProvider === 'github' ? $t('auth.social.signingIn') : $t('auth.social.continueWithGitHub') }}
        </span>
      </button>
    </div>

    <!-- 分割线 -->
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-elevated text-muted">{{ $t('auth.social.orContinueWith') }}</span>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
      <div class="flex">
        <svg class="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/lib/supabase'
import { getOAuthRedirectUrl, logEnvironmentInfo } from '@/utils/environment'

const router = useRouter()
const { t } = useI18n()

const isLoading = ref(false)
const loadingProvider = ref<'google' | 'github' | null>(null)
const errorMessage = ref('')

// 初始化时输出环境信息
logEnvironmentInfo()

// Google 登录
const handleGoogleLogin = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  loadingProvider.value = 'google'
  errorMessage.value = ''

  try {
    console.log('🔐 开始 Google 登录...')
    
    // 获取当前环境的重定向URL
    const redirectTo = getOAuthRedirectUrl()
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    })

    if (error) {
      console.error('Google 登录失败:', error)
      errorMessage.value = getAuthErrorMessage(error)
    } else {
      console.log('Google 登录请求已发送，重定向到:', redirectTo)
      // OAuth 登录会重定向，不需要手动处理跳转
    }
  } catch (error: any) {
    console.error('Google 登录异常:', error)
    errorMessage.value = error.message || 'Google 登录失败，请重试'
  } finally {
    isLoading.value = false
    loadingProvider.value = null
  }
}

// GitHub 登录
const handleGitHubLogin = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  loadingProvider.value = 'github'
  errorMessage.value = ''

  try {
    console.log('🔐 开始 GitHub 登录...')
    
    // 获取当前环境的重定向URL
    const redirectTo = getOAuthRedirectUrl()
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo,
        scopes: 'user:email', // 确保获取邮箱权限
      }
    })

    if (error) {
      console.error('GitHub 登录失败:', error)
      errorMessage.value = getAuthErrorMessage(error)
    } else {
      console.log('GitHub 登录请求已发送，重定向到:', redirectTo)
      // OAuth 登录会重定向，不需要手动处理跳转
    }
  } catch (error: any) {
    console.error('GitHub 登录异常:', error)
    errorMessage.value = error.message || 'GitHub 登录失败，请重试'
  } finally {
    isLoading.value = false
    loadingProvider.value = null
  }
}

// 错误消息处理
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
      return error.message || '登录失败，请重试'
  }
}
</script>