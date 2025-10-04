<template>
  <div v-if="showStatus" class="fixed top-4 right-4 z-50">
    <div 
      :class="[
        'px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-all duration-300',
        statusClass
      ]"
    >
      <div class="flex items-center space-x-2">
        <div :class="['w-2 h-2 rounded-full', dotClass]"></div>
        <span>{{ statusText }}</span>
        <button 
          v-if="!isConnected" 
          @click="retryConnection"
          class="ml-2 text-xs underline hover:no-underline"
        >
          重试
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { checkSupabaseConnection } from '@/lib/supabase'

const isConnected = ref(true)
const isChecking = ref(false)
const showStatus = ref(false)

const statusClass = computed(() => {
  if (isChecking.value) return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
  if (isConnected.value) return 'bg-green-100 text-green-800 border border-green-200'
  return 'bg-red-100 text-red-800 border border-red-200'
})

const dotClass = computed(() => {
  if (isChecking.value) return 'bg-yellow-500 animate-pulse'
  if (isConnected.value) return 'bg-green-500'
  return 'bg-red-500 animate-pulse'
})

const statusText = computed(() => {
  if (isChecking.value) return '检查连接中...'
  if (isConnected.value) return '连接正常'
  return '连接失败'
})

const checkConnection = async () => {
  isChecking.value = true
  showStatus.value = true
  
  try {
    const connected = await checkSupabaseConnection()
    isConnected.value = connected
    
    // 如果连接正常，3秒后隐藏状态
    if (connected) {
      setTimeout(() => {
        showStatus.value = false
      }, 3000)
    }
  } catch (error) {
    console.error('连接检查失败:', error)
    isConnected.value = false
  } finally {
    isChecking.value = false
  }
}

const retryConnection = () => {
  checkConnection()
}

onMounted(() => {
  checkConnection()
})
</script>