
-- Fix the database schema issues to support real market data

-- 1. Create the missing valuations_uuid table that ResultsPage.tsx is trying to query
CREATE TABLE IF NOT EXISTS public.valuations_uuid (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vin TEXT,
  user_id UUID REFERENCES auth.users(id),
  make TEXT,
  model TEXT,
  year INTEGER,
  mileage INTEGER,
  condition TEXT,
  estimated_value NUMERIC,
  confidence_score NUMERIC,
  base_price NUMERIC,
  state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_vin_lookup BOOLEAN DEFAULT false,
  value_breakdown JSONB DEFAULT '{}',
  market_data JSONB DEFAULT '{}',
  data_source TEXT DEFAULT 'enhanced_engine'
);

-- 2. Ensure enhanced_market_listings table has all required columns
ALTER TABLE public.enhanced_market_listings 
ADD COLUMN IF NOT EXISTS extra JSONB DEFAULT '{}';

-- 3. Add RLS policies for valuations_uuid
ALTER TABLE public.valuations_uuid ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own valuations_uuid" 
ON public.valuations_uuid FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own valuations_uuid" 
ON public.valuations_uuid FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own valuations_uuid" 
ON public.valuations_uuid FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Service role can manage valuations_uuid" 
ON public.valuations_uuid FOR ALL 
USING (auth.role() = 'service_role');

-- 4. Create index for VIN lookups
CREATE INDEX IF NOT EXISTS idx_valuations_uuid_vin ON public.valuations_uuid(vin);
CREATE INDEX IF NOT EXISTS idx_valuations_uuid_user_id ON public.valuations_uuid(user_id);
