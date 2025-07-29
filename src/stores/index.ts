import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, Tool, Category } from '@/types'
import ApiService from '@/api'

// 用户状态管理
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)

  const isLoggedIn = computed(() => !!token.value && !!user.value)

  const login = async (email: string, password: string) => {
    isLoading.value = true
    try {
      const response = await ApiService.login(email, password)
      if (response.code === 200) {
        user.value = response.data.user
        token.value = response.data.token
        localStorage.setItem('token', response.data.token)
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      return { success: false, message: '登录失败' }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (username: string, email: string, password: string) => {
    isLoading.value = true
    try {
      const response = await ApiService.register(username, email, password)
      if (response.code === 200) {
        user.value = response.data.user
        token.value = response.data.token
        localStorage.setItem('token', response.data.token)
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      return { success: false, message: '注册失败' }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  const fetchProfile = async () => {
    if (!token.value) return
    try {
      const response = await ApiService.getProfile()
      if (response.code === 200) {
        user.value = response.data
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  return {
    user,
    token,
    isLoading,
    isLoggedIn,
    login,
    register,
    logout,
    fetchProfile
  }
})

// 工具状态管理
export const useToolStore = defineStore('tool', () => {
  const tools = ref<Tool[]>([])
  const currentTool = ref<Tool | null>(null)
  const isLoading = ref(false)
  const total = ref(0)
  const currentPage = ref(1)

  const fetchTools = async (params = {}) => {
    isLoading.value = true
    try {
      const response = await ApiService.getTools(params)
      if (response.code === 200) {
        tools.value = response.data.items
        total.value = response.data.total
        currentPage.value = response.data.page
      }
    } catch (error) {
      console.error('获取工具列表失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchToolById = async (id: string) => {
    isLoading.value = true
    try {
      const response = await ApiService.getToolById(id)
      if (response.code === 200) {
        currentTool.value = response.data
      }
    } catch (error) {
      console.error('获取工具详情失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  const createTool = async (toolData: Partial<Tool>) => {
    isLoading.value = true
    try {
      const response = await ApiService.createTool(toolData)
      if (response.code === 200) {
        tools.value.unshift(response.data)
        return { success: true, data: response.data }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      return { success: false, message: '创建工具失败' }
    } finally {
      isLoading.value = false
    }
  }

  return {
    tools,
    currentTool,
    isLoading,
    total,
    currentPage,
    fetchTools,
    fetchToolById,
    createTool
  }
})

// 分类状态管理
export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const currentCategory = ref<Category | null>(null)
  const isLoading = ref(false)

  const fetchCategories = async () => {
    isLoading.value = true
    try {
      const response = await ApiService.getCategories()
      if (response.code === 200) {
        categories.value = response.data
      }
    } catch (error) {
      console.error('获取分类列表失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchCategoryById = async (id: string) => {
    isLoading.value = true
    try {
      const response = await ApiService.getCategoryById(id)
      if (response.code === 200) {
        currentCategory.value = response.data
      }
    } catch (error) {
      console.error('获取分类详情失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    categories,
    currentCategory,
    isLoading,
    fetchCategories,
    fetchCategoryById
  }
})