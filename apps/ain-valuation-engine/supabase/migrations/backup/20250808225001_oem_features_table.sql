-- Migration: Create OEM features table and RPC function
-- File: 20250808225001_oem_features_table.sql
-- Purpose: OEM manufacturer-specific features and build-sheet data storage

-- Create OEM features table
CREATE TABLE IF NOT EXISTS oem_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program TEXT NOT NULL DEFAULT 'OEM_FEATURES',
    vin VARCHAR(17) NULL,
    model_year SMALLINT NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    trim TEXT NULL,
    features JSONB NOT NULL DEFAULT '{}'::JSONB,
    feature_count INTEGER DEFAULT 0,
    packages JSONB NULL,
    confidence_score DECIMAL(3,2) DEFAULT 0.95 CHECK (confidence_score >= 0 AND confidence_score <= 1),
    raw_payload JSONB NULL,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source TEXT NOT NULL DEFAULT 'OEM_BUILD_SHEET',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create unique index for OEM features
CREATE UNIQUE INDEX IF NOT EXISTS idx_oem_features_unique 
ON oem_features (program, model_year, make, model, COALESCE(trim, ''));

-- Create VIN index for direct lookups
CREATE INDEX IF NOT EXISTS idx_oem_features_vin 
ON oem_features (vin) WHERE vin IS NOT NULL;

-- Create additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_oem_features_lookup 
ON oem_features (model_year, make, model);

CREATE INDEX IF NOT EXISTS idx_oem_features_fetched_at 
ON oem_features (fetched_at DESC);

CREATE INDEX IF NOT EXISTS idx_oem_features_make 
ON oem_features (make);

CREATE INDEX IF NOT EXISTS idx_oem_features_feature_count 
ON oem_features (feature_count DESC);

-- GIN index for feature searches
CREATE INDEX IF NOT EXISTS idx_oem_features_gin 
ON oem_features USING GIN (features);

-- Enable RLS
ALTER TABLE oem_features ENABLE ROW LEVEL SECURITY;

-- RLS policy for read access
CREATE POLICY "Allow read access to oem_features" ON oem_features
    FOR SELECT USING (true);

-- Add helpful comments
COMMENT ON TABLE oem_features IS 'OEM manufacturer-specific features and build-sheet data';
COMMENT ON COLUMN oem_features.program IS 'Feature program identifier (OEM_FEATURES)';
COMMENT ON COLUMN oem_features.vin IS 'Vehicle VIN (optional for trim-level features)';
COMMENT ON COLUMN oem_features.features IS 'Comprehensive feature set organized by category';
COMMENT ON COLUMN oem_features.feature_count IS 'Total count of enabled features';
COMMENT ON COLUMN oem_features.packages IS 'Equipment packages and option groups';
COMMENT ON COLUMN oem_features.confidence_score IS 'Feature extraction confidence (0-1)';

