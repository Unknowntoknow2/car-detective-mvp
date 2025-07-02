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
  trim_level TEXT,
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
      mc.trim as trim_level,
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
  )
  SELECT * FROM market_comps_needing_enrichment
  ORDER BY table_name, id
  LIMIT batch_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;