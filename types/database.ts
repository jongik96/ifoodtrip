export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Country = 'korea' | 'japan' | 'spain' | 'italy' | 'india' | 'turkey'
export type Locale = 'ko' | 'ja' | 'en' | 'fr'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string | null
          locale: Locale
          created_at: string
          prefs: Json | null
        }
        Insert: {
          id?: string
          email: string
          display_name?: string | null
          locale?: Locale
          created_at?: string
          prefs?: Json | null
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          locale?: Locale
          created_at?: string
          prefs?: Json | null
        }
      }
      pantry_items: {
        Row: {
          id: string
          user_id: string
          name: string
          category: string
          quantity: number | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category: string
          quantity?: number | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: string
          quantity?: number | null
          unit?: string | null
          updated_at?: string
        }
      }
      ingredient_master: {
        Row: {
          id: string
          name: string
          aliases: string[]
          category: string
          synonyms_json: Json | null
        }
        Insert: {
          id?: string
          name: string
          aliases: string[]
          category: string
          synonyms_json?: Json | null
        }
        Update: {
          id?: string
          name?: string
          aliases?: string[]
          category?: string
          synonyms_json?: Json | null
        }
      }
      recipes: {
        Row: {
          id: string
          user_id: string | null
          title: string
          country: Country | null
          servings: number
          ingredients_json: Json
          steps_md: string
          nutrition_json: Json | null
          time_minutes: number
          difficulty: 'easy' | 'medium' | 'hard'
          created_at: string
          public_bool: boolean
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          country?: Country | null
          servings: number
          ingredients_json: Json
          steps_md: string
          nutrition_json?: Json | null
          time_minutes: number
          difficulty: 'easy' | 'medium' | 'hard'
          created_at?: string
          public_bool?: boolean
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          country?: Country | null
          servings?: number
          ingredients_json?: Json
          steps_md?: string
          nutrition_json?: Json | null
          time_minutes?: number
          difficulty?: 'easy' | 'medium' | 'hard'
          created_at?: string
          public_bool?: boolean
        }
      }
      saved_recipes: {
        Row: {
          id: string
          user_id: string
          recipe_id: string
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recipe_id: string
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          recipe_id?: string
          note?: string | null
          created_at?: string
        }
      }
      blog_ja: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          created_at: string
          published_at: string | null
          tags: string[]
          status: 'draft' | 'posted'
          previous_post: string | null
          next_post: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          content: string
          created_at?: string
          published_at?: string | null
          tags?: string[]
          status?: 'draft' | 'posted'
          previous_post?: string | null
          next_post?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content?: string
          created_at?: string
          published_at?: string | null
          tags?: string[]
          status?: 'draft' | 'posted'
          previous_post?: string | null
          next_post?: string | null
        }
      }
      blog_en: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          created_at: string
          published_at: string | null
          tags: string[]
          status: 'draft' | 'posted'
          previous_post: string | null
          next_post: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          content: string
          created_at?: string
          published_at?: string | null
          tags?: string[]
          status?: 'draft' | 'posted'
          previous_post?: string | null
          next_post?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content?: string
          created_at?: string
          published_at?: string | null
          tags?: string[]
          status?: 'draft' | 'posted'
          previous_post?: string | null
          next_post?: string | null
        }
      }
      blog_ko: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          created_at: string
          published_at: string | null
          tags: string[]
          status: 'draft' | 'posted'
          previous_post: string | null
          next_post: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          content: string
          created_at?: string
          published_at?: string | null
          tags?: string[]
          status?: 'draft' | 'posted'
          previous_post?: string | null
          next_post?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content?: string
          created_at?: string
          published_at?: string | null
          tags?: string[]
          status?: 'draft' | 'posted'
          previous_post?: string | null
          next_post?: string | null
        }
      }
      blog_fr: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          created_at: string
          published_at: string | null
          tags: string[]
          status: 'draft' | 'posted'
          previous_post: string | null
          next_post: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          content: string
          created_at?: string
          published_at?: string | null
          tags?: string[]
          status?: 'draft' | 'posted'
          previous_post?: string | null
          next_post?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content?: string
          created_at?: string
          published_at?: string | null
          tags?: string[]
          status?: 'draft' | 'posted'
          previous_post?: string | null
          next_post?: string | null
        }
      }
      ai_requests_log: {
        Row: {
          id: string
          user_id: string | null
          prompt_hash: string
          model: string
          tokens_in: number
          tokens_out: number
          response_excerpt: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          prompt_hash: string
          model: string
          tokens_in: number
          tokens_out: number
          response_excerpt?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          prompt_hash?: string
          model?: string
          tokens_in?: number
          tokens_out?: number
          response_excerpt?: string | null
          status?: string
          created_at?: string
        }
      }
      translations_cache: {
        Row: {
          id: string
          source_text_hash: string
          locale: Locale
          translated_text: string
        }
        Insert: {
          id?: string
          source_text_hash: string
          locale: Locale
          translated_text: string
        }
        Update: {
          id?: string
          source_text_hash?: string
          locale?: Locale
          translated_text?: string
        }
      }
      daily_recommendations: {
        Row: {
          id: string
          cuisine_type: string
          dish_name: string
          created_at: string
        }
        Insert: {
          id?: string
          cuisine_type: string
          dish_name: string
          created_at?: string
        }
        Update: {
          id?: string
          cuisine_type?: string
          dish_name?: string
          created_at?: string
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
  }
}


