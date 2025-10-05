<template>
  <div class="relative">
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
        type="email"
        :required="required"
        :placeholder="placeholder"
        class="input-field pr-10"
        @input="handleInput"
        @keydown="handleKeydown"
        @blur="handleBlur"
        autocomplete="email"
      />

      <!-- 邮箱后缀建议下拉框 -->
      <div
        v-if="showSuggestions && suggestions.length > 0"
        class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto"
      >
        <div
          v-for="(suggestion, index) in suggestions"
          :key="suggestion"
          :class="[
            'px-4 py-2 cursor-pointer text-sm',
            index === selectedIndex
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
          ]"
          @click="selectSuggestion(suggestion)"
        >
          {{ suggestion }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Props {
  modelValue: string;
  label?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  inputId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: "邮箱地址",
  name: "email",
  placeholder: "请输入邮箱地址",
  required: true,
  inputId: "email",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

// 主流邮箱后缀，谷歌邮箱优先
const emailSuffixes = [
  "@gmail.com",
  "@qq.com",
  "@163.com",
  "@126.com",
  "@sina.com",
  "@hotmail.com",
  "@outlook.com",
  "@yahoo.com",
  "@foxmail.com",
  "@sohu.com",
];

const localValue = ref(props.modelValue);
const showSuggestions = ref(false);
const selectedIndex = ref(-1);

// 计算建议列表
const suggestions = computed(() => {
  if (!localValue.value || localValue.value.includes("@")) {
    return [];
  }

  return emailSuffixes.map((suffix) => localValue.value + suffix).slice(0, 5); // 只显示前5个建议
});

// 监听外部值变化
watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue;
  }
);

// 监听本地值变化并发射事件
watch(localValue, (newValue) => {
  emit("update:modelValue", newValue);
});

const handleInput = () => {
  showSuggestions.value = true;
  selectedIndex.value = -1;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!showSuggestions.value || suggestions.value.length === 0) {
    return;
  }

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      selectedIndex.value = Math.min(
        selectedIndex.value + 1,
        suggestions.value.length - 1
      );
      break;
    case "ArrowUp":
      event.preventDefault();
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1);
      break;
    case "Enter":
      event.preventDefault();
      if (selectedIndex.value >= 0) {
        selectSuggestion(suggestions.value[selectedIndex.value]);
      }
      break;
    case "Escape":
      showSuggestions.value = false;
      selectedIndex.value = -1;
      break;
    case "Tab":
      // Tab键自动完成第一个建议
      if (selectedIndex.value === -1 && suggestions.value.length > 0) {
        event.preventDefault();
        selectSuggestion(suggestions.value[0]);
      }
      break;
  }
};

const handleBlur = () => {
  // 延迟隐藏建议，以便点击建议项能够正常工作
  setTimeout(() => {
    showSuggestions.value = false;
    selectedIndex.value = -1;
  }, 200);
};

const selectSuggestion = (suggestion: string) => {
  localValue.value = suggestion;
  showSuggestions.value = false;
  selectedIndex.value = -1;
};
</script>