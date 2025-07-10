export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      accepted_offers: {
        Row: {
          accepted_at: string
          created_at: string
          dealer_id: string
          dealer_offer_id: string
          id: string
          status: string
          updated_at: string
          user_id: string
          valuation_id: string
        }
        Insert: {
          accepted_at?: string
          created_at?: string
          dealer_id: string
          dealer_offer_id: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
          valuation_id: string
        }
        Update: {
          accepted_at?: string
          created_at?: string
          dealer_id?: string
          dealer_offer_id?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
          valuation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accepted_offers_dealer_offer_id_fkey"
            columns: ["dealer_offer_id"]
            isOneToOne: false
            referencedRelation: "dealer_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_market_snapshots: {
        Row: {
          created_at: string
          id: string
          processed_payload: Json | null
          processing_time_ms: number | null
          raw_payload: Json
          snapshot_type: string
          source: string
          token_count: number | null
          valuation_request_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          processed_payload?: Json | null
          processing_time_ms?: number | null
          raw_payload: Json
          snapshot_type: string
          source: string
          token_count?: number | null
          valuation_request_id: string
        }
        Update: {
          created_at?: string
          id?: string
          processed_payload?: Json | null
          processing_time_ms?: number | null
          raw_payload?: Json
          snapshot_type?: string
          source?: string
          token_count?: number | null
          valuation_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_market_snapshots_valuation_request_id_fkey"
            columns: ["valuation_request_id"]
            isOneToOne: false
            referencedRelation: "valuation_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_photo_analysis: {
        Row: {
          analysis_results: Json
          condition_score: number | null
          confidence_score: number | null
          created_at: string | null
          damage_detected: Json | null
          features_detected: Json | null
          id: string
          listing_id: string | null
          photo_urls: string[] | null
          processed_at: string | null
          vin: string | null
        }
        Insert: {
          analysis_results?: Json
          condition_score?: number | null
          confidence_score?: number | null
          created_at?: string | null
          damage_detected?: Json | null
          features_detected?: Json | null
          id?: string
          listing_id?: string | null
          photo_urls?: string[] | null
          processed_at?: string | null
          vin?: string | null
        }
        Update: {
          analysis_results?: Json
          condition_score?: number | null
          confidence_score?: number | null
          created_at?: string | null
          damage_detected?: Json | null
          features_detected?: Json | null
          id?: string
          listing_id?: string | null
          photo_urls?: string[] | null
          processed_at?: string | null
          vin?: string | null
        }
        Relationships: []
      }
      api_partners: {
        Row: {
          api_key_hash: string
          created_at: string | null
          id: string
          is_active: boolean | null
          last_accessed: string | null
          partner_name: string
          partner_type: string
          permissions: Json
          rate_limit_per_hour: number | null
          updated_at: string | null
        }
        Insert: {
          api_key_hash: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_accessed?: string | null
          partner_name: string
          partner_type: string
          permissions?: Json
          rate_limit_per_hour?: number | null
          updated_at?: string | null
        }
        Update: {
          api_key_hash?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_accessed?: string | null
          partner_name?: string
          partner_type?: string
          permissions?: Json
          rate_limit_per_hour?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      auction_enrichment_by_vin: {
        Row: {
          created_at: string | null
          data: Json
          id: string
          source: string
          updated_at: string | null
          vin: string
        }
        Insert: {
          created_at?: string | null
          data: Json
          id?: string
          source: string
          updated_at?: string | null
          vin: string
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: string
          source?: string
          updated_at?: string | null
          vin?: string
        }
        Relationships: []
      }
      auction_intelligence_by_vin: {
        Row: {
          auction_conflict: boolean
          created_at: string
          flip_flags: Json
          latest_sale: Json | null
          price_trend: Json
          risk_score: number
          updated_at: string
          vin: string
        }
        Insert: {
          auction_conflict?: boolean
          created_at?: string
          flip_flags?: Json
          latest_sale?: Json | null
          price_trend?: Json
          risk_score?: number
          updated_at?: string
          vin: string
        }
        Update: {
          auction_conflict?: boolean
          created_at?: string
          flip_flags?: Json
          latest_sale?: Json | null
          price_trend?: Json
          risk_score?: number
          updated_at?: string
          vin?: string
        }
        Relationships: []
      }
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
      compliance_audit_log: {
        Row: {
          action: string
          compliance_flags: string[] | null
          created_at: string | null
          data_sources_used: string[] | null
          entity_id: string
          entity_type: string
          id: string
          input_data: Json | null
          ip_address: unknown | null
          output_data: Json | null
          processing_time_ms: number | null
          retention_until: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          compliance_flags?: string[] | null
          created_at?: string | null
          data_sources_used?: string[] | null
          entity_id: string
          entity_type: string
          id?: string
          input_data?: Json | null
          ip_address?: unknown | null
          output_data?: Json | null
          processing_time_ms?: number | null
          retention_until?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          compliance_flags?: string[] | null
          created_at?: string | null
          data_sources_used?: string[] | null
          entity_id?: string
          entity_type?: string
          id?: string
          input_data?: Json | null
          ip_address?: unknown | null
          output_data?: Json | null
          processing_time_ms?: number | null
          retention_until?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      compliance_log: {
        Row: {
          action_type: string
          attribution_provided: boolean | null
          compliance_notes: string | null
          created_at: string
          data_type: string
          id: string
          legal_review_status: string | null
          source_name: string
          takedown_date: string | null
          takedown_requested: boolean | null
          terms_compliance: boolean | null
        }
        Insert: {
          action_type: string
          attribution_provided?: boolean | null
          compliance_notes?: string | null
          created_at?: string
          data_type: string
          id?: string
          legal_review_status?: string | null
          source_name: string
          takedown_date?: string | null
          takedown_requested?: boolean | null
          terms_compliance?: boolean | null
        }
        Update: {
          action_type?: string
          attribution_provided?: boolean | null
          compliance_notes?: string | null
          created_at?: string
          data_type?: string
          id?: string
          legal_review_status?: string | null
          source_name?: string
          takedown_date?: string | null
          takedown_requested?: boolean | null
          terms_compliance?: boolean | null
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
      data_fetch_tasks: {
        Row: {
          created_at: string
          error_log: string | null
          frequency_minutes: number
          id: string
          last_run_at: string | null
          max_retries: number
          next_run_at: string
          priority: number
          provenance: Json | null
          retry_count: number
          search_params: Json
          source_name: string
          status: string
          target_url: string | null
          task_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_log?: string | null
          frequency_minutes?: number
          id?: string
          last_run_at?: string | null
          max_retries?: number
          next_run_at?: string
          priority?: number
          provenance?: Json | null
          retry_count?: number
          search_params: Json
          source_name: string
          status?: string
          target_url?: string | null
          task_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_log?: string | null
          frequency_minutes?: number
          id?: string
          last_run_at?: string | null
          max_retries?: number
          next_run_at?: string
          priority?: number
          provenance?: Json | null
          retry_count?: number
          search_params?: Json
          source_name?: string
          status?: string
          target_url?: string | null
          task_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      data_sources: {
        Row: {
          auth_config: Json | null
          base_url: string | null
          created_at: string
          id: string
          is_active: boolean | null
          last_scraped: string | null
          notes: string | null
          rate_limit_per_hour: number | null
          requires_auth: boolean | null
          scraping_config: Json | null
          search_pattern: string | null
          source_name: string
          source_type: string
          success_rate: number | null
          updated_at: string
        }
        Insert: {
          auth_config?: Json | null
          base_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_scraped?: string | null
          notes?: string | null
          rate_limit_per_hour?: number | null
          requires_auth?: boolean | null
          scraping_config?: Json | null
          search_pattern?: string | null
          source_name: string
          source_type: string
          success_rate?: number | null
          updated_at?: string
        }
        Update: {
          auth_config?: Json | null
          base_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_scraped?: string | null
          notes?: string | null
          rate_limit_per_hour?: number | null
          requires_auth?: boolean | null
          scraping_config?: Json | null
          search_pattern?: string | null
          source_name?: string
          source_type?: string
          success_rate?: number | null
          updated_at?: string
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
          additional_notes: string | null
          brake_condition: string | null
          completion_percentage: number | null
          condition: string | null
          created_at: string
          dashboard_lights: string[] | null
          exterior_condition: string | null
          features: Json | null
          frame_damage: boolean | null
          id: string
          interior_condition: string | null
          is_complete: boolean | null
          last_service_date: string | null
          loan_balance: number | null
          maintenance_status: string | null
          make: string | null
          mileage: number | null
          model: string | null
          modifications: Json | null
          payoff_amount: number | null
          previous_owners: number | null
          previous_use: string | null
          service_history: string | null
          serviceHistory: Json | null
          tire_condition: string | null
          title_status: string | null
          transmission: string | null
          trim: string | null
          updated_at: string
          user_id: string | null
          valuation_id: string | null
          vin: string
          year: number | null
          zip_code: string | null
        }
        Insert: {
          accidents?: Json | null
          additional_notes?: string | null
          brake_condition?: string | null
          completion_percentage?: number | null
          condition?: string | null
          created_at?: string
          dashboard_lights?: string[] | null
          exterior_condition?: string | null
          features?: Json | null
          frame_damage?: boolean | null
          id?: string
          interior_condition?: string | null
          is_complete?: boolean | null
          last_service_date?: string | null
          loan_balance?: number | null
          maintenance_status?: string | null
          make?: string | null
          mileage?: number | null
          model?: string | null
          modifications?: Json | null
          payoff_amount?: number | null
          previous_owners?: number | null
          previous_use?: string | null
          service_history?: string | null
          serviceHistory?: Json | null
          tire_condition?: string | null
          title_status?: string | null
          transmission?: string | null
          trim?: string | null
          updated_at?: string
          user_id?: string | null
          valuation_id?: string | null
          vin: string
          year?: number | null
          zip_code?: string | null
        }
        Update: {
          accidents?: Json | null
          additional_notes?: string | null
          brake_condition?: string | null
          completion_percentage?: number | null
          condition?: string | null
          created_at?: string
          dashboard_lights?: string[] | null
          exterior_condition?: string | null
          features?: Json | null
          frame_damage?: boolean | null
          id?: string
          interior_condition?: string | null
          is_complete?: boolean | null
          last_service_date?: string | null
          loan_balance?: number | null
          maintenance_status?: string | null
          make?: string | null
          mileage?: number | null
          model?: string | null
          modifications?: Json | null
          payoff_amount?: number | null
          previous_owners?: number | null
          previous_use?: string | null
          service_history?: string | null
          serviceHistory?: Json | null
          tire_condition?: string | null
          title_status?: string | null
          transmission?: string | null
          trim?: string | null
          updated_at?: string
          user_id?: string | null
          valuation_id?: string | null
          vin?: string
          year?: number | null
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
      fraud_detection_flags: {
        Row: {
          auto_flagged: boolean | null
          confidence_score: number | null
          created_at: string | null
          flag_reason: string
          flag_type: string
          human_reviewed: boolean | null
          id: string
          is_valid: boolean | null
          listing_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          vin: string | null
        }
        Insert: {
          auto_flagged?: boolean | null
          confidence_score?: number | null
          created_at?: string | null
          flag_reason: string
          flag_type: string
          human_reviewed?: boolean | null
          id?: string
          is_valid?: boolean | null
          listing_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          vin?: string | null
        }
        Update: {
          auto_flagged?: boolean | null
          confidence_score?: number | null
          created_at?: string | null
          flag_reason?: string
          flag_type?: string
          human_reviewed?: boolean | null
          id?: string
          is_valid?: boolean | null
          listing_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          vin?: string | null
        }
        Relationships: []
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
      market_comps: {
        Row: {
          condition: string | null
          confidence_score: number | null
          created_at: string | null
          dealer_name: string | null
          features: Json | null
          id: string
          incentives: string | null
          is_cpo: boolean | null
          listing_url: string | null
          location: string | null
          make: string | null
          mileage: number | null
          model: string | null
          price: number
          raw_data: Json | null
          source: string
          source_type: string
          trim: string | null
          updated_at: string | null
          valuation_request_id: string | null
          vin: string | null
          year: number | null
        }
        Insert: {
          condition?: string | null
          confidence_score?: number | null
          created_at?: string | null
          dealer_name?: string | null
          features?: Json | null
          id?: string
          incentives?: string | null
          is_cpo?: boolean | null
          listing_url?: string | null
          location?: string | null
          make?: string | null
          mileage?: number | null
          model?: string | null
          price: number
          raw_data?: Json | null
          source: string
          source_type: string
          trim?: string | null
          updated_at?: string | null
          valuation_request_id?: string | null
          vin?: string | null
          year?: number | null
        }
        Update: {
          condition?: string | null
          confidence_score?: number | null
          created_at?: string | null
          dealer_name?: string | null
          features?: Json | null
          id?: string
          incentives?: string | null
          is_cpo?: boolean | null
          listing_url?: string | null
          location?: string | null
          make?: string | null
          mileage?: number | null
          model?: string | null
          price?: number
          raw_data?: Json | null
          source?: string
          source_type?: string
          trim?: string | null
          updated_at?: string | null
          valuation_request_id?: string | null
          vin?: string | null
          year?: number | null
        }
        Relationships: []
      }
      market_context_data: {
        Row: {
          avg_days_on_market: number | null
          created_at: string | null
          id: string
          last_updated: string | null
          make: string
          market_temperature: string | null
          model: string
          price_trend_90d: Json | null
          supply_demand_ratio: number | null
          trim: string | null
          year: number
          zip_code: string
        }
        Insert: {
          avg_days_on_market?: number | null
          created_at?: string | null
          id?: string
          last_updated?: string | null
          make: string
          market_temperature?: string | null
          model: string
          price_trend_90d?: Json | null
          supply_demand_ratio?: number | null
          trim?: string | null
          year: number
          zip_code: string
        }
        Update: {
          avg_days_on_market?: number | null
          created_at?: string | null
          id?: string
          last_updated?: string | null
          make?: string
          market_temperature?: string | null
          model?: string
          price_trend_90d?: Json | null
          supply_demand_ratio?: number | null
          trim?: string | null
          year?: number
          zip_code?: string
        }
        Relationships: []
      }
      market_listings: {
        Row: {
          condition: string | null
          confidence_score: number | null
          cpo: boolean | null
          created_at: string | null
          dealer: string | null
          dealer_name: string | null
          extra: Json | null
          features: Json | null
          fetched_at: string
          id: string
          is_cpo: boolean | null
          listing_date: string | null
          listing_url: string
          location: string | null
          make: string | null
          mileage: number | null
          model: string | null
          notes: string | null
          price: number
          raw_data: Json | null
          source: string
          source_site: string | null
          source_type: string
          trim: string | null
          url: string | null
          valuation_id: string
          valuation_request_id: string | null
          vin: string | null
          year: number | null
          zip_code: string | null
        }
        Insert: {
          condition?: string | null
          confidence_score?: number | null
          cpo?: boolean | null
          created_at?: string | null
          dealer?: string | null
          dealer_name?: string | null
          extra?: Json | null
          features?: Json | null
          fetched_at?: string
          id?: string
          is_cpo?: boolean | null
          listing_date?: string | null
          listing_url?: string
          location?: string | null
          make?: string | null
          mileage?: number | null
          model?: string | null
          notes?: string | null
          price: number
          raw_data?: Json | null
          source: string
          source_site?: string | null
          source_type?: string
          trim?: string | null
          url?: string | null
          valuation_id: string
          valuation_request_id?: string | null
          vin?: string | null
          year?: number | null
          zip_code?: string | null
        }
        Update: {
          condition?: string | null
          confidence_score?: number | null
          cpo?: boolean | null
          created_at?: string | null
          dealer?: string | null
          dealer_name?: string | null
          extra?: Json | null
          features?: Json | null
          fetched_at?: string
          id?: string
          is_cpo?: boolean | null
          listing_date?: string | null
          listing_url?: string
          location?: string | null
          make?: string | null
          mileage?: number | null
          model?: string | null
          notes?: string | null
          price?: number
          raw_data?: Json | null
          source?: string
          source_site?: string | null
          source_type?: string
          trim?: string | null
          url?: string | null
          valuation_id?: string
          valuation_request_id?: string | null
          vin?: string | null
          year?: number | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "market_listings_valuation_id_fkey"
            columns: ["valuation_id"]
            isOneToOne: false
            referencedRelation: "valuations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_listings_valuation_request_id_fkey"
            columns: ["valuation_request_id"]
            isOneToOne: false
            referencedRelation: "valuation_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      model_training_runs: {
        Row: {
          created_at: string | null
          deployed_at: string | null
          deployment_status: string | null
          feature_importance: Json | null
          hyperparameters: Json | null
          id: string
          model_version: string
          test_rmse: number | null
          training_data_size: number
          validation_rmse: number | null
        }
        Insert: {
          created_at?: string | null
          deployed_at?: string | null
          deployment_status?: string | null
          feature_importance?: Json | null
          hyperparameters?: Json | null
          id?: string
          model_version: string
          test_rmse?: number | null
          training_data_size: number
          validation_rmse?: number | null
        }
        Update: {
          created_at?: string | null
          deployed_at?: string | null
          deployment_status?: string | null
          feature_importance?: Json | null
          hyperparameters?: Json | null
          id?: string
          model_version?: string
          test_rmse?: number | null
          training_data_size?: number
          validation_rmse?: number | null
        }
        Relationships: []
      }
      models: {
        Row: {
          created_at: string | null
          id: string
          make_id: string
          model_name: string
          nhtsa_model_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          make_id: string
          model_name: string
          nhtsa_model_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          make_id?: string
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
          {
            foreignKeyName: "fk_make_id"
            columns: ["make_id"]
            isOneToOne: false
            referencedRelation: "makes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_models_make_id"
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
      offer_acceptance_log: {
        Row: {
          accepted_offer_id: string
          accepted_price: number | null
          created_at: string
          id: string
          price_delta: number | null
          time_to_response_hours: number | null
          user_zip_code: string | null
          valuation_price: number | null
        }
        Insert: {
          accepted_offer_id: string
          accepted_price?: number | null
          created_at?: string
          id?: string
          price_delta?: number | null
          time_to_response_hours?: number | null
          user_zip_code?: string | null
          valuation_price?: number | null
        }
        Update: {
          accepted_offer_id?: string
          accepted_price?: number | null
          created_at?: string
          id?: string
          price_delta?: number | null
          time_to_response_hours?: number | null
          user_zip_code?: string | null
          valuation_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "offer_acceptance_log_accepted_offer_id_fkey"
            columns: ["accepted_offer_id"]
            isOneToOne: false
            referencedRelation: "accepted_offers"
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
      partner_submissions: {
        Row: {
          created_at: string | null
          id: string
          partner_id: string | null
          processed: boolean | null
          sale_data: Json | null
          submission_type: string
          vehicle_data: Json
          verification_status: string | null
          vin: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          partner_id?: string | null
          processed?: boolean | null
          sale_data?: Json | null
          submission_type: string
          vehicle_data: Json
          verification_status?: string | null
          vin: string
        }
        Update: {
          created_at?: string | null
          id?: string
          partner_id?: string | null
          processed?: boolean | null
          sale_data?: Json | null
          submission_type?: string
          vehicle_data?: Json
          verification_status?: string | null
          vin?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_submissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "api_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      pdf_audit_logs: {
        Row: {
          created_at: string
          id: string
          tracking_id: string
          user_id: string
          vin: string
        }
        Insert: {
          created_at?: string
          id?: string
          tracking_id: string
          user_id: string
          vin: string
        }
        Update: {
          created_at?: string
          id?: string
          tracking_id?: string
          user_id?: string
          vin?: string
        }
        Relationships: []
      }
      pdf_downloads: {
        Row: {
          created_at: string
          download_count: number | null
          file_size: number | null
          generated_at: string
          id: string
          user_id: string | null
          valuation_id: string | null
          vin: string | null
        }
        Insert: {
          created_at?: string
          download_count?: number | null
          file_size?: number | null
          generated_at?: string
          id?: string
          user_id?: string | null
          valuation_id?: string | null
          vin?: string | null
        }
        Update: {
          created_at?: string
          download_count?: number | null
          file_size?: number | null
          generated_at?: string
          id?: string
          user_id?: string | null
          valuation_id?: string | null
          vin?: string | null
        }
        Relationships: []
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
      qa_reports: {
        Row: {
          avg_confidence_score: number | null
          created_at: string
          duplicate_comps_removed: number | null
          id: string
          missing_data_flags: number | null
          outliers_detected: number | null
          price_variance_coefficient: number | null
          qa_alerts: Json | null
          recommendations: Json | null
          report_date: string
          source_failures: number | null
          total_comps_ingested: number | null
          vehicle_segment: string | null
        }
        Insert: {
          avg_confidence_score?: number | null
          created_at?: string
          duplicate_comps_removed?: number | null
          id?: string
          missing_data_flags?: number | null
          outliers_detected?: number | null
          price_variance_coefficient?: number | null
          qa_alerts?: Json | null
          recommendations?: Json | null
          report_date?: string
          source_failures?: number | null
          total_comps_ingested?: number | null
          vehicle_segment?: string | null
        }
        Update: {
          avg_confidence_score?: number | null
          created_at?: string
          duplicate_comps_removed?: number | null
          id?: string
          missing_data_flags?: number | null
          outliers_detected?: number | null
          price_variance_coefficient?: number | null
          qa_alerts?: Json | null
          recommendations?: Json | null
          report_date?: string
          source_failures?: number | null
          total_comps_ingested?: number | null
          vehicle_segment?: string | null
        }
        Relationships: []
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
      regional_fuel_costs: {
        Row: {
          area_name: string
          cost_per_gallon: number
          created_at: string | null
          fuel_type: string
          id: string
          period: string
          price: number
          product_name: string
          source: string | null
          state_code: string | null
          updated_at: string | null
          zip_code: string
        }
        Insert: {
          area_name: string
          cost_per_gallon: number
          created_at?: string | null
          fuel_type?: string
          id?: string
          period: string
          price: number
          product_name: string
          source?: string | null
          state_code?: string | null
          updated_at?: string | null
          zip_code: string
        }
        Update: {
          area_name?: string
          cost_per_gallon?: number
          created_at?: string | null
          fuel_type?: string
          id?: string
          period?: string
          price?: number
          product_name?: string
          source?: string | null
          state_code?: string | null
          updated_at?: string | null
          zip_code?: string
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
      scraped_listings: {
        Row: {
          created_at: string | null
          id: string
          location: string | null
          mileage: number | null
          platform: string
          price: number | null
          title: string
          updated_at: string | null
          url: string
          vin: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location?: string | null
          mileage?: number | null
          platform: string
          price?: number | null
          title: string
          updated_at?: string | null
          url: string
          vin?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string | null
          mileage?: number | null
          platform?: string
          price?: number | null
          title?: string
          updated_at?: string | null
          url?: string
          vin?: string | null
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
      source_intelligence: {
        Row: {
          access_status: string | null
          avg_response_time: number | null
          base_url: string | null
          comp_quality_score: number | null
          created_at: string
          id: string
          last_successful_fetch: string | null
          pricing_bias: number | null
          restrictions: Json | null
          source_name: string
          source_type: string
          success_rate: number | null
          total_failures: number | null
          total_fetches: number | null
          total_successes: number | null
          typical_comp_count: number | null
          updated_at: string
        }
        Insert: {
          access_status?: string | null
          avg_response_time?: number | null
          base_url?: string | null
          comp_quality_score?: number | null
          created_at?: string
          id?: string
          last_successful_fetch?: string | null
          pricing_bias?: number | null
          restrictions?: Json | null
          source_name: string
          source_type: string
          success_rate?: number | null
          total_failures?: number | null
          total_fetches?: number | null
          total_successes?: number | null
          typical_comp_count?: number | null
          updated_at?: string
        }
        Update: {
          access_status?: string | null
          avg_response_time?: number | null
          base_url?: string | null
          comp_quality_score?: number | null
          created_at?: string
          id?: string
          last_successful_fetch?: string | null
          pricing_bias?: number | null
          restrictions?: Json | null
          source_name?: string
          source_type?: string
          success_rate?: number | null
          total_failures?: number | null
          total_fetches?: number | null
          total_successes?: number | null
          typical_comp_count?: number | null
          updated_at?: string
        }
        Relationships: []
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
      user_valuation_feedback: {
        Row: {
          accuracy_rating: number | null
          actual_sale_price: number | null
          best_offer_received: number | null
          created_at: string | null
          feedback_notes: string | null
          id: string
          sale_date: string | null
          sale_type: string | null
          user_id: string | null
          valuation_request_id: string | null
          would_recommend: boolean | null
        }
        Insert: {
          accuracy_rating?: number | null
          actual_sale_price?: number | null
          best_offer_received?: number | null
          created_at?: string | null
          feedback_notes?: string | null
          id?: string
          sale_date?: string | null
          sale_type?: string | null
          user_id?: string | null
          valuation_request_id?: string | null
          would_recommend?: boolean | null
        }
        Update: {
          accuracy_rating?: number | null
          actual_sale_price?: number | null
          best_offer_received?: number | null
          created_at?: string | null
          feedback_notes?: string | null
          id?: string
          sale_date?: string | null
          sale_type?: string | null
          user_id?: string | null
          valuation_request_id?: string | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_valuation_feedback_valuation_request_id_fkey"
            columns: ["valuation_request_id"]
            isOneToOne: false
            referencedRelation: "valuation_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      valuation_audit_logs: {
        Row: {
          action: string | null
          audit_data: Json | null
          confidence_score: number | null
          created_at: string
          error_message: string | null
          event: string
          execution_time_ms: number | null
          fallback_used: boolean | null
          id: string
          input_data: Json | null
          message: string | null
          metadata: Json | null
          output_data: Json | null
          quality_score: number | null
          raw_data: Json | null
          run_by: string | null
          source: string | null
          sources_used: string[] | null
          valuation_request_id: string
        }
        Insert: {
          action?: string | null
          audit_data?: Json | null
          confidence_score?: number | null
          created_at?: string
          error_message?: string | null
          event: string
          execution_time_ms?: number | null
          fallback_used?: boolean | null
          id?: string
          input_data?: Json | null
          message?: string | null
          metadata?: Json | null
          output_data?: Json | null
          quality_score?: number | null
          raw_data?: Json | null
          run_by?: string | null
          source?: string | null
          sources_used?: string[] | null
          valuation_request_id: string
        }
        Update: {
          action?: string | null
          audit_data?: Json | null
          confidence_score?: number | null
          created_at?: string
          error_message?: string | null
          event?: string
          execution_time_ms?: number | null
          fallback_used?: boolean | null
          id?: string
          input_data?: Json | null
          message?: string | null
          metadata?: Json | null
          output_data?: Json | null
          quality_score?: number | null
          raw_data?: Json | null
          run_by?: string | null
          source?: string | null
          sources_used?: string[] | null
          valuation_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "valuation_audit_logs_valuation_request_id_fkey"
            columns: ["valuation_request_id"]
            isOneToOne: false
            referencedRelation: "valuation_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      valuation_explanations: {
        Row: {
          adjustment_factors: Json
          confidence_breakdown: Json
          created_at: string | null
          explanation_markdown: string
          id: string
          influential_comps: Json
          price_range_explanation: string | null
          source_weights: Json
          valuation_request_id: string | null
        }
        Insert: {
          adjustment_factors?: Json
          confidence_breakdown?: Json
          created_at?: string | null
          explanation_markdown: string
          id?: string
          influential_comps?: Json
          price_range_explanation?: string | null
          source_weights?: Json
          valuation_request_id?: string | null
        }
        Update: {
          adjustment_factors?: Json
          confidence_breakdown?: Json
          created_at?: string | null
          explanation_markdown?: string
          id?: string
          influential_comps?: Json
          price_range_explanation?: string | null
          source_weights?: Json
          valuation_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "valuation_explanations_valuation_request_id_fkey"
            columns: ["valuation_request_id"]
            isOneToOne: false
            referencedRelation: "valuation_requests"
            referencedColumns: ["id"]
          },
        ]
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
      valuation_feedback: {
        Row: {
          confidence_score: number | null
          created_at: string
          estimated_value: number | null
          feedback: string
          id: string
          updated_at: string
          user_id: string | null
          vin: string
          zip_code: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          estimated_value?: number | null
          feedback: string
          id?: string
          updated_at?: string
          user_id?: string | null
          vin: string
          zip_code: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          estimated_value?: number | null
          feedback?: string
          id?: string
          updated_at?: string
          user_id?: string | null
          vin?: string
          zip_code?: string
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
      valuation_qa_reviews: {
        Row: {
          approved: boolean | null
          created_at: string | null
          id: string
          manual_override_estimate: number | null
          original_estimate: number
          override_reason: string | null
          qa_notes: string | null
          quality_score: number | null
          reviewer_id: string | null
          valuation_request_id: string | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          id?: string
          manual_override_estimate?: number | null
          original_estimate: number
          override_reason?: string | null
          qa_notes?: string | null
          quality_score?: number | null
          reviewer_id?: string | null
          valuation_request_id?: string | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          id?: string
          manual_override_estimate?: number | null
          original_estimate?: number
          override_reason?: string | null
          qa_notes?: string | null
          quality_score?: number | null
          reviewer_id?: string | null
          valuation_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "valuation_qa_reviews_valuation_request_id_fkey"
            columns: ["valuation_request_id"]
            isOneToOne: false
            referencedRelation: "valuation_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      valuation_requests: {
        Row: {
          comp_count: number | null
          condition: string | null
          confidence_score: number | null
          created_at: string
          engine_response: Json | null
          features: Json | null
          final_value: number | null
          id: string
          make: string
          meta: Json | null
          mileage: number | null
          model: string
          request_params: Json | null
          request_source: string | null
          requested_by: string | null
          status: string
          trim: string | null
          updated_at: string
          user_id: string | null
          vin: string | null
          year: number
          zip_code: string | null
        }
        Insert: {
          comp_count?: number | null
          condition?: string | null
          confidence_score?: number | null
          created_at?: string
          engine_response?: Json | null
          features?: Json | null
          final_value?: number | null
          id?: string
          make: string
          meta?: Json | null
          mileage?: number | null
          model: string
          request_params?: Json | null
          request_source?: string | null
          requested_by?: string | null
          status?: string
          trim?: string | null
          updated_at?: string
          user_id?: string | null
          vin?: string | null
          year: number
          zip_code?: string | null
        }
        Update: {
          comp_count?: number | null
          condition?: string | null
          confidence_score?: number | null
          created_at?: string
          engine_response?: Json | null
          features?: Json | null
          final_value?: number | null
          id?: string
          make?: string
          meta?: Json | null
          mileage?: number | null
          model?: string
          request_params?: Json | null
          request_source?: string | null
          requested_by?: string | null
          status?: string
          trim?: string | null
          updated_at?: string
          user_id?: string | null
          vin?: string | null
          year?: number
          zip_code?: string | null
        }
        Relationships: []
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
      valuation_results: {
        Row: {
          adjustments: Json | null
          condition: string | null
          confidence_score: number | null
          created_at: string | null
          estimated_value: number
          id: string
          make: string
          mileage: number | null
          model: string
          price_range_high: number | null
          price_range_low: number | null
          updated_at: string | null
          user_id: string | null
          valuation_type: string | null
          vehicle_data: Json | null
          vin: string | null
          year: number
          zip_code: string | null
        }
        Insert: {
          adjustments?: Json | null
          condition?: string | null
          confidence_score?: number | null
          created_at?: string | null
          estimated_value: number
          id?: string
          make: string
          mileage?: number | null
          model: string
          price_range_high?: number | null
          price_range_low?: number | null
          updated_at?: string | null
          user_id?: string | null
          valuation_type?: string | null
          vehicle_data?: Json | null
          vin?: string | null
          year: number
          zip_code?: string | null
        }
        Update: {
          adjustments?: Json | null
          condition?: string | null
          confidence_score?: number | null
          created_at?: string | null
          estimated_value?: number
          id?: string
          make?: string
          mileage?: number | null
          model?: string
          price_range_high?: number | null
          price_range_low?: number | null
          updated_at?: string | null
          user_id?: string | null
          valuation_type?: string | null
          vehicle_data?: Json | null
          vin?: string | null
          year?: number
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
          adjustments: Json | null
          auction_avg_price: number | null
          base_price: number | null
          body_style: string | null
          body_type: string | null
          color: string | null
          condition: string | null
          condition_score: number | null
          confidence_score: number | null
          created_at: string
          data_source: Json | null
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
          price_range_high: number | null
          price_range_low: number | null
          sale_date: string | null
          seasonal_multiplier: number | null
          state: string | null
          transmission: string | null
          updated_at: string | null
          user_id: string | null
          valuation_notes: Json | null
          valuation_type: string | null
          vehicle_data: Json | null
          vin: string | null
          warranty_status: string | null
          year: number | null
          zip_code: string | null
          zip_demand_factor: number | null
        }
        Insert: {
          accident_count?: number | null
          adjustments?: Json | null
          auction_avg_price?: number | null
          base_price?: number | null
          body_style?: string | null
          body_type?: string | null
          color?: string | null
          condition?: string | null
          condition_score?: number | null
          confidence_score?: number | null
          created_at?: string
          data_source?: Json | null
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
          price_range_high?: number | null
          price_range_low?: number | null
          sale_date?: string | null
          seasonal_multiplier?: number | null
          state?: string | null
          transmission?: string | null
          updated_at?: string | null
          user_id?: string | null
          valuation_notes?: Json | null
          valuation_type?: string | null
          vehicle_data?: Json | null
          vin?: string | null
          warranty_status?: string | null
          year?: number | null
          zip_code?: string | null
          zip_demand_factor?: number | null
        }
        Update: {
          accident_count?: number | null
          adjustments?: Json | null
          auction_avg_price?: number | null
          base_price?: number | null
          body_style?: string | null
          body_type?: string | null
          color?: string | null
          condition?: string | null
          condition_score?: number | null
          confidence_score?: number | null
          created_at?: string
          data_source?: Json | null
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
          price_range_high?: number | null
          price_range_low?: number | null
          sale_date?: string | null
          seasonal_multiplier?: number | null
          state?: string | null
          transmission?: string | null
          updated_at?: string | null
          user_id?: string | null
          valuation_notes?: Json | null
          valuation_type?: string | null
          vehicle_data?: Json | null
          vin?: string | null
          warranty_status?: string | null
          year?: number | null
          zip_code?: string | null
          zip_demand_factor?: number | null
        }
        Relationships: []
      }
      vehicle_comparisons: {
        Row: {
          confidence_score: number | null
          cpo_status: boolean | null
          created_at: string
          dealer_name: string | null
          explanation: string
          fetch_timestamp: string
          id: string
          incentives: string | null
          is_verified: boolean | null
          listing_date: string | null
          listing_url: string
          location: string | null
          make: string
          mileage: number | null
          model: string
          price: number
          quality_flags: Json | null
          screenshot_url: string | null
          source_name: string
          source_type: string
          task_id: string | null
          trim: string | null
          vehicle_condition: string | null
          vin: string | null
          year: number
          zip_code: string | null
        }
        Insert: {
          confidence_score?: number | null
          cpo_status?: boolean | null
          created_at?: string
          dealer_name?: string | null
          explanation: string
          fetch_timestamp?: string
          id?: string
          incentives?: string | null
          is_verified?: boolean | null
          listing_date?: string | null
          listing_url: string
          location?: string | null
          make: string
          mileage?: number | null
          model: string
          price: number
          quality_flags?: Json | null
          screenshot_url?: string | null
          source_name: string
          source_type: string
          task_id?: string | null
          trim?: string | null
          vehicle_condition?: string | null
          vin?: string | null
          year: number
          zip_code?: string | null
        }
        Update: {
          confidence_score?: number | null
          cpo_status?: boolean | null
          created_at?: string
          dealer_name?: string | null
          explanation?: string
          fetch_timestamp?: string
          id?: string
          incentives?: string | null
          is_verified?: boolean | null
          listing_date?: string | null
          listing_url?: string
          location?: string | null
          make?: string
          mileage?: number | null
          model?: string
          price?: number
          quality_flags?: Json | null
          screenshot_url?: string | null
          source_name?: string
          source_type?: string
          task_id?: string | null
          trim?: string | null
          vehicle_condition?: string | null
          vin?: string | null
          year?: number
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_comparisons_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "data_fetch_tasks"
            referencedColumns: ["id"]
          },
        ]
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
      vin_enrichment_data: {
        Row: {
          build_data: Json | null
          created_at: string | null
          decoded_data: Json
          enrichment_score: number | null
          features_detected: Json | null
          id: string
          last_enriched_at: string | null
          source: string
          vin: string
        }
        Insert: {
          build_data?: Json | null
          created_at?: string | null
          decoded_data?: Json
          enrichment_score?: number | null
          features_detected?: Json | null
          id?: string
          last_enriched_at?: string | null
          source: string
          vin: string
        }
        Update: {
          build_data?: Json | null
          created_at?: string | null
          decoded_data?: Json
          enrichment_score?: number | null
          features_detected?: Json | null
          id?: string
          last_enriched_at?: string | null
          source?: string
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
      vin_forecasts: {
        Row: {
          confidence: number
          created_at: string
          expires_at: string
          forecast_trend: string
          id: string
          market_factors: Json | null
          predicted_delta: number
          reasoning: string | null
          timeframe_days: number
          updated_at: string
          vin: string
        }
        Insert: {
          confidence: number
          created_at?: string
          expires_at?: string
          forecast_trend: string
          id?: string
          market_factors?: Json | null
          predicted_delta: number
          reasoning?: string | null
          timeframe_days?: number
          updated_at?: string
          vin: string
        }
        Update: {
          confidence?: number
          created_at?: string
          expires_at?: string
          forecast_trend?: string
          id?: string
          market_factors?: Json | null
          predicted_delta?: number
          reasoning?: string | null
          timeframe_days?: number
          updated_at?: string
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
      cleanup_expired_forecasts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_referral_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_adjustment_breakdown_heatmap: {
        Args: Record<PropertyKey, never>
        Returns: {
          zip_code: string
          fuel_type: string
          condition: string
          average_condition_adj: number
          average_fuel_adj: number
          average_mileage_adj: number
          average_market_adj: number
          final_value_avg: number
          sample_count: number
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_records_needing_vin_enrichment: {
        Args: { batch_limit?: number; force_reprocess?: boolean }
        Returns: {
          id: string
          vin: string
          make: string
          model: string
          year: number
          trim_level: string
          table_name: string
        }[]
      }
      get_trims_by_make_model_year: {
        Args: { input_make: string; input_model: string; input_year: number }
        Returns: {
          id: string
          trim_name: string
          engine_type: string
          transmission: string
          fuel_type: string
          msrp: number
          image_url: string
        }[]
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
    Enums: {
      user_role: ["user", "dealer"],
    },
  },
} as const
