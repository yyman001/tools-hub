<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">认证系统测试</h1>
      
      <!-- 当前状态 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">当前状态</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">认证模式</label>
            <p class="mt-1 text-lg font-mono" :class="authModeClass">
              {{ currentAuthMode.toUpperCase() }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">登录状态</label>
            <p class="mt-1 text-lg" :class="statusClass">
              {{ isAuthenticated ? '已登录' : '未登录' }}
            </p>
          </div>
          <div v-if="currentUser">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">用户邮箱</label>
            <p class="mt-1 text-lg">{{ currentUser.email }}</p>
          </div>
          <div v-if="tokenInfo">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Token状态</label>
            <p class="mt-1 text-lg" :class="tokenStatusClass">{{ tokenStatus }}</p>
          </div>
        </div>
      </div>

      <!-- 认证模式切换 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">认证模式切换</h2>
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <label class="flex items-center">
              <input
                v-model="selectedMode"
                type="radio"
                value="sdk"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500"
              >
              <span class="ml-2">SDK模式 (推荐)</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="selectedMode"
                type="radio"
                value="http"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500"
              >
              <span class="ml-2">HTTP模式</span>
            </label>
          </div>
          <button
            @click="switchAuthMode"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            切换到 {{ selectedMode.toUpperCase() }} 模式
          </button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">操作</h2>
        <div class="flex flex-wrap gap-4">
          <button
            @click="refreshUserProfile"
            :disabled="!isAuthenticated || isLoading"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {{ isLoading ? '加载中...' : '刷新用户信息' }}
          </button>
          
          <button
            @click="handleRefreshToken"
            :disabled="!isAuthenticated || isRefreshing"
            class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
          >
            {{ isRefreshing ? '刷新中...' : '手动刷新Token' }}
          </button>
          
          <button
            @click="handleLogout"
            :disabled="!isAuthenticated"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            登出
          </button>
          
          <button
            @click="toggleAuthMonitor"
            class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            {{ showAuthMonitor ? '隐藏' : '显示' }}认证监控器
          </button>
        </div>
      </div>

      <!-- Token详情 -->
      <div v-if="tokenInfo" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Token详情</h2>
        <div class="bg-gray-50 dark:bg-gray-700 rounded p-4">
          <pre class="text-sm overflow-x-auto">{{ JSON.stringify(tokenInfo, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { 
  isAuthenticated, 
  currentUser, 
  isLoading, 
  fetchUserProfile, 
  refreshToken, 
  logout 
} = useAuth()

const selectedMode = ref('sdk')
const isRefreshing = ref(false)
const tokenInfo = ref<any>(null)
const showAuthMonitor = ref(false)

const currentAuthMode = ref('sdk')

const authModeClass = computed(() => {
  return 'text-green-600 dark:text-green-400'
})

const statusClass = computed(() => {
  return isAuthenticated.value 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400'
})

const tokenStatus = computed(() => {
  if (!tokenInfo.value) return '无效'
  
  const now = Math.floor(Date.now() / 1000)
  const exp = tokenInfo.value.exp
  
  if (!exp) return '未知'
  if (exp < now) return '已过期'
  
  const timeLeft = exp - now
  if (timeLeft < 300) return '即将过期'
  
  return '有效'
})

const tokenStatusClass = computed(() => {
  const status = tokenStatus.value
  if (status === '有效') return 'text-green-600 dark:text-green-400'
  if (status === '即将过期') return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
})

// 解析token信息
const parseTokenInfo = () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      tokenInfo.value = null
      return
    }
    
    const payload = JSON.parse(atob(token.split('.')[1]))
    tokenInfo.value = payload
  } catch (error) {
    console.error('解析token失败:', error)
    tokenInfo.value = null
  }
}

// 切换认证模式（现在只支持SDK模式）
const switchAuthMode = () => {
  alert('当前版本只支持SDK模式，无需切换')
}

// 刷新用户信息
const refreshUserProfile = async () => {
  try {
    await fetchUserProfile()
    parseTokenInfo()
    alert('用户信息刷新成功')
  } catch (error) {
    console.error('刷新用户信息失败:', error)
    alert('刷新用户信息失败')
  }
}

// 手动刷新token
const handleRefreshToken = async () => {
  isRefreshing.value = true
  try {
    await refreshToken()
    parseTokenInfo()
    alert('Token刷新成功')
  } catch (error) {
    console.error('刷新token失败:', error)
    alert('刷新token失败')
  } finally {
    isRefreshing.value = false
  }
}

// 登出
const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (error) {
    console.error('登出失败:', error)
  }
}

// 切换认证监控器显示
const toggleAuthMonitor = () => {
  showAuthMonitor.value = !showAuthMonitor.value
  localStorage.setItem('show_auth_monitor', showAuthMonitor.value.toString())
  
  // 触发监控器显示/隐藏
  const event = new CustomEvent('toggle-auth-monitor', { 
    detail: { show: showAuthMonitor.value } 
  })
  window.dispatchEvent(event)
}

onMounted(() => {
  selectedMode.value = 'sdk'
  parseTokenInfo()
  showAuthMonitor.value = localStorage.getItem('show_auth_monitor') === 'true'
  
  // 监听token变化
  const interval = setInterval(parseTokenInfo, 5000)
  
  return () => clearInterval(interval)
})
</script>