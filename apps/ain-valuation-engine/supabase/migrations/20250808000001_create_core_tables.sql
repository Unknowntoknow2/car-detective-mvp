-- AIN Valuation Engine - Core Tables Migration
-- Created: 2025-08-08
-- Description: Creates foundational tables for VIN data, safety ratings, fuel economy, and user inputs

-- =====================================================
-- 1. VEHICLE SPECIFICATIONS TABLE
-- =====================================================
CREATE TABLE vehicle_specs (
    vin VARCHAR(17) PRIMARY KEY CHECK (length(vin) = 17),
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1980 AND year <= 2030),
    trim VARCHAR(100),
    body_class VARCHAR(100),
    engine_cylinders INTEGER CHECK (engine_cylinders >= 1 AND engine_cylinders <= 16),
    displacement_cc DECIMAL(6,1),
    fuel_type_primary VARCHAR(50),
    drive_type VARCHAR(20),
    transmission_style VARCHAR(50),
    manufacturer VARCHAR(200),
    plant_country VARCHAR(100),
    plant_state VARCHAR(100),
    vehicle_type VARCHAR(100),
    gvwr DECIMAL(8,2),
    doors INTEGER CHECK (doors >= 1 AND doors <= 8),
    series VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for vehicle_specs
CREATE INDEX idx_vehicle_specs_make_model_year ON vehicle_specs(make, model, year);
CREATE INDEX idx_vehicle_specs_year ON vehicle_specs(year);
CREATE INDEX idx_vehicle_specs_make ON vehicle_specs(make);
CREATE INDEX idx_vehicle_specs_created_at ON vehicle_specs(created_at);

-- =====================================================
-- 2. NHTSA RECALLS TABLE
-- =====================================================
CREATE TABLE nhtsa_recalls (
    id BIGSERIAL PRIMARY KEY,
    vin VARCHAR(17) NOT NULL REFERENCES vehicle_specs(vin) ON DELETE CASCADE,
    recall_id VARCHAR(50) NOT NULL,
    nhtsa_campaign_number VARCHAR(20),
    component VARCHAR(200),
    summary TEXT,
    consequence TEXT,
    remedy TEXT,
    report_date DATE,
    manufacturer VARCHAR(200),
    remedy_status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(vin, recall_id)
);

-- Indexes for nhtsa_recalls
CREATE INDEX idx_nhtsa_recalls_vin ON nhtsa_recalls(vin);
CREATE INDEX idx_nhtsa_recalls_campaign ON nhtsa_recalls(nhtsa_campaign_number);
CREATE INDEX idx_nhtsa_recalls_report_date ON nhtsa_recalls(report_date);

-- =====================================================
-- 3. NHTSA SAFETY RATINGS TABLE
-- =====================================================
CREATE TABLE nhtsa_safety_ratings (
    id BIGSERIAL PRIMARY KEY,
    vin VARCHAR(17) NOT NULL REFERENCES vehicle_specs(vin) ON DELETE CASCADE,
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    frontal_crash_rating INTEGER CHECK (frontal_crash_rating >= 1 AND frontal_crash_rating <= 5),
    side_crash_rating INTEGER CHECK (side_crash_rating >= 1 AND side_crash_rating <= 5),
    rollover_rating INTEGER CHECK (rollover_rating >= 1 AND rollover_rating <= 5),
    model_year INTEGER,
    vehicle_description VARCHAR(200),
    overall_frontal_rating INTEGER CHECK (overall_frontal_rating >= 1 AND overall_frontal_rating <= 5),
    nhtsa_id VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(vin)
);

-- Indexes for nhtsa_safety_ratings
CREATE INDEX idx_safety_ratings_vin ON nhtsa_safety_ratings(vin);
CREATE INDEX idx_safety_ratings_overall ON nhtsa_safety_ratings(overall_rating);

