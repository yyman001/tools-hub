<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold mb-8">{{ $t('profile.title') }}</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- 侧边栏 -->
        <div class="lg:col-span-1">
          <div class="card">
            <div class="text-center mb-6">
              <div class="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                👤
              </div>
              <h2 class="text-xl font-semibold">{{ user?.username }}</h2>
              <p class="text-gray-600">{{ user?.email }}</p>
            </div>
            
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('profile.toolsCount') }}</span>
                <span>{{ user?.toolCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('profile.favoritesCount') }}</span>
                <span>{{ user?.favoriteCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('profile.joinDate') }}</span>
                <span>{{ formatDate(user?.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 主要内容 -->
        <div class="lg:col-span-3">
          <!-- 标签页 -->
          <div class="mb-6">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8">
                <button
                  v-for="tab in tabs"
                  :key="tab.key"
                  @click="activeTab = tab.key"
                  :class="[
                    'py-2 px-1 border-b-2 font-medium text-sm',
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  {{ tab.label }}
                </button>
              </nav>
            </div>
          </div>
          
          <!-- 我的工具 -->
          <div v-if="activeTab === 'tools'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">{{ $t('profile.myTools') }}</h3>
              <router-link to="/add-tool" class="btn-primary">
                {{ $t('nav.addTool') }}
              </router-link>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="tool in myTools"
                :key="tool.id"
                class="card hover:shadow-md transition-shadow"
              >
                <div class="flex items-start space-x-4">
                  <div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    🔧
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold mb-2">{{ tool.name }}</h4>
                    <p class="text-gray-600 text-sm mb-3">{{ tool.description }}</p>
                    <div class="flex items-center justify-between text-sm text-gray-500">
                      <div class="flex items-center space-x-4">
                        <span>⭐ {{ tool.rating }}</span>
                        <span>👀 {{ tool.viewCount }}</span>
                      </div>
                      <div class="flex space-x-2">
                        <button class="text-primary-600 hover:text-primary-700">{{ $t('common.edit') }}</button>
                        <button class="text-red-600 hover:text-red-700">{{ $t('common.delete') }}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 我的收藏 -->
          <div v-if="activeTab === 'favorites'" class="space-y-6">
            <h3 class="text-lg font-semibold">{{ $t('profile.myFavorites') }}</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="tool in favoriteTools"
                :key="tool.id"
                class="card hover:shadow-md transition-shadow cursor-pointer"
                @click="$router.push(`/tools/${tool.id}`)"
              >
                <div class="flex items-start space-x-4">
                  <div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    🔧
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold mb-2">{{ tool.name }}</h4>
                    <p class="text-gray-600 text-sm mb-3">{{ tool.description }}</p>
                    <div class="flex items-center justify-between text-sm text-gray-500">
                      <div class="flex items-center space-x-4">
                        <span>⭐ {{ tool.rating }}</span>
                        <span>👀 {{ tool.viewCount }}</span>
                      </div>
                      <button class="text-red-600 hover:text-red-700">{{ $t('profile.removeFavorite') }}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 我的文章 -->
          <div v-if="activeTab === 'articles'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">{{ $t('profile.myArticles') }}</h3>
              <button class="btn-primary">
                {{ $t('profile.writeArticle') }}
              </button>
            </div>
            
            <div class="text-center py-12 text-gray-500">
              {{ $t('profile.noArticles') }}
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore, useToolStore } from '@/stores'

const userStore = useUserStore()
const toolStore = useToolStore()
const { t } = useI18n()

const activeTab = ref('tools')
const myTools = ref([])
const favoriteTools = ref([])

const user = computed(() => userStore.user)

const tabs = computed(() => [
  { key: 'tools', label: t('profile.myTools') },
  { key: 'favorites', label: t('profile.myFavorites') },
  { key: 'articles', label: t('profile.myArticles') }
])

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-CN')
}

onMounted(() => {
  // 模拟获取用户工具和收藏
  myTools.value = toolStore.tools.slice(0, 2)
  favoriteTools.value = toolStore.tools.slice(0, 3)
})
</script>