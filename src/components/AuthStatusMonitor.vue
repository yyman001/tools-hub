<template>
  <div v-if="showMonitor" class="fixed bottom-4 right-4 z-50">
    <div
      class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 max-w-sm"
    >
      <div class="flex items-center justify-between mb-2">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white">
          认证状态
        </h4>
        <button
          @click="showMonitor = false"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <div class="space-y-2 text-xs">
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">模式:</span>
          <span class="font-medium text-green-600 dark:text-green-400">
            SDK
          </span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">状态:</span>
          <span class="font-medium" :class="statusClass">
            {{ isAuthenticated ? "已登录" : "未登录" }}
          </span>
        </div>

        <div v-if="isAuthenticated && tokenInfo" class="space-y-1">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Token:</span>
            <span class="font-medium" :class="tokenStatusClass">
              {{ tokenStatus }}
            </span>
          </div>

          <div v-if="tokenInfo.exp" class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">过期:</span>
            <span class="text-gray-800 dark:text-gray-200">
              {{ formatExpireTime(tokenInfo.exp) }}
            </span>
          </div>
        </div>

        <div
          v-if="isAuthenticated"
          class="pt-2 border-t border-gray-200 dark:border-gray-600"
        >
          <button
            @click="handleRefreshToken"
            :disabled="isRefreshing"
            class="w-full text-xs bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-2 py-1 rounded"
          >
            {{ isRefreshing ? "刷新中..." : "手动刷新Token" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useAuth } from "@/composables/useAuth";

const { isAuthenticated, refreshToken } = useAuth();

const showMonitor = ref(false);
const isRefreshing = ref(false);
const tokenInfo = ref<TokenInfo | null>(null);

// Token信息接口
interface TokenInfo {
  exp: number;
  iat: number;
  sub: string;
  email: string;
}

// 计算属性

const statusClass = computed(() => {
  return isAuthenticated.value
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";
});

const tokenStatus = computed(() => {
  if (!tokenInfo.value) return "无效";

  const now = Math.floor(Date.now() / 1000);
  const exp = tokenInfo.value.exp;

  if (!exp) return "未知";

  if (exp < now) return "已过期";

  const timeLeft = exp - now;
  if (timeLeft < 300) return "即将过期"; // 5分钟内

  return "有效";
});

const tokenStatusClass = computed(() => {
  const status = tokenStatus.value;
  if (status === "有效") return "text-green-600 dark:text-green-400";
  if (status === "即将过期") return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
});

// 解码JWT payload的工具函数
const decodeJWTPayload = (payloadBase64: string): TokenInfo => {
  // 规范化 base64 (URL-safe base64 to standard base64)
  const normalizedBase64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");

  // 添加padding
  const paddedBase64 = normalizedBase64.padEnd(
    normalizedBase64.length + ((4 - (normalizedBase64.length % 4)) % 4),
    "="
  );

  try {
    // 首先尝试标准解码
    const decodedString = atob(paddedBase64);
    return JSON.parse(decodedString);
  } catch (error) {
    // 如果标准解码失败，尝试使用TextDecoder进行UTF-8解码
    try {
      const binaryString = atob(paddedBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const decoder = new TextDecoder("utf-8");
      const decodedString = decoder.decode(bytes);
      return JSON.parse(decodedString);
    } catch (safeDecodeError) {
      throw new Error("Token payload解码失败");
    }
  }
};

// 检查token是否过期的工具函数
const isTokenExpired = (token: TokenInfo | null): boolean => {
  if (!token || !token.exp) return true;
  return Math.floor(Date.now() / 1000) >= token.exp;
};

// 解析token信息
const parseTokenInfo = (): void => {
  try {
    const token = localStorage.getItem("token");
    console.log(
      "🔍 解析token:",
      token ? `${token.substring(0, 20)}...` : "null"
    );

    if (!token) {
      console.log("❌ 没有找到token");
      tokenInfo.value = null;
      return;
    }

    // 检查是否是调试token
    if (token === "debug-token" || !token.includes(".")) {
      console.log("🔧 检测到调试token，使用模拟数据");
      const now = Math.floor(Date.now() / 1000);
      tokenInfo.value = {
        exp: now + 3600, // 1小时后过期
        iat: now,
        sub: "debug-user",
        email: "debug@example.com",
      };
      return;
    }

    // 检查JWT格式
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.warn("❌ Token格式不正确，不是有效的JWT，parts:", parts.length);
      tokenInfo.value = null;
      return;
    }

    // 解码并验证payload
    try {
      const payload = decodeJWTPayload(parts[1]);

      // 验证token是否过期
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        console.warn("❌ Token已过期");
        tokenInfo.value = null;
        return;
      }

      console.log("✅ Token解析成功:", {
        exp: payload.exp,
        iat: payload.iat,
        email: payload.email,
      });
      tokenInfo.value = payload;
    } catch (error) {
      console.error("❌ Token解析失败:", error);
      tokenInfo.value = null;
    }
  } catch (error) {
    console.error("解析token失败:", error);
    tokenInfo.value = null;
  }
};

// 格式化过期时间
const formatExpireTime = (exp: number) => {
  const date = new Date(exp * 1000);
  const now = new Date();

  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 0) return "已过期";
  if (diffMins < 60) return `${diffMins}分钟后`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}小时后`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}天后`;
};

// 手动刷新token
const handleRefreshToken = async () => {
  isRefreshing.value = true;
  try {
    console.log("🔄 开始手动刷新token...");
    const result = await refreshToken();

    if (result && !result.error) {
      console.log("✅ Token刷新成功");
      // 等待一小段时间确保token已保存
      await new Promise((resolve) => setTimeout(resolve, 100));
      parseTokenInfo();
    } else {
      console.error("❌ Token刷新失败:", result?.error);
      tokenInfo.value = null;
    }
  } catch (error) {
    console.error("刷新token失败:", error);
    tokenInfo.value = null;
  } finally {
    isRefreshing.value = false;
  }
};

// 定时更新token信息
let updateTimer: NodeJS.Timeout | null = null;

onMounted(() => {
  // 检查是否应该显示监控器（开发模式或用户手动启用）
  const shouldShow =
    import.meta.env.DEV || localStorage.getItem("show_auth_monitor") === "true";
  showMonitor.value = shouldShow;

  // 延迟解析token，避免初始化时的问题
  setTimeout(() => {
    parseTokenInfo();
  }, 500);

  // 每30秒更新一次token信息
  updateTimer = setInterval(() => {
    parseTokenInfo();
  }, 30000);

  // 监听storage变化
  window.addEventListener("storage", parseTokenInfo);

  // 监听外部切换事件
  window.addEventListener("toggle-auth-monitor", (event: any) => {
    showMonitor.value = event.detail.show;
  });
});

onUnmounted(() => {
  if (updateTimer) {
    clearInterval(updateTimer);
  }
  window.removeEventListener("storage", parseTokenInfo);
  window.removeEventListener("toggle-auth-monitor", () => {});
});

// 暴露方法给外部使用
defineExpose({
  show: () => {
    showMonitor.value = true;
  },
  hide: () => {
    showMonitor.value = false;
  },
  toggle: () => {
    showMonitor.value = !showMonitor.value;
  },
});
</script>