-- Create RPC function for upserting OEM features
CREATE OR REPLACE FUNCTION rpc_upsert_oem_features(p_payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_program TEXT;
    v_vin VARCHAR(17);
    v_model_year SMALLINT;
    v_make TEXT;
    v_model TEXT;
    v_trim TEXT;
    v_features JSONB;
    v_feature_count INTEGER;
    v_packages JSONB;
    v_confidence_score DECIMAL(3,2);
    v_raw_payload JSONB;
    v_fetched_at TIMESTAMPTZ;
    v_source TEXT;
    v_result JSONB;
BEGIN
    -- Extract values from payload
    v_program := COALESCE((p_payload->>'program')::TEXT, 'OEM_FEATURES');
    v_vin := (p_payload->>'vin')::VARCHAR(17);
    v_model_year := (p_payload->>'model_year')::SMALLINT;
    v_make := UPPER(TRIM((p_payload->>'make')::TEXT));
    v_model := UPPER(TRIM((p_payload->>'model')::TEXT));
    v_trim := NULLIF(UPPER(TRIM((p_payload->>'trim')::TEXT)), '');
    v_features := COALESCE(p_payload->'features', '{}'::JSONB);
    v_packages := p_payload->'packages';
    v_confidence_score := COALESCE((p_payload->>'confidence_score')::DECIMAL(3,2), 0.95);
    v_raw_payload := p_payload->'raw_payload';
    v_fetched_at := COALESCE((p_payload->>'fetched_at')::TIMESTAMPTZ, NOW());
    v_source := COALESCE((p_payload->>'source')::TEXT, 'OEM_BUILD_SHEET');

    -- Validate required fields
    IF v_model_year IS NULL OR v_make IS NULL OR v_model IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Missing required fields: model_year, make, model'
        );
    END IF;

    -- Validate model year range
    IF v_model_year < 1990 OR v_model_year > (EXTRACT(YEAR FROM NOW()) + 2) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Invalid model year: must be between 1990 and ' || (EXTRACT(YEAR FROM NOW()) + 2)
        );
    END IF;

    -- Validate VIN if provided
    IF v_vin IS NOT NULL AND length(v_vin) != 17 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Invalid VIN: must be exactly 17 characters'
        );
    END IF;

    -- Count features
    v_feature_count := (
        SELECT COUNT(*)
        FROM jsonb_each_text(v_features) AS t(key, value)
        WHERE value::boolean = true
    );

    -- Upsert OEM features
    INSERT INTO oem_features (
        program, vin, model_year, make, model, trim,
        features, feature_count, packages, confidence_score,
        raw_payload, fetched_at, source, updated_at
    ) VALUES (
        v_program, v_vin, v_model_year, v_make, v_model, v_trim,
        v_features, v_feature_count, v_packages, v_confidence_score,
        v_raw_payload, v_fetched_at, v_source, NOW()
    )
    ON CONFLICT (program, model_year, make, model, COALESCE(trim, ''))
    DO UPDATE SET
        vin = COALESCE(EXCLUDED.vin, oem_features.vin),
        features = EXCLUDED.features,
        feature_count = EXCLUDED.feature_count,
        packages = EXCLUDED.packages,
        confidence_score = EXCLUDED.confidence_score,
        raw_payload = EXCLUDED.raw_payload,
        fetched_at = EXCLUDED.fetched_at,
        source = EXCLUDED.source,
        updated_at = NOW();

    -- Return success response
    v_result := jsonb_build_object(
        'success', true,
        'program', v_program,
        'vin', v_vin,
        'model_year', v_model_year,
        'make', v_make,
        'model', v_model,
        'trim', v_trim,
        'feature_count', v_feature_count,
        'confidence_score', v_confidence_score,
        'operation', 'upserted',
        'timestamp', NOW()
    );

    RETURN v_result;

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'timestamp', NOW()
        );
END;
$$;

-- Add comment to RPC function
COMMENT ON FUNCTION rpc_upsert_oem_features(JSONB) IS 'Upsert OEM feature data with validation and feature counting';

