-- CRITICAL SECURITY FIXES - Phase 2
-- Fix remaining RLS disabled tables (ERROR level issues)

-- Enable RLS on all remaining public tables without RLS (critical security issue)
-- Note: Some of these tables might not exist, but we'll handle them individually

-- Try to enable RLS on tables that show "RLS Disabled in Public" errors
DO $$
DECLARE
    table_names text[] := ARRAY[
        'manual_entry_valuations',
        'mileage_adjustment', 
        'offer_acceptance_log',
        'partner_submissions',
        'pdf_audit_logs',
        'pdf_downloads',
        'photo_condition_scores',
        'photo_scores',
        'plate_lookups',
        'premium_transactions',
        'premium_valuations',
        'pricing_curves',
        'public_tokens',
        'qa_reports',
        'recall_factor',
        'recalls_cache',
        'referrals',
        'saved_valuations',
        'scraped_listings',
        'seasonal_index',
        'source_intelligence',
        'title_status_adjustments',
        'top_referrers',
        'transmission_adjustment',
        'user_valuation_feedback',
        'valuation_audit_logs',
        'valuation_explanations',
        'valuation_factors',
        'valuation_feedback',
        'valuation_photos',
        'valuation_qa_reviews',
        'valuation_requests',
        'valuation_responses',
        'valuation_results',
        'valuation_stats',
        'valuations_uuid',
        'vehicle_comparisons',
        'vehicle_features',
        'vehicle_histories',
        'vehicle_history_events',
        'vin_cache',
        'vin_enrichment_data',
        'vin_failures',
        'vin_forecasts',
        'vpic_cache',
        'zip_cache',
        'zip_validations'
    ];
    table_name text;
BEGIN
    FOREACH table_name IN ARRAY table_names
    LOOP
        BEGIN
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', table_name);
            RAISE NOTICE 'Enabled RLS on table: %', table_name;
        EXCEPTION
            WHEN undefined_table THEN
                RAISE NOTICE 'Table % does not exist, skipping', table_name;
            WHEN OTHERS THEN
                RAISE NOTICE 'Error enabling RLS on %: %', table_name, SQLERRM;
        END;
    END LOOP;
END $$;

-- Add basic RLS policies for critical tables that don't have proper ones
-- Manual entry valuations - users can only access their own
CREATE POLICY "Users can manage their own manual valuations" ON public.manual_entry_valuations
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- PDF downloads - users can only access their own
CREATE POLICY "Users can manage their own PDF downloads" ON public.pdf_downloads
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Valuation requests - users can only access their own  
CREATE POLICY "Users can only access their own valuation requests" ON public.valuation_requests
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Valuation responses - users can only access their own
CREATE POLICY "Users can only access their own valuation responses" ON public.valuation_responses  
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Valuation results - users can only access their own
CREATE POLICY "Users can only access their own valuation results" ON public.valuation_results
FOR ALL USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Add admin policies for support
CREATE POLICY "Admins can view valuation requests for support" ON public.valuation_requests
FOR SELECT USING (public.is_current_user_admin());

CREATE POLICY "Admins can view valuation responses for support" ON public.valuation_responses
FOR SELECT USING (public.is_current_user_admin());

CREATE POLICY "Admins can view valuation results for support" ON public.valuation_results
FOR SELECT USING (public.is_current_user_admin());