-- PR D: Market Signal Baseline Database Schema
-- Creates comprehensive market intelligence tables

-- Market signals aggregation table
CREATE TABLE IF NOT EXISTS market_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    signal_type TEXT NOT NULL CHECK (signal_type IN ('sales_volume', 'price_trend', 'search_trend', 'market_sentiment')),
    source TEXT NOT NULL CHECK (source IN ('goodcarbadcar', 'isecars', 'google_trends', 'autotrader', 'internal')),
    
    -- Vehicle identification
    year INTEGER,
    make TEXT,
    model TEXT,
    trim TEXT,
    
    -- Geographic scope
    region TEXT, -- 'national', 'northeast', 'southeast', 'midwest', 'west', 'california', etc.
    
    -- Signal data
    signal_value DECIMAL(10,2), -- Numeric signal value
    signal_unit TEXT, -- 'units', 'percent', 'days', 'score', 'usd'
    signal_description TEXT,
    
    -- Trending data
    trend_direction TEXT CHECK (trend_direction IN ('up', 'down', 'stable', 'volatile')),
    trend_strength DECIMAL(3,2) CHECK (trend_strength >= 0 AND trend_strength <= 1), -- 0-1 scale
    trend_period_days INTEGER DEFAULT 30,
    
    -- Confidence and quality metrics
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    data_quality_score DECIMAL(3,2) CHECK (data_quality_score >= 0 AND data_quality_score <= 1),
    sample_size INTEGER,
    
    -- Temporal data
    signal_date DATE NOT NULL,
    period_start DATE,
    period_end DATE,
    
    -- Metadata
    raw_data JSONB, -- Store original API response
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Indexes for performance
    UNIQUE(signal_type, source, year, make, model, region, signal_date)
);

-- Sales volume tracking (GoodCarBadCar data)
CREATE TABLE IF NOT EXISTS sales_volumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Vehicle identification  
    year INTEGER NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    trim TEXT,
    
    -- Sales data
    units_sold INTEGER NOT NULL,
    sales_month DATE NOT NULL, -- First day of the month
    region TEXT DEFAULT 'national',
    
    -- Comparative metrics
    previous_month_units INTEGER,
    previous_year_units INTEGER,
    month_over_month_change DECIMAL(5,2), -- Percentage change
    year_over_year_change DECIMAL(5,2), -- Percentage change
    
    -- Market share
    total_segment_sales INTEGER, -- Total sales in vehicle segment
    market_share_percent DECIMAL(5,2),
    segment_rank INTEGER, -- Ranking within segment
    
    -- Data source and quality
    source TEXT DEFAULT 'goodcarbadcar',
    data_quality TEXT CHECK (data_quality IN ('high', 'medium', 'low', 'estimated')),
    confidence_level DECIMAL(3,2),
    
    -- Metadata
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(year, make, model, sales_month, region)
);

-- Price trends (iSeeCars data)  
CREATE TABLE IF NOT EXISTS price_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Vehicle identification
    year INTEGER NOT NULL,
    make TEXT NOT NULL, 
    model TEXT NOT NULL,
    trim TEXT,
    mileage_range TEXT, -- '0-25k', '25k-50k', '50k-75k', '75k-100k', '100k+'
    
    -- Pricing data
    average_listing_price DECIMAL(10,2),
    median_listing_price DECIMAL(10,2),
    price_range_min DECIMAL(10,2),
    price_range_max DECIMAL(10,2),
    
    -- Market dynamics
    days_on_market_avg DECIMAL(5,1),
    inventory_level INTEGER, -- Number of listings
    price_reduction_frequency DECIMAL(3,2), -- 0-1 scale
    avg_price_reduction_amount DECIMAL(8,2),
    
    -- Geographic data
    region TEXT DEFAULT 'national',
    zip_code TEXT,
    metro_area TEXT,
    
    -- Temporal data
    price_date DATE NOT NULL,
    data_collection_period INTEGER DEFAULT 30, -- Days of data collection
    
    -- Trends
    price_trend_30d TEXT CHECK (price_trend_30d IN ('increasing', 'decreasing', 'stable')),
    price_change_30d_percent DECIMAL(5,2),
    price_change_30d_amount DECIMAL(8,2),
    
    -- Data source
    source TEXT DEFAULT 'isecars',
    listing_count INTEGER, -- Number of listings in sample
    data_confidence DECIMAL(3,2),
    
    -- Metadata
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(year, make, model, mileage_range, region, price_date)
);

