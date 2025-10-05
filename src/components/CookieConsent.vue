<template>
  <Teleport to="body">
    <div
      v-if="showConsent"
      class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg"
    >
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex-1">
            <p class="text-sm text-gray-700 dark:text-gray-300">
              {{ $t('cookie.consent.message') }}
              <router-link to="/cookie-policy" class="text-blue-600 dark:text-blue-400 hover:underline">
                {{ $t('cookie.consent.learnMore') }}
              </router-link>
            </p>
          </div>
          
          <div class="flex gap-3">
            <button
              @click="acceptEssential"
              class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {{ $t('cookie.consent.essentialOnly') }}
            </button>
            <button
              @click="acceptAll"
              class="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {{ $t('cookie.consent.acceptAll') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const showConsent = ref(false)

const COOKIE_CONSENT_KEY = 'cookie-consent'

onMounted(() => {
  // 检查用户是否已经做出选择
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
  if (!consent) {
    // 延迟显示，避免影响页面加载
    setTimeout(() => {
      showConsent.value = true
    }, 1000)
  }
})

const acceptAll = () => {
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
    essential: true,
    functional: true,
    analytics: true,
    timestamp: Date.now()
  }))
  showConsent.value = false
  
  // 这里可以初始化分析工具等
  initializeAnalytics()
}

const acceptEssential = () => {
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
    essential: true,
    functional: false,
    analytics: false,
    timestamp: Date.now()
  }))
  showConsent.value = false
}

const initializeAnalytics = () => {
  // 初始化 Google Analytics 或其他分析工具
  console.log('Analytics initialized')
}

// 导出方法供其他组件使用
defineExpose({
  showConsent: () => {
    showConsent.value = true
  },
  getConsent: () => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    return consent ? JSON.parse(consent) : null
  }
})
</script>