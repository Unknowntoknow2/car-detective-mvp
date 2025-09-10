-- Fix critical security vulnerability: Secure decoded_vehicles table
-- Remove public access to VIN data while maintaining legitimate functionality

-- Drop all existing overly permissive policies
DROP POLICY IF EXISTS "Allow all read" ON public.decoded_vehicles;
DROP POLICY IF EXISTS "Allow anon read" ON public.decoded_vehicles;
DROP POLICY IF EXISTS "Allow public access to decoded_vehicles" ON public.decoded_vehicles;

-- Create secure, restrictive policies for decoded_vehicles

-- 1. Authenticated users can read decoded vehicle data for legitimate VIN lookups
CREATE POLICY "Authenticated users can read decoded vehicles" 
ON public.decoded_vehicles 
FOR SELECT 
TO authenticated
USING (true);

-- 2. Service role can manage all decoded vehicle data
CREATE POLICY "Service role can manage decoded vehicles" 
ON public.decoded_vehicles 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 3. Allow specific authenticated operations for VIN decoding functionality
-- This supports the core application functionality while maintaining security
CREATE POLICY "Authenticated VIN lookups only" 
ON public.decoded_vehicles 
FOR SELECT 
TO authenticated
USING (
  -- Only allow if user is authenticated (no anonymous browsing of all VINs)
  auth.uid() IS NOT NULL
);

-- Ensure RLS is enabled (should already be enabled but making sure)
ALTER TABLE public.decoded_vehicles ENABLE ROW LEVEL SECURITY;

-- Add security comment
COMMENT ON TABLE public.decoded_vehicles IS 
'Contains VIN decoding data. Access restricted to authenticated users only to prevent unauthorized VIN data harvesting. No anonymous access permitted to protect vehicle owner privacy.';