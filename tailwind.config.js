/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        },
        // Cursor风格的温暖暗模式配色方案
        dark: {
          // 背景层次 - 温暖的深灰色调
          bg: {
            primary: '#1a1b26',      // 主背景 - 温暖的深灰蓝
            secondary: '#24283b',    // 次级背景 - 中等深灰
            tertiary: '#2f334d',     // 三级背景 - 卡片背景
            elevated: '#414868',     // 提升背景 - 悬停状态
            surface: '#565a6e',      // 表面背景 - 输入框等
          },
          // 文字层次 - 温暖的白色调
          text: {
            primary: '#c0caf5',      // 主要文字 - 温暖的白色
            secondary: '#a9b1d6',    // 次要文字 - 柔和的灰白
            tertiary: '#9aa5ce',     // 三级文字 - 中等对比度
            muted: '#7982a9',        // 静音文字 - 低对比度
            subtle: '#565a6e',       // 微妙文字 - 最低对比度
          },
          // 边框层次 - 温暖的边框色
          border: {
            primary: '#414868',      // 主要边框
            secondary: '#565a6e',    // 次要边框
            light: '#7982a9',        // 轻边框
          },
          // 状态颜色 - 保持原有的强调色
          accent: {
            blue: '#7aa2f7',         // 蓝色强调 - 更温暖的蓝色
            green: '#9ece6a',        // 绿色强调 - 更柔和的绿色
            yellow: '#e0af68',       // 黄色强调 - 更温暖的黄色
            red: '#f7768e',          // 红色强调 - 更柔和的红色
            purple: '#bb9af7',       // 紫色强调 - 更温暖的紫色
          }
        }
      }
    }
  },
  plugins: []
}