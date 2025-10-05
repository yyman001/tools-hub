#!/usr/bin/env node

/**
 * 清理和验证翻译文件脚本
 * 修复可能导致 "Invalid linked format" 错误的内容
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.dirname(__dirname)

console.log('🧹 清理和验证翻译文件...')

// 读取语言文件
const zhCNPath = path.join(projectRoot, 'src/locales/zh-CN.json')
const enUSPath = path.join(projectRoot, 'src/locales/en-US.json')

function validateAndCleanTranslations(filePath, lang) {
  console.log(`\n📝 处理 ${lang} 翻译文件...`)
  
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const translations = JSON.parse(content)
    
    let hasChanges = false
    let issues = []
    
    // 递归检查翻译内容
    function checkTranslations(obj, path = '') {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key
        
        if (typeof value === 'string') {
          // 检查可能有问题的字符
          if (value.includes('@') && value.includes(':')) {
            issues.push(`⚠️  ${currentPath}: 包含可能有问题的字符 (@:)`)
          }
          
          // 检查未转义的大括号
          if (value.match(/\{[^0-9}][^}]*\}/)) {
            issues.push(`⚠️  ${currentPath}: 包含命名插值，建议使用位置插值`)
          }
          
          // 检查空翻译
          if (value.trim() === '') {
            issues.push(`❌ ${currentPath}: 空翻译`)
          }
        } else if (typeof value === 'object' && value !== null) {
          checkTranslations(value, currentPath)
        }
      }
    }
    
    checkTranslations(translations)
    
    if (issues.length > 0) {
      console.log(`发现 ${issues.length} 个问题:`)
      issues.forEach(issue => console.log(`  ${issue}`))
    } else {
      console.log('✅ 没有发现问题')
    }
    
    // 重新格式化并保存文件
    const formattedContent = JSON.stringify(translations, null, 2)
    if (content !== formattedContent) {
      fs.writeFileSync(filePath, formattedContent, 'utf8')
      console.log('📝 文件已重新格式化')
      hasChanges = true
    }
    
    return { issues: issues.length, hasChanges }
    
  } catch (error) {
    console.error(`❌ 处理 ${lang} 文件时出错:`, error.message)
    return { issues: 1, hasChanges: false }
  }
}

// 处理两个语言文件
const zhResult = validateAndCleanTranslations(zhCNPath, '中文')
const enResult = validateAndCleanTranslations(enUSPath, '英文')

console.log('\n📊 总结:')
console.log(`中文翻译: ${zhResult.issues} 个问题`)
console.log(`英文翻译: ${enResult.issues} 个问题`)

if (zhResult.hasChanges || enResult.hasChanges) {
  console.log('📝 文件已更新')
}

if (zhResult.issues === 0 && enResult.issues === 0) {
  console.log('🎉 所有翻译文件都没有问题！')
} else {
  console.log('⚠️  建议修复上述问题以避免运行时错误')
}

console.log('\n📋 建议的后续步骤:')
console.log('1. 重新构建项目: npm run build:cloudflare')
console.log('2. 测试登录和其他功能')
console.log('3. 检查浏览器控制台是否还有错误')