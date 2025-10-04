<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        🔧 Supabase 连接测试
      </h1>
      
      <div class="space-y-4">
        <!-- 环境变量检查 -->
        <div class="border rounded-lg p-4">
          <h2 class="text-lg font-semibold mb-2 flex items-center">
            <span class="mr-2">📋</span>
            环境变量检查
          </h2>
          <div class="space-y-2 text-sm">
            <div class="flex items-center">
              <span class="w-4 h-4 mr-2" :class="urlStatus.icon"></span>
              <span class="font-mono">VITE_SUPABASE_URL:</span>
              <span class="ml-2" :class="urlStatus.class">{{ urlStatus.text }}</span>
            </div>
            <div class="flex items-center">
              <span class="w-4 h-4 mr-2" :class="keyStatus.icon"></span>
              <span class="font-mono">VITE_SUPABASE_ANON_KEY:</span>
              <span class="ml-2" :class="keyStatus.class">{{ keyStatus.text }}</span>
            </div>
          </div>
        </div>

        <!-- 连接测试 -->
        <div class="border rounded-lg p-4">
          <h2 class="text-lg font-semibold mb-2 flex items-center">
            <span class="mr-2">🔗</span>
            连接测试
          </h2>
          <div class="space-y-2">
            <button 
              @click="testConnection"
              :disabled="isLoading"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {{ isLoading ? '测试中...' : '测试连接' }}
            </button>
            
            <div v-if="connectionResult" class="mt-4 p-3 rounded" :class="connectionResult.class">
              <div class="font-semibold">{{ connectionResult.title }}</div>
              <div class="text-sm mt-1">{{ connectionResult.message }}</div>
              <div v-if="connectionResult.details" class="text-xs mt-2 opacity-75">
                {{ connectionResult.details }}
              </div>
            </div>
          </div>
        </div>

        <!-- 数据库测试 -->
        <div class="border rounded-lg p-4">
          <h2 class="text-lg font-semibold mb-2 flex items-center">
            <span class="mr-2">🗄️</span>
            数据库测试
          </h2>
          <div class="space-y-2">
            <button 
              @click="testDatabase"
              :disabled="isLoading"
              class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {{ isLoading ? '测试中...' : '测试数据库' }}
            </button>
            
            <div v-if="dbResult" class="mt-4 p-3 rounded" :class="dbResult.class">
              <div class="font-semibold">{{ dbResult.title }}</div>
              <div class="text-sm mt-1">{{ dbResult.message }}</div>
              <div v-if="dbResult.data" class="text-xs mt-2 font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
                {{ JSON.stringify(dbResult.data, null, 2) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 认证测试 -->
        <div class="border rounded-lg p-4">
          <h2 class="text-lg font-semibold mb-2 flex items-center">
            <span class="mr-2">🔐</span>
            认证测试
          </h2>
          <div class="space-y-2">
            <div class="grid grid-cols-2 gap-4">
              <input 
                v-model="testEmail"
                type="email"
                placeholder="测试邮箱"
                class="px-3 py-2 border rounded"
              >
              <input 
                v-model="testPassword"
                type="password"
                placeholder="测试密码"
                class="px-3 py-2 border rounded"
              >
            </div>
            <div class="space-x-2">
              <button 
                @click="testRegister"
                :disabled="isLoading"
                class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
              >
                测试注册
              </button>
              <button 
                @click="testLogin"
                :disabled="isLoading"
                class="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
              >
                测试登录
              </button>
            </div>
            
            <div v-if="authResult" class="mt-4 p-3 rounded" :class="authResult.class">
              <div class="font-semibold">{{ authResult.title }}</div>
              <div class="text-sm mt-1">{{ authResult.message }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

const isLoading = ref(false)
const connectionResult = ref<any>(null)
const dbResult = ref<any>(null)
const authResult = ref<any>(null)
const testEmail = ref('test@example.com')
const testPassword = ref('123456')

// 环境变量状态
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const urlStatus = computed(() => {
  if (!supabaseUrl) {
    return { icon: '❌', class: 'text-red-600', text: '未设置' }
  }
  if (supabaseUrl.includes('your-project-id')) {
    return { icon: '⚠️', class: 'text-yellow-600', text: '需要替换' }
  }
  if (supabaseUrl.includes('supabase.co')) {
    return { icon: '✅', class: 'text-green-600', text: '已配置' }
  }
  return { icon: '❌', class: 'text-red-600', text: '格式错误' }
})

const keyStatus = computed(() => {
  if (!supabaseKey) {
    return { icon: '❌', class: 'text-red-600', text: '未设置' }
  }
  if (supabaseKey.includes('your-anon-key')) {
    return { icon: '⚠️', class: 'text-yellow-600', text: '需要替换' }
  }
  if (supabaseKey.startsWith('eyJ')) {
    return { icon: '✅', class: 'text-green-600', text: '已配置' }
  }
  return { icon: '❌', class: 'text-red-600', text: '格式错误' }
})

const testConnection = async () => {
  isLoading.value = true
  connectionResult.value = null
  
  try {
    const { data, error } = await supabase.from('categories').select('count').limit(1)
    
    if (error) {
      connectionResult.value = {
        title: '连接失败',
        message: error.message,
        details: '请检查网络连接和 Supabase 项目状态',
        class: 'bg-red-100 text-red-800 border border-red-200'
      }
    } else {
      connectionResult.value = {
        title: '连接成功',
        message: 'Supabase 连接正常',
        class: 'bg-green-100 text-green-800 border border-green-200'
      }
    }
  } catch (error: any) {
    connectionResult.value = {
      title: '连接异常',
      message: error.message || '未知错误',
      details: '可能是网络问题或配置错误',
      class: 'bg-red-100 text-red-800 border border-red-200'
    }
  } finally {
    isLoading.value = false
  }
}

const testDatabase = async () => {
  isLoading.value = true
  dbResult.value = null
  
  try {
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .limit(3)
    
    if (catError) {
      dbResult.value = {
        title: '数据库测试失败',
        message: catError.message,
        class: 'bg-red-100 text-red-800 border border-red-200'
      }
      return
    }

    const { data: tools, error: toolError } = await supabase
      .from('tools')
      .select('*')
      .limit(3)

    dbResult.value = {
      title: '数据库测试成功',
      message: `找到 ${categories?.length || 0} 个分类，${tools?.length || 0} 个工具`,
      data: {
        categories: categories?.length || 0,
        tools: tools?.length || 0,
        sample_category: categories?.[0] || null
      },
      class: 'bg-green-100 text-green-800 border border-green-200'
    }
  } catch (error: any) {
    dbResult.value = {
      title: '数据库测试异常',
      message: error.message || '未知错误',
      class: 'bg-red-100 text-red-800 border border-red-200'
    }
  } finally {
    isLoading.value = false
  }
}

const testRegister = async () => {
  if (!testEmail.value || !testPassword.value) {
    authResult.value = {
      title: '参数错误',
      message: '请输入邮箱和密码',
      class: 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    }
    return
  }

  isLoading.value = true
  authResult.value = null
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail.value,
      password: testPassword.value
    })
    
    if (error) {
      authResult.value = {
        title: '注册失败',
        message: error.message,
        class: 'bg-red-100 text-red-800 border border-red-200'
      }
    } else {
      authResult.value = {
        title: '注册成功',
        message: data.user ? '用户创建成功' : '请检查邮箱验证',
        class: 'bg-green-100 text-green-800 border border-green-200'
      }
    }
  } catch (error: any) {
    authResult.value = {
      title: '注册异常',
      message: error.message || '未知错误',
      class: 'bg-red-100 text-red-800 border border-red-200'
    }
  } finally {
    isLoading.value = false
  }
}

const testLogin = async () => {
  if (!testEmail.value || !testPassword.value) {
    authResult.value = {
      title: '参数错误',
      message: '请输入邮箱和密码',
      class: 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    }
    return
  }

  isLoading.value = true
  authResult.value = null
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail.value,
      password: testPassword.value
    })
    
    if (error) {
      authResult.value = {
        title: '登录失败',
        message: error.message,
        class: 'bg-red-100 text-red-800 border border-red-200'
      }
    } else {
      authResult.value = {
        title: '登录成功',
        message: `用户 ${data.user?.email} 登录成功`,
        class: 'bg-green-100 text-green-800 border border-green-200'
      }
    }
  } catch (error: any) {
    authResult.value = {
      title: '登录异常',
      message: error.message || '未知错误',
      class: 'bg-red-100 text-red-800 border border-red-200'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // 自动测试连接
  testConnection()
})
</script>