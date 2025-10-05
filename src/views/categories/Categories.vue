<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-elevated min-h-screen">
      <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-primary">{{ $t('categories.title') }}</h1>
      
      <div v-if="isLoading" class="text-center py-12">
        <div class="text-subtle">{{ $t('common.loading') }}</div>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="category in categories"
          :key="category.id"
          class="card hover:shadow-md hover-bg transition-all duration-200 cursor-pointer"
          @click="$router.push(`/categories/${category.id}`)"
        >
          <div class="text-center">
            <div class="text-6xl mb-4">{{ category.icon }}</div>
            <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-primary">{{ category.name }}</h3>
            <p class="text-muted mb-4">{{ category.description }}</p>
            <div class="text-sm text-subtle">
              {{ $t('categories.discover') }}
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCategoryStore } from '@/stores'

const categoryStore = useCategoryStore()
const { t } = useI18n()

const categories = computed(() => categoryStore.categories)
const isLoading = computed(() => categoryStore.isLoading)

onMounted(() => {
  categoryStore.fetchCategories()
})
</script>