<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-elevated min-h-screen">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2 text-gray-900 dark:text-slate-100">{{ $t('addTool.title') }}</h1>
        <p class="text-muted">{{ $t('addTool.subtitle') }}</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="card space-y-6">
        <!-- 工具名称 -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            {{ $t('addTool.toolName') }} *
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="input-field"
            :placeholder="$t('addTool.toolNamePlaceholder')"
          >
        </div>
        
        <!-- 工具描述 -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            {{ $t('addTool.toolDescription') }} *
          </label>
          <textarea
            id="description"
            v-model="form.description"
            required
            rows="4"
            class="input-field"
            :placeholder="$t('addTool.toolDescriptionPlaceholder')"
          ></textarea>
        </div>
        
        <!-- 工具链接 -->
        <div>
          <label for="url" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            {{ $t('addTool.toolUrl') }} *
          </label>
          <input
            id="url"
            v-model="form.url"
            type="url"
            required
            class="input-field"
            :placeholder="$t('addTool.toolUrlPlaceholder')"
          >
        </div>
        
        <!-- 分类选择 -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            {{ $t('addTool.category') }} *
          </label>
          <select
            id="category"
            v-model="form.category"
            required
            class="input-field"
          >
            <option value="">{{ $t('addTool.selectCategory') }}</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <!-- 标签 -->
        <div>
          <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            {{ $t('addTool.tags') }}
          </label>
          <div class="space-y-2">
            <input
              v-model="tagInput"
              @keyup.enter="addTag"
              type="text"
              class="input-field"
              :placeholder="$t('addTool.tagsPlaceholder')"
            >
            <div v-if="form.tags.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="(tag, index) in form.tags"
                :key="index"
                class="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
              >
                {{ tag }}
                <button
                  type="button"
                  @click="removeTag(index)"
                  class="ml-2 text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200"
                >
                  ×
                </button>
              </span>
            </div>
          </div>
        </div>
        
        <!-- 平台支持 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            {{ $t('addTool.platforms') }}
          </label>
          <div class="space-y-2">
            <div class="flex flex-wrap gap-3">
              <label class="flex items-center">
                <input
                  v-model="selectedPlatforms"
                  type="checkbox"
                  value="windows"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-700 dark:text-slate-300">🪟 Windows</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="selectedPlatforms"
                  type="checkbox"
                  value="macos"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-700 dark:text-slate-300">🍎 macOS</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="selectedPlatforms"
                  type="checkbox"
                  value="linux"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-700 dark:text-slate-300">🐧 Linux</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="selectedPlatforms"
                  type="checkbox"
                  value="android"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-700 dark:text-slate-300">🤖 Android</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="selectedPlatforms"
                  type="checkbox"
                  value="ios"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-700 dark:text-slate-300">📱 iOS</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="selectedPlatforms"
                  type="checkbox"
                  value="web"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-700 dark:text-slate-300">🌐 网页</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="selectedPlatforms"
                  type="checkbox"
                  value="cross-platform"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-700 dark:text-slate-300">🔄 跨平台</span>
              </label>
            </div>
          </div>
        </div>
        
        <!-- 下载地址 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            {{ $t('addTool.downloadLinks') }}
          </label>
          <div class="space-y-4">
            <div v-for="(link, index) in form.downloadLinks" :key="index" class="card p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {{ $t('addTool.downloadName') }}
                  </label>
                  <input
                    v-model="link.name"
                    type="text"
                    class="input-field"
                    :placeholder="$t('addTool.downloadNamePlaceholder')"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {{ $t('addTool.downloadType') }}
                  </label>
                  <select v-model="link.type" class="input-field">
                    <option value="official">{{ $t('addTool.downloadTypeOfficial') }}</option>
                    <option value="cloud">{{ $t('addTool.downloadTypeCloud') }}</option>
                    <option value="mirror">{{ $t('addTool.downloadTypeMirror') }}</option>
                    <option value="other">{{ $t('addTool.downloadTypeOther') }}</option>
                  </select>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {{ $t('addTool.downloadUrl') }}
                  </label>
                  <input
                    v-model="link.url"
                    type="url"
                    class="input-field"
                    :placeholder="$t('addTool.downloadUrlPlaceholder')"
                  >
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {{ $t('addTool.downloadDescription') }}
                  </label>
                  <input
                    v-model="link.description"
                    type="text"
                    class="input-field"
                    :placeholder="$t('addTool.downloadDescriptionPlaceholder')"
                  >
                </div>
              </div>
              <div class="mt-3 flex justify-end">
                <button
                  type="button"
                  @click="removeDownloadLink(index)"
                  class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                >
                  {{ $t('common.remove') }}
                </button>
              </div>
            </div>
            <button
              type="button"
              @click="addDownloadLink"
              class="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-600 dark:text-gray-400 hover:border-primary-500 dark:hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <div class="flex items-center justify-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>{{ $t('addTool.addDownloadLink') }}</span>
              </div>
            </button>
          </div>
        </div>
        
        <!-- 截图链接 -->
        <div>
          <label for="screenshot" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            {{ $t('addTool.screenshot') }}
          </label>
          <input
            id="screenshot"
            v-model="form.screenshot"
            type="url"
            class="input-field"
            :placeholder="$t('addTool.screenshotPlaceholder')"
          >
        </div>
        
        <!-- 公开设置 -->
        <div class="flex items-center">
          <input
            id="isPublic"
            v-model="form.isPublic"
            type="checkbox"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          >
          <label for="isPublic" class="ml-2 block text-sm text-gray-700 dark:text-slate-300">
            {{ $t('addTool.isPublic') }}
          </label>
        </div>
        
        <!-- 错误信息 -->
        <div v-if="errorMessage" class="text-red-600 dark:text-red-400 text-sm">
          {{ errorMessage }}
        </div>
        
        <!-- 提交按钮 -->
        <div class="flex space-x-4">
          <button
            type="submit"
            :disabled="isLoading"
            class="btn-primary disabled:opacity-50"
          >
            {{ isLoading ? $t('addTool.submitting') : $t('common.submit') }}
          </button>
          <button
            type="button"
            @click="$router.back()"
            class="btn-secondary"
          >
            {{ $t('common.cancel') }}
          </button>
        </div>
      </form>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToolStore, useCategoryStore } from '@/stores'

