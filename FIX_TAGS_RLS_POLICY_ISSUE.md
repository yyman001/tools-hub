# 修复标签 RLS 策略问题

## 问题描述

用户在添加工具时遇到以下错误：
- `GET` 请求返回 406 (Not Acceptable) - 查询标签时出错
- `POST` 请求返回 403 (Forbidden) - 创建标签时违反了行级安全策略

错误信息：
```
new row violates row-level security policy for table "tags"
```

## 问题原因

当前的 Supabase 数据库 RLS (Row Level Security) 策略只允许读取标签，但不允许用户创建新标签或添加工具标签关联。

## 解决方案

### 1. 数据库策略修复

**文件**: `fix-tags-rls-policy.sql` 或 `fix-tags-rls-policy-simple.sql`

创建了修复脚本，需要在 Supabase Dashboard 的 SQL Editor 中执行。如果遇到语法错误，请使用简化版本：

```sql
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
```

### 2. 客户端错误处理改进

**文件**: `src/services/supabaseService.ts`

改进了错误处理，提供更友好的错误信息：

```typescript
// 标签创建错误处理
if (createError) {
  console.error('创建标签失败:', createError)
  if (createError.code === '42501') {
    throw new Error('权限不足：无法创建标签。请联系管理员配置数据库权限。')
  }
  throw createError
}

// 标签关联错误处理
if (linkError && linkError.code !== '23505') {
  console.error('关联标签失败:', linkError)
  if (linkError.code === '42501') {
    throw new Error('权限不足：无法关联标签。请联系管理员配置数据库权限。')
  }
  throw linkError
}
```

## 新的 RLS 策略说明

### 标签表 (tags)
- ✅ **读取权限**: 所有人都可以读取标签
- ✅ **创建权限**: 已登录用户可以创建新标签

### 工具标签关联表 (tool_tags)
- ✅ **读取权限**: 所有人都可以读取工具标签关联
- ✅ **创建权限**: 用户只能为自己的工具添加标签关联

## 安全考虑

1. **权限控制**: 只有已登录用户才能创建标签
2. **所有权验证**: 用户只能为自己创建的工具添加标签
3. **数据完整性**: 防止重复标签关联（通过数据库约束）

## 使用说明

### 数据库管理员操作
1. 在 Supabase Dashboard 中打开 SQL Editor
2. 执行 `fix-tags-rls-policy.sql` 脚本
3. 确认策略创建成功

### 开发者验证
1. 尝试添加带有标签的工具
2. 检查控制台是否有错误信息
3. 验证标签是否正确创建和关联

## 预期效果

修复后，用户应该能够：
- ✅ 在添加工具时创建新标签
- ✅ 为工具关联现有标签
- ✅ 查看所有工具的标签信息
- ✅ 获得友好的错误提示（如果仍有权限问题）

## 验证结果

- ✅ 项目构建成功 (`npm run build`)
- ✅ 错误处理逻辑改进
- ✅ SQL 修复脚本准备就绪
- ✅ 无语法错误或编译错误

## 完成时间

修复完成时间：2025年10月5日

## 注意事项

⚠️ **重要**: 必须在 Supabase 数据库中执行修复脚本才能完全解决问题。仅更新客户端代码无法解决 RLS 策略限制。

### SQL 脚本选择：
- **推荐**: 使用 `fix-tags-rls-policy-simple.sql`（无提示信息，兼容性更好）
- **备选**: 使用 `fix-tags-rls-policy.sql`（包含提示信息，如果遇到语法错误请使用简化版本）

### 执行步骤：
1. 登录 Supabase Dashboard
2. 进入项目的 SQL Editor
3. 复制并粘贴脚本内容
4. 点击 "Run" 执行脚本
5. 确认所有策略创建成功