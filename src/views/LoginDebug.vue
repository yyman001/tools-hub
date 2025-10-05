<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">登录状态调试</h1>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">实时状态</h2>
        <div class="space-y-2 text-sm font-mono">
          <div>useAuth.isLoading: {{ authIsLoading }}</div>
          <div>useAuth.isAuthenticated: {{ authIsAuthenticated }}</div>
          <div>useAuth.currentUser: {{ authCurrentUser?.email || 'null' }}</div>
          <div>userStore.isLoading: {{ userStoreIsLoading }}</div>
          <div>userStore.isLoggedIn: {{ userStoreIsLoggedIn }}</div>
          <div>userStore.user: {{ userStoreUser?.email || 'null' }}</div>
          <div>userStore.token: {{ userStoreToken ? '有token' : '无token' }}</div>
          <div>localStorage.token: {{ localStorageToken ? '有token' : '无token' }}</div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">操作</h2>
        <div class="space-x-4">
          <button 
            @click="refreshStatus"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            刷新状态
          </button>
          <button 
            @click="clearAll"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            清除所有状态
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useUserStore } from '@/stores'

const { isLoading: authIsLoading, isAuthenticated: authIsAuthenticated, currentUser: authCurrentUser } = useAuth()
const userStore = useUserStore()

const localStorageToken = ref('')

const userStoreIsLoading = computed(() => userStore.isLoading)
const userStoreIsLoggedIn = computed(() => userStore.isLoggedIn)
const userStoreUser = computed(() => userStore.user)
const userStoreToken = computed(() => userStore.token)

const refreshStatus = () => {
  localStorageToken.value = localStorage.getItem('token') || ''
  console.log('🔄 状态刷新:', {
    authIsLoading: authIsLoading.value,
    authIsAuthenticated: authIsAuthenticated.value,
    authCurrentUser: authCurrentUser.value,
    userStoreIsLoading: userStoreIsLoading.value,
    userStoreIsLoggedIn: userStoreIsLoggedIn.value,
    userStoreUser: userStoreUser.value,
    userStoreToken: userStoreToken.value,
    localStorageToken: localStorageToken.value
  })
}

const clearAll = () => {
  userStore.user = null
  userStore.token = null
  localStorage.removeItem('token')
  localStorage.removeItem('refresh_token')
  refreshStatus()
}

let interval: NodeJS.Timeout

onMounted(() => {
  refreshStatus()
  // 每秒刷新一次状态
  interval = setInterval(refreshStatus, 1000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>