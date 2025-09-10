-- Golden VIN Dataset Initialization
-- Comprehensive test dataset with expected results for QA validation
-- Created: 2025-08-11

-- Insert core dataset (Priority 1) - Popular vehicles with complete data
INSERT INTO golden_vins (vin, test_category, priority, manufacturer, model_year, make, model, description, complexity_score, expected_results, tags) VALUES

-- Honda Accord 2020 (Comprehensive test case)
('1HGCV1F3XLA123456', 'core', 1, 'Honda', 2020, 'Honda', 'Accord', 'Popular midsize sedan with comprehensive data coverage', 3, '{
  "decoder": {
    "make": "Honda",
    "model": "Accord",
    "year": 2020,
    "trim": "EX-L",
    "engine": "1.5L Turbo",
    "transmission": "CVT",
    "drivetrain": "FWD",
    "fuel_type": "Gasoline",
    "country": "USA"
  },
  "safety": {
    "overall_rating": "Good",
    "frontal_crash_rating": "Good",
    "side_crash_rating": "Good",
    "rollover_rating": "Good",
    "top_safety_pick": true
  },
  "market_intelligence": {
    "market_score": 85,
    "market_temperature": "warm",
    "sales_momentum": "strong",
    "consumer_interest": "high",
    "price_stability": "stable"
  },
  "valuation": {
    "base_value": 24500,
    "adjusted_value": 26200,
    "total_adjustment": 1700,
    "confidence_score": 0.92
  },
  "performance": {
    "max_response_time_ms": 2000
  }
}', ARRAY['popular', 'midsize', 'sedan', 'honda']),

-- Toyota Camry 2021 (High-volume test case)
('4T1C11AK5MU123456', 'core', 1, 'Toyota', 2021, 'Toyota', 'Camry', 'Best-selling midsize sedan with excellent reliability', 2, '{
  "decoder": {
    "make": "Toyota",
    "model": "Camry",
    "year": 2021,
    "trim": "XLE",
    "engine": "2.5L I4",
    "transmission": "8-Speed Automatic",
    "drivetrain": "FWD",
    "fuel_type": "Gasoline",
    "country": "USA"
  },
  "safety": {
    "overall_rating": "Good",
    "frontal_crash_rating": "Good",
    "side_crash_rating": "Good",
    "rollover_rating": "Good",
    "top_safety_pick": true
  },
  "market_intelligence": {
    "market_score": 88,
    "market_temperature": "warm",
    "sales_momentum": "strong",
    "consumer_interest": "high",
    "price_stability": "stable"
  },
  "valuation": {
    "base_value": 26800,
    "adjusted_value": 28100,
    "total_adjustment": 1300,
    "confidence_score": 0.94
  },
  "performance": {
    "max_response_time_ms": 1800
  }
}', ARRAY['popular', 'midsize', 'sedan', 'toyota', 'bestseller']),

-- Ford F-150 2022 (Truck category)
('1FTFW1E84NFA12345', 'core', 1, 'Ford', 2022, 'Ford', 'F-150', 'Americas best-selling truck with comprehensive options', 4, '{
  "decoder": {
    "make": "Ford",
    "model": "F-150",
    "year": 2022,
    "trim": "XLT",
    "engine": "3.5L V6 EcoBoost",
    "transmission": "10-Speed Automatic",
    "drivetrain": "4WD",
    "fuel_type": "Gasoline",
    "country": "USA"
  },
  "safety": {
    "overall_rating": "Good",
    "frontal_crash_rating": "Good",
    "side_crash_rating": "Acceptable",
    "rollover_rating": "Good",
    "top_safety_pick": false
  },
  "market_intelligence": {
    "market_score": 92,
    "market_temperature": "hot",
    "sales_momentum": "strong",
    "consumer_interest": "high",
    "price_stability": "volatile"
  },
  "valuation": {
    "base_value": 42500,
    "adjusted_value": 45200,
    "total_adjustment": 2700,
    "confidence_score": 0.89
  },
  "performance": {
    "max_response_time_ms": 2500
  }
}', ARRAY['popular', 'truck', 'ford', 'bestseller', 'commercial']),

-- Tesla Model 3 2023 (Electric vehicle)
('5YJ3E1EA9PF123456', 'core', 1, 'Tesla', 2023, 'Tesla', 'Model 3', 'Popular electric sedan with advanced technology', 5, '{
  "decoder": {
    "make": "Tesla",
    "model": "Model 3",
    "year": 2023,
    "trim": "Long Range",
    "engine": "Electric Motor",
    "transmission": "Single-Speed",
    "drivetrain": "AWD",
    "fuel_type": "Electric",
    "country": "USA"
  },
  "safety": {
    "overall_rating": "Good",
    "frontal_crash_rating": "Good",
    "side_crash_rating": "Good",
    "rollover_rating": "Good",
    "top_safety_pick": true
  },
  "market_intelligence": {
    "market_score": 78,
    "market_temperature": "warm",
    "sales_momentum": "moderate",
    "consumer_interest": "high",
    "price_stability": "volatile"
  },
  "valuation": {
    "base_value": 48500,
    "adjusted_value": 46800,
    "total_adjustment": -1700,
    "confidence_score": 0.85
  },
  "performance": {
    "max_response_time_ms": 3000
  }
}', ARRAY['electric', 'sedan', 'tesla', 'luxury', 'technology']),

