-- Fix any missing tables for full AIN system implementation
-- Ensure valuation_requests table exists
CREATE TABLE IF NOT EXISTS public.valuation_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  vin TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  mileage INTEGER NOT NULL,
  condition TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  request_timestamp TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'processing',
  final_value NUMERIC,
  confidence_score NUMERIC,
  audit_log_id TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.valuation_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own valuation requests" 
ON public.valuation_requests 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all valuation requests"
ON public.valuation_requests
FOR ALL
USING (auth.role() = 'service_role');

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_valuation_requests_user_id ON public.valuation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_valuation_requests_vin ON public.valuation_requests(vin);
CREATE INDEX IF NOT EXISTS idx_valuation_requests_status ON public.valuation_requests(status);
CREATE INDEX IF NOT EXISTS idx_valuation_requests_created_at ON public.valuation_requests(created_at DESC);