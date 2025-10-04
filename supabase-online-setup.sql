-- Tool Hub 线上 Supabase 数据库完整设置脚本
-- 在 Supabase Dashboard 的 SQL Editor 中执行此脚本

-- 1. 创建分类表（支持中英双语）
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name_zh VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  parent_id INTEGER REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  status SMALLINT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建工具主表
CREATE TABLE IF NOT EXISTS tools (
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

-- 3. 创建标签表
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建工具标签关联表
CREATE TABLE IF NOT EXISTS tool_tags (
  id SERIAL PRIMARY KEY,
  tool_id INTEGER NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tool_id, tag_id)
);

-- 5. 创建下载链接表
CREATE TABLE IF NOT EXISTS download_links (
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

-- 6. 创建索引（提高查询性能）
CREATE INDEX IF NOT EXISTS idx_tools_primary_category ON tools(primary_category_id);
CREATE INDEX IF NOT EXISTS idx_tools_secondary_category ON tools(secondary_category_id);
CREATE INDEX IF NOT EXISTS idx_tools_status ON tools(status);
CREATE INDEX IF NOT EXISTS idx_tools_user_id ON tools(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_status ON categories(status);
CREATE INDEX IF NOT EXISTS idx_tool_tags_tool_id ON tool_tags(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_tags_tag_id ON tool_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_download_links_tool_id ON download_links(tool_id);

-- 7. 启用行级安全策略 (RLS)
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_links ENABLE ROW LEVEL SECURITY;

-- 8. 创建安全策略

-- 所有人都可以读取启用状态的工具
DROP POLICY IF EXISTS "Anyone can read active tools" ON tools;
CREATE POLICY "Anyone can read active tools" ON tools
  FOR SELECT USING (status = 1);

-- 所有人都可以读取启用状态的分类
DROP POLICY IF EXISTS "Anyone can read active categories" ON categories;
CREATE POLICY "Anyone can read active categories" ON categories
  FOR SELECT USING (status = 1);

-- 所有人都可以读取标签
DROP POLICY IF EXISTS "Anyone can read tags" ON tags;
CREATE POLICY "Anyone can read tags" ON tags FOR SELECT USING (true);

-- 所有人都可以读取工具标签关联
DROP POLICY IF EXISTS "Anyone can read tool_tags" ON tool_tags;
CREATE POLICY "Anyone can read tool_tags" ON tool_tags FOR SELECT USING (true);

-- 所有人都可以读取下载链接
DROP POLICY IF EXISTS "Anyone can read download_links" ON download_links;
CREATE POLICY "Anyone can read download_links" ON download_links FOR SELECT USING (true);

-- 用户可以创建工具
DROP POLICY IF EXISTS "Users can create tools" ON tools;
CREATE POLICY "Users can create tools" ON tools
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户可以更新自己的工具
DROP POLICY IF EXISTS "Users can update their own tools" ON tools;
CREATE POLICY "Users can update their own tools" ON tools
  FOR UPDATE USING (auth.uid() = user_id);

-- 用户可以管理自己工具的标签
DROP POLICY IF EXISTS "Users can manage their tool tags" ON tool_tags;
CREATE POLICY "Users can manage their tool tags" ON tool_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM tools 
      WHERE tools.id = tool_tags.tool_id 
      AND tools.user_id = auth.uid()
    )
  );

-- 用户可以管理自己工具的下载链接
DROP POLICY IF EXISTS "Users can manage their tool downloads" ON download_links;
CREATE POLICY "Users can manage their tool downloads" ON download_links
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM tools 
      WHERE tools.id = download_links.tool_id 
      AND tools.user_id = auth.uid()
    )
  );

-- 9. 插入示例分类数据
INSERT INTO categories (name_zh, name_en, parent_id, sort_order) VALUES
('开发工具', 'Development Tools', NULL, 1),
('设计工具', 'Design Tools', NULL, 2),
('办公软件', 'Office Software', NULL, 3),
('系统工具', 'System Tools', NULL, 4),
('网络工具', 'Network Tools', NULL, 5)
ON CONFLICT DO NOTHING;

-- 插入二级分类
INSERT INTO categories (name_zh, name_en, parent_id, sort_order) VALUES
('代码编辑器', 'Code Editors', (SELECT id FROM categories WHERE name_en = 'Development Tools'), 1),
('版本控制', 'Version Control', (SELECT id FROM categories WHERE name_en = 'Development Tools'), 2),
('API工具', 'API Tools', (SELECT id FROM categories WHERE name_en = 'Development Tools'), 3),
('图像编辑', 'Image Editing', (SELECT id FROM categories WHERE name_en = 'Design Tools'), 1),
('UI设计', 'UI Design', (SELECT id FROM categories WHERE name_en = 'Design Tools'), 2),
('文档处理', 'Document Processing', (SELECT id FROM categories WHERE name_en = 'Office Software'), 1),
('表格工具', 'Spreadsheet Tools', (SELECT id FROM categories WHERE name_en = 'Office Software'), 2),
('文件管理', 'File Management', (SELECT id FROM categories WHERE name_en = 'System Tools'), 1),
('系统监控', 'System Monitoring', (SELECT id FROM categories WHERE name_en = 'System Tools'), 2),
('网络分析', 'Network Analysis', (SELECT id FROM categories WHERE name_en = 'Network Tools'), 1)
ON CONFLICT DO NOTHING;

-- 10. 插入示例工具数据
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
  (SELECT id FROM categories WHERE name_en = 'Development Tools'),
  (SELECT id FROM categories WHERE name_en = 'Code Editors'),
  1
),
(
  'Figma', 'Figma',
  '基于浏览器的协作式界面设计工具，支持实时协作和原型制作。',
  'Browser-based collaborative interface design tool with real-time collaboration and prototyping capabilities.',
  'https://figma.com',
  '["web", "windows", "macos"]',
  (SELECT id FROM categories WHERE name_en = 'Design Tools'),
  (SELECT id FROM categories WHERE name_en = 'UI Design'),
  1
),
(
  'GitHub', 'GitHub',
  '全球最大的代码托管平台，支持Git版本控制和团队协作。',
  'The world''s largest code hosting platform with Git version control and team collaboration features.',
  'https://github.com',
  '["web"]',
  (SELECT id FROM categories WHERE name_en = 'Development Tools'),
  (SELECT id FROM categories WHERE name_en = 'Version Control'),
  1
)
ON CONFLICT DO NOTHING;

-- 11. 创建用户统计视图
CREATE OR REPLACE VIEW user_tool_stats AS
SELECT 
    t.user_id,
    COUNT(*) as tool_count,
    COUNT(CASE WHEN t.status = 1 THEN 1 END) as published_count,
    MAX(t.created_at) as last_tool_created
FROM tools t
WHERE t.user_id IS NOT NULL
GROUP BY t.user_id;

-- 12. 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_tools_updated_at ON tools;
CREATE TRIGGER update_tools_updated_at
    BEFORE UPDATE ON tools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 完成提示
DO $$
BEGIN
    RAISE NOTICE '✅ Tool Hub 数据库设置完成！';
    RAISE NOTICE '📊 已创建 % 个分类', (SELECT COUNT(*) FROM categories);
    RAISE NOTICE '🛠️ 已创建 % 个示例工具', (SELECT COUNT(*) FROM tools);
    RAISE NOTICE '🚀 现在可以开始使用应用了！';
END $$;