-- Chevrolet Silverado 2021 (Competing truck)
('1GCRYDED4MZ123456', 'core', 2, 'Chevrolet', 2021, 'Chevrolet', 'Silverado 1500', 'Popular full-size truck with strong market presence', 3, '{
  "decoder": {
    "make": "Chevrolet",
    "model": "Silverado 1500",
    "year": 2021,
    "trim": "LT",
    "engine": "5.3L V8",
    "transmission": "8-Speed Automatic",
    "drivetrain": "4WD",
    "fuel_type": "Gasoline",
    "country": "USA"
  },
  "safety": {
    "overall_rating": "Good",
    "frontal_crash_rating": "Good",
    "side_crash_rating": "Acceptable",
    "rollover_rating": "Good",
    "top_safety_pick": false
  },
  "market_intelligence": {
    "market_score": 84,
    "market_temperature": "warm",
    "sales_momentum": "strong",
    "consumer_interest": "high",
    "price_stability": "stable"
  },
  "valuation": {
    "base_value": 38500,
    "adjusted_value": 40100,
    "total_adjustment": 1600,
    "confidence_score": 0.87
  },
  "performance": {
    "max_response_time_ms": 2200
  }
}', ARRAY['truck', 'chevrolet', 'popular', 'commercial']),

-- BMW 3 Series 2022 (Luxury sedan)
('WBA5R1C0XNA123456', 'core', 2, 'BMW', 2022, 'BMW', '330i', 'Luxury compact sedan with premium features', 6, '{
  "decoder": {
    "make": "BMW",
    "model": "330i",
    "year": 2022,
    "trim": "xDrive",
    "engine": "2.0L Turbo I4",
    "transmission": "8-Speed Automatic",
    "drivetrain": "AWD",
    "fuel_type": "Gasoline",
    "country": "Germany"
  },
  "safety": {
    "overall_rating": "Good",
    "frontal_crash_rating": "Good",
    "side_crash_rating": "Good",
    "rollover_rating": "Good",
    "top_safety_pick": true
  },
  "market_intelligence": {
    "market_score": 76,
    "market_temperature": "cool",
    "sales_momentum": "moderate",
    "consumer_interest": "moderate",
    "price_stability": "stable"
  },
  "valuation": {
    "base_value": 38500,
    "adjusted_value": 37200,
    "total_adjustment": -1300,
    "confidence_score": 0.81
  },
  "performance": {
    "max_response_time_ms": 2800
  }
}', ARRAY['luxury', 'sedan', 'bmw', 'german', 'premium']);

-- Insert edge case dataset (Priority 2) - Problematic or unusual VINs
INSERT INTO golden_vins (vin, test_category, priority, manufacturer, model_year, make, model, description, complexity_score, expected_results, tags) VALUES

-- Very old vehicle (1995)
('1HGCD5634SA123456', 'edge_case', 2, 'Honda', 1995, 'Honda', 'Accord', 'Very old vehicle with limited data availability', 7, '{
  "decoder": {
    "make": "Honda",
    "model": "Accord",
    "year": 1995,
    "trim": "LX",
    "engine": "2.2L I4",
    "transmission": "5-Speed Manual",
    "drivetrain": "FWD",
    "fuel_type": "Gasoline",
    "country": "USA"
  },
  "safety": null,
  "market_intelligence": {
    "market_score": 25,
    "market_temperature": "cold",
    "sales_momentum": "weak",
    "consumer_interest": "low",
    "price_stability": "stable"
  },
  "valuation": {
    "base_value": 3500,
    "adjusted_value": 3200,
    "total_adjustment": -300,
    "confidence_score": 0.45
  },
  "performance": {
    "max_response_time_ms": 5000
  }
}', ARRAY['old', 'vintage', 'limited_data', 'manual']),

