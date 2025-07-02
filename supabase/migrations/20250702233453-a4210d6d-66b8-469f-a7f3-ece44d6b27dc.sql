-- Enable RLS and add policies for Phase 2 tables

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