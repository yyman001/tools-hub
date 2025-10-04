#!/usr/bin/env node

// 测试 Supabase 连接
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取环境变量
const envPath = path.join(path.dirname(__dirname), '.env');
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

console.log('🔗 测试 Supabase 连接...\n');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ 环境变量未正确设置');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('📡 测试基本连接...');
    
    // 测试基本连接
    const { data, error } = await supabase.from('categories').select('count').limit(1);
    
    if (error) {
      console.log('❌ 连接失败:', error.message);
      
      if (error.message.includes('relation "categories" does not exist')) {
        console.log('\n💡 数据库表不存在，需要执行设置脚本');
        console.log('📝 请在 Supabase Dashboard 的 SQL Editor 中执行:');
        console.log('   supabase-online-setup.sql');
      } else if (error.message.includes('JWT')) {
        console.log('\n💡 认证问题，请检查 anon key 是否正确');
      } else {
        console.log('\n💡 其他错误，请检查网络连接和项目状态');
      }
      
      return false;
    }
    
    console.log('✅ 基本连接成功');
    
    // 测试表结构
    console.log('📊 检查数据库表...');
    const { data: categories } = await supabase.from('categories').select('*').limit(1);
    console.log('✅ categories 表存在');
    
    const { data: tools } = await supabase.from('tools').select('*').limit(1);
    console.log('✅ tools 表存在');
    
    // 检查分类数据
    const { data: categoryCount, count } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📈 分类数量: ${count || 0}`);
    
    if (count === 0) {
      console.log('⚠️  没有分类数据，建议执行完整的设置脚本');
    }
    
    console.log('\n🎉 Supabase 连接测试完成！');
    return true;
    
  } catch (error) {
    console.log('❌ 连接测试失败:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 网络连接问题:');
      console.log('1. 检查网络连接');
      console.log('2. 确认 Supabase 项目状态为 Active');
      console.log('3. 检查防火墙设置');
    }
    
    return false;
  }
}

testConnection();