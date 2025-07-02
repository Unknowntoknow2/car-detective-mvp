-- Create comprehensive vehicle pricing data aggregation tables

-- Main pricing data table
CREATE TABLE IF NOT EXISTS public.vehicle_pricing_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vin TEXT,
  year INTEGER NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  trim TEXT,
  price NUMERIC NOT NULL,
  mileage INTEGER,
  location TEXT,
  zip_code TEXT,
  dealer_name TEXT,
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL, -- 'dealer', 'marketplace', 'auction', 'rental', 'cpo', etc.
  stock_number TEXT,
  listing_url TEXT,
  screenshot_url TEXT,
  cpo_status BOOLEAN DEFAULT false,
  vehicle_condition TEXT,
  date_listed TIMESTAMP WITH TIME ZONE,
  date_scraped TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  incentives TEXT,
  markdown_notes TEXT,
  offer_type TEXT, -- 'listing', 'instant_offer', 'trade_value', 'auction_sold'
  provenance JSONB, -- Full source details, fetch metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_vehicle_pricing_data_vin ON public.vehicle_pricing_data(vin);
CREATE INDEX IF NOT EXISTS idx_vehicle_pricing_data_year_make_model ON public.vehicle_pricing_data(year, make, model);
CREATE INDEX IF NOT EXISTS idx_vehicle_pricing_data_source ON public.vehicle_pricing_data(source_name, source_type);
CREATE INDEX IF NOT EXISTS idx_vehicle_pricing_data_date_scraped ON public.vehicle_pricing_data(date_scraped DESC);
CREATE INDEX IF NOT EXISTS idx_vehicle_pricing_data_location ON public.vehicle_pricing_data(zip_code, location);

-- Pricing analytics aggregation table
CREATE TABLE IF NOT EXISTS public.pricing_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  trim TEXT,
  region TEXT,
  avg_price NUMERIC,
  median_price NUMERIC,
  min_price NUMERIC,
  max_price NUMERIC,
  sample_size INTEGER,
  price_trend NUMERIC, -- percentage change from previous period
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  analysis_period TEXT, -- 'weekly', 'monthly', etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Source configuration and status tracking
CREATE TABLE IF NOT EXISTS public.data_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_name TEXT UNIQUE NOT NULL,
  source_type TEXT NOT NULL,
  base_url TEXT,
  search_pattern TEXT,
  is_active BOOLEAN DEFAULT true,
  last_scraped TIMESTAMP WITH TIME ZONE,
  success_rate NUMERIC DEFAULT 100,
  rate_limit_per_hour INTEGER DEFAULT 60,
  requires_auth BOOLEAN DEFAULT false,
  auth_config JSONB,
  scraping_config JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial data sources
INSERT INTO public.data_sources (source_name, source_type, base_url, search_pattern, rate_limit_per_hour) VALUES
  ('CarMax', 'big_box_retailer', 'https://www.carmax.com', '/cars/{make}-{model}', 30),
  ('Carvana', 'big_box_retailer', 'https://www.carvana.com', '/cars/{make}-{model}', 30),
  ('AutoTrader', 'marketplace_aggregator', 'https://www.autotrader.com', '/cars-for-sale/{make}/{model}', 60),
  ('Cars.com', 'marketplace_aggregator', 'https://www.cars.com', '/shopping/results/?make={make}&model={model}', 60),
  ('CarGurus', 'marketplace_aggregator', 'https://www.cargurus.com', '/Cars/{make}-{model}', 60),
  ('AutoNation', 'franchise_mega_group', 'https://www.autonation.com', '/cars-for-sale', 30),
  ('Lithia Motors', 'franchise_mega_group', 'https://www.lithia.com', '/inventory', 30),
  ('Enterprise Car Sales', 'rental_remarketing', 'https://www.enterprisecarsales.com', '/car-sales', 20),
  ('Hertz Car Sales', 'rental_remarketing', 'https://www.hertzcarsales.com', '/used-cars', 20),
  ('Manheim', 'auction_wholesale', 'https://www.manheim.com', '/members/search', 10)
ON CONFLICT (source_name) DO NOTHING;

-- Enable RLS
ALTER TABLE public.vehicle_pricing_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow read access for authenticated users)
CREATE POLICY "Vehicle pricing data is viewable by authenticated users" 
ON public.vehicle_pricing_data 
FOR SELECT 
USING (true);

CREATE POLICY "Pricing analytics viewable by authenticated users" 
ON public.pricing_analytics 
FOR SELECT 
USING (true);

CREATE POLICY "Data sources viewable by authenticated users" 
ON public.data_sources 
FOR SELECT 
USING (true);

-- Admin policies for data insertion/updates
CREATE POLICY "Admin can manage vehicle pricing data" 
ON public.vehicle_pricing_data 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admin can manage pricing analytics" 
ON public.pricing_analytics 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admin can manage data sources" 
ON public.data_sources 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Update triggers
CREATE TRIGGER update_vehicle_pricing_data_updated_at
  BEFORE UPDATE ON public.vehicle_pricing_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_data_sources_updated_at
  BEFORE UPDATE ON public.data_sources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();