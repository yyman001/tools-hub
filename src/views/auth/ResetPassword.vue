<template>
  <div
    class="min-h-[calc(100vh-4rem)] bg-elevated flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2
          class="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-slate-100"
        >
          {{ $t("auth.resetPassword.title") }}
        </h2>
        <p class="mt-2 text-center text-sm text-muted">
          {{ $t("auth.resetPassword.description") }}
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
        <div class="space-y-4">
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              {{ $t("auth.resetPassword.newPassword") }}
            </label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="input-field mt-1"
              :placeholder="$t('auth.resetPassword.newPasswordPlaceholder')"
            />
          </div>

          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              {{ $t("auth.confirmPassword") }}
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="input-field mt-1"
              :placeholder="$t('auth.confirmPassword')"
            />
          </div>
        </div>

        <!-- 密码强度提示 -->
        <div
          class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            {{ $t("auth.resetPassword.passwordRequirements") }}
          </h3>
          <ul class="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li
              :class="{
                'text-green-600 dark:text-green-400': passwordChecks.length,
              }"
            >
              • {{ $t("auth.resetPassword.requirement1") }}
            </li>
            <li
              :class="{
                'text-green-600 dark:text-green-400': passwordChecks.hasLetter,
              }"
            >
              • {{ $t("auth.resetPassword.requirement2") }}
            </li>
            <li
              :class="{
                'text-green-600 dark:text-green-400': passwordChecks.hasNumber,
              }"
            >
              • {{ $t("auth.resetPassword.requirement3") }}
            </li>
          </ul>
        </div>

        <div
          v-if="errorMessage"
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <p class="text-red-600 dark:text-red-400 text-sm text-center">
            {{ errorMessage }}
          </p>
          <div
            v-if="retryCount < maxRetries && !isLoading"
            class="mt-3 text-center"
          >
            <button
              @click="handleResetPassword"
              class="text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 underline"
            >
              重试 ({{ retryCount + 1 }}/{{ maxRetries }})
            </button>
          </div>
        </div>

        <div
          v-if="successMessage"
          class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
        >
          <p class="text-green-600 dark:text-green-400 text-sm text-center">
            {{ successMessage }}
          </p>
        </div>

        <!-- 加载状态详细显示 -->
        <div
          v-if="isLoading"
          class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <div class="flex items-center justify-center space-x-2">
            <div
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"
            ></div>
            <span class="text-blue-600 dark:text-blue-400 text-sm">
              {{ $t("auth.resetPassword.updating") }}
            </span>
          </div>
          <p class="text-xs text-blue-500 dark:text-blue-300 text-center mt-2">
            请稍候，正在安全地更新您的密码...
          </p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !isPasswordValid"
            class="w-full btn-primary disabled:opacity-50"
          >
            {{
              isLoading
                ? $t("auth.resetPassword.updating")
                : $t("auth.resetPassword.updatePassword")
            }}
          </button>
        </div>

        <div class="text-center">
          <router-link
            to="/login"
            class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
          >
            {{ $t("auth.resetPassword.backToLogin") }}
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/stores";
import { getAuthErrorMessage } from "@/utils/authErrors";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const userStore = useUserStore();

const form = ref({
  password: "",
  confirmPassword: "",
});

const errorMessage = ref("");
const successMessage = ref("");
const isLoading = ref(false);
const retryCount = ref(0);
const maxRetries = 3;

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

