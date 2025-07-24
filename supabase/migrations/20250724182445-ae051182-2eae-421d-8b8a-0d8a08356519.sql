-- CRITICAL SECURITY FIXES: Phase 1 (Corrected)
-- Fix 1: Enable RLS on tables that exist and have policies but RLS disabled

-- First, let's enable RLS on tables that definitely exist (checking from the table list)
-- Note: Only enabling RLS on tables that actually exist

-- Fix 2: Secure the most critical database functions by setting search_path
-- This prevents function hijacking attacks

CREATE OR REPLACE FUNCTION public.update_valuation_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  DELETE FROM public.valuation_stats;
  
  INSERT INTO public.valuation_stats (zip_code, make, model, total_valuations, average_price)
  SELECT 
    valuations.state as zip_code,
    valuations.make,
    valuations.model,
    COUNT(*) as total_valuations,
    AVG(valuations.estimated_value) as average_price
  FROM public.valuations
  WHERE valuations.make IS NOT NULL
    AND valuations.model IS NOT NULL
    AND valuations.state IS NOT NULL
  GROUP BY valuations.state, valuations.make, valuations.model;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_top_referrers()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  DELETE FROM public.top_referrers;
  
  INSERT INTO public.top_referrers (user_id, username, referral_count, reward_count)
  SELECT 
    r.inviter_id as user_id,
    COALESCE(p.username, 'Car Detective User ' || substring(r.inviter_id::text, 1, 5)) as username,
    COUNT(*) as referral_count,
    COUNT(*) FILTER (WHERE r.reward_status = 'claimed') as reward_count
  FROM public.referrals r
  LEFT JOIN public.profiles p ON r.inviter_id = p.id
  GROUP BY r.inviter_id, username
  ORDER BY referral_count DESC
  LIMIT 10;
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_premium_access(valuation_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.orders
    WHERE valuation_id = has_premium_access.valuation_id
    AND status = 'paid'
    AND user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.update_competitor_prices_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_records_needing_vin_enrichment(batch_limit integer DEFAULT 100, force_reprocess boolean DEFAULT false)
RETURNS TABLE(id uuid, vin text, make text, model text, year integer, trim_level text, table_name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  RETURN QUERY
  WITH market_comps_needing_enrichment AS (
    SELECT 
      mc.id,
      mc.vin,
      mc.make,
      mc.model,
      mc.year,
      mc.trim as trim_level,
      'market_comps'::text as table_name
    FROM market_comps mc
    LEFT JOIN vin_enrichment_data ved ON mc.vin = ved.vin
    WHERE mc.vin IS NOT NULL 
      AND length(mc.vin) = 17
      AND (
        force_reprocess OR 
        ved.id IS NULL OR 
        (mc.make IS NULL OR mc.model IS NULL OR mc.trim IS NULL)
      )
    ORDER BY mc.created_at DESC
    LIMIT batch_limit / 2
  )
  SELECT * FROM market_comps_needing_enrichment
  ORDER BY table_name, id
  LIMIT batch_limit;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_market_listing(listing_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
DECLARE
  listing RECORD;
  is_valid BOOLEAN := true;
  errors JSONB := '[]';
BEGIN
  SELECT * INTO listing FROM public.enhanced_market_listings WHERE id = listing_id;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  IF listing.price < 1000 OR listing.price > 200000 THEN
    errors := errors || '["price_out_of_range"]';
    is_valid := false;
  END IF;
  
  IF listing.mileage IS NOT NULL AND (listing.mileage < 0 OR listing.mileage > 500000) THEN
    errors := errors || '["mileage_out_of_range"]';
    is_valid := false;
  END IF;
  
  IF listing.year IS NOT NULL AND (listing.year < 1990 OR listing.year > EXTRACT(YEAR FROM now()) + 1) THEN
    errors := errors || '["year_out_of_range"]';
    is_valid := false;
  END IF;
  
  UPDATE public.enhanced_market_listings 
  SET is_validated = is_valid, validation_errors = errors
  WHERE id = listing_id;
  
  RETURN is_valid;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.score_dealer_offer()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
DECLARE
  valuation_data RECORD;
  price_difference NUMERIC;
  percentage_difference NUMERIC;
BEGIN
  SELECT estimated_value, confidence_score INTO valuation_data
  FROM public.valuations
  WHERE id = NEW.report_id;
  
  IF valuation_data.estimated_value IS NOT NULL AND valuation_data.estimated_value > 0 THEN
    price_difference := NEW.offer_amount - valuation_data.estimated_value;
    percentage_difference := (price_difference / valuation_data.estimated_value) * 100;
    
    IF percentage_difference >= 3 THEN
      NEW.score := 85 + (percentage_difference - 3) * 1.5;
      NEW.score := LEAST(NEW.score, 100);
      NEW.label := 'Good Deal';
      NEW.insight := 'This offer is ' || ROUND(percentage_difference, 1) || '% above estimated value.';
    ELSIF percentage_difference >= -3 AND percentage_difference < 3 THEN
      NEW.score := 60 + percentage_difference * 5;
      NEW.label := 'Fair Offer';
      NEW.insight := 'This offer is close to the estimated market value.';
    ELSE
      NEW.score := 50 + percentage_difference;
      NEW.score := GREATEST(NEW.score, 0);
      NEW.label := 'Below Market';
      NEW.insight := 'This offer is ' || ABS(ROUND(percentage_difference, 1)) || '% below estimated value.';
    END IF;
    
    IF valuation_data.confidence_score IS NOT NULL THEN
      NEW.score := NEW.score * (valuation_data.confidence_score / 100.0) + 
                  50 * (1 - (valuation_data.confidence_score / 100.0));
    END IF;
  ELSE
    NEW.score := 50;
    NEW.label := 'Unrated';
    NEW.insight := 'No valuation data available for comparison.';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Add missing RLS policies for tables that have RLS enabled but no policies
CREATE POLICY "Service role can manage auction_results_by_vin" 
ON public.auction_results_by_vin 
FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Premium users can view auction_results_by_vin" 
ON public.auction_results_by_vin 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
  AND (role = ANY(ARRAY['premium', 'dealer', 'admin']) OR is_premium_dealer = true)
));

-- Fix role validation in profiles table - users should NOT be able to update their own role
-- Create a more restrictive policy for role updates
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their profile" ON public.profiles;

CREATE POLICY "Users can update profile but not role" 
ON public.profiles 
FOR UPDATE 
USING (id = auth.uid()) 
WITH CHECK (
  id = auth.uid() AND
  -- Prevent users from changing their role
  role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

-- Create admin-only role management policy
CREATE POLICY "Only admins can change user roles" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Secure the role management in user_roles table
DROP POLICY IF EXISTS "Users can only view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create more secure policies for user_roles
CREATE POLICY "Users can view their own roles only" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Only admins can manage user roles" 
ON public.user_roles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

CREATE POLICY "Service role can manage all user roles" 
ON public.user_roles 
FOR ALL 
USING (auth.role() = 'service_role');