-- AIN Valuation Aggregation Engine Schema Expansion
-- Phase 1: Database & Schema Foundation

-- Expand valuation_requests table
ALTER TABLE public.valuation_requests 
ADD COLUMN IF NOT EXISTS condition TEXT,
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS requested_by TEXT DEFAULT 'web',
ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT '{}'::jsonb;

-- Add constraint for requested_by
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valuation_requests_requested_by_check') THEN
        ALTER TABLE public.valuation_requests 
        ADD CONSTRAINT valuation_requests_requested_by_check 
        CHECK (requested_by IN ('web', 'api', 'internal'));
    END IF;
END $$;

-- Update status column to use proper enum values
ALTER TABLE public.valuation_requests 
DROP CONSTRAINT IF EXISTS valuation_requests_status_check;

ALTER TABLE public.valuation_requests 
ADD CONSTRAINT valuation_requests_status_check 
CHECK (status IN ('pending', 'running', 'in_progress', 'completed', 'complete', 'failed'));

-- Expand market_listings table with missing columns
ALTER TABLE public.market_listings 
ADD COLUMN IF NOT EXISTS year INTEGER,
ADD COLUMN IF NOT EXISTS make TEXT,
ADD COLUMN IF NOT EXISTS model TEXT,
ADD COLUMN IF NOT EXISTS trim TEXT,
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS dealer TEXT,
ADD COLUMN IF NOT EXISTS extra JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS cpo BOOLEAN DEFAULT false;

-- Add source_site column for standardization
ALTER TABLE public.market_listings 
ADD COLUMN IF NOT EXISTS source_site TEXT;

-- Copy existing source data to source_site if needed
UPDATE public.market_listings 
SET source_site = source 
WHERE source_site IS NULL AND source IS NOT NULL;

-- Expand valuation_audit_logs table 
ALTER TABLE public.valuation_audit_logs 
ADD COLUMN IF NOT EXISTS action TEXT,
ADD COLUMN IF NOT EXISTS message TEXT,
ADD COLUMN IF NOT EXISTS raw_data JSONB DEFAULT '{}'::jsonb;

-- Copy existing event data to action for consistency
UPDATE public.valuation_audit_logs 
SET action = event 
WHERE action IS NULL AND event IS NOT NULL;

-- Copy error_message to message for consistency
UPDATE public.valuation_audit_logs 
SET message = error_message 
WHERE message IS NULL AND error_message IS NOT NULL;

-- Create additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_valuation_requests_status ON public.valuation_requests(status);
CREATE INDEX IF NOT EXISTS idx_valuation_requests_requested_by ON public.valuation_requests(requested_by);
CREATE INDEX IF NOT EXISTS idx_market_listings_source_site ON public.market_listings(source_site);
CREATE INDEX IF NOT EXISTS idx_market_listings_make_model ON public.market_listings(make, model);
CREATE INDEX IF NOT EXISTS idx_market_listings_year ON public.market_listings(year);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.valuation_audit_logs(action);

-- Update RLS policies for enhanced security
DROP POLICY IF EXISTS "Users can view market listings for their valuations" ON public.market_listings;
CREATE POLICY "Users can view market listings for their valuations"
ON public.market_listings FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.valuation_requests vr
  WHERE vr.id = market_listings.valuation_request_id
  AND vr.user_id = auth.uid()
));

-- Ensure service role policies exist
DO $$
BEGIN
    -- Service role policy for valuation_requests
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'valuation_requests' 
        AND policyname = 'Service role can manage valuation requests'
    ) THEN
        CREATE POLICY "Service role can manage valuation requests"
        ON public.valuation_requests FOR ALL
        USING (auth.role() = 'service_role');
    END IF;

    -- Service role policy for market_listings  
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'market_listings' 
        AND policyname = 'Service role can manage market listings'
    ) THEN
        CREATE POLICY "Service role can manage market listings"
        ON public.market_listings FOR ALL
        USING (auth.role() = 'service_role');
    END IF;

    -- Service role policy for audit_logs
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'valuation_audit_logs' 
        AND policyname = 'Service role can manage audit logs'
    ) THEN
        CREATE POLICY "Service role can manage audit logs"
        ON public.valuation_audit_logs FOR ALL
        USING (auth.role() = 'service_role');
    END IF;
END $$;