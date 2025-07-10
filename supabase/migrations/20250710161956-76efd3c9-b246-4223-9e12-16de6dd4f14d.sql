-- Create regional fuel costs table for ZIP-based caching
CREATE TABLE IF NOT EXISTS regional_fuel_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zip_code text NOT NULL,
  state_code text,
  fuel_type text NOT NULL,  -- 'gasoline', 'diesel', 'electric', 'premium'
  cost_per_gallon numeric NOT NULL,  -- dollars per gallon or per kWh
  source text DEFAULT 'eia.gov',
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Add unique constraint after table creation
ALTER TABLE regional_fuel_costs 
ADD CONSTRAINT unique_zip_fuel_type UNIQUE (zip_code, fuel_type);

-- Create index for fast ZIP+fuel type lookups
CREATE INDEX IF NOT EXISTS idx_regional_fuel_costs_zip_fuel 
ON regional_fuel_costs(zip_code, fuel_type);

-- Create index for data freshness queries
CREATE INDEX IF NOT EXISTS idx_regional_fuel_costs_updated_at 
ON regional_fuel_costs(updated_at);

-- Enable RLS
ALTER TABLE regional_fuel_costs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to fuel cost data
CREATE POLICY "Allow public read access to fuel costs" 
ON regional_fuel_costs 
FOR SELECT 
USING (true);

-- Allow service role to manage fuel cost data
CREATE POLICY "Service role can manage fuel costs" 
ON regional_fuel_costs 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_regional_fuel_costs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_regional_fuel_costs_updated_at_trigger
BEFORE UPDATE ON regional_fuel_costs
FOR EACH ROW
EXECUTE FUNCTION update_regional_fuel_costs_updated_at();