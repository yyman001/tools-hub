# 分类层级扩展设计文档

## 概述

本设计文档描述了将现有单级分类系统扩展为支持二级分类的层级分类系统。该系统将允许管理员创建和管理分类层级，工具发布者选择更精确的分类，用户通过层级结构浏览和搜索工具。

设计目标：
- 保持向后兼容性，现有单级分类继续有效
- 提供直观的层级分类管理界面
- 优化性能，确保快速加载和响应
- 支持灵活的分类选择和筛选

## 架构

### 数据层架构

采用自引用表结构设计，单表存储所有分类信息：

```
categories 表结构：
- id: 主键
- name: 分类名称
- parent_id: 父分类ID（NULL表示顶级分类）
- slug: URL友好的标识符
- description: 分类描述
- sort_order: 排序权重
- created_at: 创建时间
- updated_at: 更新时间
```

**设计决策理由：** 自引用表结构简单灵活，易于扩展到更多层级，查询效率高，维护成本低。

### 前端架构

采用组件化设计，将分类功能拆分为独立的可复用组件：

- `CategoryTree`: 层级分类树组件
- `CategorySelector`: 分类选择器组件  
- `CategoryBreadcrumb`: 面包屑导航组件
- `CategoryFilter`: 分类筛选组件

## 组件和接口

### 数据模型

```typescript
interface Category {
  id: number;
  name: string;
  parentId: number | null;
  slug: string;
  description?: string;
  sortOrder: number;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

interface CategoryTree {
  categories: Category[];
  totalCount: number;
}

interface Tool {
  id: number;
  name: string;
  categoryId: number;
  category?: Category;
  // ... 其他工具属性
}
```

### API 接口设计

#### 分类管理接口

```typescript
// 获取分类树
GET /api/categories/tree
Response: CategoryTree

// 创建分类
POST /api/categories
Body: { name: string, parentId?: number, description?: string }
Response: Category

// 更新分类
PUT /api/categories/:id
Body: { name?: string, parentId?: number, description?: string }
Response: Category

// 删除分类
DELETE /api/categories/:id?action=move_tools&targetCategoryId=123
Response: { success: boolean, message: string }

// 获取分类下的工具
GET /api/categories/:id/tools?includeSubcategories=true
Response: { tools: Tool[], pagination: PaginationInfo }
```

#### 工具分类接口

```typescript
// 更新工具分类
PUT /api/tools/:id/category
Body: { categoryId: number }
Response: Tool

// 按分类筛选工具
GET /api/tools?categoryId=123&includeSubcategories=true
Response: { tools: Tool[], pagination: PaginationInfo }
```

### 前端组件接口

#### CategoryTree 组件

```vue
<CategoryTree
  :categories="categories"
  :editable="true"
  :expandable="true"
  @select="onCategorySelect"
  @create="onCategoryCreate"
  @update="onCategoryUpdate"
  @delete="onCategoryDelete"
/>
```

#### CategorySelector 组件

```vue
<CategorySelector
  v-model="selectedCategoryId"
  :placeholder="'选择分类'"
  :allow-create="false"
  :show-path="true"
/>
```

## 数据模型

### 分类层级关系

采用邻接列表模型存储层级关系：

```sql
-- 示例数据
INSERT INTO categories VALUES 
(1, '开发工具', NULL, 'development', '软件开发相关工具', 1),
(2, '前端开发', 1, 'frontend', '前端开发工具', 1),
(3, '后端开发', 1, 'backend', '后端开发工具', 2),
(4, '设计工具', NULL, 'design', '设计相关工具', 2);
```

### 查询优化策略

1. **递归查询优化：** 使用 WITH RECURSIVE CTE 查询分类树
2. **缓存策略：** 前端缓存分类树结构，减少API调用
3. **懒加载：** 大型分类树支持按需加载子分类

```sql
-- 获取完整分类树的递归查询
WITH RECURSIVE category_tree AS (
  SELECT id, name, parent_id, 0 as level, CAST(name AS TEXT) as path
  FROM categories WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id, c.name, c.parent_id, ct.level + 1, ct.path || ' > ' || c.name
  FROM categories c
  JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree ORDER BY level, name;
```

## 错误处理

### 分类管理错误处理

