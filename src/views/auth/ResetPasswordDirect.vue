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

        <!-- 状态信息 -->
        <div
          v-if="tokenStatus"
          class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3"
        >
          <p class="text-xs text-gray-600 dark:text-gray-400">
            Token状态: {{ tokenStatus }}
          </p>
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
import { supabase } from "@/lib/supabase";
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
const tokenStatus = ref("");
const hasValidToken = ref(false);

let accessToken = "";
let refreshToken = "";

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

// 直接重置密码，绕过会话检查
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

  try {
    console.log("🚀 开始直接重置密码（绕过会话检查）...");

    // 方法1: 先设置会话，然后立即更新密码
    console.log("🔑 设置会话...");
    const { data: sessionData, error: sessionError } =
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || undefined,
      });

    if (sessionError) {
      console.error("❌ 设置会话失败:", sessionError);
      errorMessage.value = "设置会话失败：" + sessionError.message;
      return;
    }

    console.log("✅ 会话设置成功，立即更新密码...");

    // 立即更新密码，不等待或检查会话状态
    const { data: updateData, error: updateError } =
      await supabase.auth.updateUser({
        password: form.value.password,
      });

    if (updateError) {
      console.error("❌ 更新密码失败:", updateError);
      errorMessage.value = "更新密码失败：" + updateError.message;
    } else {
      console.log("✅ 密码更新成功!");
      successMessage.value = "密码更新成功！3秒后跳转到首页...";

      // 清除URL中的敏感信息
      window.history.replaceState({}, document.title, window.location.pathname);

      // 更新用户信息（可选，如果失败也不影响主流程）
      try {
        await userStore.fetchProfile();
      } catch (profileError) {
        console.error("更新用户信息失败（不影响密码重置）:", profileError);
      }

      // 3秒后跳转
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  } catch (error: any) {
    console.error("❌ 重置密码异常:", error);
    errorMessage.value = "重置密码时发生错误：" + error.message;
  } finally {
    isLoading.value = false;
  }
};

// 页面加载时处理
onMounted(async () => {
  console.log("📄 重置密码页面加载（直接模式）");

  try {
    // 从URL提取token
    const hash = window.location.hash.substring(1);
    if (!hash) {
      tokenStatus.value = "❌ URL中没有hash参数";
      errorMessage.value = "没有找到重置token，请重新申请密码重置";
      return;
    }

    const params = new URLSearchParams(hash);
    accessToken = params.get("access_token") || "";
    refreshToken = params.get("refresh_token") || "";
    const type = params.get("type") || "";

    console.log("解析的参数:", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      type,
    });

    if (!accessToken) {
      tokenStatus.value = "❌ 没有找到access_token";
      errorMessage.value = "重置链接无效，请重新申请密码重置";
      return;
    }

    if (type !== "recovery") {
      tokenStatus.value = "❌ token类型不是recovery: " + type;
      errorMessage.value = "token类型错误，请重新申请密码重置";
      return;
    }

    tokenStatus.value = "✅ 找到有效的重置token";
    hasValidToken.value = true;

    console.log("✅ Token验证成功，可以进行密码重置");
  } catch (error: any) {
    console.error("❌ 处理token异常:", error);
    tokenStatus.value = "❌ 处理token异常: " + error.message;
    errorMessage.value = "处理重置链接时发生错误：" + error.message;
  }
});
</script>