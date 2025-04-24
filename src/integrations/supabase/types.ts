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
          body_type: string | null
          color: string | null
          condition_score: number | null
          confidence_score: number | null
          created_at: string
          estimated_value: number | null
          id: string
          is_vin_lookup: boolean
          make: string | null
          model: string | null
          plate: string | null
          state: string | null
          user_id: string
          vin: string | null
          year: number | null
        }
        Insert: {
          body_type?: string | null
          color?: string | null
          condition_score?: number | null
          confidence_score?: number | null
          created_at?: string
          estimated_value?: number | null
          id?: string
          is_vin_lookup?: boolean
          make?: string | null
          model?: string | null
          plate?: string | null
          state?: string | null
          user_id: string
          vin?: string | null
          year?: number | null
        }
        Update: {
          body_type?: string | null
          color?: string | null
          condition_score?: number | null
          confidence_score?: number | null
          created_at?: string
          estimated_value?: number | null
          id?: string
          is_vin_lookup?: boolean
          make?: string | null
          model?: string | null
          plate?: string | null
          state?: string | null
          user_id?: string
          vin?: string | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_dealer: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "user" | "dealer"
    }
    CompositeTypes: {
      [_ in never]: never
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
