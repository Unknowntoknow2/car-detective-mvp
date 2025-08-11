-- PR E: Valuation Adjusters v2 - Enhanced valuation algorithms with market intelligence
-- Migration: 20250811201001_enhanced_valuation_adjusters.sql
-- Created: 2025-08-11

-- Enable UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- VALUATION ADJUSTERS CONFIGURATION TABLE
-- ============================================================================

CREATE TABLE valuation_adjusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adjuster_type VARCHAR(50) NOT NULL CHECK (adjuster_type IN (
        'market_temperature', 'regional_demand', 'consumer_behavior', 
        'seasonal_pattern', 'inventory_pressure', 'brand_strength',
        'model_popularity', 'competitive_pressure', 'price_volatility',
        'sales_momentum', 'search_trend', 'liquidity_factor'
    )),
    adjuster_name VARCHAR(100) NOT NULL,
    adjuster_description TEXT,
    base_multiplier DECIMAL(6,4) DEFAULT 1.0000 CHECK (base_multiplier > 0),
    min_multiplier DECIMAL(6,4) DEFAULT 0.5000 CHECK (min_multiplier > 0),
    max_multiplier DECIMAL(6,4) DEFAULT 2.0000 CHECK (max_multiplier > min_multiplier),
    
    -- Market signal dependencies (references to PR D signals)
    market_signal_dependency TEXT[] DEFAULT '{}',
    
    -- Geographic applicability
    regional_applicability TEXT[] DEFAULT '{}', -- States, metros, or 'national'
    
    -- Vehicle type applicability
    vehicle_types TEXT[] DEFAULT '{}', -- sedan, suv, truck, luxury, etc.
    make_applicability TEXT[] DEFAULT '{}', -- Specific makes if applicable
    year_range INTEGER[] DEFAULT '{1990,2030}', -- [min_year, max_year]
    
    -- Seasonal and temporal patterns
    seasonal_pattern JSONB DEFAULT '{}', -- Monthly adjustment factors
    temporal_decay_factor DECIMAL(4,3) DEFAULT 1.000, -- How quickly adjuster loses relevance
    
    -- Confidence and quality metrics
    confidence_threshold DECIMAL(3,2) DEFAULT 0.70 CHECK (confidence_threshold BETWEEN 0 AND 1),
    data_quality_weight DECIMAL(3,2) DEFAULT 1.00 CHECK (data_quality_weight BETWEEN 0 AND 1),
    
    -- Operational flags
    is_active BOOLEAN DEFAULT true,
    requires_market_data BOOLEAN DEFAULT false,
    priority_order INTEGER DEFAULT 100, -- Lower numbers = higher priority
    
    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(100),
    
    -- Indexes for performance
    UNIQUE(adjuster_type, adjuster_name)
);

-- Index for fast lookups
CREATE INDEX idx_valuation_adjusters_type_active ON valuation_adjusters(adjuster_type, is_active);
CREATE INDEX idx_valuation_adjusters_priority ON valuation_adjusters(priority_order, is_active);

-- ============================================================================
-- ENHANCED VALUATION RESULTS TABLE
-- ============================================================================

