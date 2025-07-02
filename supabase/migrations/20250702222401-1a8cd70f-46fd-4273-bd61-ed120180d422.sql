-- FANG-Grade Market Aggregation Schema
-- Creates enterprise-ready tables for E2E valuation traceability

-- 1. Valuation Requests Table
CREATE TABLE IF NOT EXISTS public.valuation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  vin TEXT,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  trim TEXT,
  year INTEGER NOT NULL,
  mileage INTEGER,
  zip_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending', -- pending, running, completed, failed
  engine_response JSONB DEFAULT '{}', -- Raw valuation engine result
  request_params JSONB DEFAULT '{}', -- Full original request context
  final_value NUMERIC,
  confidence_score NUMERIC,
  comp_count INTEGER DEFAULT 0
);

-- 2. Market Listings/Comps Table
CREATE TABLE IF NOT EXISTS public.market_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  valuation_request_id UUID NOT NULL REFERENCES public.valuation_requests(id) ON DELETE CASCADE,
  vin TEXT,
  source TEXT NOT NULL, -- 'CarMax', 'AutoNation', 'Manheim', etc.
  source_type TEXT NOT NULL, -- 'franchise_dealer', 'big_box', 'auction', 'marketplace', etc.
  price NUMERIC NOT NULL,
  mileage INTEGER,
  condition TEXT,
  dealer_name TEXT,
  location TEXT,
  zip_code TEXT,
  listing_url TEXT NOT NULL,
  screenshot_url TEXT,
  is_cpo BOOLEAN DEFAULT false,
  date_listed TIMESTAMP WITH TIME ZONE,
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  raw_data JSONB DEFAULT '{}', -- Full scraped data for audit
  confidence_score NUMERIC DEFAULT 85,
  notes TEXT
);

-- 3. Valuation Audit Logs Table
CREATE TABLE IF NOT EXISTS public.valuation_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  valuation_request_id UUID NOT NULL REFERENCES public.valuation_requests(id) ON DELETE CASCADE,
  event TEXT NOT NULL, -- 'request_created', 'fetch_started', 'fetch_completed', 'fetch_failed', 'valuation_computed'
  source TEXT, -- Which source this log relates to (if applicable)
  input_data JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  run_by TEXT DEFAULT 'lovable_ai',
  metadata JSONB DEFAULT '{}'
);

-- 4. AI Market Snapshots (for model training and analysis)
CREATE TABLE IF NOT EXISTS public.ai_market_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  valuation_request_id UUID NOT NULL REFERENCES public.valuation_requests(id) ON DELETE CASCADE,
  snapshot_type TEXT NOT NULL, -- 'full_search', 'source_response', 'parsed_data'
  source TEXT NOT NULL,
  raw_payload JSONB NOT NULL,
  processed_payload JSONB DEFAULT '{}',
  token_count INTEGER,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_valuation_requests_user_id ON public.valuation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_valuation_requests_vin ON public.valuation_requests(vin);
CREATE INDEX IF NOT EXISTS idx_valuation_requests_status ON public.valuation_requests(status);
CREATE INDEX IF NOT EXISTS idx_valuation_requests_created_at ON public.valuation_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_market_listings_valuation_id ON public.market_listings(valuation_request_id);
CREATE INDEX IF NOT EXISTS idx_market_listings_source ON public.market_listings(source);
CREATE INDEX IF NOT EXISTS idx_market_listings_price ON public.market_listings(price);
CREATE INDEX IF NOT EXISTS idx_market_listings_vin ON public.market_listings(vin);

CREATE INDEX IF NOT EXISTS idx_audit_logs_valuation_id ON public.valuation_audit_logs(valuation_request_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event ON public.valuation_audit_logs(event);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.valuation_audit_logs(created_at DESC);

-- RLS Policies
ALTER TABLE public.valuation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_market_snapshots ENABLE ROW LEVEL SECURITY;

-- Valuation Requests Policies
CREATE POLICY "Users can create their own valuation requests"
ON public.valuation_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own valuation requests"
ON public.valuation_requests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own valuation requests"
ON public.valuation_requests FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage valuation requests"
ON public.valuation_requests FOR ALL
USING (auth.role() = 'service_role');

-- Market Listings Policies
CREATE POLICY "Users can view market listings for their valuations"
ON public.market_listings FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.valuation_requests vr
  WHERE vr.id = market_listings.valuation_request_id
  AND vr.user_id = auth.uid()
));

CREATE POLICY "Service role can manage market listings"
ON public.market_listings FOR ALL
USING (auth.role() = 'service_role');

-- Audit Logs Policies
CREATE POLICY "Users can view audit logs for their valuations"
ON public.valuation_audit_logs FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.valuation_requests vr
  WHERE vr.id = valuation_audit_logs.valuation_request_id
  AND vr.user_id = auth.uid()
));

CREATE POLICY "Service role can manage audit logs"
ON public.valuation_audit_logs FOR ALL
USING (auth.role() = 'service_role');

-- AI Snapshots Policies (Admin/Service only)
CREATE POLICY "Admin can view ai snapshots"
ON public.ai_market_snapshots FOR SELECT
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Service role can manage ai snapshots"
ON public.ai_market_snapshots FOR ALL
USING (auth.role() = 'service_role');

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_valuation_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_valuation_requests_updated_at
  BEFORE UPDATE ON public.valuation_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_valuation_requests_updated_at();