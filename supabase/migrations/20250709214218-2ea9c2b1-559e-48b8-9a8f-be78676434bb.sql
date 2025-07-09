-- Add missing columns to valuations table to match ValuationContext expectations
ALTER TABLE public.valuations 
ADD COLUMN IF NOT EXISTS adjustments JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS price_range_low NUMERIC,
ADD COLUMN IF NOT EXISTS price_range_high NUMERIC,
ADD COLUMN IF NOT EXISTS vehicle_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS condition TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS dataSource JSONB DEFAULT '{}'::jsonb;

-- Add indexes for performance on commonly queried columns
CREATE INDEX IF NOT EXISTS idx_valuations_condition ON public.valuations(condition);
CREATE INDEX IF NOT EXISTS idx_valuations_zip_code ON public.valuations(zip_code);
CREATE INDEX IF NOT EXISTS idx_valuations_price_range ON public.valuations(price_range_low, price_range_high);