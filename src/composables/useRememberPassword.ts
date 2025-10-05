import { ref, watch } from 'vue'

interface SavedCredentials {
  email: string
  password: string
  rememberPassword: boolean
}

const STORAGE_KEY = 'toolshub_saved_credentials'

export function useRememberPassword() {
  const rememberPassword = ref(false)
  const savedCredentials = ref<SavedCredentials | null>(null)

  // 从本地存储加载保存的凭据
  const loadSavedCredentials = (): SavedCredentials | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const credentials = JSON.parse(saved) as SavedCredentials
        // 简单的解密（实际项目中应使用更安全的方法）
        if (credentials.password) {
          credentials.password = atob(credentials.password)
        }
        return credentials
      }
    } catch (error) {
      console.error('加载保存的凭据失败:', error)
      // 如果解析失败，清除损坏的数据
      localStorage.removeItem(STORAGE_KEY)
    }
    return null
  }

  // 保存凭据到本地存储
  const saveCredentials = (email: string, password: string, remember: boolean) => {
    try {
      if (remember) {
        const credentials: SavedCredentials = {
          email,
          // 简单的加密（实际项目中应使用更安全的方法）
          password: btoa(password),
          rememberPassword: true
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials))
      } else {
        // 如果不记住密码，清除保存的凭据
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (error) {
      console.error('保存凭据失败:', error)
    }
  }

  // 清除保存的凭据
  const clearSavedCredentials = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      savedCredentials.value = null
      rememberPassword.value = false
    } catch (error) {
      console.error('清除保存的凭据失败:', error)
    }
  }

  // 初始化时加载保存的凭据
  const initializeCredentials = () => {
    const saved = loadSavedCredentials()
    if (saved) {
      savedCredentials.value = saved
      rememberPassword.value = saved.rememberPassword
      return {
        email: saved.email,
        password: saved.password,
        rememberPassword: saved.rememberPassword
      }
    }
    return {
      email: '',
      password: '',
      rememberPassword: false
    }
  }

  // 检查是否有保存的凭据
  const hasSavedCredentials = (): boolean => {
    const saved = loadSavedCredentials()
    return saved !== null && saved.email !== '' && saved.password !== ''
  }

  // 获取保存的邮箱（用于快速填充）
  const getSavedEmail = (): string => {
    const saved = loadSavedCredentials()
    return saved?.email || ''
  }

  return {
    rememberPassword,
    savedCredentials,
    saveCredentials,
    clearSavedCredentials,
    initializeCredentials,
    hasSavedCredentials,
    getSavedEmail
  }
}