-- Add missing columns to existing regional_fuel_costs table
ALTER TABLE regional_fuel_costs 
ADD COLUMN IF NOT EXISTS zip_code text,
ADD COLUMN IF NOT EXISTS state_code text,
ADD COLUMN IF NOT EXISTS fuel_type text DEFAULT 'gasoline',
ADD COLUMN IF NOT EXISTS cost_per_gallon numeric,
ADD COLUMN IF NOT EXISTS source text DEFAULT 'eia.gov';

-- Update existing data structure
UPDATE regional_fuel_costs 
SET cost_per_gallon = price,
    fuel_type = CASE 
      WHEN lower(product_name) LIKE '%diesel%' THEN 'diesel'
      WHEN lower(product_name) LIKE '%premium%' THEN 'premium'
      ELSE 'gasoline'
    END,
    zip_code = '00000',  -- Default for existing records
    state_code = CASE
      WHEN area_name LIKE '%CA%' OR area_name LIKE '%California%' THEN 'CA'
      WHEN area_name LIKE '%TX%' OR area_name LIKE '%Texas%' THEN 'TX'
      WHEN area_name LIKE '%NY%' OR area_name LIKE '%New York%' THEN 'NY'
      WHEN area_name LIKE '%FL%' OR area_name LIKE '%Florida%' THEN 'FL'
      WHEN area_name LIKE '%IL%' OR area_name LIKE '%Illinois%' THEN 'IL'
      ELSE 'US'
    END
WHERE cost_per_gallon IS NULL;

-- Make required columns NOT NULL after updating
ALTER TABLE regional_fuel_costs 
ALTER COLUMN zip_code SET NOT NULL,
ALTER COLUMN fuel_type SET NOT NULL,
ALTER COLUMN cost_per_gallon SET NOT NULL;

-- Create unique constraint for new structure
ALTER TABLE regional_fuel_costs 
DROP CONSTRAINT IF EXISTS unique_zip_fuel_type,
ADD CONSTRAINT unique_zip_fuel_type UNIQUE (zip_code, fuel_type);

-- Create optimized indexes
DROP INDEX IF EXISTS idx_regional_fuel_costs_zip_fuel;
CREATE INDEX idx_regional_fuel_costs_zip_fuel 
ON regional_fuel_costs(zip_code, fuel_type);

DROP INDEX IF EXISTS idx_regional_fuel_costs_updated_at;
CREATE INDEX idx_regional_fuel_costs_updated_at 
ON regional_fuel_costs(updated_at DESC);

-- Update RLS policies
DROP POLICY IF EXISTS "Allow public read access to fuel costs" ON regional_fuel_costs;
DROP POLICY IF EXISTS "Service role can manage fuel costs" ON regional_fuel_costs;

CREATE POLICY "Allow public read access to fuel costs" 
ON regional_fuel_costs 
FOR SELECT 
USING (true);

CREATE POLICY "Service role can manage fuel costs" 
ON regional_fuel_costs 
FOR ALL 
USING (auth.role() = 'service_role');