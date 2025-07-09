-- Create table to cache regional fuel costs
CREATE TABLE public.regional_fuel_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  period DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_regional_fuel_costs_area_product ON public.regional_fuel_costs(area_name, product_name);
CREATE INDEX idx_regional_fuel_costs_period ON public.regional_fuel_costs(period DESC);

-- Enable RLS
ALTER TABLE public.regional_fuel_costs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to fuel costs
CREATE POLICY "Allow public read access to fuel costs" 
ON public.regional_fuel_costs 
FOR SELECT 
USING (true);

-- Allow service role to manage fuel costs
CREATE POLICY "Service role can manage fuel costs" 
ON public.regional_fuel_costs 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_regional_fuel_costs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_regional_fuel_costs_updated_at
BEFORE UPDATE ON public.regional_fuel_costs
FOR EACH ROW
EXECUTE FUNCTION public.update_regional_fuel_costs_updated_at();