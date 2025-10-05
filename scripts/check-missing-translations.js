#!/usr/bin/env node

/**
 * 检查缺失的翻译键脚本
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.dirname(__dirname)

console.log('🔍 检查缺失的翻译键...')

// 读取语言文件
const zhCNPath = path.join(projectRoot, 'src/locales/zh-CN.json')
const enUSPath = path.join(projectRoot, 'src/locales/en-US.json')

const zhCN = JSON.parse(fs.readFileSync(zhCNPath, 'utf8'))
const enUS = JSON.parse(fs.readFileSync(enUSPath, 'utf8'))

// 常见的缺失翻译键和对应的翻译
const missingTranslations = {
  'addTool.category': {
    'zh-CN': '分类',
    'en-US': 'Category'
  },
  'addTool.selectCategory': {
    'zh-CN': '选择分类',
    'en-US': 'Select Category'
  },
  'tools.filterByCategory': {
    'zh-CN': '按分类筛选',
    'en-US': 'Filter by Category'
  },
  'tools.sortBy.name': {
    'zh-CN': '名称排序',
    'en-US': 'Name'
  },
  'tools.filterAndSort': {
    'zh-CN': '筛选和排序',
    'en-US': 'Filter & Sort'
  },
  'tools.showAll': {
    'zh-CN': '显示全部',
    'en-US': 'Show All'
  },
  'tools.resultsCount': {
    'zh-CN': '共 {count} 个结果',
    'en-US': '{count} results'
  },
  'categories.allCategories': {
    'zh-CN': '所有分类',
    'en-US': 'All Categories'
  },
  'categories.subcategories': {
    'zh-CN': '子分类',
    'en-US': 'Subcategories'
  },
  'categories.parentCategory': {
    'zh-CN': '父分类',
    'en-US': 'Parent Category'
  },
  'common.filter': {
    'zh-CN': '筛选',
    'en-US': 'Filter'
  },
  'common.sort': {
    'zh-CN': '排序',
    'en-US': 'Sort'
  },
  'common.reset': {
    'zh-CN': '重置',
    'en-US': 'Reset'
  },
  'common.apply': {
    'zh-CN': '应用',
    'en-US': 'Apply'
  },
  'common.clear': {
    'zh-CN': '清除',
    'en-US': 'Clear'
  }
}

// 添加缺失的翻译到语言文件
function addMissingTranslations(translations, targetObj, lang) {
  let added = 0
  
  for (const [key, values] of Object.entries(translations)) {
    const keys = key.split('.')
    let current = targetObj
    
    // 导航到正确的嵌套位置
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }
    
    // 添加翻译（如果不存在）
    const finalKey = keys[keys.length - 1]
    if (!current[finalKey]) {
      current[finalKey] = values[lang]
      added++
      console.log(`✅ 添加 ${lang} 翻译: ${key} = "${values[lang]}"`)
    }
  }
  
  return added
}

// 添加缺失的翻译
const zhAdded = addMissingTranslations(missingTranslations, zhCN, 'zh-CN')
const enAdded = addMissingTranslations(missingTranslations, enUS, 'en-US')

// 写回文件
if (zhAdded > 0) {
  fs.writeFileSync(zhCNPath, JSON.stringify(zhCN, null, 2), 'utf8')
  console.log(`📝 更新中文翻译文件，添加了 ${zhAdded} 个翻译`)
}

if (enAdded > 0) {
  fs.writeFileSync(enUSPath, JSON.stringify(enUS, null, 2), 'utf8')
  console.log(`📝 更新英文翻译文件，添加了 ${enAdded} 个翻译`)
}

if (zhAdded === 0 && enAdded === 0) {
  console.log('✅ 所有翻译都已存在，无需更新')
} else {
  console.log(`🎉 翻译检查完成！总共添加了 ${zhAdded + enAdded} 个翻译`)
}

console.log('')
console.log('📋 建议的后续步骤：')
console.log('1. 检查页面是否还有其他缺失的翻译')
console.log('2. 重新构建项目: npm run build:cloudflare')
console.log('3. 测试多语言功能')