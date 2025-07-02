-- Create database function to get records needing VIN enrichment
CREATE OR REPLACE FUNCTION get_records_needing_vin_enrichment(
  batch_limit INTEGER DEFAULT 100,
  force_reprocess BOOLEAN DEFAULT false
)
RETURNS TABLE (
  id UUID,
  vin TEXT,
  make TEXT,
  model TEXT,
  year INTEGER,
  trim TEXT,
  table_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH market_comps_needing_enrichment AS (
    SELECT 
      mc.id,
      mc.vin,
      mc.make,
      mc.model,
      mc.year,
      mc.trim,
      'market_comps'::text as table_name
    FROM market_comps mc
    LEFT JOIN vin_enrichment_data ved ON mc.vin = ved.vin
    WHERE mc.vin IS NOT NULL 
      AND length(mc.vin) = 17
      AND (
        force_reprocess OR 
        ved.id IS NULL OR 
        (mc.make IS NULL OR mc.model IS NULL OR mc.trim IS NULL)
      )
    ORDER BY mc.created_at DESC
    LIMIT batch_limit / 2
  ),
  market_listings_needing_enrichment AS (
    SELECT 
      ml.id,
      ml.vin,
      ml.make,
      ml.model,
      ml.year,
      ml.trim,
      'market_listings'::text as table_name
    FROM market_listings ml
    LEFT JOIN vin_enrichment_data ved ON ml.vin = ved.vin
    WHERE ml.vin IS NOT NULL 
      AND length(ml.vin) = 17
      AND (
        force_reprocess OR 
        ved.id IS NULL OR 
        (ml.make IS NULL OR ml.model IS NULL OR ml.trim IS NULL)
      )
    ORDER BY ml.created_at DESC
    LIMIT batch_limit / 2
  )
  SELECT * FROM market_comps_needing_enrichment
  UNION ALL
  SELECT * FROM market_listings_needing_enrichment
  ORDER BY table_name, id
  LIMIT batch_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create scheduled job function for nightly data quality runs
CREATE OR REPLACE FUNCTION schedule_nightly_data_quality()
RETURNS void AS $$
BEGIN
  -- This function will be called by pg_cron for nightly processing
  PERFORM net.http_post(
    url := 'https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/data-quality-orchestrator',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
    ),
    body := jsonb_build_object(
      'job_type', 'vin_enrichment',
      'batch_size', 200
    )::text
  );

  -- Schedule photo analysis
  PERFORM net.http_post(
    url := 'https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/data-quality-orchestrator',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
    ),
    body := jsonb_build_object(
      'job_type', 'photo_analysis',
      'batch_size', 100
    )::text
  );

  -- Schedule anomaly detection
  PERFORM net.http_post(
    url := 'https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/data-quality-orchestrator',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
    ),
    body := jsonb_build_object(
      'job_type', 'anomaly_detection',
      'batch_size', 500
    )::text
  );

  -- Schedule data validation
  PERFORM net.http_post(
    url := 'https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/data-quality-orchestrator',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
    ),
    body := jsonb_build_object(
      'job_type', 'data_validation',
      'batch_size', 1000
    )::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;