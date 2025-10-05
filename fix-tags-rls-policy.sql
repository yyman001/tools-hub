-- 修复标签表的行级安全策略
-- 在 Supabase Dashboard 的 SQL Editor 中执行此脚本

-- 1. 添加用户可以创建标签的策略
DROP POLICY IF EXISTS "Users can create tags" ON tags;
CREATE POLICY "Users can create tags" ON tags
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 2. 添加用户可以插入工具标签关联的策略
DROP POLICY IF EXISTS "Users can insert tool tags" ON tool_tags;
CREATE POLICY "Users can insert tool tags" ON tool_tags
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tools 
      WHERE tools.id = tool_tags.tool_id 
      AND tools.user_id = auth.uid()
    )
  );

-- 3. 确保用户可以查询标签（用于检查标签是否存在）
DROP POLICY IF EXISTS "Anyone can read tags" ON tags;
CREATE POLICY "Anyone can read tags" ON tags 
  FOR SELECT USING (true);

-- 4. 确保用户可以查询工具标签关联
DROP POLICY IF EXISTS "Anyone can read tool_tags" ON tool_tags;
CREATE POLICY "Anyone can read tool_tags" ON tool_tags 
  FOR SELECT USING (true);

-- 完成提示
DO $$
BEGIN
    RAISE NOTICE '✅ 标签 RLS 策略修复完成！';
    RAISE NOTICE '📝 现在用户可以：';
    RAISE NOTICE '   - 创建新标签';
    RAISE NOTICE '   - 为自己的工具添加标签关联';
    RAISE NOTICE '   - 查询所有标签和标签关联';
END $$;