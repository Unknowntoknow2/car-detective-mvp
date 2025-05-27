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
      auction_results_by_vin: {
        Row: {
          auction_source: string
          condition_grade: string | null
          fetched_at: string | null
          id: string
          inserted_at: string
          location: string | null
          odometer: string
          photo_urls: string[]
          price: string
          sold_date: string
          source_priority: number | null
          vin: string
        }
        Insert: {
          auction_source: string
          condition_grade?: string | null
          fetched_at?: string | null
          id?: string
          inserted_at?: string
          location?: string | null
          odometer: string
          photo_urls?: string[]
          price: string
          sold_date: string
          source_priority?: number | null
          vin: string
        }
        Update: {
          auction_source?: string
          condition_grade?: string | null
          fetched_at?: string | null
          id?: string
          inserted_at?: string
          location?: string | null
          odometer?: string
          photo_urls?: string[]
          price?: string
          sold_date?: string
          source_priority?: number | null
          vin?: string
        }
        Relationships: []
      }
      car_finder_sessions: {
        Row: {
          created_at: string
          decoded_vehicle_id: string | null
          id: string
          status: string
          updated_at: string
          user_id: string | null
          valuation_id: string | null
          valuation_response_id: string | null
          vin: string
        }
        Insert: {
          created_at?: string
          decoded_vehicle_id?: string | null
          id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          valuation_id?: string | null
          valuation_response_id?: string | null
          vin: string
        }
        Update: {
          created_at?: string
          decoded_vehicle_id?: string | null
          id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          valuation_id?: string | null
          valuation_response_id?: string | null
          vin?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          user_id: string
          valuation_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          valuation_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          valuation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_valuation_id_fkey"
            columns: ["valuation_id"]
            isOneToOne: false
            referencedRelation: "valuations"
            referencedColumns: ["id"]
          },
        ]
      }
      color_adjustment: {
        Row: {
          category: string
          color: string
          description: string | null
          multiplier: number
        }
        Insert: {
          category: string
          color: string
          description?: string | null
          multiplier: number
        }
        Update: {
          category?: string
          color?: string
          description?: string | null
          multiplier?: number
        }
        Relationships: []
      }
      competitor_prices: {
        Row: {
          carvana_value: string | null
          fetched_at: string | null
          id: string
          kbb_value: string | null
          make: string | null
          model: string | null
          vin: string
          year: string | null
        }
        Insert: {
          carvana_value?: string | null
          fetched_at?: string | null
          id?: string
          kbb_value?: string | null
          make?: string | null
          model?: string | null
          vin: string
          year?: string | null
        }
        Update: {
          carvana_value?: string | null
          fetched_at?: string | null
          id?: string
          kbb_value?: string | null
          make?: string | null
          model?: string | null
          vin?: string
          year?: string | null
        }
        Relationships: []
      }
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
      dealer_applications: {
        Row: {
          contact_name: string
          created_at: string | null
          dealership_name: string
          email: string
          id: string
          phone: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          contact_name: string
          created_at?: string | null
          dealership_name: string
          email: string
          id?: string
          phone?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          contact_name?: string
          created_at?: string | null
          dealership_name?: string
          email?: string
          id?: string
          phone?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      dealer_leads: {
        Row: {
          created_at: string | null
          id: string
          secure_token: string
          status: string
          updated_at: string | null
          user_id: string
          valuation_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          secure_token: string
          status?: string
          updated_at?: string | null
          user_id: string
          valuation_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          secure_token?: string
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
          insight: string | null
          label: string | null
          message: string | null
          offer_amount: number
          report_id: string
          score: number | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          insight?: string | null
          label?: string | null
          message?: string | null
          offer_amount: number
          report_id: string
          score?: number | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          insight?: string | null
          label?: string | null
          message?: string | null
          offer_amount?: number
          report_id?: string
          score?: number | null
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
      dealer_vehicles: {
        Row: {
          condition: string
          created_at: string
          dealer_id: string
          fuel_type: string | null
          id: string
          make: string
          mileage: number | null
          model: string
          photos: Json | null
          price: number
          status: string
          transmission: string | null
          updated_at: string
          year: number
          zip_code: string | null
        }
        Insert: {
          condition: string
          created_at?: string
          dealer_id: string
          fuel_type?: string | null
          id?: string
          make: string
          mileage?: number | null
          model: string
          photos?: Json | null
          price: number
          status?: string
          transmission?: string | null
          updated_at?: string
          year: number
          zip_code?: string | null
        }
        Update: {
          condition?: string
          created_at?: string
          dealer_id?: string
          fuel_type?: string | null
          id?: string
          make?: string
          mileage?: number | null
          model?: string
          photos?: Json | null
          price?: number
          status?: string
          transmission?: string | null
          updated_at?: string
          year?: number
          zip_code?: string | null
        }
        Relationships: []
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
          bodytype: string | null
          bodyType: string | null
          created_at: string
          displacementl: string | null
          doors: string | null
          drivetrain: string | null
          engine: string | null
          enginecylinders: string | null
          fueltype: string | null
          id: string
          make: string | null
          model: string | null
          seats: string | null
          timestamp: string | null
          transmission: string | null
          trim: string | null
          vin: string
          year: number | null
        }
        Insert: {
          bodytype?: string | null
          bodyType?: string | null
          created_at?: string
          displacementl?: string | null
          doors?: string | null
          drivetrain?: string | null
          engine?: string | null
          enginecylinders?: string | null
          fueltype?: string | null
          id?: string
          make?: string | null
          model?: string | null
          seats?: string | null
          timestamp?: string | null
          transmission?: string | null
          trim?: string | null
          vin: string
          year?: number | null
        }
        Update: {
          bodytype?: string | null
          bodyType?: string | null
          created_at?: string
          displacementl?: string | null
          doors?: string | null
          drivetrain?: string | null
          engine?: string | null
          enginecylinders?: string | null
          fueltype?: string | null
          id?: string
          make?: string | null
          model?: string | null
          seats?: string | null
          timestamp?: string | null
          transmission?: string | null
          trim?: string | null
          vin?: string
          year?: number | null
        }
        Relationships: []
      }
      driving_profile: {
        Row: {
          description: string | null
          multiplier: number
          profile: string
        }
        Insert: {
          description?: string | null
          multiplier: number
          profile: string
        }
        Update: {
          description?: string | null
          multiplier?: number
          profile?: string
        }
        Relationships: []
      }
      email_campaigns: {
        Row: {
          audience_type: string
          body: string
          created_at: string | null
          id: string
          recipient_count: number | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          audience_type: string
          body: string
          created_at?: string | null
          id?: string
          recipient_count?: number | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          audience_type?: string
          body?: string
          created_at?: string | null
          id?: string
          recipient_count?: number | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          created_at: string
          email: string
          email_type: string
          error: string | null
          id: string
          offer_id: string | null
          status: string
          user_id: string | null
          valuation_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          email_type: string
          error?: string | null
          id?: string
          offer_id?: string | null
          status: string
          user_id?: string | null
          valuation_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          email_type?: string
          error?: string | null
          id?: string
          offer_id?: string | null
          status?: string
          user_id?: string | null
          valuation_id?: string | null
        }
        Relationships: []
      }
      equipment_options: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          multiplier: number
          name: string
          value_add: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          multiplier: number
          name: string
          value_add?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          multiplier?: number
          name?: string
          value_add?: number | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          value: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          value?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          value?: boolean
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
      follow_up_answers: {
        Row: {
          accidents: Json | null
          completion_percentage: number | null
          condition: string | null
          created_at: string
          dashboard_lights: string[] | null
          frame_damage: boolean | null
          id: string
          is_complete: boolean | null
          last_service_date: string | null
          maintenance_status: string | null
          mileage: number | null
          modifications: Json | null
          previous_owners: number | null
          previous_use: string | null
          service_history: string | null
          tire_condition: string | null
          title_status: string | null
          updated_at: string
          user_id: string | null
          valuation_id: string | null
          vin: string
          zip_code: string | null
        }
        Insert: {
          accidents?: Json | null
          completion_percentage?: number | null
          condition?: string | null
          created_at?: string
          dashboard_lights?: string[] | null
          frame_damage?: boolean | null
          id?: string
          is_complete?: boolean | null
          last_service_date?: string | null
          maintenance_status?: string | null
          mileage?: number | null
          modifications?: Json | null
          previous_owners?: number | null
          previous_use?: string | null
          service_history?: string | null
          tire_condition?: string | null
          title_status?: string | null
          updated_at?: string
          user_id?: string | null
          valuation_id?: string | null
          vin: string
          zip_code?: string | null
        }
        Update: {
          accidents?: Json | null
          completion_percentage?: number | null
          condition?: string | null
          created_at?: string
          dashboard_lights?: string[] | null
          frame_damage?: boolean | null
          id?: string
          is_complete?: boolean | null
          last_service_date?: string | null
          maintenance_status?: string | null
          mileage?: number | null
          modifications?: Json | null
          previous_owners?: number | null
          previous_use?: string | null
          service_history?: string | null
          tire_condition?: string | null
          title_status?: string | null
          updated_at?: string
          user_id?: string | null
          valuation_id?: string | null
          vin?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_answers_valuation_id_fkey"
            columns: ["valuation_id"]
            isOneToOne: false
            referencedRelation: "valuations"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_type_adjustment: {
        Row: {
          description: string | null
          multiplier: number
          type: string
        }
        Insert: {
          description?: string | null
          multiplier: number
          type: string
        }
        Update: {
          description?: string | null
          multiplier?: number
          type?: string
        }
        Relationships: []
      }
      makes: {
        Row: {
          created_at: string | null
          id: string
          make_id: number | null
          make_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          make_id?: number | null
          make_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          make_id?: number | null
          make_name?: string
        }
        Relationships: []
      }
      makes_backup: {
        Row: {
          created_at: string | null
          id: string | null
          make_id: number | null
          make_name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          make_id?: number | null
          make_name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          make_id?: number | null
          make_name?: string | null
        }
        Relationships: []
      }
      makes_temp: {
        Row: {
          id: string
          make_name: string | null
        }
        Insert: {
          id?: string
          make_name?: string | null
        }
        Update: {
          id?: string
          make_name?: string | null
        }
        Relationships: []
      }
      manual_entry_valuations: {
        Row: {
          accident: boolean | null
          accident_severity: string | null
          condition: string
          confidence_score: number | null
          created_at: string | null
          fuel_type: string
          id: string
          make: string
          mileage: number
          model: string
          selected_features: string[] | null
          transmission: string
          user_id: string | null
          valuation_id: string | null
          vin: string | null
          year: number
          zip_code: string
        }
        Insert: {
          accident?: boolean | null
          accident_severity?: string | null
          condition: string
          confidence_score?: number | null
          created_at?: string | null
          fuel_type: string
          id?: string
          make: string
          mileage: number
          model: string
          selected_features?: string[] | null
          transmission: string
          user_id?: string | null
          valuation_id?: string | null
          vin?: string | null
          year: number
          zip_code: string
        }
        Update: {
          accident?: boolean | null
          accident_severity?: string | null
          condition?: string
          confidence_score?: number | null
          created_at?: string | null
          fuel_type?: string
          id?: string
          make?: string
          mileage?: number
          model?: string
          selected_features?: string[] | null
          transmission?: string
          user_id?: string | null
          valuation_id?: string | null
          vin?: string | null
          year?: number
          zip_code?: string
        }
        Relationships: []
      }
      market_adjustments: {
        Row: {
          last_updated: string
          market_multiplier: number
          zip_code: string
        }
        Insert: {
          last_updated?: string
          market_multiplier: number
          zip_code: string
        }
        Update: {
          last_updated?: string
          market_multiplier?: number
          zip_code?: string
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
      model_trims: {
        Row: {
          created_at: string
          description: string | null
          engine_type: string | null
          fuel_type: string | null
          id: string
          image_url: string | null
          model_id: string | null
          msrp: number | null
          transmission: string | null
          trim_name: string | null
          updated_at: string
          year: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          engine_type?: string | null
          fuel_type?: string | null
          id?: string
          image_url?: string | null
          model_id?: string | null
          msrp?: number | null
          transmission?: string | null
          trim_name?: string | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          engine_type?: string | null
          fuel_type?: string | null
          id?: string
          image_url?: string | null
          model_id?: string | null
          msrp?: number | null
          transmission?: string | null
          trim_name?: string | null
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "model_trims_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      model_trims_temp_enriched: {
        Row: {
          creaed_at: string | null
          created_at: string | null
          description: string | null
          engine_type: string
          image_url: string | null
          image_URL: string | null
          model_name: string
          msrp: number | null
          MSRP: number | null
          source: string | null
          trim_name: string
        }
        Insert: {
          creaed_at?: string | null
          created_at?: string | null
          description?: string | null
          engine_type: string
          image_url?: string | null
          image_URL?: string | null
          model_name: string
          msrp?: number | null
          MSRP?: number | null
          source?: string | null
          trim_name: string
        }
        Update: {
          creaed_at?: string | null
          created_at?: string | null
          description?: string | null
          engine_type?: string
          image_url?: string | null
          image_URL?: string | null
          model_name?: string
          msrp?: number | null
          MSRP?: number | null
          source?: string | null
          trim_name?: string
        }
        Relationships: []
      }
      models: {
        Row: {
          created_at: string | null
          id: string
          make_id: string | null
          model_name: string
          nhtsa_model_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          make_id?: string | null
          model_name: string
          nhtsa_model_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          make_id?: string | null
          model_name?: string
          nhtsa_model_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_make"
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
      photo_condition_scores: {
        Row: {
          condition_score: number
          confidence_score: number
          created_at: string
          id: string
          issues: Json | null
          summary: string | null
          valuation_id: string
        }
        Insert: {
          condition_score: number
          confidence_score: number
          created_at?: string
          id?: string
          issues?: Json | null
          summary?: string | null
          valuation_id: string
        }
        Update: {
          condition_score?: number
          confidence_score?: number
          created_at?: string
          id?: string
          issues?: Json | null
          summary?: string | null
          valuation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_condition_scores_valuation_id_fkey"
            columns: ["valuation_id"]
            isOneToOne: false
            referencedRelation: "valuations"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_scores: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          score: number
          thumbnail_url: string | null
          valuation_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          score: number
          thumbnail_url?: string | null
          valuation_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          score?: number
          thumbnail_url?: string | null
          valuation_id?: string
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
      premium_access: {
        Row: {
          created_at: string
          credits_remaining: number
          expires_at: string | null
          id: string
          purchase_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_remaining?: number
          expires_at?: string | null
          id?: string
          purchase_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_remaining?: number
          expires_at?: string | null
          id?: string
          purchase_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      premium_credits: {
        Row: {
          created_at: string
          id: string
          remaining_credits: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          remaining_credits?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          remaining_credits?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      premium_transactions: {
        Row: {
          amount: number | null
          created_at: string
          id: string
          metadata: Json | null
          product_name: string | null
          quantity: number | null
          stripe_session_id: string | null
          type: string
          user_id: string
          valuation_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: string
          metadata?: Json | null
          product_name?: string | null
          quantity?: number | null
          stripe_session_id?: string | null
          type: string
          user_id: string
          valuation_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: string
          metadata?: Json | null
          product_name?: string | null
          quantity?: number | null
          stripe_session_id?: string | null
          type?: string
          user_id?: string
          valuation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "premium_transactions_valuation_id_fkey"
            columns: ["valuation_id"]
            isOneToOne: false
            referencedRelation: "valuations"
            referencedColumns: ["id"]
          },
        ]
      }
      premium_valuations: {
        Row: {
          created_at: string
          id: string
          user_id: string
          valuation_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          valuation_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          valuation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "premium_valuations_valuation_id_fkey"
            columns: ["valuation_id"]
            isOneToOne: false
            referencedRelation: "valuations"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_curves: {
        Row: {
          condition: string
          multiplier: number
          zip_code: string
        }
        Insert: {
          condition: string
          multiplier: number
          zip_code: string
        }
        Update: {
          condition?: string
          multiplier?: number
          zip_code?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          dealership_name: string | null
          full_name: string | null
          id: string
          is_premium_dealer: boolean | null
          premium_expires_at: string | null
          role: string | null
          updated_at: string | null
          user_role: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          dealership_name?: string | null
          full_name?: string | null
          id: string
          is_premium_dealer?: boolean | null
          premium_expires_at?: string | null
          role?: string | null
          updated_at?: string | null
          user_role?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          dealership_name?: string | null
          full_name?: string | null
          id?: string
          is_premium_dealer?: boolean | null
          premium_expires_at?: string | null
          role?: string | null
          updated_at?: string | null
          user_role?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      public_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          valuation_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          token: string
          valuation_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          valuation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_tokens_valuation_id_fkey"
            columns: ["valuation_id"]
            isOneToOne: false
            referencedRelation: "valuations"
            referencedColumns: ["id"]
          },
        ]
      }
      recall_factor: {
        Row: {
          description: string | null
          has_open_recall: boolean
          multiplier: number
        }
        Insert: {
          description?: string | null
          has_open_recall: boolean
          multiplier: number
        }
        Update: {
          description?: string | null
          has_open_recall?: boolean
          multiplier?: number
        }
        Relationships: []
      }
      recalls_cache: {
        Row: {
          fetched_at: string
          make: string
          model: string
          recalls_data: Json
          year: number
        }
        Insert: {
          fetched_at?: string
          make: string
          model: string
          recalls_data: Json
          year: number
        }
        Update: {
          fetched_at?: string
          make?: string
          model?: string
          recalls_data?: Json
          year?: number
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          inviter_id: string
          referral_token: string
          referred_email: string | null
          referred_user_id: string | null
          reward_amount: number | null
          reward_status: string
          reward_type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          inviter_id: string
          referral_token: string
          referred_email?: string | null
          referred_user_id?: string | null
          reward_amount?: number | null
          reward_status?: string
          reward_type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          inviter_id?: string
          referral_token?: string
          referred_email?: string | null
          referred_user_id?: string | null
          reward_amount?: number | null
          reward_status?: string
          reward_type?: string | null
          updated_at?: string
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
      seasonal_index: {
        Row: {
          convertible: number
          description: string | null
          generic: number
          month: number
          sport: number
          suv: number
          truck: number
        }
        Insert: {
          convertible: number
          description?: string | null
          generic: number
          month: number
          sport: number
          suv: number
          truck: number
        }
        Update: {
          convertible?: number
          description?: string | null
          generic?: number
          month?: number
          sport?: number
          suv?: number
          truck?: number
        }
        Relationships: []
      }
      service_history: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          mileage: number | null
          receipt_url: string | null
          service_date: string
          vin: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          mileage?: number | null
          receipt_url?: string | null
          service_date: string
          vin?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          mileage?: number | null
          receipt_url?: string | null
          service_date?: string
          vin?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_history_vin_fkey"
            columns: ["vin"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["vin"]
          },
        ]
      }
      title_status: {
        Row: {
          created_at: string | null
          description: string | null
          multiplier: number
          status: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          multiplier: number
          status: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          multiplier?: number
          status?: string
        }
        Relationships: []
      }
      top_referrers: {
        Row: {
          id: string
          referral_count: number | null
          reward_count: number | null
          updated_at: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          id?: string
          referral_count?: number | null
          reward_count?: number | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          id?: string
          referral_count?: number | null
          reward_count?: number | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      transmission_adjustment: {
        Row: {
          description: string | null
          multiplier: number
          type: string
        }
        Insert: {
          description?: string | null
          multiplier: number
          type: string
        }
        Update: {
          description?: string | null
          multiplier?: number
          type?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      valuation_factors: {
        Row: {
          created_at: string | null
          factor_name: string
          id: string
          label: string
          multiplier: number
          step: number
          tip: string
        }
        Insert: {
          created_at?: string | null
          factor_name: string
          id?: string
          label: string
          multiplier: number
          step: number
          tip: string
        }
        Update: {
          created_at?: string | null
          factor_name?: string
          id?: string
          label?: string
          multiplier?: number
          step?: number
          tip?: string
        }
        Relationships: []
      }
      valuation_photos: {
        Row: {
          id: string
          photo_url: string
          score: number
          uploaded_at: string | null
          valuation_id: string
        }
        Insert: {
          id?: string
          photo_url: string
          score: number
          uploaded_at?: string | null
          valuation_id: string
        }
        Update: {
          id?: string
          photo_url?: string
          score?: number
          uploaded_at?: string | null
          valuation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_valuation"
            columns: ["valuation_id"]
            isOneToOne: false
            referencedRelation: "valuations"
            referencedColumns: ["id"]
          },
        ]
      }
      valuation_responses: {
        Row: {
          accident: string | null
          accident_area: string | null
          accident_severity: string | null
          condition_level: string | null
          created_at: string
          dashboard_lights: string | null
          frame_damage: string | null
          id: string
          maintenance_up_to_date: string | null
          mileage: number | null
          modified: string | null
          number_of_owners: string | null
          previous_use: string | null
          service_history: string | null
          tire_condition: string | null
          title_status: string | null
          updated_at: string
          user_id: string | null
          vin: string
          zip_code: string | null
        }
        Insert: {
          accident?: string | null
          accident_area?: string | null
          accident_severity?: string | null
          condition_level?: string | null
          created_at?: string
          dashboard_lights?: string | null
          frame_damage?: string | null
          id?: string
          maintenance_up_to_date?: string | null
          mileage?: number | null
          modified?: string | null
          number_of_owners?: string | null
          previous_use?: string | null
          service_history?: string | null
          tire_condition?: string | null
          title_status?: string | null
          updated_at?: string
          user_id?: string | null
          vin: string
          zip_code?: string | null
        }
        Update: {
          accident?: string | null
          accident_area?: string | null
          accident_severity?: string | null
          condition_level?: string | null
          created_at?: string
          dashboard_lights?: string | null
          frame_damage?: string | null
          id?: string
          maintenance_up_to_date?: string | null
          mileage?: number | null
          modified?: string | null
          number_of_owners?: string | null
          previous_use?: string | null
          service_history?: string | null
          tire_condition?: string | null
          title_status?: string | null
          updated_at?: string
          user_id?: string | null
          vin?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      valuation_stats: {
        Row: {
          average_price: number | null
          id: string
          make: string | null
          model: string | null
          total_valuations: number | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          average_price?: number | null
          id?: string
          make?: string | null
          model?: string | null
          total_valuations?: number | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          average_price?: number | null
          id?: string
          make?: string | null
          model?: string | null
          total_valuations?: number | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      valuations: {
        Row: {
          accident_count: number | null
          auction_avg_price: number | null
          base_price: number | null
          body_style: string | null
          body_type: string | null
          color: string | null
          condition_score: number | null
          confidence_score: number | null
          created_at: string
          dealer_avg_price: number | null
          displacement_l: string | null
          drivetrain: string | null
          engine_cylinders: string | null
          estimated_value: number | null
          feature_value_total: number | null
          fuel_type: string | null
          has_open_recall: boolean | null
          id: string
          is_vin_lookup: boolean
          make: string | null
          mileage: number | null
          model: string | null
          pdf_url: string | null
          plate: string | null
          premium_unlocked: boolean | null
          sale_date: string | null
          seasonal_multiplier: number | null
          state: string | null
          transmission: string | null
          user_id: string | null
          vin: string | null
          warranty_status: string | null
          year: number | null
          zip_demand_factor: number | null
        }
        Insert: {
          accident_count?: number | null
          auction_avg_price?: number | null
          base_price?: number | null
          body_style?: string | null
          body_type?: string | null
          color?: string | null
          condition_score?: number | null
          confidence_score?: number | null
          created_at?: string
          dealer_avg_price?: number | null
          displacement_l?: string | null
          drivetrain?: string | null
          engine_cylinders?: string | null
          estimated_value?: number | null
          feature_value_total?: number | null
          fuel_type?: string | null
          has_open_recall?: boolean | null
          id?: string
          is_vin_lookup?: boolean
          make?: string | null
          mileage?: number | null
          model?: string | null
          pdf_url?: string | null
          plate?: string | null
          premium_unlocked?: boolean | null
          sale_date?: string | null
          seasonal_multiplier?: number | null
          state?: string | null
          transmission?: string | null
          user_id?: string | null
          vin?: string | null
          warranty_status?: string | null
          year?: number | null
          zip_demand_factor?: number | null
        }
        Update: {
          accident_count?: number | null
          auction_avg_price?: number | null
          base_price?: number | null
          body_style?: string | null
          body_type?: string | null
          color?: string | null
          condition_score?: number | null
          confidence_score?: number | null
          created_at?: string
          dealer_avg_price?: number | null
          displacement_l?: string | null
          drivetrain?: string | null
          engine_cylinders?: string | null
          estimated_value?: number | null
          feature_value_total?: number | null
          fuel_type?: string | null
          has_open_recall?: boolean | null
          id?: string
          is_vin_lookup?: boolean
          make?: string | null
          mileage?: number | null
          model?: string | null
          pdf_url?: string | null
          plate?: string | null
          premium_unlocked?: boolean | null
          sale_date?: string | null
          seasonal_multiplier?: number | null
          state?: string | null
          transmission?: string | null
          user_id?: string | null
          vin?: string | null
          warranty_status?: string | null
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
      vehicle_history_events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          event_type: string
          id: string
          vin: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date?: string
          event_type: string
          id?: string
          vin: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          vin?: string
        }
        Relationships: []
      }
      vehicle_makes_models: {
        Row: {
          created_at: string
          id: string
          make: string
          model: string
        }
        Insert: {
          created_at?: string
          id?: string
          make: string
          model: string
        }
        Update: {
          created_at?: string
          id?: string
          make?: string
          model?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          created_at: string | null
          has_full_service_history: boolean | null
          num_owners: number | null
          service_records: Json | null
          title_brand: string
          updated_at: string | null
          vin: string
        }
        Insert: {
          created_at?: string | null
          has_full_service_history?: boolean | null
          num_owners?: number | null
          service_records?: Json | null
          title_brand?: string
          updated_at?: string | null
          vin: string
        }
        Update: {
          created_at?: string | null
          has_full_service_history?: boolean | null
          num_owners?: number | null
          service_records?: Json | null
          title_brand?: string
          updated_at?: string | null
          vin?: string
        }
        Relationships: []
      }
      vin_cache: {
        Row: {
          fetched_at: string | null
          nicb_data: Json
          vin: string
        }
        Insert: {
          fetched_at?: string | null
          nicb_data: Json
          vin: string
        }
        Update: {
          fetched_at?: string | null
          nicb_data?: Json
          vin?: string
        }
        Relationships: []
      }
      vin_failures: {
        Row: {
          created_at: string
          error_message: string
          id: string
          source: string
          vin: string
        }
        Insert: {
          created_at?: string
          error_message: string
          id?: string
          source: string
          vin: string
        }
        Update: {
          created_at?: string
          error_message?: string
          id?: string
          source?: string
          vin?: string
        }
        Relationships: []
      }
      vin_lookup_requests: {
        Row: {
          id: string
          requested_at: string
          requested_by: string | null
          status: string | null
          vin: string
        }
        Insert: {
          id?: string
          requested_at?: string
          requested_by?: string | null
          status?: string | null
          vin: string
        }
        Update: {
          id?: string
          requested_at?: string
          requested_by?: string | null
          status?: string | null
          vin?: string
        }
        Relationships: []
      }
      vpic_cache: {
        Row: {
          fetched_at: string | null
          vin: string
          vpic_data: Json
        }
        Insert: {
          fetched_at?: string | null
          vin: string
          vpic_data: Json
        }
        Update: {
          fetched_at?: string | null
          vin?: string
          vpic_data?: Json
        }
        Relationships: []
      }
      warranty_options: {
        Row: {
          description: string | null
          multiplier: number
          status: string
        }
        Insert: {
          description?: string | null
          multiplier: number
          status: string
        }
        Update: {
          description?: string | null
          multiplier?: number
          status?: string
        }
        Relationships: []
      }
      zip_cache: {
        Row: {
          fetched_at: string
          location_data: Json
          zip: string
        }
        Insert: {
          fetched_at?: string
          location_data: Json
          zip: string
        }
        Update: {
          fetched_at?: string
          location_data?: Json
          zip?: string
        }
        Relationships: []
      }
      zip_validations: {
        Row: {
          city: string | null
          latitude: string | null
          longitude: string | null
          state: string | null
          valid_at: string | null
          zip: string
        }
        Insert: {
          city?: string | null
          latitude?: string | null
          longitude?: string | null
          state?: string | null
          valid_at?: string | null
          zip: string
        }
        Update: {
          city?: string | null
          latitude?: string | null
          longitude?: string | null
          state?: string | null
          valid_at?: string | null
          zip?: string
        }
        Relationships: []
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
      claim_referral_reward: {
        Args: { referral_id: string }
        Returns: boolean
      }
      clean_old_zip_validations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_referral_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_referral_stats: {
        Args: { user_id: string }
        Returns: {
          total_referrals: number
          pending_referrals: number
          earned_rewards: number
          claimed_rewards: number
        }[]
      }
      has_premium_access: {
        Args: { valuation_id: string }
        Returns: boolean
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
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_dealer: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_premium_dealer: {
        Args: { user_id: string }
        Returns: boolean
      }
      mark_referral_earned: {
        Args: { user_id: string; reward_type?: string; reward_amount?: number }
        Returns: undefined
      }
      process_referral: {
        Args: { token: string; new_user_id: string }
        Returns: undefined
      }
      text_to_bytea: {
        Args: { data: string }
        Returns: string
      }
      update_top_referrers: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_valuation_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      urlencode: {
        Args: { data: Json } | { string: string } | { string: string }
        Returns: string
      }
      use_premium_credit: {
        Args: { p_user_id: string; p_valuation_id: string }
        Returns: boolean
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
