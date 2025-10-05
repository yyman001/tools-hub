<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-elevated min-h-screen">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2 text-gray-900 dark:text-slate-100">{{ $t('addTool.title') }}</h1>
        <p class="text-muted">{{ $t('addTool.subtitle') }}</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="card space-y-6">
        <!-- 中英文内容 Tab 切换 -->
        <div>
          <div class="border-b border-gray-200 dark:border-gray-700">
            <nav class="-mb-px flex space-x-8">
              <button
                type="button"
                @click="activeTab = 'zh'"
                :class="[
                  'py-2 px-1 border-b-2 font-medium text-sm',
                  activeTab === 'zh'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                ]"
              >
                中文内容 *
              </button>
              <button
                type="button"
                @click="activeTab = 'en'"
                :class="[
                  'py-2 px-1 border-b-2 font-medium text-sm',
                  activeTab === 'en'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                ]"
              >
                English Content *
              </button>
            </nav>
          </div>

          <!-- 中文内容 -->
          <div v-show="activeTab === 'zh'" class="pt-6 space-y-4">
            <div>
              <label for="name_zh" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {{ $t('addTool.toolNameZh') }} *
              </label>
              <input
                id="name_zh"
                v-model="form.name_zh"
                type="text"
                required
                class="input-field"
                :placeholder="$t('addTool.toolNameZhPlaceholder')"
              >
            </div>
            <div>
              <label for="description_zh" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {{ $t('addTool.toolDescriptionZh') }} *
              </label>
              <textarea
                id="description_zh"
                v-model="form.description_zh"
                required
                rows="4"
                class="input-field"
                :placeholder="$t('addTool.toolDescriptionZhPlaceholder')"
              ></textarea>
            </div>
          </div>

          <!-- 英文内容 -->
          <div v-show="activeTab === 'en'" class="pt-6 space-y-4">
            <div>
              <label for="name_en" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {{ $t('addTool.toolNameEn') }} *
              </label>
              <input
                id="name_en"
                v-model="form.name_en"
                type="text"
                required
                class="input-field"
                :placeholder="$t('addTool.toolNameEnPlaceholder')"
              >
            </div>
            <div>
              <label for="description_en" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {{ $t('addTool.toolDescriptionEn') }} *
              </label>
              <textarea
                id="description_en"
                v-model="form.description_en"
                required
                rows="4"
                class="input-field"
                :placeholder="$t('addTool.toolDescriptionEnPlaceholder')"
              ></textarea>
            </div>
          </div>
        </div>
        
        <!-- 工具主页链接 -->
        <div>
          <label for="homepage_url" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            {{ $t('addTool.homepageUrl') }} *
          </label>
          <input
            id="homepage_url"
            v-model="form.homepage_url"
            type="url"
            required
            class="input-field"
            :placeholder="$t('addTool.homepageUrlPlaceholder')"
          >
        </div>
        
        <!-- 版本号 -->
        <div>
          <label for="version" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            {{ $t('addTool.version') }}
          </label>
          <input
            id="version"
            v-model="form.version"
            type="text"
            class="input-field"
            :placeholder="$t('addTool.versionPlaceholder')"
          >
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ $t('addTool.versionHint') }}
          </p>
        </div>
        
        <!-- 分类选择 -->
        <div class="space-y-4">
          <div>
            <label for="primary_category" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              {{ $t('addTool.primaryCategory') }} *
            </label>
            <select
              id="primary_category"
              v-model="form.primary_category_id"
              required
              class="input-field"
              @change="onPrimaryCategoryChange"
            >
              <option value="">{{ $t('addTool.selectPrimaryCategory') }}</option>
              <option v-for="category in primaryCategories" :key="category.id" :value="category.id">
                {{ locale.startsWith('zh') ? category.name_zh : category.name_en }}
              </option>
            </select>
          </div>
          <div v-if="secondaryCategories.length > 0">
            <label for="secondary_category" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              {{ $t('addTool.secondaryCategory') }}
            </label>
            <select
              id="secondary_category"
              v-model="form.secondary_category_id"
              class="input-field"
            >
              <option value="">{{ $t('addTool.selectSecondaryCategory') }}</option>
              <option v-for="category in secondaryCategories" :key="category.id" :value="category.id">
                {{ locale.startsWith('zh') ? category.name_zh : category.name_en }}
              </option>
            </select>
          </div>
        </div>
        
        <!-- 标签 -->
        <div>
          <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            {{ $t('addTool.tags') }}
          </label>
          <div class="space-y-2">
            <input
              v-model="tagInput"
              @keydown.enter.prevent="addTag"
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
                <span class="ml-2 text-sm text-gray-700 dark:text-slate-300">Windows</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="selectedPlatforms"
                  type="checkbox"
                  value="macos"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-700 dark:text-slate-300">macOS</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="selectedPlatforms"
                  type="checkbox"
                  value="linux"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-700 dark:text-slate-300">Linux</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="selectedPlatforms"
                  type="checkbox"
                  value="android"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-700 dark:text-slate-300">Android</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="selectedPlatforms"
                  type="checkbox"
                  value="ios"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-700 dark:text-slate-300">iOS</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="selectedPlatforms"
                  type="checkbox"
                  value="web"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-700 dark:text-slate-300">网页</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="selectedPlatforms"
                  type="checkbox"
                  value="cross-platform"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-700 dark:text-slate-300">跨平台</span>
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
          <label for="screenshot_url" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            {{ $t('addTool.screenshot') }}
          </label>
          <input
            id="screenshot_url"
            v-model="form.screenshot_url"
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
const { t, locale } = useI18n()

// Tab 切换状态
const activeTab = ref('zh')

const form = ref({
  name_zh: '',
  name_en: '',
  description_zh: '',
  description_en: '',
  homepage_url: '',
  version: '',
  primary_category_id: '',
  secondary_category_id: '',
  tags: [] as string[],
  screenshot_url: '',
  supported_platforms: [] as string[],
  isPublic: true,
  downloadLinks: [] as { name: string; type: string; url: string; description: string }[]
})

const tagInput = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const selectedPlatforms = ref<string[]>([])

const categories = computed(() => categoryStore.categories)
const primaryCategories = computed(() => 
  categories.value.filter(cat => !cat.parent_id)
)
const secondaryCategories = computed(() => 
  categories.value.filter(cat => cat.parent_id === parseInt(form.value.primary_category_id))
)

// 平台信息映射
const platformInfoMap = {
  windows: { name: 'Windows', description: '支持Windows 10/11'},
  macos: { name: 'macOS', description: '支持macOS 10.15+'},
  linux: { name: 'Linux', description: '支持主流Linux发行版' },
  android: { name: 'Android', description: '支持Android 6.0+' },
  ios: { name: 'iOS', description: '支持iOS 13.0+'},
  web: { name: '网页版', description: '基于浏览器，无需下载' },
  'cross-platform': { name: '跨平台', description: '支持多个平台' }
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

const onPrimaryCategoryChange = () => {
  // Reset secondary category when primary category changes
  form.value.secondary_category_id = ''
}

const handleSubmit = async () => {
  if (!form.value.name_zh || !form.value.name_en || 
      !form.value.description_zh || !form.value.description_en || 
      !form.value.homepage_url || !form.value.primary_category_id) {
    errorMessage.value = t('addTool.errors.requiredFields')
    return
  }

  // 设置支持的平台
  form.value.supported_platforms = selectedPlatforms.value

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