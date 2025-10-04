import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'

export function useAuthHTTP() {
    const userStore = useUserStore()
    const router = useRouter()

    const isAuthenticated = computed(() => userStore.isLoggedIn)
    const currentUser = computed(() => userStore.user)

    const requireAuth = () => {
        if (!isAuthenticated.value) {
            router.push('/login')
            return false
        }
        return true
    }

    // 使用HTTP API获取用户信息
    const fetchUserProfile = async (token: string) => {
        try {
            console.log('🔍 使用HTTP API获取用户信息...')

            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
            const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

            const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'apikey': supabaseAnonKey
                }
            })

            if (!response.ok) {
                console.error('获取用户信息失败:', response.status)
                return null
            }

            const userData = await response.json()
            console.log('✅ 获取用户信息成功:', userData.email)

            return {
                id: userData.id,
                username: userData.user_metadata?.username || userData.email?.split('@')[0] || '',
                email: userData.email || '',
                avatar: userData.user_metadata?.avatar_url,
                createdAt: userData.created_at,
                toolCount: 0,
                favoriteCount: 0
            }
        } catch (error) {
            console.error('❌ 获取用户信息异常:', error)
            return null
        }
    }

    // 验证token是否有效
    const validateToken = async (token: string) => {
        try {
            const userProfile = await fetchUserProfile(token)
            return !!userProfile
        } catch (error) {
            console.error('Token验证失败:', error)
            return false
        }
    }

    // HTTP模式的认证初始化
    const initAuth = async () => {
        console.log('🔐 初始化HTTP认证系统...')

        try {
            // 检查localStorage中的token
            const token = localStorage.getItem('token')

            if (!token) {
                console.log('❌ 没有找到token')
                userStore.user = null
                userStore.token = null
                return
            }

            console.log('🔍 找到token，验证有效性...')

            // 验证token并获取用户信息
            const userProfile = await fetchUserProfile(token)

            if (userProfile) {
                console.log('✅ Token有效，恢复用户状态')
                userStore.token = token
                userStore.user = userProfile
            } else {
                console.log('❌ Token无效，清除状态')
                userStore.user = null
                userStore.token = null
                localStorage.removeItem('token')
            }
        } catch (error) {
            console.error('❌ 初始化认证失败:', error)
            userStore.user = null
            userStore.token = null
            localStorage.removeItem('token')
        }
    }

    // 登出
    const logout = () => {
        console.log('🚪 用户登出')
        userStore.user = null
        userStore.token = null
        localStorage.removeItem('token')
    }

    return {
        isAuthenticated,
        currentUser,
        requireAuth,
        initAuth,
        logout,
        fetchUserProfile,
        validateToken
    }
}