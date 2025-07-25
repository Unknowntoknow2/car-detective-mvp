/**
 * PostgreSQL Database Schema for Vehicle Valuation System
 * Enterprise-grade schema with proper indexing, constraints, and audit trails
 */

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Enable Row Level Security globally
ALTER DATABASE car_detective SET row_security = on;

-- Users and Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'dealer', 'admin', 'api_user')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'deleted')),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Keys for external access
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    key_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    permissions JSONB NOT NULL DEFAULT '{}',
    rate_limit INTEGER DEFAULT 1000, -- requests per hour
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle Master Data
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vin VARCHAR(17) UNIQUE NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 2),
    make VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    trim VARCHAR(100),
    body_type VARCHAR(50),
    engine_type VARCHAR(100),
    fuel_type VARCHAR(30),
    transmission VARCHAR(50),
    drivetrain VARCHAR(20),
    doors INTEGER CHECK (doors > 0 AND doors <= 6),
    cylinders INTEGER CHECK (cylinders > 0 AND cylinders <= 16),
    displacement DECIMAL(4,1),
    horsepower INTEGER,
    torque INTEGER,
    msrp DECIMAL(10,2),
    invoice_price DECIMAL(10,2),
    weight INTEGER,
    length DECIMAL(6,2),
    width DECIMAL(6,2),
    height DECIMAL(6,2),
    wheelbase DECIMAL(6,2),
    epa_city_mpg INTEGER,
    epa_highway_mpg INTEGER,
    epa_combined_mpg INTEGER,
    safety_rating DECIMAL(2,1),
    nhtsa_overall_rating INTEGER CHECK (nhtsa_overall_rating >= 1 AND nhtsa_overall_rating <= 5),
    iihs_top_safety_pick BOOLEAN DEFAULT FALSE,
    country_of_origin VARCHAR(50),
    plant_state VARCHAR(50),
    plant_city VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle Features and Options
