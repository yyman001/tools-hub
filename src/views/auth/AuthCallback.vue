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

      <!-- 错误状态 -->
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

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const userStore = useUserStore()

const isProcessing = ref(true)
const isSuccess = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  await handleAuthCallback()
})

const handleAuthCallback = async () => {
  try {
    console.log('🔐 处理 OAuth 回调...')
    console.log('当前URL:', window.location.href)
    
    // 获取URL中的认证信息
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('获取会话失败:', error)
      throw error
    }

    if (data.session) {
      console.log('✅ OAuth 登录成功:', data.session.user.email)
      
      // 更新用户状态
      await userStore.setUser({
        id: data.session.user.id,
        email: data.session.user.email || '',
        username: data.session.user.user_metadata?.full_name || 
                  data.session.user.user_metadata?.name || 
                  data.session.user.email?.split('@')[0] || 
                  'User',
        avatar: data.session.user.user_metadata?.avatar_url || 
                data.session.user.user_metadata?.picture || '',
        createdAt: data.session.user.created_at,
        toolCount: 0,
        favoriteCount: 0
      })

      // 设置token
      userStore.setToken(data.session.access_token)
      
      isProcessing.value = false
      isSuccess.value = true
      
      // 2秒后跳转
      setTimeout(() => {
        const redirect = route.query.redirect as string
        router.push(redirect || '/')
      }, 2000)
      
    } else {
      console.log('❌ 没有找到有效会话')
      throw new Error('未找到有效的登录会话')
    }
    
  } catch (error: any) {
    console.error('OAuth 回调处理失败:', error)
    isProcessing.value = false
    errorMessage.value = getAuthErrorMessage(error)
  }
}

const retryAuth = async () => {
  isProcessing.value = true
  errorMessage.value = ''
  await handleAuthCallback()
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