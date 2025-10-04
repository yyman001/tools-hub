export default {
  // Common
  common: {
    loading: 'Loading...',
    search: 'Search',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    edit: 'Edit',
    delete: 'Delete',
    remove: 'Remove',
    add: 'Add',
    view: 'View',
    share: 'Share',
    like: 'Like',
    favorite: 'Favorite',
    more: 'More',
    all: 'All',
    none: 'None',
    confirm: 'Confirm',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    switchToLight: 'Switch to Light Mode',
    switchToDark: 'Switch to Dark Mode'
  },

  // Navigation
  nav: {
    home: 'Home',
    tools: 'Tools',
    categories: 'Categories',
    login: 'Login',
    register: 'Register',
    profile: 'Profile',
    addTool: 'Add Tool',
    logout: 'Logout',
    darkModeDemo: 'Dark Mode Demo'
  },

  // Home
  home: {
    title: 'Discover Quality Tools',
    subtitle: 'Collect, share, and discover the best tools and resources',
    searchPlaceholder: 'Search tools...',
    popularCategories: 'Popular Categories',
    latestTools: 'Latest Tools',
    viewAll: 'View All →',
    toolsCount: 'tools'
  },

  // Tools
  tools: {
    title: 'Tools',
    addTool: 'Add Tool',
    toolDetail: 'Tool Details',
    basicInfo: 'Basic Info',
    rating: 'Rating',
    views: 'Views',
    likes: 'Likes',
    createdAt: 'Created',
    relatedTools: 'Related Tools',
    quickActions: 'Quick Actions',
    reportIssue: 'Report Issue',
    suggestImprovement: 'Suggest Improvement',
    contactAuthor: 'Contact Author',
    visitTool: 'Visit Tool',
    userReviews: 'User Reviews',
    features: 'Features',
    useCases: 'Use Cases',
    // 新增翻译
    platforms: 'Platforms',
    downloadLinks: 'Download Links'
  },

  // Categories
  categories: {
    title: 'Tool Categories',
    categoryDetail: 'Category Details',
    noCategories: 'No categories available',
    toolsCount: 'Tools Count',
    currentShowing: 'Currently Showing',
    addFirstTool: 'Be the first to add a tool to this category!',
    gridView: 'Grid View',
    listView: 'List View',
    discover: 'Discover',
    qualityTools: 'quality tools'
  },

  // Authentication
  auth: {
    login: 'Login to Account',
    register: 'Create Account',
    email: 'Email Address',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    loginButton: 'Login',
    registerButton: 'Register',
    loginPrompt: "Don't have an account?",
    registerPrompt: 'Already have an account?',
    loginNow: 'Login Now',
    registerNow: 'Register Now',
    loggingIn: 'Logging in...',
    registering: 'Registering...',
    testAccount: 'Test Account: demo@example.com Password: 123456',
    forgotPasswordLink: 'Forgot Password?',
    errors: {
      required: 'Please fill in all required fields',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
      loginFailed: 'Invalid email or password',
      registerFailed: 'Registration failed'
    },
    emailVerification: {
      title: 'Verify Your Email',
      description: 'We have sent a verification email to your email address. Please click the link in the email to complete your account verification.',
      emailSentTo: 'Verification email sent to:',
      resendEmail: 'Resend Verification Email',
      resending: 'Sending...',
      resendIn: 'Resend in {seconds}s',
      checkVerification: 'I have verified, login now',
      checking: 'Checking...',
      backToLogin: 'Back to Login',
      helpTitle: 'Didn\'t receive the email?',
      helpTip1: 'Check your spam/junk folder',
      helpTip2: 'Make sure the email address is correct',
      helpTip3: 'Wait a few minutes before trying to resend',
      helpTip4: 'If still not received, try re-registering or contact support',
      troubleshootTitle: 'Still having issues?',
      tryDifferentEmail: 'Try different email',
      contactSupport: 'Contact Support',
      emailResent: 'Verification email has been resent',
      verificationSuccess: 'Email verified successfully! Redirecting...',
      errors: {
        emailRequired: 'Email address is required',
        resendFailed: 'Failed to resend email, please try again later',
        checkFailed: 'Failed to check verification status',
        notVerified: 'Email not verified yet, please click the verification link in your email first'
      }
    },
    forgotPassword: {
      title: 'Forgot Password',
      description: 'Enter your email address and we will send you a password reset link.',
      emailPlaceholder: 'Enter your email address',
      sendResetEmail: 'Send Reset Email',
      sending: 'Sending...',
      backToLogin: 'Back to Login',
      emailSentTitle: 'Reset Email Sent',
      emailSentDescription: 'We have sent a password reset link to your email. Please click the link in the email to reset your password.',
      emailSentTo: 'Reset email sent to:',
      resendResetEmail: 'Resend Reset Email',
      resending: 'Sending...',
      resendIn: 'Resend in {seconds}s',
      helpTitle: 'Didn\'t receive the email?',
      helpTip1: 'Check your spam/junk folder',
      helpTip2: 'Make sure the email address is correct',
      helpTip3: 'Wait a few minutes before trying to resend'
    },
    resetPassword: {
      title: 'Reset Password',
      description: 'Please enter your new password.',
      newPassword: 'New Password',
      newPasswordPlaceholder: 'Enter your new password',
      updatePassword: 'Update Password',
      updating: 'Updating...',
      backToLogin: 'Back to Login',
      success: 'Password updated successfully! Redirecting...',
      passwordRequirements: 'Password Requirements:',
      requirement1: 'At least 6 characters',
      requirement2: 'Contains letters',
      requirement3: 'Contains numbers'
    }
  },

  // Profile
  profile: {
    title: 'Profile',
    myTools: 'My Tools',
    myFavorites: 'My Favorites',
    myArticles: 'My Articles',
    toolsCount: 'Tools Count',
    favoritesCount: 'Favorites Count',
    joinDate: 'Join Date',
    writeArticle: 'Write Article',
    noArticles: 'No articles yet',
    removeFavorite: 'Remove Favorite'
  },

  // Add Tool
  addTool: {
    title: 'Add Tool',
    subtitle: 'Share a useful tool with everyone',
    toolNameZh: 'Tool Name (Chinese)',
    toolNameZhPlaceholder: 'Enter tool name in Chinese',
    toolNameEn: 'Tool Name (English)',
    toolNameEnPlaceholder: 'Enter tool name in English',
    toolDescriptionZh: 'Tool Description (Chinese)',
    toolDescriptionZhPlaceholder: 'Describe the tool\'s features and functionality in Chinese',
    toolDescriptionEn: 'Tool Description (English)',
    toolDescriptionEnPlaceholder: 'Describe the tool\'s features and functionality in English',
    homepageUrl: 'Homepage URL',
    homepageUrlPlaceholder: 'https://example.com',
    primaryCategory: 'Primary Category',
    selectPrimaryCategory: 'Select primary category',
    secondaryCategory: 'Secondary Category',
    selectSecondaryCategory: 'Select secondary category (optional)',
    tags: 'Tags',
    tagsPlaceholder: 'Enter tags and press Enter to add',
    screenshot: 'Screenshot URL',
    screenshotPlaceholder: 'Optional screenshot link',
    isPublic: 'Make this tool public',
    submitting: 'Submitting...',
    errors: {
      requiredFields: 'Please fill in all required fields',
      submitFailed: 'Submission failed, please try again'
    },
    platforms: 'Supported Platforms',
    downloadLinks: 'Download Links',
    downloadName: 'Download Source Name',
    downloadNamePlaceholder: 'e.g., Official Download, Baidu Cloud',
    downloadType: 'Download Type',
    downloadTypeOfficial: 'Official',
    downloadTypeCloud: 'Cloud Storage',
    downloadTypeMirror: 'Mirror',
    downloadTypeOther: 'Other',
    downloadUrl: 'Download URL',
    downloadUrlPlaceholder: 'https://example.com/download',
    downloadDescription: 'Description',
    downloadDescriptionPlaceholder: 'e.g., Extraction code: 1234',
    addDownloadLink: 'Add Download Link',
    remove: 'Remove'
  },

  // Search
  search: {
    title: 'Search Results',
    searchFor: 'Search results for',
    resultsFound: ', found',
    results: 'results',
    noResults: 'No results found',
    searching: 'Searching...',
    toolResults: 'Tools',
    articleResults: 'Articles'
  },

  // Footer
  footer: {
    aboutUs: 'About Us',
    description: 'Tool Hub is a modern tool collection platform dedicated to providing users with high-quality, practical online tools.',
    quickLinks: 'Quick Links',
    toolsList: 'All Tools',
    categoriesBrowse: 'Tool Categories',
    apiDocs: 'API Documentation',
    support: 'Support',
    contact: 'Contact Us',
    feedback: 'Feedback',
    faq: 'FAQ',
    guide: 'User Guide',
    help: 'Help Center',
    legal: 'Legal',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    cookie: 'Cookie Policy',
    disclaimer: 'Disclaimer',
    copyright: 'All rights reserved'
  },

  // Use Cases
  useCases: {
    personal: 'Personal Users',
    personalDesc: 'Perfect for daily work and study',
    team: 'Team Collaboration',
    teamDesc: 'Support multi-user collaboration and project management',
    enterprise: 'Enterprise',
    enterpriseDesc: 'Meet enterprise-level requirements and security standards',
    developer: 'Developers',
    developerDesc: 'Provide API and extensibility'
  },

  // Features
  features: {
    intuitive: 'Clean and intuitive user interface design',
    powerful: 'Powerful feature set with rich options',
    crossPlatform: 'Cross-platform support with excellent compatibility',
    community: 'Active community support and regular updates'
  }
}