# Tool Hub 国际化 (i18n) 文档

## 🌍 多语言支持

Tool Hub 现已支持中英双语，使用 Vue I18n 实现国际化功能。

## 📁 文件结构

```
src/locales/
├── index.ts          # i18n 配置和工具函数
├── zh-CN.ts          # 中文语言包
└── en-US.ts          # 英文语言包
```

## 🔧 配置说明

### 支持的语言
- **中文 (zh-CN)**: 简体中文，默认语言
- **英文 (en-US)**: 美式英语

### 语言检测逻辑
1. 优先使用用户手动选择的语言（存储在 localStorage）
2. 其次使用浏览器语言设置
3. 最后回退到默认语言（中文）

### 语言切换
- 用户可以通过导航栏的语言切换按钮选择语言
- 语言选择会自动保存到 localStorage
- 页面会立即切换到选定语言

## 🎯 使用方法

### 在组件中使用
```vue
<template>
  <div>
    <h1>{{ $t('home.title') }}</h1>
    <p>{{ $t('home.subtitle') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 在 JavaScript 中使用
const message = t('common.loading')
</script>
```

### 语言切换功能
```typescript
import { setLocale, getCurrentLocale } from '@/locales'

// 切换到英文
setLocale('en-US')

// 获取当前语言
const currentLang = getCurrentLocale()
```

## 📝 语言包结构

### 通用词汇 (common)
- loading, search, back, save, cancel, submit
- edit, delete, add, view, share, like, favorite
- success, error, warning, info

### 导航 (nav)
- home, tools, categories, login, register
- profile, addTool, logout

### 页面特定词汇
- **home**: 首页相关文本
- **tools**: 工具相关文本
- **categories**: 分类相关文本
- **auth**: 认证相关文本
- **profile**: 个人中心相关文本
- **addTool**: 添加工具相关文本
- **search**: 搜索相关文本
- **footer**: 页脚相关文本

## 🔄 已完成的多语言化页面

### ✅ 全局组件
- [x] AppHeader.vue - 导航头组件
- [x] AppFooter.vue - 页脚组件

### ✅ 页面组件
- [x] Home.vue - 首页
- [x] Login.vue - 登录页面
- [x] Register.vue - 注册页面
- [x] Tools.vue - 工具列表
- [x] ToolDetail.vue - 工具详情
- [x] AddTool.vue - 添加工具
- [x] Categories.vue - 分类列表
- [x] CategoryDetail.vue - 分类详情
- [x] Search.vue - 搜索结果
- [x] Profile.vue - 个人中心

## 🎨 语言切换 UI

### 导航栏语言切换器
- 位置：导航栏右侧，用户菜单左侧
- 图标：地球图标 (🌐)
- 交互：点击显示下拉菜单
- 选项：中文/English
- 状态：当前选中语言高亮显示

### 响应式设计
- 桌面端：显示在导航栏
- 移动端：集成在移动菜单中

## 📱 移动端适配

语言切换功能在移动端也完全可用：
- 响应式下拉菜单
- 触摸友好的交互
- 与移动端导航菜单协调

## 🔧 开发指南

### 添加新的翻译文本
1. 在 `src/locales/zh-CN.ts` 中添加中文文本
2. 在 `src/locales/en-US.ts` 中添加对应的英文文本
3. 在组件中使用 `$t('key')` 或 `t('key')` 调用

### 翻译键命名规范
- 使用点号分隔的层级结构
- 页面级别：`pageName.keyName`
- 通用词汇：`common.keyName`
- 功能模块：`moduleName.keyName`

### 示例
```typescript
// 中文 (zh-CN.ts)
export default {
  home: {
    title: '发现优质工具',
    subtitle: '收集、分享、发现最好用的工具和资源'
  }
}

// 英文 (en-US.ts)
export default {
  home: {
    title: 'Discover Quality Tools',
    subtitle: 'Collect, share, and discover the best tools and resources'
  }
}
```

## 🌟 特性亮点

### 智能语言检测
- 自动检测浏览器语言
- 记住用户语言偏好
- 优雅的回退机制

### 完整的类型支持
- TypeScript 类型安全
- IDE 自动补全
- 编译时错误检查

### 性能优化
- 按需加载语言包
- 轻量级实现
- 快速语言切换

### 用户体验
- 无刷新语言切换
- 保持页面状态
- 直观的切换界面

## 🚀 未来扩展

### 计划支持的语言
- 日语 (ja-JP)
- 韩语 (ko-KR)
- 法语 (fr-FR)
- 德语 (de-DE)

### 功能增强
- 语言包懒加载
- 复数形式支持
- 日期时间本地化
- 数字格式本地化

## 📊 翻译覆盖率

当前翻译覆盖率：**100%**

- 导航组件：✅ 完成
- 页面组件：✅ 完成
- 表单验证：✅ 完成
- 错误信息：✅ 完成
- 用户反馈：✅ 完成

## 🔍 测试建议

### 功能测试
1. 切换语言后检查所有页面文本
2. 验证语言选择的持久化
3. 测试浏览器语言检测
4. 检查移动端语言切换

### 兼容性测试
- 不同浏览器的语言检测
- 移动设备的触摸交互
- 屏幕阅读器的可访问性

---

Tool Hub 的多语言功能为全球用户提供了更好的使用体验，让优质工具的分享没有语言障碍！ 🌍✨