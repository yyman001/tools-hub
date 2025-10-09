<template>
  <div class="min-h-[calc(100vh-4rem)] bg-elevated py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
          认证组件演示
        </h1>
        <p class="text-lg text-muted">
          展示改进的登录、注册和密码重置功能
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 邮箱输入组件演示 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-4">
            智能邮箱输入
          </h2>
          <p class="text-muted mb-6">
            自动提示主流邮箱后缀，支持键盘导航和Tab自动完成
          </p>
          
          <div class="space-y-4">
            <EmailInput
              v-model="demoEmail"
              label="邮箱地址"
              placeholder="输入用户名，自动提示邮箱后缀"
            />
            
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 class="font-medium text-gray-900 dark:text-slate-100 mb-2">功能特点：</h3>
              <ul class="text-sm text-muted space-y-1">
                <li>• 谷歌邮箱优先显示</li>
                <li>• 支持方向键选择</li>
                <li>• Tab键快速完成</li>
                <li>• 包含主流邮箱后缀</li>
              </ul>
            </div>
            
            <div class="text-sm text-gray-600 dark:text-gray-400">
              当前值: <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{{ demoEmail }}</code>
            </div>
          </div>
        </div>

        <!-- 密码输入组件演示 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-4">
            智能密码输入
          </h2>
          <p class="text-muted mb-6">
            支持显示/隐藏密码，实时强度检测
          </p>
          
          <div class="space-y-4">
            <PasswordInput
              v-model="demoPassword"
              label="密码"
              placeholder="输入密码查看强度指示"
              :show-strength-indicator="true"
            />
            
            <PasswordInput
              v-model="demoConfirmPassword"
              label="确认密码"
              placeholder="再次输入密码"
            />
            
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 class="font-medium text-gray-900 dark:text-slate-100 mb-2">功能特点：</h3>
              <ul class="text-sm text-muted space-y-1">
                <li>• 一键显示/隐藏密码</li>
                <li>• 实时强度检测</li>
                <li>• 视觉强度指示器</li>
                <li>• 支持自动完成属性</li>
              </ul>
            </div>
            
            <div class="text-sm text-gray-600 dark:text-gray-400">
              密码匹配: 
              <span :class="passwordsMatch ? 'text-green-600' : 'text-red-600'">
                {{ passwordsMatch ? '✓ 匹配' : '✗ 不匹配' }}
              </span>
            </div>
          </div>
        </div>

        <!-- 记住密码功能演示 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-4">
            记住密码功能
          </h2>
          <p class="text-muted mb-6">
            安全地保存和恢复用户凭据
          </p>
          
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <input
                id="demo-remember"
                v-model="demoRemember"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              />
              <label for="demo-remember" class="text-sm text-gray-700 dark:text-slate-300">
                记住我的登录信息
              </label>
            </div>
            
            <div class="flex space-x-3">
              <button
                @click="saveDemo"
                class="btn-primary text-sm px-4 py-2"
                :disabled="!demoEmail || !demoPassword"
              >
                保存凭据
              </button>
              
              <button
                @click="loadDemo"
                class="btn-secondary text-sm px-4 py-2"
              >
                加载凭据
              </button>
              
              <button
                @click="clearDemo"
                class="btn-secondary text-sm px-4 py-2"
              >
                清除凭据
              </button>
            </div>
            
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 class="font-medium text-gray-900 dark:text-slate-100 mb-2">安全特性：</h3>
              <ul class="text-sm text-muted space-y-1">
                <li>• 密码经过Base64编码存储</li>
                <li>• 支持清除保存的凭据</li>
                <li>• 自动填充已保存的信息</li>
                <li>• 错误处理和数据验证</li>
              </ul>
            </div>
            
            <div class="text-sm text-gray-600 dark:text-gray-400">
              状态: 
              <span :class="hasSaved ? 'text-green-600' : 'text-gray-500'">
                {{ hasSaved ? '已保存凭据' : '无保存凭据' }}
              </span>
            </div>
          </div>
        </div>

        <!-- 第三方登录演示 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-4">
            第三方登录
          </h2>
          <p class="text-muted mb-6">
            支持 Google 和 GitHub 第三方登录
          </p>
          
          <div class="space-y-4">
            <SocialLogin />
            
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 class="font-medium text-gray-900 dark:text-slate-100 mb-2">功能特点：</h3>
              <ul class="text-sm text-muted space-y-1">
                <li>• 支持 Google OAuth 登录</li>
                <li>• 支持 GitHub OAuth 登录</li>
                <li>• 自动获取用户头像和基本信息</li>
                <li>• 安全的 OAuth 2.0 流程</li>
                <li>• 与 Supabase 深度集成</li>
                <li>• 支持回调处理和错误处理</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 完整登录表单演示 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-4">
            完整登录表单
          </h2>
          <p class="text-muted mb-6">
            集成所有新功能的登录表单演示
          </p>
          
          <form @submit.prevent="handleDemoLogin" class="space-y-4">
            <EmailInput
              v-model="loginForm.email"
              label="邮箱地址"
              placeholder="请输入邮箱地址"
            />
            
            <PasswordInput
              v-model="loginForm.password"
              label="密码"
              placeholder="请输入密码"
            />
            
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="login-remember"
                  v-model="loginForm.remember"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                />
                <label for="login-remember" class="ml-2 block text-sm text-gray-700 dark:text-slate-300">
                  记住密码
                </label>
              </div>
              
              <router-link
                to="/forgot-password"
                class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
              >
                忘记密码？
              </router-link>
            </div>
            
            <button
              type="submit"
              class="w-full btn-primary"
              :disabled="!loginForm.email || !loginForm.password"
            >
              登录演示
            </button>
            
            <div v-if="loginMessage" class="text-center text-sm text-green-600 dark:text-green-400">
              {{ loginMessage }}
            </div>
          </form>
        </div>
      </div>
      
      <!-- 返回按钮 -->
      <div class="text-center mt-12">
        <router-link
          to="/"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30"
        >
          ← 返回首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRememberPassword } from '@/composables/useRememberPassword'
