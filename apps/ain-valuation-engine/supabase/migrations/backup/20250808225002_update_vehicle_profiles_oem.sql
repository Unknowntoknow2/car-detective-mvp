-- Migration: Update vehicle_profiles view to include OEM features
-- File: 20250808225002_update_vehicle_profiles_oem.sql
-- Purpose: Integrate OEM features into vehicle profile aggregation

-- Drop existing vehicle_profiles materialized view
DROP MATERIALIZED VIEW IF EXISTS vehicle_profiles;

-- Recreate vehicle_profiles as materialized view with OEM features integration
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
    -- Core vehicle identification
    vs.vin,
    vs.make,
    vs.model,
    vs.year as model_year,
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
    vs.created_at,
    vs.updated_at,
    
    -- Safety feature counts
    sc.safety_feature_count,
    sc.airbag_coverage_count,
    sc.lighting_feature_count,
    
    -- Safety ratings (NHTSA + IIHS)
    COALESCE(sr.overall_rating, 0) as nhtsa_overall_rating,
    sr.frontal_crash_rating as nhtsa_frontal_rating,
    sr.side_crash_rating as nhtsa_side_rating,
    sr.rollover_rating as nhtsa_rollover_rating,
    sr.model_year as nhtsa_model_year,
    sr.vehicle_description as nhtsa_vehicle_description,
    sr.overall_frontal_rating as nhtsa_overall_frontal_rating,
    sr.nhtsa_id,
    sr.created_at as nhtsa_created_at,
    sr.updated_at as nhtsa_updated_at,
    
    -- IIHS ratings and awards
    ir.crashworthiness as iihs_crashworthiness,
    ir.crash_prevention as iihs_crash_prevention,
    ir.headlights as iihs_headlights,
    ir.top_safety_pick as iihs_top_safety_pick,
    ir.top_safety_pick_plus as iihs_top_safety_pick_plus,
    ir.raw_payload as iihs_raw_payload,
    ir.fetched_at as iihs_fetched_at,
    
    -- OEM features and packages
    oef.features as oem_features,
    oef.feature_count as oem_feature_count,
    oef.packages as oem_packages,
    oef.confidence_score as oem_confidence_score,
    oef.fetched_at as oem_fetched_at,
    oef.source as oem_source,
    
    -- Computed safety score (weighted combination of NHTSA + IIHS)
    CASE 
        WHEN sr.overall_rating IS NOT NULL AND ir.top_safety_pick_plus IS NOT NULL THEN
            ROUND(
                (COALESCE(sr.overall_rating, 0) * 0.6) + 
                (CASE 
                    WHEN ir.top_safety_pick_plus THEN 5.0
                    WHEN ir.top_safety_pick THEN 4.5
                    ELSE 3.0
                END * 0.4), 1
            )
        WHEN sr.overall_rating IS NOT NULL THEN sr.overall_rating
        WHEN ir.top_safety_pick_plus THEN 5.0
        WHEN ir.top_safety_pick THEN 4.5
        ELSE NULL
    END as computed_safety_score,
    
    -- Computed feature richness score
    CASE 
        WHEN oef.feature_count IS NOT NULL THEN
            ROUND(
                LEAST(
                    (COALESCE(oef.feature_count, 0) * 0.1) + 
                    (COALESCE(sc.safety_feature_count, 0) * 0.2) +
                    (CASE WHEN oef.packages IS NOT NULL THEN 1.0 ELSE 0.0 END), 
                    10.0
                ), 1
            )
        ELSE NULL
    END as feature_richness_score,
    
    -- Fuel economy data
    fe.city_mpg,
    fe.highway_mpg,
    fe.combined_mpg,
    fe.fuel_type as fuel_economy_type,
    fe.annual_fuel_cost,
    
    -- Recalls count and severity
    COALESCE(recall_stats.total_recalls, 0) as total_recalls,
    COALESCE(recall_stats.safety_recalls, 0) as safety_recalls,
    COALESCE(recall_stats.non_safety_recalls, 0) as non_safety_recalls,
    recall_stats.most_recent_recall_date,
    recall_stats.highest_severity,
    
    -- Data freshness indicators
    CASE 
        WHEN sr.created_at IS NOT NULL AND sr.created_at > (NOW() - INTERVAL '90 days') THEN true
        ELSE false
    END as nhtsa_data_fresh,
    
    CASE 
        WHEN ir.fetched_at IS NOT NULL AND ir.fetched_at > (NOW() - INTERVAL '90 days') THEN true
        ELSE false
    END as iihs_data_fresh,
    
    CASE 
        WHEN oef.fetched_at IS NOT NULL AND oef.fetched_at > (NOW() - INTERVAL '90 days') THEN true
        ELSE false
    END as oem_data_fresh,
    
    -- Profile completeness score (enhanced with OEM data)
    ROUND(
        (CASE WHEN vs.vin IS NOT NULL THEN 8 ELSE 0 END +
         CASE WHEN vs.year IS NOT NULL THEN 8 ELSE 0 END +
         CASE WHEN vs.make IS NOT NULL THEN 8 ELSE 0 END +
         CASE WHEN vs.model IS NOT NULL THEN 8 ELSE 0 END +
         CASE WHEN sr.overall_rating IS NOT NULL THEN 15 ELSE 0 END +
         CASE WHEN ir.top_safety_pick IS NOT NULL OR ir.top_safety_pick_plus IS NOT NULL THEN 15 ELSE 0 END +
         CASE WHEN oef.feature_count IS NOT NULL AND oef.feature_count > 0 THEN 20 ELSE 0 END +
         CASE WHEN recall_stats.total_recalls IS NOT NULL THEN 8 ELSE 0 END +
         CASE WHEN fe.combined_mpg IS NOT NULL AND fe.combined_mpg > 0 THEN 10 ELSE 0 END
        ), 0
    ) as profile_completeness_score

