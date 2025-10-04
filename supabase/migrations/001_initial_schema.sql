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
  status SMALLINT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_tools_primary_category ON tools(primary_category_id);
CREATE INDEX idx_tools_secondary_category ON tools(secondary_category_id);
CREATE INDEX idx_tools_status ON tools(status);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_status ON categories(status);

-- 启用 RLS (Row Level Security)
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 创建策略：所有人都可以读取启用状态的数据
CREATE POLICY "Anyone can read active tools" ON tools
  FOR SELECT USING (status = 1);

CREATE POLICY "Anyone can read active categories" ON categories
  FOR SELECT USING (status = 1);