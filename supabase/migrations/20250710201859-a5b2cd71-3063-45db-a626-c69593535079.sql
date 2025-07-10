-- Create comprehensive valuation audit logs table for step-by-step tracking
-- First drop existing table to recreate with proper schema
DROP TABLE IF EXISTS public.valuation_audit_logs CASCADE;

-- Create new valuation_audit_logs table with required schema
CREATE TABLE public.valuation_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,  -- Nullable for anonymous users
  vin TEXT NOT NULL,
  zip_code TEXT,
  step TEXT NOT NULL,  -- e.g., "Mileage Adjustment", "Fuel Adjustment", "Market Anchoring"
  adjustment NUMERIC DEFAULT 0,  -- Amount of adjustment applied
  final_value NUMERIC NOT NULL,  -- Value after this step
  confidence_score INTEGER DEFAULT 85,
  status TEXT DEFAULT 'IN_PROGRESS',  -- IN_PROGRESS, COMPLETE, ERROR
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valuation_request_id UUID,  -- Link to valuation request if available
  
  -- Additional metadata for debugging and analysis
  adjustment_reason TEXT,  -- Why this adjustment was made
  base_value NUMERIC,  -- Value before this step
  adjustment_percentage NUMERIC,  -- Percentage change
  data_sources TEXT[],  -- Sources used for this step
  metadata JSONB DEFAULT '{}',  -- Flexible metadata storage
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX idx_valuation_audit_logs_vin ON public.valuation_audit_logs(vin);
CREATE INDEX idx_valuation_audit_logs_user_id ON public.valuation_audit_logs(user_id);
CREATE INDEX idx_valuation_audit_logs_step ON public.valuation_audit_logs(step);
CREATE INDEX idx_valuation_audit_logs_timestamp ON public.valuation_audit_logs(timestamp);
CREATE INDEX idx_valuation_audit_logs_valuation_request_id ON public.valuation_audit_logs(valuation_request_id);

-- Enable RLS
ALTER TABLE public.valuation_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own audit logs"
ON public.valuation_audit_logs FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Service role can manage all audit logs"
ON public.valuation_audit_logs FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "Anonymous users can create audit logs"
ON public.valuation_audit_logs FOR INSERT
WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_valuation_audit_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_valuation_audit_logs_updated_at
  BEFORE UPDATE ON public.valuation_audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_valuation_audit_logs_updated_at();