export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      condition_descriptions: {
        Row: {
          condition_level: string
          created_at: string | null
          description: string
          id: string
          improvement_tips: string | null
          value_impact: number
        }
        Insert: {
          condition_level: string
          created_at?: string | null
          description: string
          id?: string
          improvement_tips?: string | null
          value_impact: number
        }
        Update: {
          condition_level?: string
          created_at?: string | null
          description?: string
          id?: string
          improvement_tips?: string | null
          value_impact?: number
        }
        Relationships: []
      }
      dealer_leads: {
        Row: {
          created_at: string | null
          id: string
          status: string
          updated_at: string | null
          user_id: string
          valuation_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id: string
          valuation_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
          valuation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dealer_leads_valuation_id_fkey"
            columns: ["valuation_id"]
            isOneToOne: false
            referencedRelation: "valuations"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_offers: {
        Row: {
          created_at: string | null
          dealer_id: string | null
          id: string
          message: string | null
          offer_amount: number
          report_id: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          message?: string | null
          offer_amount: number
          report_id: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          message?: string | null
          offer_amount?: number
          report_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dealer_offers_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dealer_offers_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "valuations"
            referencedColumns: ["id"]
          },
        ]
      }
      dealers: {
        Row: {
          business_name: string
          contact_name: string
          created_at: string | null
          email: string
          id: string
          phone: string | null
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          business_name: string
          contact_name: string
          created_at?: string | null
          email: string
          id: string
          phone?: string | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          business_name?: string
          contact_name?: string
          created_at?: string | null
          email?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      decoded_vehicles: {
        Row: {
          bodyType: string | null
          created_at: string
          drivetrain: string | null
          engine: string | null
          id: string
          make: string | null
          model: string | null
          timestamp: string | null
          transmission: string | null
          trim: string | null
          vin: string
          year: number | null
        }
        Insert: {
          bodyType?: string | null
          created_at?: string
          drivetrain?: string | null
          engine?: string | null
          id?: string
          make?: string | null
          model?: string | null
          timestamp?: string | null
          transmission?: string | null
          trim?: string | null
          vin: string
          year?: number | null
        }
        Update: {
          bodyType?: string | null
          created_at?: string
          drivetrain?: string | null
          engine?: string | null
          id?: string
          make?: string | null
          model?: string | null
          timestamp?: string | null
          transmission?: string | null
          trim?: string | null
          vin?: string
          year?: number | null
        }
        Relationships: []
      }
      features: {
        Row: {
          category: string
          created_at: string | null
          id: string
          name: string
          value_impact: number
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          name: string
          value_impact: number
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          name?: string
          value_impact?: number
        }
        Relationships: []
      }
      makes: {
        Row: {
          country_of_origin: string | null
          created_at: string
          id: string
          logo_url: string | null
          nhtsa_make_id: number | null
          updated_at: string | null
        }
        Insert: {
          country_of_origin?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          nhtsa_make_id?: number | null
          updated_at?: string | null
        }
        Update: {
          country_of_origin?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          nhtsa_make_id?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      market_listings: {
        Row: {
          created_at: string | null
          id: string
          listing_date: string | null
          price: number
          source: string
          url: string | null
          valuation_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_date?: string | null
          price: number
          source: string
          url?: string | null
          valuation_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_date?: string | null
          price?: number
          source?: string
          url?: string | null
          valuation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_listings_valuation_id_fkey"
            columns: ["valuation_id"]
            isOneToOne: false
            referencedRelation: "valuations"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          created_at: string
          id: string
          make_id: string
          model_name: string
          nhtsa_model_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          make_id: string
          model_name: string
          nhtsa_model_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          make_id?: string
          model_name?: string
          nhtsa_model_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_models_make"
            columns: ["make_id"]
            isOneToOne: false
            referencedRelation: "makes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "models_make_id_fkey"
            columns: ["make_id"]
            isOneToOne: false
            referencedRelation: "makes"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          id: string
          status: string
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
          valuation_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          id?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
          valuation_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
          valuation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_valuation_id_fkey"
            columns: ["valuation_id"]
            isOneToOne: false
            referencedRelation: "valuations"
            referencedColumns: ["id"]
          },
        ]
      }
      plate_lookups: {
        Row: {
          color: string | null
          created_at: string
          id: string
          make: string | null
          model: string | null
          plate: string
          state: string
          year: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          make?: string | null
          model?: string | null
          plate: string
          state: string
          year?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          make?: string | null
          model?: string | null
          plate?: string
          state?: string
          year?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      saved_valuations: {
        Row: {
          condition_score: number | null
          confidence_score: number | null
          created_at: string
          id: string
          make: string | null
          model: string | null
          user_id: string
          valuation: number | null
          vin: string | null
          year: number | null
        }
        Insert: {
          condition_score?: number | null
          confidence_score?: number | null
          created_at?: string
          id?: string
          make?: string | null
          model?: string | null
          user_id: string
          valuation?: number | null
          vin?: string | null
          year?: number | null
        }
        Update: {
          condition_score?: number | null
          confidence_score?: number | null
          created_at?: string
          id?: string
          make?: string | null
          model?: string | null
          user_id?: string
          valuation?: number | null
          vin?: string | null
          year?: number | null
        }
        Relationships: []
      }
      valuations: {
        Row: {
          accident_count: number | null
          auction_avg_price: number | null
          base_price: number | null
          body_type: string | null
          color: string | null
          condition_score: number | null
          confidence_score: number | null
          created_at: string
          dealer_avg_price: number | null
          estimated_value: number | null
          feature_value_total: number | null
          id: string
          is_vin_lookup: boolean
          make: string | null
          mileage: number | null
          model: string | null
          plate: string | null
          state: string | null
          user_id: string
          vin: string | null
          year: number | null
          zip_demand_factor: number | null
        }
        Insert: {
          accident_count?: number | null
          auction_avg_price?: number | null
          base_price?: number | null
          body_type?: string | null
          color?: string | null
          condition_score?: number | null
          confidence_score?: number | null
          created_at?: string
          dealer_avg_price?: number | null
          estimated_value?: number | null
          feature_value_total?: number | null
          id?: string
          is_vin_lookup?: boolean
          make?: string | null
          mileage?: number | null
          model?: string | null
          plate?: string | null
          state?: string | null
          user_id: string
          vin?: string | null
          year?: number | null
          zip_demand_factor?: number | null
        }
        Update: {
          accident_count?: number | null
          auction_avg_price?: number | null
          base_price?: number | null
          body_type?: string | null
          color?: string | null
          condition_score?: number | null
          confidence_score?: number | null
          created_at?: string
          dealer_avg_price?: number | null
          estimated_value?: number | null
          feature_value_total?: number | null
          id?: string
          is_vin_lookup?: boolean
          make?: string | null
          mileage?: number | null
          model?: string | null
          plate?: string | null
          state?: string | null
          user_id?: string
          vin?: string | null
          year?: number | null
          zip_demand_factor?: number | null
        }
        Relationships: []
      }
      vehicle_features: {
        Row: {
          created_at: string | null
          feature_id: string
          valuation_id: string
        }
        Insert: {
          created_at?: string | null
          feature_id: string
          valuation_id: string
        }
        Update: {
          created_at?: string | null
          feature_id?: string
          valuation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_features_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_features_valuation_id_fkey"
            columns: ["valuation_id"]
            isOneToOne: false
            referencedRelation: "valuations"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_histories: {
        Row: {
          fetched_at: string | null
          id: string
          provider: string
          report_url: string
          valuation_id: string
        }
        Insert: {
          fetched_at?: string | null
          id?: string
          provider: string
          report_url: string
          valuation_id: string
        }
        Update: {
          fetched_at?: string | null
          id?: string
          provider?: string
          report_url?: string
          valuation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_histories_valuation_id_fkey"
            columns: ["valuation_id"]
            isOneToOne: false
            referencedRelation: "valuations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bytea_to_text: {
        Args: { data: string }
        Returns: string
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_delete: {
        Args:
          | { uri: string }
          | { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_get: {
        Args: { uri: string } | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_post: {
        Args:
          | { uri: string; content: string; content_type: string }
          | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_put: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      is_dealer: {
        Args: { user_id: string }
        Returns: boolean
      }
      text_to_bytea: {
        Args: { data: string }
        Returns: string
      }
      urlencode: {
        Args: { data: Json } | { string: string } | { string: string }
        Returns: string
      }
    }
    Enums: {
      user_role: "user" | "dealer"
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["user", "dealer"],
    },
  },
} as const
