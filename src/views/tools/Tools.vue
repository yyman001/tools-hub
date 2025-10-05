<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- 简化的顶部栏 -->
    <div class="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-medium text-gray-900 dark:text-white">{{ $t('tools.title') }}</h1>
          <router-link to="/add-tool" class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
            {{ $t('nav.addTool') }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- 主内容 -->
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex gap-4">
        <!-- 左侧分类 -->
        <div class="w-64 flex-shrink-0">
          <!-- 搜索 -->
          <input
            v-model="searchParams.keyword"
            type="text"
            :placeholder="$t('tools.searchTools')"
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-3"
            @input="handleSearch"
          >
          
          <!-- 排序 -->
          <div class="flex gap-2 mb-4">
            <select v-model="searchParams.sortBy" class="flex-1 px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white" @change="handleSearch">
              <option value="createdAt">{{ $t('tools.sortBy.latest') }}</option>
              <option value="rating">{{ $t('tools.sortBy.rating') }}</option>
              <option value="viewCount">{{ $t('tools.sortBy.views') }}</option>
              <option value="likeCount">{{ $t('tools.sortBy.likes') }}</option>
            </select>
            <select v-model="searchParams.sortOrder" class="px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white" @change="handleSearch">
              <option value="desc">↓</option>
              <option value="asc">↑</option>
            </select>
          </div>

          <!-- 分类列表 -->
          <div class="space-y-1">
            <!-- 全部 -->
            <div
              @click="selectCategory(null)"
              :class="[
                'px-3 py-2 text-sm cursor-pointer rounded',
                selectedCategoryId === null
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              ]"
            >
              <div class="flex justify-between items-center">
                <span>{{ $t('tools.allCategories') }}</span>
                <span class="text-xs text-gray-500">{{ totalToolsCount }}</span>
              </div>
            </div>
            
            <!-- 分类树 -->
            <div v-for="category in categoryTree" :key="category.id">
              <!-- 一级分类 -->
              <div
                @click="toggleCategory(category.id)"
                :class="[
                  'px-3 py-2 text-sm cursor-pointer rounded flex justify-between items-center',
                  selectedCategoryId === category.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                ]"
              >
                <div class="flex items-center gap-2">
                  <span
                    v-if="category.children && category.children.length > 0"
                    :class="[
                      'text-xs transition-transform',
                      expandedCategories.has(category.id) ? 'rotate-90' : ''
                    ]"
                  >
                    ▶
                  </span>
                  <span v-else class="w-3"></span>
                  <span>{{ getCategoryName(category) }}</span>
                </div>
                <span class="text-xs text-gray-500">{{ category.toolCount || 0 }}</span>
              </div>
              
              <!-- 二级分类 -->
              <div
                v-if="category.children && category.children.length > 0 && expandedCategories.has(category.id)"
                class="ml-4 space-y-1 mt-1"
              >
                <div
                  v-for="subCategory in category.children"
                  :key="subCategory.id"
                  @click="selectCategory(subCategory.id)"
                  :class="[
                    'px-3 py-1.5 text-sm cursor-pointer rounded flex justify-between items-center',
                    selectedCategoryId === subCategory.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  ]"
                >
                  <span>{{ getCategoryName(subCategory) }}</span>
                  <span class="text-xs text-gray-500">{{ subCategory.toolCount || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧工具列表 -->
        <div class="flex-1">
          <div v-if="isLoading" class="text-center py-8 text-gray-500">
            {{ $t('common.loading') }}
          </div>
          
          <div v-else-if="tools.length === 0" class="text-center py-8 text-gray-500">
            {{ $t('tools.noTools') }}
          </div>
          
          <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            <div
              v-for="tool in tools"
              :key="tool.id"
              class="border border-gray-200 dark:border-gray-700 rounded p-3 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer bg-white dark:bg-gray-800"
              @click="$router.push(`/tools/${tool.id}`)"
            >
              <h3 class="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">
                {{ getToolName(tool) }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {{ getToolDescription(tool) }}
              </p>
              
              <div class="flex flex-wrap gap-1 mb-2" v-if="tool.tags.length > 0">
                <span
                  v-for="tag in tool.tags.slice(0, 3)"
                  :key="tag"
                  class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
                >
                  {{ tag }}
                </span>
              </div>
              
              <div class="flex justify-between items-center text-xs text-gray-500">
                <div class="flex gap-3">
                  <span>⭐ {{ tool.rating }}</span>
                  <span>👀 {{ tool.viewCount }}</span>
                </div>
                <span>{{ formatDate(tool.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div v-if="totalPages > 1" class="flex justify-center mt-6">
            <div class="flex gap-1">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-1.5 text-sm rounded',
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                {{ page }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToolStore, useCategoryStore } from '@/stores'
import type { SearchParams, Category, Tool } from '@/types'

const toolStore = useToolStore()
const categoryStore = useCategoryStore()
const { t, locale } = useI18n()

// 搜索参数
const searchParams = ref<SearchParams>({
  keyword: '',
  categoryId: undefined,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  pageSize: 12
})

// 分类相关状态
const selectedCategoryId = ref<number | null>(null)
const expandedCategories = ref<Set<number>>(new Set())

// 计算属性
const tools = computed(() => toolStore.tools)
const isLoading = computed(() => toolStore.isLoading)
const currentPage = computed(() => toolStore.currentPage)
const total = computed(() => toolStore.total)
const categories = computed(() => categoryStore.categories)

const totalPages = computed(() => Math.ceil(total.value / (searchParams.value.pageSize || 12)))

// 构建分类树
const categoryTree = computed(() => {
  const categoryMap = new Map<number, Category>()
  const rootCategories: Category[] = []

  // 先创建所有分类的映射
  categories.value.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] })
  })

  // 构建树结构
  categories.value.forEach(category => {
    const categoryWithChildren = categoryMap.get(category.id)!
    
    if (category.parent_id === null) {
      rootCategories.push(categoryWithChildren)
    } else {
      const parent = categoryMap.get(category.parent_id)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(categoryWithChildren)
      }
    }
  })

  return rootCategories
})

