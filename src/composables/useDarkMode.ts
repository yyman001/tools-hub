import { ref, watch, onMounted } from 'vue'

const isDark = ref(false)

// 获取系统主题偏好
function getSystemTheme(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// 获取存储的主题设置
function getStoredTheme(): string | null {
  return localStorage.getItem('theme')
}

// 应用主题
function applyTheme(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 保存主题设置
function saveTheme(theme: string) {
  localStorage.setItem('theme', theme)
}

export function useDarkMode() {
  // 初始化主题
  const initTheme = () => {
    const stored = getStoredTheme()
    
    if (stored === 'dark') {
      isDark.value = true
    } else if (stored === 'light') {
      isDark.value = false
    } else {
      // 如果没有存储设置，使用系统偏好
      isDark.value = getSystemTheme()
    }
    
    applyTheme(isDark.value)
  }

  // 切换主题
  const toggleDark = () => {
    isDark.value = !isDark.value
    applyTheme(isDark.value)
    saveTheme(isDark.value ? 'dark' : 'light')
  }

  // 设置主题
  const setDark = (dark: boolean) => {
    isDark.value = dark
    applyTheme(dark)
    saveTheme(dark ? 'dark' : 'light')
  }

  // 监听系统主题变化
  const watchSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      // 只有在没有用户设置时才跟随系统
      if (!getStoredTheme()) {
        isDark.value = e.matches
        applyTheme(isDark.value)
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }

  // 组件挂载时初始化
  onMounted(() => {
    initTheme()
    const cleanup = watchSystemTheme()
    
    // 组件卸载时清理
    return cleanup
  })

  return {
    isDark,
    toggleDark,
    setDark
  }
}