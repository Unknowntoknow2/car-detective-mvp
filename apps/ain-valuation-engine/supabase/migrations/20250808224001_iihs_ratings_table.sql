-- Migration: Create IIHS ratings table and RPC function
-- File: 20250808224001_iihs_ratings_table.sql
-- Purpose: IIHS safety ratings ingestion for vehicle profiles

-- Create IIHS ratings table
CREATE TABLE IF NOT EXISTS iihs_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program TEXT NOT NULL DEFAULT 'IIHS',
    model_year SMALLINT NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    trim TEXT NULL,
    crashworthiness JSONB NULL,
    crash_prevention JSONB NULL,
    headlights TEXT NULL,
    top_safety_pick BOOLEAN DEFAULT FALSE,
    top_safety_pick_plus BOOLEAN DEFAULT FALSE,
    raw_payload JSONB NULL,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source TEXT NOT NULL DEFAULT 'IIHS_WEBSITE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create unique index for IIHS ratings
CREATE UNIQUE INDEX IF NOT EXISTS idx_iihs_ratings_unique 
ON iihs_ratings (program, model_year, make, model, COALESCE(trim, ''));

-- Create additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_iihs_ratings_lookup 
ON iihs_ratings (model_year, make, model);

CREATE INDEX IF NOT EXISTS idx_iihs_ratings_fetched_at 
ON iihs_ratings (fetched_at DESC);

CREATE INDEX IF NOT EXISTS idx_iihs_ratings_awards 
ON iihs_ratings (top_safety_pick_plus, top_safety_pick);

-- Enable RLS
ALTER TABLE iihs_ratings ENABLE ROW LEVEL SECURITY;

-- RLS policy for read access
CREATE POLICY "Allow read access to iihs_ratings" ON iihs_ratings
    FOR SELECT USING (true);

-- Add helpful comments
COMMENT ON TABLE iihs_ratings IS 'IIHS safety ratings and awards for vehicles';
COMMENT ON COLUMN iihs_ratings.program IS 'Rating program identifier (IIHS)';
COMMENT ON COLUMN iihs_ratings.crashworthiness IS 'Crashworthiness test results (small overlap, moderate overlap, side impact, roof strength, head restraints)';
COMMENT ON COLUMN iihs_ratings.crash_prevention IS 'Crash prevention technology ratings (vehicle-to-vehicle, vehicle-to-pedestrian)';
COMMENT ON COLUMN iihs_ratings.headlights IS 'Headlight performance rating';
COMMENT ON COLUMN iihs_ratings.top_safety_pick IS 'IIHS Top Safety Pick award';
COMMENT ON COLUMN iihs_ratings.top_safety_pick_plus IS 'IIHS Top Safety Pick+ award';