-- Create function to get OEM features for a specific vehicle
CREATE OR REPLACE FUNCTION get_oem_features_details(
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
        'program', oef.program,
        'vin', oef.vin,
        'model_year', oef.model_year,
        'make', oef.make,
        'model', oef.model,
        'trim', oef.trim,
        'features', oef.features,
        'feature_count', oef.feature_count,
        'packages', oef.packages,
        'confidence_score', oef.confidence_score,
        'fetched_at', oef.fetched_at,
        'source', oef.source,
        'data_age_days', EXTRACT(DAY FROM (NOW() - oef.fetched_at))
    )
    INTO v_result
    FROM oem_features oef
    WHERE oef.model_year = p_year
      AND UPPER(oef.make) = UPPER(p_make)
      AND UPPER(oef.model) = UPPER(p_model)
      AND (p_trim IS NULL OR oef.trim IS NULL OR UPPER(oef.trim) = UPPER(p_trim))
    ORDER BY 
        CASE WHEN oef.trim IS NOT NULL AND p_trim IS NOT NULL THEN 0 ELSE 1 END,
        oef.updated_at DESC
    LIMIT 1;

    IF v_result IS NULL THEN
        v_result := jsonb_build_object(
            'found', false,
            'message', 'No OEM features found for this vehicle',
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
COMMENT ON FUNCTION get_oem_features_details(INTEGER, TEXT, TEXT, TEXT) IS 'Get detailed OEM feature information for a specific vehicle';

-- Create function to search features across vehicles
CREATE OR REPLACE FUNCTION search_vehicles_by_features(
    p_features TEXT[],
    p_year_min INTEGER DEFAULT NULL,
    p_year_max INTEGER DEFAULT NULL,
    p_make TEXT DEFAULT NULL
)
RETURNS TABLE (
    vin VARCHAR(17),
    make TEXT,
    model TEXT,
    vehicle_trim TEXT,
    model_year SMALLINT,
    feature_count INTEGER,
    matching_features INTEGER,
    match_percentage DECIMAL(5,2)
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        oef.vin,
        oef.make,
        oef.model,
        oef.trim as vehicle_trim,
        oef.model_year,
        oef.feature_count,
        (
            SELECT COUNT(*)::INTEGER
            FROM unnest(p_features) AS required_feature
            WHERE (oef.features ->> required_feature)::boolean = true
        ) AS matching_features,
        ROUND(
            (
                SELECT COUNT(*)::DECIMAL
                FROM unnest(p_features) AS required_feature
                WHERE (oef.features ->> required_feature)::boolean = true
            ) * 100.0 / array_length(p_features, 1), 2
        ) AS match_percentage
    FROM oem_features oef
    WHERE 
        (p_year_min IS NULL OR oef.model_year >= p_year_min)
        AND (p_year_max IS NULL OR oef.model_year <= p_year_max)
        AND (p_make IS NULL OR UPPER(oef.make) = UPPER(p_make))
        AND (
            SELECT COUNT(*)
            FROM unnest(p_features) AS required_feature
            WHERE (oef.features ->> required_feature)::boolean = true
        ) > 0
    ORDER BY matching_features DESC, match_percentage DESC, oef.feature_count DESC
    LIMIT 50;
END;
$$;

-- Add comment to search function
COMMENT ON FUNCTION search_vehicles_by_features(TEXT[], INTEGER, INTEGER, TEXT) IS 'Search vehicles by required features with match scoring';

-- Insert sample OEM features data for testing
INSERT INTO oem_features (
    program, model_year, make, model, trim,
    features, feature_count, packages, confidence_score, source
) VALUES 
(
    'OEM_FEATURES', 2023, 'TOYOTA', 'CAMRY', 'XLE',
    '{"safety_systems": {"toyota_safety_sense": true, "pre_collision_system": true, "lane_departure_alert": true, "automatic_high_beams": true}, "infotainment": {"toyota_entune": true, "apple_carplay": true, "android_auto": true}, "comfort_convenience": {"remote_start": true, "heated_seats": true, "smart_key_system": true}}'::JSONB,
    9,
    '{"premium_package": true, "technology_package": true}'::JSONB,
    0.95,
    'OEM_BUILD_SHEET'
),
(
    'OEM_FEATURES', 2023, 'HONDA', 'CIVIC', 'TOURING',
    '{"safety_systems": {"honda_sensing": true, "collision_mitigation_braking": true, "road_departure_mitigation": true, "adaptive_cruise_control": true}, "infotainment": {"apple_carplay": true, "android_auto": true, "satellite_radio": true}, "comfort_convenience": {"remote_engine_start": true, "heated_seats": true, "leather_seating": true, "sunroof": true}}'::JSONB,
    10,
    '{"touring_package": true, "technology_package": true}'::JSONB,
    0.96,
    'OEM_BUILD_SHEET'
),
(
    'OEM_FEATURES', 2023, 'BMW', 'X5', 'M50I',
    '{"safety_systems": {"active_driving_assistant": true, "collision_warning": true, "lane_departure_warning": true, "parking_assistant": true}, "infotainment": {"idrive": true, "bmw_connected_services": true, "apple_carplay": true, "wireless_charging": true}, "comfort_convenience": {"comfort_access": true, "heated_seats": true, "ventilated_seats": true, "panoramic_sunroof": true}, "powertrain": {"xdrive_awd": true, "turbo_engine": true, "sport_mode": true}}'::JSONB,
    14,
    '{"m_sport_package": true, "premium_package": true, "technology_package": true}'::JSONB,
    0.98,
    'OEM_BUILD_SHEET'
)
ON CONFLICT (program, model_year, make, model, COALESCE(trim, '')) DO NOTHING;
