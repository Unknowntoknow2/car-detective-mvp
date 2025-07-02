-- Create Valuation Requests table first
CREATE TABLE public.valuation_requests (
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
  status TEXT NOT NULL DEFAULT 'pending',
  engine_response JSONB DEFAULT '{}',
  request_params JSONB DEFAULT '{}',
  final_value NUMERIC,
  confidence_score NUMERIC,
  comp_count INTEGER DEFAULT 0
);

-- Create indexes
CREATE INDEX idx_valuation_requests_user_id ON public.valuation_requests(user_id);
CREATE INDEX idx_valuation_requests_vin ON public.valuation_requests(vin);
CREATE INDEX idx_valuation_requests_status ON public.valuation_requests(status);
CREATE INDEX idx_valuation_requests_created_at ON public.valuation_requests(created_at DESC);

-- Enable RLS and add policies
ALTER TABLE public.valuation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own valuation requests"
ON public.valuation_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own valuation requests"
ON public.valuation_requests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage valuation requests"
ON public.valuation_requests FOR ALL
USING (auth.role() = 'service_role');