-- ===============================================
-- Row Level Security (RLS) Policies
-- ===============================================
-- Copy-paste ready for GitHub issues

-- Enable RLS on critical tables
ALTER TABLE api_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nhtsa_recalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_economy ENABLE ROW LEVEL SECURITY;

-- ===============================================
-- API Cache: Server-only access
-- ===============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS api_cache_server_rw ON api_cache;

-- Server-only access (no direct client access)
CREATE POLICY api_cache_server_rw
  ON api_cache
  FOR ALL
  USING (false) 
  WITH CHECK (false);

-- Allow access only via SECURITY DEFINER RPCs
CREATE OR REPLACE FUNCTION upsert_cache(
  p_key text,
  p_payload jsonb,
  p_ttl_seconds int,
  p_source text DEFAULT 'API'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO api_cache (cache_key, payload, ttl_seconds, source, fetched_at)
  VALUES (p_key, p_payload, p_ttl_seconds, p_source, now())
  ON CONFLICT (cache_key) 
  DO UPDATE SET 
    payload = EXCLUDED.payload,
    ttl_seconds = EXCLUDED.ttl_seconds,
    source = EXCLUDED.source,
    fetched_at = EXCLUDED.fetched_at;
END;
$$;

CREATE OR REPLACE FUNCTION get_cache(p_key text)
RETURNS TABLE(payload jsonb, is_expired boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.payload,
    (EXTRACT(EPOCH FROM (now() - c.fetched_at)) > c.ttl_seconds) as is_expired
  FROM api_cache c
  WHERE c.cache_key = p_key;
END;
$$;

-- ===============================================
-- Vehicle Specs: Anonymous read via view only
-- ===============================================
DROP POLICY IF EXISTS vehicle_specs_anon_read ON vehicle_specs;
DROP POLICY IF EXISTS vehicle_specs_server_rw ON vehicle_specs;

-- Anonymous users can only read via materialized view
CREATE POLICY vehicle_specs_anon_read
  ON vehicle_specs
  FOR SELECT
  USING (false); -- No direct table access

-- Server-only write access
CREATE POLICY vehicle_specs_server_rw
  ON vehicle_specs
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- Create public view for anonymous access
CREATE OR REPLACE VIEW public_vehicle_specs AS
SELECT 
  vin,
  make,
  model,
  model_year,
  trim,
  body_class,
  engine_cylinders,
  fuel_type_primary,
  drive_type,
  transmission_style,
  plant_country,
  created_at,
  updated_at
FROM vehicle_specs
WHERE vin IS NOT NULL;

-- Grant access to view
GRANT SELECT ON public_vehicle_specs TO anon, authenticated;

-- Server-only upsert function
CREATE OR REPLACE FUNCTION upsert_vehicle_specs(
  p_vin text,
  p_data jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate VIN first
  IF NOT fn_validate_vin(p_vin) THEN
    RAISE EXCEPTION 'Invalid VIN format or check digit: %', p_vin;
  END IF;

  INSERT INTO vehicle_specs (
    vin, make, model, model_year, trim, body_class,
    engine_cylinders, fuel_type_primary, drive_type,
    transmission_style, plant_country, raw_data
  )
  VALUES (
    fn_normalize_vin(p_vin),
    p_data->>'Make',
    p_data->>'Model', 
    (p_data->>'ModelYear')::int,
    p_data->>'Trim',
    p_data->>'BodyClass',
    (p_data->>'EngineCylinders')::int,
    p_data->>'FuelTypePrimary',
    p_data->>'DriveType',
    p_data->>'TransmissionStyle',
    p_data->>'PlantCountry',
    p_data
  )
  ON CONFLICT (vin) 
  DO UPDATE SET
    make = EXCLUDED.make,
    model = EXCLUDED.model,
    model_year = EXCLUDED.model_year,
    trim = EXCLUDED.trim,
    body_class = EXCLUDED.body_class,
    engine_cylinders = EXCLUDED.engine_cylinders,
    fuel_type_primary = EXCLUDED.fuel_type_primary,
    drive_type = EXCLUDED.drive_type,
    transmission_style = EXCLUDED.transmission_style,
    plant_country = EXCLUDED.plant_country,
    raw_data = EXCLUDED.raw_data,
    updated_at = now();
END;
$$;

-- ===============================================
-- NHTSA Recalls: Server-only with composite key
-- ===============================================
DROP POLICY IF EXISTS nhtsa_recalls_server_rw ON nhtsa_recalls;

CREATE POLICY nhtsa_recalls_server_rw
  ON nhtsa_recalls
  FOR ALL
  USING (false)
  WITH CHECK (false);

CREATE OR REPLACE FUNCTION upsert_recall(
  p_vin text,
  p_campaign_id text,
  p_data jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO nhtsa_recalls (
    vin, campaign_id, component, summary, 
    consequence, remedy, recall_date, raw_data
  )
  VALUES (
    fn_normalize_vin(p_vin),
    p_campaign_id,
    p_data->>'Component',
    p_data->>'Summary',
    p_data->>'Consequence', 
    p_data->>'Remedy',
    (p_data->>'RecallDate')::date,
    p_data
  )
  ON CONFLICT (vin, campaign_id)
  DO UPDATE SET
    component = EXCLUDED.component,
    summary = EXCLUDED.summary,
    consequence = EXCLUDED.consequence,
    remedy = EXCLUDED.remedy,
    recall_date = EXCLUDED.recall_date,
    raw_data = EXCLUDED.raw_data,
    updated_at = now();
END;
$$;

-- ===============================================
-- Safety Ratings: Server-only
-- ===============================================
DROP POLICY IF EXISTS safety_ratings_server_rw ON safety_ratings;

CREATE POLICY safety_ratings_server_rw
  ON safety_ratings
  FOR ALL
  USING (false)
  WITH CHECK (false);

CREATE OR REPLACE FUNCTION upsert_safety_rating(
  p_vin text,
  p_model_year int,
  p_make text,
  p_model text,
  p_data jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO safety_ratings (
    vin, model_year, make, model, overall_rating,
    frontal_crash_rating, side_crash_rating, 
    rollover_rating, raw_data
  )
  VALUES (
    fn_normalize_vin(p_vin),
    p_model_year,
    p_make,
    p_model,
    (p_data->>'OverallRating')::int,
    (p_data->>'FrontalCrashRating')::int,
    (p_data->>'SideCrashRating')::int,
    (p_data->>'RolloverRating')::int,
    p_data
  )
  ON CONFLICT (vin)
  DO UPDATE SET
    model_year = EXCLUDED.model_year,
    make = EXCLUDED.make,
    model = EXCLUDED.model,
    overall_rating = EXCLUDED.overall_rating,
    frontal_crash_rating = EXCLUDED.frontal_crash_rating,
    side_crash_rating = EXCLUDED.side_crash_rating,
    rollover_rating = EXCLUDED.rollover_rating,
    raw_data = EXCLUDED.raw_data,
    updated_at = now();
END;
$$;

-- ===============================================
-- Grant execute permissions to service role
-- ===============================================
GRANT EXECUTE ON FUNCTION upsert_cache TO service_role;
GRANT EXECUTE ON FUNCTION get_cache TO service_role;
GRANT EXECUTE ON FUNCTION upsert_vehicle_specs TO service_role;
GRANT EXECUTE ON FUNCTION upsert_recall TO service_role;
GRANT EXECUTE ON FUNCTION upsert_safety_rating TO service_role;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;
