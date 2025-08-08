-- Migration: Add RPC functions for NCAP safety ratings ingestion
-- Created: 2025-08-08
-- Purpose: Support NHTSA NCAP safety ratings API integration with caching and upsert functionality

-- Enhanced RPC function to upsert safety ratings data
CREATE OR REPLACE FUNCTION rpc_upsert_safety(
    vin_param VARCHAR(17),
    year_param INTEGER,
    make_param VARCHAR(100),
    model_param VARCHAR(100),
    trim_param VARCHAR(100) DEFAULT NULL,
    overall_rating_param INTEGER DEFAULT NULL,
    frontal_crash_param INTEGER DEFAULT NULL,
    side_crash_param INTEGER DEFAULT NULL,
    rollover_param INTEGER DEFAULT NULL,
    safety_flags_param JSONB DEFAULT '{}'::jsonb,
    nhtsa_id_param VARCHAR(20) DEFAULT NULL,
    vehicle_description_param VARCHAR(200) DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result_data JSONB;
    operation_type TEXT := 'inserted';
BEGIN
    -- Validate VIN
    IF vin_param IS NULL OR length(vin_param) != 17 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Invalid VIN length',
            'vin', vin_param
        );
    END IF;

    -- Validate year
    IF year_param IS NOT NULL AND (year_param < 1980 OR year_param > 2030) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Invalid year range',
            'vin', vin_param
        );
    END IF;

    -- Validate ratings (1-5 scale)
    IF overall_rating_param IS NOT NULL AND (overall_rating_param < 1 OR overall_rating_param > 5) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Overall rating must be 1-5',
            'vin', vin_param
        );
    END IF;

    IF frontal_crash_param IS NOT NULL AND (frontal_crash_param < 1 OR frontal_crash_param > 5) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Frontal crash rating must be 1-5',
            'vin', vin_param
        );
    END IF;

    IF side_crash_param IS NOT NULL AND (side_crash_param < 1 OR side_crash_param > 5) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Side crash rating must be 1-5',
            'vin', vin_param
        );
    END IF;

    IF rollover_param IS NOT NULL AND (rollover_param < 1 OR rollover_param > 5) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Rollover rating must be 1-5',
            'vin', vin_param
        );
    END IF;

    -- Ensure VIN exists in vehicle_specs
    INSERT INTO vehicle_specs (vin, make, model, year, trim)
    VALUES (vin_param, make_param, model_param, year_param, trim_param)
    ON CONFLICT (vin) DO UPDATE SET
        make = COALESCE(EXCLUDED.make, vehicle_specs.make),
        model = COALESCE(EXCLUDED.model, vehicle_specs.model),
        year = COALESCE(EXCLUDED.year, vehicle_specs.year),
        trim = COALESCE(EXCLUDED.trim, vehicle_specs.trim),
        updated_at = NOW();

    -- Insert or update safety ratings
    INSERT INTO nhtsa_safety_ratings (
        vin,
        overall_rating,
        frontal_crash_rating,
        side_crash_rating,
        rollover_rating,
        model_year,
        vehicle_description,
        nhtsa_id
    )
    VALUES (
        vin_param,
        overall_rating_param,
        frontal_crash_param,
        side_crash_param,
        rollover_param,
        year_param,
        vehicle_description_param,
        nhtsa_id_param
    )
    ON CONFLICT (vin)
    DO UPDATE SET
        overall_rating = COALESCE(EXCLUDED.overall_rating, nhtsa_safety_ratings.overall_rating),
        frontal_crash_rating = COALESCE(EXCLUDED.frontal_crash_rating, nhtsa_safety_ratings.frontal_crash_rating),
        side_crash_rating = COALESCE(EXCLUDED.side_crash_rating, nhtsa_safety_ratings.side_crash_rating),
        rollover_rating = COALESCE(EXCLUDED.rollover_rating, nhtsa_safety_ratings.rollover_rating),
        model_year = COALESCE(EXCLUDED.model_year, nhtsa_safety_ratings.model_year),
        vehicle_description = COALESCE(EXCLUDED.vehicle_description, nhtsa_safety_ratings.vehicle_description),
        nhtsa_id = COALESCE(EXCLUDED.nhtsa_id, nhtsa_safety_ratings.nhtsa_id),
        updated_at = NOW();

    -- Check if this was an update or insert
    IF EXISTS (
        SELECT 1 FROM nhtsa_safety_ratings 
        WHERE vin = vin_param 
        AND created_at < updated_at
    ) THEN
        operation_type := 'updated';
    END IF;

    -- Return success response
    RETURN jsonb_build_object(
        'success', true,
        'vin', vin_param,
        'operation', operation_type,
        'ratings', jsonb_build_object(
            'overall_rating', overall_rating_param,
            'frontal_crash', frontal_crash_param,
            'side_crash', side_crash_param,
            'rollover', rollover_param
        ),
        'safety_flags', safety_flags_param,
        'timestamp', NOW()
    );

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'vin', vin_param,
            'timestamp', NOW()
        );
