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
    
    <!-- 注册成功提示 -->
    <RegistrationSuccess
      :show="showSuccessModal"
      :title="successTitle"
      :message="successMessage"
      :needs-verification="needsVerification"
      :email="form.email"
      @close="showSuccessModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import RegistrationSuccess from '@/components/RegistrationSuccess.vue'

const router = useRouter()
const { t } = useI18n()
const { register, isLoading, authMode } = useAuth()

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errorMessage = ref('')
const successMessage = ref('')
const showSuccessModal = ref(false)
const successTitle = ref('')
const needsVerification = ref(false)

const handleRegister = async () => {
  // 表单验证
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

  errorMessage.value = ''
  successMessage.value = ''

  try {
    const result = await register(
      form.value.username,
      form.value.email,
      form.value.password
    )
    
    if (result.success) {
      // 显示成功提示
      needsVerification.value = result.needsVerification || false
      
      if (result.needsVerification) {
        successTitle.value = '注册成功！'
        successMessage.value = '我们已向您的邮箱发送了验证邮件，请点击邮件中的链接完成验证。'
      } else {
        successTitle.value = '注册并登录成功！'
        successMessage.value = '欢迎加入 Tools Hub！您现在可以开始使用所有功能了。'
      }
      
      showSuccessModal.value = true
    } else {
      errorMessage.value = result.message || t('auth.errors.registerFailed')
    }
  } catch (error: any) {
    console.error('注册处理异常:', error)
    errorMessage.value = '注册过程中发生错误，请重试'
  }
}
</script>