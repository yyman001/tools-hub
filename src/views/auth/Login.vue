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
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-slate-300">
              {{ $t('auth.email') }}
            </label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              required
              class="input-field mt-1"
              :placeholder="$t('auth.email')"
            >
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-slate-300">
              {{ $t('auth.password') }}
            </label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="input-field mt-1"
              :placeholder="$t('auth.password')"
            >
          </div>
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
            {{ isLoading ? $t('auth.loggingIn') : $t('auth.loginButton') }}
          </button>
        </div>
        
        <div class="text-center text-sm text-muted">
          <p>{{ $t('auth.testAccount') }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const form = ref({
  email: '',
  password: ''
})

const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  if (!form.value.email || !form.value.password) {
    errorMessage.value = t('auth.errors.required')
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  const result = await userStore.login(form.value.email, form.value.password)
  
  if (result.success) {
    router.push('/')
  } else {
    errorMessage.value = result.message || t('auth.errors.loginFailed')
  }
  
  isLoading.value = false
}
</script>