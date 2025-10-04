import type { 
  Category, 
  CategoryCreateRequest, 
  CategoryUpdateRequest
} from '@/types'
import type { ICategoryValidator } from './categoryRepository'
import { 
  validateCategoryCreateRequest,
  validateCategoryUpdateRequest,
  validateCategoryDeletion
} from '@/utils/categoryValidation'
import { 
  validateCategoryHierarchy,
  getCategoryAncestors,
  hasSubcategories
} from '@/utils/category'

/**
 * 分类数据验证和约束检查实现
 */
export class CategoryValidator implements ICategoryValidator {
  private categories: Category[] = []

  constructor(categories: Category[] = []) {
    this.categories = categories
  }

  /**
   * 更新分类数据
   */
  updateCategories(categories: Category[]): void {
    this.categories = categories
  }

  /**
   * 验证分类名称唯一性（同级）
   */
  async validateNameUniqueness(
    name: string, 
    parentId: number | null, 
    excludeId?: number
  ): Promise<boolean> {
    const sameLevelCategories = this.categories.filter(cat => 
      cat.parentId === parentId && cat.id !== excludeId
    )
    
    return !sameLevelCategories.some(cat => 
      cat.name.toLowerCase() === name.toLowerCase()
    )
  }

  /**
   * 验证分类slug唯一性
   */
  async validateSlugUniqueness(slug: string, excludeId?: number): Promise<boolean> {
    return !this.categories.some(cat => 
      cat.slug === slug && cat.id !== excludeId
    )
  }

  /**
   * 验证分类创建请求
   */
  async validateCreateRequest(request: CategoryCreateRequest): Promise<{ 
    isValid: boolean
    errors: string[] 
  }> {
    const validation = validateCategoryCreateRequest(request, this.categories)
    
    // 额外的异步验证
    const errors = [...validation.errors]

    // 验证父分类存在性
    if (request.parentId !== undefined && request.parentId !== null) {
      const parentExists = this.categories.some(cat => cat.id === request.parentId)
      if (!parentExists) {
        errors.push('指定的父分类不存在')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * 验证分类更新请求
   */
  async validateUpdateRequest(
    id: number, 
    request: CategoryUpdateRequest
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const validation = validateCategoryUpdateRequest(id, request, this.categories)
    
    // 额外的异步验证
    const errors = [...validation.errors]

    // 验证分类存在性
    const categoryExists = this.categories.some(cat => cat.id === id)
    if (!categoryExists) {
      errors.push('要更新的分类不存在')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * 验证分类删除操作
   */
  async validateDeleteOperation(id: number): Promise<{ 
    canDelete: boolean
    hasChildren: boolean
    hasTools: boolean
    warnings: string[]
  }> {
    const category = this.categories.find(cat => cat.id === id)
    if (!category) {
      return {
        canDelete: false,
        hasChildren: false,
        hasTools: false,
        warnings: ['要删除的分类不存在']
      }
    }

    const hasChildren = hasSubcategories(id, this.categories)
    // 这里需要从外部获取工具关联信息，暂时设为false
    const hasTools = false // TODO: 需要查询工具数据
    
    const warnings: string[] = []
    
    if (hasChildren) {
      warnings.push('该分类包含子分类，删除时需要选择处理方式')
    }
    
    if (hasTools) {
      warnings.push('该分类下有关联的工具，删除前需要处理这些工具')
    }

    return {
      canDelete: true, // 可以删除，但需要用户确认处理方式
      hasChildren,
      hasTools,
      warnings
    }
  }

  /**
   * 检查循环引用
   */
  async checkCircularReference(categoryId: number, newParentId: number): Promise<boolean> {
    const validation = validateCategoryHierarchy(categoryId, newParentId, this.categories)
    return validation.isValid
  }
}

/**
 * 分类约束检查工具类
 */
export class CategoryConstraints {
  /**
   * 检查分类层级深度限制
   */
  static checkDepthLimit(categoryId: number, categories: Category[], maxDepth: number = 3): boolean {
    const ancestors = getCategoryAncestors(categoryId, categories)
    return ancestors.length < maxDepth
  }

  /**
   * 检查分类名称长度限制
   */
  static checkNameLength(name: string, minLength: number = 2, maxLength: number = 50): boolean {
    const trimmedName = name.trim()
    return trimmedName.length >= minLength && trimmedName.length <= maxLength
  }

  /**
   * 检查分类描述长度限制
   */
  static checkDescriptionLength(description: string, maxLength: number = 200): boolean {
    return description.length <= maxLength
  }

  /**
   * 检查分类排序权重范围
   */
  static checkSortOrderRange(sortOrder: number, min: number = 0, max: number = 9999): boolean {
    return Number.isInteger(sortOrder) && sortOrder >= min && sortOrder <= max
  }

  /**
   * 检查分类slug格式
   */
  static checkSlugFormat(slug: string): boolean {
    const slugPattern = /^[a-zA-Z0-9_-]+$/
    return slugPattern.test(slug) && !slug.startsWith('-') && !slug.endsWith('-')
  }

  /**
   * 检查分类是否可以移动到指定父分类
   */
  static canMoveToParent(
    categoryId: number, 
    newParentId: number | null, 
    categories: Category[]
  ): { canMove: boolean; reason?: string } {
    // 不能移动到自己
    if (categoryId === newParentId) {
      return { canMove: false, reason: '不能将分类移动到自己' }
    }

    // 不能移动到自己的子分类
    if (newParentId !== null) {
      const ancestors = getCategoryAncestors(newParentId, categories)
      if (ancestors.includes(categoryId)) {
        return { canMove: false, reason: '不能将分类移动到自己的子分类' }
      }
    }

    // 检查层级深度限制
    if (newParentId !== null) {
      const newDepth = getCategoryAncestors(newParentId, categories).length + 1
      if (newDepth >= 3) { // 最大支持3级分类
        return { canMove: false, reason: '移动后将超过最大层级深度限制' }
      }
    }

    return { canMove: true }
  }

  /**
   * 获取分类操作的建议
   */
  static getOperationSuggestions(
    operation: 'create' | 'update' | 'delete' | 'move',
    categoryId?: number,
    categories: Category[] = []
  ): string[] {
    const suggestions: string[] = []

    switch (operation) {
      case 'create':
        suggestions.push('建议为新分类选择合适的父分类以便用户浏览')
        suggestions.push('分类名称应该简洁明了，便于用户理解')
        suggestions.push('可以添加描述信息帮助用户了解分类用途')
        break

      case 'update':
        if (categoryId) {
          const hasChildren = hasSubcategories(categoryId, categories)
          if (hasChildren) {
            suggestions.push('修改分类信息会影响所有子分类的显示')
          }
        }
        suggestions.push('修改分类名称时请确保与同级分类不重复')
        break

      case 'delete':
        if (categoryId) {
          const hasChildren = hasSubcategories(categoryId, categories)
          if (hasChildren) {
            suggestions.push('删除前请先处理子分类：移动到其他分类或一并删除')
          }
          suggestions.push('删除前请确认该分类下的工具已妥善处理')
        }
        break

      case 'move':
        suggestions.push('移动分类时请注意层级关系，避免造成循环引用')
        suggestions.push('移动后的分类路径会发生变化，可能影响用户书签')
        break
    }

    return suggestions
  }
}