CREATE TABLE vehicle_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    feature_category VARCHAR(50) NOT NULL,
    feature_name VARCHAR(100) NOT NULL,
    feature_value VARCHAR(255),
    is_standard BOOLEAN DEFAULT FALSE,
    option_price DECIMAL(8,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Valuations
CREATE TABLE valuations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    vin VARCHAR(17) NOT NULL,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    mileage INTEGER NOT NULL CHECK (mileage >= 0),
    condition VARCHAR(20) NOT NULL CHECK (condition IN ('excellent', 'very_good', 'good', 'fair', 'poor')),
    zip_code VARCHAR(10) NOT NULL,
    
    -- Valuation Results
    estimated_value DECIMAL(10,2) NOT NULL,
    price_range_min DECIMAL(10,2) NOT NULL,
    price_range_max DECIMAL(10,2) NOT NULL,
    confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
    valuation_method VARCHAR(50) NOT NULL,
    
    -- Base Valuation
    base_value DECIMAL(10,2) NOT NULL,
    base_value_source VARCHAR(50) NOT NULL,
    base_value_confidence DECIMAL(3,2),
    
    -- Market Insights
    market_avg_price DECIMAL(10,2),
    market_listing_count INTEGER,
    market_price_variance DECIMAL(4,3),
    market_demand_index INTEGER CHECK (market_demand_index >= 0 AND market_demand_index <= 100),
    market_time_on_market INTEGER,
    market_competitive_position VARCHAR(20),
    
    -- Confidence Breakdown
    confidence_data_quality INTEGER,
    confidence_market_data INTEGER,
    confidence_vehicle_data INTEGER,
    confidence_ml_model INTEGER,
    
    -- Metadata
    processing_time_ms INTEGER,
    engine_version VARCHAR(20),
    data_sources_used JSONB,
    adjustments_applied JSONB,
    raw_data JSONB,
    
    -- Status and Audit
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'expired')),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Valuation Adjustments (detailed breakdown)
CREATE TABLE valuation_adjustments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    valuation_id UUID REFERENCES valuations(id) ON DELETE CASCADE,
    factor VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('condition', 'mileage', 'market', 'location', 'features', 'history')),
    impact_amount DECIMAL(10,2) NOT NULL,
    impact_percentage DECIMAL(5,2),
    description TEXT,
    confidence DECIMAL(3,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market Listings (for comparison)
CREATE TABLE market_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vin VARCHAR(17),
    source VARCHAR(50) NOT NULL,
    source_listing_id VARCHAR(100),
    
    -- Vehicle Info
    year INTEGER NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    trim VARCHAR(100),
    mileage INTEGER,
    condition VARCHAR(20),
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Location
    zip_code VARCHAR(10),
    city VARCHAR(100),
    state VARCHAR(50),
    country VARCHAR(50) DEFAULT 'US',
    
    -- Seller Info
    dealer_name VARCHAR(255),
    seller_type VARCHAR(20) CHECK (seller_type IN ('dealer', 'private', 'fleet', 'auction')),
    is_certified BOOLEAN DEFAULT FALSE,
    
    -- Listing Details
    title VARCHAR(500),
    description TEXT,
    features JSONB,
    photos JSONB,
    listing_url VARCHAR(1000),
    
    -- Dates
    listed_date TIMESTAMPTZ,
    last_updated TIMESTAMPTZ,
    days_on_market INTEGER,
    
    -- Quality and Verification
    verified BOOLEAN DEFAULT FALSE,
    confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
    
    -- Audit
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auction Data
CREATE TABLE auction_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vin VARCHAR(17),
    lot_number VARCHAR(50),
    auction_house VARCHAR(100) NOT NULL,
    
    -- Vehicle Info
    year INTEGER NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    trim VARCHAR(100),
    mileage INTEGER,
    condition VARCHAR(20),
    
    -- Auction Details
    auction_date TIMESTAMPTZ NOT NULL,
    auction_type VARCHAR(50),
    sale_status VARCHAR(20) CHECK (sale_status IN ('sold', 'no_sale', 'withdrawn', 'announced')),
    
    -- Pricing
    current_bid DECIMAL(10,2),
    reserve_price DECIMAL(10,2),
    buy_now_price DECIMAL(10,2),
    final_price DECIMAL(10,2),
    estimated_value DECIMAL(10,2),
    
    -- Damage/Condition
    primary_damage VARCHAR(100),
    secondary_damage VARCHAR(100),
    damage_description TEXT,
    has_keys BOOLEAN,
    runs_drives BOOLEAN,
    
    -- Location
    location VARCHAR(255),
    seller_type VARCHAR(50),
    
    -- Additional Info
    title_type VARCHAR(50),
    odometer_type VARCHAR(20),
    photos JSONB,
    condition_report JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Vehicle History (for users' owned vehicles)
CREATE TABLE user_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vin VARCHAR(17) NOT NULL,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    
    -- Ownership Info
    ownership_status VARCHAR(20) DEFAULT 'current' CHECK (ownership_status IN ('current', 'former', 'interested')),
    acquisition_date DATE,
    disposal_date DATE,
    purchase_price DECIMAL(10,2),
    current_mileage INTEGER,
    
    -- Vehicle State
    condition VARCHAR(20),
    exterior_color VARCHAR(50),
    interior_color VARCHAR(50),
    modifications JSONB,
    
    -- Service History
    last_service_date DATE,
    last_service_mileage INTEGER,
    service_history JSONB,
    
    -- Insurance and Registration
    insurance_carrier VARCHAR(100),
    registration_state VARCHAR(50),
    registration_expires DATE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photos and Media
CREATE TABLE vehicle_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    valuation_id UUID REFERENCES valuations(id) ON DELETE CASCADE,
    user_vehicle_id UUID REFERENCES user_vehicles(id) ON DELETE CASCADE,
    
    photo_url VARCHAR(1000) NOT NULL,
    thumbnail_url VARCHAR(1000),
    photo_type VARCHAR(50) CHECK (photo_type IN ('exterior', 'interior', 'engine', 'damage', 'other')),
    
    -- AI Analysis Results
    ai_score DECIMAL(3,2),
    damage_detected JSONB,
    condition_assessment JSONB,
    
    -- Metadata
    file_size INTEGER,
    width INTEGER,
    height INTEGER,
    format VARCHAR(10),
    
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Trail
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    operation VARCHAR(10) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_ip INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Configuration
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Usage Tracking
CREATE TABLE api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER,
    request_size INTEGER,
    response_size INTEGER,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- INDEXES FOR PERFORMANCE
-- =====================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role ON users(role);

-- API Keys
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_active ON api_keys(is_active);

-- Vehicles
CREATE INDEX idx_vehicles_vin ON vehicles(vin);
CREATE INDEX idx_vehicles_make_model ON vehicles(make, model);
CREATE INDEX idx_vehicles_year ON vehicles(year);
CREATE INDEX idx_vehicles_search ON vehicles USING gin((make || ' ' || model) gin_trgm_ops);

-- Vehicle Features
CREATE INDEX idx_vehicle_features_vehicle_id ON vehicle_features(vehicle_id);
CREATE INDEX idx_vehicle_features_category ON vehicle_features(feature_category);

-- Valuations
CREATE INDEX idx_valuations_user_id ON valuations(user_id);
CREATE INDEX idx_valuations_vin ON valuations(vin);
CREATE INDEX idx_valuations_created_at ON valuations(created_at DESC);
CREATE INDEX idx_valuations_status ON valuations(status);
CREATE INDEX idx_valuations_expires_at ON valuations(expires_at);

-- Valuation Adjustments
CREATE INDEX idx_valuation_adjustments_valuation_id ON valuation_adjustments(valuation_id);
CREATE INDEX idx_valuation_adjustments_category ON valuation_adjustments(category);

-- Market Listings
CREATE INDEX idx_market_listings_vin ON market_listings(vin);
CREATE INDEX idx_market_listings_make_model ON market_listings(make, model);
CREATE INDEX idx_market_listings_year ON market_listings(year);
CREATE INDEX idx_market_listings_price ON market_listings(price);
CREATE INDEX idx_market_listings_source ON market_listings(source);
CREATE INDEX idx_market_listings_zip ON market_listings(zip_code);
CREATE INDEX idx_market_listings_fetched_at ON market_listings(fetched_at DESC);

-- Auction Data
CREATE INDEX idx_auction_data_vin ON auction_data(vin);
CREATE INDEX idx_auction_data_auction_date ON auction_data(auction_date DESC);
CREATE INDEX idx_auction_data_make_model ON auction_data(make, model);
CREATE INDEX idx_auction_data_final_price ON auction_data(final_price);

-- User Vehicles
CREATE INDEX idx_user_vehicles_user_id ON user_vehicles(user_id);
CREATE INDEX idx_user_vehicles_vin ON user_vehicles(vin);
CREATE INDEX idx_user_vehicles_status ON user_vehicles(ownership_status);

-- Vehicle Photos
CREATE INDEX idx_vehicle_photos_valuation_id ON vehicle_photos(valuation_id);
CREATE INDEX idx_vehicle_photos_user_vehicle_id ON vehicle_photos(user_vehicle_id);
CREATE INDEX idx_vehicle_photos_type ON vehicle_photos(photo_type);

-- Audit Log
CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

-- API Usage
CREATE INDEX idx_api_usage_api_key_id ON api_usage(api_key_id);
CREATE INDEX idx_api_usage_created_at ON api_usage(created_at DESC);
CREATE INDEX idx_api_usage_endpoint ON api_usage(endpoint);

-- =====================
-- TRIGGERS AND FUNCTIONS
-- =====================

-- Updated timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_valuations_updated_at BEFORE UPDATE ON valuations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_market_listings_updated_at BEFORE UPDATE ON market_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_auction_data_updated_at BEFORE UPDATE ON auction_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_vehicles_updated_at BEFORE UPDATE ON user_vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, operation, old_values, user_id)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), current_setting('app.user_id', true)::UUID);
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, operation, old_values, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), current_setting('app.user_id', true)::UUID);
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, operation, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), current_setting('app.user_id', true)::UUID);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to key tables
CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_valuations AFTER INSERT OR UPDATE OR DELETE ON valuations FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_user_vehicles AFTER INSERT OR UPDATE OR DELETE ON user_vehicles FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- =====================
-- ROW LEVEL SECURITY POLICIES
-- =====================

