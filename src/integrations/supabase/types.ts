export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      farm_supply: {
        Row: {
          available_from: string
          available_to: string
          created_at: string
          farmer_name: string
          id: string
          kg: number
          name_en: string
          name_zh: string
          status: string
          veg_key: string
        }
        Insert: {
          available_from?: string
          available_to?: string
          created_at?: string
          farmer_name?: string
          id?: string
          kg: number
          name_en: string
          name_zh: string
          status?: string
          veg_key: string
        }
        Update: {
          available_from?: string
          available_to?: string
          created_at?: string
          farmer_name?: string
          id?: string
          kg?: number
          name_en?: string
          name_zh?: string
          status?: string
          veg_key?: string
        }
        Relationships: []
      }
      join_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          note: string | null
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          note?: string | null
          role: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          note?: string | null
          role?: string
        }
        Relationships: []
      }
      plan_items: {
        Row: {
          id: string
          kg_used: number
          plan_id: string
          portions: number
          recipe_id: string
        }
        Insert: {
          id?: string
          kg_used?: number
          plan_id: string
          portions: number
          recipe_id: string
        }
        Update: {
          id?: string
          kg_used?: number
          plan_id?: string
          portions?: number
          recipe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_items_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "production_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_items_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      preorders: {
        Row: {
          campus: string
          created_at: string
          id: string
          order_date: string
          portions: number
        }
        Insert: {
          campus?: string
          created_at?: string
          id?: string
          order_date?: string
          portions: number
        }
        Update: {
          campus?: string
          created_at?: string
          id?: string
          order_date?: string
          portions?: number
        }
        Relationships: []
      }
      production_plans: {
        Row: {
          created_at: string
          id: string
          kg_available: number
          kg_used: number
          plan_date: string
          total_meals: number
          utilization: number
        }
        Insert: {
          created_at?: string
          id?: string
          kg_available?: number
          kg_used?: number
          plan_date?: string
          total_meals?: number
          utilization?: number
        }
        Update: {
          created_at?: string
          id?: string
          kg_available?: number
          kg_used?: number
          plan_date?: string
          total_meals?: number
          utilization?: number
        }
        Relationships: []
      }
      recipe_ingredients: {
        Row: {
          id: string
          is_core: boolean
          kg_per_100: number
          name_en: string
          name_zh: string
          recipe_id: string
          veg_key: string
        }
        Insert: {
          id?: string
          is_core?: boolean
          kg_per_100: number
          name_en: string
          name_zh: string
          recipe_id: string
          veg_key: string
        }
        Update: {
          id?: string
          is_core?: boolean
          kg_per_100?: number
          name_en?: string
          name_zh?: string
          recipe_id?: string
          veg_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          allergens: string[]
          carbs_g: number
          code: string
          cook_min: number
          cost_ntd: number
          created_at: string
          fat_g: number
          fiber_g: number
          id: string
          kcal: number
          max_batch: number
          name_en: string
          name_zh: string
          note_en: string | null
          note_zh: string | null
          prep_min: number
          protein_g: number
          vegetarian: boolean
        }
        Insert: {
          allergens?: string[]
          carbs_g?: number
          code: string
          cook_min?: number
          cost_ntd?: number
          created_at?: string
          fat_g?: number
          fiber_g?: number
          id?: string
          kcal?: number
          max_batch?: number
          name_en: string
          name_zh: string
          note_en?: string | null
          note_zh?: string | null
          prep_min?: number
          protein_g?: number
          vegetarian?: boolean
        }
        Update: {
          allergens?: string[]
          carbs_g?: number
          code?: string
          cook_min?: number
          cost_ntd?: number
          created_at?: string
          fat_g?: number
          fiber_g?: number
          id?: string
          kcal?: number
          max_batch?: number
          name_en?: string
          name_zh?: string
          note_en?: string | null
          note_zh?: string | null
          prep_min?: number
          protein_g?: number
          vegetarian?: boolean
        }
        Relationships: []
      }
      seasonal_surplus: {
        Row: {
          id: string
          month: number
          name_en: string
          name_zh: string
          note_en: string | null
          note_zh: string | null
          severity: string
          typical_surplus_kg: number
          veg_key: string
        }
        Insert: {
          id?: string
          month: number
          name_en: string
          name_zh: string
          note_en?: string | null
          note_zh?: string | null
          severity?: string
          typical_surplus_kg: number
          veg_key: string
        }
        Update: {
          id?: string
          month?: number
          name_en?: string
          name_zh?: string
          note_en?: string | null
          note_zh?: string | null
          severity?: string
          typical_surplus_kg?: number
          veg_key?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
