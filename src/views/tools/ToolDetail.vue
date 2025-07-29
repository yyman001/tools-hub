<template>
  <div class="min-h-screen bg-gray-50 dark:bg-elevated">
    <!-- Hero 区域 -->
    <div class="text-white bg-gradient-to-r from-primary-600 to-primary-800 dark:from-dark-accent-blue dark:to-dark-accent-purple">
      <div class="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div v-if="isLoading" class="text-center">
          <div class="text-white/80">{{ $t('common.loading') }}</div>
        </div>

        <div v-else-if="!tool" class="text-center">
          <div class="text-white/80">{{ $t('tools.noTools') }}</div>
        </div>

        <div v-else>
          <!-- 返回按钮 -->
          <button
            @click="$router.back()"
            class="flex items-center mb-8 space-x-2 transition-colors text-white/80 hover:text-white"
          >
            <svg
              class="w-5 h-5"
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

          <!-- 工具主要信息 -->
          <div class="flex items-start space-x-6">
            <div
              class="flex items-center justify-center flex-shrink-0 w-20 h-20 text-4xl md:w-24 md:h-24 bg-white/10 backdrop-blur-sm rounded-2xl md:text-5xl"
            >
              🔧
            </div>

            <div class="flex-1 min-w-0">
              <h1
                class="mb-4 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl"
              >
                {{ tool.name }}
              </h1>
              <p class="mb-6 text-lg leading-relaxed md:text-xl text-white/90">
                {{ tool.description }}
              </p>

              <!-- 标签 -->
              <div class="flex flex-wrap gap-2 mb-6">
                <span
                  v-for="tag in tool.tags"
                  :key="tag"
                  class="px-3 py-1 text-sm font-medium text-white rounded-full bg-white/20 backdrop-blur-sm"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- 主要操作按钮 -->
              <div class="flex flex-wrap gap-4">
                <a
                  :href="tool.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center px-6 py-3 space-x-2 font-semibold transition-colors bg-white rounded-lg text-primary-600 dark:text-dark-accent-blue hover:bg-gray-50 dark:hover:bg-white/90"
                >
                  <span>{{ $t('tools.visitTool') }}</span>
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
                <!-- 平台标签 -->
                <div class="flex flex-wrap w-full gap-2 mt-2">
                  <span
                    v-for="platform in tool.platforms"
                    :key="platform.type"
                    class="px-3 py-1 text-sm font-medium text-white rounded-full bg-white/20 backdrop-blur-sm"
                  >
                    {{ platform.name }}
                  </span>
                </div>
                <button
                  class="flex items-center px-6 py-3 space-x-2 font-medium text-white transition-colors rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30"
                >
                  <span>⭐</span>
                  <span>{{ $t('common.favorite') }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div v-if="tool" class="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <!-- 内容区域 -->
      <div class="grid grid-cols-1 gap-8 xl:grid-cols-4">
        <!-- 主要内容 -->
        <div class="space-y-8 xl:col-span-3">
          <!-- 工具详情 -->
          <div class="card">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-primary">{{ $t('tools.toolDetail') }}</h2>
              <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-muted">
                <span>📅 {{ formatDate(tool.createdAt) }}</span>
                <button
                  class="flex items-center space-x-1 text-primary-600 hover:text-primary-700 dark:text-dark-accent-blue dark:hover:text-dark-accent-blue/80"
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
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  <span>{{ $t('common.share') }}</span>
                </button>
              </div>
            </div>

            <div class="prose prose-lg max-w-none">
              <p class="leading-relaxed text-gray-700 dark:text-secondary">
                {{ tool.description }}
              </p>
              <p class="leading-relaxed text-gray-700 dark:text-secondary">
                这是一个优秀的工具，专为提高工作效率而设计。它具有直观的用户界面，强大的功能集，
                以及出色的性能表现。无论你是初学者还是专业用户，都能从中受益。
              </p>

              <!-- 功能特点 -->
              <h3 class="mt-8 mb-4 text-xl font-semibold text-primary">{{ $t('tools.features') }}</h3>
              <ul class="space-y-2">
                <li class="flex items-start space-x-3">
                  <span class="mt-1 text-green-500">✓</span>
                  <span class="text-secondary">{{ $t('features.intuitive') }}</span>
                </li>
                <li class="flex items-start space-x-3">
                  <span class="mt-1 text-green-500">✓</span>
                  <span class="text-secondary">{{ $t('features.powerful') }}</span>
                </li>
                <li class="flex items-start space-x-3">
                  <span class="mt-1 text-green-500">✓</span>
                  <span class="text-secondary">{{ $t('features.crossPlatform') }}</span>
                </li>
                <li class="flex items-start space-x-3">
                  <span class="mt-1 text-green-500">✓</span>
                  <span class="text-secondary">{{ $t('features.community') }}</span>
                </li>
              </ul>

              <!-- 使用场景 -->
              <h3 class="mt-8 mb-4 text-xl font-semibold text-primary">{{ $t('tools.useCases') }}</h3>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="p-4 rounded-lg bg-gray-50 dark:bg-elevated">
                  <h4 class="mb-2 font-medium text-primary">{{ $t('useCases.personal') }}</h4>
                  <p class="text-sm text-gray-600 dark:text-muted">
                    {{ $t('useCases.personalDesc') }}
                  </p>
                </div>
                <div class="p-4 rounded-lg bg-gray-50 dark:bg-elevated">
                  <h4 class="mb-2 font-medium text-primary">{{ $t('useCases.team') }}</h4>
                  <p class="text-sm text-gray-600 dark:text-muted">{{ $t('useCases.teamDesc') }}</p>
                </div>
                <div class="p-4 rounded-lg bg-gray-50 dark:bg-elevated">
                  <h4 class="mb-2 font-medium text-primary">{{ $t('useCases.enterprise') }}</h4>
                  <p class="text-sm text-gray-600 dark:text-muted">{{ $t('useCases.enterpriseDesc') }}</p>
                </div>
                <div class="p-4 rounded-lg bg-gray-50 dark:bg-elevated">
                  <h4 class="mb-2 font-medium text-primary">{{ $t('useCases.developer') }}</h4>
                  <p class="text-sm text-gray-600 dark:text-muted">{{ $t('useCases.developerDesc') }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 用户评价 -->
          <div class="card">
            <h3 class="mb-6 text-xl font-semibold text-primary">{{ $t('tools.userReviews') }}</h3>
            <div class="space-y-6">
              <div class="pb-6 border-b border-gray-200 dark:border-default last:border-b-0">
                <div class="flex items-start space-x-4">
                  <div
                    class="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 dark:bg-dark-accent-blue/20"
                  >
                    <span class="font-medium text-primary-600 dark:text-dark-accent-blue">A</span>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center mb-2 space-x-2">
                      <span class="font-medium text-primary">Anonymous User</span>
                      <div class="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                    </div>
                    <p class="text-gray-700 dark:text-secondary">
                      {{ $t('common.loading') === t('common.loading') ? '非常好用的工具，界面简洁，功能强大，推荐给大家！' : 'Great tool with clean interface and powerful features. Highly recommended!' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="space-y-6 xl:col-span-1">
          <!-- 基本信息 -->
          <div class="card">
            <h3 class="mb-4 font-semibold text-primary">{{ $t('tools.basicInfo') }}</h3>
            <div class="space-y-4">
              <div
                class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-default last:border-b-0"
              >
                <span class="text-sm text-gray-600 dark:text-muted">{{ $t('addTool.category') }}</span>
                <span class="text-sm font-medium text-primary">{{
                  getCategoryName(tool.category)
                }}</span>
              </div>
              
              <!-- 平台支持 -->
              <div
                class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-default last:border-b-0"
              >
                <span class="text-sm text-gray-600 dark:text-muted">{{ $t('tools.platforms') }}</span>
                <span class="text-sm font-medium text-primary">
                  {{ tool.platforms.map(p => p.name).join('、') }}
                </span>
              </div>
              
              <div
                class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-default last:border-b-0"
              >
                <span class="text-sm text-gray-600 dark:text-muted">{{ $t('tools.rating') }}</span>
                <div class="flex items-center space-x-1">
                  <span class="text-sm font-medium text-primary">{{ tool.rating }}</span>
                  <span class="text-yellow-400">⭐</span>
                </div>
              </div>
              <div
                class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-default last:border-b-0"
              >
                <span class="text-sm text-gray-600 dark:text-muted">{{ $t('tools.views') }}</span>
                <span class="text-sm font-medium text-primary">{{
                  tool.viewCount.toLocaleString()
                }}</span>
              </div>

              <div class="flex items-center justify-between py-2">
                <span class="text-sm text-gray-600 dark:text-muted">{{ $t('tools.createdAt') }}</span>
                <span class="text-sm font-medium text-primary">{{
                  formatDate(tool.createdAt)
                }}</span>
              </div>
            </div>
          </div>

          <!-- 下载地址 -->
          <div v-if="tool.downloadLinks && tool.downloadLinks.length > 0" class="card">
            <h3 class="mb-4 font-semibold text-primary">{{ $t('tools.downloadLinks') }}</h3>
            <div class="space-y-3">
              <a
                v-for="link in tool.downloadLinks"
                :key="link.name"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="block p-3 transition-colors rounded-lg bg-gray-50 dark:bg-elevated hover:bg-gray-100 dark:hover:bg-elevated/80 group"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium truncate text-primary group-hover:text-primary-600 dark:group-hover:text-dark-accent-blue">
                      {{ link.name }}
                    </div>
                    <div v-if="link.description" class="mt-1 text-xs text-gray-500 dark:text-muted">
                      {{ link.description }}
                    </div>
                  </div>
                  <div class="flex items-center space-x-1">
                    <span
                      :class="getDownloadTypeClass(link.type)"
                      class="px-2 py-1 text-xs font-medium rounded-full"
                    >
                      {{ getDownloadTypeLabel(link.type) }}
                    </span>
                    <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:text-muted dark:group-hover:text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <!-- 相关工具 -->
          <div class="card">
            <h3 class="mb-4 font-semibold text-primary">{{ $t('tools.relatedTools') }}</h3>
            <div class="space-y-3">
              <div
                v-for="i in 3"
                :key="i"
                class="flex items-center p-3 space-x-3 transition-colors rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-elevated"
              >
                <div
                  class="flex items-center justify-center w-10 h-10 text-lg bg-gray-200 rounded-lg dark:bg-elevated"
                >
                  🔧
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium truncate text-primary">
                    {{ $t('tools.relatedTools') }} {{ i }}
                  </div>
                  <div class="text-xs text-gray-500 truncate dark:text-muted">
                    {{ $t('common.loading') === t('common.loading') ? '简短的工具描述' : 'Brief tool description' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 快速操作 -->
          <div class="card">
            <h3 class="mb-4 font-semibold text-primary">{{ $t('tools.quickActions') }}</h3>
            <div class="space-y-3">
              <button
                class="w-full px-4 py-2 text-sm font-medium text-red-600 transition-colors rounded-lg bg-red-50 hover:bg-red-100 dark:bg-dark-accent-red/10 dark:hover:bg-dark-accent-red/20 dark:text-dark-accent-red"
              >
                {{ $t('tools.reportIssue') }}
              </button>
              <button
                class="w-full px-4 py-2 text-sm font-medium text-blue-600 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-dark-accent-blue/10 dark:hover:bg-dark-accent-blue/20 dark:text-dark-accent-blue"
              >
                {{ $t('tools.suggestImprovement') }}
              </button>
              <button
                class="w-full px-4 py-2 text-sm font-medium text-green-600 transition-colors rounded-lg bg-green-50 hover:bg-green-100 dark:bg-dark-accent-green/10 dark:hover:bg-dark-accent-green/20 dark:text-dark-accent-green"
              >
                {{ $t('tools.contactAuthor') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from 'vue-i18n'
import { useToolStore, useCategoryStore } from "@/stores";
import type { DetailedPlatformType } from '@/types'

const route = useRoute();
const toolStore = useToolStore();
const categoryStore = useCategoryStore();
const { t } = useI18n()

const tool = computed(() => toolStore.currentTool);
const isLoading = computed(() => toolStore.isLoading);
const categories = computed(() => categoryStore.categories);

const getCategoryName = (categoryId: string) => {
  const category = categories.value.find((c) => c.id === categoryId);
  return category?.name || "未知分类";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("zh-CN");
};

// 下载类型标签映射
const getDownloadTypeLabel = (type: string) => {
  const typeMap = {
    official: '官方',
    cloud: '网盘',
    mirror: '镜像',
    other: '其他'
  };
  return typeMap[type as keyof typeof typeMap] || type;
};

// 下载类型样式映射
const getDownloadTypeClass = (type: string) => {
  const classMap = {
    official: 'bg-green-100 dark:bg-dark-accent-green/20 text-green-600 dark:text-dark-accent-green',
    cloud: 'bg-blue-100 dark:bg-dark-accent-blue/20 text-blue-600 dark:text-dark-accent-blue',
    mirror: 'bg-purple-100 dark:bg-dark-accent-purple/20 text-purple-600 dark:text-dark-accent-purple',
    other: 'bg-gray-100 dark:bg-elevated text-gray-600 dark:text-muted'
  };
  return classMap[type as keyof typeof classMap] || classMap.other;
};

onMounted(() => {
  const toolId = route.params.id as string;
  toolStore.fetchToolById(toolId);
  categoryStore.fetchCategories();
});
</script>