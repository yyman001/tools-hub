# 🚀 线上 Supabase 测试指南

跳过本地环境，直接连接线上 Supabase 进行测试。

## 快速开始

### 1️⃣ 创建 Supabase 项目

访问 [Supabase Dashboard](https://app.supabase.com) 并创建新项目：

- **项目名称**: `tool-hub`
- **数据库密码**: 设置强密码
- **区域**: 选择 Singapore 或 Tokyo

### 2️⃣ 获取配置信息

项目创建完成后，进入 **Settings** → **API**，复制：
- **Project URL**: `https://xxx.supabase.co`
- **anon public key**: `eyJhbGciOiJIUzI1NiIs...`

### 3️⃣ 更新环境变量

编辑项目根目录的 `.env` 文件：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4️⃣ 设置数据库

在 Supabase Dashboard 的 **SQL Editor** 中：

1. 点击 **New query**
2. 复制 `supabase-online-setup.sql` 文件的全部内容
3. 粘贴并点击 **Run** 执行

### 5️⃣ 配置认证

在 **Authentication** → **Settings** 中设置：

- **Site URL**: `http://localhost:5173`
- **Redirect URLs**: 添加 `http://localhost:5173/**`
- **Enable email confirmations**: 关闭（测试时）

### 6️⃣ 启动测试

```bash
# 检查配置
pnpm run setup:check

# 启动应用
pnpm run test:online
```

## 🧪 测试功能

### 用户认证
1. 访问 `http://localhost:5173/register`
2. 注册测试账户
3. 登录系统

### 工具管理
1. 点击 "添加工具"
2. 填写双语信息
3. 选择分类和平台
4. 提交测试

### 数据查看
- 在 Supabase Dashboard 的 **Table Editor** 中查看数据
- 检查 `tools`、`categories`、`tags` 等表

## 🔧 故障排除

### 环境变量问题
```bash
# 检查配置
pnpm run setup:check
```

### 连接失败
- 确认 Supabase 项目状态为 "Active"
- 检查网络连接
- 验证 URL 和 Key 是否正确

### 认证问题
- 检查 Site URL 配置
- 确认邮箱验证设置
- 查看 Authentication → Users 页面

### 数据库错误
- 确认 SQL 脚本执行成功
- 检查 RLS 策略是否正确
- 查看 Logs 页面的错误信息

## 📊 监控和调试

### Supabase Dashboard
- **Table Editor**: 查看和编辑数据
- **SQL Editor**: 执行查询
- **Authentication**: 管理用户
- **Logs**: 查看错误日志

### 浏览器开发者工具
- **Network**: 检查 API 请求
- **Console**: 查看 JavaScript 错误
- **Application**: 检查本地存储

## 🎯 测试清单

- [ ] 用户注册和登录
- [ ] 添加工具（中英文）
- [ ] 分类选择（主分类/二级分类）
- [ ] 平台选择
- [ ] 标签添加
- [ ] 下载链接管理
- [ ] 工具列表显示
- [ ] 搜索功能
- [ ] 用户权限（只能编辑自己的工具）

## 📚 相关文档

- [完整设置指南](setup-online-supabase.md)
- [Supabase 文档](https://supabase.com/docs)
- [项目 API 文档](API_DOCS.md)

## 🆘 需要帮助？

1. 检查 [setup-online-supabase.md](setup-online-supabase.md) 详细说明
2. 运行 `pnpm run setup:check` 诊断问题
3. 查看 Supabase Dashboard 的 Logs 页面
4. 检查浏览器控制台错误信息

---

**提示**: 这是测试环境配置，生产环境需要额外的安全配置和优化。