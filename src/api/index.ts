import { MockAPI } from './mock'
import type { Tool, Category, User, SearchParams, ToolFormData } from '@/types'

// API服务类 - 使用模拟数据
export class ApiService {
  // 工具相关
  static getTools = MockAPI.getTools
  static getToolById = MockAPI.getToolById
  static createTool = MockAPI.createTool
  
  // 分类相关
  static getCategories = MockAPI.getCategories
  static getCategoryById = MockAPI.getCategoryById
  
  // 用户相关
  static login = MockAPI.login
  static register = MockAPI.register
  static getProfile = MockAPI.getProfile
  
  // 搜索
  static search = MockAPI.search
  
  // 统计
  static getDashboardStats = MockAPI.getDashboardStats
}

export default ApiService