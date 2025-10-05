# SQL 语法错误快速修复

## 问题描述

执行 SQL 脚本时遇到语法错误：
```
ERROR: 42601: syntax error at or near "$"
LINE 31: DO $ ^
```

## 问题原因

PostgreSQL 的 `DO` 块需要使用 `$$` 作为分隔符，而不是单个 `$`。

## 修复方案

### 1. 语法修复

**错误写法**：
```sql
DO $
BEGIN
    RAISE NOTICE '提示信息';
END $;
```

**正确写法**：
```sql
DO $$
BEGIN
    RAISE NOTICE '提示信息';
END $$;
```

### 2. 提供的修复脚本

已创建两个版本的修复脚本：

#### 简化版本（推荐）
**文件**: `fix-tags-rls-policy-simple.sql`
- 不包含 `DO` 块和提示信息
- 兼容性更好，不会有语法错误
- 只包含核心的策略创建语句

#### 完整版本
**文件**: `fix-tags-rls-policy.sql`
- 包含修复后的 `DO $$` 语法
- 包含执行完成的提示信息
- 如果仍有问题，请使用简化版本

### 3. 版本字段脚本

**文件**: `add-version-field.sql`
- 已修复 `DO` 块语法
- 使用正确的 `DO $$` 分隔符

## 使用建议

1. **优先使用简化版本**: `fix-tags-rls-policy-simple.sql`
2. **如果需要提示信息**: 使用 `fix-tags-rls-policy.sql`
3. **执行顺序**: 先执行标签策略修复，再执行版本字段添加

## 验证方法

执行脚本后，可以通过以下方式验证：
1. 在 Supabase Dashboard 中检查策略是否创建成功
2. 尝试在应用中添加带标签的工具
3. 检查是否还有权限错误

## 完成时间

修复完成时间：2025年10月5日