-- Enable RLS on user-facing tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_photos ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY users_own_data ON users FOR ALL USING (id = current_setting('app.user_id')::UUID);

-- Valuations: users can see their own, admins can see all
CREATE POLICY valuations_user_data ON valuations FOR ALL USING (
    user_id = current_setting('app.user_id')::UUID OR 
    EXISTS (SELECT 1 FROM users WHERE id = current_setting('app.user_id')::UUID AND role = 'admin')
);

-- User vehicles: users can see their own
CREATE POLICY user_vehicles_own_data ON user_vehicles FOR ALL USING (user_id = current_setting('app.user_id')::UUID);

-- Vehicle photos: users can see photos for their valuations
CREATE POLICY vehicle_photos_user_data ON vehicle_photos FOR ALL USING (
    EXISTS (SELECT 1 FROM valuations WHERE id = vehicle_photos.valuation_id AND user_id = current_setting('app.user_id')::UUID) OR
    EXISTS (SELECT 1 FROM user_vehicles WHERE id = vehicle_photos.user_vehicle_id AND user_id = current_setting('app.user_id')::UUID)
);

-- =====================
-- DEFAULT DATA
-- =====================

-- Insert default system configuration
INSERT INTO system_config (config_key, config_value, description) VALUES
('valuation_engine_version', '"2.0.0"', 'Current valuation engine version'),
('default_confidence_threshold', '70', 'Minimum confidence score for high-quality valuations'),
('max_valuation_age_days', '30', 'Days after which valuations expire'),
('rate_limit_per_hour', '1000', 'Default API rate limit per hour'),
('enable_audit_logging', 'true', 'Enable comprehensive audit logging'),
('market_data_refresh_hours', '24', 'Hours between market data refreshes');

-- Insert default admin user (password should be changed immediately)
INSERT INTO users (email, password_hash, first_name, last_name, role, status, email_verified) VALUES
('admin@cardetective.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeX19BYw9Z8g3CsIu', 'System', 'Administrator', 'admin', 'active', true);

COMMENT ON DATABASE car_detective IS 'Car Detective vehicle valuation system database';
COMMENT ON TABLE users IS 'User accounts and authentication';
COMMENT ON TABLE vehicles IS 'Master vehicle data from VIN decoding';
COMMENT ON TABLE valuations IS 'Vehicle valuation results and metadata';
COMMENT ON TABLE market_listings IS 'Market listing data for comparison';
COMMENT ON TABLE auction_data IS 'Auction sale data for historical pricing';
COMMENT ON TABLE audit_log IS 'Comprehensive audit trail for compliance';