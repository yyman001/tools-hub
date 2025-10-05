-- 为工具表添加版本号字段
-- 在 Supabase Dashboard 的 SQL Editor 中执行此脚本

-- 1. 添加版本号字段到 tools 表
ALTER TABLE tools ADD COLUMN IF NOT EXISTS version VARCHAR(100);

-- 2. 为现有工具设置默认版本号（可选）
UPDATE tools SET version = NULL WHERE version IS NULL;

-- 3. 添加版本号字段的注释
COMMENT ON COLUMN tools.version IS '工具版本号，如 v1.0.0, 2024.1 等，为空时显示为"最新"';

-- 4. 创建索引（如果需要按版本号搜索）
CREATE INDEX IF NOT EXISTS idx_tools_version ON tools(version);

-- 完成提示
DO $$
BEGIN
    RAISE NOTICE '✅ 版本号字段添加完成！';
    RAISE NOTICE '📝 字段名称: version (VARCHAR(100))';
    RAISE NOTICE '💡 为空时将显示为"最新"';
END $$;