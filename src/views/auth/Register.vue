<template>
  <div class="min-h-[calc(100vh-4rem)] bg-elevated flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-slate-100">
          {{ $t('auth.register') }}
        </h2>
        <p class="mt-2 text-center text-sm text-muted">
          {{ $t('auth.registerPrompt') }}
          <router-link to="/login" class="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
            {{ $t('auth.loginNow') }}
          </router-link>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-slate-300">
              {{ $t('auth.username') }}
            </label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              required
              class="input-field mt-1"
              :placeholder="$t('auth.username')"
            >
          </div>
          
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
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-slate-300">
              {{ $t('auth.confirmPassword') }}
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="input-field mt-1"
              :placeholder="$t('auth.confirmPassword')"
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
            {{ isLoading ? $t('auth.registering') : $t('auth.registerButton') }}
          </button>
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
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errorMessage = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  if (!form.value.username || !form.value.email || !form.value.password) {
    errorMessage.value = t('auth.errors.required')
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = t('auth.errors.passwordMismatch')
    return
  }

  if (form.value.password.length < 6) {
    errorMessage.value = t('auth.errors.passwordTooShort')
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  const result = await userStore.register(
    form.value.username,
    form.value.email,
    form.value.password
  )
  
  if (result.success) {
    router.push('/')
  } else {
    errorMessage.value = result.message || t('auth.errors.registerFailed')
  }
  
  isLoading.value = false
}
</script>