CREATE TABLE enhanced_valuations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID,
    
    -- Vehicle identification
    vehicle_year INTEGER NOT NULL CHECK (vehicle_year BETWEEN 1900 AND 2030),
    vehicle_make VARCHAR(50) NOT NULL,
    vehicle_model VARCHAR(100) NOT NULL,
    vehicle_trim VARCHAR(100),
    vehicle_vin VARCHAR(17),
    
    -- Vehicle characteristics
    mileage INTEGER CHECK (mileage >= 0),
    condition VARCHAR(20) CHECK (condition IN ('excellent', 'very_good', 'good', 'fair', 'poor')),
    location_state VARCHAR(2),
    location_metro VARCHAR(100),
    location_zip VARCHAR(10),
    
    -- Base valuation data
    base_valuation DECIMAL(12,2) NOT NULL CHECK (base_valuation > 0),
    valuation_method VARCHAR(50) DEFAULT 'enhanced_ml',
    base_model_confidence DECIMAL(3,2) CHECK (base_model_confidence BETWEEN 0 AND 1),
    
    -- Market intelligence integration (from PR D)
    market_intelligence_score INTEGER CHECK (market_intelligence_score BETWEEN 0 AND 100),
    market_temperature VARCHAR(20) CHECK (market_temperature IN ('hot', 'warm', 'cool', 'cold')),
    market_data_timestamp TIMESTAMPTZ,
    market_data_sources TEXT[] DEFAULT '{}',
    
    -- Adjuster breakdown (structured JSON for detailed analysis)
    applied_adjusters JSONB DEFAULT '{}', -- Complete adjuster application log
    
    -- Categorical adjustments
    market_condition_adjustments JSONB DEFAULT '{}', -- Market temp, momentum, volatility
    regional_adjustments JSONB DEFAULT '{}', -- Geographic factors
    consumer_behavior_adjustments JSONB DEFAULT '{}', -- Search trends, sentiment
    seasonal_adjustments JSONB DEFAULT '{}', -- Time-based patterns
    vehicle_specific_adjustments JSONB DEFAULT '{}', -- Make/model/year specific
    
    -- Final results
    total_adjustment_percentage DECIMAL(6,3) DEFAULT 0.000, -- Net adjustment %
    final_valuation DECIMAL(12,2) NOT NULL CHECK (final_valuation > 0),
    price_range_low DECIMAL(12,2),
    price_range_high DECIMAL(12,2),
    
    -- Quality and confidence metrics
    confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
    data_quality_score DECIMAL(3,2) CHECK (data_quality_score BETWEEN 0 AND 1),
    prediction_uncertainty DECIMAL(5,2), -- Standard deviation or confidence interval
    
    -- Explanatory content
    valuation_explanation TEXT,
    key_factors TEXT[],
    market_insights TEXT[],
    adjuster_reasoning JSONB DEFAULT '{}',
    
    -- User context
    valuation_mode VARCHAR(20) DEFAULT 'market' CHECK (valuation_mode IN ('buyer', 'seller', 'trade', 'insurance', 'market')),
    user_id VARCHAR(100),
    api_version VARCHAR(10) DEFAULT 'v2',
    
    -- Performance tracking
    processing_time_ms INTEGER,
    market_data_fetch_time_ms INTEGER,
    
    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CHECK (price_range_low <= final_valuation AND final_valuation <= price_range_high)
);

-- Performance indexes
CREATE INDEX idx_enhanced_valuations_vehicle ON enhanced_valuations(vehicle_year, vehicle_make, vehicle_model);
CREATE INDEX idx_enhanced_valuations_location ON enhanced_valuations(location_state, location_metro);
CREATE INDEX idx_enhanced_valuations_market_temp ON enhanced_valuations(market_temperature, market_intelligence_score);
CREATE INDEX idx_enhanced_valuations_session ON enhanced_valuations(session_id, created_at);
CREATE INDEX idx_enhanced_valuations_created ON enhanced_valuations(created_at DESC);

-- ============================================================================
-- REAL-TIME MARKET ADJUSTMENT FACTORS TABLE
-- ============================================================================

