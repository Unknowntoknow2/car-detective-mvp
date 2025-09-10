-- AIN Enterprise Valuation Engine - Phase 1&2 Production Migration
-- Created: 2025-08-08 12:00:01
-- Description: Enterprise-grade schema with enhanced security, caching, and API optimization
-- Compatible with existing vehicle_specs schema (year column)

-- =====================================================
-- 1. ENHANCED VIN VALIDATION FUNCTIONS
-- =====================================================

-- ISO 3779 VIN validation function
CREATE OR REPLACE FUNCTION validate_vin_iso3779(vin_input TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    vin_clean TEXT;
    check_digit CHAR(1);
    calculated_check INTEGER;
    weight_values INTEGER[] := ARRAY[8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
    char_values TEXT := '0123456789ABCDEFGHJKLMNPRSTUVWXYZ';
    i INTEGER;
    char_val INTEGER;
    total INTEGER := 0;
BEGIN
    -- Basic validation
    IF vin_input IS NULL OR length(vin_input) != 17 THEN
        RETURN FALSE;
    END IF;
    
    vin_clean := upper(trim(vin_input));
    
    -- Check for invalid characters (I, O, Q not allowed in VIN)
    IF vin_clean ~ '[IOQ]' THEN
        RETURN FALSE;
    END IF;
    
    check_digit := substring(vin_clean, 9, 1);
    
    -- Calculate check digit
    FOR i IN 1..17 LOOP
        IF i != 9 THEN -- Skip check digit position
            char_val := position(substring(vin_clean, i, 1) IN char_values) - 1;
            IF char_val < 0 THEN
                RETURN FALSE;
            END IF;
            total := total + (char_val * weight_values[i]);
        END IF;
    END LOOP;
    
    calculated_check := total % 11;
    
    -- Check digit validation
    IF calculated_check = 10 THEN
        RETURN check_digit = 'X';
    ELSE
        RETURN check_digit = calculated_check::TEXT;
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- 2. API CACHE TABLE (Enhanced)
-- =====================================================

CREATE TABLE IF NOT EXISTS api_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_key TEXT NOT NULL,
    response_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    expires_at TIMESTAMPTZ NOT NULL,
    hit_count INTEGER DEFAULT 1,
    last_accessed TIMESTAMPTZ DEFAULT timezone('utc', now()),
    cache_type TEXT NOT NULL DEFAULT 'vin_decode',
    status_code INTEGER DEFAULT 200,
    source TEXT,
    correlation_id UUID,
    CONSTRAINT valid_cache_key CHECK (length(cache_key) > 0),
    CONSTRAINT valid_expiry CHECK (expires_at > created_at),
    CONSTRAINT valid_status CHECK (status_code >= 100 AND status_code < 600)
);

-- Indexes for api_cache
CREATE UNIQUE INDEX IF NOT EXISTS ux_cache_key ON api_cache (cache_key);
CREATE INDEX IF NOT EXISTS idx_cache_expires ON api_cache (expires_at);
CREATE INDEX IF NOT EXISTS idx_cache_type ON api_cache (cache_type);
CREATE INDEX IF NOT EXISTS idx_cache_accessed ON api_cache (last_accessed);
CREATE INDEX IF NOT EXISTS idx_cache_correlation ON api_cache (correlation_id);

-- =====================================================
-- 3. VIN HISTORY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS vin_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vin TEXT NOT NULL,
    request_ip INET,
    user_agent TEXT,
    session_id UUID,
    correlation_id UUID,
    decode_success BOOLEAN DEFAULT false,
    data_sources TEXT[] DEFAULT ARRAY[]::TEXT[],
    cache_hit BOOLEAN DEFAULT false,
    response_time_ms INTEGER,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    metadata JSONB DEFAULT '{}'::JSONB,
    CONSTRAINT valid_vin_length CHECK (length(vin) = 17),
    CONSTRAINT valid_response_time CHECK (response_time_ms >= 0)
);