FROM vehicle_specs vs
LEFT JOIN safety_counts sc ON sc.vin = vs.vin
LEFT JOIN nhtsa_safety_ratings sr ON sr.vin = vs.vin
LEFT JOIN iihs_ratings ir ON (
    ir.model_year = vs.year 
    AND UPPER(ir.make) = UPPER(vs.make) 
    AND UPPER(ir.model) = UPPER(vs.model)
    AND (ir.trim IS NULL OR UPPER(ir.trim) = UPPER(COALESCE(vs.trim, '')))
)
LEFT JOIN oem_features oef ON (
    oef.model_year = vs.year 
    AND UPPER(oef.make) = UPPER(vs.make) 
    AND UPPER(oef.model) = UPPER(vs.model)
    AND (oef.trim IS NULL OR UPPER(oef.trim) = UPPER(COALESCE(vs.trim, '')))
    AND (oef.vin IS NULL OR oef.vin = vs.vin)
)
LEFT JOIN fuel_economy fe ON fe.vin = vs.vin
LEFT JOIN (
    SELECT 
        vin,
        COUNT(*) as total_recalls,
        COUNT(*) FILTER (WHERE component ILIKE '%safety%' OR consequence ILIKE '%crash%' OR consequence ILIKE '%injury%') as safety_recalls,
        COUNT(*) FILTER (WHERE component NOT ILIKE '%safety%' AND consequence NOT ILIKE '%crash%' AND consequence NOT ILIKE '%injury%') as non_safety_recalls,
        MAX(report_date) as most_recent_recall_date,
        MAX(consequence) as highest_severity
    FROM nhtsa_recalls 
    GROUP BY vin
) recall_stats ON recall_stats.vin = vs.vin;

-- Add comment to updated materialized view
COMMENT ON MATERIALIZED VIEW vehicle_profiles IS 'Comprehensive vehicle profiles with NHTSA safety ratings, IIHS awards, OEM features, and recall data';

-- Create unique index on the materialized view for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_vehicle_profiles_vin 
ON vehicle_profiles (vin);

-- Create additional indexes for common queries
CREATE INDEX IF NOT EXISTS idx_vehicle_profiles_make_model_year 
ON vehicle_profiles (make, model, model_year);

