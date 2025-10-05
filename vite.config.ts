import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-i18n': ['vue-i18n']
        }
      }
    },
    // 确保静态资源正确处理
    assetsDir: 'assets',
    // 优化构建 - 使用 esbuild 压缩
    minify: 'esbuild',
    // 移除 console 和 debugger
    esbuild: {
      drop: ['console', 'debugger']
    }
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['vue-i18n']
  }
})