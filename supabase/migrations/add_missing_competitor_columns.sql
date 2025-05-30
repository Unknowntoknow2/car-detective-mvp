
-- Add missing competitor price columns to the competitor_prices table
ALTER TABLE public.competitor_prices 
ADD COLUMN IF NOT EXISTS carmax_value text,
ADD COLUMN IF NOT EXISTS edmunds_value text,
ADD COLUMN IF NOT EXISTS carfax_value text,
ADD COLUMN IF NOT EXISTS carsdotcom_value text,
ADD COLUMN IF NOT EXISTS autotrader_value text,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

-- Add trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_competitor_prices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists and recreate it
DROP TRIGGER IF EXISTS competitor_prices_updated_at ON public.competitor_prices;
CREATE TRIGGER competitor_prices_updated_at
  BEFORE UPDATE ON public.competitor_prices
  FOR EACH ROW
  EXECUTE FUNCTION update_competitor_prices_updated_at();

-- Add a unique constraint on VIN to prevent duplicates
ALTER TABLE public.competitor_prices 
DROP CONSTRAINT IF EXISTS competitor_prices_vin_unique;
ALTER TABLE public.competitor_prices 
ADD CONSTRAINT competitor_prices_vin_unique UNIQUE (vin);
