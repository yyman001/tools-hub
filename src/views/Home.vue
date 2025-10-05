<template>
  <div>
    <!-- 主要内容 -->
    <main>
      <!-- Hero 区域 -->
      <section class="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-dark-accent-blue dark:to-dark-accent-purple text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            {{ $t("home.title") }}
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-primary-100 dark:text-white/90">
            {{ $t("home.subtitle") }}
          </p>

          <!-- 搜索框 -->
          <div class="max-w-2xl mx-auto">
            <div class="relative">
              <input
                v-model="searchKeyword"
                @keyup.enter="handleSearch"
                type="text"
                :placeholder="$t('home.searchPlaceholder')"
                class="w-full px-6 py-4 text-lg text-gray-900 dark:text-primary bg-white dark:bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-primary-400 border-0 shadow-lg"
              />
              <button
                @click="handleSearch"
                class="absolute right-2 top-2 bg-primary-600 hover:bg-primary-700 dark:bg-dark-accent-blue dark:hover:bg-dark-accent-blue/80 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {{ $t("common.search") }}
              </button>
            </div>
          </div>
        </div>
      </section>



      <!-- 最新工具 -->
      <section class="py-20 bg-elevated">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-primary">
              {{ $t("home.latestTools") }}
            </h2>
            <router-link
              to="/tools"
              class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              {{ $t("home.viewAll") }}
            </router-link>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="tool in stats.recentTools"
              :key="tool.id"
              class="card hover:shadow-md hover-bg transition-all duration-200 cursor-pointer"
              @click="$router.push(`/tools/${tool.id}`)"
            >
              <div class="flex items-start space-x-4">
                <div
                  class="w-12 h-12 bg-gray-200 dark:bg-elevated rounded-lg flex items-center justify-center"
                >
                  🔧
                </div>
                <div class="flex-1">
                  <h3
                    class="font-semibold mb-1 text-gray-900 dark:text-primary"
                  >
                    {{ tool.name }}
                  </h3>
                  <p class="text-sm text-muted mb-2">
                    {{ tool.description }}
                  </p>
                  <div class="flex items-center text-xs text-subtle">
                    <span>⭐ {{ tool.rating }}</span>
                    <span class="mx-2">•</span>
                    <span>👀 {{ tool.viewCount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import ApiService from "@/api";

const router = useRouter();

const searchKeyword = ref("");
const stats = ref({
  recentTools: [],
});

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchKeyword.value)}`);
  }
};

const fetchStats = async () => {
  try {
    const response = await ApiService.getDashboardStats();
    if (response.code === 200) {
      stats.value = response.data;
    }
  } catch (error) {
    console.error("获取统计数据失败:", error);
  }
};

onMounted(() => {
  fetchStats();
});
</script>