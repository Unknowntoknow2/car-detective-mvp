-- Create market_comps table for comprehensive market data
CREATE TABLE IF NOT EXISTS public.market_comps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  valuation_request_id UUID,
  source TEXT NOT NULL,
  source_type TEXT NOT NULL,
  vin TEXT,
  year INTEGER,
  make TEXT,
  model TEXT,
  trim TEXT,
  price NUMERIC NOT NULL,
  mileage INTEGER,
  condition TEXT DEFAULT 'used',
  dealer_name TEXT,
  location TEXT,
  listing_url TEXT DEFAULT '#',
  is_cpo BOOLEAN DEFAULT false,
  incentives TEXT,
  features JSONB DEFAULT '{}',
  confidence_score INTEGER DEFAULT 85,
  raw_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_market_comps_valuation_request ON market_comps(valuation_request_id);
CREATE INDEX IF NOT EXISTS idx_market_comps_vehicle ON market_comps(year, make, model);
CREATE INDEX IF NOT EXISTS idx_market_comps_source ON market_comps(source, source_type);
CREATE INDEX IF NOT EXISTS idx_market_comps_price ON market_comps(price);

-- Enable RLS for market_comps
ALTER TABLE public.market_comps ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for market_comps
CREATE POLICY "Users can view market comps for their requests" ON market_comps
  FOR SELECT USING (
    valuation_request_id IN (
      SELECT id FROM valuation_requests WHERE user_id = auth.uid()
    ) OR auth.role() = 'service_role'
  );

CREATE POLICY "Service role can manage market comps" ON market_comps
  FOR ALL USING (auth.role() = 'service_role');