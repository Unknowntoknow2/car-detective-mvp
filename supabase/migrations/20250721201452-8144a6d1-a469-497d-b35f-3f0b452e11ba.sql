
-- Create enhanced market listings table with better structure
CREATE TABLE IF NOT EXISTS public.enhanced_market_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vin TEXT,
  valuation_request_id UUID,
  source TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'marketplace',
  listing_url TEXT NOT NULL,
  price NUMERIC NOT NULL,
  mileage INTEGER,
  year INTEGER,
  make TEXT,
  model TEXT,
  trim TEXT,
  condition TEXT DEFAULT 'used',
  title_status TEXT DEFAULT 'clean',
  location TEXT,
  zip_code TEXT,
  dealer_name TEXT,
  is_cpo BOOLEAN DEFAULT false,
  days_listed INTEGER,
  confidence_score INTEGER DEFAULT 85,
  geo_distance_miles NUMERIC,
  listing_date TIMESTAMP WITH TIME ZONE,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  features JSONB DEFAULT '{}',
  photos JSONB DEFAULT '[]',
  raw_data JSONB DEFAULT '{}',
  is_validated BOOLEAN DEFAULT false,
  validation_errors JSONB DEFAULT '[]'
);

-- Create VIN enrichment table for title history and detailed vehicle data
CREATE TABLE IF NOT EXISTS public.vin_enrichment_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vin TEXT UNIQUE NOT NULL,
  year INTEGER,
  make TEXT,
  model TEXT,
  trim TEXT,
  engine TEXT,
  transmission TEXT,
  drivetrain TEXT,
  fuel_type TEXT,
  body_type TEXT,
  doors INTEGER,
  seats INTEGER,
  msrp NUMERIC,
  title_status TEXT DEFAULT 'unknown',
  title_history JSONB DEFAULT '[]',
  accident_history JSONB DEFAULT '[]',
  service_history JSONB DEFAULT '[]',
  ownership_history JSONB DEFAULT '[]',
  recall_data JSONB DEFAULT '[]',
  market_value_estimate NUMERIC,
  confidence_score INTEGER DEFAULT 50,
  data_sources JSONB DEFAULT '[]',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create title adjustment rules table
CREATE TABLE IF NOT EXISTS public.title_status_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_status TEXT UNIQUE NOT NULL,
  adjustment_percentage NUMERIC NOT NULL,
  adjustment_type TEXT DEFAULT 'percentage',
  description TEXT,
  severity_level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert title adjustment rules
INSERT INTO public.title_status_adjustments (title_status, adjustment_percentage, description, severity_level) VALUES
('clean', 0.0, 'Clean title - no adjustment', 0),
('clear', 0.0, 'Clear title - no adjustment', 0),
('rebuilt', -25.0, 'Rebuilt title - significant devaluation', 3),
('reconstructed', -25.0, 'Reconstructed title - significant devaluation', 3),
('salvage', -45.0, 'Salvage title - major devaluation', 5),
('flood', -50.0, 'Flood damage - major devaluation', 5),
('hail', -15.0, 'Hail damage - moderate devaluation', 2),
('lemon', -35.0, 'Lemon buyback - significant devaluation', 4),
('manufacturer_buyback', -30.0, 'Manufacturer buyback - significant devaluation', 4)
ON CONFLICT (title_status) DO NOTHING;

-- Create market search audit table
CREATE TABLE IF NOT EXISTS public.market_search_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  valuation_request_id UUID,
  vin TEXT,
  search_type TEXT NOT NULL,
  search_params JSONB NOT NULL,
  listings_found INTEGER DEFAULT 0,
  listings_validated INTEGER DEFAULT 0,
  search_duration_ms INTEGER,
  data_sources_used JSONB DEFAULT '[]',
  search_status TEXT DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.enhanced_market_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vin_enrichment_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.title_status_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_search_audit ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public read access to enhanced market listings" 
  ON public.enhanced_market_listings FOR SELECT 
  USING (true);

CREATE POLICY "Service role can manage enhanced market listings" 
  ON public.enhanced_market_listings FOR ALL 
  USING (auth.role() = 'service_role');

CREATE POLICY "Public read access to VIN enrichment data" 
  ON public.vin_enrichment_data FOR SELECT 
  USING (true);

CREATE POLICY "Service role can manage VIN enrichment data" 
  ON public.vin_enrichment_data FOR ALL 
  USING (auth.role() = 'service_role');

CREATE POLICY "Public read access to title adjustments" 
  ON public.title_status_adjustments FOR SELECT 
  USING (true);

CREATE POLICY "Public read access to market search audit" 
  ON public.market_search_audit FOR SELECT 
  USING (true);

CREATE POLICY "Service role can manage market search audit" 
  ON public.market_search_audit FOR ALL 
  USING (auth.role() = 'service_role');

-- Create function to get title adjustment
CREATE OR REPLACE FUNCTION public.get_title_adjustment(title_status TEXT, base_value NUMERIC)
RETURNS NUMERIC
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  adjustment_pct NUMERIC := 0;
BEGIN
  SELECT adjustment_percentage INTO adjustment_pct
  FROM public.title_status_adjustments
  WHERE title_status_adjustments.title_status = LOWER(get_title_adjustment.title_status)
  LIMIT 1;
  
  IF adjustment_pct IS NULL THEN
    adjustment_pct := 0;
  END IF;
  
  RETURN base_value * (adjustment_pct / 100.0);
END;
$$;

-- Create function to validate market listings
CREATE OR REPLACE FUNCTION public.validate_market_listing(listing_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  listing RECORD;
  is_valid BOOLEAN := true;
  errors JSONB := '[]';
BEGIN
  SELECT * INTO listing FROM public.enhanced_market_listings WHERE id = listing_id;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Validate price range
  IF listing.price < 1000 OR listing.price > 200000 THEN
    errors := errors || '["price_out_of_range"]';
    is_valid := false;
  END IF;
  
  -- Validate mileage
  IF listing.mileage IS NOT NULL AND (listing.mileage < 0 OR listing.mileage > 500000) THEN
    errors := errors || '["mileage_out_of_range"]';
    is_valid := false;
  END IF;
  
  -- Validate year
  IF listing.year IS NOT NULL AND (listing.year < 1990 OR listing.year > EXTRACT(YEAR FROM now()) + 1) THEN
    errors := errors || '["year_out_of_range"]';
    is_valid := false;
  END IF;
  
  -- Update validation status
  UPDATE public.enhanced_market_listings 
  SET is_validated = is_valid, validation_errors = errors
  WHERE id = listing_id;
  
  RETURN is_valid;
END;
$$;
