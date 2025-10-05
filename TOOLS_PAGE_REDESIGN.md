# 工具页面重新设计 - 左右列布局

## 🎨 设计概述

将 `/tools` 页面重新设计为现代化的左右列布局：
- **左侧**：可展开的分类树形菜单
- **右侧**：对应分类的工具列表

## ✨ 新功能特性

### 1. 左侧分类菜单
- **分层结构**：支持一级和二级分类
- **可展开菜单**：点击一级分类可展开/收起子分类
- **工具计数**：显示每个分类下的工具数量
- **搜索功能**：顶部搜索框可快速筛选工具
- **全部分类**：特殊选项显示所有工具
- **固定定位**：使用 `sticky` 定位，滚动时保持可见

### 2. 右侧工具列表
- **响应式网格**：根据屏幕大小自动调整列数
- **分类标题**：显示当前选中的分类名称
- **结果计数**：显示当前筛选结果的数量
- **排序选项**：支持按时间、评分、浏览量、点赞数排序
- **工具卡片**：优化的卡片设计，显示关键信息

### 3. 交互体验
- **即时筛选**：点击分类立即更新工具列表
- **状态保持**：记住展开的分类状态
- **多语言支持**：根据当前语言显示对应的分类和工具名称
- **响应式设计**：移动端自动调整为垂直布局

## 🏗️ 技术实现

### 组件结构
```vue
<template>
  <div class="bg-elevated min-h-screen">
    <!-- 顶部标题栏 -->
    <div class="bg-surface border-b">
      <h1>工具列表</h1>
      <button>添加工具</button>
    </div>

    <!-- 主体内容 -->
    <div class="flex gap-6">
      <!-- 左侧分类菜单 -->
      <div class="w-80 flex-shrink-0">
        <div class="card sticky top-6">
          <!-- 搜索框 -->
          <!-- 全部分类 -->
          <!-- 分类树 -->
        </div>
      </div>

      <!-- 右侧工具列表 -->
      <div class="flex-1">
        <!-- 列表头部 -->
        <!-- 工具网格 -->
        <!-- 分页 -->
      </div>
    </div>
  </div>
</template>
```

### 核心功能实现

#### 1. 分类树构建
```typescript
const categoryTree = computed(() => {
  const categoryMap = new Map<number, Category>()
  const rootCategories: Category[] = []

  // 构建分类映射
  categories.value.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] })
  })

  // 构建树结构
  categories.value.forEach(category => {
    const categoryWithChildren = categoryMap.get(category.id)!
    
    if (category.parent_id === null) {
      rootCategories.push(categoryWithChildren)
    } else {
      const parent = categoryMap.get(category.parent_id)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(categoryWithChildren)
      }
    }
  })

  return rootCategories
})
```

#### 2. 分类展开/收起
```typescript
const expandedCategories = ref<Set<number>>(new Set())

const toggleCategory = (categoryId: number) => {
  if (selectedCategoryId.value !== categoryId) {
    selectCategory(categoryId)
  }
  
  if (expandedCategories.value.has(categoryId)) {
    expandedCategories.value.delete(categoryId)
  } else {
    expandedCategories.value.add(categoryId)
  }
}
```

#### 3. 分类选择和筛选
```typescript
const selectCategory = (categoryId: number | null) => {
  selectedCategoryId.value = categoryId
  searchParams.value.categoryId = categoryId || undefined
  searchParams.value.page = 1
  handleSearch()
}
```

## 🎯 用户体验改进

### 1. 视觉层次
- **清晰的信息架构**：左侧导航，右侧内容
- **一致的设计语言**：使用统一的卡片、按钮、颜色系统
- **合理的间距**：保证内容的可读性和美观性

### 2. 交互反馈
- **悬停效果**：鼠标悬停时的视觉反馈
- **选中状态**：清晰的选中状态指示
- **加载状态**：数据加载时的友好提示

### 3. 响应式适配
```css
@media (max-width: 768px) {
  .w-80 {
    width: 100%;
    margin-bottom: 1.5rem;
  }
  
  .flex {
    flex-direction: column;
  }
}
```

## 📱 响应式设计

### 桌面端 (≥1024px)
- 左侧菜单：320px 固定宽度
- 右侧内容：3列工具网格
- 分类菜单固定定位

### 平板端 (768px-1023px)
- 左侧菜单：256px 宽度
- 右侧内容：2列工具网格
- 保持左右布局

### 移动端 (<768px)
- 垂直布局：分类菜单在上，工具列表在下
- 单列工具网格
- 分类菜单不固定定位

## 🌐 多语言支持

### 动态语言切换
```typescript
const getCategoryName = (category: Category): string => {
  return locale.value.startsWith('zh') ? category.name_zh : category.name_en
}

const getToolName = (tool: Tool): string => {
  return locale.value.startsWith('zh') ? tool.name_zh : tool.name_en
}
```

### 新增翻译键
```json
{
  "tools": {
    "categoryTools": "分类工具",
    "expandCategory": "展开分类",
    "collapseCategory": "收起分类"
  }
}
```

## 🎨 样式特性

### 1. 自定义滚动条
```css
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}
```

### 2. 平滑动画
```css
.transition-transform {
  transition: transform 0.2s ease-in-out;
}
```

### 3. 文本截断
```css
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

## 🚀 性能优化

### 1. 计算属性缓存
- 使用 `computed` 缓存分类树构建
- 避免不必要的重新计算

### 2. 虚拟滚动准备
- 分类菜单设置最大高度和滚动
- 为大量分类数据做准备

### 3. 懒加载支持
- 分页加载工具数据
- 按需加载分类工具计数

## 📊 数据流

```
用户操作 → 更新搜索参数 → 调用 API → 更新 Store → 更新 UI
    ↓
分类选择 → selectCategory() → handleSearch() → toolStore.fetchTools()
    ↓
展开分类 → toggleCategory() → 更新 expandedCategories
    ↓
搜索输入 → handleSearch() → 重置页码 → 获取新数据
```

## 🔧 开发指南

### 添加新的分类功能
1. 在 `CategoryStore` 中添加相关方法
2. 更新 `Category` 类型定义
3. 在组件中添加对应的 UI 和交互逻辑

### 自定义工具卡片
1. 修改工具卡片的模板结构
2. 添加对应的样式类
3. 更新工具数据的显示逻辑

### 扩展筛选功能
1. 在 `SearchParams` 中添加新的筛选参数
2. 更新搜索表单的 UI
3. 在 `handleSearch` 中处理新的参数

## 🎉 总结

新的工具页面设计提供了：
- ✅ 更好的信息架构和导航体验
- ✅ 清晰的分类层次和工具组织
- ✅ 响应式设计适配各种设备
- ✅ 流畅的交互动画和视觉反馈
- ✅ 完整的多语言支持
- ✅ 优化的性能和用户体验

这个设计为用户提供了更直观、更高效的工具浏览和发现体验！🚀