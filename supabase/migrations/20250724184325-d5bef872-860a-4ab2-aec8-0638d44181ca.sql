-- CRITICAL FIX: Fix infinite recursion in user_roles RLS policies
-- First, drop the problematic policies that are causing infinite recursion
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Service role can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Service role can manage all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles only" ON public.user_roles;

-- Create a security definer function to safely get user role without circular reference
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role::TEXT FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Create a security definer function to check if user is admin
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

-- Recreate safe RLS policies using the security definer functions
CREATE POLICY "Users can view their own roles only" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage user roles" 
ON public.user_roles 
FOR ALL 
USING (public.is_current_user_admin());

CREATE POLICY "Service role can manage all user roles" 
ON public.user_roles 
FOR ALL 
USING (auth.role() = 'service_role');

-- Fix RLS disabled tables by enabling RLS on public tables without it
ALTER TABLE public.manual_entry_valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_entry_valuations FORCE ROW LEVEL SECURITY;

-- Create basic RLS policy for manual_entry_valuations
CREATE POLICY "Users can manage their own manual valuations" 
ON public.manual_entry_valuations 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Enable anonymous access for follow_up_answers creation (needed for anonymous valuations)
CREATE POLICY "Anonymous users can create follow_up_answers" 
ON public.follow_up_answers 
FOR INSERT 
WITH CHECK (user_id IS NULL);

-- Enable RLS on other critical tables if missing
DO $$
BEGIN
    -- Check and enable RLS on critical tables
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'valuations' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.valuations ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;