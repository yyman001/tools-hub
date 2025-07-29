<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-elevated min-h-screen">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-primary">{{ $t('tools.title') }}</h1>
        <router-link to="/add-tool" class="btn-primary">
          {{ $t('nav.addTool') }}
        </router-link>
      </div>

      <!-- 筛选和搜索 -->
      <div class="card mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            v-model="searchParams.keyword"
            type="text"
            :placeholder="$t('tools.searchTools')"
            class="input-field"
            @input="handleSearch"
          >
          
          <select v-model="searchParams.category" class="input-field" @change="handleSearch">
            <option value="">{{ $t('tools.allCategories') }}</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          
          <select v-model="searchParams.sortBy" class="input-field" @change="handleSearch">
            <option value="createdAt">{{ $t('tools.sortBy.latest') }}</option>
            <option value="rating">{{ $t('tools.sortBy.rating') }}</option>
            <option value="viewCount">{{ $t('tools.sortBy.views') }}</option>
            <option value="likeCount">{{ $t('tools.sortBy.likes') }}</option>
          </select>
          
          <select v-model="searchParams.sortOrder" class="input-field" @change="handleSearch">
            <option value="desc">{{ $t('tools.sortOrder.desc') }}</option>
            <option value="asc">{{ $t('tools.sortOrder.asc') }}</option>
          </select>
        </div>
      </div>

      <!-- 工具列表 -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="text-subtle">{{ $t('common.loading') }}</div>
      </div>
      
      <div v-else-if="tools.length === 0" class="text-center py-12">
        <div class="text-subtle">{{ $t('tools.noTools') }}</div>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="tool in tools"
          :key="tool.id"
          class="card hover:shadow-md hover-bg transition-all duration-200 cursor-pointer"
          @click="$router.push(`/tools/${tool.id}`)"
        >
          <div class="flex items-start space-x-4">
            <div class="w-16 h-16 bg-gray-200 dark:bg-elevated rounded-lg flex items-center justify-center">
              🔧
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-lg mb-2 text-gray-900 dark:text-primary">{{ tool.name }}</h3>
              <p class="text-muted text-sm mb-3 line-clamp-2">{{ tool.description }}</p>
              
              <div class="flex flex-wrap gap-1 mb-3">
                <span
                  v-for="tag in tool.tags.slice(0, 3)"
                  :key="tag"
                  class="px-2 py-1 bg-gray-100 dark:bg-elevated text-gray-600 dark:text-muted text-xs rounded"
                >
                  {{ tag }}
                </span>
              </div>
              
              <div class="flex items-center justify-between text-sm text-subtle">
                <div class="flex items-center space-x-4">
                  <span>⭐ {{ tool.rating }}</span>
                  <span>👀 {{ tool.viewCount }}</span>
                  <span>❤️ {{ tool.likeCount }}</span>
                </div>
                <span>{{ formatDate(tool.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="flex justify-center mt-12">
        <div class="flex space-x-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-4 py-2 rounded-lg transition-colors',
              page === currentPage
                ? 'bg-primary-600 dark:bg-dark-accent-blue text-white'
                : 'bg-surface text-gray-600 dark:text-muted hover-bg border border-default'
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToolStore, useCategoryStore } from '@/stores'
import type { SearchParams } from '@/types'

const toolStore = useToolStore()
const categoryStore = useCategoryStore()
const { t } = useI18n()

const searchParams = ref<SearchParams>({
  keyword: '',
  category: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  pageSize: 12
})

const tools = computed(() => toolStore.tools)
const isLoading = computed(() => toolStore.isLoading)
const currentPage = computed(() => toolStore.currentPage)
const total = computed(() => toolStore.total)
const categories = computed(() => categoryStore.categories)

const totalPages = computed(() => Math.ceil(total.value / (searchParams.value.pageSize || 12)))

const handleSearch = () => {
  searchParams.value.page = 1
  toolStore.fetchTools(searchParams.value)
}

const goToPage = (page: number) => {
  searchParams.value.page = page
  toolStore.fetchTools(searchParams.value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

onMounted(() => {
  toolStore.fetchTools(searchParams.value)
  categoryStore.fetchCategories()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>