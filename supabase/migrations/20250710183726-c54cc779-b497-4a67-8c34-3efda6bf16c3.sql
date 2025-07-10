-- Create function to get adjustment breakdown heatmap data
CREATE OR REPLACE FUNCTION public.get_adjustment_breakdown_heatmap()
RETURNS TABLE(
  zip_code text,
  fuel_type text,
  condition text,
  average_condition_adj numeric,
  average_fuel_adj numeric,
  average_mileage_adj numeric,
  average_market_adj numeric,
  final_value_avg numeric,
  sample_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH valuation_data AS (
    SELECT 
      v.state as zip_code,
      COALESCE(dv.fueltype, 'unknown') as fuel_type,
      COALESCE(fa.condition, 'unknown') as condition,
      v.estimated_value as final_value,
      -- Extract adjustment values from breakdown if available
      CASE 
        WHEN v.value_breakdown IS NOT NULL 
        THEN COALESCE((v.value_breakdown->>'conditionAdjustment')::numeric, 0)
        ELSE 0
      END as condition_adj,
      CASE 
        WHEN v.value_breakdown IS NOT NULL 
        THEN COALESCE((v.value_breakdown->>'fuelAdjustment')::numeric, 0)
        ELSE 0
      END as fuel_adj,
      CASE 
        WHEN v.value_breakdown IS NOT NULL 
        THEN COALESCE((v.value_breakdown->>'mileageAdjustment')::numeric, 0)
        ELSE 0
      END as mileage_adj,
      CASE 
        WHEN v.value_breakdown IS NOT NULL 
        THEN COALESCE((v.value_breakdown->>'marketAdjustment')::numeric, 0)
        ELSE 0
      END as market_adj
    FROM valuations v
    LEFT JOIN decoded_vehicles dv ON v.vin = dv.vin
    LEFT JOIN follow_up_answers fa ON v.id = fa.valuation_id
    WHERE v.estimated_value IS NOT NULL 
      AND v.estimated_value > 0
      AND v.created_at >= NOW() - INTERVAL '6 months'
  ),
  aggregated_data AS (
    SELECT 
      zip_code,
      fuel_type,
      condition,
      AVG(condition_adj) as average_condition_adj,
      AVG(fuel_adj) as average_fuel_adj,
      AVG(mileage_adj) as average_mileage_adj,
      AVG(market_adj) as average_market_adj,
      AVG(final_value) as final_value_avg,
      COUNT(*) as sample_count
    FROM valuation_data
    WHERE zip_code IS NOT NULL
    GROUP BY zip_code, fuel_type, condition
    HAVING COUNT(*) >= 3  -- Minimum sample size
  )
  SELECT 
    a.zip_code,
    a.fuel_type,
    a.condition,
    ROUND(a.average_condition_adj, 2) as average_condition_adj,
    ROUND(a.average_fuel_adj, 2) as average_fuel_adj,
    ROUND(a.average_mileage_adj, 2) as average_mileage_adj,
    ROUND(a.average_market_adj, 2) as average_market_adj,
    ROUND(a.final_value_avg, 0) as final_value_avg,
    a.sample_count
  FROM aggregated_data a
  ORDER BY a.sample_count DESC, a.zip_code
  LIMIT 100;
END;
$$;

-- Grant execute permission to authenticated users (will be restricted by RLS)
GRANT EXECUTE ON FUNCTION public.get_adjustment_breakdown_heatmap() TO authenticated;