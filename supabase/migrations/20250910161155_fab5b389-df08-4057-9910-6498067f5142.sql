-- Fix critical security vulnerability: Secure vpic_cache table
-- Remove public access to prevent theft of detailed vehicle specifications and VIN data

-- Drop the dangerous public access policy
DROP POLICY IF EXISTS "Anyone can select from vpic_cache" ON public.vpic_cache;

-- Create secure policies for vpic_cache table

-- 1. Service role can manage all cache data for system operations
CREATE POLICY "Service role can manage vpic_cache" 
ON public.vpic_cache 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 2. Authenticated users can read cached VIN data (controlled access)
CREATE POLICY "Authenticated users can read vpic_cache" 
ON public.vpic_cache 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 3. Admins can view all cached data for debugging and support
CREATE POLICY "Admins can view vpic_cache" 
ON public.vpic_cache 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Add security documentation
COMMENT ON TABLE public.vpic_cache IS 
'VIN decode cache containing sensitive vehicle specifications and identification data. RLS enabled to prevent unauthorized access to detailed vehicle data that could be used for fraudulent purposes. Access restricted to authenticated users and service operations only.';