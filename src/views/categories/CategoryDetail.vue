<template>
  <div class="bg-elevated min-h-screen">
    <!-- 简化的 Header 区域 -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div v-if="isLoading" class="text-center">
          <div class="text-white/80">{{ $t('common.loading') }}</div>
        </div>
        
        <div v-else-if="!category" class="text-center">
          <div class="text-white/80">{{ $t('categories.noCategories') }}</div>
        </div>
        
        <div v-else>
          <!-- 返回按钮 -->
          <button
            @click="$router.back()"
            class="mb-6 text-white/80 hover:text-white transition-colors flex items-center space-x-2"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>{{ $t('common.back') }}</span>
          </button>
          
          <!-- 分类信息 - 横向布局 -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-6">
              <div class="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl">
                {{ category.icon }}
              </div>
              
              <div class="text-left">
                <h1 class="text-2xl md:text-3xl font-bold mb-2">
                  {{ category.name }}
                </h1>
                <p class="text-white/90 text-sm md:text-base">
                  {{ category.description }}
                </p>
              </div>
            </div>
            
            <!-- 统计信息 - 右侧显示 -->
            <div class="hidden md:flex items-center space-x-6 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3">
              <div class="text-center">
                <div class="text-xl font-bold text-white">{{ category.toolCount }}</div>
                <div class="text-xs text-white/80">{{ $t('categories.toolsCount') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 工具列表区域 -->
    <div v-if="category" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 筛选和排序 -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-slate-100">{{ category.name }} {{ $t('nav.tools') }}</h2>
          <p class="text-muted mt-1">{{ $t('categories.discover') }} {{ category.toolCount }} {{ $t('categories.qualityTools') }}</p>
        </div>
        
        <div class="flex items-center space-x-4">
          <select 
            v-model="sortBy" 
            @change="handleSort"
            class="input-field min-w-0 w-auto"
          >
            <option value="createdAt">{{ $t('tools.sortBy.latest') }}</option>
            <option value="rating">{{ $t('tools.sortBy.rating') }}</option>
            <option value="viewCount">{{ $t('tools.sortBy.views') }}</option>
            <option value="likeCount">{{ $t('tools.sortBy.likes') }}</option>
          </select>
          
          <button
            @click="toggleView"
            class="p-2 nav-link border border-default rounded-lg hover-bg transition-colors"
          >
            <svg v-if="viewMode === 'grid'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- 工具列表 -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-flex items-center space-x-2 text-subtle">
          <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ $t('common.loading') }}</span>
        </div>
      </div>
      
      <div v-else-if="tools.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">📦</div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">{{ $t('tools.noTools') }}</h3>
        <p class="text-muted mb-6">{{ $t('categories.addFirstTool') }}</p>
        <router-link to="/add-tool" class="btn-primary">
          {{ $t('nav.addTool') }}
        </router-link>
      </div>
      
      <!-- 网格视图 -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="tool in tools"
          :key="tool.id"
          class="group card rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-default hover:border-primary-200 dark:hover:border-primary-600"
          @click="$router.push(`/tools/${tool.id}`)"
        >
          <div class="p-6">
            <div class="flex items-start space-x-4 mb-4">
              <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                🔧
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-lg text-gray-900 dark:text-slate-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                  {{ tool.name }}
                </h3>
                <p class="text-muted text-sm line-clamp-2 leading-relaxed">
                  {{ tool.description }}
                </p>
              </div>
            </div>
            
            <!-- 标签 -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in tool.tags.slice(0, 3)"
                :key="tag"
                class="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs rounded-full font-medium hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                {{ tag }}
              </span>
            </div>
            
            <!-- 统计信息 -->
            <div class="flex items-center justify-between pt-4 border-t border-light">
              <div class="flex items-center space-x-4 text-sm text-subtle">
                <div class="flex items-center space-x-1">
                  <span class="text-yellow-400">⭐</span>
                  <span>{{ tool.rating }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <span>👀</span>
                  <span>{{ tool.viewCount }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <span class="text-red-400">❤️</span>
                  <span>{{ tool.likeCount }}</span>
                </div>
              </div>
              <span class="text-xs text-subtle">{{ formatDate(tool.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 列表视图 -->
      <div v-else class="space-y-4">
        <div
          v-for="tool in tools"
          :key="tool.id"
          class="group card rounded-xl shadow-soft hover:shadow-md transition-all duration-300 cursor-pointer border border-default hover:border-primary-200 dark:hover:border-primary-600"
          @click="$router.push(`/tools/${tool.id}`)"
        >
          <div class="p-6">
            <div class="flex items-start space-x-6">
              <div class="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                🔧
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-3">
                  <h3 class="font-bold text-xl text-gray-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {{ tool.name }}
                  </h3>
                  <span class="text-sm text-subtle flex-shrink-0 ml-4">{{ formatDate(tool.createdAt) }}</span>
                </div>
                
                <p class="text-muted mb-4 leading-relaxed line-clamp-2">
                  {{ tool.description }}
                </p>
                
                <div class="flex items-center justify-between">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in tool.tags.slice(0, 4)"
                      :key="tag"
                      class="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs rounded-full font-medium"
                    >
                      {{ tag }}
                    </span>
                  </div>
                  
                  <div class="flex items-center space-x-6 text-sm text-subtle">
                    <div class="flex items-center space-x-1">
                      <span class="text-yellow-400">⭐</span>
                      <span>{{ tool.rating }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <span>👀</span>
                      <span>{{ tool.viewCount }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <span class="text-red-400">❤️</span>
                      <span>{{ tool.likeCount }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToolStore, useCategoryStore } from '@/stores'

const route = useRoute()
const toolStore = useToolStore()
const categoryStore = useCategoryStore()
const { t } = useI18n()

const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('createdAt')

const category = computed(() => categoryStore.currentCategory)
const tools = computed(() => toolStore.tools)
const isLoading = computed(() => toolStore.isLoading)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const toggleView = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const handleSort = () => {
  const categoryId = route.params.id as string
  toolStore.fetchTools({ 
    category: categoryId,
    sortBy: sortBy.value as any,
    sortOrder: 'desc'
  })
}

onMounted(() => {
  const categoryId = route.params.id as string
  categoryStore.fetchCategoryById(categoryId)
  toolStore.fetchTools({ category: categoryId })
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>