-- Make the market intelligence function more flexible with geographical matching
CREATE OR REPLACE FUNCTION public.calculate_market_intelligence(p_make text, p_model text, p_year integer, p_zip_code text, p_radius_miles integer DEFAULT 100)
 RETURNS TABLE(median_price numeric, average_price numeric, sample_size integer, confidence_score integer, inventory_level text, demand_indicator numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_median_price NUMERIC;
  v_average_price NUMERIC;
  v_sample_size INTEGER;
  v_confidence_score INTEGER;
  v_inventory_level TEXT;
  v_demand_indicator NUMERIC;
BEGIN
  -- Get listings data with CASE-INSENSITIVE matching and flexible geography
  WITH filtered_listings AS (
    SELECT eml.price, eml.days_on_market
    FROM enhanced_market_listings eml
    WHERE LOWER(eml.make) = LOWER(p_make)  -- 🔧 FIXED: Case-insensitive
      AND LOWER(eml.model) = LOWER(p_model)  -- 🔧 FIXED: Case-insensitive  
      AND eml.year = p_year  -- Year must match exactly
      AND eml.listing_status = 'active'
      AND eml.price > 1000
      AND (
        eml.zip_code = p_zip_code OR 
        eml.geo_distance_miles <= p_radius_miles OR
        eml.geo_distance_miles IS NULL  -- 🔧 INCLUDE listings without distance data
      )
      AND eml.updated_at >= NOW() - INTERVAL '30 days'
  ),
  price_stats AS (
    SELECT 
      COUNT(*)::INTEGER as count,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price) as median,
      AVG(price) as average,
      AVG(COALESCE(days_on_market, 0)) as avg_days_on_market  -- 🔧 HANDLE NULL days_on_market
    FROM filtered_listings
  )
  SELECT 
    ps.median,
    ps.average,
    ps.count,
    CASE
      WHEN ps.count >= 8 THEN 95
      WHEN ps.count >= 5 THEN 90
      WHEN ps.count >= 3 THEN 80
      WHEN ps.count >= 2 THEN 70
      ELSE 50
    END,
    CASE 
      WHEN ps.count >= 10 THEN 'high'
      WHEN ps.count >= 5 THEN 'medium'
      ELSE 'low'
    END,
    CASE
      WHEN ps.avg_days_on_market <= 15 THEN 0.8  -- High demand
      WHEN ps.avg_days_on_market <= 30 THEN 0.6  -- Medium demand
      WHEN ps.avg_days_on_market <= 60 THEN 0.4  -- Low demand
      ELSE 0.2  -- Very low demand
    END
  INTO v_median_price, v_average_price, v_sample_size, v_confidence_score, v_inventory_level, v_demand_indicator
  FROM price_stats ps;

  RETURN QUERY SELECT v_median_price, v_average_price, v_sample_size, v_confidence_score, v_inventory_level, v_demand_indicator;
END;
$function$