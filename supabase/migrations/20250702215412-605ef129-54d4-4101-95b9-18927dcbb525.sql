-- Create comprehensive task queue and orchestration system

-- Main task queue for all fetch operations
CREATE TABLE IF NOT EXISTS public.data_fetch_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_type TEXT NOT NULL, -- 'dealer', 'auction', 'marketplace', 'oem', 'p2p'
  source_name TEXT NOT NULL,
  target_url TEXT,
  search_params JSONB NOT NULL, -- year, make, model, trim, vin, zip, etc.
  priority INTEGER NOT NULL DEFAULT 50, -- 1-100, higher = more urgent
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed', 'blocked'
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  frequency_minutes INTEGER NOT NULL DEFAULT 1440, -- daily default
  error_log TEXT,
  provenance JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for task scheduling and processing
CREATE INDEX IF NOT EXISTS idx_data_fetch_tasks_next_run ON public.data_fetch_tasks(next_run_at, status);
CREATE INDEX IF NOT EXISTS idx_data_fetch_tasks_source ON public.data_fetch_tasks(source_name, task_type);
CREATE INDEX IF NOT EXISTS idx_data_fetch_tasks_status ON public.data_fetch_tasks(status, priority DESC);

-- Normalized comparison data structure
CREATE TABLE IF NOT EXISTS public.vehicle_comparisons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.data_fetch_tasks(id),
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
  source_type TEXT NOT NULL, -- 'franchise_mega', 'big_box', 'auction_wholesale', etc.
  listing_url TEXT NOT NULL,
  screenshot_url TEXT,
  cpo_status BOOLEAN DEFAULT false,
  vehicle_condition TEXT,
  incentives TEXT,
  listing_date TIMESTAMP WITH TIME ZONE,
  fetch_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  explanation TEXT NOT NULL, -- Why this is a relevant comp
  confidence_score NUMERIC DEFAULT 85, -- 0-100
  is_verified BOOLEAN DEFAULT false,
  quality_flags JSONB DEFAULT '[]', -- QA flags for this comp
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for fast comp lookups and analysis
CREATE INDEX IF NOT EXISTS idx_vehicle_comparisons_vin ON public.vehicle_comparisons(vin);
CREATE INDEX IF NOT EXISTS idx_vehicle_comparisons_vehicle ON public.vehicle_comparisons(year, make, model);
CREATE INDEX IF NOT EXISTS idx_vehicle_comparisons_source ON public.vehicle_comparisons(source_name, source_type);
CREATE INDEX IF NOT EXISTS idx_vehicle_comparisons_price ON public.vehicle_comparisons(price);
CREATE INDEX IF NOT EXISTS idx_vehicle_comparisons_fetch ON public.vehicle_comparisons(fetch_timestamp DESC);

-- Source intelligence and performance tracking
CREATE TABLE IF NOT EXISTS public.source_intelligence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_name TEXT NOT NULL UNIQUE,
  source_type TEXT NOT NULL,
  base_url TEXT,
  avg_response_time NUMERIC,
  success_rate NUMERIC DEFAULT 100,
  last_successful_fetch TIMESTAMP WITH TIME ZONE,
  total_fetches INTEGER DEFAULT 0,
  total_successes INTEGER DEFAULT 0,
  total_failures INTEGER DEFAULT 0,
  access_status TEXT DEFAULT 'open', -- 'open', 'restricted', 'blocked', 'requires_auth'
  restrictions JSONB DEFAULT '{}', -- rate limits, ToS restrictions, etc.
  comp_quality_score NUMERIC DEFAULT 85, -- Average quality of comps from this source
  typical_comp_count INTEGER DEFAULT 0, -- Avg comps per fetch
  pricing_bias NUMERIC DEFAULT 0, -- Positive = overpriced, negative = underpriced vs market
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Quality assurance and outlier detection
CREATE TABLE IF NOT EXISTS public.qa_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  vehicle_segment TEXT, -- "year-make-model" or "ALL"
  total_comps_ingested INTEGER DEFAULT 0,
  duplicate_comps_removed INTEGER DEFAULT 0,
  outliers_detected INTEGER DEFAULT 0,
  missing_data_flags INTEGER DEFAULT 0,
  source_failures INTEGER DEFAULT 0,
  avg_confidence_score NUMERIC,
  price_variance_coefficient NUMERIC,
  qa_alerts JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Legal compliance and attribution tracking
