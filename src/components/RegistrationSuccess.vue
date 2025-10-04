<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" v-if="show">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
      <!-- 成功图标 -->
      <div class="text-center mb-4">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30">
          <svg class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      
      <!-- 标题和消息 -->
      <div class="text-center mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
          {{ title }}
        </h3>
        <p class="text-muted">
          {{ message }}
        </p>
      </div>
      
      <!-- 操作按钮 -->
      <div class="flex space-x-3">
        <button
          v-if="showVerificationButton"
          @click="goToVerification"
          class="flex-1 btn-primary"
        >
          {{ $t('auth.emailVerification.title') }}
        </button>
        <button
          @click="close"
          class="flex-1 btn-secondary"
        >
          {{ closeButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

interface Props {
  show: boolean
  title: string
  message: string
  needsVerification?: boolean
  email?: string
}

const props = withDefaults(defineProps<Props>(), {
  needsVerification: false,
  email: ''
})

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const { t } = useI18n()

const showVerificationButton = computed(() => props.needsVerification && props.email)

const closeButtonText = computed(() => {
  return props.needsVerification ? t('common.cancel') : t('common.confirm')
})

const goToVerification = () => {
  router.push({
    name: 'EmailVerification',
    query: { email: props.email }
  })
  emit('close')
}

const close = () => {
  emit('close')
  if (!props.needsVerification) {
    router.push('/')
  }
}
</script>