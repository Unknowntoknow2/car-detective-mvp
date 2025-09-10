-- AIN Valuation Engine - Views and Functions Migration
-- Created: 2025-08-08
-- Description: Creates helpful views and functions for efficient data access

-- =====================================================
-- 1. MATERIALIZED VIEW: VEHICLE PROFILES
-- =====================================================

CREATE MATERIALIZED VIEW vehicle_profiles AS
SELECT 
    vs.vin,
    vs.make,
    vs.model,
    vs.year,
    vs.trim,
    vs.body_class,
    vs.engine_cylinders,
    vs.displacement_cc,
    vs.fuel_type_primary,
    vs.drive_type,
    vs.transmission_style,
    vs.manufacturer,
    vs.doors,
    vs.gvwr,
    
    -- Safety ratings
    sr.overall_rating as safety_overall,
    sr.frontal_crash_rating as safety_frontal,
    sr.side_crash_rating as safety_side,
    sr.rollover_rating as safety_rollover,
    
    -- Fuel economy
    fe.city_mpg,
    fe.highway_mpg,
    fe.combined_mpg,
    fe.annual_fuel_cost,
    fe.co2_emissions,
    
    -- Recall count
    COALESCE(recall_counts.recall_count, 0) as active_recalls,
    
    -- Market data
    ml_stats.avg_listing_price,
    ml_stats.min_listing_price,
    ml_stats.max_listing_price,
    ml_stats.listing_count,
    ml_stats.avg_mileage as market_avg_mileage,
    
    -- Latest user input
    fa.mileage as user_mileage,
    fa.condition as user_condition,
    fa.zip_code as user_location,
    fa.exterior_color,
    fa.interior_color,
    fa.title_status,
    
    -- Latest valuation
    vh.estimated_value as last_valuation,
    vh.confidence_score as last_confidence,
    vh.price_range_low,
    vh.price_range_high,
    vh.created_at as last_valuation_date,
    
    -- Timestamps
    vs.created_at as first_seen,
    GREATEST(
        vs.updated_at, 
        COALESCE(sr.updated_at, '1970-01-01'::timestamptz),
        COALESCE(fe.updated_at, '1970-01-01'::timestamptz),
        COALESCE(fa.updated_at, '1970-01-01'::timestamptz)
    ) as last_updated

FROM vehicle_specs vs

LEFT JOIN nhtsa_safety_ratings sr ON vs.vin = sr.vin

LEFT JOIN fuel_economy fe ON vs.vin = fe.vin

LEFT JOIN (
    SELECT 
        vin,
        COUNT(*) as recall_count
    FROM nhtsa_recalls 
    WHERE remedy_status != 'Remedy Available' OR remedy_status IS NULL
    GROUP BY vin
) recall_counts ON vs.vin = recall_counts.vin

LEFT JOIN (
    SELECT 
        vin,
        AVG(listing_price) as avg_listing_price,
        MIN(listing_price) as min_listing_price,
        MAX(listing_price) as max_listing_price,
        COUNT(*) as listing_count,
        AVG(mileage) as avg_mileage
    FROM market_listings 
    WHERE listed_at > NOW() - INTERVAL '90 days'
    GROUP BY vin
) ml_stats ON vs.vin = ml_stats.vin

LEFT JOIN LATERAL (
    SELECT * FROM follow_up_answers 
    WHERE follow_up_answers.vin = vs.vin 
    ORDER BY created_at DESC 
    LIMIT 1
) fa ON true

LEFT JOIN LATERAL (
    SELECT * FROM valuation_history 
    WHERE valuation_history.vin = vs.vin 
    ORDER BY created_at DESC 
    LIMIT 1
) vh ON true;

-- Index on materialized view
CREATE UNIQUE INDEX idx_vehicle_profiles_vin ON vehicle_profiles(vin);
CREATE INDEX idx_vehicle_profiles_make_model_year ON vehicle_profiles(make, model, year);
CREATE INDEX idx_vehicle_profiles_last_valuation ON vehicle_profiles(last_valuation_date);

