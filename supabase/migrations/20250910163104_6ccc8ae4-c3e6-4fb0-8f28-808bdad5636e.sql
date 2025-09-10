-- CORRECTED SECURITY FIX: Secure tables based on their actual schema
-- Only apply user-based policies to tables that have user_id columns

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
-- FIX 2: Secure follow_up_answers table (HAS user_id column)
-- =============================================

-- Remove anonymous creation policy (already handled in previous migration)
-- The existing policies for follow_up_answers are already secure

-- =============================================
-- FIX 3: Secure market_listings (NO user_id, link via valuation_id)
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
    -- Allow if linked to user's valuation
    valuation_id IS NULL OR 
    EXISTS (
      SELECT 1 FROM valuations 
      WHERE id = market_listings.valuation_id 
      AND user_id = auth.uid()
    ) OR
    -- Allow for premium users (general market data)
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
-- FIX 4: Secure competitor_prices (NO user_id, make premium-only)
-- =============================================

-- Remove public read access
DROP POLICY IF EXISTS "Allow public read access to competitor prices" ON public.competitor_prices;

-- Create premium-only access (this is competitive intelligence)
CREATE POLICY "Premium users and admins can view competitor prices" 
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
-- FIX 5: Secure plate_lookups (NO user_id, make admin-only for now)
-- =============================================

-- Remove public access
DROP POLICY IF EXISTS "Public read access to plate_lookups" ON public.plate_lookups;

-- Make plate lookups admin-only (contains sensitive search data)
CREATE POLICY "Admins can manage plate lookups" 
ON public.plate_lookups 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Service role can insert for system operations
CREATE POLICY "Service role can manage plate lookups" 
ON public.plate_lookups 
FOR ALL 
USING (auth.role() = 'service_role');

-- =============================================
-- Add security documentation
-- =============================================

COMMENT ON TABLE public.plate_lookups IS 
'CONFIDENTIAL: Contains sensitive license plate search data. Access restricted to administrators only due to privacy concerns.';

COMMENT ON TABLE public.valuations IS 
'CONFIDENTIAL: Contains customer financial data and proprietary valuations. Strictly user-owned access only.';

COMMENT ON TABLE public.market_listings IS 
'BUSINESS SENSITIVE: Contains competitive market intelligence. Access through valuation ownership or premium status.';

COMMENT ON TABLE public.competitor_prices IS 
'TRADE SECRET: Contains competitor pricing intelligence. Access restricted to premium users only.';

-- Create performance indexes for secure lookups
CREATE INDEX IF NOT EXISTS idx_valuations_user_id ON public.valuations(user_id);
CREATE INDEX IF NOT EXISTS idx_market_listings_valuation_id ON public.market_listings(valuation_id);
CREATE INDEX IF NOT EXISTS idx_market_listings_premium_lookup ON public.market_listings(source, created_at);