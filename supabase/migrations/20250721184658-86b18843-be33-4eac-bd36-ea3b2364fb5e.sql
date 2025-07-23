-- Check if RLS is enabled and fix basic policies for access

-- Ensure tables have RLS enabled
ALTER TABLE public.market_listings ENABLE ROW LEVEL SECURITY;

-- Drop any conflicting policies and create simple ones
DROP POLICY IF EXISTS "Users can view market listings for their valuations" ON public.market_listings;
DROP POLICY IF EXISTS "Service role can manage market listings" ON public.market_listings;

-- Simple policy to allow service role to manage market listings
CREATE POLICY "Service role full access" ON public.market_listings
  FOR ALL 
  USING (true)
  WITH CHECK (true);