-- Search trends (Google Trends data)
CREATE TABLE IF NOT EXISTS search_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Search terms
    search_term TEXT NOT NULL, -- e.g., "2023 Toyota Camry"
    normalized_term TEXT NOT NULL, -- Standardized version
    
    -- Vehicle mapping
    year INTEGER,
    make TEXT,
    model TEXT,
    
    -- Search metrics
    search_volume_index INTEGER, -- Google Trends 0-100 scale
    search_volume_category TEXT, -- 'very_high', 'high', 'medium', 'low', 'very_low'
    relative_popularity DECIMAL(3,2), -- Compared to peak popularity
    
    -- Geographic data
    region TEXT DEFAULT 'US',
    state_code TEXT,
    metro_area TEXT,
    
    -- Temporal data
    trend_date DATE NOT NULL,
    trend_period TEXT DEFAULT 'weekly', -- 'daily', 'weekly', 'monthly'
    
    -- Related searches
    related_terms JSONB, -- Array of related search terms
    rising_terms JSONB, -- Terms with increasing search volume
    
    -- Trending analysis
    trend_direction TEXT CHECK (trend_direction IN ('rising', 'falling', 'stable', 'volatile')),
    trend_velocity DECIMAL(5,2), -- Rate of change
    seasonality_adjusted BOOLEAN DEFAULT FALSE,
    
    -- Data source
    source TEXT DEFAULT 'google_trends',
    api_response_code INTEGER,
    data_freshness_hours INTEGER,
    
    -- Metadata
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(search_term, region, trend_date)
);

-- Market sentiment analysis
CREATE TABLE IF NOT EXISTS market_sentiment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Vehicle identification
    year INTEGER,
    make TEXT NOT NULL,
    model TEXT,
    
    -- Sentiment metrics
    sentiment_score DECIMAL(3,2) CHECK (sentiment_score >= -1 AND sentiment_score <= 1), -- -1 to 1 scale
    sentiment_category TEXT CHECK (sentiment_category IN ('very_positive', 'positive', 'neutral', 'negative', 'very_negative')),
    
    -- Sentiment components
    reliability_sentiment DECIMAL(3,2),
    value_sentiment DECIMAL(3,2),
    performance_sentiment DECIMAL(3,2),
    design_sentiment DECIMAL(3,2),
    ownership_sentiment DECIMAL(3,2),
    
    -- Data sources contributing to sentiment
    review_count INTEGER,
    forum_mentions INTEGER,
    social_media_mentions INTEGER,
    news_articles INTEGER,
    
    -- Geographic scope
    region TEXT DEFAULT 'national',
    
    -- Temporal data
    sentiment_date DATE NOT NULL,
    analysis_period_days INTEGER DEFAULT 30,
    
    -- Confidence metrics
    confidence_score DECIMAL(3,2),
    data_coverage_score DECIMAL(3,2), -- How comprehensive the data is
    
    -- Metadata
    source_breakdown JSONB, -- Which sources contributed what sentiment
    raw_analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(year, make, model, region, sentiment_date)
);

