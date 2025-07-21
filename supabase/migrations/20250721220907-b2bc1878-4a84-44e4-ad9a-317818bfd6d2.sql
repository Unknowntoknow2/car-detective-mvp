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