CREATE TABLE IF NOT EXISTS public.compliance_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_name TEXT NOT NULL,
  action_type TEXT NOT NULL, -- 'fetch', 'store', 'display', 'remove'
  data_type TEXT NOT NULL, -- 'pricing', 'image', 'description'
  terms_compliance BOOLEAN DEFAULT true,
  attribution_provided BOOLEAN DEFAULT true,
  takedown_requested BOOLEAN DEFAULT false,
  takedown_date TIMESTAMP WITH TIME ZONE,
  compliance_notes TEXT,
  legal_review_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'requires_action'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.data_fetch_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin access
CREATE POLICY "Admin can manage fetch tasks" 
ON public.data_fetch_tasks 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admin can view comparisons" 
ON public.vehicle_comparisons 
FOR SELECT 
USING (true); -- Allow viewing for pricing analysis

CREATE POLICY "Admin can manage source intelligence" 
ON public.source_intelligence 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admin can view QA reports" 
ON public.qa_reports 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admin can manage compliance log" 
ON public.compliance_log 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Update triggers
CREATE TRIGGER update_data_fetch_tasks_updated_at
  BEFORE UPDATE ON public.data_fetch_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_source_intelligence_updated_at
  BEFORE UPDATE ON public.source_intelligence
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to schedule next task run
CREATE OR REPLACE FUNCTION public.schedule_next_task_run()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Schedule next run based on frequency
  NEW.next_run_at = NEW.last_run_at + (NEW.frequency_minutes || ' minutes')::INTERVAL;
  RETURN NEW;
END;
$$;

CREATE TRIGGER schedule_task_trigger
  BEFORE UPDATE OF last_run_at ON public.data_fetch_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.schedule_next_task_run();

-- Insert comprehensive task configurations for all enterprise sources
INSERT INTO public.data_fetch_tasks (task_type, source_name, target_url, search_params, priority, frequency_minutes) VALUES
-- Wholesale & Auction Data (Highest Priority)
('auction', 'Manheim', 'https://www.manheim.com/', '{"vehicle_type": "all"}', 95, 360),
('auction', 'ADESA', 'https://www.adesa.com/inventory/', '{"vehicle_type": "all"}', 95, 360),
('auction', 'Copart', 'https://www.copart.com/', '{"vehicle_type": "all"}', 90, 480),
('auction', 'IAAI', 'https://www.iaai.com/Search', '{"vehicle_type": "all"}', 90, 480),
('auction', 'BacklotCars', 'https://www.backlotcars.com/buy/search', '{"vehicle_type": "all"}', 85, 720),
('auction', 'ACV Auctions', 'https://www.acvauctions.com/', '{"vehicle_type": "all"}', 85, 720),
('auction', 'Edge Pipeline', 'https://www.edgepipeline.com/', '{"vehicle_type": "all"}', 80, 720),
('auction', 'KAR Global', 'https://www.karglobal.com/', '{"vehicle_type": "all"}', 80, 720),

-- Major Franchise Dealer Groups (High Priority)
('dealer', 'AutoNation', 'https://www.autonation.com/inventory', '{"vehicle_type": "all"}', 90, 240),
('dealer', 'Lithia Motors', 'https://www.lithia.com/', '{"vehicle_type": "all"}', 90, 240),
('dealer', 'Sonic Automotive', 'https://www.sonicautomotive.com/', '{"vehicle_type": "all"}', 85, 360),
('dealer', 'Group 1 Automotive', 'https://www.group1auto.com/', '{"vehicle_type": "all"}', 85, 360),
('dealer', 'Penske Automotive', 'https://www.penskeautomotive.com/inventory', '{"vehicle_type": "all"}', 85, 360),
('dealer', 'Asbury Automotive', 'https://www.asburyauto.com/', '{"vehicle_type": "all"}', 80, 360),
('dealer', 'Hendrick Automotive', 'https://www.hendrickcars.com/', '{"vehicle_type": "all"}', 80, 360),

-- Online Retailers & National "Big Box" Outlets (High Priority)
('big_box', 'CarMax', 'https://www.carmax.com/cars', '{"vehicle_type": "all"}', 95, 180),
('big_box', 'Carvana', 'https://www.carvana.com/cars', '{"vehicle_type": "all"}', 95, 180),
('big_box', 'Vroom', 'https://www.vroom.com/', '{"vehicle_type": "all"}', 85, 240),
('big_box', 'EchoPark', 'https://www.echopark.com/', '{"vehicle_type": "all"}', 85, 240),
('big_box', 'Shift', 'https://www.shift.com/', '{"vehicle_type": "all"}', 80, 360),
('big_box', 'Drivetime', 'https://www.drivetime.com/', '{"vehicle_type": "all"}', 75, 480),
('big_box', 'CarLotz', 'https://www.carlotz.com/', '{"vehicle_type": "all"}', 75, 480),

