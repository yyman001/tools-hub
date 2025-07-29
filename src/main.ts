import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import i18n from './locales'
import App from './App.vue'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')

// 初始化暗模式
import { useDarkMode } from '@/composables/useDarkMode'
const { isDark } = useDarkMode()