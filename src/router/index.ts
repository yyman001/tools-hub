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
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/views/categories/Categories.vue'),
    meta: { title: '分类' }
  },
  {
    path: '/categories/:id',
    name: 'CategoryDetail',
    component: () => import('@/views/categories/CategoryDetail.vue'),
    meta: { title: '分类详情' }
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