-- Create RPC function for upserting IIHS data
CREATE OR REPLACE FUNCTION rpc_upsert_iihs(p_payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_program TEXT;
    v_model_year SMALLINT;
    v_make TEXT;
    v_model TEXT;
    v_trim TEXT;
    v_crashworthiness JSONB;
    v_crash_prevention JSONB;
    v_headlights TEXT;
    v_top_safety_pick BOOLEAN;
    v_top_safety_pick_plus BOOLEAN;
    v_raw_payload JSONB;
    v_fetched_at TIMESTAMPTZ;
    v_source TEXT;
    v_result JSONB;
BEGIN
    -- Extract values from payload
    v_program := COALESCE((p_payload->>'program')::TEXT, 'IIHS');
    v_model_year := (p_payload->>'model_year')::SMALLINT;
    v_make := UPPER(TRIM((p_payload->>'make')::TEXT));
    v_model := UPPER(TRIM((p_payload->>'model')::TEXT));
    v_trim := NULLIF(UPPER(TRIM((p_payload->>'trim')::TEXT)), '');
    v_crashworthiness := p_payload->'crashworthiness';
    v_crash_prevention := p_payload->'crash_prevention';
    v_headlights := (p_payload->>'headlights')::TEXT;
    v_top_safety_pick := COALESCE((p_payload->>'top_safety_pick')::BOOLEAN, FALSE);
    v_top_safety_pick_plus := COALESCE((p_payload->>'top_safety_pick_plus')::BOOLEAN, FALSE);
    v_raw_payload := p_payload->'raw_payload';
    v_fetched_at := COALESCE((p_payload->>'fetched_at')::TIMESTAMPTZ, NOW());
    v_source := COALESCE((p_payload->>'source')::TEXT, 'IIHS_WEBSITE');

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

    -- Upsert IIHS rating
    INSERT INTO iihs_ratings (
        program, model_year, make, model, trim,
        crashworthiness, crash_prevention, headlights,
        top_safety_pick, top_safety_pick_plus,
        raw_payload, fetched_at, source, updated_at
    ) VALUES (
        v_program, v_model_year, v_make, v_model, v_trim,
        v_crashworthiness, v_crash_prevention, v_headlights,
        v_top_safety_pick, v_top_safety_pick_plus,
        v_raw_payload, v_fetched_at, v_source, NOW()
    )
    ON CONFLICT (program, model_year, make, model, COALESCE(trim, ''))
    DO UPDATE SET
        crashworthiness = EXCLUDED.crashworthiness,
        crash_prevention = EXCLUDED.crash_prevention,
        headlights = EXCLUDED.headlights,
        top_safety_pick = EXCLUDED.top_safety_pick,
        top_safety_pick_plus = EXCLUDED.top_safety_pick_plus,
        raw_payload = EXCLUDED.raw_payload,
        fetched_at = EXCLUDED.fetched_at,
        source = EXCLUDED.source,
        updated_at = NOW();

    -- Return success response
    v_result := jsonb_build_object(
        'success', true,
        'program', v_program,
        'model_year', v_model_year,
        'make', v_make,
        'model', v_model,
        'trim', v_trim,
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
COMMENT ON FUNCTION rpc_upsert_iihs(JSONB) IS 'Upsert IIHS safety rating data with validation';

-- Insert sample IIHS data for testing
INSERT INTO iihs_ratings (
    program, model_year, make, model, trim,
    crashworthiness, crash_prevention, headlights,
    top_safety_pick, top_safety_pick_plus,
    source
) VALUES 
(
    'IIHS', 2023, 'TOYOTA', 'CAMRY', 'XLE',
    '{"small_overlap_front": "Good", "moderate_overlap_front": "Good", "side_impact": "Good", "roof_strength": "Good", "head_restraints": "Good"}'::JSONB,
    '{"vehicle_to_vehicle": "Superior", "vehicle_to_pedestrian": "Advanced", "superior_award": true}'::JSONB,
    'Good',
    false, true,
    'IIHS_WEBSITE'
),
(
    'IIHS', 2023, 'HONDA', 'CIVIC', 'TOURING',
    '{"small_overlap_front": "Good", "moderate_overlap_front": "Good", "side_impact": "Good", "roof_strength": "Good", "head_restraints": "Good"}'::JSONB,
    '{"vehicle_to_vehicle": "Superior", "vehicle_to_pedestrian": "Superior", "superior_award": true}'::JSONB,
    'Good',
    false, true,
    'IIHS_WEBSITE'
),
(
    'IIHS', 2023, 'SUBARU', 'OUTBACK', 'LIMITED',
    '{"small_overlap_front": "Good", "moderate_overlap_front": "Good", "side_impact": "Good", "roof_strength": "Good", "head_restraints": "Good"}'::JSONB,
    '{"vehicle_to_vehicle": "Superior", "vehicle_to_pedestrian": "Advanced", "superior_award": true}'::JSONB,
    'Acceptable',
    true, false,
    'IIHS_WEBSITE'
)
ON CONFLICT (program, model_year, make, model, COALESCE(trim, '')) DO NOTHING;
