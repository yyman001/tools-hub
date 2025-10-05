<template>
  <div class="min-h-[calc(100vh-4rem)] bg-elevated flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-slate-100">
          {{ $t('auth.resetPassword.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-muted">
          {{ $t('auth.resetPassword.description') }}
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
        <div class="space-y-4">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-slate-300">
              {{ $t('auth.resetPassword.newPassword') }}
            </label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="input-field mt-1"
              :placeholder="$t('auth.resetPassword.newPasswordPlaceholder')"
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

        <!-- 密码强度提示 -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            {{ $t('auth.resetPassword.passwordRequirements') }}
          </h3>
          <ul class="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li :class="{ 'text-green-600 dark:text-green-400': passwordChecks.length }">
              • {{ $t('auth.resetPassword.requirement1') }}
            </li>
            <li :class="{ 'text-green-600 dark:text-green-400': passwordChecks.hasLetter }">
              • {{ $t('auth.resetPassword.requirement2') }}
            </li>
            <li :class="{ 'text-green-600 dark:text-green-400': passwordChecks.hasNumber }">
              • {{ $t('auth.resetPassword.requirement3') }}
            </li>
          </ul>
        </div>

        <!-- 认证模式显示 -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p class="text-xs text-gray-600 dark:text-gray-400">
            认证模式: SDK | Token状态: {{ tokenStatus }}
          </p>
        </div>

        <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p class="text-red-600 dark:text-red-400 text-sm text-center">
            {{ errorMessage }}
          </p>
        </div>

        <div v-if="successMessage" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p class="text-green-600 dark:text-green-400 text-sm text-center">
            {{ successMessage }}
          </p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !isPasswordValid || !hasValidToken"
            class="w-full btn-primary disabled:opacity-50"
          >
            {{ isLoading ? $t('auth.resetPassword.updating') : $t('auth.resetPassword.updatePassword') }}
          </button>
        </div>
        
        <div class="text-center">
          <router-link 
            to="/login" 
            class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
          >
            {{ $t('auth.resetPassword.backToLogin') }}
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { t } = useI18n()
const { resetPassword, isLoading } = useAuth()

const form = ref({
  password: '',
  confirmPassword: ''
})

const errorMessage = ref('')
const successMessage = ref('')
const tokenStatus = ref('检查中...')
const hasValidToken = ref(false)

let accessToken = ''

// 密码强度检查
const passwordChecks = computed(() => ({
  length: form.value.password.length >= 6,
  hasLetter: /[a-zA-Z]/.test(form.value.password),
  hasNumber: /\d/.test(form.value.password)
}))

const isPasswordValid = computed(() => {
  return passwordChecks.value.length && 
         passwordChecks.value.hasLetter && 
         form.value.password === form.value.confirmPassword
})

// 重置密码
const handleResetPassword = async () => {
  if (!isPasswordValid.value) {
    errorMessage.value = '请检查密码输入'
    return
  }

  if (!hasValidToken.value) {
    errorMessage.value = '没有有效的重置token'
    return
  }

  errorMessage.value = ''
  successMessage.value = ''

  try {
    const result = await resetPassword(form.value.password, accessToken)
    
    if (result.success) {
      successMessage.value = t('auth.resetPassword.success')
      
      // 清除URL中的敏感信息
      window.history.replaceState({}, document.title, window.location.pathname)
      
      // 3秒后跳转到首页
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } else {
      errorMessage.value = result.message || '密码重置失败'
    }
  } catch (error: any) {
    console.error('重置密码异常:', error)
    errorMessage.value = '重置密码时发生错误：' + error.message
  }
}

// 页面加载时处理
onMounted(async () => {
  console.log('📄 重置密码页面加载 (SDK模式)')
  
  try {
    // SDK模式：从URL提取token或检查会话状态
    const hash = window.location.hash.substring(1)
    if (hash) {
      // 从URL提取token
      const params = new URLSearchParams(hash)
      accessToken = params.get('access_token') || ''
      const type = params.get('type') || ''
      
      if (!accessToken) {
        tokenStatus.value = '❌ 没有access_token'
        errorMessage.value = '重置链接无效，请重新申请密码重置'
        return
      }
      
      if (type !== 'recovery') {
        tokenStatus.value = '❌ token类型错误'
        errorMessage.value = 'token类型错误，请重新申请密码重置'
        return
      }
      
      tokenStatus.value = '✅ 找到有效token'
      hasValidToken.value = true
    } else {
      // 检查会话状态
      tokenStatus.value = '✅ SDK模式'
      hasValidToken.value = true
    }
    
    console.log('✅ Token验证成功，可以进行密码重置')
    
  } catch (error: any) {
    console.error('❌ 初始化异常:', error)
    tokenStatus.value = '❌ 初始化异常'
    errorMessage.value = '初始化时发生错误：' + error.message
  }
})
</script>