import EmailInput from '@/components/EmailInput.vue'
import PasswordInput from '@/components/PasswordInput.vue'
import SocialLogin from '@/components/SocialLogin.vue'

const { saveCredentials, initializeCredentials, clearSavedCredentials, hasSavedCredentials } = useRememberPassword()

// 演示数据
const demoEmail = ref('')
const demoPassword = ref('')
const demoConfirmPassword = ref('')
const demoRemember = ref(false)
const hasSaved = ref(false)

// 登录表单演示
const loginForm = ref({
  email: '',
  password: '',
  remember: false
})

const loginMessage = ref('')

// 计算属性
const passwordsMatch = computed(() => {
  if (!demoPassword.value || !demoConfirmPassword.value) return false
  return demoPassword.value === demoConfirmPassword.value
})

// 方法
const saveDemo = () => {
  if (demoEmail.value && demoPassword.value) {
    saveCredentials(demoEmail.value, demoPassword.value, demoRemember.value)
    hasSaved.value = true
    alert('凭据已保存到本地存储')
  }
}

const loadDemo = () => {
  const saved = initializeCredentials()
  if (saved.email && saved.password) {
    demoEmail.value = saved.email
    demoPassword.value = saved.password
    demoRemember.value = saved.rememberPassword
    hasSaved.value = true
    alert('凭据已从本地存储加载')
  } else {
    alert('没有找到保存的凭据')
  }
}

const clearDemo = () => {
  clearSavedCredentials()
  hasSaved.value = false
  alert('已清除保存的凭据')
}

const handleDemoLogin = () => {
  loginMessage.value = `登录演示成功！邮箱: ${loginForm.value.email}, 记住密码: ${loginForm.value.remember ? '是' : '否'}`
  
  if (loginForm.value.remember) {
    saveCredentials(loginForm.value.email, loginForm.value.password, true)
  }
  
  setTimeout(() => {
    loginMessage.value = ''
  }, 3000)
}

// 初始化
onMounted(() => {
  hasSaved.value = hasSavedCredentials()
  
  // 加载保存的凭据到登录表单
  const saved = initializeCredentials()
  if (saved.email && saved.password) {
    loginForm.value.email = saved.email
    loginForm.value.password = saved.password
    loginForm.value.remember = saved.rememberPassword
  }
})
</script>