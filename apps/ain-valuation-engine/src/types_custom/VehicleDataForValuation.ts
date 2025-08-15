/**
 * @interface VehicleDataForValuation
 * @description Comprehensive data model for vehicle valuation with video integration,
 * capturing all relevant attributes with verification status and source.
 * Designed for high-accuracy, market-anchored valuations with AI-driven condition analysis.
 *
 * @version 2.0 - Now includes video-based condition assessment
 * @author AIN Valuation Engine Team
 * @date 2025-08-05
 */
interface VehicleDataForValuation {
  // 1. Core Vehicle Identity (From VIN or Manual Entry)
  vin: { value: string; verified: boolean; source_origin: string; };
  make: { value: string; verified: boolean; source_origin: string; };
  model: { value: string; verified: boolean; source_origin: string; };
  year: { value: number; verified: boolean; source_origin: string; };
  mileage: { value: number; verified: boolean; source_origin: string; }; // Explicit top-level mileage field
  trim_submodel?: { value: string; verified: boolean; source_origin: string; }; // e.g., XLE, SE, TRD
  body_style?: { value: string; verified: boolean; source_origin: string; }; // e.g., Sedan, SUV, Hatchback
  drive_type?: { value: 'FWD' | 'AWD' | 'RWD'; verified: boolean; source_origin: string; };
  engine_size_type?: { value: string; verified: boolean; source_origin: string; }; // e.g., "2.5L I4", "3.5L V6", "Electric"
  transmission?: { value: 'Automatic' | 'Manual' | 'CVT'; verified: boolean; source_origin: string; };
  fuel_type?: { value: 'Gasoline' | 'Diesel' | 'Hybrid' | 'Electric'; verified: boolean; source_origin: string; };
  msrp?: { value: number; verified: boolean; source_origin: string; }; // Manufacturer's Suggested Retail Price

  // 2. Condition & Physical State (Follow-up Form + AI + VIDEO)
  overall_condition_rating: { value: 'Excellent' | 'Good' | 'Fair' | 'Poor'; verified: boolean; source_origin: string; };
  exterior_damage?: { value: string[]; verified: boolean; source_origin: string; }; // e.g., ["dent_front_left_fender", "scratch_rear_bumper"]
  interior_wear?: { value: string[]; verified: boolean; source_origin: string; }; // e.g., ["rip_driver_seat", "stain_rear_carpet"]
  mechanical_issues?: { value: string[]; verified: boolean; source_origin: string; }; // e.g., ["check_engine_light", "transmission_noise"]
  tires_brakes_condition?: { value: 'New' | 'Good' | 'Fair' | 'Worn'; verified: boolean; source_origin: string; };
  cleanliness_odor?: { value: 'Clean' | 'Minor_Odor' | 'Smoke_Odor' | 'Pet_Odor'; verified: boolean; source_origin: string; };
  photo_ai_score?: { value: number; verified: boolean; source_origin: string; }; // AI-based score from uploaded photos (0-100)

  // 3. Vehicle History & Title Status
  accident_history?: { value: string[]; verified: boolean; source_origin: string; }; // e.g., ["minor_front_impact", "airbag_deployed"]
  title_type?: { value: 'Clean' | 'Salvage' | 'Rebuilt' | 'Flood' | 'Lemon'; verified: boolean; source_origin: string; };
  number_of_owners?: { value: number; verified: boolean; source_origin: string; };
  service_history_available?: { value: boolean; verified: boolean; source_origin: string; };
  open_recalls?: { value: string[]; verified: boolean; source_origin: string; }; // List of recall IDs/descriptions
  odometer_accuracy_verified?: { value: boolean; verified: boolean; source_origin: string; }; // True if mileage is verified, false if potential rollback
  registered_state_history?: { value: string[]; verified: boolean; source_origin: string; }; // e.g., ["CA", "NY"]
  inspection_sticker_validity?: { value: boolean; verified: boolean; source_origin: string; }; // State-specific inspection status
  emissions_smog_readiness?: { value: boolean; verified: boolean; source_origin: string; }; // True if ready for emissions test

