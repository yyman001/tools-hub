import type { Category, CategoryPath, CategoryValidation } from '@/types'

/**
 * 构建分类树结构
 * @param categories 扁平的分类数组
 * @returns 层级分类树
 */
export function buildCategoryTree(categories: Category[]): Category[] {
  const categoryMap = new Map<number, Category>()
  const rootCategories: Category[] = []

  // 创建分类映射并初始化children数组
  categories.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] })
  })

  // 构建树结构
  categories.forEach(category => {
    const categoryNode = categoryMap.get(category.id)!
    
    if (category.parentId === null) {
      // 顶级分类
      rootCategories.push(categoryNode)
    } else {
      // 子分类
      const parent = categoryMap.get(category.parentId)
      if (parent) {
        parent.children!.push(categoryNode)
      }
    }
  })

  // 按sortOrder排序
  const sortCategories = (cats: Category[]) => {
    cats.sort((a, b) => a.sortOrder - b.sortOrder)
    cats.forEach(cat => {
      if (cat.children && cat.children.length > 0) {
        sortCategories(cat.children)
      }
    })
  }

  sortCategories(rootCategories)
  return rootCategories
}

/**
 * 获取分类的完整路径
 * @param categoryId 分类ID
 * @param categories 所有分类数据
 * @returns 分类路径数组
 */
export function getCategoryPath(categoryId: number, categories: Category[]): CategoryPath[] {
  const categoryMap = new Map<number, Category>()
  categories.forEach(cat => categoryMap.set(cat.id, cat))

  const path: CategoryPath[] = []
  let currentId: number | null = categoryId

  while (currentId !== null) {
    const category = categoryMap.get(currentId)
    if (!category) break

    path.unshift({
      id: category.id,
      name: category.name,
      slug: category.slug
    })

    currentId = category.parentId
  }

  return path
}

/**
 * 获取分类的所有祖先分类ID
 * @param categoryId 分类ID
 * @param categories 所有分类数据
 * @returns 祖先分类ID数组
 */
export function getCategoryAncestors(categoryId: number, categories: Category[]): number[] {
  const categoryMap = new Map<number, Category>()
  categories.forEach(cat => categoryMap.set(cat.id, cat))

  const ancestors: number[] = []
  let currentId: number | null = categoryId

  while (currentId !== null) {
    const category = categoryMap.get(currentId)
    if (!category) break

    if (category.parentId !== null) {
      ancestors.push(category.parentId)
    }
    currentId = category.parentId
  }

  return ancestors
}

/**
 * 获取分类的所有后代分类ID
 * @param categoryId 分类ID
 * @param categories 所有分类数据
 * @returns 后代分类ID数组
 */
export function getCategoryDescendants(categoryId: number, categories: Category[]): number[] {
  const descendants: number[] = []
  const categoryMap = new Map<number, Category>()
  categories.forEach(cat => categoryMap.set(cat.id, cat))

  const collectDescendants = (id: number) => {
    categories.forEach(cat => {
      if (cat.parentId === id) {
        descendants.push(cat.id)
        collectDescendants(cat.id)
      }
    })
  }

  collectDescendants(categoryId)
  return descendants
}

/**
 * 验证分类层级关系是否有效（防止循环引用）
 * @param categoryId 要修改的分类ID
 * @param newParentId 新的父分类ID
 * @param categories 所有分类数据
 * @returns 验证结果
 */
export function validateCategoryHierarchy(
  categoryId: number,
  newParentId: number | null,
  categories: Category[]
): CategoryValidation {
  const errors: string[] = []

  // 不能将分类设置为自己的父分类
  if (categoryId === newParentId) {
    errors.push('分类不能设置为自己的父分类')
  }

  // 不能将分类设置为自己后代的父分类（防止循环引用）
  if (newParentId !== null) {
    const descendants = getCategoryDescendants(categoryId, categories)
    if (descendants.includes(newParentId)) {
      errors.push('不能将分类设置为其子分类的父分类，这会造成循环引用')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * 检查分类是否有子分类
 * @param categoryId 分类ID
 * @param categories 所有分类数据
 * @returns 是否有子分类
 */
export function hasSubcategories(categoryId: number, categories: Category[]): boolean {
  return categories.some(cat => cat.parentId === categoryId)
}

/**
 * 获取分类的直接子分类
 * @param categoryId 分类ID
 * @param categories 所有分类数据
 * @returns 子分类数组
 */
export function getDirectChildren(categoryId: number, categories: Category[]): Category[] {
  return categories
    .filter(cat => cat.parentId === categoryId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

/**
 * 扁平化分类树
 * @param categoryTree 分类树
 * @returns 扁平的分类数组
 */
export function flattenCategoryTree(categoryTree: Category[]): Category[] {
  const flattened: Category[] = []

  const flatten = (categories: Category[]) => {
    categories.forEach(category => {
      flattened.push(category)
      if (category.children && category.children.length > 0) {
        flatten(category.children)
      }
    })
  }

  flatten(categoryTree)
  return flattened
}

/**
 * 生成分类的显示路径字符串
 * @param categoryPath 分类路径
 * @param separator 分隔符
 * @returns 路径字符串
 */
export function formatCategoryPath(categoryPath: CategoryPath[], separator: string = ' > '): string {
  return categoryPath.map(cat => cat.name).join(separator)
}

/**
 * 根据关键词搜索分类
 * @param categories 分类数组
 * @param keyword 搜索关键词
 * @returns 匹配的分类数组
 */
export function searchCategories(categories: Category[], keyword: string): Category[] {
  if (!keyword.trim()) return categories

  const lowerKeyword = keyword.toLowerCase()
  return categories.filter(category =>
    category.name.toLowerCase().includes(lowerKeyword) ||
    (category.description && category.description.toLowerCase().includes(lowerKeyword))
  )
}