// 重置密码
const handleResetPassword = async () => {
  // 防止重复提交
  if (isLoading.value) {
    console.log("⚠️ 正在处理中，忽略重复提交");
    return;
  }

  if (!form.value.password || !form.value.confirmPassword) {
    errorMessage.value = t("auth.errors.required");
    return;
  }

  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = t("auth.errors.passwordMismatch");
    return;
  }

  if (form.value.password.length < 6) {
    errorMessage.value = t("auth.errors.passwordTooShort");
    return;
  }

  console.log("🚀 开始密码重置流程");
  isLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    console.log("🔐 开始更新密码...");

    // 先检查当前会话状态
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("❌ 获取会话失败:", sessionError);
      errorMessage.value = "会话已失效，请重新申请密码重置";
      isLoading.value = false;
      return;
    }

    if (!session) {
      console.error("❌ 没有有效会话");
      errorMessage.value = "会话已失效，请重新申请密码重置";
      isLoading.value = false;
      return;
    }

    console.log("✅ 会话有效，用户:", session.user?.email);
    console.log("�  会话详情:", {
      userId: session.user?.id,
      email: session.user?.email,
      accessToken: session.access_token?.substring(0, 20) + "...",
      expiresAt: session.expires_at,
      tokenType: session.token_type,
    });
    console.log("🔄 正在更新密码...");

    // 添加超时处理
    const updatePromise = supabase.auth.updateUser({
      password: form.value.password,
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("请求超时，请重试")), 30000); // 30秒超时
    });

    console.log("📡 发送密码更新请求...");
    const result = await Promise.race([updatePromise, timeoutPromise]);
    const { data, error } = result;

    if (error) {
      console.error("❌ 更新密码失败:", error);
      console.error("错误详情:", {
        message: error.message,
        status: error.status,
        code: error.code || "unknown",
      });

      retryCount.value++;

      if (retryCount.value < maxRetries) {
        errorMessage.value = `${getAuthErrorMessage(error)} (尝试 ${
          retryCount.value
        }/${maxRetries})`;
      } else {
        errorMessage.value = `${getAuthErrorMessage(
          error
        )} - 已达到最大重试次数，请重新申请密码重置`;
      }
    } else {
      console.log("✅ 密码更新成功!");
      console.log("更新结果:", data);
      successMessage.value = t("auth.resetPassword.success");

      // 更新用户信息
      try {
        await userStore.fetchProfile();
        console.log("✅ 用户信息更新成功");
      } catch (profileError) {
        console.error("更新用户信息失败:", profileError);
        // 不影响密码重置成功的流程
      }

      // 3秒后跳转到首页
      setTimeout(() => {
        console.log("🏠 跳转到首页");
        router.push("/");
      }, 3000);
    }
  } catch (error: any) {
    console.error("❌ 更新密码异常:", error);
    console.error("异常详情:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    errorMessage.value = error.message || "网络错误，请检查网络连接";
  } finally {
    console.log("🏁 密码重置流程结束");
    isLoading.value = false;
  }
};

// 检查是否有有效的重置会话
onMounted(async () => {
  try {
    console.log("🔍 检查重置密码会话...");
    console.log("当前URL:", window.location.href);
    console.log("URL Hash:", window.location.hash);

    // 检查URL中是否包含access_token
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get("access_token");
    const refreshToken = urlParams.get("refresh_token");
    const tokenType = urlParams.get("token_type");
    const type = urlParams.get("type");

    console.log("URL参数:", {
      accessToken: accessToken ? accessToken.substring(0, 20) + "..." : null,
      refreshToken: refreshToken ? refreshToken.substring(0, 20) + "..." : null,
      tokenType,
      type,
    });

    // 如果URL中有token，尝试设置会话
    if (accessToken && type === "recovery") {
      console.log("🔑 检测到密码重置token，设置会话...");

      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || "",
      });

      if (error) {
        console.error("设置会话失败:", error);
        errorMessage.value = "重置链接无效或已过期，请重新申请密码重置";
        return;
      }

      console.log("✅ 会话设置成功:", data.session?.user?.email);
    }

    // 再次检查会话状态
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("获取会话失败:", sessionError);
      errorMessage.value = "会话验证失败，请重新申请密码重置";
      return;
    }

    if (!session) {
      console.log("❌ 没有有效的重置会话");
      errorMessage.value = "没有有效的重置会话，请先申请密码重置";
      setTimeout(() => {
        router.push("/forgot-password");
      }, 3000);
    } else {
      console.log("✅ 检测到有效的密码重置会话:", session.user?.email);
    }
  } catch (error) {
    console.error("检查会话异常:", error);
    errorMessage.value = "检查会话时发生错误，请重新申请密码重置";
  }
});
</script>