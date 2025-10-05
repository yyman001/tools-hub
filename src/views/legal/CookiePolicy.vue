<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ $t('legal.cookiePolicy.title') }}</h1>
        <p class="text-gray-600 dark:text-gray-400">{{ $t('legal.cookiePolicy.lastUpdated') }}: 2024年1月1日</p>
      </div>

      <div class="prose prose-gray dark:prose-invert max-w-none">
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{{ $t('legal.cookiePolicy.whatAreCookies') }}</h2>
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            {{ $t('legal.cookiePolicy.cookiesDescription') }}
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{{ $t('legal.cookiePolicy.howWeUseCookies') }}</h2>
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ $t('legal.cookiePolicy.essentialCookies') }}</h3>
              <p class="text-gray-700 dark:text-gray-300">{{ $t('legal.cookiePolicy.essentialDescription') }}</p>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ $t('legal.cookiePolicy.functionalCookies') }}</h3>
              <p class="text-gray-700 dark:text-gray-300">{{ $t('legal.cookiePolicy.functionalDescription') }}</p>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ $t('legal.cookiePolicy.analyticsCookies') }}</h3>
              <p class="text-gray-700 dark:text-gray-300">{{ $t('legal.cookiePolicy.analyticsDescription') }}</p>
            </div>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{{ $t('legal.cookiePolicy.manageCookies') }}</h2>
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            {{ $t('legal.cookiePolicy.manageDescription') }}
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{{ $t('legal.cookiePolicy.contact') }}</h2>
          <p class="text-gray-700 dark:text-gray-300">
            {{ $t('legal.cookiePolicy.contactDescription') }}
          </p>
        </section>
      </div>

      <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <router-link to="/" class="text-blue-600 dark:text-blue-400 hover:underline">
          ← {{ $t('common.back') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>