-- Market intelligence summary (materialized view)
CREATE MATERIALIZED VIEW IF NOT EXISTS market_intelligence AS
WITH vehicle_signals AS (
    SELECT 
        COALESCE(ms.year, sv.year, pt.year) as year,
        COALESCE(ms.make, sv.make, pt.make) as make,
        COALESCE(ms.model, sv.model, pt.model) as model,
        COALESCE(ms.region, sv.region, pt.region, 'national') as region,
        
        -- Sales metrics
        sv.units_sold as monthly_sales,
        sv.year_over_year_change as sales_yoy_change,
        sv.market_share_percent,
        sv.segment_rank,
        
        -- Price metrics  
        pt.average_listing_price,
        pt.days_on_market_avg,
        pt.price_change_30d_percent,
        pt.price_trend_30d,
        pt.inventory_level,
        
        -- Search trends
        st.search_volume_index,
        st.trend_direction as search_trend,
        st.relative_popularity,
        
        -- Sentiment
        sent.sentiment_score,
        sent.sentiment_category,
        
        -- Composite scores
        CASE 
            WHEN sv.year_over_year_change > 10 AND st.search_volume_index > 70 THEN 'hot'
            WHEN sv.year_over_year_change > 0 AND st.search_volume_index > 50 THEN 'warm'  
            WHEN sv.year_over_year_change < -10 OR st.search_volume_index < 30 THEN 'cold'
            ELSE 'neutral'
        END as market_temperature,
        
        -- Calculate demand score (0-100)
        LEAST(100, GREATEST(0, 
            COALESCE(st.search_volume_index, 50) * 0.3 +
            CASE 
                WHEN sv.year_over_year_change > 0 THEN 50 + LEAST(50, sv.year_over_year_change * 2)
                ELSE 50 + GREATEST(-50, sv.year_over_year_change * 2)
            END * 0.4 +
            COALESCE((sent.sentiment_score + 1) * 50, 50) * 0.3
        ))::INTEGER as demand_score,
        
        -- Data freshness
        GREATEST(
            COALESCE(sv.created_at, '1900-01-01'::timestamp),
            COALESCE(pt.created_at, '1900-01-01'::timestamp), 
            COALESCE(st.created_at, '1900-01-01'::timestamp),
            COALESCE(sent.created_at, '1900-01-01'::timestamp)
        ) as last_updated
        
    FROM market_signals ms
    FULL OUTER JOIN sales_volumes sv ON (
        ms.year = sv.year AND ms.make = sv.make AND ms.model = sv.model 
        AND ms.region = sv.region AND ms.signal_date >= sv.sales_month - INTERVAL '7 days'
    )
    FULL OUTER JOIN price_trends pt ON (
        COALESCE(ms.year, sv.year) = pt.year 
        AND COALESCE(ms.make, sv.make) = pt.make 
        AND COALESCE(ms.model, sv.model) = pt.model
        AND COALESCE(ms.region, sv.region) = pt.region
        AND pt.price_date >= NOW() - INTERVAL '30 days'
    )
    FULL OUTER JOIN search_trends st ON (
        COALESCE(ms.year, sv.year, pt.year) = st.year
        AND COALESCE(ms.make, sv.make, pt.make) = st.make
        AND COALESCE(ms.model, sv.model, pt.model) = st.model  
        AND st.trend_date >= NOW() - INTERVAL '30 days'
    )
    FULL OUTER JOIN market_sentiment sent ON (
        COALESCE(ms.year, sv.year, pt.year) = sent.year
        AND COALESCE(ms.make, sv.make, pt.make) = sent.make
        AND COALESCE(ms.model, sv.model, pt.model) = sent.model
        AND sent.sentiment_date >= NOW() - INTERVAL '30 days'
    )
    WHERE COALESCE(ms.make, sv.make, pt.make, sent.make) IS NOT NULL
)
SELECT * FROM vehicle_signals;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_market_signals_vehicle ON market_signals(year, make, model, region);
CREATE INDEX IF NOT EXISTS idx_market_signals_date ON market_signals(signal_date);
CREATE INDEX IF NOT EXISTS idx_market_signals_type_source ON market_signals(signal_type, source);

CREATE INDEX IF NOT EXISTS idx_sales_volumes_vehicle ON sales_volumes(year, make, model, region);
CREATE INDEX IF NOT EXISTS idx_sales_volumes_date ON sales_volumes(sales_month);

CREATE INDEX IF NOT EXISTS idx_price_trends_vehicle ON price_trends(year, make, model, region);
CREATE INDEX IF NOT EXISTS idx_price_trends_date ON price_trends(price_date);

CREATE INDEX IF NOT EXISTS idx_search_trends_vehicle ON search_trends(year, make, model);
CREATE INDEX IF NOT EXISTS idx_search_trends_date ON search_trends(trend_date);

CREATE INDEX IF NOT EXISTS idx_market_sentiment_vehicle ON market_sentiment(year, make, model, region);
CREATE INDEX IF NOT EXISTS idx_market_sentiment_date ON market_sentiment(sentiment_date);

-- RPC function for upserting market signals
CREATE OR REPLACE FUNCTION rpc_upsert_market_signals(p_signals JSONB)
RETURNS JSON AS $$
DECLARE
    signal_record JSONB;
    inserted_count INTEGER := 0;
    updated_count INTEGER := 0;
    total_count INTEGER := 0;
