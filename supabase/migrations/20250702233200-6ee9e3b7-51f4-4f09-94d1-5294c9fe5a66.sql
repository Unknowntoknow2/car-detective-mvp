-- AIN Phase 2: Data Quality, Explainability, and AI-Enhanced Valuation Engine

-- 1. VIN Enrichment and Decoding Results
CREATE TABLE IF NOT EXISTS public.vin_enrichment_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vin TEXT NOT NULL,
  source TEXT NOT NULL, -- 'vpic', 'carmd', 'autocheck', etc.
  decoded_data JSONB NOT NULL DEFAULT '{}',
  build_data JSONB DEFAULT '{}', -- trim, packages, options
  features_detected JSONB DEFAULT '{}', -- AI-detected features from photos
  enrichment_score NUMERIC DEFAULT 0, -- 0-100 completeness score
  last_enriched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(vin, source)
);

-- 2. AI Photo Analysis Results
CREATE TABLE IF NOT EXISTS public.ai_photo_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID, -- links to market_comps
  vin TEXT,
  photo_urls TEXT[] DEFAULT '{}',
  analysis_results JSONB NOT NULL DEFAULT '{}', -- condition, damage, features
  condition_score NUMERIC DEFAULT 0, -- 0-100
  damage_detected JSONB DEFAULT '{}', -- accidents, wear, etc.
  features_detected JSONB DEFAULT '{}', -- sunroof, leather, etc.
  confidence_score NUMERIC DEFAULT 0,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Market Context and Trends
CREATE TABLE IF NOT EXISTS public.market_context_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  trim TEXT,
  zip_code TEXT NOT NULL,
  supply_demand_ratio NUMERIC DEFAULT 1.0,
  price_trend_90d JSONB DEFAULT '{}', -- price history
  avg_days_on_market INTEGER DEFAULT 0,
  market_temperature TEXT DEFAULT 'neutral', -- hot, warm, neutral, cold
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(make, model, year, COALESCE(trim, ''), zip_code)
);

-- 4. Fraud Detection and Anomaly Flags
CREATE TABLE IF NOT EXISTS public.fraud_detection_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID, -- links to market_comps
  vin TEXT,
  flag_type TEXT NOT NULL, -- 'price_anomaly', 'fake_listing', 'duplicate', etc.
  flag_reason TEXT NOT NULL,
  confidence_score NUMERIC DEFAULT 0,
  auto_flagged BOOLEAN DEFAULT true,
  human_reviewed BOOLEAN DEFAULT false,
  is_valid BOOLEAN DEFAULT null, -- null=pending, true=valid, false=fraud
  reviewed_by UUID, -- admin user_id
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Explainable AI Valuations
CREATE TABLE IF NOT EXISTS public.valuation_explanations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  valuation_request_id UUID REFERENCES public.valuation_requests(id),
  explanation_markdown TEXT NOT NULL,
  source_weights JSONB NOT NULL DEFAULT '{}', -- auction: 0.4, dealer: 0.3, etc.
  influential_comps JSONB NOT NULL DEFAULT '[]', -- top comps with links
  adjustment_factors JSONB NOT NULL DEFAULT '{}', -- mileage, region, features
  confidence_breakdown JSONB NOT NULL DEFAULT '{}',
  price_range_explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. User Feedback Collection
CREATE TABLE IF NOT EXISTS public.user_valuation_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  valuation_request_id UUID REFERENCES public.valuation_requests(id),
  user_id UUID REFERENCES auth.users(id),
  actual_sale_price NUMERIC,
  sale_date DATE,
  sale_type TEXT, -- 'dealer', 'private', 'trade', 'auction'
  best_offer_received NUMERIC,
  feedback_notes TEXT,
  accuracy_rating INTEGER, -- 1-5 stars
  would_recommend BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Partner API Keys and Access
CREATE TABLE IF NOT EXISTS public.api_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name TEXT NOT NULL,
  api_key_hash TEXT NOT NULL UNIQUE,
  partner_type TEXT NOT NULL, -- 'dealer', 'auction', 'marketplace'
  permissions JSONB NOT NULL DEFAULT '{}', -- what endpoints they can access
  rate_limit_per_hour INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  last_accessed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Partner Data Submissions
CREATE TABLE IF NOT EXISTS public.partner_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.api_partners(id),
  submission_type TEXT NOT NULL, -- 'sale', 'listing', 'auction_result'
  vin TEXT NOT NULL,
  vehicle_data JSONB NOT NULL,
  sale_data JSONB, -- price, date, buyer_type
  verification_status TEXT DEFAULT 'pending', -- pending, verified, rejected
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Model Training and Performance
CREATE TABLE IF NOT EXISTS public.model_training_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_version TEXT NOT NULL,
  training_data_size INTEGER NOT NULL,
  validation_rmse NUMERIC,
  test_rmse NUMERIC,
  feature_importance JSONB DEFAULT '{}',
  hyperparameters JSONB DEFAULT '{}',
  deployment_status TEXT DEFAULT 'testing', -- testing, staging, production
  deployed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Human QA and Overrides
