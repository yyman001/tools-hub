<template>
  <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
    <div class="flex">
      <svg class="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
      </svg>
      <div class="flex-1">
        <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          GitHub 邮箱需要验证
        </h3>
        <div class="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
          <p>您的 GitHub 账户邮箱尚未验证，无法完成登录。请按以下步骤操作：</p>
          
          <ol class="list-decimal list-inside space-y-1 ml-2">
            <li>前往 <a href="https://github.com/settings/emails" target="_blank" class="underline hover:no-underline">GitHub 邮箱设置</a></li>
            <li>找到您的主邮箱地址</li>
            <li>点击 "Resend verification email" 重新发送验证邮件</li>
            <li>检查邮箱并点击验证链接</li>
            <li>验证完成后，返回此页面重新登录</li>
          </ol>
          
          <div class="mt-4 flex space-x-3">
            <button
              @click="retryLogin"
              class="text-sm bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded hover:bg-yellow-200 dark:hover:bg-yellow-900/70 transition-colors"
            >
              重新尝试登录
            </button>
            
            <a
              href="https://github.com/settings/emails"
              target="_blank"
              class="text-sm bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded hover:bg-yellow-200 dark:hover:bg-yellow-900/70 transition-colors inline-block"
            >
              前往 GitHub 设置
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const emit = defineEmits<{
  retry: []
}>()

const retryLogin = () => {
  emit('retry')
}
</script>