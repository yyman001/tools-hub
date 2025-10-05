import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'
import type { Tool, Category, ToolFormData } from '@/types'

type Tables = Database['public']['Tables']
type ToolRow = Tables['tools']['Row']
type CategoryRow = Tables['categories']['Row']
type ToolInsert = Tables['tools']['Insert']

export class SupabaseService {
  // 工具相关方法
  static async getTools(params: {
    page?: number
    pageSize?: number
    categoryId?: number
    includeSubcategories?: boolean
    search?: string
  } = {}) {
    const { page = 1, pageSize = 20, categoryId, includeSubcategories, search } = params
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('tools')
      .select(`
        *,
        primaryCategory:categories!primary_category_id(id, name_zh, name_en),
        secondaryCategory:categories!secondary_category_id(id, name_zh, name_en),
        tool_tags(tags(id, name)),
        download_links(id, name, url, type, description, platform, sort_order)
      `)
      .eq('status', 1)
      .range(from, to)
      .order('created_at', { ascending: false })

    if (categoryId) {
      if (includeSubcategories) {
        // 获取子分类
        const { data: subcategories } = await supabase
          .from('categories')
          .select('id')
          .eq('parent_id', categoryId)
        
        const categoryIds = [categoryId, ...(subcategories?.map(c => c.id) || [])]
        query = query.in('primary_category_id', categoryIds)
      } else {
        query = query.eq('primary_category_id', categoryId)
      }
    }

    if (search) {
      query = query.or(`name_zh.ilike.%${search}%,name_en.ilike.%${search}%,description_zh.ilike.%${search}%,description_en.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) throw error

    return {
      items: data?.map(SupabaseService.transformToolRow) || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    }
  }

  static async getToolById(id: string) {
    const { data, error } = await supabase
      .from('tools')
      .select(`
        *,
        primaryCategory:categories!primary_category_id(id, name_zh, name_en),
        secondaryCategory:categories!secondary_category_id(id, name_zh, name_en),
        tool_tags(tags(id, name)),
        download_links(id, name, url, type, description, platform, sort_order)
      `)
      .eq('id', id)
      .eq('status', 1)
      .single()

    if (error) throw error
    return SupabaseService.transformToolRow(data)
  }

  static async createTool(toolData: ToolFormData) {
    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('用户未登录')
    }

    const insertData: ToolInsert = {
      name_zh: toolData.name_zh,
      name_en: toolData.name_en,
      description_zh: toolData.description_zh,
      description_en: toolData.description_en,
      homepage_url: toolData.homepage_url,
      screenshot_url: toolData.screenshot_url,
      supported_platforms: JSON.stringify(toolData.supported_platforms),
      primary_category_id: parseInt(toolData.primary_category_id),
      secondary_category_id: toolData.secondary_category_id ? parseInt(toolData.secondary_category_id) : null,
      user_id: user.id,
      status: toolData.isPublic ? 1 : 0
    }

    // 开始事务
    const { data: tool, error: toolError } = await supabase
      .from('tools')
      .insert(insertData)
      .select(`
        *,
        primaryCategory:categories!primary_category_id(id, name_zh, name_en),
        secondaryCategory:categories!secondary_category_id(id, name_zh, name_en)
      `)
      .single()

    if (toolError) throw toolError

    // 处理标签
    if (toolData.tags && toolData.tags.length > 0) {
      await this.addTagsToTool(tool.id, toolData.tags)
    }

    // 处理下载链接
    if (toolData.downloadLinks && toolData.downloadLinks.length > 0) {
      await this.addDownloadLinksToTool(tool.id, toolData.downloadLinks)
    }

    // 重新获取完整的工具数据
    return await SupabaseService.getToolById(tool.id.toString())
  }

  // 添加标签到工具
  static async addTagsToTool(toolId: number, tagNames: string[]) {
    for (const tagName of tagNames) {
      // 先尝试获取或创建标签
      let { data: tag, error } = await supabase
        .from('tags')
        .select('id')
        .eq('name', tagName.trim())
        .single()

      if (error && error.code === 'PGRST116') {
        // 标签不存在，创建新标签
        const { data: newTag, error: createError } = await supabase
          .from('tags')
          .insert({ name: tagName.trim() })
          .select('id')
          .single()

        if (createError) throw createError
        tag = newTag
      } else if (error) {
        throw error
      }

      // 关联标签到工具
      const { error: linkError } = await supabase
        .from('tool_tags')
        .insert({
          tool_id: toolId,
          tag_id: tag.id
        })

      if (linkError && linkError.code !== '23505') { // 忽略重复键错误
        throw linkError
      }
    }
  }

  // 添加下载链接到工具
  static async addDownloadLinksToTool(toolId: number, downloadLinks: any[]) {
    const linksToInsert = downloadLinks
      .filter(link => link.name && link.url) // 只插入有效的链接
      .map((link, index) => ({
        tool_id: toolId,
        name: link.name,
        url: link.url,
        type: link.type || 'official',
        description: link.description || null,
        platform: link.platform || null,
        sort_order: index
      }))

    if (linksToInsert.length > 0) {
      const { error } = await supabase
        .from('download_links')
        .insert(linksToInsert)

      if (error) throw error
    }
  }

  // 分类相关方法
  static async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('status', 1)
      .order('sort_order', { ascending: true })

    if (error) throw error
    return data?.map(SupabaseService.transformCategoryRow) || []
  }

  static async getCategoryById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .eq('status', 1)
      .single()

    if (error) throw error
    return SupabaseService.transformCategoryRow(data)
  }

  static async getCategoryTree() {
    const categories = await SupabaseService.getCategories()
    
    // 构建分类树
    const categoryMap = new Map<number, Category>()
    const rootCategories: Category[] = []

    // 先创建所有分类的映射
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] })
    })

    // 构建树结构
    categories.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id)!
      
      if (category.parent_id === null) {
        rootCategories.push(categoryWithChildren)
      } else {
        const parent = categoryMap.get(category.parent_id)
        if (parent) {
          parent.children = parent.children || []
          parent.children.push(categoryWithChildren)
        }
      }
    })

    return rootCategories
  }

  // 数据转换方法
  private static transformToolRow(row: any): Tool {
    if (!row) {
      throw new Error('Invalid tool data: row is null or undefined')
    }

    // 提取标签
    const tags = row.tool_tags?.map((tt: any) => tt.tags?.name).filter(Boolean) || []
    
    // 提取下载链接并排序
    const downloadLinks = (row.download_links || [])
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((link: any) => ({
        name: link.name || '',
        url: link.url || '',
        type: link.type || 'other',
        description: link.description || '',
        platform: link.platform || ''
      }))

    // 安全解析 supported_platforms
    let supportedPlatforms: string[] = []
    try {
      if (row.supported_platforms) {
        if (typeof row.supported_platforms === 'string') {
          supportedPlatforms = JSON.parse(row.supported_platforms)
        } else if (Array.isArray(row.supported_platforms)) {
          supportedPlatforms = row.supported_platforms
        }
      }
    } catch (error) {
      console.warn('Failed to parse supported_platforms:', error)
      supportedPlatforms = []
    }

    return {
      id: row.id?.toString() || '',
      name_zh: row.name_zh || '',
      name_en: row.name_en || '',
      description_zh: row.description_zh || '',
      description_en: row.description_en || '',
      homepage_url: row.homepage_url || '',
      download_url: row.download_url || '',
      screenshot_url: row.screenshot_url || '',
      supported_platforms: supportedPlatforms,
      primary_category_id: row.primary_category_id || 0,
      secondary_category_id: row.secondary_category_id || null,
      primaryCategory: row.primaryCategory ? SupabaseService.transformCategoryRow(row.primaryCategory) : undefined,
      secondaryCategory: row.secondaryCategory ? SupabaseService.transformCategoryRow(row.secondaryCategory) : undefined,
      tags: tags,
      rating: row.rating || 0,
      status: row.status || 0,
      created_at: row.created_at || '',
      updated_at: row.updated_at || '',
      userId: row.user_id || '',
      isPublic: row.status === 1,
      viewCount: row.view_count || 0,
      likeCount: row.like_count || 0,
      downloadLinks: downloadLinks
    }
  }

  private static transformCategoryRow(row: CategoryRow | any): Category {
    if (!row) {
      throw new Error('Invalid category data: row is null or undefined')
    }

    return {
      id: row.id || 0,
      name_zh: row.name_zh || '',
      name_en: row.name_en || '',
      parent_id: row.parent_id || null,
      sort_order: row.sort_order || 0,
      status: row.status || 0,
      created_at: row.created_at || '',
      children: []
    }
  }
}