CREATE TABLE IF NOT EXISTS public.valuation_qa_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  valuation_request_id UUID REFERENCES public.valuation_requests(id),
  reviewer_id UUID REFERENCES auth.users(id),
  original_estimate NUMERIC NOT NULL,
  manual_override_estimate NUMERIC,
  override_reason TEXT,
  quality_score INTEGER, -- 1-5
  qa_notes TEXT,
  approved BOOLEAN DEFAULT null,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Comprehensive Audit and Compliance Logging
CREATE TABLE IF NOT EXISTS public.compliance_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- 'valuation', 'comp', 'user_action'
  entity_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'created', 'updated', 'accessed', 'deleted'
  user_id UUID,
  session_id UUID,
  ip_address INET,
  user_agent TEXT,
  data_sources_used TEXT[],
  input_data JSONB,
  output_data JSONB,
  processing_time_ms INTEGER,
  compliance_flags TEXT[] DEFAULT '{}',
  retention_until DATE, -- for GDPR/data retention
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vin_enrichment_vin ON public.vin_enrichment_data(vin);
CREATE INDEX IF NOT EXISTS idx_photo_analysis_vin ON public.ai_photo_analysis(vin);
CREATE INDEX IF NOT EXISTS idx_market_context_lookup ON public.market_context_data(make, model, year, zip_code);
CREATE INDEX IF NOT EXISTS idx_fraud_flags_listing ON public.fraud_detection_flags(listing_id);
CREATE INDEX IF NOT EXISTS idx_explanations_request ON public.valuation_explanations(valuation_request_id);
CREATE INDEX IF NOT EXISTS idx_feedback_request ON public.user_valuation_feedback(valuation_request_id);
CREATE INDEX IF NOT EXISTS idx_partners_api_key ON public.api_partners(api_key_hash);
CREATE INDEX IF NOT EXISTS idx_submissions_partner ON public.partner_submissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_qa_reviews_request ON public.valuation_qa_reviews(valuation_request_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON public.compliance_audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON public.compliance_audit_log(created_at);

-- Enable RLS on all tables
ALTER TABLE public.vin_enrichment_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_photo_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_context_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_detection_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_valuation_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_training_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_qa_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for VIN Enrichment Data
CREATE POLICY "Service role can manage vin enrichment" ON public.vin_enrichment_data
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Premium users can view vin enrichment" ON public.vin_enrichment_data
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND (role = ANY(ARRAY['premium', 'dealer', 'admin']) OR is_premium_dealer = true)
    )
  );

-- RLS Policies for AI Photo Analysis
CREATE POLICY "Service role can manage photo analysis" ON public.ai_photo_analysis
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Premium users can view photo analysis" ON public.ai_photo_analysis
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND (role = ANY(ARRAY['premium', 'dealer', 'admin']) OR is_premium_dealer = true)
    )
  );

-- RLS Policies for Market Context
CREATE POLICY "Anyone can view market context" ON public.market_context_data
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage market context" ON public.market_context_data
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for Fraud Flags
CREATE POLICY "Admins can manage fraud flags" ON public.fraud_detection_flags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Explanations
CREATE POLICY "Users can view explanations for their requests" ON public.valuation_explanations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.valuation_requests vr 
      WHERE vr.id = valuation_explanations.valuation_request_id 
      AND vr.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage explanations" ON public.valuation_explanations
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for User Feedback
CREATE POLICY "Users can manage their own feedback" ON public.user_valuation_feedback
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback" ON public.user_valuation_feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for API Partners (Admin only)
CREATE POLICY "Admins can manage api partners" ON public.api_partners
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Partner Submissions
CREATE POLICY "Service role can manage submissions" ON public.partner_submissions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can view submissions" ON public.partner_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Model Training (Admin only)
CREATE POLICY "Admins can manage model training" ON public.model_training_runs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for QA Reviews
CREATE POLICY "Admins can manage qa reviews" ON public.valuation_qa_reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Audit Log
CREATE POLICY "Admins can view audit log" ON public.compliance_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Service role can manage audit log" ON public.compliance_audit_log
  FOR ALL USING (auth.role() = 'service_role');

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_vin_enrichment_updated_at
  BEFORE UPDATE ON public.vin_enrichment_data
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_market_context_updated_at
  BEFORE UPDATE ON public.market_context_data
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_api_partners_updated_at
  BEFORE UPDATE ON public.api_partners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();