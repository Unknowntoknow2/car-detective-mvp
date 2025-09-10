-- Migration: Update vehicle_profiles view to include IIHS ratings
-- File: 20250808224002_update_vehicle_profiles_iihs.sql
-- Purpose: Integrate IIHS safety ratings into vehicle profile aggregation

-- Drop existing vehicle_profiles materialized view
DROP MATERIALIZED VIEW IF EXISTS vehicle_profiles;

-- Recreate vehicle_profiles as materialized view with IIHS integration
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
    
    -- Profile completeness score
    ROUND(
        (CASE WHEN vs.vin IS NOT NULL THEN 10 ELSE 0 END +
         CASE WHEN vs.year IS NOT NULL THEN 10 ELSE 0 END +
         CASE WHEN vs.make IS NOT NULL THEN 10 ELSE 0 END +
         CASE WHEN vs.model IS NOT NULL THEN 10 ELSE 0 END +
         CASE WHEN sr.overall_rating IS NOT NULL THEN 20 ELSE 0 END +
         CASE WHEN ir.top_safety_pick IS NOT NULL OR ir.top_safety_pick_plus IS NOT NULL THEN 20 ELSE 0 END +
         CASE WHEN recall_stats.total_recalls IS NOT NULL THEN 10 ELSE 0 END +
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
COMMENT ON MATERIALIZED VIEW vehicle_profiles IS 'Comprehensive vehicle profiles with NHTSA safety ratings, IIHS awards, and recall data';

-- Create unique index on the materialized view for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_vehicle_profiles_vin 
ON vehicle_profiles (vin);

-- Create additional indexes for common queries
CREATE INDEX IF NOT EXISTS idx_vehicle_profiles_make_model_year 
ON vehicle_profiles (make, model, model_year);

CREATE INDEX IF NOT EXISTS idx_vehicle_profiles_safety_score 
ON vehicle_profiles (computed_safety_score DESC) WHERE computed_safety_score IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_vehicle_profiles_iihs_awards 
ON vehicle_profiles (iihs_top_safety_pick_plus, iihs_top_safety_pick);

-- Refresh the materialized view
REFRESH MATERIALIZED VIEW vehicle_profiles;

-- Create function to get IIHS details for a specific vehicle
CREATE OR REPLACE FUNCTION get_iihs_details(
    p_year INTEGER,
    p_make TEXT,
    p_model TEXT,
    p_trim TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'found', true,
        'program', ir.program,
        'model_year', ir.model_year,
        'make', ir.make,
        'model', ir.model,
        'trim', ir.trim,
        'crashworthiness', ir.crashworthiness,
        'crash_prevention', ir.crash_prevention,
        'headlights', ir.headlights,
        'top_safety_pick', ir.top_safety_pick,
        'top_safety_pick_plus', ir.top_safety_pick_plus,
        'award_level', CASE 
            WHEN ir.top_safety_pick_plus THEN 'TOP_SAFETY_PICK_PLUS'
            WHEN ir.top_safety_pick THEN 'TOP_SAFETY_PICK'
            ELSE 'NONE'
        END,
        'fetched_at', ir.fetched_at,
        'source', ir.source,
        'data_age_days', EXTRACT(DAY FROM (NOW() - ir.fetched_at))
    )
    INTO v_result
    FROM iihs_ratings ir
    WHERE ir.model_year = p_year
      AND UPPER(ir.make) = UPPER(p_make)
      AND UPPER(ir.model) = UPPER(p_model)
      AND (p_trim IS NULL OR ir.trim IS NULL OR UPPER(ir.trim) = UPPER(p_trim))
    ORDER BY 
        CASE WHEN ir.trim IS NOT NULL AND p_trim IS NOT NULL THEN 0 ELSE 1 END,
        ir.updated_at DESC
    LIMIT 1;

    IF v_result IS NULL THEN
        v_result := jsonb_build_object(
            'found', false,
            'message', 'No IIHS rating found for this vehicle',
            'search_criteria', jsonb_build_object(
                'model_year', p_year,
                'make', p_make,
                'model', p_model,
                'trim', p_trim
            )
        );
    END IF;

    RETURN v_result;
END;
$$;

-- Add comment to function
COMMENT ON FUNCTION get_iihs_details(INTEGER, TEXT, TEXT, TEXT) IS 'Get detailed IIHS rating information for a specific vehicle';
