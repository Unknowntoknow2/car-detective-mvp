-- Migration: Add safety feature counts to vehicle_profiles materialized view
-- Created: 2025-08-08
-- Purpose: Enhance existing materialized view with safety equipment feature counts

-- Drop and recreate the materialized view with safety feature counts
DROP MATERIALIZED VIEW IF EXISTS vehicle_profiles CASCADE;

CREATE MATERIALIZED VIEW vehicle_profiles AS
WITH safety_counts AS (
    SELECT 
        vs.vin,
        COALESCE(
            (SELECT COUNT(*)::integer 
             FROM jsonb_each_text(vs.safety_equipment) 
             WHERE value::boolean = true), 0
        ) AS safety_feature_count,
        COALESCE(
            (SELECT COUNT(*)::integer 
             FROM jsonb_each_text(vs.airbags) 
             WHERE value::boolean = true), 0  
        ) AS airbag_coverage_count,
        COALESCE(
            (SELECT COUNT(*)::integer 
             FROM jsonb_each_text(vs.lighting) 
             WHERE value::boolean = true), 0
        ) AS lighting_feature_count
    FROM vehicle_specs vs
)
SELECT DISTINCT
    vs.vin,
    vs.make,
    vs.model,
    vs.year,
    vs.trim,
    vs.body_class,
    vs.engine_cylinders,
    vs.displacement_cc,
    vs.fuel_type_primary,
    vs.drive_type,
    vs.transmission_style,
    vs.manufacturer,
    vs.doors,
    vs.gvwr,
    -- Safety ratings (placeholder values for compatibility)
    0 as safety_overall,
    0 as safety_frontal,
    0 as safety_side,
    0 as safety_rollover,
    -- Fuel economy (placeholder values for compatibility)
    0.0 as city_mpg,
    0.0 as highway_mpg,
    0.0 as combined_mpg,
    0.0 as annual_fuel_cost,
    0.0 as co2_emissions,
    -- Recalls (count from existing table)
    COALESCE(recalls.active_recalls, 0) as active_recalls,
    -- Market data (placeholder values for compatibility)
    NULL::numeric as avg_listing_price,
    NULL::numeric as min_listing_price,
    NULL::numeric as max_listing_price,
    0 as listing_count,
    NULL::numeric as market_avg_mileage,
    -- User data (placeholder values for compatibility)
    NULL::integer as user_mileage,
    NULL::varchar(20) as user_condition,
    NULL::varchar(10) as user_location,
    NULL::varchar(50) as exterior_color,
    NULL::varchar(50) as interior_color,
    NULL::varchar(30) as title_status,
    -- Valuation data (placeholder values for compatibility)
    NULL::numeric(10,2) as last_valuation,
    NULL::numeric(5,2) as last_confidence,
    NULL::numeric(10,2) as price_range_low,
    NULL::numeric(10,2) as price_range_high,
    NULL::timestamptz as last_valuation_date,
    -- Timeline
    vs.created_at as first_seen,
    vs.updated_at as last_updated,
    -- NEW: Safety equipment feature counts
    sc.safety_feature_count,
    sc.airbag_coverage_count,
    sc.lighting_feature_count,
    -- NEW: Combined safety score (safety + airbag features)
    (sc.safety_feature_count + sc.airbag_coverage_count) AS total_safety_score
FROM vehicle_specs vs
LEFT JOIN (
    SELECT vin, COUNT(*) as active_recalls
    FROM nhtsa_recalls
    WHERE remedy_status = 'Open'
    GROUP BY vin
) recalls ON vs.vin = recalls.vin
LEFT JOIN safety_counts sc ON vs.vin = sc.vin;

-- Recreate indexes for performance
CREATE UNIQUE INDEX idx_vehicle_profiles_vin ON vehicle_profiles (vin);
CREATE INDEX idx_vehicle_profiles_make_model_year ON vehicle_profiles (make, model, year);
CREATE INDEX idx_vehicle_profiles_last_valuation ON vehicle_profiles (last_valuation_date);

-- NEW: Indexes for safety feature queries
CREATE INDEX idx_vehicle_profiles_safety_score ON vehicle_profiles (total_safety_score);
CREATE INDEX idx_vehicle_profiles_safety_features ON vehicle_profiles (safety_feature_count);
CREATE INDEX idx_vehicle_profiles_airbag_coverage ON vehicle_profiles (airbag_coverage_count);

-- Add comment to the materialized view
COMMENT ON MATERIALIZED VIEW vehicle_profiles IS 
'Enhanced vehicle profiles materialized view with safety equipment feature counts.
Includes safety_feature_count, airbag_coverage_count, lighting_feature_count, and total_safety_score
for comprehensive vehicle valuation and analytics. Refresh periodically for updated market data.';

-- Grant permissions
GRANT SELECT ON vehicle_profiles TO anon;
GRANT SELECT ON vehicle_profiles TO authenticated;

-- Initial refresh to populate data
REFRESH MATERIALIZED VIEW vehicle_profiles;
