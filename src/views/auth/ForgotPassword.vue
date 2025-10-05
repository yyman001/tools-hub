<template>
  <div class="min-h-[calc(100vh-4rem)] bg-elevated flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-slate-100">
          {{ $t('auth.forgotPassword.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-muted">
          {{ $t('auth.forgotPassword.description') }}
        </p>
      </div>
      
      <!-- 发送重置邮件表单 -->
      <form v-if="!emailSent" class="mt-8 space-y-6" @submit.prevent="handleSendResetEmail">
        <!-- 邮箱输入组件 -->
        <EmailInput
          v-model="form.email"
          :label="$t('auth.email')"
          name="email"
          input-id="email"
          :placeholder="$t('auth.forgotPassword.emailPlaceholder')"
        />

        <div v-if="errorMessage" class="text-red-600 dark:text-red-400 text-sm text-center">
          {{ errorMessage }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full btn-primary disabled:opacity-50"
          >
            {{ isLoading ? $t('auth.forgotPassword.sending') : $t('auth.forgotPassword.sendResetEmail') }}
          </button>
        </div>
        
        <div class="text-center">
          <router-link 
            to="/login" 
            class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
          >
            {{ $t('auth.forgotPassword.backToLogin') }}
          </router-link>
        </div>
      </form>
      
      <!-- 邮件发送成功提示 -->
      <div v-else class="text-center space-y-6">
        <!-- 成功图标 -->
        <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30">
          <svg class="h-10 w-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
            {{ $t('auth.forgotPassword.emailSentTitle') }}
          </h3>
          <p class="text-muted mb-4">
            {{ $t('auth.forgotPassword.emailSentDescription') }}
          </p>
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p class="text-sm text-blue-800 dark:text-blue-200">
              <strong>{{ $t('auth.forgotPassword.emailSentTo') }}</strong><br>
              {{ form.email }}
            </p>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="space-y-4">
          <button
            @click="resendResetEmail"
            :disabled="isResending || countdown > 0"
            class="w-full btn-secondary disabled:opacity-50"
          >
            <span v-if="isResending">{{ $t('auth.forgotPassword.resending') }}</span>
            <span v-else-if="countdown > 0">{{ $t('auth.forgotPassword.resendIn', { seconds: countdown }) }}</span>
            <span v-else>{{ $t('auth.forgotPassword.resendResetEmail') }}</span>
          </button>
          
          <div class="text-center">
            <router-link 
              to="/login" 
              class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
            >
              {{ $t('auth.forgotPassword.backToLogin') }}
            </router-link>
          </div>
        </div>
        
        <!-- 帮助信息 -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <h3 class="text-sm font-medium text-gray-900 dark:text-slate-100 mb-2">
            {{ $t('auth.forgotPassword.helpTitle') }}
          </h3>
          <ul class="text-sm text-muted space-y-1">
            <li>• {{ $t('auth.forgotPassword.helpTip1') }}</li>
            <li>• {{ $t('auth.forgotPassword.helpTip2') }}</li>
            <li>• {{ $t('auth.forgotPassword.helpTip3') }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/lib/supabase'
import { getAuthErrorMessage } from '@/utils/authErrors'
import { getPasswordResetUrl } from '@/utils/environment'
import { useRememberPassword } from '@/composables/useRememberPassword'
import EmailInput from '@/components/EmailInput.vue'

const router = useRouter()
const { t } = useI18n()
const { getSavedEmail } = useRememberPassword()

const form = ref({
  email: ''
})

// 初始化时尝试填充保存的邮箱
onMounted(() => {
  const savedEmail = getSavedEmail()
  if (savedEmail) {
    form.value.email = savedEmail
  }
})

const errorMessage = ref('')
const isLoading = ref(false)
const emailSent = ref(false)
const isResending = ref(false)
const countdown = ref(0)

let countdownTimer: NodeJS.Timeout | null = null

// 发送重置密码邮件
const handleSendResetEmail = async () => {
  if (!form.value.email) {
    errorMessage.value = t('auth.errors.required')
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

  try {
    console.log('🔐 发送密码重置邮件:', form.value.email)
    
    // 动态获取正确的重定向URL
    const redirectUrl = getPasswordResetUrl()
    console.log('重定向URL:', redirectUrl)
    
    const { error } = await supabase.auth.resetPasswordForEmail(form.value.email, {
      redirectTo: redirectUrl
    })

    if (error) {
      console.error('发送重置邮件失败:', error)
      errorMessage.value = getAuthErrorMessage(error)
    } else {
      console.log('密码重置邮件发送成功')
      emailSent.value = true
      startCountdown()
    }
  } catch (error: any) {
    console.error('发送重置邮件异常:', error)
    errorMessage.value = error.message || '网络错误，请检查网络连接'
  } finally {
    isLoading.value = false
  }
}

// 重新发送重置邮件
const resendResetEmail = async () => {
  isResending.value = true
  errorMessage.value = ''

  try {
    // 动态获取正确的重定向URL
    const redirectUrl = getPasswordResetUrl()
    console.log('重发邮件重定向URL:', redirectUrl)
    
    const { error } = await supabase.auth.resetPasswordForEmail(form.value.email, {
      redirectTo: redirectUrl
    })

    if (error) {
      errorMessage.value = getAuthErrorMessage(error)
    } else {
      startCountdown()
    }
  } catch (error: any) {
    errorMessage.value = error.message || '重新发送失败，请稍后再试'
  } finally {
    isResending.value = false
  }
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer!)
      countdownTimer = null
    }
  }, 1000)
}

// 清理定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>