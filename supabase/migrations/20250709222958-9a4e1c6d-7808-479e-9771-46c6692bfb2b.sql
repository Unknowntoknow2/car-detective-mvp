-- Enhance valuation_audit_logs table for comprehensive audit tracking
ALTER TABLE public.valuation_audit_logs 
ADD COLUMN IF NOT EXISTS audit_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS confidence_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sources_used TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS fallback_used BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS quality_score INTEGER DEFAULT 0;

-- Add index for audit data queries
CREATE INDEX IF NOT EXISTS idx_valuation_audit_logs_audit_data 
ON public.valuation_audit_logs USING GIN (audit_data);

-- Add index for confidence score queries
CREATE INDEX IF NOT EXISTS idx_valuation_audit_logs_confidence_score 
ON public.valuation_audit_logs(confidence_score);

-- Add index for sources used queries
CREATE INDEX IF NOT EXISTS idx_valuation_audit_logs_sources_used 
ON public.valuation_audit_logs USING GIN (sources_used);