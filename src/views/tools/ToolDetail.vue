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
                {{ getToolName(tool) }}
              </h1>
              <p class="mb-6 text-lg leading-relaxed md:text-xl text-white/90">
                {{ getToolDescription(tool) }}
              </p>

              <!-- 标签 -->
              <div v-if="tool.tags && tool.tags.length > 0" class="flex flex-wrap gap-2 mb-6">
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
                  :href="tool.homepage_url"
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
                
                <button
                  class="flex items-center px-6 py-3 space-x-2 font-medium text-white transition-colors rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30"
                >
                  <span>⭐</span>
                  <span>{{ $t('common.favorite') }}</span>
                </button>
              </div>

              <!-- 平台支持 -->
              <div v-if="tool.supported_platforms && tool.supported_platforms.length > 0" class="flex flex-wrap gap-2 mt-4">
                <span
                  v-for="platform in tool.supported_platforms"
                  :key="platform"
                  class="px-3 py-1 text-sm font-medium text-white rounded-full bg-white/20 backdrop-blur-sm"
                >
                  {{ getPlatformName(platform) }}
                </span>
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
                <span>📅 {{ $t('tools.lastUpdated') }}: {{ formatDate(tool.updated_at || tool.created_at) }}</span>
                <button
                  @click="shareToolPage"
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
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-primary mb-3">{{ $t('tools.toolDetail') }}</h3>
                <p class="leading-relaxed text-gray-700 dark:text-secondary mb-4">
                  {{ getToolDescription(tool) }}
                </p>
              </div>

              <!-- 工具截图 -->
              <div v-if="tool.screenshot_url" class="mb-8">
                <h3 class="text-lg font-semibold text-primary mb-3">{{ $t('tools.screenshot') }}</h3>
                <img 
                  :src="tool.screenshot_url" 
                  :alt="getToolName(tool)"
                  class="w-full rounded-lg shadow-md"
                  @error="$event.target.style.display='none'"
                >
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
              <!-- 主分类 -->
              <div
                v-if="tool.primaryCategory"
                class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-default last:border-b-0"
              >
                <span class="text-sm text-gray-600 dark:text-muted">{{ $t('addTool.primaryCategory') }}</span>
                <span class="text-sm font-medium text-primary">{{
                  getCategoryName(tool.primaryCategory)
                }}</span>
              </div>

              <!-- 二级分类 -->
              <div
                v-if="tool.secondaryCategory"
                class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-default last:border-b-0"
              >
                <span class="text-sm text-gray-600 dark:text-muted">{{ $t('addTool.secondaryCategory') }}</span>
                <span class="text-sm font-medium text-primary">{{
                  getCategoryName(tool.secondaryCategory)
                }}</span>
              </div>

              <!-- 工具主页 -->
              <div
                class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-default last:border-b-0"
              >
                <span class="text-sm text-gray-600 dark:text-muted">{{ $t('addTool.homepageUrl') }}</span>
                <a 
                  :href="tool.homepage_url" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {{ $t('tools.visitTool') }}
                </a>
              </div>
              
              <!-- 平台支持 -->
              <div
                v-if="tool.supported_platforms && tool.supported_platforms.length > 0"
                class="py-2 border-b border-gray-100 dark:border-default last:border-b-0"
              >
                <span class="text-sm text-gray-600 dark:text-muted block mb-2">{{ $t('addTool.platforms') }}</span>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="platform in tool.supported_platforms"
                    :key="platform"
                    class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                  >
                    {{ getPlatformName(platform) }}
                  </span>
                </div>
              </div>
              
              <!-- 版本号 -->
              <div
                class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-default last:border-b-0"
              >
                <span class="text-sm text-gray-600 dark:text-muted">{{ $t('tools.version') }}</span>
                <span class="text-sm font-medium text-primary">{{
                  tool.version || $t('tools.latest')
                }}</span>
              </div>

              <div
                class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-default last:border-b-0"
              >
                <span class="text-sm text-gray-600 dark:text-muted">{{ $t('tools.views') }}</span>
                <span class="text-sm font-medium text-primary">{{
                  (tool.viewCount || 0).toLocaleString()
                }}</span>
              </div>

              <div class="flex items-center justify-between py-2">
                <span class="text-sm text-gray-600 dark:text-muted">{{ $t('tools.createdAt') }}</span>
                <span class="text-sm font-medium text-primary">{{
                  formatDate(tool.created_at)
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
import type { DetailedPlatformType, Category } from '@/types'

const route = useRoute();
const toolStore = useToolStore();
const categoryStore = useCategoryStore();
const { t, locale } = useI18n()

const tool = computed(() => toolStore.currentTool);
const isLoading = computed(() => toolStore.isLoading);
const categories = computed(() => categoryStore.categories);

// 获取工具名称（根据语言）
const getToolName = (tool: any) => {
  if (!tool) return '';
  return locale.value.startsWith('zh') ? tool.name_zh : tool.name_en;
};

// 获取工具描述（根据语言）
const getToolDescription = (tool: any) => {
  if (!tool) return '';
  return locale.value.startsWith('zh') ? tool.description_zh : tool.description_en;
};

// 获取分类名称（根据语言）
const getCategoryName = (category: Category) => {
  if (!category) return '';
  return locale.value.startsWith('zh') ? category.name_zh : category.name_en;
};

// 获取平台名称
const getPlatformName = (platform: string) => {
  const platformMap: Record<string, string> = {
    'windows': 'Windows',
    'macos': 'macOS',
    'linux': 'Linux',
    'android': 'Android',
    'ios': 'iOS',
    'web': '网页',
    'cross-platform': '跨平台'
  };
  return platformMap[platform] || platform;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(
    locale.value.startsWith('zh') ? 'zh-CN' : 'en-US'
  );
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

// 分享工具页面
const shareToolPage = async () => {
  const toolName = getToolName(tool.value);
  const toolDescription = getToolDescription(tool.value);
  const currentUrl = window.location.href;
  
  const shareData = {
    title: `${toolName} - Tool Hub`,
    text: toolDescription,
    url: currentUrl
  };

  try {
    // 尝试使用 Web Share API
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // 降级到复制链接
      await navigator.clipboard.writeText(currentUrl);
      // 这里可以添加一个提示消息
      alert(locale.value.startsWith('zh') ? '链接已复制到剪贴板' : 'Link copied to clipboard');
    }
  } catch (error) {
    console.error('分享失败:', error);
    // 如果所有方法都失败，尝试复制链接
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert(locale.value.startsWith('zh') ? '链接已复制到剪贴板' : 'Link copied to clipboard');
    } catch (clipboardError) {
      console.error('复制链接失败:', clipboardError);
    }
  }
};

onMounted(() => {
  const toolId = route.params.id as string;
  toolStore.fetchToolById(toolId);
  categoryStore.fetchCategories();
});
</script>