-- Indexes for vin_history
CREATE INDEX IF NOT EXISTS idx_history_vin ON vin_history (vin);
CREATE INDEX IF NOT EXISTS idx_history_created ON vin_history (created_at);
CREATE INDEX IF NOT EXISTS idx_history_success ON vin_history (decode_success);
CREATE INDEX IF NOT EXISTS idx_history_correlation ON vin_history (correlation_id);
CREATE INDEX IF NOT EXISTS idx_history_session ON vin_history (session_id);

-- =====================================================
-- 4. USER QUERIES TABLE (for chatbot/AI interactions)
-- =====================================================

CREATE TABLE IF NOT EXISTS user_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    session_id UUID,
    vin TEXT,
    question_type TEXT NOT NULL,
    question_text TEXT NOT NULL,
    answer_data JSONB NOT NULL,
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    metadata JSONB DEFAULT '{}'::JSONB,
    CONSTRAINT valid_question_type CHECK (length(question_type) > 0),
    CONSTRAINT valid_question_text CHECK (length(question_text) > 0)
);

-- Indexes for user_queries
CREATE INDEX IF NOT EXISTS idx_queries_user ON user_queries (user_id);
CREATE INDEX IF NOT EXISTS idx_queries_session ON user_queries (session_id);
CREATE INDEX IF NOT EXISTS idx_queries_vin ON user_queries (vin);
CREATE INDEX IF NOT EXISTS idx_queries_type ON user_queries (question_type);
CREATE INDEX IF NOT EXISTS idx_queries_created ON user_queries (created_at);

-- =====================================================
-- 5. ENHANCED INDEXES ON EXISTING TABLES
-- =====================================================

-- Additional indexes for vehicle_specs (using existing 'year' column)
CREATE INDEX IF NOT EXISTS idx_vehicle_specs_year_make_model ON vehicle_specs (year, make, model);
CREATE INDEX IF NOT EXISTS idx_vehicle_specs_fuel_type ON vehicle_specs (fuel_type_primary);
CREATE INDEX IF NOT EXISTS idx_vehicle_specs_body_class ON vehicle_specs (body_class);

-- Additional indexes for nhtsa_recalls
CREATE INDEX IF NOT EXISTS idx_recalls_campaign ON nhtsa_recalls (nhtsa_campaign_number);
CREATE INDEX IF NOT EXISTS idx_recalls_date ON nhtsa_recalls (report_date);
CREATE INDEX IF NOT EXISTS idx_recalls_component ON nhtsa_recalls (component);

-- Additional indexes for nhtsa_safety_ratings  
CREATE INDEX IF NOT EXISTS idx_safety_overall ON nhtsa_safety_ratings (overall_rating);
CREATE INDEX IF NOT EXISTS idx_safety_model_year ON nhtsa_safety_ratings (model_year);

-- Additional indexes for fuel_economy
CREATE INDEX IF NOT EXISTS idx_fuel_mpg_combined ON fuel_economy (combined_mpg);
CREATE INDEX IF NOT EXISTS idx_fuel_type ON fuel_economy (fuel_type);

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE vehicle_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nhtsa_recalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE nhtsa_safety_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_economy ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE vin_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_queries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS deny_all_vehicle_specs ON vehicle_specs;
DROP POLICY IF EXISTS deny_all_recalls ON nhtsa_recalls;
DROP POLICY IF EXISTS deny_all_safety ON nhtsa_safety_ratings;
DROP POLICY IF EXISTS deny_all_fuel ON fuel_economy;
DROP POLICY IF EXISTS deny_all_cache ON api_cache;
DROP POLICY IF EXISTS deny_all_history ON vin_history;
DROP POLICY IF EXISTS queries_owner_select ON user_queries;
DROP POLICY IF EXISTS queries_owner_ins ON user_queries;
DROP POLICY IF EXISTS queries_owner_upd ON user_queries;
DROP POLICY IF EXISTS queries_owner_del ON user_queries;

