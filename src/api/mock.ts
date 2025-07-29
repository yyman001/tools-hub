import type { Tool, Category, User, Article, ApiResponse, PaginatedData, SearchParams } from '@/types'

// 模拟数据
const mockCategories: Category[] = [
  { id: '1', name: '开发工具', description: '编程开发相关工具', icon: '💻', toolCount: 25, color: '#3B82F6' },
  { id: '2', name: '设计工具', description: '设计和创意工具', icon: '🎨', toolCount: 18, color: '#EF4444' },
  { id: '3', name: '效率工具', description: '提升工作效率的工具', icon: '⚡', toolCount: 32, color: '#10B981' },
  { id: '4', name: '学习工具', description: '学习和教育相关工具', icon: '📚', toolCount: 15, color: '#F59E0B' },
  { id: '5', name: '娱乐工具', description: '娱乐和休闲工具', icon: '🎮', toolCount: 12, color: '#8B5CF6' },
  { id: '6', name: '系统工具', description: '系统管理和维护工具', icon: '🔧', toolCount: 20, color: '#6B7280' }
]

const mockTools: Tool[] = [
  {
    id: '1',
    name: 'Visual Studio Code',
    description: '微软开发的免费代码编辑器，支持多种编程语言',
    url: 'https://code.visualstudio.com',
    category: '1',
    tags: ['编辑器', '开发', '微软'],
    screenshot: 'https://code.visualstudio.com/assets/images/code-stable.png',
    rating: 4.8,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    userId: 'user1',
    isPublic: true,
    viewCount: 1250,
    likeCount: 89,
    platforms: [
      {
        type: 'windows',
        name: 'Windows',
        description: '支持Windows 10/11',
        icon: '🪟'
      },
      {
        type: 'macos',
        name: 'macOS',
        description: '支持macOS 10.15+',
        icon: '🍎'
      },
      {
        type: 'linux',
        name: 'Linux',
        description: '支持主流Linux发行版',
        icon: '🐧'
      }
    ],
    downloadLinks: [
      {
        name: '官网下载',
        url: 'https://code.visualstudio.com/download',
        type: 'official',
        description: 'Windows/macOS/Linux 官方版本'
      },
      {
        name: 'Microsoft Store',
        url: 'https://www.microsoft.com/store/apps/9NQMXPBM6CPS',
        type: 'official',
        description: 'Windows 应用商店版本',
        platform: 'windows'
      },
      {
        name: 'GitHub Releases',
        url: 'https://github.com/microsoft/vscode/releases',
        type: 'mirror',
        description: 'GitHub 官方发布页面'
      }
    ]
  },
  {
    id: '2',
    name: 'Figma',
    description: '基于浏览器的协作设计工具，支持实时协作',
    url: 'https://figma.com',
    category: '2',
    tags: ['设计', '协作', 'UI/UX'],
    screenshot: 'https://figma.com/images/figma-logo.png',
    rating: 4.7,
    createdAt: '2024-01-14T15:20:00Z',
    updatedAt: '2024-01-14T15:20:00Z',
    userId: 'user2',
    isPublic: true,
    viewCount: 980,
    likeCount: 76,
    platforms: [
      {
        type: 'web',
        name: '网页版',
        description: '基于浏览器，无需下载',
        icon: '🌐'
      },
      {
        type: 'android',
        name: 'Android',
        description: '支持Android 6.0+',
        icon: '🤖'
      },
      {
        type: 'ios',
        name: 'iOS',
        description: '支持iOS 13.0+',
        icon: '📱'
      }
    ],
    downloadLinks: [
      {
        name: '网页版',
        url: 'https://figma.com',
        type: 'official',
        description: '直接使用，无需下载',
        platform: 'web'
      },
      {
        name: 'iOS App',
        url: 'https://apps.apple.com/app/figma/id1500603086',
        type: 'official',
        description: 'iPhone/iPad 应用',
        platform: 'ios'
      },
      {
        name: 'Android App',
        url: 'https://play.google.com/store/apps/details?id=com.figma.figma',
        type: 'official',
        description: 'Android 应用',
        platform: 'android'
      }
    ]
  },
  {
    id: '3',
    name: 'LocalSend',
    description: '开源的跨平台文件传输工具，无需网络连接，安全快速',
    url: 'https://localsend.org',
    category: '3',
    tags: ['文件传输', '开源', '跨平台'],
    screenshot: 'https://localsend.org/images/logo.png',
    rating: 4.9,
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
    userId: 'user1',
    isPublic: true,
    viewCount: 1450,
    likeCount: 102,
    platforms: [
      {
        type: 'cross-platform',
        name: '跨平台',
        description: '支持Windows、macOS、Linux、Android和iOS',
        icon: '🔄'
      }
    ],
    downloadLinks: [
      {
        name: 'GitHub Releases',
        url: 'https://github.com/localsend/localsend/releases',
        type: 'official',
        description: '所有平台官方版本'
      },
      {
        name: 'Windows 下载',
        url: 'https://github.com/localsend/localsend/releases/latest/download/LocalSend_windows_x64.exe',
        type: 'official',
        description: 'Windows 64位版本',
        platform: 'windows'
      },
      {
        name: 'macOS 下载',
        url: 'https://github.com/localsend/localsend/releases/latest/download/LocalSend_macos_x64.dmg',
        type: 'official',
        description: 'macOS 64位版本',
        platform: 'macos'
      },
      {
        name: 'Linux 下载',
        url: 'https://github.com/localsend/localsend/releases/latest/download/LocalSend_linux_x64.AppImage',
        type: 'official',
        description: 'Linux AppImage版本',
        platform: 'linux'
      },
      {
        name: 'Android APK',
        url: 'https://github.com/localsend/localsend/releases/latest/download/LocalSend_android.apk',
        type: 'official',
        description: 'Android APK版本',
        platform: 'android'
      },
      {
        name: 'iOS App Store',
        url: 'https://apps.apple.com/app/localsend/id1661733229',
        type: 'official',
        description: 'iOS App Store版本',
        platform: 'ios'
      }
    ]
  }
]

