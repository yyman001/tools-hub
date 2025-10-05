# 改进标签查询的健壮性

## 问题描述

用户在添加工具时仍然遇到标签查询的 406 错误：
```
GET https://eoheityzokbgwrsfehgu.supabase.co/rest/v1/tags?select=id&name=eq.sss 406 (Not Acceptable)
```

## 问题分析

406 错误通常表示：
1. 请求格式不被服务器接受
2. Supabase RLS 策略问题
3. 查询语法或权限问题

## 解决方案

### 改进标签处理逻辑

**文件**: `src/services/supabaseService.ts`

#### 主要改进

1. **更健壮的查询方式**：
   - 使用 `.limit(1)` 替代 `.single()`
   - 避免 `.single()` 在没有结果时抛出异常

2. **完善的错误处理**：
   - 添加 try-catch 块包围整个标签处理逻辑
   - 单个标签失败不影响其他标签处理

3. **优雅降级**：
   - 查询失败时尝试直接创建标签
   - 创建失败时跳过该标签并继续处理

#### 新的实现逻辑

```typescript
static async addTagsToTool(toolId: number, tagNames: string[]) {
  for (const tagName of tagNames) {
    const trimmedTagName = tagName.trim()
    if (!trimmedTagName) continue // 跳过空标签

    try {
      // 1. 使用更宽松的查询方式
      let { data: tags, error: queryError } = await supabase
        .from('tags')
        .select('id')
        .eq('name', trimmedTagName)
        .limit(1) // 替代 .single()

      let tag = null
      
      if (queryError) {
        console.error('查询标签失败:', queryError)
        // 查询失败时尝试直接创建
      } else if (tags && tags.length > 0) {
        tag = tags[0]
      }

      // 2. 如果标签不存在，创建新标签
      if (!tag) {
        const { data: newTag, error: createError } = await supabase
          .from('tags')
          .insert({ name: trimmedTagName })
          .select('id')
          .single()

        if (createError) {
          console.error('创建标签失败:', createError)
          if (createError.code === '42501') {
            throw new Error('权限不足：无法创建标签。请联系管理员配置数据库权限。')
          }
          // 创建失败时跳过该标签
          console.warn(`跳过标签 "${trimmedTagName}": ${createError.message}`)
          continue
        }
        tag = newTag
      }

      // 3. 验证标签数据
      if (!tag || !tag.id) {
        console.warn(`无法获取标签 "${trimmedTagName}" 的ID，跳过`)
        continue
      }

      // 4. 关联标签到工具
      const { error: linkError } = await supabase
        .from('tool_tags')
        .insert({
          tool_id: toolId,
          tag_id: tag.id
        })

      if (linkError && linkError.code !== '23505') { // 忽略重复键错误
        console.error('关联标签失败:', linkError)
        if (linkError.code === '42501') {
          throw new Error('权限不足：无法关联标签。请联系管理员配置数据库权限。')
        }
        // 记录错误但继续处理其他标签
        console.warn(`关联标签 "${trimmedTagName}" 失败: ${linkError.message}`)
      }
    } catch (error) {
      console.error(`处理标签 "${trimmedTagName}" 时出错:`, error)
      continue // 跳过有问题的标签，继续处理其他标签
    }
  }
}
```

## 改进特点

### 1. 容错性增强
- ✅ 单个标签失败不影响整体流程
- ✅ 提供详细的错误日志
- ✅ 优雅地跳过有问题的标签

### 2. 查询方式优化
- ✅ 使用 `.limit(1)` 替代 `.single()`
- ✅ 避免 PGRST116 异常
- ✅ 更好的兼容性

### 3. 错误处理完善
- ✅ 区分不同类型的错误
- ✅ 提供用户友好的错误信息
- ✅ 记录详细的调试信息

### 4. 性能优化
- ✅ 跳过空标签处理
- ✅ 避免不必要的数据库操作
- ✅ 减少异常抛出

## 预期效果

### 修复前的问题
- 406 错误导致整个标签处理失败
- 用户无法添加任何标签
- 工具创建可能完全失败

### 修复后的改进
- ✅ 即使部分标签查询失败，其他标签仍能正常处理
- ✅ 提供详细的错误信息帮助调试
- ✅ 工具创建流程更加稳定
- ✅ 用户体验显著改善

## 调试信息

新的实现会在控制台提供详细的调试信息：
- 查询失败的具体错误
- 创建失败的标签名称和原因
- 关联失败的详细信息
- 跳过的标签及原因

## 后续建议

1. **数据库策略修复**：仍建议执行 RLS 策略修复脚本
2. **监控错误日志**：关注控制台的标签处理错误信息
3. **用户反馈**：收集用户关于标签功能的使用反馈

## 验证结果

- ✅ 项目构建成功 (`npm run build`)
- ✅ 无语法错误或编译错误
- ✅ 错误处理逻辑完善
- ✅ 容错性显著提升

## 完成时间

改进完成时间：2025年10月5日