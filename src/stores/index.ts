import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, Tool, Category, ToolFormData } from '@/types'
import { SupabaseService } from '@/services/supabaseService'
import { supabase } from '@/lib/supabase'
import { getAuthErrorMessage } from '@/utils/authErrors'
import { smartRegister } from '@/utils/registrationHelper'
import { getPasswordResetUrl } from '@/utils/environment'

// 用户状态管理
export const useUserStore = defineStore('user', () => {

  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)

  const isLoggedIn = computed(() => !!token.value && !!user.value)

  const login = async (email: string, password: string) => {
    isLoading.value = true
    try {
      console.log('🔐 尝试登录:', email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('登录错误:', error)
        const errorMessage = getAuthErrorMessage(error)
        return { success: false, message: errorMessage }
      }

      if (data.user && data.session) {
        // 更新用户信息
        await updateUserProfile(data.user)

        // 保存 token
        token.value = data.session.access_token
        localStorage.setItem('token', data.session.access_token)

        console.log('登录成功:', data.user.email)
        return { success: true }
      }

      return { success: false, message: '登录失败，请重试' }
    } catch (error: any) {
      console.error('登录异常:', error)
      return { success: false, message: error.message || '网络错误，请检查网络连接' }
    } finally {
      isLoading.value = false
    }
  }

  // 更新用户资料的辅助函数
  const updateUserProfile = async (authUser: any) => {
    try {
      // 获取用户的工具数量等统计信息
      const { count: toolCount } = await supabase
        .from('tools')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authUser.id)
        .eq('status', 1)

      user.value = {
        id: authUser.id,
        username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || '',
        email: authUser.email || '',
        avatar: authUser.user_metadata?.avatar_url,
        createdAt: authUser.created_at,
        toolCount: toolCount || 0,
        favoriteCount: 0 // TODO: 实现收藏功能后更新
      }
    } catch (error) {
      console.error('更新用户资料失败:', error)
      // 即使统计信息获取失败，也要设置基本用户信息
      user.value = {
        id: authUser.id,
        username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || '',
        email: authUser.email || '',
        avatar: authUser.user_metadata?.avatar_url,
        createdAt: authUser.created_at,
        toolCount: 0,
        favoriteCount: 0
      }
    }
  }

  const register = async (username: string, email: string, password: string) => {
    isLoading.value = true
    try {
      console.log('🔐 开始智能注册流程:', email)

      const result = await smartRegister(username, email, password)

      if (result.success) {
        if (result.session && result.user) {
          // 直接登录成功
          await updateUserProfile(result.user)
          token.value = result.session.access_token
          localStorage.setItem('token', result.session.access_token)
          console.log('注册并登录成功:', result.user.email)
        }

        return result
      } else {
        // 处理特殊情况：用户已验证，应该直接登录
        if (result.shouldLogin) {
          return {
            success: false,
            message: result.message,
            shouldRedirectToLogin: true
          }
        }

        return result
      }
    } catch (error: any) {
      console.error('注册流程异常:', error)
      return {
        success: false,
        message: error.message || '网络错误，请检查网络连接'
      }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('登出错误:', error)
      }
    } catch (error) {
      console.error('登出异常:', error)
    } finally {
      // 无论是否成功，都清除本地状态
      user.value = null
      token.value = null
      localStorage.removeItem('token')
      console.log('已登出')
    }
  }

  const fetchProfile = async () => {
    try {
      const currentToken = token.value || localStorage.getItem('token')

      if (!currentToken) {
        console.log('没有token，清除用户状态')
        user.value = null
        token.value = null
        localStorage.removeItem('token')
        return
      }

      // 使用HTTP API获取用户信息
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'apikey': supabaseAnonKey
        }
      })

      if (response.ok) {
        const userData = await response.json()
        console.log('✅ HTTP获取用户信息成功:', userData.email)

        user.value = {
          id: userData.id,
          username: userData.user_metadata?.username || userData.email?.split('@')[0] || '',
          email: userData.email || '',
          avatar: userData.user_metadata?.avatar_url,
          createdAt: userData.created_at,
          toolCount: 0,
          favoriteCount: 0
        }

        token.value = currentToken
        localStorage.setItem('token', currentToken)
      } else {
        console.error('HTTP获取用户信息失败:', response.status)
        // Token无效，清除状态
        user.value = null
        token.value = null
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 出错时清除状态
      user.value = null
      token.value = null
      localStorage.removeItem('token')
    }
  }

  const sendPasswordResetEmail = async (email: string) => {
    isLoading.value = true
    try {
      console.log('🔐 发送密码重置邮件:', email)

      // 动态获取正确的重定向URL
      const redirectUrl = getPasswordResetUrl()
      console.log('重定向URL:', redirectUrl)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      })

      if (error) {
        console.error('发送重置邮件失败:', error)
        const errorMessage = getAuthErrorMessage(error)
        return { success: false, message: errorMessage }
      }

      console.log('密码重置邮件发送成功')
      return { success: true, message: '密码重置邮件已发送' }
    } catch (error: any) {
      console.error('发送重置邮件异常:', error)
      return { success: false, message: error.message || '网络错误，请检查网络连接' }
    } finally {
      isLoading.value = false
    }
  }

  const resetPassword = async (newPassword: string) => {
    isLoading.value = true
    try {
      console.log('🔐 重置密码')

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        console.error('重置密码失败:', error)
        const errorMessage = getAuthErrorMessage(error)
        return { success: false, message: errorMessage }
      }

      console.log('密码重置成功')
      // 重新获取用户信息
      await fetchProfile()

      return { success: true, message: '密码重置成功' }
    } catch (error: any) {
      console.error('重置密码异常:', error)
      return { success: false, message: error.message || '网络错误，请检查网络连接' }
    } finally {
      isLoading.value = false
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
    fetchProfile,
    sendPasswordResetEmail,
    resetPassword
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
      const response = await SupabaseService.getTools(params)
      tools.value = response.items
      total.value = response.total
      currentPage.value = response.page
    } catch (error) {
      console.error('获取工具列表失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchToolById = async (id: string) => {
    isLoading.value = true
    try {
      const tool = await SupabaseService.getToolById(id)
      currentTool.value = tool
    } catch (error) {
      console.error('获取工具详情失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  const createTool = async (toolData: ToolFormData) => {
    isLoading.value = true
    try {
      const tool = await SupabaseService.createTool(toolData)
      tools.value.unshift(tool)
      return { success: true, data: tool }
    } catch (error) {
      console.error('创建工具失败:', error)
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
      const categoryList = await SupabaseService.getCategories()
      categories.value = categoryList
    } catch (error) {
      console.error('获取分类列表失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchCategoryById = async (id: string) => {
    isLoading.value = true
    try {
      const category = await SupabaseService.getCategoryById(id)
      currentCategory.value = category
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