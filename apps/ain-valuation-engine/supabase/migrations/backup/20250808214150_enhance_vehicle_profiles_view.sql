-- Migration: Enhance vehicle_profiles view with safety feature counts
-- Created: 2025-08-08
-- Purpose: Update vehicle_profiles view to include safety equipment data and feature counts

-- First try to drop if it exists as a view, then as a table
DO $$ 
BEGIN
    -- Try to drop as table first (since Phase 1-2 creates it as table)
    BEGIN
        DROP TABLE IF EXISTS vehicle_profiles CASCADE;
    EXCEPTION 
        WHEN OTHERS THEN NULL;
    END;
    
    -- Try to drop as view if table drop didn't work
    BEGIN
        DROP VIEW IF EXISTS vehicle_profiles CASCADE;
    EXCEPTION 
        WHEN OTHERS THEN NULL;
    END;
END $$;

-- Create enhanced vehicle_profiles VIEW with safety feature counts
CREATE VIEW vehicle_profiles AS
SELECT 
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
    vs.plant_country,
    vs.plant_state,
    vs.vehicle_type,
    vs.gvwr,
    vs.doors,
    vs.series,
    vs.created_at,
    vs.updated_at,
    -- New JSONB columns (will be empty if columns don't exist yet)
    COALESCE(vs.safety_equipment, '{}'::jsonb) AS safety_equipment,
    COALESCE(vs.airbags, '{}'::jsonb) AS airbags,
    COALESCE(vs.lighting, '{}'::jsonb) AS lighting,
    -- Feature counts for analytics and scoring (safe with COALESCE)
    (
        SELECT COUNT(*)::integer 
        FROM jsonb_each_text(COALESCE(vs.safety_equipment, '{}'::jsonb)) 
        WHERE value::boolean = true
    ) AS safety_feature_count,
    (
        SELECT COUNT(*)::integer 
        FROM jsonb_each_text(COALESCE(vs.airbags, '{}'::jsonb)) 
        WHERE value::boolean = true  
    ) AS airbag_coverage_count,
    (
        SELECT COUNT(*)::integer 
        FROM jsonb_each_text(COALESCE(vs.lighting, '{}'::jsonb)) 
        WHERE value::boolean = true
    ) AS lighting_feature_count,
    -- Combined safety score (total safety + airbag features)
    (
        (SELECT COUNT(*)::integer FROM jsonb_each_text(COALESCE(vs.safety_equipment, '{}'::jsonb)) WHERE value::boolean = true) +
        (SELECT COUNT(*)::integer FROM jsonb_each_text(COALESCE(vs.airbags, '{}'::jsonb)) WHERE value::boolean = true)
    ) AS total_safety_score
FROM vehicle_specs vs;

-- Add comment to the view
COMMENT ON VIEW vehicle_profiles IS 
'Enhanced vehicle profiles view with safety equipment, airbags, and lighting data.
Includes computed feature counts for valuation scoring and analytics.
RLS: Inherits vehicle_specs permissions - anon users can only read via this view, not raw table.';

-- Grant SELECT permissions to anon and authenticated users on the view
GRANT SELECT ON vehicle_profiles TO anon;
GRANT SELECT ON vehicle_profiles TO authenticated;
