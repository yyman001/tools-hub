// 详细平台类型
export type DetailedPlatformType = 
  | 'windows' 
  | 'macos' 
  | 'linux' 
  | 'android' 
  | 'ios' 
  | 'web' 
  | 'cross-platform'

// 平台信息接口
export interface PlatformInfo {
  type: DetailedPlatformType
  name: string           // 显示名称，如"Windows"、"跨平台"
  description?: string   // 详细描述，如"支持Windows 10/11"
  icon?: string         // 平台图标
}

// 下载地址类型
export interface DownloadLink {
  name: string        // 下载源名称，如"官网下载"、"百度网盘"、"阿里云盘"等
  url: string         // 下载链接
  type: 'official' | 'cloud' | 'mirror' | 'other'  // 下载类型
  description?: string // 描述信息，如"提取码：1234"
  platform?: DetailedPlatformType // 针对特定平台的下载
}

// 工具数据结构
export interface Tool {
    id: string
    name_zh: string                 // 中文名称
    name_en: string                 // 英文名称
    description_zh: string          // 中文描述
    description_en: string          // 英文描述
    homepage_url: string            // 工具主页链接
    version?: string                // 版本号
    download_url?: string           // 主要下载地址
    screenshot_url?: string         // 截图链接
    supported_platforms: string[]   // 支持的平台（JSON数组）
    primary_category_id: number     // 主分类ID
    secondary_category_id?: number  // 二级分类ID（可选）
    primaryCategory?: Category      // 主分类详细信息
    secondaryCategory?: Category    // 二级分类详细信息
    tags: string[]
    rating: number
    status: number                  // 状态：1-启用，0-禁用
    created_at: string
    updated_at: string
    userId: string
    isPublic: boolean
    viewCount: number
    likeCount: number
    // 扩展属性（用于前端展示）
    downloadLinks: DownloadLink[]   // 备用下载地址
}

// 层级分类数据结构
export interface Category {
    id: number
    name_zh: string                 // 中文名称
    name_en: string                 // 英文名称
    parent_id: number | null        // 父分类ID
    sort_order: number              // 排序
    status: number                  // 状态：1-启用，0-禁用
    created_at: string
    children?: Category[]
    // UI相关属性
    icon?: string
    color?: string
    toolCount?: number
}

// 分类树结构
export interface CategoryTree {
    categories: Category[]
    totalCount: number
}

// 分类路径信息
export interface CategoryPath {
    id: number
    name_zh: string
    name_en: string
}

// 分类验证结果
export interface CategoryValidation {
    isValid: boolean
    errors: string[]
}

// 分类操作选项
export interface CategoryDeleteOptions {
    action: 'delete_all' | 'move_tools'
    targetCategoryId?: number
}

// 用户数据结构
export interface User {
    id: string
    username: string
    email: string
    avatar?: string
    createdAt: string
    toolCount: number
    favoriteCount: number
}

// 文章数据结构
export interface Article {
    id: string
    title: string
    content: string
    summary: string
    author: User
    category: string
    tags: string[]
    createdAt: string
    updatedAt: string
    viewCount: number
    likeCount: number
    isPublished: boolean
}

// API响应结构
export interface ApiResponse<T> {
    code: number
    message: string
    data: T
}

// 分类API响应类型
export interface CategoryCreateRequest {
    name_zh: string
    name_en: string
    parent_id?: number
    sort_order?: number
}

export interface CategoryUpdateRequest {
    name_zh?: string
    name_en?: string
    parent_id?: number
    sort_order?: number
}

export interface CategoryDeleteResponse {
    success: boolean
    message: string
    affectedTools?: number
}

// 分类工具查询参数
export interface CategoryToolsParams {
    includeSubcategories?: boolean
    page?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// 分页数据结构
export interface PaginatedData<T> {
    items: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

// 搜索参数
export interface SearchParams {
    keyword?: string
    categoryId?: number             // 修改为数字类型
    includeSubcategories?: boolean  // 是否包含子分类
    tags?: string[]
    page?: number
    pageSize?: number
    sortBy?: 'createdAt' | 'rating' | 'viewCount' | 'likeCount'
    sortOrder?: 'asc' | 'desc'
}

// 工具表单数据
export interface ToolFormData {
    name_zh: string                 // 中文名称
    name_en: string                 // 英文名称
    description_zh: string          // 中文描述
    description_en: string          // 英文描述
    homepage_url: string            // 工具主页链接
    version?: string                // 版本号
    primary_category_id: string     // 主分类ID（表单中为字符串）
    secondary_category_id?: string  // 二级分类ID（可选）
    tags: string[]
    screenshot_url?: string         // 截图链接
    supported_platforms: string[]   // 支持的平台
    isPublic: boolean
    downloadLinks: DownloadLink[]   // 下载地址
}