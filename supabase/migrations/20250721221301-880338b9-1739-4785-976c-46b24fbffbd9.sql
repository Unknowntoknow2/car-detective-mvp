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