CREATE TABLE market_adjustment_factors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Geographic scope
    region VARCHAR(50) NOT NULL, -- 'national', state code, or metro area
    region_type VARCHAR(20) DEFAULT 'state' CHECK (region_type IN ('national', 'state', 'metro', 'zip')),
    
    -- Vehicle scope
    make VARCHAR(50),
    model VARCHAR(100),
    year_range INTEGER[] DEFAULT '{1990,2030}', -- [min_year, max_year]
    vehicle_category VARCHAR(30), -- sedan, suv, truck, luxury, electric, etc.
    
    -- Market conditions
    market_temperature VARCHAR(20) CHECK (market_temperature IN ('hot', 'warm', 'cool', 'cold', 'any')),
    market_score_range INTEGER[] DEFAULT '{0,100}', -- [min_score, max_score]
    
    -- Adjustment specification
    adjustment_type VARCHAR(50) NOT NULL CHECK (adjustment_type IN (
        'base_price_multiplier', 'depreciation_rate', 'mileage_penalty',
        'condition_premium', 'feature_value', 'seasonal_factor',
        'inventory_pressure', 'demand_surge', 'competitive_response'
    )),
    adjustment_value DECIMAL(8,4) NOT NULL,
    adjustment_unit VARCHAR(20) DEFAULT 'multiplier' CHECK (adjustment_unit IN ('multiplier', 'percentage', 'fixed_amount')),
    
    -- Temporal validity
    effective_date TIMESTAMPTZ DEFAULT NOW(),
    expiry_date TIMESTAMPTZ,
    is_seasonal BOOLEAN DEFAULT false,
    seasonal_months INTEGER[] DEFAULT '{}', -- Months when factor applies (1-12)
    
    -- Data provenance and quality
    data_source VARCHAR(100) NOT NULL,
    data_collection_date TIMESTAMPTZ DEFAULT NOW(),
    confidence_level DECIMAL(3,2) CHECK (confidence_level BETWEEN 0 AND 1),
    sample_size INTEGER,
    statistical_significance DECIMAL(4,3),
    
    -- Operational metadata
    is_active BOOLEAN DEFAULT true,
    priority_weight DECIMAL(3,2) DEFAULT 1.00,
    max_applications_per_valuation INTEGER DEFAULT 1,
    
    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(100),
    
    -- Ensure logical date ranges
    CHECK (effective_date <= COALESCE(expiry_date, effective_date + INTERVAL '1 year'))
);

-- Performance indexes for market adjustment factors
CREATE INDEX idx_market_adj_region_vehicle ON market_adjustment_factors(region, make, model);
CREATE INDEX idx_market_adj_temp_type ON market_adjustment_factors(market_temperature, adjustment_type);
CREATE INDEX idx_market_adj_effective ON market_adjustment_factors(effective_date, expiry_date, is_active);
CREATE INDEX idx_market_adj_seasonal ON market_adjustment_factors(is_seasonal, seasonal_months) WHERE is_seasonal = true;

-- ============================================================================
-- ADJUSTER PERFORMANCE TRACKING TABLE
-- ============================================================================

CREATE TABLE adjuster_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adjuster_id UUID REFERENCES valuation_adjusters(id),
    
    -- Performance period
    measurement_date DATE DEFAULT CURRENT_DATE,
    measurement_period_days INTEGER DEFAULT 30,
    
    -- Usage statistics
    applications_count INTEGER DEFAULT 0,
    average_adjustment_magnitude DECIMAL(6,3),
    adjustment_variance DECIMAL(8,4),
    
    -- Accuracy metrics (compared to actual market transactions)
    accuracy_improvement DECIMAL(5,2), -- % improvement over base model
    prediction_error_reduction DECIMAL(5,2),
    confidence_calibration_score DECIMAL(3,2),
    
    -- Market correlation
    market_correlation_coefficient DECIMAL(4,3),
    market_timing_accuracy DECIMAL(3,2),
    regional_effectiveness JSONB DEFAULT '{}', -- Performance by region
    
    -- Quality indicators
    data_freshness_score DECIMAL(3,2),
    signal_noise_ratio DECIMAL(6,3),
    outlier_detection_rate DECIMAL(3,2),
    
    -- Business impact
    revenue_impact DECIMAL(12,2), -- Estimated revenue impact
    user_satisfaction_delta DECIMAL(3,2),
    api_performance_impact_ms INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance tracking
CREATE INDEX idx_adjuster_performance_date ON adjuster_performance(measurement_date DESC);
CREATE INDEX idx_adjuster_performance_adjuster ON adjuster_performance(adjuster_id, measurement_date);

-- ============================================================================
-- REAL-TIME MARKET INTELLIGENCE VIEW
-- ============================================================================

