
-- Phase 1: Enhanced market listings table structure and sample data
-- First, let's add some missing columns to enhanced_market_listings for better data quality

ALTER TABLE enhanced_market_listings 
ADD COLUMN IF NOT EXISTS exterior_color TEXT,
ADD COLUMN IF NOT EXISTS interior_color TEXT,
ADD COLUMN IF NOT EXISTS fuel_economy_city INTEGER,
ADD COLUMN IF NOT EXISTS fuel_economy_highway INTEGER,
ADD COLUMN IF NOT EXISTS drivetrain TEXT,
ADD COLUMN IF NOT EXISTS transmission_type TEXT,
ADD COLUMN IF NOT EXISTS engine_description TEXT,
ADD COLUMN IF NOT EXISTS listing_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS days_on_market INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_history JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS dealer_rating NUMERIC(3,2),
ADD COLUMN IF NOT EXISTS stock_number TEXT,
ADD COLUMN IF NOT EXISTS last_price_update TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_enhanced_market_listings_make_model_year ON enhanced_market_listings (make, model, year);
CREATE INDEX IF NOT EXISTS idx_enhanced_market_listings_price_range ON enhanced_market_listings (price) WHERE listing_status = 'active';
CREATE INDEX IF NOT EXISTS idx_enhanced_market_listings_location ON enhanced_market_listings (zip_code, geo_distance_miles);
CREATE INDEX IF NOT EXISTS idx_enhanced_market_listings_updated ON enhanced_market_listings (updated_at) WHERE listing_status = 'active';

-- Insert sample Ford F-150 listings for testing
INSERT INTO enhanced_market_listings (
  source, source_type, listing_url, make, model, year, trim, price, mileage, 
  location, zip_code, dealer_name, condition, is_cpo, confidence_score, 
  exterior_color, interior_color, fuel_economy_city, fuel_economy_highway,
  drivetrain, transmission_type, engine_description, days_on_market, dealer_rating, stock_number
) VALUES 
(
  'AutoTrader', 'dealer', 'https://autotrader.com/listing/12345', 
  'Ford', 'F-150', 2021, 'XLT SuperCrew 4WD', 42500, 28500,
  'Dallas, TX', '75201', 'Bob Smith Ford', 'excellent', false, 92,
  'Oxford White', 'Medium Earth Gray', 20, 24, '4WD', 'Automatic', '3.5L V6 EcoBoost', 12, 4.3, 'F21001'
),
(
  'Cars.com', 'dealer', 'https://cars.com/listing/67890',
  'Ford', 'F-150', 2021, 'XLT SuperCrew 4WD', 41800, 31200,
  'Austin, TX', '73301', 'Capital City Ford', 'very-good', true, 89,
  'Magnetic Metallic', 'Black', 20, 24, '4WD', 'Automatic', '3.5L V6 EcoBoost', 8, 4.5, 'F21002'
),
(
  'CarGurus', 'dealer', 'https://cargurus.com/listing/54321',
  'Ford', 'F-150', 2021, 'Lariat SuperCrew 4WD', 48900, 22100,
  'Houston, TX', '77001', 'Metro Ford', 'excellent', false, 94,
  'Agate Black Metallic', 'Black Leather', 19, 23, '4WD', 'Automatic', '3.5L V6 EcoBoost', 5, 4.4, 'F21003'
),
(
  'CarMax', 'big_box_retailer', 'https://carmax.com/listing/98765',
  'Ford', 'F-150', 2021, 'XLT SuperCrew 4WD', 43200, 29800,
  'San Antonio, TX', '78201', 'CarMax San Antonio', 'good', false, 87,
  'Race Red', 'Medium Earth Gray', 20, 24, '4WD', 'Automatic', '3.5L V6 EcoBoost', 18, 4.2, 'CM21001'
),
(
  'Carvana', 'online_retailer', 'https://carvana.com/listing/11111',
  'Ford', 'F-150', 2021, 'King Ranch SuperCrew 4WD', 52900, 19500,
  'Phoenix, AZ', '85001', 'Carvana', 'excellent', false, 91,
  'Stone Gray Metallic', 'King Ranch Leather', 18, 22, '4WD', 'Automatic', '3.5L V6 EcoBoost', 3, 4.1, 'CV21001'
);