const router = useRouter()
const toolStore = useToolStore()
const categoryStore = useCategoryStore()
const { t } = useI18n()

const form = ref({
  name: '',
  description: '',
  url: '',
  category: '',
  tags: [] as string[],
  screenshot: '',
  isPublic: true,
  platforms: [] as { type: string; name: string; description: string }[], // Added platforms
  downloadLinks: [] as { name: string; type: string; url: string; description: string }[] // Added downloadLinks
})

const tagInput = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const selectedPlatforms = ref<string[]>([])

const categories = computed(() => categoryStore.categories)

// 平台信息映射
const platformInfoMap = {
  windows: { name: 'Windows', description: '支持Windows 10/11', icon: '🪟' },
  macos: { name: 'macOS', description: '支持macOS 10.15+', icon: '🍎' },
  linux: { name: 'Linux', description: '支持主流Linux发行版', icon: '🐧' },
  android: { name: 'Android', description: '支持Android 6.0+', icon: '🤖' },
  ios: { name: 'iOS', description: '支持iOS 13.0+', icon: '📱' },
  web: { name: '网页版', description: '基于浏览器，无需下载', icon: '🌐' },
  'cross-platform': { name: '跨平台', description: '支持多个平台', icon: '🔄' }
}

const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
    tagInput.value = ''
  }
}

const removeTag = (index: number) => {
  form.value.tags.splice(index, 1)
}

const addDownloadLink = () => {
  form.value.downloadLinks.push({
    name: '',
    type: 'official',
    url: '',
    description: ''
  })
}

const removeDownloadLink = (index: number) => {
  form.value.downloadLinks.splice(index, 1)
}

const handleSubmit = async () => {
  if (!form.value.name || !form.value.description || !form.value.url || !form.value.category) {
    errorMessage.value = t('addTool.errors.requiredFields')
    return
  }

  // 转换选中的平台为PlatformInfo结构
  form.value.platforms = selectedPlatforms.value.map(platformType => ({
    type: platformType as any,
    ...platformInfoMap[platformType as keyof typeof platformInfoMap]
  }))

  isLoading.value = true
  errorMessage.value = ''

  const result = await toolStore.createTool(form.value)
  
  if (result.success) {
    router.push('/profile')
  } else {
    errorMessage.value = result.message || t('addTool.errors.submitFailed')
  }
  
  isLoading.value = false
}

onMounted(() => {
  categoryStore.fetchCategories()
})
</script>