CREATE INDEX IF NOT EXISTS idx_vehicle_profiles_safety_score 
ON vehicle_profiles (computed_safety_score DESC) WHERE computed_safety_score IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_vehicle_profiles_feature_score 
ON vehicle_profiles (feature_richness_score DESC) WHERE feature_richness_score IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_vehicle_profiles_iihs_awards 
ON vehicle_profiles (iihs_top_safety_pick_plus, iihs_top_safety_pick);

CREATE INDEX IF NOT EXISTS idx_vehicle_profiles_oem_feature_count 
ON vehicle_profiles (oem_feature_count DESC) WHERE oem_feature_count IS NOT NULL;

-- Refresh the materialized view
REFRESH MATERIALIZED VIEW vehicle_profiles;

-- Create function to refresh vehicle profiles
CREATE OR REPLACE FUNCTION refresh_vehicle_profiles()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW vehicle_profiles;
END;
$$;

-- Add comment to refresh function
COMMENT ON FUNCTION refresh_vehicle_profiles() IS 'Manually refresh the vehicle_profiles materialized view';

-- Create function to get comprehensive vehicle profile
CREATE OR REPLACE FUNCTION get_vehicle_profile_comprehensive(p_vin VARCHAR(17))
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'vehicle_identification', jsonb_build_object(
            'vin', vp.vin,
            'make', vp.make,
            'model', vp.model,
            'model_year', vp.model_year,
            'trim', vp.trim,
            'body_class', vp.body_class,
            'manufacturer', vp.manufacturer
        ),
        'powertrain', jsonb_build_object(
            'engine_cylinders', vp.engine_cylinders,
            'displacement_cc', vp.displacement_cc,
            'fuel_type_primary', vp.fuel_type_primary,
            'drive_type', vp.drive_type,
            'transmission_style', vp.transmission_style
        ),
        'safety_ratings', jsonb_build_object(
            'nhtsa', jsonb_build_object(
                'overall_rating', vp.nhtsa_overall_rating,
                'frontal_rating', vp.nhtsa_frontal_rating,
                'side_rating', vp.nhtsa_side_rating,
                'rollover_rating', vp.nhtsa_rollover_rating,
                'data_fresh', vp.nhtsa_data_fresh
            ),
            'iihs', jsonb_build_object(
                'crashworthiness', vp.iihs_crashworthiness,
                'crash_prevention', vp.iihs_crash_prevention,
                'headlights', vp.iihs_headlights,
                'top_safety_pick', vp.iihs_top_safety_pick,
                'top_safety_pick_plus', vp.iihs_top_safety_pick_plus,
                'data_fresh', vp.iihs_data_fresh
            ),
            'computed_safety_score', vp.computed_safety_score
        ),
        'oem_features', jsonb_build_object(
            'features', vp.oem_features,
            'feature_count', vp.oem_feature_count,
            'packages', vp.oem_packages,
            'confidence_score', vp.oem_confidence_score,
            'data_fresh', vp.oem_data_fresh,
            'source', vp.oem_source
        ),
        'fuel_economy', jsonb_build_object(
            'city_mpg', vp.city_mpg,
            'highway_mpg', vp.highway_mpg,
            'combined_mpg', vp.combined_mpg,
            'annual_fuel_cost', vp.annual_fuel_cost
        ),
        'recalls', jsonb_build_object(
            'total_recalls', vp.total_recalls,
            'safety_recalls', vp.safety_recalls,
            'most_recent_date', vp.most_recent_recall_date
        ),
        'profile_metrics', jsonb_build_object(
            'completeness_score', vp.profile_completeness_score,
            'feature_richness_score', vp.feature_richness_score,
            'safety_feature_count', vp.safety_feature_count,
            'airbag_coverage_count', vp.airbag_coverage_count
        )
    )
    INTO v_result
    FROM vehicle_profiles vp
    WHERE vp.vin = p_vin;

    IF v_result IS NULL THEN
        v_result := jsonb_build_object(
            'found', false,
            'message', 'Vehicle profile not found',
            'vin', p_vin
        );
    ELSE
        v_result := jsonb_build_object('found', true) || v_result;
    END IF;

    RETURN v_result;
END;
$$;

-- Add comment to comprehensive profile function
COMMENT ON FUNCTION get_vehicle_profile_comprehensive(VARCHAR(17)) IS 'Get comprehensive vehicle profile with all integrated data sources';