  // 4. Geographic & Market Context
  zipcode: { value: number; verified: boolean; source_origin: string; };
  nearby_inventory_count?: { value: number; verified: boolean; source_origin: string; }; // Number of similar cars for sale nearby
  market_saturation_level?: { value: 'Low' | 'Medium' | 'High'; verified: boolean; source_origin: string; };
  listing_velocity_days?: { value: number; verified: boolean; source_origin: string; }; // How fast similar cars are selling (avg days on market)
  auction_dealer_density?: { value: number; verified: boolean; source_origin: string; }; // Number of relevant dealers/auctions in area

  // 5. Features, Options & Packages (OEM or Aftermarket)
  features_options?: {
    value: {
      sunroof_moonroof?: boolean;
      navigation_system?: boolean;
      heated_ventilated_seats?: boolean;
      premium_audio_system?: boolean; // e.g., Bose, JBL
      advanced_safety_systems?: boolean; // e.g., Adaptive Cruise, Lane Keep Assist
      leather_seats?: boolean;
      towing_package?: boolean;
      third_row_seating?: boolean;
      remote_start?: boolean;
      keyless_entry?: boolean;
      apple_carplay_android_auto?: boolean;
      // Add more specific features as needed
      [key: string]: boolean | undefined; // Allows for dynamic additional features
    };
    verified: boolean;
    source_origin: string;
  };
  installed_modifications?: { value: string[]; verified: boolean; source_origin: string; }; // e.g., ["lift_kit", "aftermarket_exhaust"]
  extra_accessories?: { value: string[]; verified: boolean; source_origin: string; }; // e.g., ["running_boards", "bed_liner", "roof_rack"]

  // 6. Cosmetic & Aesthetic Factors
  exterior_color?: { value: 'Black' | 'White' | 'Gray' | 'Silver' | 'Blue' | 'Red' | 'Green' | 'Yellow' | 'Orange' | 'Brown' | 'Gold' | 'Purple' | 'Other'; verified: boolean; source_origin: string; }; // Standardized enum
  interior_color?: { value: 'Black' | 'Gray' | 'Beige' | 'Tan' | 'White' | 'Red' | 'Other'; verified: boolean; source_origin: string; }; // Standardized enum

  // 7. Operational Cost Adjustments
  epa_mpg_combined?: { value: number; verified: boolean; source_origin: string; };
  local_gas_prices_usd_per_gallon?: { value: number; verified: boolean; source_origin: string; }; // Average gas price in ZIP

  // 8. Market Behavior & Buyer Psychology (Inferred/Aggregated)
  time_on_market_days?: { value: number; verified: boolean; source_origin: string; }; // From past listings
  buyer_search_volume_index?: { value: number; verified: boolean; source_origin: string; }; // Popularity index
  seasonal_demand_factor?: { value: number; verified: boolean; source_origin: string; }; // e.g., 0.9 for low, 1.1 for high

  // 9. Sales Channel & Intent
  ownership_intent?: { value: 'Sell' | 'Trade-In' | 'Buy'; verified: boolean; source_origin: string; };
  sales_channel?: { value: 'Private' | 'Dealer_Retail' | 'Auction_Wholesale'; verified: boolean; source_origin: string; };
  export_potential?: { value: boolean; verified: boolean; source_origin: string; }; // For rare/collectible vehicles

  // 10. Warranty Status
  factory_warranty_remaining_months?: { value: number; verified: boolean; source_origin: string; };
  extended_warranty_available?: { value: boolean; verified: boolean; source_origin: string; };
  certified_pre_owned?: { value: boolean; verified: boolean; source_origin: string; };

