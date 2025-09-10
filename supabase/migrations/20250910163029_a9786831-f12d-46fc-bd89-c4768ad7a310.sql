-- CRITICAL SECURITY FIX Phase 2: Secure sensitive tables based on actual schema
-- Fix policies based on actual column structure

-- =============================================
-- FIX 1: Secure valuations table (HAS user_id column)
-- =============================================

-- Remove dangerous public/anonymous access policies
DROP POLICY IF EXISTS "Public can read valuations" ON public.valuations;
DROP POLICY IF EXISTS "Anonymous users can create valuations" ON public.valuations;
DROP POLICY IF EXISTS "Allow anonymous valuation creation" ON public.valuations;

-- Create secure authenticated access only
CREATE POLICY "Users can view their own valuations only" 
ON public.valuations 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can create their own valuations" 
ON public.valuations 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can update their own valuations" 
ON public.valuations 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Admin access for support/debugging
CREATE POLICY "Admins can manage all valuations" 
ON public.valuations 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- =============================================
-- FIX 2: Secure market_listings table (use valuation_id relationship)
-- =============================================

-- Remove overly permissive policies
DROP POLICY IF EXISTS "Public read access to market listings" ON public.market_listings;
DROP POLICY IF EXISTS "Allow public read access" ON public.market_listings;

-- Create restricted access through valuation ownership
CREATE POLICY "Users can view market listings for their valuations" 
ON public.market_listings 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    EXISTS (
      SELECT 1 FROM valuations 
      WHERE valuations.id = market_listings.valuation_id 
      AND valuations.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND (role IN ('premium', 'dealer', 'admin') OR is_premium_dealer = true)
    )
  )
);

-- Service role access for data updates
CREATE POLICY "Service role can manage market listings" 
ON public.market_listings 
FOR ALL 
USING (auth.role() = 'service_role');

-- =============================================
-- FIX 3: Secure competitor_prices (restrict to premium users)
-- =============================================

-- Remove public read access
DROP POLICY IF EXISTS "Allow public read access to competitor prices" ON public.competitor_prices;

-- Create restricted access
CREATE POLICY "Premium users can view competitor prices" 
ON public.competitor_prices 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND (role IN ('premium', 'dealer', 'admin') OR is_premium_dealer = true)
    )
  )
);

-- =============================================
-- FIX 4: Secure plate_lookups table (no user_id - restrict to authenticated users)
-- =============================================

-- Remove public access
DROP POLICY IF EXISTS "Public read access to plate_lookups" ON public.plate_lookups;

-- Create authenticated-only access (since no user ownership tracking)
CREATE POLICY "Authenticated users can read plate lookups" 
ON public.plate_lookups 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create plate lookups" 
ON public.plate_lookups 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- =============================================
-- FIX 5: Remove anonymous access to follow_up_answers
-- =============================================

-- Remove anonymous creation policy
DROP POLICY IF EXISTS "Anonymous users can create temporary follow_up_answers" ON public.follow_up_answers;

-- =============================================
-- Add security documentation
-- =============================================

COMMENT ON TABLE public.valuations IS 
'CONFIDENTIAL: Contains customer financial data and proprietary valuations. Strictly user-owned access only.';

COMMENT ON TABLE public.market_listings IS 
'BUSINESS SENSITIVE: Contains competitive market intelligence. Access through valuation ownership or premium status.';

COMMENT ON TABLE public.competitor_prices IS 
'TRADE SECRET: Contains competitor pricing intelligence. Access restricted to premium users only.';

COMMENT ON TABLE public.plate_lookups IS 
'SENSITIVE: Vehicle lookup data. Access restricted to authenticated users only.';

-- Create performance indexes for secure lookups
CREATE INDEX IF NOT EXISTS idx_valuations_user_id ON public.valuations(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_market_listings_valuation_lookup ON public.market_listings(valuation_id);

-- Security audit log
INSERT INTO compliance_audit_log (
  entity_type, entity_id, action, user_id, 
  input_data, compliance_flags, created_at
) VALUES (
  'security_hardening', gen_random_uuid(), 'rls_policy_update', 
  NULL, '{"tables_secured": ["valuations", "market_listings", "competitor_prices", "plate_lookups"]}',
  ARRAY['data_protection', 'access_control'], now()
);