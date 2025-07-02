-- Fix market_listings table structure to match specification
-- Add missing columns for complete market comp tracking

ALTER TABLE public.market_listings 
ADD COLUMN IF NOT EXISTS valuation_request_id UUID REFERENCES public.valuation_requests(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS vin TEXT,
ADD COLUMN IF NOT EXISTS source_type TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN IF NOT EXISTS mileage INTEGER,
ADD COLUMN IF NOT EXISTS condition TEXT,
ADD COLUMN IF NOT EXISTS dealer_name TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS listing_url TEXT NOT NULL DEFAULT '#',
ADD COLUMN IF NOT EXISTS screenshot_url TEXT,
ADD COLUMN IF NOT EXISTS is_cpo BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
ADD COLUMN IF NOT EXISTS raw_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS confidence_score NUMERIC DEFAULT 85,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Rename existing columns to match specification
ALTER TABLE public.market_listings 
RENAME COLUMN valuation_id TO valuation_request_id_temp;

-- Drop the temp column and use the new one
ALTER TABLE public.market_listings 
DROP COLUMN IF EXISTS valuation_request_id_temp;

-- Update the url column name to listing_url if needed
ALTER TABLE public.market_listings 
RENAME COLUMN url TO listing_url;