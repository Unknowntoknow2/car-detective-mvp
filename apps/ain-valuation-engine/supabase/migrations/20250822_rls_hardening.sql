-- ========================================
-- Step 1: Enable Row-Level Security
-- ========================================
ALTER TABLE public.valuation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enhanced_market_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_features ENABLE ROW LEVEL SECURITY;

-- ========================================
-- Step 2: Secure Functions
-- ========================================
ALTER FUNCTION public.submit_followup SET search_path = public;
ALTER FUNCTION public.run_valuation SET search_path = public;

-- ========================================
-- Step 3: Policies
-- Users can only see their own data
CREATE POLICY "Users can view own valuations"
ON public.valuation_results
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own valuations"
ON public.valuation_results
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Followups
CREATE POLICY "Users can view own followups"
ON public.followups
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own followups"
ON public.followups
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Reference tables: read-only public
CREATE POLICY "Public can read enhanced_market_listings"
ON public.enhanced_market_listings
FOR SELECT
TO anon, authenticated
USING (true);

-- Premium features: only premium role
CREATE POLICY "Premium role can access premium_features"
ON public.premium_features
FOR SELECT, INSERT, UPDATE, DELETE
TO premium
USING (true)
WITH CHECK (true);

-- Admin full access
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;

-- ========================================
-- Step 4: Indexes for Performance
-- (ensures RLS checks run efficiently)
CREATE INDEX IF NOT EXISTS idx_valuation_results_user_id ON public.valuation_results(user_id);
CREATE INDEX IF NOT EXISTS idx_followups_user_id ON public.followups(user_id);

-- ========================================
-- Step 5: Audit Logging
COMMENT ON TABLE public.valuation_audits IS 'Logs all valuation events for auditing';
