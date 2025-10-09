import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/tools',
    name: 'Tools',
    component: () => import('@/views/tools/Tools.vue'),
    meta: { title: '工具列表' }
  },
  {
    path: '/tools/:id',
    name: 'ToolDetail',
    component: () => import('@/views/tools/ToolDetail.vue'),
    meta: { title: '工具详情' }
  },
  // 重定向分类页面到工具页面
  {
    path: '/categories',
    redirect: '/tools'
  },
  {
    path: '/categories/:id',
    redirect: (to) => {
      // 将分类ID作为查询参数传递给工具页面
      return {
        path: '/tools',
        query: { category: to.params.id }
      }
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search.vue'),
    meta: { title: '搜索结果' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginUnified.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterUnified.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/email-verification',
    name: 'EmailVerification',
    component: () => import('@/views/auth/EmailVerification.vue'),
    meta: { title: '邮箱验证' }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPasswordUnified.vue'),
    meta: { title: '忘记密码' }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/auth/ResetPasswordUnified.vue'),
    meta: { title: '重置密码' }
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: () => import('@/views/auth/AuthCallback.vue'),
    meta: { title: '登录处理中' }
  },

  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/user/Profile.vue'),
    meta: { title: '个人中心', requiresAuth: true }
  },
  {
    path: '/add-tool',
    name: 'AddTool',
    component: () => import('@/views/tools/AddTool.vue'),
    meta: { title: '添加工具', requiresAuth: true }
  },
  {
    path: '/dark-mode-demo',
    name: 'DarkModeDemo',
    component: () => import('@/views/DarkModeDemo.vue'),
    meta: { title: '暗模式演示' }
  },
  {
    path: '/auth-test',
    name: 'AuthTest',
    component: () => import('@/views/AuthTest.vue'),
    meta: { title: '认证测试' }
  },
  {
    path: '/login-debug',
    name: 'LoginDebug',
    component: () => import('@/views/LoginDebug.vue'),
    meta: { title: '登录调试' }
  },
  {
    path: '/auth-demo',
    name: 'AuthDemo',
    component: () => import('@/views/AuthDemo.vue'),
    meta: { title: '认证组件演示' }
  },
  {
    path: '/oauth-success',
    name: 'OAuthSuccess',
    component: () => import('@/views/OAuthSuccess.vue'),
    meta: { title: 'OAuth 登录成功' }
  },
  {
    path: '/config-check',
    name: 'ConfigCheck',
    component: () => import('@/views/ConfigCheck.vue'),
    meta: { title: 'OAuth 配置检查' }
  },
  {
    path: '/cookie-policy',
    name: 'CookiePolicy',
    component: () => import('@/views/legal/CookiePolicy.vue'),
    meta: { title: 'Cookie 政策' }
  },
  {
    path: '/disclaimer',
    name: 'Disclaimer',
    component: () => import('@/views/legal/Disclaimer.vue'),
    meta: { title: '免责声明' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Tool Hub`
  }
  
  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      next('/login')
      return
    }
  }
  
  next()
})

export default router