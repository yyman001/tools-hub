import { ref, onMounted } from 'vue'
import { createClient, SupabaseClient, User } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
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
const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
  //   process.env.VITE_SUPABASE_URL, 
  //   process.env.VITE_SUPABASE_ANON_KEY
)

export const useSupabaseAuth = () => {
  const authState = ref<AuthState>({
    user: null,
    loading: false,
    error: null,
  })

  // 登录 hook
  const useLogin = async ({ email, password }: LoginCredentials) => {
    try {
      authState.value.loading = true
      authState.value.error = null

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      authState.value.user = data.user
      return { user: data.user, session: data.session }
    } catch (error) {
      authState.value.error = error as Error
      return { error }
    } finally {
      authState.value.loading = false
    }
  }

  // 登出 hook
  const useLogout = async () => {
    try {
      authState.value.loading = true
      authState.value.error = null

      const { error } = await supabase.auth.signOut()
      if (error) throw error

      authState.value.user = null
      return { success: true }
    } catch (error) {
      authState.value.error = error as Error
      return { error }
    } finally {
      authState.value.loading = false
    }
  }

  // Token 刷新 hook
  const useRefreshToken = async () => {
    try {
      authState.value.loading = true
      authState.value.error = null

      const { data, error } = await supabase.auth.refreshSession()
      if (error) throw error

      authState.value.user = data.user
      return {
        user: data.user,
        session: data.session
      }
    } catch (error) {
      authState.value.error = error as Error
      return { error }
    } finally {
      authState.value.loading = false
    }
  }

  // 监听认证状态变化
  onMounted(() => {
    // 获取初始会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      authState.value.user = session?.user ?? null
      authState.value.loading = false
    })

    // 订阅认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        authState.value.user = session?.user ?? null
      }
    )

    // 自动刷新 token
    const refreshToken = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await useRefreshToken()
      }
    }

    // 每23小时刷新一次token(Supabase token 默认24小时过期)
    const refreshInterval = setInterval(refreshToken, 23 * 60 * 60 * 1000)

    // 清理订阅
    return () => {
      subscription.unsubscribe()
      clearInterval(refreshInterval)
    }
  })

  return {
    ...authState.value,
    useLogin,
    useLogout,
    useRefreshToken
  }
}