-- Server-only access policies (deny all direct access)
CREATE POLICY deny_all_vehicle_specs ON vehicle_specs FOR ALL USING (false);
CREATE POLICY deny_all_recalls ON nhtsa_recalls FOR ALL USING (false);
CREATE POLICY deny_all_safety ON nhtsa_safety_ratings FOR ALL USING (false);
CREATE POLICY deny_all_fuel ON fuel_economy FOR ALL USING (false);
CREATE POLICY deny_all_cache ON api_cache FOR ALL USING (false);
CREATE POLICY deny_all_history ON vin_history FOR ALL USING (false);

-- User-accessible policies for user_queries
CREATE POLICY queries_owner_select ON user_queries FOR SELECT
  USING (auth.uid() = user_id OR session_id::text IN (SELECT unnest(string_to_array(current_setting('request.headers')::json->>'x-session-id', ','))));
  
CREATE POLICY queries_owner_ins ON user_queries FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
  
CREATE POLICY queries_owner_upd ON user_queries FOR UPDATE
  USING (auth.uid() = user_id);
  
CREATE POLICY queries_owner_del ON user_queries FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 7. SECURITY DEFINER RPCs
-- =====================================================

-- VIN decode RPC with comprehensive caching
CREATE OR REPLACE FUNCTION decode_vin_secure(
    vin_input TEXT,
    correlation_id_input UUID DEFAULT gen_random_uuid(),
    source_input TEXT DEFAULT 'api',
    include_cache_meta BOOLEAN DEFAULT false
)
RETURNS JSONB
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    cache_key TEXT;
    cached_result JSONB;
    vehicle_data JSONB;
    recalls_data JSONB;
    safety_data JSONB;
    fuel_data JSONB;
    final_result JSONB;
    cache_expires TIMESTAMPTZ;
    cache_ttl_hours INTEGER := 24;
BEGIN
    -- Input validation
    IF vin_input IS NULL OR length(trim(vin_input)) != 17 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Invalid VIN format. Must be exactly 17 characters.',
            'correlation_id', correlation_id_input
        );
    END IF;
    
    -- Validate VIN using ISO 3779 standard
    IF NOT validate_vin_iso3779(vin_input) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Invalid VIN check digit. VIN does not conform to ISO 3779 standard.',
            'correlation_id', correlation_id_input
        );
    END IF;
    
    cache_key := 'vin_decode:' || upper(trim(vin_input));
    
    -- Check cache first
    SELECT response_data, expires_at INTO cached_result, cache_expires
    FROM api_cache 
    WHERE cache_key = cache_key 
      AND expires_at > timezone('utc', now());
    
    IF cached_result IS NOT NULL THEN
        -- Update cache hit statistics
        UPDATE api_cache 
        SET hit_count = hit_count + 1, 
            last_accessed = timezone('utc', now())
        WHERE cache_key = cache_key;
        
        -- Add cache metadata if requested
        IF include_cache_meta THEN
            cached_result := cached_result || jsonb_build_object(
                'cache_hit', true,
                'cached_at', cache_expires,
                'correlation_id', correlation_id_input
            );
        END IF;
        
        RETURN cached_result;
    END IF;
    
    -- Fetch vehicle specs
    SELECT to_jsonb(vs.*) INTO vehicle_data
    FROM vehicle_specs vs
    WHERE vs.vin = upper(trim(vin_input));
    
    -- Fetch recalls
    SELECT jsonb_agg(to_jsonb(nr.*)) INTO recalls_data
    FROM nhtsa_recalls nr
    WHERE nr.vin = upper(trim(vin_input));
    
    -- Fetch safety ratings
    SELECT to_jsonb(nsr.*) INTO safety_data
    FROM nhtsa_safety_ratings nsr
    WHERE nsr.vin = upper(trim(vin_input));
    
    -- Fetch fuel economy
    SELECT to_jsonb(fe.*) INTO fuel_data
    FROM fuel_economy fe
    WHERE fe.vin = upper(trim(vin_input));
    
    -- Build comprehensive result
    final_result := jsonb_build_object(
        'success', CASE WHEN vehicle_data IS NOT NULL THEN true ELSE false END,
        'vin', upper(trim(vin_input)),
        'vehicle_specs', COALESCE(vehicle_data, '{}'::jsonb),
        'recalls', COALESCE(recalls_data, '[]'::jsonb),
        'safety_ratings', COALESCE(safety_data, '{}'::jsonb),
        'fuel_economy', COALESCE(fuel_data, '{}'::jsonb),
        'data_sources', ARRAY[source_input],
        'correlation_id', correlation_id_input,
        'cached_at', timezone('utc', now())
    );
    
    -- Cache the result
    cache_expires := timezone('utc', now()) + (cache_ttl_hours || ' hours')::INTERVAL;
    
    INSERT INTO api_cache (
        cache_key, 
        response_data, 
        expires_at, 
        cache_type, 
        source, 
        correlation_id
    ) VALUES (
        cache_key,
        final_result,
        cache_expires,
        'vin_decode',
        source_input,
        correlation_id_input
    )
    ON CONFLICT (cache_key) DO UPDATE SET
        response_data = EXCLUDED.response_data,
        expires_at = EXCLUDED.expires_at,
        hit_count = api_cache.hit_count + 1,
        last_accessed = timezone('utc', now()),
        correlation_id = EXCLUDED.correlation_id;
    
    RETURN final_result;
