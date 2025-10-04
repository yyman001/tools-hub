<template>
  <div id="app" class="min-h-screen bg-elevated flex flex-col">
    <AppHeader />
    <main class="flex-1">
      <router-view />
    </main>
    <AppFooter />
    <NetworkStatus />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import NetworkStatus from '@/components/NetworkStatus.vue'
import { useAuth } from '@/composables/useAuth'

const { initAuth } = useAuth()

onMounted(async () => {
  await initAuth()
})
</script>