  // 11. Other Dynamic/Edge Factors
  vehicle_recall_status?: { value: 'Open' | 'Closed' | 'None'; verified: boolean; source_origin: string; };
  insurance_total_loss_history?: { value: boolean; verified: boolean; source_origin: string; }; // True if car was ever a total loss
  past_listing_price_trends?: { value: { date: string; price: number; }[]; verified: boolean; source_origin: string; }; // Array of historical prices (date as ISO 8601 string)
  owner_demographics_type?: { value: 'Individual' | 'Fleet' | 'Rental'; verified: boolean; source_origin: string; };
  last_service_date?: { value: string; verified: boolean; source_origin: string; }; // Last known service date (ISO 8601 string)
  battery_health_percentage?: { value: number; verified: boolean; source_origin: string; }; // For EVs, critical to resale value (0-100)
  vin_decode_level?: { value: 'Partial' | 'Full'; verified: boolean; source_origin: string; }; // Level of VIN decode completeness
  market_confidence_score?: { value: number; verified: boolean; source_origin: string; }; // Summary of "how certain we are about this valuation" (0-100)

  // 🎥 12. VIDEO-BASED CONDITION ANALYSIS (NEW!)
  valuation_video?: {
    file_url: string; // S3/CDN URL to video file
    duration_seconds?: number; // Video length for analysis completeness
    uploaded_at: string; // ISO 8601 timestamp
    verified: boolean; // Whether video has been validated/processed
    source_origin: 'UserUpload' | 'DealerSubmission' | 'AppRecorded' | 'ThirdPartyInspection';

    // AI Analysis Results
    ai_analysis_summary?: string; // GPT-generated text summary of video findings
    ai_condition_score?: number; // Overall condition score from video analysis (0-100)

    // Detailed AI Insights
    ai_detected_issues?: {
      exterior_damage: string[]; // e.g., ["front_bumper_scratch", "door_dent_passenger"]
      interior_condition: string[]; // e.g., ["seat_wear_driver", "dashboard_crack"]
      mechanical_sounds: string[]; // e.g., ["engine_knock", "transmission_whine"]
      cleanliness_score: number; // 0-100
      lighting_quality_score: number; // How well-lit the video was (affects accuracy)
    };

    // Video Quality Metrics
    video_quality?: {
      resolution: string; // e.g., "1080p", "720p"
      framerate: number; // FPS
      audio_quality_score: number; // 0-100 (important for mechanical sounds)
      stability_score: number; // 0-100 (shaky video reduces accuracy)
      coverage_completeness: number; // 0-100 (did they show all angles?)
    };

    // Processing Metadata
    processing_status?: 'Pending' | 'Processing' | 'Complete' | 'Failed';
    ai_model_version?: string; // Track which AI model was used
    processing_duration_seconds?: number; // How long AI analysis took
    confidence_intervals?: {
      condition_score_range: [number, number]; // e.g., [75, 85] if AI is 75-85% confident
      detected_issues_confidence: number; // 0-100 overall confidence in detected issues
    };
  };
}

/**
 * @interface VideoAnalysisRequest
 * @description Payload for requesting video analysis of a vehicle
 */
interface VideoAnalysisRequest {
  video_url: string;
  vehicle_vin?: string;
  analysis_priority: 'Standard' | 'Express' | 'Detailed';
  focus_areas?: ('Exterior' | 'Interior' | 'Engine' | 'Undercarriage' | 'Sounds')[];
  callback_webhook_url?: string; // For async processing notifications
}

/**
 * @interface VideoAnalysisResponse
 * @description Response from video analysis service
 */
interface VideoAnalysisResponse {
  analysis_id: string;
  status: 'Success' | 'Failed' | 'Processing';
  processing_time_seconds: number;
  ai_insights: {
    overall_condition_score: number;
    detected_issues: string[];
    summary: string;
    confidence_score: number;
  };
  estimated_value_impact: {
    positive_factors: string[];
    negative_factors: string[];
    estimated_adjustment_percentage: number; // e.g., -5.2 for 5.2% reduction
  };
}

export { VehicleDataForValuation, VideoAnalysisRequest, VideoAnalysisResponse };
