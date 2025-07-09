
-- Remove comprehensive market intelligence tables and related database components

-- Drop indexes first
DROP INDEX IF EXISTS idx_vehicle_pricing_data_vin;
DROP INDEX IF EXISTS idx_vehicle_pricing_data_make_model_year;
DROP INDEX IF EXISTS idx_vehicle_pricing_data_zip_code;
DROP INDEX IF EXISTS idx_vehicle_pricing_data_created_at;
DROP INDEX IF EXISTS idx_pricing_analytics_make_model_year;

-- Drop triggers
DROP TRIGGER IF EXISTS update_vehicle_pricing_data_updated_at ON public.vehicle_pricing_data;
DROP TRIGGER IF EXISTS update_pricing_analytics_updated_at ON public.pricing_analytics;

-- Drop RLS policies
DROP POLICY IF EXISTS "Authenticated users can view pricing data" ON public.vehicle_pricing_data;
DROP POLICY IF EXISTS "Admins can manage pricing data" ON public.vehicle_pricing_data;
DROP POLICY IF EXISTS "Authenticated users can view analytics" ON public.pricing_analytics;
DROP POLICY IF EXISTS "Admins can manage analytics" ON public.pricing_analytics;

-- Drop tables
DROP TABLE IF EXISTS public.vehicle_pricing_data CASCADE;
DROP TABLE IF EXISTS public.pricing_analytics CASCADE;

-- Remove any related functions
DROP FUNCTION IF EXISTS public.update_pricing_analytics(text, text, text, integer);
DROP FUNCTION IF EXISTS public.calculate_price_trend(text, text, text, integer);
