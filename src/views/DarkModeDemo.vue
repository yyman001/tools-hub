<template>
  <div class="min-h-screen bg-elevated">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- 标题区域 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-primary mb-4">
          Cursor风格暗模式演示
        </h1>
        <p class="text-xl text-secondary">
          温暖的非纯黑配色方案，提供更好的视觉体验
        </p>
      </div>

      <!-- 颜色展示区域 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <!-- 背景色展示 -->
        <div class="card">
          <h3 class="text-lg font-semibold text-primary mb-4">背景色层次</h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-dark-bg-primary rounded"></div>
              <span class="text-secondary">主背景 (#1a1b26)</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-dark-bg-secondary rounded"></div>
              <span class="text-secondary">次级背景 (#24283b)</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-dark-bg-tertiary rounded"></div>
              <span class="text-secondary">三级背景 (#2f334d)</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-dark-bg-elevated rounded"></div>
              <span class="text-secondary">提升背景 (#414868)</span>
            </div>
          </div>
        </div>

        <!-- 文字色展示 -->
        <div class="card">
          <h3 class="text-lg font-semibold text-primary mb-4">文字色层次</h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-dark-text-primary rounded"></div>
              <span class="text-secondary">主要文字 (#c0caf5)</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-dark-text-secondary rounded"></div>
              <span class="text-secondary">次要文字 (#a9b1d6)</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-dark-text-tertiary rounded"></div>
              <span class="text-secondary">三级文字 (#9aa5ce)</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-dark-text-muted rounded"></div>
              <span class="text-secondary">静音文字 (#7982a9)</span>
            </div>
          </div>
        </div>

        <!-- 强调色展示 -->
        <div class="card">
          <h3 class="text-lg font-semibold text-primary mb-4">强调色</h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-dark-accent-blue rounded"></div>
              <span class="text-secondary">蓝色 (#7aa2f7)</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-dark-accent-green rounded"></div>
              <span class="text-secondary">绿色 (#9ece6a)</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-dark-accent-yellow rounded"></div>
              <span class="text-secondary">黄色 (#e0af68)</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-dark-accent-purple rounded"></div>
              <span class="text-secondary">紫色 (#bb9af7)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 组件展示区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 按钮展示 -->
        <div class="card">
          <h3 class="text-lg font-semibold text-primary mb-6">按钮样式</h3>
          <div class="space-y-4">
            <button class="btn-primary">主要按钮</button>
            <button class="btn-secondary">次要按钮</button>
            <button class="px-4 py-2 bg-dark-accent-blue text-white rounded-lg hover:bg-dark-accent-blue/80 transition-colors">
              蓝色按钮
            </button>
            <button class="px-4 py-2 bg-dark-accent-green text-white rounded-lg hover:bg-dark-accent-green/80 transition-colors">
              绿色按钮
            </button>
          </div>
        </div>

        <!-- 输入框展示 -->
        <div class="card">
          <h3 class="text-lg font-semibold text-primary mb-6">输入框样式</h3>
          <div class="space-y-4">
            <input type="text" placeholder="请输入内容..." class="input-field" />
            <textarea placeholder="多行输入..." class="input-field h-20 resize-none"></textarea>
            <select class="input-field">
              <option>选项 1</option>
              <option>选项 2</option>
              <option>选项 3</option>
            </select>
          </div>
        </div>

        <!-- 卡片展示 -->
        <div class="card">
          <h3 class="text-lg font-semibold text-primary mb-6">卡片样式</h3>
          <div class="space-y-4">
            <div class="card">
              <h4 class="font-semibold text-primary mb-2">卡片标题</h4>
              <p class="text-secondary">这是一个卡片内容的示例，展示了新的暗模式配色方案。</p>
            </div>
            <div class="card hover:shadow-medium transition-all duration-300">
              <h4 class="font-semibold text-primary mb-2">悬停卡片</h4>
              <p class="text-secondary">鼠标悬停时会有阴影效果。</p>
            </div>
          </div>
        </div>

        <!-- 导航展示 -->
        <div class="card">
          <h3 class="text-lg font-semibold text-primary mb-6">导航样式</h3>
          <div class="space-y-2">
            <a href="#" class="nav-link block">首页</a>
            <a href="#" class="nav-link block nav-link-active">工具</a>
            <a href="#" class="nav-link block">分类</a>
            <a href="#" class="nav-link block">关于</a>
          </div>
        </div>
      </div>

      <!-- 特性说明 -->
      <div class="mt-12 card">
        <h3 class="text-lg font-semibold text-primary mb-6">新配色方案特性</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-semibold text-primary mb-2">🎨 温暖色调</h4>
            <p class="text-secondary">采用温暖的深灰色调，避免纯黑带来的视觉疲劳</p>
          </div>
          <div>
            <h4 class="font-semibold text-primary mb-2">👁️ 护眼设计</h4>
            <p class="text-secondary">降低对比度，减少眼睛疲劳，适合长时间使用</p>
          </div>
          <div>
            <h4 class="font-semibold text-primary mb-2">🌈 层次分明</h4>
            <p class="text-secondary">多层次的背景和文字颜色，提供清晰的视觉层次</p>
          </div>
          <div>
            <h4 class="font-semibold text-primary mb-2">✨ 现代感</h4>
            <p class="text-secondary">结合玻璃态效果和渐变，营造现代科技感</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Dark mode demo component
</script> 