-- Marketplaces & Classifieds (Medium-High Priority)
('marketplace', 'Cars.com', 'https://www.cars.com/shopping/', '{"vehicle_type": "all"}', 90, 360),
('marketplace', 'AutoTrader', 'https://www.autotrader.com/', '{"vehicle_type": "all"}', 90, 360),
('marketplace', 'CarGurus', 'https://www.cargurus.com/', '{"vehicle_type": "all"}', 90, 360),
('marketplace', 'TrueCar', 'https://www.truecar.com/', '{"vehicle_type": "all"}', 85, 480),

-- Peer-to-Peer Sources (Medium Priority)
('p2p', 'Craigslist', 'https://craigslist.org/', '{"vehicle_type": "all"}', 75, 720),
('p2p', 'Facebook Marketplace', 'https://www.facebook.com/marketplace/', '{"vehicle_type": "all"}', 75, 720),
('p2p', 'OfferUp', 'https://offerup.com/explore/cars', '{"vehicle_type": "all"}', 70, 720),
('p2p', 'eBay Motors', 'https://www.ebay.com/motors', '{"vehicle_type": "all"}', 70, 720),

-- Book/Guide/Reference Valuations (Critical for Calibration)
('valuation_api', 'Kelley Blue Book', 'https://www.kbb.com/', '{"data_type": "valuation"}', 100, 360),
('valuation_api', 'Edmunds', 'https://www.edmunds.com/appraisal/', '{"data_type": "valuation"}', 100, 360),
('valuation_api', 'Black Book', 'https://www.blackbook.com/', '{"data_type": "wholesale"}', 95, 480),
('valuation_api', 'NADA J.D. Power', 'https://www.jdpower.com/cars', '{"data_type": "guide_values"}', 90, 720),
('valuation_api', 'Galves', 'https://galves.com/', '{"data_type": "wholesale_api"}', 85, 720),

-- OEM/Certified Pre-Owned Sources (Medium Priority)
('oem', 'Ford CPO', 'https://www.ford.com/certified-used/', '{"vehicle_type": "cpo"}', 80, 720),
('oem', 'Toyota Certified', 'https://www.toyotacertified.com/', '{"vehicle_type": "cpo"}', 80, 720),
('oem', 'GM Certified', 'https://www.gmcertified.com/', '{"vehicle_type": "cpo"}', 80, 720),

-- Instant Offer & Trade-In APIs (High Value for Training)
('instant_offer', 'KBB Instant Cash', 'https://www.kbb.com/instant-cash-offer/', '{"data_type": "instant_offer"}', 90, 480),
('instant_offer', 'Edmunds Instant', 'https://www.edmunds.com/appraisal/', '{"data_type": "instant_offer"}', 90, 480),
('instant_offer', 'TrueCar Sell', 'https://www.truecar.com/sell/', '{"data_type": "trade_in"}', 85, 480),

-- History, Recalls & Data Quality Sources (Daily)
('data_quality', 'Carfax', 'https://www.carfax.com/', '{"data_type": "history"}', 70, 1440),
('data_quality', 'AutoCheck', 'https://www.autocheck.com/vehiclehistory/', '{"data_type": "history"}', 70, 1440),
('data_quality', 'NHTSA Recalls', 'https://www.nhtsa.gov/recalls', '{"data_type": "recalls"}', 60, 1440),
('data_quality', 'Consumer Reports', 'https://www.consumerreports.org/cars/', '{"data_type": "reliability"}', 60, 1440),
('data_quality', 'CarComplaints', 'https://www.carcomplaints.com/', '{"data_type": "complaints"}', 50, 1440)
ON CONFLICT DO NOTHING;

-- Insert source intelligence baselines
INSERT INTO public.source_intelligence (source_name, source_type, base_url, typical_comp_count) VALUES
('AutoNation', 'franchise_mega', 'https://www.autonation.com/', 15),
('Lithia Motors', 'franchise_mega', 'https://www.lithia.com/', 12),
('CarMax', 'big_box_retailer', 'https://www.carmax.com/', 25),
('Carvana', 'big_box_retailer', 'https://www.carvana.com/', 20),
('Manheim', 'auction_wholesale', 'https://www.manheim.com/', 8),
('Autotrader', 'marketplace_aggregator', 'https://www.autotrader.com/', 30),
('Cars.com', 'marketplace_aggregator', 'https://www.cars.com/', 28),
('CarGurus', 'marketplace_aggregator', 'https://www.cargurus.com/', 32),
('Craigslist', 'peer_to_peer', 'https://craigslist.org/', 10),
('eBay Motors', 'peer_to_peer', 'https://www.ebay.com/motors', 8)
ON CONFLICT (source_name) DO NOTHING;