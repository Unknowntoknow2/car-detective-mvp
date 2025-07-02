-- Create remaining tables for FANG aggregation

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS public.valuation_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  valuation_request_id UUID NOT NULL REFERENCES public.valuation_requests(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  source TEXT,
  input_data JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  run_by TEXT DEFAULT 'lovable_ai',
  metadata JSONB DEFAULT '{}'
);

-- AI Snapshots Table
CREATE TABLE IF NOT EXISTS public.ai_market_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  valuation_request_id UUID NOT NULL REFERENCES public.valuation_requests(id) ON DELETE CASCADE,
  snapshot_type TEXT NOT NULL,
  source TEXT NOT NULL,
  raw_payload JSONB NOT NULL,
  processed_payload JSONB DEFAULT '{}',
  token_count INTEGER,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_valuation_id ON public.valuation_audit_logs(valuation_request_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event ON public.valuation_audit_logs(event);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.valuation_audit_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.valuation_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_market_snapshots ENABLE ROW LEVEL SECURITY;

-- Policies for audit logs
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

-- Policies for AI snapshots
CREATE POLICY "Service role can manage ai snapshots"
ON public.ai_market_snapshots FOR ALL
USING (auth.role() = 'service_role');