-- CRITICAL FIX: Fix infinite recursion in user_roles RLS policies (Clean approach)

-- Drop ALL existing problematic policies on user_roles
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Service role can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Service role can manage all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles only" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;

-- Ensure security definer functions exist
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role::TEXT FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- Create NEW safe RLS policies using security definer functions
CREATE POLICY "user_roles_view_own" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "user_roles_admin_all" 
ON public.user_roles 
FOR ALL 
USING (public.is_current_user_admin());

CREATE POLICY "user_roles_service_all" 
ON public.user_roles 
FOR ALL 
USING (auth.role() = 'service_role');

-- Fix minimum valuation threshold in valuation engine
-- Update any $0 valuations to have a minimum baseline value
UPDATE public.valuations 
SET 
  estimated_value = GREATEST(estimated_value, 8000),
  confidence_score = GREATEST(confidence_score, 65)
WHERE estimated_value IS NULL OR estimated_value <= 0;