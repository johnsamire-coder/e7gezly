
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "account_roles": {
                  Row: {
                    "account_id": string,"granted_at": string,"granted_by": string | null,"role": Database["public"]['Enums']["account_role"]
                  }
                  ComputedFields: never
                  Insert: {
                    "account_id": string,"granted_at"?: string,"granted_by"?: string | null,"role": Database["public"]['Enums']["account_role"]
                  }
                  Update: {
                    "account_id"?: string,"granted_at"?: string,"granted_by"?: string | null,"role"?: Database["public"]['Enums']["account_role"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "account_roles_account_id_fkey"
      columns: ["account_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "account_roles_granted_by_fkey"
      columns: ["granted_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"areas": {
                  Row: {
                    "active": boolean,"governorate_id": number,"id": number,"name_ar": string,"name_en": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "active"?: boolean,"governorate_id": number,"id"?: never,"name_ar": string,"name_en"?: string | null
                  }
                  Update: {
                    "active"?: boolean,"governorate_id"?: number,"id"?: never,"name_ar"?: string,"name_en"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "areas_governorate_id_fkey"
      columns: ["governorate_id"]
isOneToOne: false
      referencedRelation: "governorates"
      referencedColumns: ["id"]
    }
                  ]
                },"category_attribute_defs": {
                  Row: {
                    "category_id": number,"id": number,"key": string,"label_ar": string,"options": Json | null,"required": boolean,"sort_order": number,"value_type": string
                  }
                  ComputedFields: never
                  Insert: {
                    "category_id": number,"id"?: never,"key": string,"label_ar": string,"options"?: Json | null,"required"?: boolean,"sort_order"?: number,"value_type"?: string
                  }
                  Update: {
                    "category_id"?: number,"id"?: never,"key"?: string,"label_ar"?: string,"options"?: Json | null,"required"?: boolean,"sort_order"?: number,"value_type"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "category_attribute_defs_category_id_fkey"
      columns: ["category_id"]
isOneToOne: false
      referencedRelation: "service_categories"
      referencedColumns: ["id"]
    }
                  ]
                },"governorates": {
                  Row: {
                    "active": boolean,"code": string | null,"id": number,"name_ar": string,"name_en": string | null,"sort_order": number
                  }
                  ComputedFields: never
                  Insert: {
                    "active"?: boolean,"code"?: string | null,"id"?: never,"name_ar": string,"name_en"?: string | null,"sort_order"?: number
                  }
                  Update: {
                    "active"?: boolean,"code"?: string | null,"id"?: never,"name_ar"?: string,"name_en"?: string | null,"sort_order"?: number
                  }
                  Relationships: [
                    
                  ]
                },"profiles": {
                  Row: {
                    "avatar_url": string | null,"created_at": string,"full_name": string | null,"id": string,"locale": string,"phone": string | null,"phone_verified": boolean,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "avatar_url"?: string | null,"created_at"?: string,"full_name"?: string | null,"id": string,"locale"?: string,"phone"?: string | null,"phone_verified"?: boolean,"updated_at"?: string
                  }
                  Update: {
                    "avatar_url"?: string | null,"created_at"?: string,"full_name"?: string | null,"id"?: string,"locale"?: string,"phone"?: string | null,"phone_verified"?: boolean,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"service_categories": {
                  Row: {
                    "active": boolean,"created_at": string,"depth": number,"description_ar": string | null,"icon": string | null,"id": number,"name_ar": string,"name_en": string | null,"parent_id": number | null,"slug": string,"sort_order": number
                  }
                  ComputedFields: never
                  Insert: {
                    "active"?: boolean,"created_at"?: string,"depth"?: number,"description_ar"?: string | null,"icon"?: string | null,"id"?: never,"name_ar": string,"name_en"?: string | null,"parent_id"?: number | null,"slug": string,"sort_order"?: number
                  }
                  Update: {
                    "active"?: boolean,"created_at"?: string,"depth"?: number,"description_ar"?: string | null,"icon"?: string | null,"id"?: never,"name_ar"?: string,"name_en"?: string | null,"parent_id"?: number | null,"slug"?: string,"sort_order"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "service_categories_parent_id_fkey"
      columns: ["parent_id"]
isOneToOne: false
      referencedRelation: "service_categories"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "has_role":
{ Args: { "wanted": Database["public"]['Enums']["account_role"] }; Returns: boolean
                           },
"is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"unaccent":
{ Args: { "": string }; Returns: string
                           }
          }
          Enums: {
            "account_role": "customer"|"provider"|"admin"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "account_role": ["customer", "provider", "admin"]
          }
        }
} as const