CREATE MATERIALIZED VIEW current_market_intelligence AS
WITH market_signals_summary AS (
    -- Aggregate recent market signals by vehicle
    SELECT 
        year,
        make,
        model,
        region,
        
        -- Market temperature calculation
        CASE 
            WHEN AVG(CASE WHEN signal_type = 'search_trend' THEN signal_value ELSE NULL END) > 70 
                 AND AVG(CASE WHEN signal_type = 'sales_volume' THEN trend_strength ELSE NULL END) > 0.6 THEN 'hot'
            WHEN AVG(CASE WHEN signal_type = 'search_trend' THEN signal_value ELSE NULL END) > 50 THEN 'warm'
            WHEN AVG(CASE WHEN signal_type = 'search_trend' THEN signal_value ELSE NULL END) > 30 THEN 'cool'
            ELSE 'cold'
        END as market_temperature,
        
        -- Aggregate intelligence scores
        ROUND(
            COALESCE(AVG(CASE WHEN signal_type = 'search_trend' THEN signal_value ELSE NULL END), 50) * 0.3 +
            COALESCE(AVG(CASE WHEN signal_type = 'sales_volume' AND trend_direction = 'up' THEN 75 
                             WHEN signal_type = 'sales_volume' AND trend_direction = 'down' THEN 25 
                             ELSE 50 END), 50) * 0.4 +
            COALESCE(AVG(CASE WHEN signal_type = 'price_trend' AND trend_direction = 'up' THEN 70 
                             WHEN signal_type = 'price_trend' AND trend_direction = 'down' THEN 30 
                             ELSE 50 END), 50) * 0.3
        ) as composite_market_score,
        
        -- Key metrics for adjusters
        AVG(CASE WHEN signal_type = 'sales_volume' THEN signal_value ELSE NULL END) as avg_sales_volume,
        AVG(CASE WHEN signal_type = 'price_trend' THEN signal_value ELSE NULL END) as avg_price,
        AVG(CASE WHEN signal_type = 'search_trend' THEN signal_value ELSE NULL END) as search_volume,
        AVG(CASE WHEN signal_type = 'market_liquidity' THEN signal_value ELSE NULL END) as avg_days_on_market,
        
        -- Data quality indicators
        AVG(confidence_score) as avg_confidence,
        COUNT(DISTINCT signal_type) as signal_type_coverage,
        MAX(signal_date) as latest_signal_date
        
    FROM market_signals 
    WHERE signal_date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY year, make, model, region
),

adjustment_recommendations AS (
    -- Generate recommended adjusters based on market conditions
    SELECT 
        ms.*,
        
        -- Market temperature adjusters
        CASE ms.market_temperature
            WHEN 'hot' THEN 1.08
            WHEN 'warm' THEN 1.03
            WHEN 'cool' THEN 0.97
            WHEN 'cold' THEN 0.92
        END as market_temp_multiplier,
        
        -- Sales momentum adjusters
        CASE 
            WHEN ms.avg_sales_volume > 20000 THEN 1.05
            WHEN ms.avg_sales_volume > 10000 THEN 1.02
            WHEN ms.avg_sales_volume < 5000 THEN 0.95
            ELSE 1.00
        END as sales_momentum_multiplier,
        
        -- Search trend adjusters
        CASE 
            WHEN ms.search_volume > 80 THEN 1.06
            WHEN ms.search_volume > 60 THEN 1.03
            WHEN ms.search_volume < 40 THEN 0.97
            ELSE 1.00
        END as search_trend_multiplier,
        
        -- Liquidity adjusters
        CASE 
            WHEN ms.avg_days_on_market < 25 THEN 1.04
            WHEN ms.avg_days_on_market < 35 THEN 1.01
            WHEN ms.avg_days_on_market > 60 THEN 0.96
            ELSE 1.00
        END as liquidity_multiplier
        
    FROM market_signals_summary ms
)

SELECT 
    ar.*,
    
    -- Calculate composite adjustment factor
    ROUND((
        ar.market_temp_multiplier *
        ar.sales_momentum_multiplier *
        ar.search_trend_multiplier *
        ar.liquidity_multiplier
    ), 4) as composite_adjustment_factor,
    
    -- Market insights for explanations
    ARRAY[
        CASE WHEN ar.market_temperature = 'hot' THEN 'High market demand driving prices up'
             WHEN ar.market_temperature = 'cold' THEN 'Weak market conditions pressuring prices down'
             ELSE 'Stable market conditions' END,
        CASE WHEN ar.avg_sales_volume > 15000 THEN 'Strong sales volume indicates high demand'
             WHEN ar.avg_sales_volume < 8000 THEN 'Low sales volume suggests reduced demand'
             ELSE 'Moderate sales activity' END,
        CASE WHEN ar.search_volume > 70 THEN 'High consumer search interest'
             WHEN ar.search_volume < 40 THEN 'Limited consumer search activity'
             ELSE 'Average consumer interest level' END
    ] as market_insights,
    
    -- Quality score for this intelligence
    ROUND(ar.avg_confidence * ar.signal_type_coverage / 6.0, 2) as intelligence_quality_score,
    
    NOW() as generated_at
    
