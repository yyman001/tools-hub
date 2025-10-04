<template>
  <header class="sticky top-0 z-50 border-b bg-surface shadow-soft border-default">
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="flex items-center h-16">
        <!-- Logo -->
        <div class="flex items-center flex-shrink-0">
          <router-link to="/" class="flex items-center space-x-2 text-2xl font-bold text-primary-600">
            <span>🛠️</span>
            <span>Tools Hub</span>
          </router-link>
        </div>
        
        <!-- 导航菜单 -->
        <nav class="items-center hidden ml-8 space-x-8 md:flex">
          <router-link 
            to="/tools" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.name === 'Tools' }"
          >
            {{ $t('nav.tools') }}
          </router-link>
          <router-link 
            to="/categories" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.name === 'Categories' }"
          >
            {{ $t('nav.categories') }}
          </router-link>
          <router-link 
            to="/dark-mode-demo" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.name === 'DarkModeDemo' }"
          >
            {{ $t('nav.darkModeDemo') }}
          </router-link>
        </nav>
        
        <!-- 搜索框 (中等屏幕以上显示) -->
        <div class="flex-1 hidden max-w-md mx-8 lg:block">
          <div class="relative">
            <input
              v-model="searchKeyword"
              @keyup.enter="handleSearch"
              type="text"
              :placeholder="$t('home.searchPlaceholder')"
              class="pl-12 input-field"
            >
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg class="w-5 h-5 text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- 用户操作区域 -->
        <div class="flex items-center flex-shrink-0 space-x-4">
          <!-- 暗模式切换 -->
          <button
            @click="toggleDark"
            class="p-2 transition-all duration-200 rounded-lg nav-link hover-bg"
            :title="isDark ? $t('common.switchToLight') : $t('common.switchToDark')"
          >
            <!-- 太阳图标 (亮模式) -->
            <svg v-if="!isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <!-- 月亮图标 (暗模式) -->
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
          
          <!-- 语言切换 -->
          <div class="relative" ref="langMenuRef">
            <button
              @click="showLangMenu = !showLangMenu"
              class="p-2 transition-colors rounded-lg nav-link hover-bg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </button>
            
            <!-- 语言下拉菜单 -->
            <div
              v-show="showLangMenu"
              class="absolute right-0 z-50 w-40 py-1 mt-2 border rounded-lg bg-surface shadow-soft border-default"
            >
              <button
                v-for="lang in supportedLocales"
                :key="lang.value"
                @click="switchLanguage(lang.value)"
                :class="[
                  'block w-full text-left px-4 py-2 text-sm hover-bg transition-colors',
                  currentLocale === lang.value ? 'nav-link-active bg-primary-50 dark:bg-primary-900/20' : 'nav-link'
                ]"
              >
                {{ lang.name }}
              </button>
            </div>
          </div>
          
          <!-- 搜索按钮 (小屏幕显示) -->
          <button 
            @click="showMobileSearch = !showMobileSearch"
            class="p-2 lg:hidden nav-link"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <!-- 未登录状态 -->
          <div v-if="!isLoggedIn" class="flex items-center space-x-2">
            <router-link to="/login" class="px-3 py-2 nav-link">
              {{ $t('nav.login') }}
            </router-link>
            <router-link to="/register" class="btn-primary">
              {{ $t('nav.register') }}
            </router-link>
          </div>
          
          <!-- 已登录状态 -->
          <div v-else class="flex items-center space-x-4">
            <router-link to="/add-tool" class="btn-primary">
              {{ $t('nav.addTool') }}
            </router-link>
            
            <!-- 用户菜单 -->
            <div class="relative" ref="userMenuRef">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center p-2 space-x-2 rounded-lg nav-link hover-bg"
              >
                <div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30">
                  <span class="font-medium text-primary-600 dark:text-primary-400">{{ userInitial }}</span>
                </div>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- 用户下拉菜单 -->
              <div
                v-show="showUserMenu"
                class="absolute right-0 z-50 w-48 py-1 mt-2 border rounded-lg bg-surface shadow-soft border-default"
              >
                <router-link
                  to="/profile"
                  @click="showUserMenu = false"
                  class="block px-4 py-2 text-sm nav-link hover-bg"
                >
                  {{ $t('nav.profile') }}
                </router-link>
                <router-link
                  to="/add-tool"
                  @click="showUserMenu = false"
                  class="block px-4 py-2 text-sm nav-link hover-bg"
                >
                  {{ $t('nav.addTool') }}
                </router-link>
                <div class="my-1 border-t border-light"></div>
                <button
                  @click="handleLogout"
                  class="block w-full px-4 py-2 text-sm text-left nav-link hover-bg"
                >
                  {{ $t('nav.logout') }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- 移动端菜单按钮 -->
          <button 
            @click="showMobileMenu = !showMobileMenu"
            class="p-2 md:hidden nav-link"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- 移动端搜索框 -->
      <div v-show="showMobileSearch" class="pb-4 lg:hidden">
        <div class="relative">
          <input
            v-model="searchKeyword"
            @keyup.enter="handleSearch"
            type="text"
            :placeholder="$t('home.searchPlaceholder')"
            class="pl-12 input-field"
          >
          <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg class="w-5 h-5 text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <!-- 移动端导航菜单 -->
      <div v-show="showMobileMenu" class="py-4 border-t md:hidden border-default">
        <nav class="space-y-2">
          <router-link 
            to="/" 
            @click="showMobileMenu = false"
            class="block px-3 py-2 rounded-lg nav-link hover-bg"
            :class="{ 'nav-link-active bg-primary-50 dark:bg-primary-900/20': $route.name === 'Home' }"
          >
            {{ $t('nav.home') }}
          </router-link>
          <router-link 
            to="/tools" 
            @click="showMobileMenu = false"
            class="block px-3 py-2 rounded-lg nav-link hover-bg"
            :class="{ 'nav-link-active bg-primary-50 dark:bg-primary-900/20': $route.name === 'Tools' }"
          >
            {{ $t('nav.tools') }}
          </router-link>
          <router-link 
            to="/categories" 
            @click="showMobileMenu = false"
            class="block px-3 py-2 rounded-lg nav-link hover-bg"
            :class="{ 'nav-link-active bg-primary-50 dark:bg-primary-900/20': $route.name === 'Categories' }"
          >
            {{ $t('nav.categories') }}
          </router-link>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores'
import { SUPPORT_LOCALES, setLocale, getCurrentLocale } from '@/locales'
import { useDarkMode } from '@/composables/useDarkMode'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()
const { isDark, toggleDark } = useDarkMode()

const searchKeyword = ref('')
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const showMobileSearch = ref(false)
const showLangMenu = ref(false)
const userMenuRef = ref<HTMLElement>()
const langMenuRef = ref<HTMLElement>()

const isLoggedIn = computed(() => userStore.isLoggedIn)
const user = computed(() => userStore.user)
const supportedLocales = SUPPORT_LOCALES
const currentLocale = ref(getCurrentLocale())

const userInitial = computed(() => {
  return user.value?.username?.charAt(0).toUpperCase() || 'U'
})

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchKeyword.value)}`)
    showMobileSearch.value = false
  }
}

const handleLogout = async () => {
  // 使用统一的登出方法
  const { useAuth } = await import('@/composables/useAuth')
  const { logout } = useAuth()
  
  await logout()
  showUserMenu.value = false
  router.push('/')
}

const switchLanguage = (locale: string) => {
  setLocale(locale)
  currentLocale.value = locale
  showLangMenu.value = false
}

// 点击外部关闭菜单
const handleClickOutside = (event: Event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
  if (langMenuRef.value && !langMenuRef.value.contains(event.target as Node)) {
    showLangMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>