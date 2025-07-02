-- Create Market Listings table
CREATE TABLE public.market_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  valuation_request_id UUID NOT NULL REFERENCES public.valuation_requests(id) ON DELETE CASCADE,
  vin TEXT,
  source TEXT NOT NULL,
  source_type TEXT NOT NULL,
  price NUMERIC NOT NULL,
  mileage INTEGER,
  condition TEXT,
  dealer_name TEXT,
  location TEXT,
  zip_code TEXT,
  listing_url TEXT NOT NULL,
  screenshot_url TEXT,
  is_cpo BOOLEAN DEFAULT false,
  date_listed TIMESTAMP WITH TIME ZONE,
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  raw_data JSONB DEFAULT '{}',
  confidence_score NUMERIC DEFAULT 85,
  notes TEXT
);

-- Create indexes
CREATE INDEX idx_market_listings_valuation_id ON public.market_listings(valuation_request_id);
CREATE INDEX idx_market_listings_source ON public.market_listings(source);
CREATE INDEX idx_market_listings_price ON public.market_listings(price);
CREATE INDEX idx_market_listings_vin ON public.market_listings(vin);

-- Enable RLS and add policies
ALTER TABLE public.market_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view market listings for their valuations"
ON public.market_listings FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.valuation_requests vr
  WHERE vr.id = market_listings.valuation_request_id
  AND vr.user_id = auth.uid()
));

CREATE POLICY "Service role can manage market listings"
ON public.market_listings FOR ALL
USING (auth.role() = 'service_role');