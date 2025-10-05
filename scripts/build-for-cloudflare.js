#!/usr/bin/env node

/**
 * Cloudflare Pages 构建脚本
 * 解决 vue-i18n 在 Cloudflare Pages 上的兼容性问题
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🚀 开始为 Cloudflare Pages 构建项目...')

try {
  // 1. 清理旧的构建文件
  console.log('📦 清理旧的构建文件...')
  if (fs.existsSync('dist')) {
    execSync('rmdir /s /q dist', { stdio: 'inherit' })
  }

  // 2. 运行构建
  console.log('🔨 开始构建...')
  execSync('npm run build', { stdio: 'inherit' })

  // 3. 检查构建结果
  console.log('🔍 检查构建结果...')
  const distPath = path.join(path.dirname(__dirname), 'dist')
  
  if (!fs.existsSync(distPath)) {
    throw new Error('构建失败：dist 目录不存在')
  }

  // 4. 检查关键文件
  const indexPath = path.join(distPath, 'index.html')
  if (!fs.existsSync(indexPath)) {
    throw new Error('构建失败：index.html 不存在')
  }

  // 5. 创建 _redirects 文件用于 SPA 路由
  console.log('📝 创建 _redirects 文件...')
  const redirectsContent = `/*    /index.html   200`
  fs.writeFileSync(path.join(distPath, '_redirects'), redirectsContent)

  // 6. 创建 _headers 文件优化缓存
  console.log('📝 创建 _headers 文件...')
  const headersContent = `
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.json
  Cache-Control: public, max-age=86400

/
  Cache-Control: public, max-age=0, must-revalidate
`
  fs.writeFileSync(path.join(distPath, '_headers'), headersContent.trim())

  console.log('✅ Cloudflare Pages 构建完成！')
  console.log('📁 构建文件位于 dist/ 目录')
  console.log('🌐 可以直接部署到 Cloudflare Pages')

} catch (error) {
  console.error('❌ 构建失败:', error.message)
  process.exit(1)
}