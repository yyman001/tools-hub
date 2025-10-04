import type { 
  Category, 
  CategoryTree, 
  CategoryCreateRequest, 
  CategoryUpdateRequest,
  CategoryDeleteResponse,
  CategoryToolsParams,
  Tool,
  PaginatedData,
  ApiResponse
} from '@/types'

/**
 * 分类数据存储接口
 * 定义分类CRUD操作的抽象层
 */
export interface ICategoryRepository {
  /**
   * 获取所有分类（扁平结构）
   */
  getAllCategories(): Promise<ApiResponse<Category[]>>

  /**
   * 获取分类树结构
   */
  getCategoryTree(): Promise<ApiResponse<CategoryTree>>

  /**
   * 根据ID获取分类
   */
  getCategoryById(id: number): Promise<ApiResponse<Category>>

  /**
   * 根据slug获取分类
   */
  getCategoryBySlug(slug: string): Promise<ApiResponse<Category>>

  /**
   * 创建分类
   */
  createCategory(data: CategoryCreateRequest): Promise<ApiResponse<Category>>

  /**
   * 更新分类
   */
  updateCategory(id: number, data: CategoryUpdateRequest): Promise<ApiResponse<Category>>

  /**
   * 删除分类
   */
  deleteCategory(id: number, options?: {
    action?: 'delete_all' | 'move_tools'
    targetCategoryId?: number
  }): Promise<ApiResponse<CategoryDeleteResponse>>

  /**
   * 获取分类下的工具
   */
  getCategoryTools(
    categoryId: number, 
    params?: CategoryToolsParams
  ): Promise<ApiResponse<PaginatedData<Tool>>>

  /**
   * 检查分类是否有子分类
   */
  hasSubcategories(categoryId: number): Promise<ApiResponse<boolean>>

  /**
   * 检查分类是否有关联工具
   */
  hasAssociatedTools(categoryId: number): Promise<ApiResponse<boolean>>

  /**
   * 获取分类的直接子分类
   */
  getDirectChildren(categoryId: number): Promise<ApiResponse<Category[]>>

  /**
   * 获取分类的所有祖先
   */
  getCategoryAncestors(categoryId: number): Promise<ApiResponse<Category[]>>

  /**
   * 获取分类的所有后代
   */
  getCategoryDescendants(categoryId: number): Promise<ApiResponse<Category[]>>

  /**
   * 批量更新分类排序
   */
  updateCategoriesOrder(updates: Array<{ id: number; sortOrder: number }>): Promise<ApiResponse<boolean>>

  /**
   * 搜索分类
   */
  searchCategories(keyword: string): Promise<ApiResponse<Category[]>>
}

/**
 * 分类层级关系管理接口
 */
export interface ICategoryHierarchyManager {
  /**
   * 验证分类层级关系
   */
  validateHierarchy(categoryId: number, newParentId: number | null): Promise<boolean>

  /**
   * 移动分类到新的父分类
   */
  moveCategory(categoryId: number, newParentId: number | null): Promise<boolean>

  /**
   * 重建分类树缓存
   */
  rebuildTreeCache(): Promise<void>

  /**
   * 计算分类的层级深度
   */
  getCategoryDepth(categoryId: number): Promise<number>

  /**
   * 获取分类的完整路径
   */
  getCategoryPath(categoryId: number): Promise<Category[]>
}

/**
 * 分类数据验证和约束检查接口
 */
export interface ICategoryValidator {
  /**
   * 验证分类名称唯一性（同级）
   */
  validateNameUniqueness(name: string, parentId: number | null, excludeId?: number): Promise<boolean>

  /**
   * 验证分类slug唯一性
   */
  validateSlugUniqueness(slug: string, excludeId?: number): Promise<boolean>

  /**
   * 验证分类创建请求
   */
  validateCreateRequest(request: CategoryCreateRequest): Promise<{ isValid: boolean; errors: string[] }>

  /**
   * 验证分类更新请求
   */
  validateUpdateRequest(id: number, request: CategoryUpdateRequest): Promise<{ isValid: boolean; errors: string[] }>

  /**
   * 验证分类删除操作
   */
  validateDeleteOperation(id: number): Promise<{ 
    canDelete: boolean
    hasChildren: boolean
    hasTools: boolean
    warnings: string[]
  }>

  /**
   * 检查循环引用
   */
  checkCircularReference(categoryId: number, newParentId: number): Promise<boolean>
}

/**
 * 分类缓存管理接口
 */
export interface ICategoryCacheManager {
  /**
   * 获取缓存的分类树
   */
  getCachedTree(): CategoryTree | null

  /**
   * 设置分类树缓存
   */
  setCachedTree(tree: CategoryTree): void

  /**
   * 清除分类缓存
   */
  clearCache(): void

  /**
   * 获取缓存的分类数据
   */
  getCachedCategory(id: number): Category | null

  /**
   * 设置分类缓存
   */
  setCachedCategory(category: Category): void

  /**
   * 批量设置分类缓存
   */
  setCachedCategories(categories: Category[]): void

  /**
   * 检查缓存是否过期
   */
  isCacheExpired(): boolean

  /**
   * 获取缓存统计信息
   */
  getCacheStats(): {
    treeLastUpdated: Date | null
    categoriesCount: number
    hitCount: number
    missCount: number
  }
}