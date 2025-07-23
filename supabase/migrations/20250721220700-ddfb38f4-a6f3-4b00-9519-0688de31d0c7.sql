-- Create market listings table for canonical listing storage
CREATE TABLE IF NOT EXISTS public.market_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vin TEXT,
  source TEXT NOT NULL,
  source_tier INTEGER NOT NULL DEFAULT 2, -- 1=premium, 2=standard, 3=niche
  url TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  trim TEXT,
  price NUMERIC NOT NULL,
  mileage INTEGER,
  location TEXT,
  zip_code TEXT,
  dealer_name TEXT,
  fuel_type TEXT,
  drivetrain TEXT,
  listing_date TIMESTAMP WITH TIME ZONE,
  title_status TEXT DEFAULT 'clean',
  confidence_score FLOAT DEFAULT 0.85,
  raw_data JSONB DEFAULT '{}',
  geo_distance_miles FLOAT,
  normalized_features JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days',
  is_active BOOLEAN DEFAULT true
);

-- Create market listing aggregations table for valuation requests
CREATE TABLE IF NOT EXISTS public.market_listing_aggregations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  valuation_request_id UUID,
  search_criteria JSONB NOT NULL, -- {make, model, year, trim, zipCode, mileage}
  listings_found INTEGER DEFAULT 0,
  sources_used TEXT[] DEFAULT '{}',
  confidence_score FLOAT DEFAULT 0,
  median_price NUMERIC,
  price_range_low NUMERIC,
  price_range_high NUMERIC,
  market_multiplier FLOAT DEFAULT 1.0,
  supply_density_score FLOAT DEFAULT 0.5, -- 0=oversupply, 1=scarcity
  market_velocity_score FLOAT DEFAULT 0.5, -- 0=slow, 1=fast
  aggregation_notes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_market_listings_search ON public.market_listings 
  (make, model, year, zip_code, price, mileage) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_market_listings_vin ON public.market_listings (vin) WHERE vin IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_market_listings_location ON public.market_listings (location, zip_code);

CREATE INDEX IF NOT EXISTS idx_market_listings_expires ON public.market_listings (expires_at) WHERE is_active = true;

-- Create GIN index for JSON search
CREATE INDEX IF NOT EXISTS idx_market_listings_features ON public.market_listings USING GIN (normalized_features);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_market_listings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_market_listings_updated_at
  BEFORE UPDATE ON public.market_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_market_listings_updated_at();

-- Enable RLS
ALTER TABLE public.market_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_listing_aggregations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public read access to market listings" ON public.market_listings
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage market listings" ON public.market_listings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Public read access to aggregations" ON public.market_listing_aggregations
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage aggregations" ON public.market_listing_aggregations
  FOR ALL USING (auth.role() = 'service_role');

-- Function to clean expired listings
CREATE OR REPLACE FUNCTION clean_expired_market_listings()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.market_listings 
  WHERE expires_at < NOW() OR is_active = false;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate market intelligence metrics
CREATE OR REPLACE FUNCTION calculate_market_metrics(
  p_make TEXT,
  p_model TEXT,
  p_year INTEGER,
  p_zip_code TEXT,
  p_radius_miles INTEGER DEFAULT 150
)
RETURNS TABLE(
  listing_count INTEGER,
  median_price NUMERIC,
  price_range_low NUMERIC,
  price_range_high NUMERIC,
  supply_density FLOAT,
  confidence_score FLOAT
) AS $$
BEGIN
  RETURN QUERY
  WITH filtered_listings AS (
    SELECT ml.price
    FROM public.market_listings ml
    WHERE ml.make = p_make
      AND ml.model = p_model
      AND ml.year = p_year
      AND ml.is_active = true
      AND ml.expires_at > NOW()
      AND (ml.zip_code = p_zip_code OR ml.geo_distance_miles <= p_radius_miles)
      AND ml.price > 1000 -- Basic validity filter
  ),
  price_stats AS (
    SELECT 
      COUNT(*)::INTEGER as count,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price) as median,
      MIN(price) as min_price,
      MAX(price) as max_price
    FROM filtered_listings
  )
  SELECT 
    ps.count,
    ps.median,
    ps.min_price,
    ps.max_price,
    CASE 
      WHEN ps.count >= 10 THEN 0.3  -- Oversupply
      WHEN ps.count >= 5 THEN 0.6   -- Normal supply
      WHEN ps.count >= 2 THEN 0.8   -- Limited supply
      ELSE 1.0                      -- Scarcity
    END::FLOAT as supply_density,
    CASE
      WHEN ps.count >= 5 THEN 0.9
      WHEN ps.count >= 3 THEN 0.8
      WHEN ps.count >= 2 THEN 0.7
      ELSE 0.5
    END::FLOAT as confidence
  FROM price_stats ps;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;