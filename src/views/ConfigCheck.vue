<template>
  <div class="min-h-[calc(100vh-4rem)] bg-elevated py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
          🔧 OAuth 配置检查
        </h1>
        <p class="text-lg text-muted">
          检查生产环境 OAuth 配置是否正确
        </p>
      </div>

      <!-- 环境信息 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-4">
          🌐 环境信息
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 dark:text-slate-100 mb-2">当前域名</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 break-all">{{ domainInfo.origin }}</p>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 dark:text-slate-100 mb-2">环境类型</h3>
            <p :class="environmentClass">{{ domainInfo.environment }}</p>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 dark:text-slate-100 mb-2">协议</h3>
            <p :class="domainInfo.isSecure ? 'text-green-600' : 'text-red-600'">
              {{ domainInfo.protocol }} {{ domainInfo.isSecure ? '✅' : '❌' }}
            </p>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 dark:text-slate-100 mb-2">端口</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ domainInfo.port || '默认' }}</p>
          </div>
        </div>
      </div>

      <!-- OAuth 重定向 URL -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-4">
          🔄 OAuth 重定向 URL
        </h2>
        
        <div class="space-y-4">
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 class="font-medium text-blue-800 dark:text-blue-200 mb-2">当前计算的重定向 URL</h3>
            <p class="text-sm text-blue-700 dark:text-blue-300 break-all font-mono">{{ oauthRedirectUrl }}</p>
          </div>
          
          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 class="font-medium text-yellow-800 dark:text-yellow-200 mb-2">密码重置 URL</h3>
            <p class="text-sm text-yellow-700 dark:text-yellow-300 break-all font-mono">{{ passwordResetUrl }}</p>
          </div>
        </div>
      </div>

      <!-- Supabase 配置 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-4">
          🗄️ Supabase 配置
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 dark:text-slate-100 mb-2">Supabase URL</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 break-all font-mono">{{ supabaseConfig.url }}</p>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 dark:text-slate-100 mb-2">Anon Key</h3>
            <p :class="supabaseConfig.hasAnonKey ? 'text-green-600' : 'text-red-600'">
              {{ supabaseConfig.hasAnonKey ? '✅ 已配置' : '❌ 未配置' }}
            </p>
          </div>
        </div>
      </div>

      <!-- 配置建议 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-4">
          💡 配置建议
        </h2>
        
        <div class="space-y-4">
          <div v-if="!domainInfo.isSecure && domainInfo.isProduction" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h3 class="font-medium text-red-800 dark:text-red-200 mb-2">⚠️ 安全警告</h3>
            <p class="text-sm text-red-700 dark:text-red-300">生产环境应该使用 HTTPS 协议</p>
          </div>
          
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 class="font-medium text-blue-800 dark:text-blue-200 mb-2">📋 Supabase 控制台配置</h3>
            <div class="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <p><strong>Site URL:</strong></p>
              <p class="font-mono bg-blue-100 dark:bg-blue-900/50 p-2 rounded">{{ domainInfo.origin }}</p>
              
              <p><strong>Redirect URLs:</strong></p>
              <div class="font-mono bg-blue-100 dark:bg-blue-900/50 p-2 rounded space-y-1">
                <p>{{ oauthRedirectUrl }}</p>
                <p>http://localhost:5173/auth/callback</p>
                <p>http://localhost:3000/auth/callback</p>
              </div>
            </div>
          </div>
          
          <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 class="font-medium text-green-800 dark:text-green-200 mb-2">🔗 OAuth 应用配置</h3>
            <div class="text-sm text-green-700 dark:text-green-300 space-y-2">
              <p><strong>GitHub OAuth 应用:</strong></p>
              <p>Homepage URL: <span class="font-mono">{{ domainInfo.origin }}</span></p>
              <p>Authorization callback URL: <span class="font-mono">{{ supabaseConfig.url }}/auth/v1/callback</span></p>
              
              <p class="mt-3"><strong>Google OAuth 应用:</strong></p>
              <p>Authorized JavaScript origins: <span class="font-mono">{{ domainInfo.origin }}</span></p>
              <p>Authorized redirect URIs: <span class="font-mono">{{ supabaseConfig.url }}/auth/v1/callback</span></p>
            </div>
          </div>
        </div>
      </div>

      <!-- 测试按钮 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="testGitHubLogin"
          class="btn-primary"
        >
          🐙 测试 GitHub 登录
        </button>
        
        <button
          @click="testGoogleLogin"
          class="btn-secondary"
        >
          🔐 测试 Google 登录
        </button>
        
        <router-link
          to="/login"
          class="btn-secondary text-center"
        >
          🏠 返回登录页面
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getDomainInfo, getOAuthRedirectUrl, getPasswordResetUrl, getSupabaseConfig } from '@/utils/environment'
import { supabase } from '@/lib/supabase'

const domainInfo = getDomainInfo()
const oauthRedirectUrl = getOAuthRedirectUrl()
const passwordResetUrl = getPasswordResetUrl()
const supabaseConfig = getSupabaseConfig()

const environmentClass = computed(() => {
  switch (domainInfo.environment) {
    case 'development':
      return 'text-blue-600 dark:text-blue-400'
    case 'preview':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'production':
      return 'text-green-600 dark:text-green-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
})

const testGitHubLogin = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: oauthRedirectUrl,
        scopes: 'user:email',
      }
    })
    
    if (error) {
      alert(`GitHub 登录失败: ${error.message}`)
    }
  } catch (error: any) {
    alert(`GitHub 登录异常: ${error.message}`)
  }
}

const testGoogleLogin = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: oauthRedirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    })
    
    if (error) {
      alert(`Google 登录失败: ${error.message}`)
    }
  } catch (error: any) {
    alert(`Google 登录异常: ${error.message}`)
  }
}
</script>