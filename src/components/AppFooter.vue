<template>
  <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-4">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center text-sm text-gray-600 dark:text-gray-400">
        <!-- 版权信息 -->
        <div class="mb-2">
          <p>&copy; 2024 Tool Hub. {{ $t('footer.copyright') }}</p>
        </div>
        
        <!-- 法律链接 -->
        <div class="flex justify-center space-x-4">
          <router-link to="/cookie-policy" class="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
            {{ $t('footer.cookie') }}
          </router-link>
          <router-link to="/disclaimer" class="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
            {{ $t('footer.disclaimer') }}
          </router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>