-- Add missing required columns to valuations table
ALTER TABLE public.valuations 
ADD COLUMN IF NOT EXISTS valuation_type TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create trigger function for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_valuations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at column
CREATE TRIGGER update_valuations_updated_at_trigger
  BEFORE UPDATE ON public.valuations
  FOR EACH ROW
  EXECUTE FUNCTION update_valuations_updated_at();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_valuations_valuation_type ON public.valuations(valuation_type);
CREATE INDEX IF NOT EXISTS idx_valuations_updated_at ON public.valuations(updated_at DESC);