// 当前分类名称
const currentCategoryName = computed(() => {
  if (selectedCategoryId.value === null) {
    return t('tools.allCategories')
  }
  
  const category = categories.value.find(c => c.id === selectedCategoryId.value)
  return category ? getCategoryName(category) : t('tools.allCategories')
})

// 总工具数量
const totalToolsCount = computed(() => {
  return categories.value.reduce((sum, category) => sum + (category.toolCount || 0), 0)
})

// 过滤后的工具数量
const filteredToolsCount = computed(() => total.value)

// 方法
const getCategoryName = (category: Category): string => {
  return locale.value.startsWith('zh') ? category.name_zh : category.name_en
}

const getToolName = (tool: Tool): string => {
  return locale.value.startsWith('zh') ? tool.name_zh : tool.name_en
}

const getToolDescription = (tool: Tool): string => {
  return locale.value.startsWith('zh') ? tool.description_zh : tool.description_en
}

const toggleCategory = (categoryId: number) => {
  // 如果点击的是已选中的分类，则选中该分类
  if (selectedCategoryId.value !== categoryId) {
    selectCategory(categoryId)
  }
  
  // 切换展开状态
  if (expandedCategories.value.has(categoryId)) {
    expandedCategories.value.delete(categoryId)
  } else {
    expandedCategories.value.add(categoryId)
  }
}

const selectCategory = (categoryId: number | null) => {
  selectedCategoryId.value = categoryId
  searchParams.value.categoryId = categoryId || undefined
  searchParams.value.page = 1
  handleSearch()
}

const handleSearch = () => {
  searchParams.value.page = 1
  toolStore.fetchTools(searchParams.value)
}

const goToPage = (page: number) => {
  searchParams.value.page = page
  toolStore.fetchTools(searchParams.value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(
    locale.value.startsWith('zh') ? 'zh-CN' : 'en-US'
  )
}

onMounted(async () => {
  // 先加载分类，再加载工具
  await categoryStore.fetchCategories()
  await toolStore.fetchTools(searchParams.value)
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

.transition-transform {
  transition: transform 0.15s ease;
}

@media (max-width: 768px) {
  .w-64 {
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .flex {
    flex-direction: column;
  }
  
  .gap-4 {
    gap: 0;
  }
}
</style>