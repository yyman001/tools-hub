import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN.json'
import enUS from './en-US.json'

// 支持的语言列表
export const SUPPORT_LOCALES = [
  {
    name: '简体中文',
    value: 'zh-CN'
  },
  {
    name: 'English',
    value: 'en-US'
  }
] as const

// 获取浏览器语言
function getBrowserLocale(): string {
  if (typeof window === 'undefined') return 'zh-CN'
  
  const navigatorLocale = navigator.language || (navigator as any).userLanguage
  
  if (navigatorLocale) {
    const trimmedLocale = navigatorLocale.trim().split(/-|_/)[0]
    
    // 检查是否支持该语言
    if (SUPPORT_LOCALES.find(locale => locale.value.startsWith(trimmedLocale))) {
      return navigatorLocale.includes('zh') ? 'zh-CN' : 'en-US'
    }
  }
  
  return 'zh-CN' // 默认中文
}

// 获取存储的语言设置
function getStoredLocale(): string {
  if (typeof window === 'undefined') return 'zh-CN'
  
  try {
    return localStorage.getItem('locale') || getBrowserLocale()
  } catch {
    return getBrowserLocale()
  }
}

// 语言消息对象
const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
} as const

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false,
  locale: getStoredLocale(),
  fallbackLocale: 'zh-CN',
  messages,
  // 添加更严格的类型检查
  missingWarn: false,
  fallbackWarn: false,
  // 确保在 SSR 环境下正常工作
  globalInjection: true
})

// 切换语言的函数
export function setLocale(locale: string) {
  if (typeof window === 'undefined') return
  
  try {
    i18n.global.locale.value = locale as 'zh-CN' | 'en-US'
    localStorage.setItem('locale', locale)
    document.documentElement.lang = locale
  } catch (error) {
    console.warn('Failed to set locale:', error)
  }
}

// 获取当前语言
export function getCurrentLocale(): string {
  return i18n.global.locale.value
}

export default i18n