-- Create market intelligence aggregation table
CREATE TABLE IF NOT EXISTS market_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  trim TEXT,
  zip_code TEXT NOT NULL,
  sample_size INTEGER DEFAULT 0,
  median_price NUMERIC,
  average_price NUMERIC,
  price_std_dev NUMERIC,
  days_on_market_avg INTEGER,
  inventory_level TEXT, -- 'high', 'medium', 'low'
  demand_indicator NUMERIC DEFAULT 0.5, -- 0.0 to 1.0
  price_trend TEXT DEFAULT 'stable', -- 'rising', 'falling', 'stable'
  trend_percentage NUMERIC DEFAULT 0,
  last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confidence_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for market intelligence
ALTER TABLE market_intelligence ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to market intelligence
CREATE POLICY "Public read access to market intelligence" ON market_intelligence
  FOR SELECT USING (true);

-- Create policy for service role to manage market intelligence  
CREATE POLICY "Service role can manage market intelligence" ON market_intelligence
  FOR ALL USING (auth.role() = 'service_role');

-- Create function to calculate market intelligence
CREATE OR REPLACE FUNCTION calculate_market_intelligence(
  p_make TEXT,
  p_model TEXT, 
  p_year INTEGER,
  p_zip_code TEXT,
  p_radius_miles INTEGER DEFAULT 100
)
RETURNS TABLE(
  median_price NUMERIC,
  average_price NUMERIC,
  sample_size INTEGER,
  confidence_score INTEGER,
  inventory_level TEXT,
  demand_indicator NUMERIC
) AS $$
DECLARE
  v_median_price NUMERIC;
  v_average_price NUMERIC;
  v_sample_size INTEGER;
  v_confidence_score INTEGER;
  v_inventory_level TEXT;
  v_demand_indicator NUMERIC;
BEGIN
  -- Get listings data
  WITH filtered_listings AS (
    SELECT eml.price, eml.days_on_market
    FROM enhanced_market_listings eml
    WHERE eml.make = p_make
      AND eml.model = p_model
      AND eml.year = p_year
      AND eml.listing_status = 'active'
      AND eml.price > 1000
      AND (eml.zip_code = p_zip_code OR eml.geo_distance_miles <= p_radius_miles)
      AND eml.updated_at >= NOW() - INTERVAL '30 days'
  ),
  price_stats AS (
    SELECT 
      COUNT(*)::INTEGER as count,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price) as median,
      AVG(price) as average,
      AVG(days_on_market) as avg_days_on_market
    FROM filtered_listings
  )
  SELECT 
    ps.median,
    ps.average,
    ps.count,
    CASE
      WHEN ps.count >= 8 THEN 95
      WHEN ps.count >= 5 THEN 90
      WHEN ps.count >= 3 THEN 80
      WHEN ps.count >= 2 THEN 70
      ELSE 50
    END,
    CASE 
      WHEN ps.count >= 10 THEN 'high'
      WHEN ps.count >= 5 THEN 'medium'
      ELSE 'low'
    END,
    CASE
      WHEN ps.avg_days_on_market <= 15 THEN 0.8  -- High demand
      WHEN ps.avg_days_on_market <= 30 THEN 0.6  -- Medium demand
      WHEN ps.avg_days_on_market <= 60 THEN 0.4  -- Low demand
      ELSE 0.2  -- Very low demand
    END
  INTO v_median_price, v_average_price, v_sample_size, v_confidence_score, v_inventory_level, v_demand_indicator
  FROM price_stats ps;

  RETURN QUERY SELECT v_median_price, v_average_price, v_sample_size, v_confidence_score, v_inventory_level, v_demand_indicator;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