END;
$$;

-- Cache management RPC
CREATE OR REPLACE FUNCTION manage_cache(
    operation TEXT,
    cache_key_pattern TEXT DEFAULT NULL,
    max_age_hours INTEGER DEFAULT NULL
)
RETURNS JSONB
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    rows_affected INTEGER;
    result JSONB;
BEGIN
    CASE operation
        WHEN 'cleanup_expired' THEN
            DELETE FROM api_cache WHERE expires_at <= timezone('utc', now());
            GET DIAGNOSTICS rows_affected = ROW_COUNT;
            result := jsonb_build_object('operation', 'cleanup_expired', 'rows_deleted', rows_affected);
            
        WHEN 'cleanup_old' THEN
            IF max_age_hours IS NULL THEN
                max_age_hours := 48; -- Default 48 hours
            END IF;
            
            DELETE FROM api_cache 
            WHERE created_at <= timezone('utc', now()) - (max_age_hours || ' hours')::INTERVAL;
            GET DIAGNOSTICS rows_affected = ROW_COUNT;
            result := jsonb_build_object('operation', 'cleanup_old', 'rows_deleted', rows_affected, 'max_age_hours', max_age_hours);
            
        WHEN 'invalidate_pattern' THEN
            IF cache_key_pattern IS NULL THEN
                RAISE EXCEPTION 'cache_key_pattern required for invalidate_pattern operation';
            END IF;
            
            DELETE FROM api_cache WHERE cache_key LIKE cache_key_pattern;
            GET DIAGNOSTICS rows_affected = ROW_COUNT;
            result := jsonb_build_object('operation', 'invalidate_pattern', 'pattern', cache_key_pattern, 'rows_deleted', rows_affected);
            
        WHEN 'stats' THEN
            SELECT jsonb_build_object(
                'total_entries', COUNT(*),
                'expired_entries', SUM(CASE WHEN expires_at <= timezone('utc', now()) THEN 1 ELSE 0 END),
                'cache_types', jsonb_object_agg(cache_type, type_count),
                'avg_hit_count', AVG(hit_count),
                'oldest_entry', MIN(created_at),
                'newest_entry', MAX(created_at)
            ) INTO result
            FROM (
                SELECT cache_type, COUNT(*) as type_count, hit_count, created_at, expires_at
                FROM api_cache
                GROUP BY cache_type, hit_count, created_at, expires_at
            ) cache_stats;
            
        ELSE
            result := jsonb_build_object('error', 'Invalid operation. Use: cleanup_expired, cleanup_old, invalidate_pattern, or stats');
    END CASE;
    
    RETURN result;
END;
$$;

