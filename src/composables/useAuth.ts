import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { createClient, type User } from '@supabase/supabase-js'
import { getAuthErrorMessage } from '@/utils/authErrors'

// 类型定义
interface AuthState {
  user: User | null
  loading: boolean
  error: Error | null
}

interface LoginCredentials {
  email: string
  password: string
}

// 创建 Supabase 客户端
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function useAuth() {
  const userStore = useUserStore()
  const router = useRouter()

  const authState = ref<AuthState>({
    user: null,
    loading: false,
    error: null,
  })

  const isLoading = computed(() => authState.value.loading)
  const isAuthenticated = computed(() => !!authState.value.user && !!userStore.token)
  const currentUser = computed(() => authState.value.user)

  // 登录方法
  const login = async (email: string, password: string) => {
    try {
      authState.value.loading = true
      authState.value.error = null

      console.log('🔐 开始登录:', email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // 设置认证状态
      authState.value.user = data.user

      // 同步到用户store
      if (data.user && data.session) {
        userStore.token = data.session.access_token
        localStorage.setItem('token', data.session.access_token)

        userStore.user = {
          id: data.user.id,
          username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || '',
          email: data.user.email || '',
          avatar: data.user.user_metadata?.avatar_url,
          createdAt: data.user.created_at,
          toolCount: 0,
          favoriteCount: 0
        }

        console.log('✅ 登录成功:', data.user.email)
      }

      return { success: true, user: data.user, session: data.session }
    } catch (error) {
      authState.value.error = error as Error
      console.error('❌ 登录失败:', error)
      return {
        success: false,
        message: getAuthErrorMessage(error as Error)
      }
    } finally {
      authState.value.loading = false
    }
  }

  // 注册方法
  const register = async (username: string, email: string, password: string) => {
    try {
      authState.value.loading = true
      authState.value.error = null

      console.log('🔐 开始注册:', email)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      })

      if (error) throw error

      // 处理注册结果
      if (data.user) {
        if (data.session) {
          // 注册成功并自动登录
          authState.value.user = data.user
          userStore.token = data.session.access_token
          localStorage.setItem('token', data.session.access_token)

          userStore.user = {
            id: data.user.id,
            username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || '',
            email: data.user.email || '',
            avatar: data.user.user_metadata?.avatar_url,
            createdAt: data.user.created_at,
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
            email: data.user.email
          }
        }
      }

      throw new Error('注册响应无效')
    } catch (error: any) {
      authState.value.error = error as Error
      console.error('❌ 注册失败:', error)
      return {
        success: false,
        message: getAuthErrorMessage(error)
      }
    } finally {
      authState.value.loading = false
    }
  }

  // 发送密码重置邮件
  const sendPasswordResetEmail = async (email: string) => {
    try {
      authState.value.loading = true
      authState.value.error = null

      console.log('🔐 发送密码重置邮件:', email)

      const redirectUrl = `${window.location.origin}/reset-password`
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      })

      if (error) throw error

      console.log('✅ 密码重置邮件发送成功')
      return { success: true, message: '密码重置邮件已发送' }
    } catch (error: any) {
      authState.value.error = error as Error
      console.error('❌ 发送密码重置邮件失败:', error)
      return {
        success: false,
        message: getAuthErrorMessage(error)
      }
    } finally {
      authState.value.loading = false
    }
  }

  // 重置密码
  const resetPassword = async (newPassword: string) => {
    try {
      authState.value.loading = true
      authState.value.error = null

      console.log('🔐 重置密码')

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      console.log('✅ 密码重置成功')
      return { success: true, message: '密码重置成功' }
    } catch (error: any) {
      authState.value.error = error as Error
      console.error('❌ 密码重置失败:', error)
      return {
        success: false,
        message: getAuthErrorMessage(error)
      }
    } finally {
      authState.value.loading = false
    }
  }

  // 获取用户信息
  const fetchUserProfile = async () => {
    try {
      authState.value.loading = true
      authState.value.error = null

      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) throw error

      if (user) {
        authState.value.user = user

        // 同步到用户store
        const userInfo = {
          id: user.id,
          username: user.user_metadata?.username || user.email?.split('@')[0] || '',
          email: user.email || '',
          avatar: user.user_metadata?.avatar_url,
          createdAt: user.created_at,
          toolCount: 0,
          favoriteCount: 0
        }

        userStore.user = userInfo

        console.log('✅ 获取用户信息成功:', user.email)
        return user
      }

      throw new Error('用户信息无效')
    } catch (error: any) {
      authState.value.error = error as Error
      console.error('❌ 获取用户信息失败:', error)
      // 清除无效状态
      authState.value.user = null
      userStore.user = null
      userStore.token = null
      localStorage.removeItem('token')
      return null
    } finally {
      authState.value.loading = false
    }
  }

  // 刷新token
  const refreshToken = async () => {
    try {
      authState.value.loading = true
      authState.value.error = null

      const { data, error } = await supabase.auth.refreshSession()
      if (error) throw error

      if (data.session) {
        authState.value.user = data.user
        userStore.token = data.session.access_token
        localStorage.setItem('token', data.session.access_token)

        console.log('✅ Token 刷新成功')
        return {
          user: data.user,
          session: data.session
        }
      }

      throw new Error('刷新失败')
    } catch (error) {
      authState.value.error = error as Error
      console.error('❌ Token 刷新失败:', error)
      await logout()
      return { error }
    } finally {
      authState.value.loading = false
    }
  }

  // 登出
  const logout = async () => {
    try {
      authState.value.loading = true
      authState.value.error = null

      console.log('🚪 用户登出')

      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // 清除状态
      authState.value.user = null
      userStore.user = null
      userStore.token = null
      localStorage.removeItem('token')

      console.log('✅ 登出成功')
      return { success: true }
    } catch (error) {
      authState.value.error = error as Error
      console.error('❌ 登出异常:', error)
      // 即使出错也要清除本地状态
      authState.value.user = null
      userStore.user = null
      userStore.token = null
      localStorage.removeItem('token')
      return { error }
    } finally {
      authState.value.loading = false
    }
  }

  // 初始化认证状态
  const initAuth = async () => {
    console.log('🔐 初始化认证系统...')

    try {
      // 获取初始会话
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        console.log('发现现有会话:', session.user?.email)
        authState.value.user = session.user
        userStore.token = session.access_token
        localStorage.setItem('token', session.access_token)

        // 同步用户信息到store
        if (session.user) {
          userStore.user = {
            id: session.user.id,
            username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || '',
            email: session.user.email || '',
            avatar: session.user.user_metadata?.avatar_url,
            createdAt: session.user.created_at,
            toolCount: 0,
            favoriteCount: 0
          }
        }
      }

      authState.value.loading = false
    } catch (error) {
      console.error('❌ 初始化认证失败:', error)
      authState.value.user = null
      authState.value.loading = false
      userStore.user = null
      userStore.token = null
      localStorage.removeItem('token')
    }
  }

  // 监听认证状态变化
  onMounted(() => {
    // 初始化
    initAuth()

    // 订阅认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('认证状态变化:', event, session?.user?.email)

        if (event === 'SIGNED_IN' && session) {
          authState.value.user = session.user
          userStore.token = session.access_token
          localStorage.setItem('token', session.access_token)

          if (session.user) {
            userStore.user = {
              id: session.user.id,
              username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || '',
              email: session.user.email || '',
              avatar: session.user.user_metadata?.avatar_url,
              createdAt: session.user.created_at,
              toolCount: 0,
              favoriteCount: 0
            }
          }
        } else if (event === 'SIGNED_OUT') {
          authState.value.user = null
          userStore.user = null
          userStore.token = null
          localStorage.removeItem('token')
        } else if (event === 'TOKEN_REFRESHED' && session) {
          authState.value.user = session.user
          userStore.token = session.access_token
          localStorage.setItem('token', session.access_token)
        }
      }
    )

    // 自动刷新 token (每23小时刷新一次，Supabase token 默认24小时过期)
    const autoRefresh = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await refreshToken()
      }
    }

    const refreshInterval = setInterval(autoRefresh, 23 * 60 * 60 * 1000)

    // 清理订阅
    return () => {
      subscription.unsubscribe()
      clearInterval(refreshInterval)
    }
  })

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
    loading: isLoading,
    user: currentUser,
    error: computed(() => authState.value.error),
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
    refreshToken,
    initAuth,
    requireAuth
  }
}