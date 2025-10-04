# 线上 Supabase 快速设置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase Dashboard](https://app.supabase.com)
2. 点击 "New Project"
3. 选择组织（或创建新组织）
4. 填写项目信息：
   - Name: `tool-hub`
   - Database Password: 设置一个强密码
   - Region: 选择离你最近的区域（建议选择 Singapore 或 Tokyo）
5. 点击 "Create new project"

## 2. 获取项目配置

项目创建完成后：

1. 进入项目 Dashboard
2. 点击左侧菜单的 "Settings" -> "API"
3. 复制以下信息：
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJ...` (很长的字符串)

## 3. 更新环境变量

将获取的信息更新到 `.env` 文件：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. 创建数据库表

在 Supabase Dashboard 中：

1. 点击左侧菜单的 "SQL Editor"
2. 点击 "New query"
3. 复制并执行以下 SQL：

```sql
-- 分类表（支持中英双语）
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name_zh VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  parent_id INTEGER REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  status SMALLINT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 工具主表
CREATE TABLE tools (
  id SERIAL PRIMARY KEY,
  name_zh VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  description_zh TEXT NOT NULL,
  description_en TEXT NOT NULL,
  homepage_url VARCHAR(512),
  download_url VARCHAR(512),
  screenshot_url VARCHAR(512),
  supported_platforms TEXT,
  primary_category_id INTEGER NOT NULL REFERENCES categories(id),
  secondary_category_id INTEGER REFERENCES categories(id),
  user_id UUID REFERENCES auth.users(id),
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  status SMALLINT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 标签表
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 工具标签关联表
CREATE TABLE tool_tags (
  id SERIAL PRIMARY KEY,
  tool_id INTEGER NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tool_id, tag_id)
);

-- 下载链接表
CREATE TABLE download_links (
  id SERIAL PRIMARY KEY,
  tool_id INTEGER NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(512) NOT NULL,
  type VARCHAR(50) DEFAULT 'official',
  description TEXT,
  platform VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_tools_primary_category ON tools(primary_category_id);
CREATE INDEX idx_tools_secondary_category ON tools(secondary_category_id);
CREATE INDEX idx_tools_status ON tools(status);
CREATE INDEX idx_tools_user_id ON tools(user_id);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_status ON categories(status);
CREATE INDEX idx_tool_tags_tool_id ON tool_tags(tool_id);
CREATE INDEX idx_tool_tags_tag_id ON tool_tags(tag_id);
CREATE INDEX idx_download_links_tool_id ON download_links(tool_id);

-- 启用 RLS (Row Level Security)
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_links ENABLE ROW LEVEL SECURITY;

-- 创建策略：所有人都可以读取启用状态的数据
CREATE POLICY "Anyone can read active tools" ON tools
  FOR SELECT USING (status = 1);

CREATE POLICY "Anyone can read active categories" ON categories
  FOR SELECT USING (status = 1);

CREATE POLICY "Anyone can read tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Anyone can read tool_tags" ON tool_tags FOR SELECT USING (true);
CREATE POLICY "Anyone can read download_links" ON download_links FOR SELECT USING (true);

-- 用户可以创建和编辑自己的工具
CREATE POLICY "Users can create tools" ON tools
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tools" ON tools
  FOR UPDATE USING (auth.uid() = user_id);

-- 用户可以为自己的工具添加标签和下载链接
CREATE POLICY "Users can manage their tool tags" ON tool_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM tools 
      WHERE tools.id = tool_tags.tool_id 
      AND tools.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their tool downloads" ON download_links
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM tools 
      WHERE tools.id = download_links.tool_id 
      AND tools.user_id = auth.uid()
    )
  );
```

## 5. 插入示例数据

继续在 SQL Editor 中执行：

```sql
-- 插入示例分类数据
INSERT INTO categories (name_zh, name_en, parent_id, sort_order) VALUES
('开发工具', 'Development Tools', NULL, 1),
('设计工具', 'Design Tools', NULL, 2),
('办公软件', 'Office Software', NULL, 3),
('系统工具', 'System Tools', NULL, 4),
('网络工具', 'Network Tools', NULL, 5);

-- 插入二级分类
INSERT INTO categories (name_zh, name_en, parent_id, sort_order) VALUES
('代码编辑器', 'Code Editors', 1, 1),
('版本控制', 'Version Control', 1, 2),
('API工具', 'API Tools', 1, 3),
('图像编辑', 'Image Editing', 2, 1),
('UI设计', 'UI Design', 2, 2),
('文档处理', 'Document Processing', 3, 1),
('表格工具', 'Spreadsheet Tools', 3, 2),
('文件管理', 'File Management', 4, 1),
('系统监控', 'System Monitoring', 4, 2),
('网络分析', 'Network Analysis', 5, 1);

-- 插入一些示例工具（无需用户ID）
INSERT INTO tools (
  name_zh, name_en, 
  description_zh, description_en,
  homepage_url, 
  supported_platforms,
  primary_category_id, secondary_category_id,
  status
) VALUES
(
  'Visual Studio Code', 'Visual Studio Code',
  '微软开发的免费代码编辑器，支持多种编程语言和丰富的扩展生态。', 
  'A free code editor developed by Microsoft with support for multiple programming languages and rich extension ecosystem.',
  'https://code.visualstudio.com',
  '["windows", "macos", "linux"]',
  1, 1, 1
),
(
  'Figma', 'Figma',
  '基于浏览器的协作式界面设计工具，支持实时协作和原型制作。',
  'Browser-based collaborative interface design tool with real-time collaboration and prototyping capabilities.',
  'https://figma.com',
  '["web", "windows", "macos"]',
  2, 2, 1
);
```

## 6. 配置认证

在 Supabase Dashboard 中：

1. 点击 "Authentication" -> "Settings"
2. 确保以下设置：
   - **Enable email confirmations**: 关闭（测试时）
   - **Enable phone confirmations**: 关闭
   - **Site URL**: `http://localhost:5173`
   - **Redirect URLs**: 添加 `http://localhost:5173/**`

## 7. 测试连接

1. 重启你的开发服务器：
   ```bash
   pnpm dev
   ```

2. 访问 `http://localhost:5173`

3. 尝试注册一个测试账户

4. 登录并尝试添加工具

## 故障排除

### 连接失败
- 检查 `.env` 文件中的 URL 和 Key 是否正确
- 确保 Supabase 项目状态为 "Active"

### 认证问题
- 检查 Authentication 设置
- 确保 Site URL 配置正确

### 数据库错误
- 检查 SQL 是否全部执行成功
- 查看 Supabase Dashboard 的 Logs 页面

## 有用的链接

- [Supabase Dashboard](https://app.supabase.com)
- [Supabase 文档](https://supabase.com/docs)
- [项目 GitHub](https://github.com/your-username/tool-hub)