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

-- Create valuation_requests table to track orchestration requests
CREATE TABLE IF NOT EXISTS public.valuation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_params JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  comp_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID
);

-- Create valuation_audit_logs table for transparency
CREATE TABLE IF NOT EXISTS public.valuation_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  valuation_request_id UUID,
  action TEXT NOT NULL,
  message TEXT,
  input_data JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.market_comps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view market comps for their requests" ON market_comps
  FOR SELECT USING (
    valuation_request_id IN (
      SELECT id FROM valuation_requests WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage market comps" ON market_comps
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users can manage their valuation requests" ON valuation_requests
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Service role can manage valuation requests" ON valuation_requests
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users can view audit logs for their requests" ON valuation_audit_logs
  FOR SELECT USING (
    valuation_request_id IN (
      SELECT id FROM valuation_requests WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage audit logs" ON valuation_audit_logs
  FOR ALL USING (auth.role() = 'service_role');