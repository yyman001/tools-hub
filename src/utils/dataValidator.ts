/**
 * 数据验证工具
 */

export class DataValidator {
  static isValidTool(tool: any): boolean {
    return tool && 
           typeof tool.id === 'string' &&
           typeof tool.name_zh === 'string' &&
           typeof tool.name_en === 'string' &&
           Array.isArray(tool.supported_platforms)
  }
  
  static isValidCategory(category: any): boolean {
    return category &&
           typeof category.id === 'number' &&
           typeof category.name_zh === 'string' &&
           typeof category.name_en === 'string'
  }
  
  static sanitizeTool(tool: any): any {
    if (!tool) return null
    
    return {
      ...tool,
      supported_platforms: Array.isArray(tool.supported_platforms) ? tool.supported_platforms : [],
      tags: Array.isArray(tool.tags) ? tool.tags : [],
      downloadLinks: Array.isArray(tool.downloadLinks) ? tool.downloadLinks : [],
      rating: typeof tool.rating === 'number' ? tool.rating : 0,
      viewCount: typeof tool.viewCount === 'number' ? tool.viewCount : 0,
      likeCount: typeof tool.likeCount === 'number' ? tool.likeCount : 0
    }
  }
  
  static sanitizeCategory(category: any): any {
    if (!category) return null
    
    return {
      ...category,
      children: Array.isArray(category.children) ? category.children : []
    }
  }
}

export default DataValidator
