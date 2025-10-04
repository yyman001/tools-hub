<template>
  <div
    class="min-h-[calc(100vh-4rem)] bg-elevated flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2
          class="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-slate-100"
        >
          重置密码
        </h2>
        <p class="mt-2 text-center text-sm text-muted">请输入您的新密码</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
        <div class="space-y-4">
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              新密码
            </label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="input-field mt-1"
              placeholder="请输入新密码"
            />
          </div>

          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              确认密码
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="input-field mt-1"
              placeholder="请再次输入密码"
            />
          </div>
        </div>

        <!-- 密码强度提示 -->
        <div
          class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            密码要求：
          </h3>
          <ul class="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li
              :class="{
                'text-green-600 dark:text-green-400': passwordChecks.length,
              }"
            >
              • 至少6个字符
            </li>
            <li
              :class="{
                'text-green-600 dark:text-green-400': passwordChecks.hasLetter,
              }"
            >
              • 包含字母
            </li>
            <li
              :class="{
                'text-green-600 dark:text-green-400': passwordChecks.hasNumber,
              }"
            >
              • 包含数字
            </li>
          </ul>
        </div>

        <!-- 调试信息 -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">调试信息:</p>
          <div class="text-xs space-y-1">
            <div>Token状态: {{ tokenStatus }}</div>
            <div>API状态: {{ apiStatus }}</div>
            <div v-if="debugInfo">{{ debugInfo }}</div>
          </div>
        </div>

        <div
          v-if="errorMessage"
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <p class="text-red-600 dark:text-red-400 text-sm text-center">
            {{ errorMessage }}
          </p>
        </div>

        <div
          v-if="successMessage"
          class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
        >
          <p class="text-green-600 dark:text-green-400 text-sm text-center">
            {{ successMessage }}
          </p>
        </div>

        <div
          v-if="isLoading"
          class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <div class="flex items-center justify-center space-x-2">
            <div
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"
            ></div>
            <span class="text-blue-600 dark:text-blue-400 text-sm">
              正在更新密码...
            </span>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !isPasswordValid || !hasValidToken"
            class="w-full btn-primary disabled:opacity-50"
          >
            {{ isLoading ? "更新中..." : "更新密码" }}
          </button>
        </div>

        <div class="text-center">
          <router-link
            to="/login"
            class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
          >
            返回登录
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores";

const router = useRouter();
const userStore = useUserStore();

const form = ref({
  password: "",
  confirmPassword: "",
});

const errorMessage = ref("");
const successMessage = ref("");
const isLoading = ref(false);
const tokenStatus = ref("检查中...");
const apiStatus = ref("等待中...");
const debugInfo = ref("");
const hasValidToken = ref(false);

let accessToken = "";
let refreshToken = "";
let supabaseUrl = "";
let supabaseAnonKey = "";

// 密码强度检查
const passwordChecks = computed(() => ({
  length: form.value.password.length >= 6,
  hasLetter: /[a-zA-Z]/.test(form.value.password),
  hasNumber: /\d/.test(form.value.password),
}));

const isPasswordValid = computed(() => {
  return (
    passwordChecks.value.length &&
    passwordChecks.value.hasLetter &&
    form.value.password === form.value.confirmPassword
  );
});

// 使用HTTP API直接更新密码
const updatePasswordViaHTTP = async (password: string, token: string) => {
  try {
    console.log("📡 使用HTTP API更新密码...");

    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        apikey: supabaseAnonKey,
      },
      body: JSON.stringify({
        password: password,
      }),
    });

    console.log("HTTP响应状态:", response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error("HTTP API错误:", errorData);
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    console.log("HTTP API成功响应:", data);

    return { data, error: null };
  } catch (error: any) {
    console.error("HTTP API异常:", error);
    return { data: null, error };
  }
};

// 重置密码
const handleResetPassword = async () => {
  if (!isPasswordValid.value) {
    errorMessage.value = "请检查密码输入";
    return;
  }

  if (!hasValidToken.value) {
    errorMessage.value = "没有有效的重置token";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";
  apiStatus.value = "更新密码中...";

  try {
    console.log("🚀 开始HTTP模式密码重置...");

    // 使用HTTP API直接更新密码
    const { data, error } = await updatePasswordViaHTTP(
      form.value.password,
      accessToken
    );

    if (error) {
      console.error("❌ HTTP API更新失败:", error);
      apiStatus.value = "更新失败";
      errorMessage.value = "HTTP API更新失败：" + error.message;
    } else {
      console.log("✅ HTTP API更新成功!");
      apiStatus.value = "更新成功";
      successMessage.value = "密码更新成功！3秒后跳转到首页...";

      // 清除URL中的敏感信息
      window.history.replaceState({}, document.title, window.location.pathname);

      // 3秒后跳转
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  } catch (error: any) {
    console.error("❌ 重置密码异常:", error);
    apiStatus.value = "异常错误";
    errorMessage.value = "重置密码时发生错误：" + error.message;
  } finally {
    isLoading.value = false;
  }
};

// 页面加载时处理
onMounted(async () => {
  console.log("📄 重置密码页面加载（HTTP模式）");

  try {
    // 获取环境变量
    supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      tokenStatus.value = "❌ 缺少环境变量";
      errorMessage.value = "缺少Supabase配置";
      return;
    }

    debugInfo.value = `URL: ${supabaseUrl.substring(0, 30)}...`;

    // 从URL提取token
    const hash = window.location.hash.substring(1);
    if (!hash) {
      tokenStatus.value = "❌ 没有hash参数";
      errorMessage.value = "没有找到重置token，请重新申请密码重置";
      return;
    }

    const params = new URLSearchParams(hash);
    accessToken = params.get("access_token") || "";
    refreshToken = params.get("refresh_token") || "";
    const type = params.get("type") || "";

    console.log("解析的参数:", {
      hasAccessToken: !!accessToken,
      tokenLength: accessToken.length,
      hasRefreshToken: !!refreshToken,
      type,
    });

    if (!accessToken) {
      tokenStatus.value = "❌ 没有access_token";
      errorMessage.value = "重置链接无效，请重新申请密码重置";
      return;
    }

    if (type !== "recovery") {
      tokenStatus.value = "❌ token类型错误: " + type;
      errorMessage.value = "token类型错误，请重新申请密码重置";
      return;
    }

    tokenStatus.value = "✅ 找到有效token";
    apiStatus.value = "准备就绪";
    hasValidToken.value = true;

    console.log("✅ Token验证成功，准备HTTP API调用");
  } catch (error: any) {
    console.error("❌ 初始化异常:", error);
    tokenStatus.value = "❌ 初始化异常";
    errorMessage.value = "初始化时发生错误：" + error.message;
  }
});
</script>