-- Migration: Update vehicle_profiles view to include complaints and investigations
-- File: 20250808225002_update_vehicle_profiles_complaints.sql
-- Purpose: Integrate NHTSA complaints and investigations into vehicle profile aggregation

-- Drop existing vehicle_profiles materialized view
DROP MATERIALIZED VIEW IF EXISTS vehicle_profiles CASCADE;

-- Recreate vehicle_profiles materialized view with complaints and investigations
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
),
complaints_stats AS (
    SELECT 
        model_year, make, model,
        COUNT(*) as total_complaints,
        COUNT(*) FILTER (WHERE severity_level = 'CRITICAL') as critical_complaints,
        COUNT(*) FILTER (WHERE severity_level = 'HIGH') as high_complaints,
        COUNT(*) FILTER (WHERE crash_occurred = true) as crash_complaints,
        COUNT(*) FILTER (WHERE fire_occurred = true) as fire_complaints,
        COUNT(*) FILTER (WHERE injury_occurred = true) as injury_complaints,
        COUNT(*) FILTER (WHERE death_occurred = true) as death_complaints,
        MAX(report_date) as most_recent_complaint_date
    FROM nhtsa_complaints
    GROUP BY model_year, make, model
),
investigations_stats AS (
    SELECT 
        make, model,
        model_year_start, model_year_end,
        COUNT(*) as total_investigations,
        COUNT(*) FILTER (WHERE status = 'OPEN') as open_investigations,
        COUNT(*) FILTER (WHERE investigation_type = 'PE') as preliminary_evaluations,
        COUNT(*) FILTER (WHERE investigation_type = 'EA') as engineering_analyses,
        SUM(potential_units_affected) as total_units_affected,
        MAX(open_date) as most_recent_investigation_date
    FROM nhtsa_investigations
    GROUP BY make, model, model_year_start, model_year_end
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
    
    -- Complaints data
    COALESCE(cs.total_complaints, 0) as total_complaints,
    COALESCE(cs.critical_complaints, 0) as critical_complaints,
    COALESCE(cs.high_complaints, 0) as high_complaints,
    COALESCE(cs.crash_complaints, 0) as crash_complaints,
    COALESCE(cs.fire_complaints, 0) as fire_complaints,
    COALESCE(cs.injury_complaints, 0) as injury_complaints,
    COALESCE(cs.death_complaints, 0) as death_complaints,
    cs.most_recent_complaint_date,
    
    -- Investigations data
    COALESCE(ins.total_investigations, 0) as total_investigations,
    COALESCE(ins.open_investigations, 0) as open_investigations,
    COALESCE(ins.preliminary_evaluations, 0) as preliminary_evaluations,
    COALESCE(ins.engineering_analyses, 0) as engineering_analyses,
    COALESCE(ins.total_units_affected, 0) as total_units_affected,
    ins.most_recent_investigation_date,
    
    -- Computed safety score (weighted: NHTSA 40% + IIHS 30% + Complaints 20% + Investigations 10%)
    CASE 
        WHEN sr.overall_rating IS NOT NULL OR ir.top_safety_pick_plus IS NOT NULL OR cs.total_complaints IS NOT NULL THEN
            ROUND(
                -- NHTSA base score (40%)
                (COALESCE(sr.overall_rating, 3.0) * 0.4) + 
                -- IIHS award bonus (30%)
                (CASE 
                    WHEN ir.top_safety_pick_plus THEN 5.0
                    WHEN ir.top_safety_pick THEN 4.5
                    ELSE 3.0
                END * 0.3) +
                -- Complaints penalty (20%)
                (CASE 
                    WHEN cs.total_complaints IS NULL THEN 3.0
                    WHEN cs.critical_complaints > 0 THEN 1.0
                    WHEN cs.high_complaints > 0 THEN 2.0
                    WHEN cs.total_complaints > 10 THEN 2.5
                    WHEN cs.total_complaints > 0 THEN 3.0
                    ELSE 4.0
                END * 0.2) +
                -- Investigations penalty (10%)
                (CASE 
                    WHEN ins.open_investigations > 0 THEN 1.0
                    WHEN ins.total_investigations > 0 THEN 2.5
                    ELSE 4.0
                END * 0.1), 1
            )
        ELSE NULL
    END as computed_safety_score,
    
    -- Safety risk level classification
    CASE 
        WHEN cs.death_complaints > 0 OR ins.open_investigations > 0 THEN 'HIGH_RISK'
        WHEN cs.critical_complaints > 0 OR cs.injury_complaints > 2 THEN 'MEDIUM_RISK'
        WHEN cs.high_complaints > 5 OR cs.total_complaints > 20 THEN 'ELEVATED_RISK'
        WHEN cs.total_complaints > 0 OR ins.total_investigations > 0 THEN 'LOW_RISK'
        ELSE 'MINIMAL_RISK'
    END as safety_risk_level,
    
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
        WHEN cs.most_recent_complaint_date IS NOT NULL AND cs.most_recent_complaint_date > (NOW() - INTERVAL '365 days') THEN true
        ELSE false
    END as complaints_recent,
    
    CASE 
        WHEN ins.most_recent_investigation_date IS NOT NULL AND ins.most_recent_investigation_date > (NOW() - INTERVAL '365 days') THEN true
        ELSE false
    END as investigations_recent,
    
    -- Profile completeness score (enhanced with complaints/investigations data)
    ROUND(
        (CASE WHEN vs.vin IS NOT NULL THEN 8 ELSE 0 END +
         CASE WHEN vs.year IS NOT NULL THEN 8 ELSE 0 END +
         CASE WHEN vs.make IS NOT NULL THEN 8 ELSE 0 END +
         CASE WHEN vs.model IS NOT NULL THEN 8 ELSE 0 END +
         CASE WHEN sr.overall_rating IS NOT NULL THEN 15 ELSE 0 END +
         CASE WHEN ir.top_safety_pick IS NOT NULL OR ir.top_safety_pick_plus IS NOT NULL THEN 15 ELSE 0 END +
         CASE WHEN recall_stats.total_recalls IS NOT NULL THEN 8 ELSE 0 END +
         CASE WHEN fe.combined_mpg IS NOT NULL AND fe.combined_mpg > 0 THEN 8 ELSE 0 END +
         CASE WHEN cs.total_complaints IS NOT NULL THEN 12 ELSE 0 END +
         CASE WHEN ins.total_investigations IS NOT NULL THEN 10 ELSE 0 END
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
LEFT JOIN complaints_stats cs ON (
    cs.model_year = vs.year 
    AND UPPER(cs.make) = UPPER(vs.make) 
    AND UPPER(cs.model) = UPPER(vs.model)
)
LEFT JOIN investigations_stats ins ON (
    vs.year >= ins.model_year_start 
    AND vs.year <= ins.model_year_end
    AND UPPER(ins.make) = UPPER(vs.make) 
    AND UPPER(ins.model) = UPPER(vs.model)
)
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
COMMENT ON MATERIALIZED VIEW vehicle_profiles IS 'Comprehensive vehicle profiles with NHTSA safety ratings, IIHS awards, complaints, investigations, and recall data';

-- Create unique index on the materialized view for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_vehicle_profiles_vin 
ON vehicle_profiles (vin);

-- Create additional indexes for common queries
CREATE INDEX IF NOT EXISTS idx_vehicle_profiles_make_model_year 
ON vehicle_profiles (make, model, model_year);

CREATE INDEX IF NOT EXISTS idx_vehicle_profiles_safety_score 
ON vehicle_profiles (computed_safety_score DESC) WHERE computed_safety_score IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_vehicle_profiles_risk_level 
ON vehicle_profiles (safety_risk_level);

CREATE INDEX IF NOT EXISTS idx_vehicle_profiles_complaints 
ON vehicle_profiles (total_complaints DESC) WHERE total_complaints > 0;

CREATE INDEX IF NOT EXISTS idx_vehicle_profiles_investigations 
ON vehicle_profiles (total_investigations DESC) WHERE total_investigations > 0;

-- Refresh the materialized view
REFRESH MATERIALIZED VIEW vehicle_profiles;
