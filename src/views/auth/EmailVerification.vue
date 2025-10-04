<template>
  <div class="min-h-[calc(100vh-4rem)] bg-elevated flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <!-- 邮箱图标 -->
        <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-6">
          <svg class="h-10 w-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h2 class="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">
          {{ $t('auth.emailVerification.title') }}
        </h2>
        
        <p class="text-muted mb-6">
          {{ $t('auth.emailVerification.description') }}
        </p>
        
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <p class="text-sm text-blue-800 dark:text-blue-200">
            <strong>{{ $t('auth.emailVerification.emailSentTo') }}</strong><br>
            {{ email }}
          </p>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="space-y-4">
        <button
          @click="resendEmail"
          :disabled="isResending || countdown > 0"
          class="w-full btn-secondary disabled:opacity-50"
        >
          <span v-if="isResending">{{ $t('auth.emailVerification.resending') }}</span>
          <span v-else-if="countdown > 0">{{ $t('auth.emailVerification.resendIn', { seconds: countdown }) }}</span>
          <span v-else>{{ $t('auth.emailVerification.resendEmail') }}</span>
        </button>
        
        <button
          @click="checkVerification"
          :disabled="isChecking"
          class="w-full btn-primary disabled:opacity-50"
        >
          {{ isChecking ? $t('auth.emailVerification.checking') : $t('auth.emailVerification.checkVerification') }}
        </button>
        
        <div class="text-center">
          <router-link 
            to="/login" 
            class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
          >
            {{ $t('auth.emailVerification.backToLogin') }}
          </router-link>
        </div>
      </div>
      
      <!-- 帮助信息 -->
      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-900 dark:text-slate-100 mb-2">
          {{ $t('auth.emailVerification.helpTitle') }}
        </h3>
        <ul class="text-sm text-muted space-y-1">
          <li>• {{ $t('auth.emailVerification.helpTip1') }}</li>
          <li>• {{ $t('auth.emailVerification.helpTip2') }}</li>
          <li>• {{ $t('auth.emailVerification.helpTip3') }}</li>
          <li>• {{ $t('auth.emailVerification.helpTip4') }}</li>
        </ul>
        
        <!-- 额外的故障排除 -->
        <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p class="text-xs text-muted mb-2">{{ $t('auth.emailVerification.troubleshootTitle') }}</p>
          <div class="flex flex-wrap gap-2">
            <button
              @click="tryDifferentEmail"
              class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {{ $t('auth.emailVerification.tryDifferentEmail') }}
            </button>
            <button
              @click="contactSupport"
              class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {{ $t('auth.emailVerification.contactSupport') }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- 成功消息 -->
      <div v-if="successMessage" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <p class="text-sm text-green-800 dark:text-green-200">
          {{ successMessage }}
        </p>
      </div>
      
      <!-- 错误消息 -->
      <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p class="text-sm text-red-800 dark:text-red-200">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()

const email = ref(route.query.email as string || '')
const isResending = ref(false)
const isChecking = ref(false)
const countdown = ref(0)
const successMessage = ref('')
const errorMessage = ref('')

let countdownTimer: NodeJS.Timeout | null = null

// 重发验证邮件
const resendEmail = async () => {
  if (!email.value) {
    errorMessage.value = t('auth.emailVerification.errors.emailRequired')
    return
  }

  isResending.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.value
    })

    if (error) {
      errorMessage.value = error.message
    } else {
      successMessage.value = t('auth.emailVerification.emailResent')
      startCountdown()
    }
  } catch (error: any) {
    errorMessage.value = error.message || t('auth.emailVerification.errors.resendFailed')
  } finally {
    isResending.value = false
  }
}

// 检查验证状态
const checkVerification = async () => {
  isChecking.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      errorMessage.value = error.message
      return
    }

    if (session) {
      // 用户已验证并登录
      await userStore.fetchProfile()
      successMessage.value = t('auth.emailVerification.verificationSuccess')
      
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } else {
      errorMessage.value = t('auth.emailVerification.errors.notVerified')
    }
  } catch (error: any) {
    errorMessage.value = error.message || t('auth.emailVerification.errors.checkFailed')
  } finally {
    isChecking.value = false
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

// 尝试使用不同邮箱
const tryDifferentEmail = () => {
  router.push('/register')
}

// 联系支持
const contactSupport = () => {
  // 可以打开邮件客户端或跳转到支持页面
  const subject = encodeURIComponent('邮箱验证问题')
  const body = encodeURIComponent(`我在验证邮箱 ${email.value} 时遇到了问题，请协助处理。`)
  window.open(`mailto:support@example.com?subject=${subject}&body=${body}`)
}

// 监听认证状态变化
onMounted(() => {
  // 如果没有邮箱参数，跳转到注册页
  if (!email.value) {
    router.push('/register')
    return
  }

  // 监听认证状态变化
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      await userStore.fetchProfile()
      successMessage.value = t('auth.emailVerification.verificationSuccess')
      
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
  })

  // 清理订阅
  onUnmounted(() => {
    subscription.unsubscribe()
    if (countdownTimer) {
      clearInterval(countdownTimer)
    }
  })
})
</script>