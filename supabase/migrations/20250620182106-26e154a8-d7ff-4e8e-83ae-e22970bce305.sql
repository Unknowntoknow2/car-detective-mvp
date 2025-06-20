
-- Create table to store valuation results
CREATE TABLE public.valuation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  vin TEXT,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  mileage INTEGER,
  condition TEXT,
  estimated_value NUMERIC NOT NULL,
  confidence_score NUMERIC DEFAULT 85,
  price_range_low NUMERIC,
  price_range_high NUMERIC,
  adjustments JSONB DEFAULT '[]'::jsonb,
  vehicle_data JSONB DEFAULT '{}'::jsonb,
  valuation_type TEXT DEFAULT 'free',
  zip_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.valuation_results ENABLE ROW LEVEL SECURITY;

-- Create policies for valuation results
CREATE POLICY "Users can view their own valuation results" 
  ON public.valuation_results 
  FOR SELECT 
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create valuation results" 
  ON public.valuation_results 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own valuation results" 
  ON public.valuation_results 
  FOR UPDATE 
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_valuation_results_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_valuation_results_updated_at
  BEFORE UPDATE ON public.valuation_results
  FOR EACH ROW
  EXECUTE FUNCTION update_valuation_results_updated_at();
