import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import enUS from './en-US'

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
]

// 获取浏览器语言
function getBrowserLocale(): string {
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
  return localStorage.getItem('locale') || getBrowserLocale()
}

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false,
  locale: getStoredLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

// 切换语言的函数
export function setLocale(locale: string) {
  i18n.global.locale.value = locale as any
  localStorage.setItem('locale', locale)
  document.documentElement.lang = locale
}

// 获取当前语言
export function getCurrentLocale(): string {
  return i18n.global.locale.value
}

export default i18n