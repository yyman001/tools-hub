# 快速开始指南 🚀

## 解决 "Missing Supabase environment variables" 错误

### 方法 1: 使用 Docker（最简单）

```bash
# 1. 启动数据库
pnpm run db:start

# 2. 启动开发服务器
pnpm dev
```

访问：
- 应用: http://localhost:5173
- 数据库管理: http://localhost:54323

### 方法 2: 使用 Supabase CLI

```bash
# 1. 安装 Supabase CLI（Windows）
scoop install supabase

# 2. 启动 Supabase
pnpm run supabase:start

# 3. 更新 .env 文件中的密钥（从 supabase start 输出中获取）

# 4. 启动开发服务器
pnpm dev
```

## 环境变量说明

项目需要以下环境变量（已在 `.env` 文件中预设）：

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

## 常用命令

```bash
# 开发
pnpm dev                 # 启动前端开发服务器
pnpm run db:start        # 启动数据库（Docker）
pnpm run db:stop         # 停止数据库
pnpm run db:reset        # 重置数据库

# Supabase CLI（如果已安装）
pnpm run supabase:start  # 启动 Supabase
pnpm run supabase:stop   # 停止 Supabase
pnpm run supabase:reset  # 重置 Supabase
```

## 故障排除

### 1. 端口被占用
如果端口冲突，修改 `docker-compose.yml` 中的端口映射。

### 2. Docker 未运行
确保 Docker Desktop 正在运行。

### 3. 环境变量未加载
重启开发服务器：`Ctrl+C` 然后重新运行 `pnpm dev`。

### 4. 数据库连接失败
```bash
# 重置数据库
pnpm run db:reset
```

## 项目结构

```
src/
├── lib/supabase.ts          # Supabase 客户端配置
├── services/supabaseService.ts  # 数据库操作服务
├── stores/index.ts          # Pinia 状态管理
├── types/supabase.ts        # 数据库类型定义
└── composables/useAuth.ts   # 认证相关组合式函数
```

需要帮助？查看完整文档：`SUPABASE_SETUP.md`