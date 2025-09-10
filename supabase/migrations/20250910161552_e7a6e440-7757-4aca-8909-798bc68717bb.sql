-- Fix critical security vulnerability: Secure valuations table
-- Remove dangerous policy that allows access to all non-premium valuations

-- Drop the problematic policy that exposes all customer data
DROP POLICY IF EXISTS "Users can only access premium_unlocked valuations they own or s" ON public.valuations;

-- Drop other potentially conflicting policies to ensure clean state
DROP POLICY IF EXISTS "Users can create valuations" ON public.valuations;
DROP POLICY IF EXISTS "Users can insert their own valuations" ON public.valuations; 
DROP POLICY IF EXISTS "Users can insert valuations" ON public.valuations;
DROP POLICY IF EXISTS "Users can only access their own valuations" ON public.valuations;
DROP POLICY IF EXISTS "Users can update own valuations" ON public.valuations;
DROP POLICY IF EXISTS "Users can update their own valuations" ON public.valuations;
DROP POLICY IF EXISTS "Users can delete own valuations" ON public.valuations;

-- Keep admin and service role policies (these are secure)
-- "Admins can read all valuations" - OK
-- "Admins can view all valuations" - OK  
-- "Service role can manage all valuations" - OK

-- Create secure policies for valuations table

-- 1. Users can only view their own valuations (strict user ownership)
CREATE POLICY "Users can view their own valuations only" 
ON public.valuations 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 2. Authenticated users can create valuations (with proper ownership)
CREATE POLICY "Authenticated users can create valuations" 
ON public.valuations 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 3. Users can update their own valuations only
CREATE POLICY "Users can update their own valuations only" 
ON public.valuations 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 4. Users can delete their own valuations only
CREATE POLICY "Users can delete their own valuations only" 
ON public.valuations 
FOR DELETE 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Add security documentation
COMMENT ON TABLE public.valuations IS 
'Vehicle valuations containing sensitive customer data including VINs, license plates, and location information. RLS enabled to prevent unauthorized access to customer vehicle data. Access restricted to data owners, admins, and service operations only. CRITICAL: Never allow public access to this sensitive data.';

-- Add constraint to ensure user_id is always set for new records (prevent orphaned data)
ALTER TABLE public.valuations 
ADD CONSTRAINT valuations_user_id_required 
CHECK (user_id IS NOT NULL);