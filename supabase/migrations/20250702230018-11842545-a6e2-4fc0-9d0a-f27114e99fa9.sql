-- AIN Valuation Aggregation Engine Schema Expansion  
-- Phase 1: Complete Database Foundation

-- First, fix market_listings structure if needed
DO $$
BEGIN
    -- Add valuation_request_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'market_listings' 
        AND column_name = 'valuation_request_id'
    ) THEN
        ALTER TABLE public.market_listings 
        ADD COLUMN valuation_request_id UUID REFERENCES public.valuation_requests(id) ON DELETE CASCADE;
    END IF;

    -- Add other missing columns to market_listings
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'market_listings' AND column_name = 'vin'
    ) THEN
        ALTER TABLE public.market_listings ADD COLUMN vin TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'market_listings' AND column_name = 'source_type'
    ) THEN
        ALTER TABLE public.market_listings ADD COLUMN source_type TEXT NOT NULL DEFAULT 'unknown';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'market_listings' AND column_name = 'mileage'
    ) THEN
        ALTER TABLE public.market_listings ADD COLUMN mileage INTEGER;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'market_listings' AND column_name = 'condition'
    ) THEN
        ALTER TABLE public.market_listings ADD COLUMN condition TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'market_listings' AND column_name = 'dealer_name'
    ) THEN
        ALTER TABLE public.market_listings ADD COLUMN dealer_name TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'market_listings' AND column_name = 'location'
    ) THEN
        ALTER TABLE public.market_listings ADD COLUMN location TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'market_listings' AND column_name = 'zip_code'
    ) THEN
        ALTER TABLE public.market_listings ADD COLUMN zip_code TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'market_listings' AND column_name = 'listing_url'
    ) THEN
        ALTER TABLE public.market_listings ADD COLUMN listing_url TEXT NOT NULL DEFAULT '#';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'market_listings' AND column_name = 'is_cpo'
    ) THEN
        ALTER TABLE public.market_listings ADD COLUMN is_cpo BOOLEAN DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'market_listings' AND column_name = 'fetched_at'
    ) THEN
        ALTER TABLE public.market_listings ADD COLUMN fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'market_listings' AND column_name = 'raw_data'
    ) THEN
        ALTER TABLE public.market_listings ADD COLUMN raw_data JSONB DEFAULT '{}';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'market_listings' AND column_name = 'confidence_score'
    ) THEN
        ALTER TABLE public.market_listings ADD COLUMN confidence_score NUMERIC DEFAULT 85;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'market_listings' AND column_name = 'notes'
    ) THEN
        ALTER TABLE public.market_listings ADD COLUMN notes TEXT;
    END IF;
END $$;

-- Now expand valuation_requests table
ALTER TABLE public.valuation_requests 
ADD COLUMN IF NOT EXISTS condition TEXT,
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS requested_by TEXT DEFAULT 'web',
ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT '{}'::jsonb;

-- Add remaining market_listings columns for AIN spec
ALTER TABLE public.market_listings 
ADD COLUMN IF NOT EXISTS year INTEGER,
ADD COLUMN IF NOT EXISTS make TEXT,
ADD COLUMN IF NOT EXISTS model TEXT,
ADD COLUMN IF NOT EXISTS trim TEXT,
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS dealer TEXT,
ADD COLUMN IF NOT EXISTS extra JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS cpo BOOLEAN DEFAULT false,
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

-- Copy existing data for consistency
UPDATE public.valuation_audit_logs 
SET action = event 
WHERE action IS NULL AND event IS NOT NULL;

UPDATE public.valuation_audit_logs 
SET message = error_message 
WHERE message IS NULL AND error_message IS NOT NULL;

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_valuation_requests_status ON public.valuation_requests(status);
CREATE INDEX IF NOT EXISTS idx_valuation_requests_requested_by ON public.valuation_requests(requested_by);
CREATE INDEX IF NOT EXISTS idx_market_listings_valuation_request_id ON public.market_listings(valuation_request_id);
CREATE INDEX IF NOT EXISTS idx_market_listings_source_site ON public.market_listings(source_site);
CREATE INDEX IF NOT EXISTS idx_market_listings_make_model ON public.market_listings(make, model);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.valuation_audit_logs(action);