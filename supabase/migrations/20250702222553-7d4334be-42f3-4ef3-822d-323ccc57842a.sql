-- RLS Policies and Triggers for FANG Market Aggregation

-- Enable RLS
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