-- Exotic/Rare vehicle
('ZFF82RHA0K0123456', 'edge_case', 2, 'Ferrari', 2019, 'Ferrari', '488 GTB', 'Exotic sports car with limited market data', 9, '{
  "decoder": {
    "make": "Ferrari",
    "model": "488 GTB",
    "year": 2019,
    "trim": "Base",
    "engine": "3.9L V8 Twin Turbo",
    "transmission": "7-Speed Dual-Clutch",
    "drivetrain": "RWD",
    "fuel_type": "Gasoline",
    "country": "Italy"
  },
  "safety": null,
  "market_intelligence": {
    "market_score": 65,
    "market_temperature": "cool",
    "sales_momentum": "weak",
    "consumer_interest": "moderate",
    "price_stability": "volatile"
  },
  "valuation": {
    "base_value": 285000,
    "adjusted_value": 290000,
    "total_adjustment": 5000,
    "confidence_score": 0.62
  },
  "performance": {
    "max_response_time_ms": 8000
  }
}', ARRAY['exotic', 'ferrari', 'supercar', 'rare', 'expensive']),

-- Commercial vehicle
('1FDWF36L1VEA12345', 'edge_case', 3, 'Ford', 1997, 'Ford', 'F-350', 'Heavy duty commercial truck with specialized use', 6, '{
  "decoder": {
    "make": "Ford",
    "model": "F-350",
    "year": 1997,
    "trim": "Regular Cab",
    "engine": "7.3L V8 Diesel",
    "transmission": "5-Speed Manual",
    "drivetrain": "4WD",
    "fuel_type": "Diesel",
    "country": "USA"
  },
  "safety": null,
  "market_intelligence": {
    "market_score": 45,
    "market_temperature": "cool",
    "sales_momentum": "weak",
    "consumer_interest": "low",
    "price_stability": "stable"
  },
  "valuation": {
    "base_value": 12500,
    "adjusted_value": 13800,
    "total_adjustment": 1300,
    "confidence_score": 0.68
  },
  "performance": {
    "max_response_time_ms": 4000
  }
}', ARRAY['commercial', 'diesel', 'truck', 'heavy_duty', 'work_truck']);

-- Insert performance benchmark dataset (Priority 3) - For speed and accuracy testing
INSERT INTO golden_vins (vin, test_category, priority, manufacturer, model_year, make, model, description, complexity_score, expected_results, tags) VALUES

-- Fast processing VIN
('2T1BURHE0JC123456', 'performance', 3, 'Toyota', 2018, 'Toyota', 'Corolla', 'Simple vehicle for fast processing benchmark', 1, '{
  "decoder": {
    "make": "Toyota",
    "model": "Corolla",
    "year": 2018,
    "trim": "LE",
    "engine": "1.8L I4",
    "transmission": "CVT",
    "drivetrain": "FWD",
    "fuel_type": "Gasoline",
    "country": "USA"
  },
  "performance": {
    "max_response_time_ms": 800
  }
}', ARRAY['performance', 'fast', 'simple', 'benchmark']),

-- Complex processing VIN
('WP0CB2A85KS123456', 'performance', 3, 'Porsche', 2019, 'Porsche', '911', 'Complex luxury sports car for processing benchmark', 8, '{
  "decoder": {
    "make": "Porsche",
    "model": "911",
    "year": 2019,
    "trim": "Carrera S",
    "engine": "3.0L H6 Twin Turbo",
    "transmission": "8-Speed PDK",
    "drivetrain": "RWD",
    "fuel_type": "Gasoline",
    "country": "Germany"
  },
  "performance": {
    "max_response_time_ms": 3500
  }
}', ARRAY['performance', 'complex', 'luxury', 'sports_car', 'benchmark']);

-- Insert regional variation dataset (Priority 4) - International and specialty vehicles
INSERT INTO golden_vins (vin, test_category, priority, manufacturer, model_year, make, model, description, complexity_score, expected_results, tags) VALUES

-- Canadian market vehicle
('2HGFC2F5XKH123456', 'regional', 4, 'Honda', 2019, 'Honda', 'Civic', 'Canadian market vehicle with metric specifications', 3, '{
  "decoder": {
    "make": "Honda",
    "model": "Civic",
    "year": 2019,
    "trim": "LX",
    "engine": "2.0L I4",
    "transmission": "CVT",
    "drivetrain": "FWD",
    "fuel_type": "Gasoline",
    "country": "Canada"
  },
  "market_intelligence": {
    "market_score": 82,
    "market_temperature": "warm",
    "sales_momentum": "strong",
    "consumer_interest": "high",
    "price_stability": "stable"
  }
}', ARRAY['canadian', 'regional', 'civic', 'international']),

-- Mexican assembly vehicle
('3FADP4FJ5KM123456', 'regional', 4, 'Ford', 2019, 'Ford', 'Fiesta', 'Mexican assembly compact car', 4, '{
  "decoder": {
    "make": "Ford",
    "model": "Fiesta",
    "year": 2019,
    "trim": "S",
    "engine": "1.6L I4",
    "transmission": "5-Speed Manual",
    "drivetrain": "FWD",
    "fuel_type": "Gasoline",
    "country": "Mexico"
  },
  "market_intelligence": {
    "market_score": 55,
    "market_temperature": "cool",
    "sales_momentum": "weak",
    "consumer_interest": "low",
    "price_stability": "declining"
  }
}', ARRAY['mexican', 'regional', 'compact', 'discontinued']);

