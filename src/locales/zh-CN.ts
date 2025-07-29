export default {
  // 通用
  common: {
    loading: '加载中...',
    search: '搜索',
    back: '返回',
    save: '保存',
    cancel: '取消',
    submit: '提交',
    edit: '编辑',
    delete: '删除',
    add: '添加',
    view: '查看',
    share: '分享',
    like: '点赞',
    favorite: '收藏',
    more: '更多',
    all: '全部',
    none: '暂无',
    confirm: '确认',
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '信息',
    switchToLight: '切换到亮模式',
    switchToDark: '切换到暗模式'
  },

  // 导航
  nav: {
    home: '首页',
    tools: '工具',
    categories: '分类',
    login: '登录',
    register: '注册',
    profile: '个人中心',
    addTool: '添加工具',
    logout: '退出登录',
    darkModeDemo: '暗模式演示'
  },

  // 首页
  home: {
    title: '发现优质工具',
    subtitle: '收集、分享、发现最好用的工具和资源',
    searchPlaceholder: '搜索工具...',
    popularCategories: '热门分类',
    latestTools: '最新工具',
    viewAll: '查看全部 →',
    toolsCount: '个工具'
  },

  // 工具相关
  tools: {
    title: '工具列表',
    addTool: '添加工具',
    toolDetail: '工具详情',
    basicInfo: '基本信息',
    rating: '评分',
    views: '浏览量',
    likes: '点赞数',
    createdAt: '创建时间',
    relatedTools: '相关工具',
    quickActions: '快速操作',
    reportIssue: '报告问题',
    suggestImprovement: '建议改进',
    contactAuthor: '联系作者',
    visitTool: '访问工具',
    userReviews: '用户评价',
    features: '功能特点',
    useCases: '使用场景',
    // 新增翻译
    platforms: '支持平台',
    downloadLinks: '下载地址'
  },

  // 分类相关
  categories: {
    title: '工具分类',
    categoryDetail: '分类详情',
    noCategories: '暂无分类',
    toolsCount: '工具数量',
    currentShowing: '当前显示',
    addFirstTool: '成为第一个为这个分类添加工具的人吧！',
    gridView: '网格视图',
    listView: '列表视图',
    discover: '发现',
    qualityTools: '个优质工具'
  },

  // 用户认证
  auth: {
    login: '登录账户',
    register: '注册账户',
    email: '邮箱地址',
    username: '用户名',
    password: '密码',
    confirmPassword: '确认密码',
    loginButton: '登录',
    registerButton: '注册',
    loginPrompt: '还没有账户？',
    registerPrompt: '已有账户？',
    loginNow: '立即登录',
    registerNow: '立即注册',
    loggingIn: '登录中...',
    registering: '注册中...',
    testAccount: '测试账户：demo@example.com / 123456',
    errors: {
      required: '请填写完整信息',
      passwordMismatch: '两次输入的密码不一致',
      passwordTooShort: '密码长度至少6位',
      loginFailed: '邮箱或密码错误',
      registerFailed: '注册失败'
    }
  },

  // 个人中心
  profile: {
    title: '个人中心',
    myTools: '我的工具',
    myFavorites: '我的收藏',
    myArticles: '我的文章',
    toolsCount: '工具数量',
    favoritesCount: '收藏数量',
    joinDate: '注册时间',
    writeArticle: '写文章',
    noArticles: '暂无文章',
    removeFavorite: '取消收藏'
  },

  // 添加工具
  addTool: {
    title: '添加工具',
    subtitle: '分享你发现的好工具',
    toolName: '工具名称',
    toolNamePlaceholder: '输入工具名称',
    toolDescription: '工具描述',
    toolDescriptionPlaceholder: '详细描述工具的功能和特点',
    toolUrl: '工具链接',
    toolUrlPlaceholder: 'https://example.com',
    category: '分类',
    selectCategory: '选择分类',
    tags: '标签',
    tagsPlaceholder: '输入标签后按回车添加',
    screenshot: '截图链接',
    screenshotPlaceholder: '工具截图的可选链接',
    isPublic: '公开此工具',
    submitting: '提交中...',
    errors: {
      requiredFields: '请填写所有必填字段',
      submitFailed: '提交失败，请重试'
    },
    // 新增翻译
    platforms: '支持平台',
    downloadLinks: '下载地址',
    downloadName: '下载源名称',
    downloadNamePlaceholder: '如：官网下载、百度网盘',
    downloadType: '下载类型',
    downloadTypeOfficial: '官方',
    downloadTypeCloud: '网盘',
    downloadTypeMirror: '镜像',
    downloadTypeOther: '其他',
    downloadUrl: '下载链接',
    downloadUrlPlaceholder: 'https://example.com/download',
    downloadDescription: '描述信息',
    downloadDescriptionPlaceholder: '如：提取码：1234',
    addDownloadLink: '添加下载地址'
  },

  // 搜索
  search: {
    title: '搜索结果',
    searchFor: '关键词',
    resultsFound: '的搜索结果，共找到',
    results: '个结果',
    noResults: '没有找到相关结果',
    searching: '搜索中...',
    toolResults: '工具',
    articleResults: '文章'
  },

  // 页脚
  footer: {
    aboutUs: '关于我们',
    description: 'Tool Hub 是一个现代化的工具集合平台，致力于为用户提供高质量、实用的在线工具。',
    quickLinks: '快速链接',
    toolsList: '所有工具',
    categoriesBrowse: '工具分类',
    apiDocs: 'API 文档',
    support: '支持',
    contact: '联系我们',
    feedback: '反馈建议',
    faq: '常见问题',
    guide: '使用指南',
    help: '帮助中心',
    legal: '法律',
    privacy: '隐私政策',
    terms: '服务条款',
    cookie: 'Cookie 政策',
    disclaimer: '免责声明',
    copyright: '保留所有权利'
  },

  // 使用场景
  useCases: {
    personal: '个人用户',
    personalDesc: '适合个人日常工作和学习使用',
    team: '团队协作',
    teamDesc: '支持多人协作和项目管理',
    enterprise: '企业应用',
    enterpriseDesc: '满足企业级需求和安全要求',
    developer: '开发者',
    developerDesc: '提供API和扩展能力'
  },

  // 功能特点
  features: {
    intuitive: '简洁直观的用户界面设计',
    powerful: '强大的功能集和丰富的选项',
    crossPlatform: '跨平台支持，兼容性良好',
    community: '活跃的社区支持和定期更新'
  }
}