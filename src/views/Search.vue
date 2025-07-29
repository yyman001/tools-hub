<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-primary">{{ $t('search.title') }}</h1>
        <p class="text-gray-600 dark:text-secondary">
          {{ $t('search.searchFor') }} "{{ searchKeyword }}" {{ $t('search.resultsFound') }} {{ searchResults.total }} {{ $t('search.results') }}
        </p>
      </div>
      
      <!-- 搜索框 -->
      <div class="card mb-8">
        <div class="flex space-x-4">
          <input
            v-model="searchKeyword"
            @keyup.enter="handleSearch"
            type="text"
            :placeholder="$t('home.searchPlaceholder')"
            class="input-field flex-1"
          >
          <button @click="handleSearch" class="btn-primary">
            {{ $t('common.search') }}
          </button>
        </div>
      </div>
      
      <!-- 搜索结果 -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="text-gray-500 dark:text-muted">{{ $t('search.searching') }}</div>
      </div>
      
      <div v-else-if="searchResults.total === 0" class="text-center py-12">
        <div class="text-gray-500 dark:text-muted">{{ $t('search.noResults') }}</div>
      </div>
      
      <div v-else>
        <!-- 工具结果 -->
        <div v-if="searchResults.tools.length > 0" class="mb-12">
          <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-primary">{{ $t('search.toolResults') }} ({{ searchResults.tools.length }})</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="tool in searchResults.tools"
              :key="tool.id"
              class="card hover:shadow-md transition-shadow cursor-pointer"
              @click="$router.push(`/tools/${tool.id}`)"
            >
              <div class="flex items-start space-x-4">
                <div class="w-16 h-16 bg-gray-200 dark:bg-elevated rounded-lg flex items-center justify-center">
                  🔧
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-lg mb-2 text-gray-900 dark:text-primary">{{ tool.name }}</h3>
                  <p class="text-gray-600 dark:text-secondary text-sm mb-3 line-clamp-2">{{ tool.description }}</p>
                  
                  <div class="flex flex-wrap gap-1 mb-3">
                    <span
                      v-for="tag in tool.tags.slice(0, 3)"
                      :key="tag"
                      class="px-2 py-1 bg-gray-100 dark:bg-elevated text-gray-600 dark:text-muted text-xs rounded"
                    >
                      {{ tag }}
                    </span>
                  </div>
                  
                  <div class="flex items-center justify-between text-sm text-gray-500 dark:text-muted">
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
        </div>
        
        <!-- 文章结果 -->
        <div v-if="searchResults.articles.length > 0">
          <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-primary">{{ $t('search.articleResults') }} ({{ searchResults.articles.length }})</h2>
          <div class="space-y-4">
            <div
              v-for="article in searchResults.articles"
              :key="article.id"
              class="card hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 class="font-semibold text-lg mb-2 text-gray-900 dark:text-primary">{{ article.title }}</h3>
              <p class="text-gray-600 dark:text-secondary mb-4">{{ article.summary }}</p>
              <div class="flex items-center justify-between text-sm text-gray-500 dark:text-muted">
                <span>{{ article.author.username }}</span>
                <span>{{ formatDate(article.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ApiService from '@/api'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const searchKeyword = ref('')
const isLoading = ref(false)
const searchResults = ref({
  tools: [],
  articles: [],
  total: 0
})

const handleSearch = async () => {
  if (!searchKeyword.value.trim()) return
  
  // 更新URL
  router.push(`/search?q=${encodeURIComponent(searchKeyword.value)}`)
  
  isLoading.value = true
  try {
    const response = await ApiService.search(searchKeyword.value)
    if (response.code === 200) {
      searchResults.value = response.data
    }
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

onMounted(() => {
  const query = route.query.q as string
  if (query) {
    searchKeyword.value = query
    handleSearch()
  }
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