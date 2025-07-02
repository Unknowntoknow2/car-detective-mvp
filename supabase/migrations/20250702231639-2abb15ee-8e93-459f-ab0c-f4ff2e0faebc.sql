-- Create valuation_requests table for tracking all valuation requests
CREATE TABLE IF NOT EXISTS public.valuation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  vin TEXT,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  trim TEXT,
  year INTEGER NOT NULL,
  mileage INTEGER,
  zip_code TEXT,
  condition TEXT,
  features TEXT[] DEFAULT '{}',
  requested_by TEXT DEFAULT 'web',
  meta JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  request_params JSONB,
  comp_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comprehensive market_comps table for all source data
CREATE TABLE IF NOT EXISTS public.market_comps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  valuation_request_id UUID REFERENCES public.valuation_requests(id),
  source TEXT NOT NULL,
  source_type TEXT NOT NULL, -- 'marketplace', 'dealer', 'auction', 'book_value'
  vin TEXT,
  year INTEGER,
  make TEXT,
  model TEXT,
  trim TEXT,
  price NUMERIC NOT NULL,
  mileage INTEGER,
  condition TEXT,
  dealer_name TEXT,
  location TEXT,
  listing_url TEXT NOT NULL,
  is_cpo BOOLEAN DEFAULT FALSE,
  incentives TEXT,
  features JSONB DEFAULT '{}',
  date_fetched TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confidence_score NUMERIC DEFAULT 85,
  raw_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create valuation_results table for final calculations
CREATE TABLE IF NOT EXISTS public.valuation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  valuation_request_id UUID REFERENCES public.valuation_requests(id) UNIQUE,
  estimated_value NUMERIC,
  confidence_score NUMERIC,
  price_range_low NUMERIC,
  price_range_high NUMERIC,
  comp_summary JSONB,
  source_breakdown JSONB,
  methodology JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create valuation_audit_logs for comprehensive tracking
CREATE TABLE IF NOT EXISTS public.valuation_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  valuation_request_id UUID REFERENCES public.valuation_requests(id),
  action TEXT NOT NULL,
  message TEXT,
  input_data JSONB,
  output_data JSONB,
  execution_time_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  run_by TEXT DEFAULT 'system',
  event TEXT -- For compatibility with existing code
);

-- Enable RLS on all tables
ALTER TABLE public.valuation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_comps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for valuation_requests
CREATE POLICY "Users can view their own valuation requests" ON public.valuation_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create valuation requests" ON public.valuation_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests" ON public.valuation_requests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all requests" ON public.valuation_requests
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for market_comps
CREATE POLICY "Users can view comps for their requests" ON public.market_comps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.valuation_requests vr 
      WHERE vr.id = market_comps.valuation_request_id 
      AND vr.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage all comps" ON public.market_comps
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for valuation_results
CREATE POLICY "Users can view their own results" ON public.valuation_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.valuation_requests vr 
      WHERE vr.id = valuation_results.valuation_request_id 
      AND vr.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage all results" ON public.valuation_results
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for audit logs
CREATE POLICY "Users can view audit logs for their requests" ON public.valuation_audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.valuation_requests vr 
      WHERE vr.id = valuation_audit_logs.valuation_request_id 
      AND vr.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage all audit logs" ON public.valuation_audit_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_valuation_requests_user_id ON public.valuation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_valuation_requests_vin ON public.valuation_requests(vin);
CREATE INDEX IF NOT EXISTS idx_market_comps_request_id ON public.market_comps(valuation_request_id);
CREATE INDEX IF NOT EXISTS idx_market_comps_source ON public.market_comps(source);
CREATE INDEX IF NOT EXISTS idx_market_comps_vin ON public.market_comps(vin);
CREATE INDEX IF NOT EXISTS idx_valuation_results_request_id ON public.valuation_results(valuation_request_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_request_id ON public.valuation_audit_logs(valuation_request_id);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_valuation_requests_updated_at
  BEFORE UPDATE ON public.valuation_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_valuation_results_updated_at
  BEFORE UPDATE ON public.valuation_results
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();