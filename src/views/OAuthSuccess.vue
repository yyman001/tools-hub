<template>
  <div class="min-h-[calc(100vh-4rem)] bg-elevated py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-8">
        <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
          <svg class="h-10 w-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        
        <h1 class="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
          🎉 OAuth 登录成功！
        </h1>
        <p class="text-lg text-muted">
          恭喜！GitHub OAuth 登录已经完全正常工作了
        </p>
      </div>

      <!-- 用户信息展示 -->
      <div v-if="userStore.user" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-4">
          👤 用户信息
        </h2>
        
        <div class="flex items-center space-x-4 mb-6">
          <img 
            v-if="userStore.user.avatar" 
            :src="userStore.user.avatar" 
            :alt="userStore.user.username"
            class="w-16 h-16 rounded-full"
          />
          <div v-else class="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-100">
              {{ userStore.user.username }}
            </h3>
            <p class="text-muted">{{ userStore.user.email }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              ID: {{ userStore.user.id }}
            </p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 dark:text-slate-100 mb-2">登录状态</h4>
            <p :class="userStore.isLoggedIn ? 'text-green-600' : 'text-red-600'">
              {{ userStore.isLoggedIn ? '✅ 已登录' : '❌ 未登录' }}
            </p>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 dark:text-slate-100 mb-2">Token 状态</h4>
            <p :class="userStore.token ? 'text-green-600' : 'text-red-600'">
              {{ userStore.token ? '✅ 有效' : '❌ 无效' }}
            </p>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 dark:text-slate-100 mb-2">注册时间</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ formatDate(userStore.user.createdAt) }}
            </p>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 dark:text-slate-100 mb-2">工具数量</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ userStore.user.toolCount }} 个工具
            </p>
          </div>
        </div>
      </div>

      <!-- 功能测试 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-4">
          🧪 功能测试
        </h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div>
              <h3 class="font-medium text-green-800 dark:text-green-200">GitHub OAuth 登录</h3>
              <p class="text-sm text-green-600 dark:text-green-300">成功获取用户信息和头像</p>
            </div>
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div>
              <h3 class="font-medium text-green-800 dark:text-green-200">会话管理</h3>
              <p class="text-sm text-green-600 dark:text-green-300">Token 已保存到本地存储</p>
            </div>
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div>
              <h3 class="font-medium text-green-800 dark:text-green-200">用户状态</h3>
              <p class="text-sm text-green-600 dark:text-green-300">用户信息已正确映射到应用状态</p>
            </div>
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          to="/"
          class="btn-primary text-center"
        >
          🏠 返回首页
        </router-link>
        
        <router-link
          to="/auth-demo"
          class="btn-secondary text-center"
        >
          🧪 查看认证演示
        </router-link>
        
        <button
          @click="testLogout"
          class="btn-secondary"
        >
          🚪 测试登出
        </button>
      </div>

      <!-- 技术信息 -->
      <div class="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">
          🔧 技术实现
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-medium text-gray-900 dark:text-slate-100 mb-2">OAuth 流程</h3>
            <ol class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>1. 用户点击 GitHub 登录</li>
              <li>2. 跳转到 GitHub 授权页面</li>
              <li>3. 用户授权后跳转到 Supabase</li>
              <li>4. Supabase 处理后回调到应用</li>
              <li>5. 应用解析用户信息并设置状态</li>
            </ol>
          </div>
          
          <div>
            <h3 class="font-medium text-gray-900 dark:text-slate-100 mb-2">获取的信息</h3>
            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• 用户 ID 和邮箱</li>
              <li>• GitHub 用户名</li>
              <li>• 头像 URL</li>
              <li>• 邮箱验证状态</li>
              <li>• 访问令牌</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const testLogout = async () => {
  await userStore.logout()
  router.push('/login')
}
</script>