const mockUser: User = {
  id: 'user1',
  username: 'developer',
  email: 'dev@example.com',
  avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
  createdAt: '2024-01-01T00:00:00Z',
  toolCount: 5,
  favoriteCount: 12
}

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟API类
export class MockAPI {
  // 工具相关API
  static async getTools(params: SearchParams = {}): Promise<ApiResponse<PaginatedData<Tool>>> {
    await delay(300)
    
    let filteredTools = [...mockTools]
    
    // 搜索过滤
    if (params.keyword) {
      filteredTools = filteredTools.filter(tool => 
        tool.name.toLowerCase().includes(params.keyword!.toLowerCase()) ||
        tool.description.toLowerCase().includes(params.keyword!.toLowerCase())
      )
    }
    
    // 分类过滤
    if (params.category) {
      filteredTools = filteredTools.filter(tool => tool.category === params.category)
    }
    
    // 标签过滤
    if (params.tags && params.tags.length > 0) {
      filteredTools = filteredTools.filter(tool => 
        params.tags!.some(tag => tool.tags.includes(tag))
      )
    }
    
    // 排序
    if (params.sortBy) {
      filteredTools.sort((a, b) => {
        const aVal = a[params.sortBy!]
        const bVal = b[params.sortBy!]
        const order = params.sortOrder === 'desc' ? -1 : 1
        return aVal > bVal ? order : -order
      })
    }
    
    // 分页
    const page = params.page || 1
    const pageSize = params.pageSize || 20
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const items = filteredTools.slice(start, end)
    
    return {
      code: 200,
      message: 'success',
      data: {
        items,
        total: filteredTools.length,
        page,
        pageSize,
        totalPages: Math.ceil(filteredTools.length / pageSize)
      }
    }
  }
  
  static async getToolById(id: string): Promise<ApiResponse<Tool>> {
    await delay(200)
    const tool = mockTools.find(t => t.id === id)
    if (!tool) {
      return { code: 404, message: '工具不存在', data: null as any }
    }
    return { code: 200, message: 'success', data: tool }
  }
  
  static async createTool(data: Partial<Tool>): Promise<ApiResponse<Tool>> {
    await delay(500)
    const newTool: Tool = {
      id: Date.now().toString(),
      name: data.name || '',
      description: data.description || '',
      url: data.url || '',
      category: data.category || '1',
      tags: data.tags || [],
      screenshot: data.screenshot,
      rating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'user1',
      isPublic: data.isPublic ?? true,
      viewCount: 0,
      likeCount: 0,
      platforms: data.platforms || [],
      downloadLinks: data.downloadLinks || []
    }
    mockTools.unshift(newTool)
    return { code: 200, message: '创建成功', data: newTool }
  }
  
  // 分类相关API
  static async getCategories(): Promise<ApiResponse<Category[]>> {
    await delay(200)
    return { code: 200, message: 'success', data: mockCategories }
  }
  
  static async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    await delay(200)
    const category = mockCategories.find(c => c.id === id)
    if (!category) {
      return { code: 404, message: '分类不存在', data: null as any }
    }
    return { code: 200, message: 'success', data: category }
  }
  
  // 用户相关API
  static async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay(800)
    if (email === 'demo@example.com' && password === '123456') {
      return {
        code: 200,
        message: '登录成功',
        data: {
          user: mockUser,
          token: 'mock-jwt-token-' + Date.now()
        }
      }
    }
    return { code: 401, message: '邮箱或密码错误', data: null as any }
  }
  
  static async register(username: string, email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay(800)
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      createdAt: new Date().toISOString(),
      toolCount: 0,
      favoriteCount: 0
    }
    return {
      code: 200,
      message: '注册成功',
      data: {
        user: newUser,
        token: 'mock-jwt-token-' + Date.now()
      }
    }
  }
  
  static async getProfile(): Promise<ApiResponse<User>> {
    await delay(300)
    return { code: 200, message: 'success', data: mockUser }
  }
  
  // 搜索API
  static async search(keyword: string, type: 'tools' | 'articles' | 'all' = 'all'): Promise<ApiResponse<any>> {
    await delay(400)
    const results = {
      tools: mockTools.filter(tool => 
        tool.name.toLowerCase().includes(keyword.toLowerCase()) ||
        tool.description.toLowerCase().includes(keyword.toLowerCase())
      ),
      articles: [], // 暂时为空
      total: 0
    }
    results.total = results.tools.length + results.articles.length
    return { code: 200, message: 'success', data: results }
  }
  
  // 统计API
  static async getDashboardStats(): Promise<ApiResponse<any>> {
    await delay(300)
    return {
      code: 200,
      message: 'success',
      data: {
        totalTools: mockTools.length,
        totalUsers: 156,
        totalCategories: mockCategories.length,
        totalArticles: 23,
        popularTools: mockTools.slice(0, 6),
        recentTools: mockTools.slice(0, 8),
        popularCategories: mockCategories.slice(0, 6)
      }
    }
  }
}