1. **循环引用检测：** 防止将分类设置为自己的子分类
2. **删除约束：** 删除有子分类的分类时提供处理选项
3. **工具关联检查：** 删除分类前检查是否有关联工具

```typescript
// 循环引用检测逻辑
async function validateCategoryHierarchy(categoryId: number, newParentId: number): Promise<boolean> {
  if (categoryId === newParentId) return false;
  
  const ancestors = await getCategoryAncestors(newParentId);
  return !ancestors.some(ancestor => ancestor.id === categoryId);
}

// 删除分类处理逻辑
async function deleteCategory(categoryId: number, action: 'delete_all' | 'move_tools', targetCategoryId?: number) {
  const hasChildren = await hasSubcategories(categoryId);
  const hasTools = await hasAssociatedTools(categoryId);
  
  if (hasChildren && action === 'delete_all') {
    await deleteSubcategoriesRecursively(categoryId);
  } else if (hasTools && action === 'move_tools' && targetCategoryId) {
    await moveToolsToCategory(categoryId, targetCategoryId);
  }
  
  await deleteCategoryRecord(categoryId);
}
```

### 前端错误处理

1. **网络错误：** 显示友好的错误提示，支持重试
2. **数据验证：** 客户端验证分类名称、层级关系等
3. **状态管理：** 使用 Pinia 管理分类状态，处理加载和错误状态

```typescript
// 分类状态管理
export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [] as Category[],
    loading: false,
    error: null as string | null
  }),
  
  actions: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.get('/categories/tree');
        this.categories = response.data.categories;
      } catch (error) {
        this.error = '加载分类失败，请重试';
        console.error('Failed to fetch categories:', error);
      } finally {
        this.loading = false;
      }
    }
  }
});
```

## 测试策略

### 单元测试

1. **数据模型测试：** 测试分类CRUD操作、层级关系验证
2. **组件测试：** 测试分类树、选择器、筛选器组件的交互
3. **工具函数测试：** 测试分类路径生成、层级验证等工具函数

### 集成测试

1. **API集成测试：** 测试分类管理API的完整流程
2. **前后端集成：** 测试分类选择、工具筛选的端到端流程
3. **数据库集成：** 测试复杂查询和数据一致性

### 性能测试

1. **分类树加载性能：** 测试大量分类数据的加载时间
2. **搜索筛选性能：** 测试分类筛选的响应时间
3. **并发操作测试：** 测试多用户同时操作分类的性能

### 用户体验测试

1. **响应式设计测试：** 确保在不同设备上的良好体验
2. **无障碍访问测试：** 支持键盘导航和屏幕阅读器
3. **浏览器兼容性测试：** 确保主流浏览器的兼容性

## 性能优化

### 前端优化

1. **虚拟滚动：** 大型分类列表使用虚拟滚动提升性能
2. **分类缓存：** 使用 localStorage 缓存分类数据
3. **懒加载：** 分类树支持按需展开加载
4. **防抖搜索：** 搜索输入使用防抖减少API调用

### 后端优化

1. **数据库索引：** 为 parent_id、slug 等字段添加索引
2. **查询优化：** 使用递归CTE优化层级查询
3. **缓存策略：** Redis缓存分类树结构
4. **分页支持：** 大量工具列表支持分页加载

### 缓存策略

```typescript
// 分类缓存管理
class CategoryCache {
  private cache = new Map<string, { data: any, timestamp: number }>();
  private TTL = 5 * 60 * 1000; // 5分钟缓存

  get(key: string) {
    const item = this.cache.get(key);
    if (item && Date.now() - item.timestamp < this.TTL) {
      return item.data;
    }
    this.cache.delete(key);
    return null;
  }

  set(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}
```

## 迁移策略

### 数据迁移

1. **现有分类保持：** 现有单级分类自动成为顶级分类
2. **工具关联保持：** 现有工具的分类关联保持不变
3. **渐进式迁移：** 支持逐步将单级分类细分为二级分类

### 向后兼容

1. **API兼容：** 保持现有分类API的向后兼容
2. **前端兼容：** 现有分类选择组件继续工作
3. **数据兼容：** 支持混合使用单级和二级分类

### 部署策略

1. **数据库迁移脚本：** 创建安全的数据库结构变更脚本
2. **功能开关：** 使用功能开关控制新功能的启用
3. **灰度发布：** 逐步向用户开放层级分类功能