-- Log VIN request RPC
CREATE OR REPLACE FUNCTION log_vin_request(
    vin_input TEXT,
    success BOOLEAN,
    sources TEXT[] DEFAULT ARRAY[]::TEXT[],
    cache_hit BOOLEAN DEFAULT false,
    response_time_ms INTEGER DEFAULT NULL,
    error_msg TEXT DEFAULT NULL,
    correlation_id_input UUID DEFAULT gen_random_uuid(),
    session_id_input UUID DEFAULT NULL,
    metadata_input JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO vin_history (
        vin,
        decode_success,
        data_sources,
        cache_hit,
        response_time_ms,
        error_message,
        correlation_id,
        session_id,
        metadata
    ) VALUES (
        upper(trim(vin_input)),
        success,
        sources,
        cache_hit,
        response_time_ms,
        error_msg,
        correlation_id_input,
        session_id_input,
        metadata_input
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$;

-- =====================================================
-- 8. GRANT PERMISSIONS
-- =====================================================

-- Grant execute permissions to anon and authenticated users for RPCs
GRANT EXECUTE ON FUNCTION decode_vin_secure TO anon, authenticated;
GRANT EXECUTE ON FUNCTION manage_cache TO anon, authenticated;
GRANT EXECUTE ON FUNCTION log_vin_request TO anon, authenticated;
GRANT EXECUTE ON FUNCTION validate_vin_iso3779 TO anon, authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Grant select access to user_queries (with RLS)
GRANT SELECT, INSERT, UPDATE, DELETE ON user_queries TO authenticated;

-- =====================================================
-- 9. CACHE CLEANUP TRIGGER
-- =====================================================

-- Function to auto-cleanup expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Clean up expired entries when cache grows too large
    IF (SELECT COUNT(*) FROM api_cache) > 10000 THEN
        DELETE FROM api_cache WHERE expires_at <= timezone('utc', now());
    END IF;
    
    RETURN NEW;
END;
$$;

-- Trigger to auto-cleanup cache
DROP TRIGGER IF EXISTS trigger_cleanup_cache ON api_cache;
CREATE TRIGGER trigger_cleanup_cache
    AFTER INSERT ON api_cache
    FOR EACH STATEMENT
    EXECUTE FUNCTION cleanup_expired_cache();

-- =====================================================
-- 10. PERFORMANCE ANALYSIS VIEWS
-- =====================================================

-- Cache performance view
CREATE OR REPLACE VIEW cache_performance AS
SELECT 
    cache_type,
    COUNT(*) as total_entries,
    SUM(hit_count) as total_hits,
    AVG(hit_count) as avg_hits_per_entry,
    COUNT(CASE WHEN expires_at > timezone('utc', now()) THEN 1 END) as active_entries,
    COUNT(CASE WHEN expires_at <= timezone('utc', now()) THEN 1 END) as expired_entries,
    MIN(created_at) as oldest_entry,
    MAX(last_accessed) as most_recent_access
FROM api_cache
GROUP BY cache_type;

-- VIN request analytics view
CREATE OR REPLACE VIEW vin_analytics AS
SELECT 
    DATE_TRUNC('hour', created_at) as hour_bucket,
    COUNT(*) as total_requests,
    COUNT(CASE WHEN decode_success THEN 1 END) as successful_requests,
    COUNT(CASE WHEN cache_hit THEN 1 END) as cache_hits,
    AVG(response_time_ms) as avg_response_time,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_time
FROM vin_history
WHERE created_at >= timezone('utc', now()) - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', created_at)
ORDER BY hour_bucket DESC;

-- Grant view access
GRANT SELECT ON cache_performance TO anon, authenticated;
GRANT SELECT ON vin_analytics TO anon, authenticated;

-- Migration completion notice
DO $$
BEGIN
    RAISE NOTICE 'Phase 1-2 Production Migration Completed Successfully!';
    RAISE NOTICE 'Features: Enhanced VIN validation, API caching, RLS security, performance monitoring';
    RAISE NOTICE 'Ready for production deployment with correlation IDs and comprehensive observability';
END $$;