-- Insert validation rules for data quality
INSERT INTO validation_rules (rule_name, rule_category, validation_query, expected_result, severity, description, execution_frequency) VALUES

-- Data quality rules
('golden_vins_have_expected_results', 'data_quality', 'SELECT COUNT(*) FROM golden_vins WHERE expected_results IS NULL OR expected_results = ''{}''::jsonb', '0', 'high', 'All golden VINs must have expected results defined', 'daily'),

('golden_vins_unique_constraints', 'data_quality', 'SELECT COUNT(*) - COUNT(DISTINCT vin) FROM golden_vins WHERE is_active = true', '0', 'critical', 'Golden VINs must be unique', 'hourly'),

('qa_test_runs_recent', 'data_quality', 'SELECT CASE WHEN MAX(started_at) > now() - interval ''24 hours'' THEN 1 ELSE 0 END FROM qa_test_runs', '1', 'medium', 'QA tests should run at least daily', 'daily'),

-- Business logic rules
('test_pass_rate_acceptable', 'business_logic', 'SELECT CASE WHEN AVG(CASE WHEN status = ''passed'' THEN 1.0 ELSE 0.0 END) >= 0.85 FROM qa_test_results WHERE created_at > now() - interval ''7 days'' THEN 1 ELSE 0 END', '1', 'high', 'Test pass rate should be at least 85%', 'daily'),

('error_rate_acceptable', 'business_logic', 'SELECT CASE WHEN COUNT(*) <= 100 FROM error_tracking WHERE last_occurred_at > now() - interval ''1 hour'' AND severity IN (''critical'', ''high'') THEN 1 ELSE 0 END', '1', 'critical', 'Critical/high severity errors should be limited', 'hourly'),

-- Performance rules
('response_time_acceptable', 'performance', 'SELECT CASE WHEN AVG(metric_value) <= 2000 FROM operational_metrics WHERE metric_name LIKE ''%response_time%'' AND recorded_at > now() - interval ''1 hour'' THEN 1 ELSE 0 END', '1', 'medium', 'Average response time should be under 2000ms', 'hourly'),

('system_health_good', 'performance', 'SELECT CASE WHEN AVG(metric_value) >= 80 FROM operational_metrics WHERE metric_name = ''system_health_score'' AND recorded_at > now() - interval ''1 hour'' THEN 1 ELSE 0 END', '1', 'high', 'System health score should be at least 80%', 'hourly');

-- Create initial health checks configuration
INSERT INTO health_checks (check_name, check_type, status, check_interval_seconds, threshold_warning, threshold_critical) VALUES
('Database Connection', 'database', 'unknown', 300, 1000, 3000),
('Basic Query Performance', 'database', 'unknown', 300, 1000, 3000),
('Edge Function Availability', 'api', 'unknown', 600, 2000, 5000),
('External API Connectivity', 'external_service', 'unknown', 900, 3000, 10000),
('Data Freshness Check', 'database', 'unknown', 1800, NULL, NULL),
('Error Rate Monitoring', 'performance', 'unknown', 300, NULL, NULL);

-- Add initial operational metrics
INSERT INTO operational_metrics (metric_name, metric_value, metric_unit, category, source_component, metadata) VALUES
('system_initialization_complete', 1, 'boolean', 'usage', 'qa_ops_system', '{"initialization_time": "2025-08-11T20:20:01Z", "golden_vins_loaded": 12, "validation_rules_loaded": 7}'),
('golden_vins_total_count', 12, 'count', 'usage', 'qa_ops_system', '{"categories": {"core": 6, "edge_case": 3, "performance": 2, "regional": 2}}'),
('validation_rules_active_count', 7, 'count', 'usage', 'qa_ops_system', '{"categories": {"data_quality": 3, "business_logic": 2, "performance": 2}}');

-- Add comments for documentation
COMMENT ON TABLE golden_vins IS 'Curated test VIN dataset with expected results for comprehensive QA validation across all system components';

-- Log the initialization
DO $$
BEGIN
    RAISE NOTICE 'Golden VIN dataset initialization completed successfully';
    RAISE NOTICE 'Loaded % golden VINs across % categories', 
        (SELECT COUNT(*) FROM golden_vins), 
        (SELECT COUNT(DISTINCT test_category) FROM golden_vins);
    RAISE NOTICE 'Created % validation rules for ongoing quality assurance', 
        (SELECT COUNT(*) FROM validation_rules);
    RAISE NOTICE 'Configured % health checks for operational monitoring', 
        (SELECT COUNT(*) FROM health_checks);
END $$;
