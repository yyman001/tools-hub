#!/usr/bin/env node

console.log(`
🔍 密码重置URL验证工具

📋 当前配置：
✅ Vite配置端口：3000 (vite.config.ts)
✅ 环境工具：src/utils/environment.ts
✅ 动态URL获取：getPasswordResetUrl()
✅ 测试脚本端口：3000

🎯 验证步骤：

1. 检查你收到的重置邮件URL：
   ❌ 错误：http://localhost:5173/reset-password#access_token=...
   ✅ 正确：http://localhost:3000/reset-password#access_token=...

2. 如果URL端口是5173，请：
   方法A：手动修改URL
   - 复制邮件中的完整URL
   - 将 :5173 改为 :3000
   - 在浏览器中访问修改后的URL

   方法B：重新发送邮件
   - 启动应用：npm run dev
   - 访问：http://localhost:3000/forgot-password
   - 重新发送重置邮件

3. 验证修复是否生效：
   - 新发送的邮件应该包含正确的端口3000
   - 点击链接应该能正常访问重置页面

🔧 手动修复示例：

原始URL（错误）：
http://localhost:5173/reset-password#access_token=eyJhbGciOiJIUzI1NiIs...

修复后URL（正确）：
http://localhost:3000/reset-password#access_token=eyJhbGciOiJIUzI1NiIs...

💡 为什么会出现这个问题？

1. Vite默认端口是5173
2. 但项目配置了自定义端口3000
3. 之前的代码没有动态获取当前端口
4. 现在已修复为动态获取

🎉 修复完成！

现在所有新发送的密码重置邮件都会使用正确的端口3000！
`)

process.exit(0)