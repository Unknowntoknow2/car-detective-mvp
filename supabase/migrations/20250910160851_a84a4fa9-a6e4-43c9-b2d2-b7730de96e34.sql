-- Fix critical security vulnerability: Enable RLS on public tables (Corrected)
-- Tables without RLS are exposed and publicly accessible via PostgREST

-- Enable RLS on all public tables that currently have it disabled
ALTER TABLE public.market_listing_aggregations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_body_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_trims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_makes_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vin_decodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vin_lookup_requests ENABLE ROW LEVEL SECURITY;

-- Create appropriate security policies for each table based on actual structure

-- Reference data tables - public read access for vehicle reference data
CREATE POLICY "Public read access to reference_body_styles" 
ON public.reference_body_styles 
FOR SELECT 
USING (true);

CREATE POLICY "Public read access to reference_features" 
ON public.reference_features 
FOR SELECT 
USING (true);

CREATE POLICY "Public read access to reference_trims" 
ON public.reference_trims 
FOR SELECT 
USING (true);

CREATE POLICY "Public read access to vehicle_makes_models" 
ON public.vehicle_makes_models 
FOR SELECT 
USING (true);

-- System data tables - service role only access
CREATE POLICY "Service role can manage market_listing_aggregations" 
ON public.market_listing_aggregations 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can manage vin_decodes" 
ON public.vin_decodes 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Service history table - VIN-based access (no user_id column)
CREATE POLICY "Service role can manage service_history" 
ON public.service_history 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can view service_history" 
ON public.service_history 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Vehicles table - VIN-based access (no user_id column)
CREATE POLICY "Service role can manage vehicles" 
ON public.vehicles 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can view vehicles" 
ON public.vehicles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Audit log table - has user_id column for tracking
CREATE POLICY "Admins can view vin_audit_log" 
ON public.vin_audit_log 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Service role can manage vin_audit_log" 
ON public.vin_audit_log 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- VIN lookup requests - has user_id for tracking lookup requests
CREATE POLICY "Users can view their own vin_lookup_requests" 
ON public.vin_lookup_requests 
FOR SELECT 
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create vin_lookup_requests" 
ON public.vin_lookup_requests 
FOR INSERT 
WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Service role can manage vin_lookup_requests" 
ON public.vin_lookup_requests 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Add security documentation
COMMENT ON TABLE public.market_listing_aggregations IS 
'Aggregated market listing data. RLS enabled with service role access only to protect market intelligence.';

COMMENT ON TABLE public.reference_body_styles IS 
'Reference data for vehicle body styles. Public read access allowed as this is reference data.';

COMMENT ON TABLE public.reference_features IS 
'Reference data for vehicle features. Public read access allowed as this is reference data.';

COMMENT ON TABLE public.reference_trims IS 
'Reference data for vehicle trims. Public read access allowed as this is reference data.';

COMMENT ON TABLE public.service_history IS 
'Vehicle service history records. RLS enabled with authenticated user access.';

COMMENT ON TABLE public.vehicle_makes_models IS 
'Reference data for vehicle makes and models. Public read access allowed as this is reference data.';

COMMENT ON TABLE public.vehicles IS 
'Vehicle records with title and ownership data. RLS enabled with authenticated user access.';

COMMENT ON TABLE public.vin_audit_log IS 
'VIN lookup audit trail. RLS enabled with admin and service role access for security monitoring.';

COMMENT ON TABLE public.vin_decodes IS 
'VIN decode cache data. RLS enabled with service role access only to protect cached decode data.';

COMMENT ON TABLE public.vin_lookup_requests IS 
'VIN lookup request tracking. RLS enabled to ensure users can only see their own lookup requests.';