-- =====================================================
-- 4. FUEL ECONOMY TABLE
-- =====================================================
CREATE TABLE fuel_economy (
    id BIGSERIAL PRIMARY KEY,
    vin VARCHAR(17) NOT NULL REFERENCES vehicle_specs(vin) ON DELETE CASCADE,
    city_mpg DECIMAL(5,1) CHECK (city_mpg > 0),
    highway_mpg DECIMAL(5,1) CHECK (highway_mpg > 0),
    combined_mpg DECIMAL(5,1) CHECK (combined_mpg > 0),
    annual_fuel_cost DECIMAL(8,2),
    fuel_type VARCHAR(50),
    epa_id VARCHAR(20),
    co2_emissions DECIMAL(8,2),
    greenhouse_score INTEGER CHECK (greenhouse_score >= 1 AND greenhouse_score <= 10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(vin)
);

-- Indexes for fuel_economy
CREATE INDEX idx_fuel_economy_vin ON fuel_economy(vin);
CREATE INDEX idx_fuel_economy_combined_mpg ON fuel_economy(combined_mpg);

-- =====================================================
-- 5. MARKET LISTINGS TABLE
-- =====================================================
CREATE TABLE market_listings (
    id BIGSERIAL PRIMARY KEY,
    vin VARCHAR(17) REFERENCES vehicle_specs(vin) ON DELETE SET NULL,
    listing_price DECIMAL(10,2) NOT NULL CHECK (listing_price > 0),
    mileage INTEGER CHECK (mileage >= 0),
    location VARCHAR(100),
    zip_code VARCHAR(10),
    source VARCHAR(50) NOT NULL,
    listing_url TEXT,
    dealer_name VARCHAR(200),
    is_dealer BOOLEAN DEFAULT false,
    condition VARCHAR(20),
    title_status VARCHAR(30),
    exterior_color VARCHAR(50),
    interior_color VARCHAR(50),
    listed_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for market_listings
CREATE INDEX idx_market_listings_vin ON market_listings(vin);
CREATE INDEX idx_market_listings_price ON market_listings(listing_price);
CREATE INDEX idx_market_listings_source ON market_listings(source);
CREATE INDEX idx_market_listings_location ON market_listings(location);
CREATE INDEX idx_market_listings_listed_at ON market_listings(listed_at);

-- =====================================================
-- 6. FOLLOW-UP ANSWERS TABLE
-- =====================================================
CREATE TABLE follow_up_answers (
    id BIGSERIAL PRIMARY KEY,
    vin VARCHAR(17) NOT NULL REFERENCES vehicle_specs(vin) ON DELETE CASCADE,
    user_id UUID,
    session_id VARCHAR(100),
    mileage INTEGER CHECK (mileage >= 0),
    zip_code VARCHAR(10),
    condition VARCHAR(20) CHECK (condition IN ('excellent', 'very_good', 'good', 'fair', 'poor')),
    tire_condition VARCHAR(20),
    dashboard_lights TEXT[],
    accidents JSONB DEFAULT '[]',
    features JSONB DEFAULT '{}',
    exterior_color VARCHAR(50),
    interior_color VARCHAR(50),
    title_status VARCHAR(30) DEFAULT 'clean',
    additional_notes TEXT,
    valuation_requested BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for follow_up_answers
CREATE INDEX idx_follow_up_answers_vin ON follow_up_answers(vin);
CREATE INDEX idx_follow_up_answers_user_id ON follow_up_answers(user_id);
CREATE INDEX idx_follow_up_answers_session_id ON follow_up_answers(session_id);
CREATE INDEX idx_follow_up_answers_created_at ON follow_up_answers(created_at);

-- =====================================================
-- 7. VALUATION HISTORY TABLE
-- =====================================================
CREATE TABLE valuation_history (
    id BIGSERIAL PRIMARY KEY,
    vin VARCHAR(17) NOT NULL REFERENCES vehicle_specs(vin) ON DELETE CASCADE,
    user_id UUID,
    session_id VARCHAR(100),
    estimated_value DECIMAL(10,2) NOT NULL,
    confidence_score DECIMAL(5,2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
    price_range_low DECIMAL(10,2),
    price_range_high DECIMAL(10,2),
    valuation_mode VARCHAR(20) DEFAULT 'market',
    input_data JSONB,
    adjustments JSONB DEFAULT '[]',
    market_factors JSONB DEFAULT '[]',
    comparables_count INTEGER DEFAULT 0,
    data_quality_score DECIMAL(5,2),
    explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for valuation_history
CREATE INDEX idx_valuation_history_vin ON valuation_history(vin);
CREATE INDEX idx_valuation_history_user_id ON valuation_history(user_id);
CREATE INDEX idx_valuation_history_created_at ON valuation_history(created_at);
CREATE INDEX idx_valuation_history_estimated_value ON valuation_history(estimated_value);

-- =====================================================
-- 8. FUEL PRICE HISTORY TABLE
-- =====================================================
CREATE TABLE fuel_price_history (
    id BIGSERIAL PRIMARY KEY,
    region VARCHAR(50) NOT NULL,
    fuel_type VARCHAR(30) NOT NULL,
    price_per_gallon DECIMAL(6,3) NOT NULL CHECK (price_per_gallon > 0),
    price_date DATE NOT NULL,
    source VARCHAR(50) DEFAULT 'EIA',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(region, fuel_type, price_date)
);

-- Indexes for fuel_price_history
CREATE INDEX idx_fuel_price_history_region ON fuel_price_history(region);
CREATE INDEX idx_fuel_price_history_date ON fuel_price_history(price_date);

-- =====================================================
-- 9. UPDATE TRIGGERS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to relevant tables
CREATE TRIGGER update_vehicle_specs_updated_at BEFORE UPDATE ON vehicle_specs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nhtsa_recalls_updated_at BEFORE UPDATE ON nhtsa_recalls 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nhtsa_safety_ratings_updated_at BEFORE UPDATE ON nhtsa_safety_ratings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fuel_economy_updated_at BEFORE UPDATE ON fuel_economy 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_market_listings_updated_at BEFORE UPDATE ON market_listings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_follow_up_answers_updated_at BEFORE UPDATE ON follow_up_answers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. ROW LEVEL SECURITY (RLS) SETUP
-- =====================================================

-- Enable RLS on user-data tables
ALTER TABLE follow_up_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE valuation_history ENABLE ROW LEVEL SECURITY;

-- Public read access for vehicle specs and safety data
ALTER TABLE vehicle_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nhtsa_recalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE nhtsa_safety_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_economy ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_listings ENABLE ROW LEVEL SECURITY;

-- Policies for public data (vehicle specs, safety, fuel economy)
CREATE POLICY "Public read access for vehicle specs" ON vehicle_specs
    FOR SELECT USING (true);

CREATE POLICY "Public read access for recalls" ON nhtsa_recalls
    FOR SELECT USING (true);

CREATE POLICY "Public read access for safety ratings" ON nhtsa_safety_ratings
    FOR SELECT USING (true);

CREATE POLICY "Public read access for fuel economy" ON fuel_economy
    FOR SELECT USING (true);

CREATE POLICY "Public read access for market listings" ON market_listings
    FOR SELECT USING (true);

-- Policies for user data (follow_up_answers, valuation_history)
CREATE POLICY "Users can read their own follow-up answers" ON follow_up_answers
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own follow-up answers" ON follow_up_answers
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own follow-up answers" ON follow_up_answers
    FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can read their own valuation history" ON valuation_history
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own valuation history" ON valuation_history
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- =====================================================
-- 11. COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE vehicle_specs IS 'Core vehicle specifications decoded from VIN via NHTSA vPIC API';
COMMENT ON TABLE nhtsa_recalls IS 'NHTSA recall information by VIN';
COMMENT ON TABLE nhtsa_safety_ratings IS 'NHTSA 5-star safety ratings by VIN';
COMMENT ON TABLE fuel_economy IS 'EPA fuel economy data by VIN';
COMMENT ON TABLE market_listings IS 'Market price listings for comparable analysis';
COMMENT ON TABLE follow_up_answers IS 'User-provided vehicle details for valuation';
COMMENT ON TABLE valuation_history IS 'Historical valuation results and explanations';
COMMENT ON TABLE fuel_price_history IS 'Regional fuel price tracking for cost calculations';

-- Column comments for key fields
COMMENT ON COLUMN vehicle_specs.vin IS 'ISO 3779 compliant 17-character Vehicle Identification Number';
COMMENT ON COLUMN follow_up_answers.accidents IS 'JSON array of accident records with dates and severity';
COMMENT ON COLUMN follow_up_answers.features IS 'JSON object of vehicle features and options';
COMMENT ON COLUMN valuation_history.input_data IS 'Complete input data used for valuation calculation';
COMMENT ON COLUMN valuation_history.adjustments IS 'JSON array of price adjustments applied';
COMMENT ON COLUMN valuation_history.market_factors IS 'JSON array of market factors considered';
