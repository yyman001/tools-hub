export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tools: {
        Row: {
          id: number
          name_zh: string
          name_en: string
          description_zh: string
          description_en: string
          homepage_url: string | null
          download_url: string | null
          screenshot_url: string | null
          supported_platforms: string | null
          primary_category_id: number
          secondary_category_id: number | null
          user_id: string | null
          view_count: number
          like_count: number
          status: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name_zh: string
          name_en: string
          description_zh: string
          description_en: string
          homepage_url?: string | null
          download_url?: string | null
          screenshot_url?: string | null
          supported_platforms?: string | null
          primary_category_id: number
          secondary_category_id?: number | null
          user_id?: string | null
          view_count?: number
          like_count?: number
          status?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name_zh?: string
          name_en?: string
          description_zh?: string
          description_en?: string
          homepage_url?: string | null
          download_url?: string | null
          screenshot_url?: string | null
          supported_platforms?: string | null
          primary_category_id?: number
          secondary_category_id?: number | null
          user_id?: string | null
          view_count?: number
          like_count?: number
          status?: number
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
      }
      tool_tags: {
        Row: {
          id: number
          tool_id: number
          tag_id: number
          created_at: string
        }
        Insert: {
          id?: number
          tool_id: number
          tag_id: number
          created_at?: string
        }
        Update: {
          id?: number
          tool_id?: number
          tag_id?: number
          created_at?: string
        }
      }
      download_links: {
        Row: {
          id: number
          tool_id: number
          name: string
          url: string
          type: string
          description: string | null
          platform: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: number
          tool_id: number
          name: string
          url: string
          type?: string
          description?: string | null
          platform?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: number
          tool_id?: number
          name?: string
          url?: string
          type?: string
          description?: string | null
          platform?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name_zh: string
          name_en: string
          parent_id: number | null
          sort_order: number
          status: number
          created_at: string
        }
        Insert: {
          id?: number
          name_zh: string
          name_en: string
          parent_id?: number | null
          sort_order?: number
          status?: number
          created_at?: string
        }
        Update: {
          id?: number
          name_zh?: string
          name_en?: string
          parent_id?: number | null
          sort_order?: number
          status?: number
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          username: string
          email: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          email: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}