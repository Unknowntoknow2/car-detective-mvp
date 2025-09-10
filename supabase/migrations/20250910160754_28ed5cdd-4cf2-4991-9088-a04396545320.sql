-- Fix critical security vulnerability: Enable RLS on public tables
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

-- Create appropriate security policies for each table

-- Reference data tables - public read access
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

-- Data management tables - service role only
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

-- User data tables - user-specific access
CREATE POLICY "Users can manage their own service_history" 
ON public.service_history 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage service_history" 
ON public.service_history 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Users can manage their own vehicles" 
ON public.vehicles 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage vehicles" 
ON public.vehicles 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Audit and lookup tables - secure access
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

CREATE POLICY "Users can view their own vin_lookup_requests" 
ON public.vin_lookup_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create vin_lookup_requests" 
ON public.vin_lookup_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage vin_lookup_requests" 
ON public.vin_lookup_requests 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Add security comments
COMMENT ON TABLE public.market_listing_aggregations IS 
'Aggregated market listing data. RLS enabled with service role access only for security.';

COMMENT ON TABLE public.reference_body_styles IS 
'Reference data for vehicle body styles. Public read access allowed as this is reference data.';

COMMENT ON TABLE public.reference_features IS 
'Reference data for vehicle features. Public read access allowed as this is reference data.';

COMMENT ON TABLE public.reference_trims IS 
'Reference data for vehicle trims. Public read access allowed as this is reference data.';

COMMENT ON TABLE public.service_history IS 
'User vehicle service history. RLS enabled to ensure users can only access their own data.';

COMMENT ON TABLE public.vehicle_makes_models IS 
'Reference data for vehicle makes and models. Public read access allowed as this is reference data.';

COMMENT ON TABLE public.vehicles IS 
'User vehicle data. RLS enabled to ensure users can only access their own vehicles.';

COMMENT ON TABLE public.vin_audit_log IS 
'VIN lookup audit trail. RLS enabled with admin and service role access for security monitoring.';

COMMENT ON TABLE public.vin_decodes IS 
'VIN decode cache data. RLS enabled with service role access only to protect cached data.';

COMMENT ON TABLE public.vin_lookup_requests IS 
'VIN lookup request tracking. RLS enabled to ensure users can only see their own lookup requests.';