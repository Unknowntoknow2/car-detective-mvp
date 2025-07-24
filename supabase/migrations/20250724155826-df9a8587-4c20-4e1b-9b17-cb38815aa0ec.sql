-- CRITICAL SECURITY FIXES - Phase 1
-- Fix tables with policies but RLS disabled (ERROR level issues)

-- 1. Enable RLS on tables that have policies but RLS is disabled
ALTER TABLE public.equipment_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driving_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warranty_options ENABLE ROW LEVEL SECURITY;

-- 2. Fix critical tables without RLS enabled
ALTER TABLE public.market_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_comps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_context_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_listings ENABLE ROW LEVEL SECURITY;

-- 3. Add proper RLS policies for tables without any policies (but only for critical ones)
-- Equipment options - read-only for everyone, admin can manage
CREATE POLICY "Allow public read access to equipment_options" ON public.equipment_options
FOR SELECT USING (true);

CREATE POLICY "Admin can manage equipment_options" ON public.equipment_options
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Driving profile - read-only for everyone, admin can manage  
CREATE POLICY "Allow public read access to driving_profile" ON public.driving_profile
FOR SELECT USING (true);

CREATE POLICY "Admin can manage driving_profile" ON public.driving_profile
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 4. Fix function search paths (security issue)
CREATE OR REPLACE FUNCTION public.clean_old_zip_validations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  DELETE FROM public.zip_validations 
  WHERE valid_at < NOW() - INTERVAL '30 days';
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_vehicle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_on_new_offer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Here you would insert into a notifications table or trigger an email
  -- For now, just logging the event
  RAISE NOTICE 'New offer created: %', NEW.id;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_premium_access_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 5. Create security definer function for role checking to prevent recursive RLS
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$function$;

-- 6. Remove overly permissive anonymous access from critical tables
-- Replace "true" policies with proper authentication checks

-- Remove dangerous anonymous access from profiles table
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view other profiles limited info" ON public.profiles  
FOR SELECT USING (auth.role() = 'authenticated');

-- Secure user_roles table - critical for authorization
DROP POLICY IF EXISTS "Allow user to read own roles" ON public.user_roles;
CREATE POLICY "Users can only view their own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles" ON public.user_roles
FOR ALL USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

-- Secure valuations table - core business data
DROP POLICY IF EXISTS "Users can read their own valuations" ON public.valuations;
DROP POLICY IF EXISTS "Users can view their own valuations" ON public.valuations;

CREATE POLICY "Users can only access their own valuations" ON public.valuations
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all valuations" ON public.valuations
FOR SELECT USING (public.is_current_user_admin());

-- 7. Secure orders table - payment information
DROP POLICY IF EXISTS "Users can read their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

CREATE POLICY "Users can only access their own orders" ON public.orders
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders for support" ON public.orders
FOR SELECT USING (public.is_current_user_admin());

-- 8. Secure premium access table
DROP POLICY IF EXISTS "Users can view their own premium access" ON public.premium_access;

CREATE POLICY "Users can only access their own premium data" ON public.premium_access
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);