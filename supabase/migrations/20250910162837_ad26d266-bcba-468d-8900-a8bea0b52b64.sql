-- CRITICAL SECURITY FIX Phase 2: Secure publicly exposed sensitive tables
-- This prevents unauthorized access to customer data and business intelligence

-- =============================================
-- FIX 1: Secure plate_lookups table (contains sensitive search data)
-- =============================================

-- Remove dangerous public access policy
DROP POLICY IF EXISTS "Public read access to plate_lookups" ON public.plate_lookups;

-- Create secure user-only access
CREATE POLICY "Users can view their own plate lookups only" 
ON public.plate_lookups 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can create their own plate lookups" 
ON public.plate_lookups 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- =============================================
-- FIX 2: Secure valuations table (contains customer financial data)
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
-- FIX 3: Secure market_listings table (contains competitive intelligence)
-- =============================================

-- Remove overly permissive policies
DROP POLICY IF EXISTS "Public read access to market listings" ON public.market_listings;
DROP POLICY IF EXISTS "Allow public read access" ON public.market_listings;

-- Create restricted access - only for premium users and admins
CREATE POLICY "Premium users can view market listings" 
ON public.market_listings 
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

-- Service role access for data updates
CREATE POLICY "Service role can manage market listings" 
ON public.market_listings 
FOR ALL 
USING (auth.role() = 'service_role');

-- =============================================
-- FIX 4: Remove anonymous access to follow_up_answers
-- =============================================

-- Remove anonymous creation policy
DROP POLICY IF EXISTS "Anonymous users can create temporary follow_up_answers" ON public.follow_up_answers;

-- =============================================
-- FIX 5: Secure competitor_prices (business intelligence)
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
-- Add security documentation
-- =============================================

COMMENT ON TABLE public.plate_lookups IS 
'CONFIDENTIAL: Contains sensitive user search data. Access restricted to data owners only.';

COMMENT ON TABLE public.valuations IS 
'CONFIDENTIAL: Contains customer financial data and proprietary valuations. Strictly user-owned access only.';

COMMENT ON TABLE public.market_listings IS 
'BUSINESS SENSITIVE: Contains competitive market intelligence. Access restricted to premium users only.';

COMMENT ON TABLE public.competitor_prices IS 
'TRADE SECRET: Contains competitor pricing intelligence. Access restricted to premium users only.';

-- Create performance indexes for secure lookups
CREATE INDEX IF NOT EXISTS idx_plate_lookups_user_id ON public.plate_lookups(user_id);
CREATE INDEX IF NOT EXISTS idx_valuations_user_id ON public.valuations(user_id);
CREATE INDEX IF NOT EXISTS idx_market_listings_premium_lookup ON public.market_listings(source, updated_at);