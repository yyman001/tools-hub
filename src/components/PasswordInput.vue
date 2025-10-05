<template>
  <div>
    <label
      :for="inputId"
      class="block text-sm font-medium text-gray-700 dark:text-slate-300"
    >
      {{ label }}
    </label>
    <div class="relative mt-1">
      <input
        :id="inputId"
        v-model="localValue"
        :name="name"
        :type="showPassword ? 'text' : 'password'"
        :required="required"
        :placeholder="placeholder"
        class="input-field pr-10"
        :autocomplete="autocomplete"
      />
      
      <!-- 显示/隐藏密码按钮 -->
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        @click="togglePasswordVisibility"
        :title="showPassword ? '隐藏密码' : '显示密码'"
      >
        <!-- 眼睛图标 - 显示密码 -->
        <svg
          v-if="!showPassword"
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        
        <!-- 眼睛斜杠图标 - 隐藏密码 -->
        <svg
          v-else
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
          />
        </svg>
      </button>
    </div>
    
    <!-- 密码强度指示器（可选） -->
    <div v-if="showStrengthIndicator && localValue" class="mt-2">
      <div class="flex items-center space-x-2">
        <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            :class="[
              'h-2 rounded-full transition-all duration-300',
              strengthColor
            ]"
            :style="{ width: strengthPercentage + '%' }"
          ></div>
        </div>
        <span :class="['text-xs font-medium', strengthTextColor]">
          {{ strengthText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue: string
  label?: string
  name?: string
  placeholder?: string
  required?: boolean
  inputId?: string
  autocomplete?: string
  showStrengthIndicator?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '密码',
  name: 'password',
  placeholder: '请输入密码',
  required: true,
  inputId: 'password',
  autocomplete: 'current-password',
  showStrengthIndicator: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const localValue = ref(props.modelValue)
const showPassword = ref(false)

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
})

// 监听本地值变化并发射事件
watch(localValue, (newValue) => {
  emit('update:modelValue', newValue)
})

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 密码强度计算
const passwordStrength = computed(() => {
  const password = localValue.value
  if (!password) return 0
  
  let score = 0
  
  // 长度检查
  if (password.length >= 8) score += 25
  if (password.length >= 12) score += 25
  
  // 字符类型检查
  if (/[a-z]/.test(password)) score += 10
  if (/[A-Z]/.test(password)) score += 10
  if (/[0-9]/.test(password)) score += 10
  if (/[^A-Za-z0-9]/.test(password)) score += 20
  
  return Math.min(score, 100)
})

const strengthPercentage = computed(() => passwordStrength.value)

const strengthColor = computed(() => {
  const strength = passwordStrength.value
  if (strength < 30) return 'bg-red-500'
  if (strength < 60) return 'bg-yellow-500'
  if (strength < 80) return 'bg-blue-500'
  return 'bg-green-500'
})

const strengthTextColor = computed(() => {
  const strength = passwordStrength.value
  if (strength < 30) return 'text-red-600 dark:text-red-400'
  if (strength < 60) return 'text-yellow-600 dark:text-yellow-400'
  if (strength < 80) return 'text-blue-600 dark:text-blue-400'
  return 'text-green-600 dark:text-green-400'
})

const strengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength < 30) return '弱'
  if (strength < 60) return '中等'
  if (strength < 80) return '强'
  return '很强'
})
</script>