FROM adjustment_recommendations ar
WHERE ar.avg_confidence >= 0.7 -- Only include high-confidence intelligence
ORDER BY ar.composite_market_score DESC, ar.make, ar.model;

-- Index for the materialized view
CREATE INDEX idx_current_market_intel_vehicle ON current_market_intelligence(year, make, model);
CREATE INDEX idx_current_market_intel_score ON current_market_intelligence(composite_market_score DESC);
CREATE INDEX idx_current_market_intel_temp ON current_market_intelligence(market_temperature);

-- ============================================================================
-- RPC FUNCTIONS FOR ENHANCED VALUATION
-- ============================================================================

-- Function to apply market intelligence adjusters to a base valuation
CREATE OR REPLACE FUNCTION apply_market_adjusters(
    p_base_valuation DECIMAL,
    p_year INTEGER,
    p_make VARCHAR,
    p_model VARCHAR,
    p_region VARCHAR DEFAULT 'national',
    p_valuation_mode VARCHAR DEFAULT 'market'
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_market_intel RECORD;
    v_adjusters JSONB := '{}';
    v_total_adjustment DECIMAL := 1.0000;
    v_final_valuation DECIMAL;
    v_explanation TEXT[];
BEGIN
    -- Get market intelligence for this vehicle
    SELECT * INTO v_market_intel
    FROM current_market_intelligence
    WHERE year = p_year 
      AND make = p_make 
      AND model = p_model
      AND (region = p_region OR region = 'national')
    ORDER BY 
      CASE WHEN region = p_region THEN 1 ELSE 2 END,
      intelligence_quality_score DESC
    LIMIT 1;
    
    IF v_market_intel IS NULL THEN
        -- Fallback to default adjusters if no market intelligence
        v_total_adjustment := 1.0000;
        v_explanation := ARRAY['No recent market intelligence available - using base valuation'];
    ELSE
        -- Apply market intelligence adjusters
        v_total_adjustment := v_market_intel.composite_adjustment_factor;
        
        -- Build adjuster details
        v_adjusters := jsonb_build_object(
            'market_temperature', jsonb_build_object(
                'factor', v_market_intel.market_temp_multiplier,
                'description', 'Market temperature: ' || v_market_intel.market_temperature
            ),
            'sales_momentum', jsonb_build_object(
                'factor', v_market_intel.sales_momentum_multiplier,
                'description', 'Sales volume: ' || v_market_intel.avg_sales_volume
            ),
            'search_trends', jsonb_build_object(
                'factor', v_market_intel.search_trend_multiplier,
                'description', 'Search volume: ' || v_market_intel.search_volume
            ),
            'market_liquidity', jsonb_build_object(
                'factor', v_market_intel.liquidity_multiplier,
                'description', 'Days on market: ' || v_market_intel.avg_days_on_market
            )
        );
        
        v_explanation := v_market_intel.market_insights;
    END IF;
    
    -- Calculate final valuation
    v_final_valuation := p_base_valuation * v_total_adjustment;
    
    -- Apply valuation mode adjustments
    CASE p_valuation_mode
        WHEN 'buyer' THEN 
            v_final_valuation := v_final_valuation * 1.03; -- Slightly higher for buyer perspective
        WHEN 'seller' THEN 
            v_final_valuation := v_final_valuation * 0.97; -- Slightly lower for seller perspective
        WHEN 'trade' THEN 
            v_final_valuation := v_final_valuation * 0.85; -- Trade-in discount
        ELSE 
            -- 'market' mode - no additional adjustment
            NULL;
    END CASE;
    
    -- Return comprehensive results
    RETURN jsonb_build_object(
        'base_valuation', p_base_valuation,
        'market_adjustment_factor', v_total_adjustment,
        'applied_adjusters', v_adjusters,
        'final_valuation', ROUND(v_final_valuation, 2),
        'adjustment_percentage', ROUND((v_total_adjustment - 1.0000) * 100, 2),
        'market_intelligence', CASE 
            WHEN v_market_intel IS NOT NULL THEN
                jsonb_build_object(
                    'market_score', v_market_intel.composite_market_score,
                    'market_temperature', v_market_intel.market_temperature,
                    'quality_score', v_market_intel.intelligence_quality_score,
                    'data_date', v_market_intel.latest_signal_date
                )
            ELSE NULL
        END,
        'explanation', array_to_json(v_explanation),
        'confidence_level', CASE 
            WHEN v_market_intel IS NOT NULL THEN v_market_intel.avg_confidence
            ELSE 0.5
        END
    );
END;
$$;

-- Function to get available adjusters for a vehicle/region combination
CREATE OR REPLACE FUNCTION get_available_adjusters(
    p_year INTEGER,
    p_make VARCHAR,
    p_region VARCHAR DEFAULT 'national'
)
RETURNS TABLE (
    adjuster_id UUID,
    adjuster_type VARCHAR,
    adjuster_name VARCHAR,
    estimated_impact DECIMAL,
    confidence DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        va.id,
        va.adjuster_type,
        va.adjuster_name,
        va.base_multiplier,
        va.confidence_threshold
    FROM valuation_adjusters va
    WHERE va.is_active = true
      AND (va.regional_applicability = '{}' OR p_region = ANY(va.regional_applicability) OR 'national' = ANY(va.regional_applicability))
      AND (va.make_applicability = '{}' OR p_make = ANY(va.make_applicability))
      AND p_year BETWEEN va.year_range[1] AND va.year_range[2]
    ORDER BY va.priority_order, va.adjuster_type;
END;
$$;

-- ============================================================================
-- SAMPLE ADJUSTER DATA
-- ============================================================================

-- Insert core market temperature adjusters
INSERT INTO valuation_adjusters (adjuster_type, adjuster_name, adjuster_description, base_multiplier, min_multiplier, max_multiplier, regional_applicability, market_signal_dependency, priority_order) VALUES
('market_temperature', 'Hot Market Premium', 'Price inflation in high-demand markets', 1.0800, 1.0000, 1.2000, '{"national"}', '{"search_trend","sales_volume"}', 10),
('market_temperature', 'Warm Market Adjustment', 'Moderate price premium in stable markets', 1.0300, 1.0000, 1.1000, '{"national"}', '{"search_trend","sales_volume"}', 11),
('market_temperature', 'Cool Market Discount', 'Price reduction in slow markets', 0.9700, 0.8500, 1.0000, '{"national"}', '{"search_trend","sales_volume"}', 12),
('market_temperature', 'Cold Market Discount', 'Significant price reduction in weak markets', 0.9200, 0.7500, 1.0000, '{"national"}', '{"search_trend","sales_volume"}', 13);

-- Insert regional demand adjusters
INSERT INTO valuation_adjusters (adjuster_type, adjuster_name, adjuster_description, base_multiplier, min_multiplier, max_multiplier, regional_applicability, vehicle_types, priority_order) VALUES
('regional_demand', 'California EV Premium', 'Electric vehicle premium in California', 1.1200, 1.0000, 1.3000, '{"CA"}', '{"electric","hybrid"}', 20),
('regional_demand', 'Texas Truck Premium', 'Pickup truck premium in Texas', 1.1500, 1.0000, 1.2500, '{"TX"}', '{"truck","pickup"}', 21),
('regional_demand', 'Florida Convertible Premium', 'Convertible premium in warm climates', 1.0800, 1.0000, 1.1500, '{"FL","CA","AZ","NV"}', '{"convertible"}', 22),
('regional_demand', 'Northeast AWD Premium', 'All-wheel drive premium in snow states', 1.0600, 1.0000, 1.1200, '{"NY","MA","CT","VT","NH","ME"}', '{"awd","4wd"}', 23);

-- Insert consumer behavior adjusters
INSERT INTO valuation_adjusters (adjuster_type, adjuster_name, adjuster_description, base_multiplier, min_multiplier, max_multiplier, market_signal_dependency, priority_order) VALUES
('consumer_behavior', 'High Search Interest Premium', 'Premium for vehicles with high search volume', 1.0500, 1.0000, 1.1000, '{"search_trend"}', 30),
('consumer_behavior', 'Low Search Interest Discount', 'Discount for vehicles with low consumer interest', 0.9600, 0.9000, 1.0000, '{"search_trend"}', 31),
('consumer_behavior', 'Viral Social Media Boost', 'Premium for vehicles trending on social media', 1.0700, 1.0000, 1.1500, '{"consumer_interest"}', 32);

-- Insert seasonal adjusters
INSERT INTO valuation_adjusters (adjuster_type, adjuster_name, adjuster_description, base_multiplier, seasonal_pattern, priority_order) VALUES
('seasonal_pattern', 'Spring Car Buying Premium', 'Higher prices during peak buying season', 1.0400, '{"3":1.04,"4":1.06,"5":1.04}', 40),
('seasonal_pattern', 'Winter SUV Premium', 'SUV/truck premium during winter months', 1.0300, '{"11":1.03,"12":1.05,"1":1.06,"2":1.03}', 41),
('seasonal_pattern', 'Summer Convertible Premium', 'Convertible premium during summer', 1.0800, '{"5":1.05,"6":1.08,"7":1.08,"8":1.05}', 42);

-- Insert market-specific adjusters
INSERT INTO valuation_adjusters (adjuster_type, adjuster_name, adjuster_description, base_multiplier, min_multiplier, max_multiplier, market_signal_dependency, priority_order) VALUES
('sales_momentum', 'Strong Sales Momentum Premium', 'Premium for vehicles with strong sales trends', 1.0400, 1.0000, 1.0800, '{"sales_volume"}', 50),
('sales_momentum', 'Weak Sales Momentum Discount', 'Discount for vehicles with declining sales', 0.9600, 0.9000, 1.0000, '{"sales_volume"}', 51),
('price_volatility', 'Price Stability Premium', 'Premium for vehicles with stable pricing', 1.0200, 1.0000, 1.0500, '{"price_trend"}', 52),
('liquidity_factor', 'Fast-Moving Inventory Premium', 'Premium for vehicles that sell quickly', 1.0300, 1.0000, 1.0600, '{"market_liquidity"}', 53);

-- ============================================================================
-- REFRESH MATERIALIZED VIEW FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION refresh_market_intelligence()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY current_market_intelligence;
    
    -- Log the refresh
    INSERT INTO adjuster_performance (adjuster_id, measurement_date, applications_count)
    SELECT NULL, CURRENT_DATE, 1
    WHERE NOT EXISTS (
        SELECT 1 FROM adjuster_performance 
        WHERE adjuster_id IS NULL 
        AND measurement_date = CURRENT_DATE
    );
END;
$$;

-- ============================================================================
-- AUTOMATIC REFRESH TRIGGER
-- ============================================================================

-- Create a function to auto-refresh market intelligence when market signals are updated
CREATE OR REPLACE FUNCTION trigger_market_intelligence_refresh()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Schedule a refresh of the materialized view
    -- In practice, this might use a job queue system instead of immediate refresh
    PERFORM refresh_market_intelligence();
    RETURN NEW;
END;
$$;

-- Trigger to refresh market intelligence when new market signals arrive
-- Note: In production, consider using a job queue for this instead of immediate refresh
-- CREATE TRIGGER update_market_intelligence
--     AFTER INSERT OR UPDATE ON market_signals
--     FOR EACH STATEMENT
--     EXECUTE FUNCTION trigger_market_intelligence_refresh();

-- ============================================================================
-- SAMPLE MARKET ADJUSTMENT FACTORS
-- ============================================================================

INSERT INTO market_adjustment_factors (region, region_type, make, adjustment_type, adjustment_value, data_source, confidence_level) VALUES
-- National brand adjustments
('national', 'national', 'Toyota', 'base_price_multiplier', 1.0200, 'Market Research 2025', 0.85),
('national', 'national', 'Honda', 'base_price_multiplier', 1.0150, 'Market Research 2025', 0.83),
('national', 'national', 'BMW', 'base_price_multiplier', 1.0800, 'Luxury Market Analysis', 0.78),
('national', 'national', 'Mercedes-Benz', 'base_price_multiplier', 1.0900, 'Luxury Market Analysis', 0.79),

-- Regional adjustments
('CA', 'state', NULL, 'base_price_multiplier', 1.1200, 'California Market Study', 0.82),
('TX', 'state', NULL, 'base_price_multiplier', 1.0300, 'Texas Market Study', 0.80),
('NY', 'state', NULL, 'base_price_multiplier', 1.1500, 'New York Market Study', 0.84),
('FL', 'state', NULL, 'base_price_multiplier', 1.0800, 'Florida Market Study', 0.81),

-- Seasonal factors
('national', 'national', NULL, 'seasonal_factor', 1.0400, 'Seasonal Analysis 2025', 0.90),

-- Market temperature adjustments
('national', 'national', NULL, 'demand_surge', 1.0600, 'Hot Market Analysis', 0.75);

-- Set expiry dates for some factors (6 months from now)
UPDATE market_adjustment_factors 
SET expiry_date = NOW() + INTERVAL '6 months'
WHERE data_source LIKE '%2025';

-- ============================================================================
-- PERFORMANCE MONITORING SETUP
-- ============================================================================

-- Create a function to calculate adjuster performance metrics
CREATE OR REPLACE FUNCTION calculate_adjuster_performance()
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    adj_record RECORD;
    perf_data RECORD;
BEGIN
    -- Calculate performance for each active adjuster
    FOR adj_record IN 
        SELECT id, adjuster_type, adjuster_name 
        FROM valuation_adjusters 
        WHERE is_active = true
    LOOP
        -- Get usage statistics for the last 30 days
        SELECT 
            COUNT(*) as usage_count,
            AVG(ABS((final_valuation / base_valuation) - 1.0)) as avg_adjustment,
            STDDEV((final_valuation / base_valuation) - 1.0) as adjustment_variance,
            AVG(confidence_score) as avg_confidence
        INTO perf_data
        FROM enhanced_valuations ev
        WHERE ev.created_at >= CURRENT_DATE - INTERVAL '30 days'
          AND ev.applied_adjusters ? adj_record.adjuster_type;
        
        -- Insert or update performance record
        INSERT INTO adjuster_performance (
            adjuster_id,
            measurement_date,
            applications_count,
            average_adjustment_magnitude,
            adjustment_variance,
            confidence_calibration_score
        ) VALUES (
            adj_record.id,
            CURRENT_DATE,
            COALESCE(perf_data.usage_count, 0),
            COALESCE(perf_data.avg_adjustment, 0),
            COALESCE(perf_data.adjustment_variance, 0),
            COALESCE(perf_data.avg_confidence, 0)
        )
        ON CONFLICT (adjuster_id, measurement_date) 
        DO UPDATE SET
            applications_count = EXCLUDED.applications_count,
            average_adjustment_magnitude = EXCLUDED.average_adjustment_magnitude,
            adjustment_variance = EXCLUDED.adjustment_variance,
            confidence_calibration_score = EXCLUDED.confidence_calibration_score;
    END LOOP;
END;
$$;

-- ============================================================================
-- INITIAL DATA SETUP COMPLETE
-- ============================================================================

-- Refresh the materialized view to populate initial market intelligence
SELECT refresh_market_intelligence();

-- Calculate initial adjuster performance
SELECT calculate_adjuster_performance();

-- Final verification
DO $$
BEGIN
    RAISE NOTICE 'Enhanced Valuation System Setup Complete:';
    RAISE NOTICE '- % valuation adjusters configured', (SELECT COUNT(*) FROM valuation_adjusters WHERE is_active = true);
    RAISE NOTICE '- % market adjustment factors loaded', (SELECT COUNT(*) FROM market_adjustment_factors WHERE is_active = true);
    RAISE NOTICE '- Market intelligence view populated with % vehicle combinations', (SELECT COUNT(*) FROM current_market_intelligence);
    RAISE NOTICE 'PR E: Valuation Adjusters v2 - Database foundation ready!';
END $$;
