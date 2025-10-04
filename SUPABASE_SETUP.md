# Supabase 设置指南

本项目已集成 Supabase 作为后端服务，支持数据库、认证和实时功能。

## 快速开始 🚀

如果你遇到环境变量错误，请按照以下步骤操作：

### 选项 1: 使用 Docker Compose（推荐，最简单）

```bash
# 1. 确保 Docker 正在运行
# 2. 启动数据库和管理界面
docker-compose up -d

# 3. 访问数据库管理界面
# http://localhost:54323
```

### 选项 2: 安装 Supabase CLI

#### Windows 用户：
```powershell
# 方法 1: 使用 Scoop（推荐）
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# 方法 2: 运行我们的安装脚本
.\scripts\setup-supabase.ps1

# 方法 3: 手动下载
# 从 https://github.com/supabase/cli/releases 下载最新版本
```

#### macOS/Linux 用户：
```bash
# 使用 Homebrew
brew install supabase/tap/supabase

# 或使用 npm
npx supabase@latest
```

## 2. 本地开发设置

### 初始化本地 Supabase 项目
```bash
# 在项目根目录运行
supabase init
```

### 启动本地 Supabase 服务
```bash
supabase start
```

这将启动以下服务：
- API: http://localhost:54321
- Studio: http://localhost:54323
- Database: postgresql://postgres:postgres@localhost:54322/postgres

### 运行数据库迁移
```bash
supabase db reset
```

## 3. 环境变量配置

创建 `.env` 文件并添加以下配置：

```env
# 本地开发环境
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your_local_anon_key

# 生产环境（从 Supabase Dashboard 获取）
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

本地开发的 anon key 可以在启动 `supabase start` 后从输出中获取。

## 4. 生产环境部署

### 创建 Supabase 项目
1. 访问 [Supabase Dashboard](https://app.supabase.com)
2. 创建新项目
3. 获取项目 URL 和 anon key

### 链接本地项目到远程项目
```bash
supabase link --project-ref your-project-id
```

### 推送数据库迁移到生产环境
```bash
supabase db push
```

## 5. 数据库结构

### 主要表结构

#### categories (分类表)
- `id`: 主键
- `name_zh`: 中文名称
- `name_en`: 英文名称
- `parent_id`: 父分类ID（支持二级分类）
- `sort_order`: 排序
- `status`: 状态（1-启用，0-禁用）
- `created_at`: 创建时间

#### tools (工具表)
- `id`: 主键
- `name_zh`: 中文名称
- `name_en`: 英文名称
- `description_zh`: 中文描述
- `description_en`: 英文描述
- `homepage_url`: 工具主页
- `download_url`: 下载地址
- `screenshot_url`: 截图链接
- `supported_platforms`: 支持平台（JSON数组）
- `primary_category_id`: 主分类ID
- `secondary_category_id`: 二级分类ID
- `status`: 状态
- `created_at`: 创建时间
- `updated_at`: 更新时间

## 6. 认证配置

项目使用 Supabase Auth 进行用户认证：
- 支持邮箱密码注册/登录
- 自动处理 JWT token
- 支持用户会话管理

## 7. 安全策略 (RLS)

已启用行级安全策略：
- 所有用户可以读取状态为启用的工具和分类
- 后续可以添加更细粒度的权限控制

## 8. 开发命令

```bash
# 启动本地开发环境
pnpm dev

# 启动 Supabase 服务
supabase start

# 停止 Supabase 服务
supabase stop

# 查看 Supabase 状态
supabase status

# 重置数据库
supabase db reset

# 生成类型定义
supabase gen types typescript --local > src/types/supabase.ts
```

## 9. 故障排除

### 端口冲突
如果遇到端口冲突，可以修改 `supabase/config.toml` 中的端口配置。

### 数据库连接问题
确保 Docker 正在运行，Supabase 依赖 Docker 来运行本地服务。

### 环境变量问题
确保 `.env` 文件在项目根目录，并且变量名以 `VITE_` 开头。