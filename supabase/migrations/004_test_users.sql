-- 创建测试用户的函数（仅用于开发环境）
-- 注意：这个脚本仅用于本地开发，生产环境不应该运行

-- 插入一些测试分类数据（如果还没有的话）
INSERT INTO categories (name_zh, name_en, parent_id, sort_order) 
VALUES 
  ('开发工具', 'Development Tools', NULL, 1),
  ('设计工具', 'Design Tools', NULL, 2),
  ('办公软件', 'Office Software', NULL, 3)
ON CONFLICT DO NOTHING;

-- 为测试用户创建一些示例工具
-- 注意：这里的 user_id 需要在实际测试时替换为真实的用户 ID

-- 创建一个函数来插入测试数据
CREATE OR REPLACE FUNCTION create_test_tool_data()
RETURNS void AS $$
DECLARE
    dev_category_id INTEGER;
    design_category_id INTEGER;
BEGIN
    -- 获取分类 ID
    SELECT id INTO dev_category_id FROM categories WHERE name_en = 'Development Tools' LIMIT 1;
    SELECT id INTO design_category_id FROM categories WHERE name_en = 'Design Tools' LIMIT 1;
    
    -- 插入测试工具（不指定 user_id，让用户登录后自己创建）
    -- 这里只是为了演示数据结构
END;
$$ LANGUAGE plpgsql;

-- 创建一个视图来显示工具统计
CREATE OR REPLACE VIEW user_tool_stats AS
SELECT 
    t.user_id,
    COUNT(*) as tool_count,
    COUNT(CASE WHEN t.status = 1 THEN 1 END) as published_count,
    MAX(t.created_at) as last_tool_created
FROM tools t
WHERE t.user_id IS NOT NULL
GROUP BY t.user_id;