-- =====================================================
-- 2. FUNCTION: REFRESH VEHICLE PROFILES
-- =====================================================

CREATE OR REPLACE FUNCTION refresh_vehicle_profiles()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY vehicle_profiles;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. FUNCTION: GET COMPARABLE VEHICLES
-- =====================================================

CREATE OR REPLACE FUNCTION get_comparable_vehicles(
    target_vin VARCHAR(17),
    max_year_diff INTEGER DEFAULT 3,
    max_results INTEGER DEFAULT 100,
    search_radius_miles INTEGER DEFAULT 150
)
RETURNS TABLE (
    vin VARCHAR(17),
    make VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    listing_price DECIMAL(10,2),
    mileage INTEGER,
    location VARCHAR(100),
    similarity_score DECIMAL(5,2),
    days_on_market INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH target_vehicle AS (
        SELECT 
            vp.make, vp.model, vp.year, vp.body_class,
            vp.user_mileage, vp.user_location
        FROM vehicle_profiles vp 
        WHERE vp.vin = target_vin
    ),
    comparables AS (
        SELECT 
            ml.vin,
            vp.make,
            vp.model,
            vp.year,
            ml.listing_price,
            ml.mileage,
            ml.location,
            -- Similarity scoring
            (
                CASE WHEN vp.make = tv.make AND vp.model = tv.model THEN 40 ELSE 0 END +
                CASE WHEN ABS(vp.year - tv.year) <= 1 THEN 20
                     WHEN ABS(vp.year - tv.year) <= 2 THEN 15
                     WHEN ABS(vp.year - tv.year) <= 3 THEN 10
                     ELSE 0 END +
                CASE WHEN vp.body_class = (SELECT body_class FROM vehicle_profiles WHERE vin = target_vin) THEN 10 ELSE 0 END +
                CASE WHEN ABS(COALESCE(ml.mileage, 0) - COALESCE(tv.user_mileage, 50000)) <= 20000 THEN 15
                     WHEN ABS(COALESCE(ml.mileage, 0) - COALESCE(tv.user_mileage, 50000)) <= 50000 THEN 10
                     ELSE 5 END +
                CASE WHEN ml.is_dealer THEN 5 ELSE 0 END +
                CASE WHEN ml.listed_at > NOW() - INTERVAL '30 days' THEN 10
                     WHEN ml.listed_at > NOW() - INTERVAL '60 days' THEN 5
                     ELSE 0 END
            ) as similarity_score,
            EXTRACT(DAY FROM NOW() - ml.listed_at)::INTEGER as days_on_market
        FROM market_listings ml
        JOIN vehicle_profiles vp ON ml.vin = vp.vin
        CROSS JOIN target_vehicle tv
        WHERE ml.vin != target_vin
        AND vp.make = tv.make
        AND ABS(vp.year - tv.year) <= max_year_diff
        AND ml.listing_price > 1000  -- Filter out obvious errors
        AND ml.listed_at > NOW() - INTERVAL '120 days'  -- Recent listings only
    )
    SELECT 
        c.vin, c.make, c.model, c.year, c.listing_price, 
        c.mileage, c.location, c.similarity_score, c.days_on_market
    FROM comparables c
    WHERE c.similarity_score >= 30  -- Minimum similarity threshold
    ORDER BY c.similarity_score DESC, c.days_on_market ASC
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 4. FUNCTION: CALCULATE VALUATION ADJUSTMENTS
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_valuation_adjustments(
    target_vin VARCHAR(17),
    base_value DECIMAL(10,2)
)
RETURNS JSONB AS $$
DECLARE
    vehicle_data RECORD;
    adjustments JSONB := '[]'::JSONB;
    adjustment JSONB;
    total_adjustment DECIMAL(10,2) := 0;
BEGIN
    -- Get vehicle and user data
    SELECT 
        vp.year, vp.user_mileage, vp.user_condition, vp.title_status,
        vp.active_recalls, vp.safety_overall, vp.combined_mpg
    INTO vehicle_data
    FROM vehicle_profiles vp
    WHERE vp.vin = target_vin;
    
    IF NOT FOUND THEN
        RETURN '[]'::JSONB;
    END IF;
    
    -- Mileage adjustment
    IF vehicle_data.user_mileage IS NOT NULL THEN
        DECLARE
            expected_mileage INTEGER := (2025 - vehicle_data.year) * 12000;
            mileage_diff INTEGER := vehicle_data.user_mileage - expected_mileage;
            mileage_adjustment DECIMAL(10,2) := mileage_diff * -0.12;
        BEGIN
            IF ABS(mileage_adjustment) > 100 THEN
                adjustment := jsonb_build_object(
                    'type', 'mileage',
                    'factor', 'Vehicle Mileage',
                    'adjustment', mileage_adjustment,
                    'percentage', ROUND((mileage_adjustment / base_value * 100)::NUMERIC, 2),
                    'explanation', 
                    CASE 
                        WHEN mileage_diff > 0 THEN FORMAT('Higher than average mileage (+%s miles)', mileage_diff)
                        ELSE FORMAT('Lower than average mileage (%s miles)', mileage_diff)
                    END
                );
                adjustments := adjustments || adjustment;
                total_adjustment := total_adjustment + mileage_adjustment;
            END IF;
        END;
    END IF;
    
    -- Condition adjustment
    IF vehicle_data.user_condition IS NOT NULL THEN
        DECLARE
            condition_multiplier DECIMAL(5,3);
            condition_adjustment DECIMAL(10,2);
        BEGIN
            condition_multiplier := CASE vehicle_data.user_condition
                WHEN 'excellent' THEN 1.05
                WHEN 'very_good' THEN 1.02
                WHEN 'good' THEN 1.00
                WHEN 'fair' THEN 0.92
                WHEN 'poor' THEN 0.80
                ELSE 1.00
            END;
            
            condition_adjustment := base_value * (condition_multiplier - 1);
            
            IF ABS(condition_adjustment) > 100 THEN
                adjustment := jsonb_build_object(
                    'type', 'condition',
                    'factor', 'Vehicle Condition',
                    'adjustment', condition_adjustment,
                    'percentage', ROUND(((condition_multiplier - 1) * 100)::NUMERIC, 2),
                    'explanation', FORMAT('Vehicle condition: %s', INITCAP(vehicle_data.user_condition))
                );
                adjustments := adjustments || adjustment;
                total_adjustment := total_adjustment + condition_adjustment;
            END IF;
        END;
    END IF;
    
    -- Title status adjustment
    IF vehicle_data.title_status != 'clean' THEN
        DECLARE
            title_multiplier DECIMAL(5,3);
            title_adjustment DECIMAL(10,2);
        BEGIN
            title_multiplier := CASE vehicle_data.title_status
                WHEN 'salvage' THEN 0.60
                WHEN 'rebuilt' THEN 0.75
                WHEN 'flood' THEN 0.65
                WHEN 'lemon' THEN 0.60
                WHEN 'manufacturer_buyback' THEN 0.80
                ELSE 1.00
            END;
            
            title_adjustment := base_value * (title_multiplier - 1);
            
            adjustment := jsonb_build_object(
                'type', 'title',
                'factor', 'Title Status',
                'adjustment', title_adjustment,
                'percentage', ROUND(((title_multiplier - 1) * 100)::NUMERIC, 2),
                'explanation', FORMAT('Title status: %s', INITCAP(REPLACE(vehicle_data.title_status, '_', ' ')))
            );
            adjustments := adjustments || adjustment;
            total_adjustment := total_adjustment + title_adjustment;
        END;
    END IF;
    
    -- Active recalls adjustment
    IF vehicle_data.active_recalls > 0 THEN
        DECLARE
            recall_adjustment DECIMAL(10,2) := vehicle_data.active_recalls * -300;
        BEGIN
            adjustment := jsonb_build_object(
                'type', 'recalls',
                'factor', 'Active Recalls',
                'adjustment', recall_adjustment,
                'percentage', ROUND((recall_adjustment / base_value * 100)::NUMERIC, 2),
                'explanation', FORMAT('%s active recall(s)', vehicle_data.active_recalls)
            );
            adjustments := adjustments || adjustment;
            total_adjustment := total_adjustment + recall_adjustment;
        END;
    END IF;
    
    -- Add total adjustment summary
    adjustment := jsonb_build_object(
        'type', 'total',
        'factor', 'Total Adjustments',
        'adjustment', total_adjustment,
        'percentage', ROUND((total_adjustment / base_value * 100)::NUMERIC, 2),
        'explanation', FORMAT('Total of all adjustments: %s%s', 
            CASE WHEN total_adjustment >= 0 THEN '+$' ELSE '-$' END,
            ABS(total_adjustment)
        )
    );
    adjustments := adjustments || adjustment;
    
    RETURN adjustments;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. FUNCTION: GET MARKET STATISTICS
-- =====================================================

CREATE OR REPLACE FUNCTION get_market_statistics(
    target_make VARCHAR(100),
    target_model VARCHAR(100),
    target_year INTEGER,
    year_range INTEGER DEFAULT 2
)
RETURNS JSONB AS $$
DECLARE
    stats JSONB;
BEGIN
    SELECT jsonb_build_object(
        'avg_price', ROUND(AVG(ml.listing_price)::NUMERIC, 2),
        'median_price', ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ml.listing_price)::NUMERIC, 2),
        'min_price', MIN(ml.listing_price),
        'max_price', MAX(ml.listing_price),
        'listing_count', COUNT(*),
        'avg_mileage', ROUND(AVG(ml.mileage)::NUMERIC, 0),
        'avg_days_on_market', ROUND(AVG(EXTRACT(DAY FROM NOW() - ml.listed_at))::NUMERIC, 0),
        'price_per_mile', ROUND(AVG(ml.listing_price / NULLIF(ml.mileage, 0))::NUMERIC, 2)
    )
    INTO stats
    FROM market_listings ml
    JOIN vehicle_profiles vp ON ml.vin = vp.vin
    WHERE vp.make = target_make
    AND vp.model = target_model
    AND vp.year BETWEEN (target_year - year_range) AND (target_year + year_range)
    AND ml.listed_at > NOW() - INTERVAL '90 days'
    AND ml.listing_price BETWEEN 1000 AND 200000;  -- Filter obvious errors
    
    RETURN COALESCE(stats, '{}'::JSONB);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. SCHEDULED REFRESH TRIGGER
