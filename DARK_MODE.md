# Tool Hub 暗模式功能文档

## 🌙 暗模式设计理念

Tool Hub 的暗模式采用了优雅的磨砂黑配色方案，避免纯黑色带来的视觉疲劳，同时确保文字清晰可读，不会刺眼。

## 🎨 配色方案

### 主要颜色
- **主背景**: `#0f1419` (dark-primary) - 深蓝灰色，温和不刺眼
- **次要背景**: `#1a1f2e` (dark-secondary) - 稍亮的背景色
- **卡片背景**: `#1e2532` (dark-card) - 卡片和组件背景
- **三级背景**: `#252a3a` (dark-tertiary) - 输入框等元素背景
- **悬停背景**: `#2a3441` (dark-hover) - 悬停状态背景

### 文字颜色
- **主要文字**: `#e2e8f0` (dark-primary) - 高对比度，易读
- **次要文字**: `#cbd5e1` (dark-secondary) - 中等对比度
- **辅助文字**: `#94a3b8` (dark-muted) - 低对比度，用于提示文字

### 边框颜色
- **主边框**: `#334155` (dark-border) - 主要分割线
- **浅边框**: `#475569` (dark-border-light) - 次要分割线

## 🔧 技术实现

### Tailwind CSS 配置
```javascript
// tailwind.config.js
export default {
  darkMode: 'class', // 使用 class 策略
  theme: {
    extend: {
      colors: {
        // 暗模式专用颜色定义
        dark: { /* ... */ }
      }
    }
  }
}
```

### 暗模式管理 Composable
```typescript
// src/composables/useDarkMode.ts
export function useDarkMode() {
  const isDark = ref(false)
  
  // 智能主题检测
  // 用户设置 > 浏览器偏好 > 默认亮模式
  
  return {
    isDark,
    toggleDark,
    setDark
  }
}
```

## 🎯 核心特性

### 智能主题检测
1. **用户偏好优先**: localStorage 中保存的用户选择
2. **系统跟随**: 自动检测 `prefers-color-scheme: dark`
3. **优雅回退**: 默认使用亮模式

### 平滑切换动画
- 所有颜色变化都有 `transition-colors duration-300` 过渡
- 避免突兀的颜色跳跃
- 保持用户体验的连贯性

### 字体渲染优化
```css
.dark {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

## 🎨 组件样式系统

### 统一的样式类
```css
/* 导航链接 */
.nav-link {
  @apply text-gray-600 hover:text-gray-900 transition-colors duration-200;
}
.dark .nav-link {
  @apply text-dark-secondary hover:text-dark-primary;
}

/* 卡片组件 */
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200;
}
.dark .card {
  @apply bg-dark-card border-dark-border shadow-xl shadow-black/10;
}

/* 输入框 */
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white;
}
.dark .input-field {
  @apply bg-dark-tertiary border-dark-border text-dark-primary placeholder-dark-muted focus:border-primary-500 focus:ring-primary-500/20;
}
```

### 语义化样式类
- `.text-muted` - 次要文字
- `.text-subtle` - 辅助文字
- `.bg-surface` - 表面背景
- `.bg-elevated` - 提升背景
- `.border-default` - 默认边框
- `.hover-bg` - 悬停背景

## 🌟 用户界面

### 暗模式切换按钮
- **位置**: 导航栏右侧，语言切换按钮左侧
- **图标**: 太阳图标（亮模式）/ 月亮图标（暗模式）
- **交互**: 点击即时切换，带有平滑过渡动画
- **提示**: hover 时显示切换提示文字

### 视觉反馈
- **即时切换**: 无需刷新页面
- **状态保持**: 切换后保持当前页面状态
- **全局生效**: 所有页面和组件同步切换

## 📱 响应式适配

### 移动端优化
- 触摸友好的切换按钮
- 适配小屏幕的布局调整
- 保持暗模式下的可读性

### 跨设备同步
- localStorage 存储用户偏好
- 跨标签页同步（通过 storage 事件）
- 设备间一致的体验

## 🎨 设计细节

### 阴影系统
```css
.shadow-soft {
  @apply shadow-sm;
}
.dark .shadow-soft {
  @apply shadow-lg shadow-black/20;
}
```

### 渐变背景
```css
.gradient-primary {
  @apply bg-gradient-to-r from-primary-600 to-primary-800;
}
.dark .gradient-primary {
  @apply from-primary-700 to-primary-900;
}
```

### 滚动条样式
- 亮模式：浅灰色滚动条
- 暗模式：深色滚动条，与背景协调

## 🔍 可访问性

### 对比度优化
- 所有文字都满足 WCAG AA 标准
- 重要信息使用高对比度颜色
- 辅助信息使用适中对比度

### 色彩无障碍
- 不依赖颜色传达重要信息
- 提供足够的视觉层次
- 支持高对比度模式

## 🚀 性能优化

### CSS 优化
- 使用 Tailwind 的 JIT 模式
- 按需生成暗模式样式
- 避免重复的 CSS 规则

### JavaScript 优化
- 最小化 DOM 操作
- 使用 CSS 类切换而非内联样式
- 缓存主题状态

## 📊 已完成的暗模式适配

### ✅ 全局组件
- [x] AppHeader.vue - 导航头组件
- [x] AppFooter.vue - 页脚组件

### ✅ 样式系统
- [x] 全局样式类定义
- [x] 组件样式适配
- [x] 过渡动画配置
- [x] 字体渲染优化

### ✅ 核心功能
- [x] 暗模式切换按钮
- [x] 主题状态管理
- [x] 本地存储持久化
- [x] 系统主题检测

### ✅ 页面适配
- [x] Home.vue - 首页
- [x] 其他页面组件（通过样式类自动适配）

## 🎯 使用方法

### 在组件中使用暗模式
```vue
<template>
  <div class="bg-surface text-gray-900 dark:text-dark-primary">
    <h1 class="text-muted">标题</h1>
    <button class="btn-primary">按钮</button>
  </div>
</template>

<script setup lang="ts">
import { useDarkMode } from '@/composables/useDarkMode'

const { isDark, toggleDark } = useDarkMode()
</script>
```

### 编程式控制
```typescript
import { useDarkMode } from '@/composables/useDarkMode'

const { isDark, setDark, toggleDark } = useDarkMode()

// 切换暗模式
toggleDark()

// 设置为暗模式
setDark(true)

// 检查当前模式
console.log(isDark.value) // true/false
```

## 🔮 未来扩展

### 计划功能
- [ ] 自动切换（根据时间）
- [ ] 更多主题选项
- [ ] 自定义配色方案
- [ ] 护眼模式

### 技术改进
- [ ] CSS 变量动态切换
- [ ] 更精细的颜色控制
- [ ] 主题预设系统

---

Tool Hub 的暗模式设计注重用户体验和视觉舒适度，提供了一个优雅、实用的暗色主题选择。🌙✨