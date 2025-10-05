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

      <!-- 认证模式显示 -->
      <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <p class="text-sm font-medium text-green-800 dark:text-green-200">
              使用 SDK 模式登录
            </p>
            <p class="text-xs text-green-700 dark:text-green-300">
              自动管理会话，保持登录状态稳定
            </p>
          </div>
        </div>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <!-- 邮箱输入组件 -->
          <EmailInput
            v-model="form.email"
            :label="$t('auth.email')"
            name="email"
            input-id="email"
            :placeholder="$t('auth.email')"
          />

          <!-- 密码输入组件 -->
          <PasswordInput
            v-model="form.password"
            :label="$t('auth.password')"
            name="password"
            input-id="password"
            :placeholder="$t('auth.password')"
            autocomplete="current-password"
          />
        </div>

        <!-- 记住密码选项 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-password"
              v-model="rememberPassword"
              name="remember-password"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            />
            <label
              for="remember-password"
              class="ml-2 block text-sm text-gray-700 dark:text-slate-300 pointer"
            >
              {{ $t("auth.rememberPassword") }}
            </label>
          </div>
          
          <router-link
            to="/forgot-password"
            class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
          >
            {{ $t("auth.forgotPasswordLink") }}
          </router-link>
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
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </div>
        
        <!-- 调试按钮 -->
        <div class="text-center">
          <button
            type="button"
            @click="debugLogin"
            class="text-xs text-gray-500 hover:text-gray-700"
          >
            [调试] 直接设置登录状态
          </button>
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
import { useRememberPassword } from '@/composables/useRememberPassword'
import EmailInput from '@/components/EmailInput.vue'
import PasswordInput from '@/components/PasswordInput.vue'

const router = useRouter()
const { t } = useI18n()
const { login, isLoading: authLoading } = useAuth()
const { rememberPassword, saveCredentials, initializeCredentials } = useRememberPassword()

const form = ref({
  email: '',
  password: ''
})

const errorMessage = ref('')
const isLoading = computed(() => authLoading.value)

// 初始化时加载保存的凭据
onMounted(() => {
  const savedData = initializeCredentials()
  if (savedData.email && savedData.password) {
    form.value.email = savedData.email
    form.value.password = savedData.password
    rememberPassword.value = savedData.rememberPassword
  }
})
const handleLogin = async () => {
  if (!form.value.email || !form.value.password) {
    errorMessage.value = '请输入邮箱和密码'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    console.log('开始登录...')
    
    const result = await login(form.value.email, form.value.password)
    
    if (result.success) {
      console.log('登录成功')
      
      // 登录成功，保存凭据（如果用户选择记住密码）
      saveCredentials(form.value.email, form.value.password, rememberPassword.value)
      
      // 跳转
      const redirect = router.currentRoute.value.query.redirect as string
      await router.push(redirect || '/')
    } else {
      errorMessage.value = result.message || '登录失败，请重试'
    }
    
  } catch (error: any) {
    console.error('登录失败:', error)
    errorMessage.value = error.message || '登录失败，请重试'
  }
}

// 调试方法
const debugLogin = () => {
  // 直接设置登录状态用于测试
  userStore.token = 'debug-token'
  localStorage.setItem('token', 'debug-token')
  
  userStore.user = {
    id: 'debug-id',
    username: '测试用户',
    email: 'test@example.com',
    avatar: '',
    createdAt: new Date().toISOString(),
    toolCount: 0,
    favoriteCount: 0
  }
  
  console.log('调试登录状态设置完成:', {
    isLoggedIn: userStore.isLoggedIn,
    user: userStore.user,
    token: userStore.token
  })
  
  // 跳转到首页
  router.push('/')
}
</script>