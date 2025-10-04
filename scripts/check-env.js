#!/usr/bin/env node

// 环境变量检查脚本
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 检查 Supabase 环境配置...\n');

// 检查 .env 文件是否存在
const envPath = path.join(path.dirname(__dirname), '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env 文件不存在');
  console.log('📝 请创建 .env 文件并添加 Supabase 配置');
  process.exit(1);
}

// 读取 .env 文件
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));

let supabaseUrl = '';
let supabaseKey = '';

envLines.forEach(line => {
  const [key, value] = line.split('=');
  if (key === 'VITE_SUPABASE_URL') {
    supabaseUrl = value;
  }
  if (key === 'VITE_SUPABASE_ANON_KEY') {
    supabaseKey = value;
  }
});

// 检查配置
console.log('📋 环境变量检查结果:');
console.log('─'.repeat(50));

if (supabaseUrl) {
  if (supabaseUrl.includes('your-project-id')) {
    console.log('⚠️  VITE_SUPABASE_URL: 需要替换为实际项目URL');
    console.log('   当前值:', supabaseUrl);
  } else if (supabaseUrl.includes('supabase.co')) {
    console.log('✅ VITE_SUPABASE_URL: 已配置');
    console.log('   项目URL:', supabaseUrl);
  } else {
    console.log('❌ VITE_SUPABASE_URL: 格式不正确');
    console.log('   当前值:', supabaseUrl);
  }
} else {
  console.log('❌ VITE_SUPABASE_URL: 未设置');
}

if (supabaseKey) {
  if (supabaseKey.includes('your-anon-key')) {
    console.log('⚠️  VITE_SUPABASE_ANON_KEY: 需要替换为实际密钥');
  } else if (supabaseKey.startsWith('eyJ')) {
    console.log('✅ VITE_SUPABASE_ANON_KEY: 已配置');
    console.log('   密钥长度:', supabaseKey.length, '字符');
  } else {
    console.log('❌ VITE_SUPABASE_ANON_KEY: 格式不正确');
  }
} else {
  console.log('❌ VITE_SUPABASE_ANON_KEY: 未设置');
}

console.log('─'.repeat(50));

// 给出建议
if (supabaseUrl.includes('your-project-id') || supabaseKey.includes('your-anon-key')) {
  console.log('\n📚 设置步骤:');
  console.log('1. 访问 https://app.supabase.com');
  console.log('2. 创建新项目或选择现有项目');
  console.log('3. 进入 Settings -> API');
  console.log('4. 复制 Project URL 和 anon public key');
  console.log('5. 更新 .env 文件中的对应值');
  console.log('6. 在 SQL Editor 中执行 supabase-online-setup.sql');
  console.log('\n📖 详细说明请查看: setup-online-supabase.md');
} else if (supabaseUrl.includes('supabase.co') && supabaseKey.startsWith('eyJ')) {
  console.log('\n🎉 配置看起来正确！');
  console.log('💡 下一步:');
  console.log('1. 确保在 Supabase 中执行了数据库设置脚本');
  console.log('2. 运行 pnpm dev 启动应用');
  console.log('3. 访问 http://localhost:5173 测试');
} else {
  console.log('\n❗ 请检查配置并重新设置');
}

console.log('');