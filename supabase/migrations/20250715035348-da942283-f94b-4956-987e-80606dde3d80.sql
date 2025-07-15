-- Create model_trims table for accurate MSRP data
CREATE TABLE IF NOT EXISTS model_trims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  trim_name text,
  msrp numeric NOT NULL,
  fuel_type text,
  engine_type text,
  transmission text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_model_trims_make_model_year 
ON model_trims(make, model, year);

CREATE INDEX IF NOT EXISTS idx_model_trims_make_model_year_trim 
ON model_trims(make, model, year, trim_name);

-- Enable RLS
ALTER TABLE model_trims ENABLE ROW LEVEL SECURITY;

-- Allow public read access to trim data
CREATE POLICY "Allow public read access to model trims" 
ON model_trims 
FOR SELECT 
USING (true);

-- Allow service role to manage trim data
CREATE POLICY "Service role can manage model trims" 
ON model_trims 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_model_trims_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_model_trims_updated_at_trigger
BEFORE UPDATE ON model_trims
FOR EACH ROW
EXECUTE FUNCTION update_model_trims_updated_at();

-- Insert Toyota Highlander 2021 with correct MSRP
INSERT INTO model_trims (make, model, year, trim_name, msrp, fuel_type, engine_type, transmission)
VALUES 
  ('Toyota', 'Highlander', 2021, 'L', 35850, 'gasoline', 'V6', 'automatic'),
  ('Toyota', 'Highlander', 2021, 'LE', 38300, 'gasoline', 'V6', 'automatic'),
  ('Toyota', 'Highlander', 2021, 'XLE', 42600, 'gasoline', 'V6', 'automatic'),
  ('Toyota', 'Highlander', 2021, 'XLE Nav', 46910, 'gasoline', 'V6', 'automatic'),
  ('Toyota', 'Highlander', 2021, 'Limited', 48720, 'gasoline', 'V6', 'automatic'),
  ('Toyota', 'Highlander', 2021, 'Platinum', 51235, 'gasoline', 'V6', 'automatic'),
  ('Toyota', 'Highlander', 2021, 'Hybrid LE', 39930, 'hybrid', 'V6 Hybrid', 'CVT'),
  ('Toyota', 'Highlander', 2021, 'Hybrid XLE', 43200, 'hybrid', 'V6 Hybrid', 'CVT'),
  ('Toyota', 'Highlander', 2021, 'Hybrid Limited', 49520, 'hybrid', 'V6 Hybrid', 'CVT'),
  ('Toyota', 'Highlander', 2021, 'Hybrid Platinum', 52145, 'hybrid', 'V6 Hybrid', 'CVT');

-- Add some other popular 2021 vehicles for better coverage
INSERT INTO model_trims (make, model, year, trim_name, msrp, fuel_type, engine_type, transmission)
VALUES 
  ('Toyota', 'RAV4', 2021, 'LE', 26350, 'gasoline', '4-cylinder', 'CVT'),
  ('Toyota', 'RAV4', 2021, 'XLE', 28900, 'gasoline', '4-cylinder', 'CVT'),
  ('Toyota', 'RAV4', 2021, 'XLE Premium', 31400, 'gasoline', '4-cylinder', 'CVT'),
  ('Toyota', 'RAV4', 2021, 'Limited', 34100, 'gasoline', '4-cylinder', 'CVT'),
  ('Toyota', 'Camry', 2021, 'L', 24970, 'gasoline', '4-cylinder', 'automatic'),
  ('Toyota', 'Camry', 2021, 'LE', 25395, 'gasoline', '4-cylinder', 'automatic'),
  ('Toyota', 'Camry', 2021, 'SE', 26895, 'gasoline', '4-cylinder', 'automatic'),
  ('Toyota', 'Camry', 2021, 'XLE', 29300, 'gasoline', '4-cylinder', 'automatic'),
  ('Honda', 'Accord', 2021, 'LX', 24970, 'gasoline', '4-cylinder', 'CVT'),
  ('Honda', 'Accord', 2021, 'Sport', 27330, 'gasoline', '4-cylinder', 'CVT'),
  ('Honda', 'CR-V', 2021, 'LX', 25350, 'gasoline', '4-cylinder', 'CVT'),
  ('Honda', 'CR-V', 2021, 'EX', 27750, 'gasoline', '4-cylinder', 'CVT'),
  ('Honda', 'CR-V', 2021, 'EX-L', 30250, 'gasoline', '4-cylinder', 'CVT'),
  ('Ford', 'F-150', 2021, 'Regular Cab', 29290, 'gasoline', 'V6', 'automatic'),
  ('Ford', 'F-150', 2021, 'SuperCab', 33695, 'gasoline', 'V6', 'automatic'),
  ('Ford', 'Explorer', 2021, 'Base', 32765, 'gasoline', '4-cylinder Turbo', 'automatic'),
  ('Ford', 'Explorer', 2021, 'XLT', 36675, 'gasoline', '4-cylinder Turbo', 'automatic');