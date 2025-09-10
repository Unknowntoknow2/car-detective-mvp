-- Fix critical security vulnerability: Enable RLS on makes table
-- The table has policies but RLS is disabled, making policies ineffective

-- Enable RLS on the makes table
ALTER TABLE public.makes ENABLE ROW LEVEL SECURITY;

-- Add security comment
COMMENT ON TABLE public.makes IS 
'Vehicle makes reference data. RLS enabled to enforce access policies and prevent unauthorized data modification.';