-- =====================================================

-- Create a function to automatically refresh profiles when data changes
CREATE OR REPLACE FUNCTION trigger_profile_refresh()
RETURNS TRIGGER AS $$
BEGIN
    -- Mark for refresh (in a real system, you might use a job queue)
    PERFORM pg_notify('refresh_profiles', NEW.vin);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply refresh trigger to key tables
CREATE TRIGGER refresh_on_vehicle_specs_change 
    AFTER INSERT OR UPDATE ON vehicle_specs
    FOR EACH ROW EXECUTE FUNCTION trigger_profile_refresh();

CREATE TRIGGER refresh_on_follow_up_change 
    AFTER INSERT OR UPDATE ON follow_up_answers
    FOR EACH ROW EXECUTE FUNCTION trigger_profile_refresh();

CREATE TRIGGER refresh_on_valuation_change 
    AFTER INSERT ON valuation_history
    FOR EACH ROW EXECUTE FUNCTION trigger_profile_refresh();

-- =====================================================
-- 7. COMMENTS FOR FUNCTIONS AND VIEWS
-- =====================================================

COMMENT ON MATERIALIZED VIEW vehicle_profiles IS 'Consolidated view of all vehicle data for efficient querying';
COMMENT ON FUNCTION get_comparable_vehicles IS 'Returns similar vehicles for market comparison with similarity scoring';
COMMENT ON FUNCTION calculate_valuation_adjustments IS 'Calculates price adjustments based on vehicle condition, mileage, and history';
COMMENT ON FUNCTION get_market_statistics IS 'Returns market statistics for a specific make/model/year';
COMMENT ON FUNCTION refresh_vehicle_profiles IS 'Manually refresh the vehicle profiles materialized view';
