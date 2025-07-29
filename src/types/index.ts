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
    name: string
    description: string
    url: string
    category: string
    tags: string[]
    screenshot?: string
    rating: number
    createdAt: string
    updatedAt: string
    userId: string
    isPublic: boolean
    viewCount: number
    likeCount: number
    // 新增属性
    platforms: PlatformInfo[]        // 支持的平台详细信息
    downloadLinks: DownloadLink[]    // 备用下载地址
}

// 分类数据结构
export interface Category {
    id: string
    name: string
    description: string
    icon: string
    toolCount: number
    color: string
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
    category?: string
    tags?: string[]
    page?: number
    pageSize?: number
    sortBy?: 'createdAt' | 'rating' | 'viewCount' | 'likeCount'
    sortOrder?: 'asc' | 'desc'
}

// 工具表单数据
export interface ToolFormData {
    name: string
    description: string
    url: string
    category: string
    tags: string[]
    screenshot?: string
    isPublic: boolean
    // 新增表单字段
    platforms: PlatformType[]
    downloadLinks: DownloadLink[]
}