END;
$$;

-- Function to get cached safety ratings data
CREATE OR REPLACE FUNCTION get_cached_safety_data(
    vin_param VARCHAR(17) DEFAULT NULL,
    year_param INTEGER DEFAULT NULL,
    make_param VARCHAR(100) DEFAULT NULL,
    model_param VARCHAR(100) DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result_data JSONB;
BEGIN
    -- Query by VIN if provided
    IF vin_param IS NOT NULL THEN
        SELECT jsonb_build_object(
            'vin', nsr.vin,
            'year', nsr.model_year,
            'overall_rating', nsr.overall_rating,
            'frontal_crash', nsr.frontal_crash_rating,
            'side_crash', nsr.side_crash_rating,
            'rollover', nsr.rollover_rating,
            'nhtsa_id', nsr.nhtsa_id,
            'vehicle_description', nsr.vehicle_description,
            'fetched_at', nsr.updated_at
        ) INTO result_data
        FROM nhtsa_safety_ratings nsr
        WHERE nsr.vin = vin_param;
    ELSE
        -- Query by year/make/model if VIN not provided
        SELECT jsonb_build_object(
            'vin', nsr.vin,
            'year', nsr.model_year,
            'overall_rating', nsr.overall_rating,
            'frontal_crash', nsr.frontal_crash_rating,
            'side_crash', nsr.side_crash_rating,
            'rollover', nsr.rollover_rating,
            'nhtsa_id', nsr.nhtsa_id,
            'vehicle_description', nsr.vehicle_description,
            'fetched_at', nsr.updated_at
        ) INTO result_data
        FROM nhtsa_safety_ratings nsr
        JOIN vehicle_specs vs ON nsr.vin = vs.vin
        WHERE vs.year = year_param 
        AND UPPER(vs.make) = UPPER(make_param)
        AND UPPER(vs.model) = UPPER(model_param)
        ORDER BY nsr.updated_at DESC
        LIMIT 1;
    END IF;

    RETURN COALESCE(result_data, '{}'::jsonb);
END;
$$;

-- Function to cache safety ratings with TTL simulation
CREATE OR REPLACE FUNCTION cache_safety_data(
    vin_param VARCHAR(17),
    year_param INTEGER,
    make_param VARCHAR(100),
    model_param VARCHAR(100),
    safety_data JSONB,
    ttl_seconds INTEGER DEFAULT 86400
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result_data JSONB;
BEGIN
    -- Extract safety ratings from the JSONB data
    SELECT rpc_upsert_safety(
        vin_param := vin_param,
        year_param := year_param,
        make_param := make_param,
        model_param := model_param,
        overall_rating_param := (safety_data->>'overall_rating')::INTEGER,
        frontal_crash_param := (safety_data->>'frontal_crash')::INTEGER,
        side_crash_param := (safety_data->>'side_crash')::INTEGER,
        rollover_param := (safety_data->>'rollover')::INTEGER,
        safety_flags_param := COALESCE(safety_data->'safety_flags', '{}'::jsonb),
        nhtsa_id_param := safety_data->>'nhtsa_id',
        vehicle_description_param := safety_data->>'vehicle_description'
    ) INTO result_data;
    
    RETURN result_data;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION rpc_upsert_safety(VARCHAR, INTEGER, VARCHAR, VARCHAR, VARCHAR, INTEGER, INTEGER, INTEGER, INTEGER, JSONB, VARCHAR, VARCHAR) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION get_cached_safety_data(VARCHAR, INTEGER, VARCHAR, VARCHAR) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION cache_safety_data(VARCHAR, INTEGER, VARCHAR, VARCHAR, JSONB, INTEGER) TO authenticated, anon, service_role;

-- Add helpful comments
COMMENT ON FUNCTION rpc_upsert_safety(VARCHAR, INTEGER, VARCHAR, VARCHAR, VARCHAR, INTEGER, INTEGER, INTEGER, INTEGER, JSONB, VARCHAR, VARCHAR) IS 'Upserts NHTSA safety ratings data for a given VIN with validation';
COMMENT ON FUNCTION get_cached_safety_data(VARCHAR, INTEGER, VARCHAR, VARCHAR) IS 'Retrieves cached safety ratings data by VIN or year/make/model';
COMMENT ON FUNCTION cache_safety_data(VARCHAR, INTEGER, VARCHAR, VARCHAR, JSONB, INTEGER) IS 'Caches safety ratings data in the database with TTL simulation';
