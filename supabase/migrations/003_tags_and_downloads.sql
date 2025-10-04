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

-- 用户工具关联（添加用户ID到工具表）
ALTER TABLE tools ADD COLUMN user_id UUID REFERENCES auth.users(id);
ALTER TABLE tools ADD COLUMN view_count INTEGER DEFAULT 0;
ALTER TABLE tools ADD COLUMN like_count INTEGER DEFAULT 0;

-- 创建索引
CREATE INDEX idx_tool_tags_tool_id ON tool_tags(tool_id);
CREATE INDEX idx_tool_tags_tag_id ON tool_tags(tag_id);
CREATE INDEX idx_download_links_tool_id ON download_links(tool_id);
CREATE INDEX idx_tools_user_id ON tools(user_id);

-- 启用 RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_links ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY "Anyone can read tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Anyone can read tool_tags" ON tool_tags FOR SELECT USING (true);
CREATE POLICY "Anyone can read download_links" ON download_links FOR SELECT USING (true);

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

-- 用户只能创建和编辑自己的工具
CREATE POLICY "Users can create tools" ON tools
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tools" ON tools
  FOR UPDATE USING (auth.uid() = user_id);