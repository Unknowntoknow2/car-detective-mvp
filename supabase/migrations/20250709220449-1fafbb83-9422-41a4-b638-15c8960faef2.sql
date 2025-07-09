-- Add missing valuation_notes column and ensure all required columns exist
ALTER TABLE public.valuations 
ADD COLUMN IF NOT EXISTS valuation_notes JSONB DEFAULT '[]'::jsonb;

-- Add comment for clarity
COMMENT ON COLUMN public.valuations.valuation_notes IS 'Array of valuation notes and AI explanations';