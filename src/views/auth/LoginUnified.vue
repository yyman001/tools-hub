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

        <!-- 认证模式显示 -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p class="text-xs text-blue-800 dark:text-blue-200">
            当前认证模式: {{ authMode.toUpperCase() }}
            {{ authMode === 'http' ? '(HTTP REST API)' : '(Supabase JS SDK)' }}
          </p>
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
        
        <div class="text-center text-sm text-muted">
          <p>{{ $t('auth.testAccount') }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { t } = useI18n()
const { login, isLoading, authMode } = useAuth()

const form = ref({
  email: '',
  password: ''
})

const errorMessage = ref('')

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

  errorMessage.value = ''

  try {
    const result = await login(form.value.email, form.value.password)
    
    if (result.success) {
      // 登录成功，跳转到首页或之前的页面
      const redirect = router.currentRoute.value.query.redirect as string
      router.push(redirect || '/')
    } else {
      errorMessage.value = result.message || t('auth.errors.loginFailed')
    }
  } catch (error: any) {
    console.error('登录处理异常:', error)
    errorMessage.value = '登录过程中发生错误，请重试'
  }
}
</script>