BEGIN
    -- Loop through each signal in the input array
    FOR signal_record IN SELECT * FROM jsonb_array_elements(p_signals)
    LOOP
        total_count := total_count + 1;
        
        INSERT INTO market_signals (
            signal_type, source, year, make, model, trim, region,
            signal_value, signal_unit, signal_description,
            trend_direction, trend_strength, trend_period_days,
            confidence_score, data_quality_score, sample_size,
            signal_date, period_start, period_end, raw_data, expires_at
        )
        VALUES (
            signal_record->>'signal_type',
            signal_record->>'source',
            (signal_record->>'year')::INTEGER,
            signal_record->>'make',
            signal_record->>'model',
            signal_record->>'trim',
            COALESCE(signal_record->>'region', 'national'),
            (signal_record->>'signal_value')::DECIMAL,
            signal_record->>'signal_unit',
            signal_record->>'signal_description',
            signal_record->>'trend_direction',
            (signal_record->>'trend_strength')::DECIMAL,
            COALESCE((signal_record->>'trend_period_days')::INTEGER, 30),
            (signal_record->>'confidence_score')::DECIMAL,
            (signal_record->>'data_quality_score')::DECIMAL,
            (signal_record->>'sample_size')::INTEGER,
            (signal_record->>'signal_date')::DATE,
            (signal_record->>'period_start')::DATE,
            (signal_record->>'period_end')::DATE,
            signal_record->'raw_data',
            (signal_record->>'expires_at')::TIMESTAMP
        )
        ON CONFLICT (signal_type, source, year, make, model, region, signal_date)
        DO UPDATE SET
            signal_value = EXCLUDED.signal_value,
            signal_unit = EXCLUDED.signal_unit,
            signal_description = EXCLUDED.signal_description,
            trend_direction = EXCLUDED.trend_direction,
            trend_strength = EXCLUDED.trend_strength,
            confidence_score = EXCLUDED.confidence_score,
            data_quality_score = EXCLUDED.data_quality_score,
            sample_size = EXCLUDED.sample_size,
            raw_data = EXCLUDED.raw_data,
            updated_at = NOW();
            
        -- Count if this was an insert or update
        IF NOT FOUND THEN
            inserted_count := inserted_count + 1;
        ELSE
            updated_count := updated_count + 1;
        END IF;
    END LOOP;
    
    -- Refresh materialized view
    REFRESH MATERIALIZED VIEW market_intelligence;
    
    RETURN json_build_object(
        'success', true,
        'processed_count', total_count,
        'inserted_count', inserted_count,
        'updated_count', updated_count,
        'timestamp', NOW()
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM,
        'processed_count', total_count,
        'timestamp', NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get market intelligence summary
CREATE OR REPLACE FUNCTION get_market_intelligence(
    p_year INTEGER DEFAULT NULL,
    p_make TEXT DEFAULT NULL, 
    p_model TEXT DEFAULT NULL,
    p_region TEXT DEFAULT 'national'
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(row_to_json(mi))
    INTO result
    FROM market_intelligence mi
    WHERE (p_year IS NULL OR mi.year = p_year)
      AND (p_make IS NULL OR UPPER(mi.make) = UPPER(p_make))
      AND (p_model IS NULL OR UPPER(mi.model) = UPPER(p_model))
      AND mi.region = p_region
      AND mi.last_updated >= NOW() - INTERVAL '90 days'
    ORDER BY mi.demand_score DESC, mi.last_updated DESC;
    
    RETURN COALESCE(result, '[]'::JSON);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sample data for testing
INSERT INTO market_signals (signal_type, source, year, make, model, region, signal_value, signal_unit, signal_description, trend_direction, trend_strength, confidence_score, data_quality_score, signal_date) VALUES
('sales_volume', 'goodcarbadcar', 2023, 'TOYOTA', 'CAMRY', 'national', 25430, 'units', 'Monthly sales volume', 'up', 0.75, 0.90, 0.95, '2025-07-01'),
('price_trend', 'isecars', 2023, 'TOYOTA', 'CAMRY', 'national', 28500, 'usd', 'Average listing price', 'stable', 0.30, 0.85, 0.90, '2025-08-01'),
('search_trend', 'google_trends', 2023, 'TOYOTA', 'CAMRY', 'US', 72, 'score', 'Search volume index', 'rising', 0.60, 0.80, 0.85, '2025-08-10'),

('sales_volume', 'goodcarbadcar', 2023, 'HONDA', 'CIVIC', 'national', 18200, 'units', 'Monthly sales volume', 'down', 0.45, 0.90, 0.95, '2025-07-01'),
('price_trend', 'isecars', 2023, 'HONDA', 'CIVIC', 'national', 26800, 'usd', 'Average listing price', 'increasing', 0.55, 0.85, 0.90, '2025-08-01'),
('search_trend', 'google_trends', 2023, 'HONDA', 'CIVIC', 'US', 68, 'score', 'Search volume index', 'stable', 0.25, 0.80, 0.85, '2025-08-10'),

('sales_volume', 'goodcarbadcar', 2023, 'FORD', 'F-150', 'national', 45600, 'units', 'Monthly sales volume', 'up', 0.85, 0.90, 0.95, '2025-07-01'),
('price_trend', 'isecars', 2023, 'FORD', 'F-150', 'national', 42500, 'usd', 'Average listing price', 'increasing', 0.70, 0.85, 0.90, '2025-08-01'),
('search_trend', 'google_trends', 2023, 'FORD', 'F-150', 'US', 85, 'score', 'Search volume index', 'rising', 0.80, 0.80, 0.85, '2025-08-10');

-- Refresh the materialized view
REFRESH MATERIALIZED VIEW market_intelligence;
