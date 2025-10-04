import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { supabase } from '@/lib/supabase'
import { getAuthErrorMessage } from '@/utils/authErrors'

// 认证模式配置
const AUTH_MODE = import.meta.env.VITE_AUTH_MODE || 'http' // 'http' 或 'sdk'

export function useAuth() {
  const userStore = useUserStore()
  const router = useRouter()

  const isLoading = ref(false)
  const isAuthenticated = computed(() => userStore.isLoggedIn)
  const currentUser = computed(() => userStore.user)

  // 获取Supabase配置
  const getSupabaseConfig = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('缺少Supabase配置')
    }
    
    return { supabaseUrl, supabaseAnonKey }
  }

  // HTTP模式：使用REST API登录
  const loginViaHTTP = async (email: string, password: string) => {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()
    
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify({ email, password })
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorData}`)
    }
    
    return await response.json()
  }

  // SDK模式：使用Supabase JS SDK登录
  const loginViaSDK = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  }

  // 统一登录方法
  const login = async (email: string, password: string) => {
    isLoading.value = true
    
    try {
      console.log(`🔐 使用${AUTH_MODE.toUpperCase()}模式登录:`, email)
      
      let result
      if (AUTH_MODE === 'http') {
        result = await loginViaHTTP(email, password)
      } else {
        result = await loginViaSDK(email, password)
      }
      
      // 处理登录成功
      if (result.access_token || result.session?.access_token) {
        const token = result.access_token || result.session.access_token
        const user = result.user || result.session?.user
        
        // 设置token
        userStore.token = token
        localStorage.setItem('token', token)
        
        // 设置用户信息
        if (user) {
          userStore.user = {
            id: user.id,
            username: user.user_metadata?.username || user.email?.split('@')[0] || '',
            email: user.email || '',
            avatar: user.user_metadata?.avatar_url,
            createdAt: user.created_at,
            toolCount: 0,
            favoriteCount: 0
          }
        } else {
          // 如果没有用户信息，获取用户信息
          await fetchUserProfile(token)
        }
        
        console.log('✅ 登录成功')
        return { success: true }
      }
      
      throw new Error('登录响应无效')
    } catch (error: any) {
      console.error('❌ 登录失败:', error)
      return { 
        success: false, 
        message: getAuthErrorMessage(error) 
      }
    } finally {
      isLoading.value = false
    }
  }

  // HTTP模式：使用REST API注册
  const registerViaHTTP = async (email: string, password: string, username: string) => {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()
    
    const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify({
        email,
        password,
        data: { username }
      })
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorData}`)
    }
    
    return await response.json()
  }

  // SDK模式：使用Supabase JS SDK注册
  const registerViaSDK = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    })
    
    if (error) throw error
    return data
  }

  // 统一注册方法
  const register = async (username: string, email: string, password: string) => {
    isLoading.value = true
    
    try {
      console.log(`🔐 使用${AUTH_MODE.toUpperCase()}模式注册:`, email)
      
      let result
      if (AUTH_MODE === 'http') {
        result = await registerViaHTTP(email, password, username)
      } else {
        result = await registerViaSDK(email, password, username)
      }
      
      // 处理注册结果
      if (result.user) {
        if (result.session) {
          // 注册成功并自动登录
          const token = result.session.access_token
          userStore.token = token
          localStorage.setItem('token', token)
          
          userStore.user = {
            id: result.user.id,
            username: result.user.user_metadata?.username || result.user.email?.split('@')[0] || '',
            email: result.user.email || '',
            avatar: result.user.user_metadata?.avatar_url,
            createdAt: result.user.created_at,
            toolCount: 0,
            favoriteCount: 0
          }
          
          console.log('✅ 注册并登录成功')
          return { 
            success: true, 
            message: '注册成功',
            needsVerification: false
          }
        } else {
          // 需要邮箱验证
          console.log('✅ 注册成功，需要邮箱验证')
          return { 
            success: true, 
            message: '注册成功，请检查您的邮箱进行验证',
            needsVerification: true,
            email: result.user.email
          }
        }
      }
      
      throw new Error('注册响应无效')
    } catch (error: any) {
      console.error('❌ 注册失败:', error)
      return { 
        success: false, 
        message: getAuthErrorMessage(error) 
      }
    } finally {
      isLoading.value = false
    }
  }

  // HTTP模式：发送密码重置邮件
  const sendPasswordResetEmailViaHTTP = async (email: string) => {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()
    
    const response = await fetch(`${supabaseUrl}/auth/v1/recover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify({
        email,
        gotrue_meta_security: {}
      })
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorData}`)
    }
    
    return await response.json()
  }

  // SDK模式：发送密码重置邮件
  const sendPasswordResetEmailViaSDK = async (email: string) => {
    const redirectUrl = `${window.location.origin}/reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    })
    
    if (error) throw error
    return { success: true }
  }

  // 统一发送密码重置邮件方法
  const sendPasswordResetEmail = async (email: string) => {
    isLoading.value = true
    
    try {
      console.log(`🔐 使用${AUTH_MODE.toUpperCase()}模式发送密码重置邮件:`, email)
      
      if (AUTH_MODE === 'http') {
        await sendPasswordResetEmailViaHTTP(email)
      } else {
        await sendPasswordResetEmailViaSDK(email)
      }
      
      console.log('✅ 密码重置邮件发送成功')
      return { success: true, message: '密码重置邮件已发送' }
    } catch (error: any) {
      console.error('❌ 发送密码重置邮件失败:', error)
      return { 
        success: false, 
        message: getAuthErrorMessage(error) 
      }
    } finally {
      isLoading.value = false
    }
  }

  // HTTP模式：重置密码
  const resetPasswordViaHTTP = async (newPassword: string, token: string) => {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()
    
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify({ password: newPassword })
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorData}`)
    }
    
    return await response.json()
  }

  // SDK模式：重置密码
  const resetPasswordViaSDK = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) throw error
    return { success: true }
  }

  // 统一重置密码方法
  const resetPassword = async (newPassword: string, accessToken?: string) => {
    isLoading.value = true
    
    try {
      console.log(`🔐 使用${AUTH_MODE.toUpperCase()}模式重置密码`)
      
      if (AUTH_MODE === 'http') {
        if (!accessToken) {
          throw new Error('HTTP模式需要提供access_token')
        }
        await resetPasswordViaHTTP(newPassword, accessToken)
      } else {
        await resetPasswordViaSDK(newPassword)
      }
      
      console.log('✅ 密码重置成功')
      return { success: true, message: '密码重置成功' }
    } catch (error: any) {
      console.error('❌ 密码重置失败:', error)
      return { 
        success: false, 
        message: getAuthErrorMessage(error) 
      }
    } finally {
      isLoading.value = false
    }
  }

  // HTTP模式：获取用户信息
  const fetchUserProfileViaHTTP = async (token: string) => {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()
    
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseAnonKey
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    return await response.json()
  }

  // SDK模式：获取用户信息
  const fetchUserProfileViaSDK = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) throw error
    return user
  }

  // 统一获取用户信息方法
  const fetchUserProfile = async (token?: string) => {
    try {
      let userData
      
      if (AUTH_MODE === 'http') {
        const currentToken = token || userStore.token || localStorage.getItem('token')
        if (!currentToken) {
          throw new Error('没有token')
        }
        userData = await fetchUserProfileViaHTTP(currentToken)
      } else {
        userData = await fetchUserProfileViaSDK()
      }
      
      if (userData) {
        userStore.user = {
          id: userData.id,
          username: userData.user_metadata?.username || userData.email?.split('@')[0] || '',
          email: userData.email || '',
          avatar: userData.user_metadata?.avatar_url,
          createdAt: userData.created_at,
          toolCount: 0,
          favoriteCount: 0
        }
        
        console.log('✅ 获取用户信息成功:', userData.email)
        return userData
      }
      
      throw new Error('用户信息无效')
    } catch (error: any) {
      console.error('❌ 获取用户信息失败:', error)
      // 清除无效状态
      userStore.user = null
      userStore.token = null
      localStorage.removeItem('token')
      return null
    }
  }

  // 登出
  const logout = async () => {
    try {
      console.log('🚪 用户登出')
      
      if (AUTH_MODE === 'sdk') {
        // SDK模式下调用Supabase登出
        await supabase.auth.signOut()
      }
      
      // 清除本地状态
      userStore.user = null
      userStore.token = null
      localStorage.removeItem('token')
      
      console.log('✅ 登出成功')
    } catch (error) {
      console.error('❌ 登出异常:', error)
      // 即使出错也要清除本地状态
      userStore.user = null
      userStore.token = null
      localStorage.removeItem('token')
    }
  }

  // 初始化认证状态
  const initAuth = async () => {
    console.log(`🔐 初始化${AUTH_MODE.toUpperCase()}模式认证系统...`)
    
    try {
      if (AUTH_MODE === 'sdk') {
        // SDK模式：监听认证状态变化
        supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('认证状态变化:', event, session?.user?.email)
          
          if (event === 'SIGNED_IN' && session) {
            userStore.token = session.access_token
            localStorage.setItem('token', session.access_token)
            await fetchUserProfile()
          } else if (event === 'SIGNED_OUT') {
            userStore.user = null
            userStore.token = null
            localStorage.removeItem('token')
          } else if (event === 'TOKEN_REFRESHED' && session) {
            userStore.token = session.access_token
            localStorage.setItem('token', session.access_token)
          }
        })
        
        // 检查当前会话
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          console.log('发现现有会话:', session.user?.email)
          userStore.token = session.access_token
          localStorage.setItem('token', session.access_token)
          await fetchUserProfile()
        }
      } else {
        // HTTP模式：检查localStorage中的token
        const token = localStorage.getItem('token')
        if (token) {
          console.log('🔍 找到token，验证有效性...')
          userStore.token = token
          await fetchUserProfile(token)
        }
      }
    } catch (error) {
      console.error('❌ 初始化认证失败:', error)
      userStore.user = null
      userStore.token = null
      localStorage.removeItem('token')
    }
  }

  // 检查是否需要认证
  const requireAuth = () => {
    if (!isAuthenticated.value) {
      router.push('/login')
      return false
    }
    return true
  }

  return {
    // 状态
    isLoading,
    isAuthenticated,
    currentUser,
    
    // 方法
    login,
    register,
    logout,
    sendPasswordResetEmail,
    resetPassword,
    fetchUserProfile,
    initAuth,
    requireAuth,
    
    // 配置
    authMode: AUTH_MODE
  }
}