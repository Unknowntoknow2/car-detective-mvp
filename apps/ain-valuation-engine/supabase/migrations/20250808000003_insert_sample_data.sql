-- AIN Valuation Engine - Sample Data Migration
-- Created: 2025-08-08
-- Description: Inserts sample data for testing and development

-- =====================================================
-- 1. SAMPLE VEHICLE SPECIFICATIONS
-- =====================================================

INSERT INTO vehicle_specs (
    vin, make, model, year, trim, body_class, engine_cylinders, 
    displacement_cc, fuel_type_primary, drive_type, transmission_style,
    manufacturer, plant_country, vehicle_type, doors
) VALUES 
    ('5YFB4MDE8SP33B447', 'TOYOTA', 'RAV4', 2023, 'XLE', 'Sport Utility Vehicle', 4, 2487, 'Gasoline', 'AWD', 'CVT', 'TOYOTA MOTOR MANUFACTURING', 'UNITED STATES (USA)', 'MULTIPURPOSE PASSENGER VEHICLE', 4),
    ('4T1R11AK4RU878557', 'TOYOTA', 'Camry', 2024, 'LE', 'Sedan/Saloon', 4, 2487, 'Gasoline', 'FWD', 'CVT', 'TOYOTA MOTOR MANUFACTURING, KENTUCKY, INC.', 'UNITED STATES (USA)', 'PASSENGER CAR', 4),
    ('1FTEW1CG6HKD46234', 'FORD', 'F-150', 2017, 'XLT', 'Pickup', 6, 3496, 'Gasoline', '4WD', 'Automatic', 'FORD MOTOR COMPANY', 'UNITED STATES (USA)', 'TRUCK', 4),
    ('JM3KFBDM6J0436995', 'MAZDA', 'CX-5', 2018, 'Sport', 'Sport Utility Vehicle', 4, 2488, 'Gasoline', 'AWD', 'Automatic', 'MAZDA MOTOR CORPORATION', 'JAPAN', 'MULTIPURPOSE PASSENGER VEHICLE', 4),
    ('2HKRM4H75NH123456', 'HONDA', 'CR-V', 2022, 'EX', 'Sport Utility Vehicle', 4, 1498, 'Gasoline', 'AWD', 'CVT', 'HONDA OF AMERICA MFG., INC.', 'UNITED STATES (USA)', 'MULTIPURPOSE PASSENGER VEHICLE', 4)
ON CONFLICT (vin) DO NOTHING;

-- =====================================================
-- 2. SAMPLE FUEL ECONOMY DATA
-- =====================================================

INSERT INTO fuel_economy (
    vin, city_mpg, highway_mpg, combined_mpg, annual_fuel_cost, 
    fuel_type, epa_id, co2_emissions, greenhouse_score
) VALUES 
    ('5YFB4MDE8SP33B447', 27.0, 35.0, 30.0, 1650.00, 'Gasoline', 'EPA001', 296.0, 6),
    ('4T1R11AK4RU878557', 28.0, 39.0, 32.0, 1550.00, 'Gasoline', 'EPA002', 278.0, 7),
    ('1FTEW1CG6HKD46234', 19.0, 25.0, 21.0, 2380.00, 'Gasoline', 'EPA003', 423.0, 3),
    ('JM3KFBDM6J0436995', 25.0, 31.0, 27.0, 1850.00, 'Gasoline', 'EPA004', 329.0, 5),
    ('2HKRM4H75NH123456', 28.0, 34.0, 30.0, 1650.00, 'Gasoline', 'EPA005', 296.0, 6)
ON CONFLICT (vin) DO NOTHING;

-- =====================================================
-- 3. SAMPLE SAFETY RATINGS
-- =====================================================

INSERT INTO nhtsa_safety_ratings (
    vin, overall_rating, frontal_crash_rating, side_crash_rating, 
    rollover_rating, model_year, vehicle_description, nhtsa_id
) VALUES 
    ('5YFB4MDE8SP33B447', 5, 5, 5, 4, 2023, '2023 Toyota RAV4 4 DR AWD', 'NHTSA001'),
    ('4T1R11AK4RU878557', 5, 5, 5, 5, 2024, '2024 Toyota Camry 4 DR FWD', 'NHTSA002'),
    ('1FTEW1CG6HKD46234', 4, 4, 5, 3, 2017, '2017 Ford F-150 Pickup 4WD', 'NHTSA003'),
    ('JM3KFBDM6J0436995', 5, 5, 5, 4, 2018, '2018 Mazda CX-5 4 DR AWD', 'NHTSA004'),
    ('2HKRM4H75NH123456', 5, 5, 5, 4, 2022, '2022 Honda CR-V 4 DR AWD', 'NHTSA005')
ON CONFLICT (vin) DO NOTHING;

-- =====================================================
-- 4. SAMPLE MARKET LISTINGS
-- =====================================================

INSERT INTO market_listings (
    vin, listing_price, mileage, location, zip_code, source, 
    dealer_name, is_dealer, condition, title_status, 
    exterior_color, interior_color, listed_at
) VALUES 
    -- RAV4 Listings
    ('5YFB4MDE8SP33B447', 32500.00, 15000, 'Los Angeles, CA', '90210', 'autotrader', 'Toyota of Hollywood', true, 'excellent', 'clean', 'Blueprint', 'Black', NOW() - INTERVAL '5 days'),
    (NULL, 31800.00, 18000, 'San Diego, CA', '92101', 'cars.com', 'Quality Motors', true, 'very_good', 'clean', 'Magnetic Gray Metallic', 'Black', NOW() - INTERVAL '12 days'),
    (NULL, 33200.00, 12000, 'San Francisco, CA', '94102', 'cargurus', NULL, false, 'excellent', 'clean', 'Blueprint', 'Ash', NOW() - INTERVAL '3 days'),
    
    -- Camry Listings  
    ('4T1R11AK4RU878557', 28900.00, 8000, 'Phoenix, AZ', '85001', 'autotrader', 'Bell Toyota', true, 'excellent', 'clean', 'Wind Chill Pearl', 'Black', NOW() - INTERVAL '7 days'),
    (NULL, 27500.00, 12000, 'Las Vegas, NV', '89101', 'cars.com', 'Desert Toyota', true, 'good', 'clean', 'Celestial Silver Metallic', 'Black', NOW() - INTERVAL '15 days'),
    
    -- F-150 Listings
    ('1FTEW1CG6HKD46234', 24900.00, 65000, 'Dallas, TX', '75201', 'autotrader', 'Trucks Plus', true, 'good', 'clean', 'Magnetic Metallic', 'Medium Earth Gray', NOW() - INTERVAL '8 days'),
    (NULL, 26500.00, 58000, 'Austin, TX', '73301', 'cars.com', NULL, false, 'very_good', 'clean', 'Oxford White', 'Medium Earth Gray', NOW() - INTERVAL '4 days'),
    (NULL, 23800.00, 72000, 'Houston, TX', '77001', 'cargurus', 'Ford Country', true, 'fair', 'clean', 'Magnetic Metallic', 'Medium Earth Gray', NOW() - INTERVAL '20 days'),
    
    -- CX-5 Listings
    ('JM3KFBDM6J0436995', 22900.00, 42000, 'Seattle, WA', '98101', 'autotrader', 'Mazda of Seattle', true, 'good', 'clean', 'Soul Red Crystal Metallic', 'Black', NOW() - INTERVAL '6 days'),
    (NULL, 21800.00, 48000, 'Portland, OR', '97201', 'cars.com', NULL, false, 'good', 'clean', 'Machine Gray Metallic', 'Black', NOW() - INTERVAL '11 days'),
    
    -- CR-V Listings
    ('2HKRM4H75NH123456', 29500.00, 25000, 'Denver, CO', '80201', 'autotrader', 'Mile High Honda', true, 'excellent', 'clean', 'Radiant Red Metallic', 'Gray', NOW() - INTERVAL '2 days'),
    (NULL, 28900.00, 28000, 'Colorado Springs, CO', '80901', 'cars.com', 'Peak Honda', true, 'very_good', 'clean', 'Platinum White Pearl', 'Gray', NOW() - INTERVAL '9 days')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. SAMPLE FOLLOW-UP ANSWERS
-- =====================================================

INSERT INTO follow_up_answers (
    vin, session_id, mileage, zip_code, condition, 
    exterior_color, interior_color, title_status, 
    accidents, features, additional_notes, valuation_requested
) VALUES 
    ('5YFB4MDE8SP33B447', 'sess_001', 15500, '90210', 'excellent', 'Blueprint', 'Black', 'clean', 
     '[]'::jsonb, 
     '{"sunroof": true, "navigation": true, "heated_seats": true, "backup_camera": true}'::jsonb,
     'Garage kept, regular maintenance', true),
     
    ('4T1R11AK4RU878557', 'sess_002', 8200, '85001', 'excellent', 'Wind Chill Pearl', 'Black', 'clean',
     '[]'::jsonb,
     '{"navigation": true, "premium_audio": true, "toyota_safety_sense": true}'::jsonb,
     'Purchased new, dealer maintained', true),
     
    ('1FTEW1CG6HKD46234', 'sess_003', 65200, '75201', 'good', 'Magnetic Metallic', 'Medium Earth Gray', 'clean',
     '[{"date": "2022-03-15", "severity": "minor", "description": "Parking lot fender bender"}]'::jsonb,
     '{"tow_package": true, "bed_liner": true, "running_boards": true}'::jsonb,
     'Work truck, well maintained', true),
     
    ('JM3KFBDM6J0436995', 'sess_004', 42500, '98101', 'good', 'Soul Red Crystal Metallic', 'Black', 'clean',
     '[]'::jsonb,
     '{"awd": true, "backup_camera": true, "bluetooth": true}'::jsonb,
     'Single owner, highway miles', true),
     
    ('2HKRM4H75NH123456', 'sess_005', 25200, '80201', 'excellent', 'Radiant Red Metallic', 'Gray', 'clean',
     '[]'::jsonb,
     '{"honda_sensing": true, "sunroof": true, "heated_seats": true, "remote_start": true}'::jsonb,
     'Like new condition, low miles', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 6. SAMPLE VALUATION HISTORY
-- =====================================================

INSERT INTO valuation_history (
    vin, session_id, estimated_value, confidence_score, 
    price_range_low, price_range_high, valuation_mode,
    input_data, adjustments, comparables_count, 
    data_quality_score, explanation
) VALUES 
    ('5YFB4MDE8SP33B447', 'sess_001', 32800.00, 88.5, 31200.00, 34400.00, 'market',
     '{"mileage": 15500, "condition": "excellent", "location": "90210"}'::jsonb,
     '[{"type": "condition", "adjustment": 1600, "explanation": "Excellent condition premium"}]'::jsonb,
     24, 92.0, 'Based on 24 comparable vehicles in your area. Excellent condition and low mileage for year result in above-average valuation.'),
     
    ('4T1R11AK4RU878557', 'sess_002', 29200.00, 91.2, 27800.00, 30600.00, 'market',
     '{"mileage": 8200, "condition": "excellent", "location": "85001"}'::jsonb,
     '[{"type": "mileage", "adjustment": 1200, "explanation": "Very low mileage premium"}]'::jsonb,
     18, 94.5, 'Based on 18 comparable vehicles. Extremely low mileage and excellent condition command premium pricing.'),
     
    ('1FTEW1CG6HKD46234', 'sess_003', 25100.00, 82.0, 23200.00, 27000.00, 'market',
     '{"mileage": 65200, "condition": "good", "location": "75201"}'::jsonb,
     '[{"type": "mileage", "adjustment": -800, "explanation": "Higher mileage adjustment"}, {"type": "accident", "adjustment": -400, "explanation": "Minor accident history"}]'::jsonb,
     31, 88.0, 'Based on 31 comparable vehicles. Higher mileage and minor accident history factored into valuation.'),
     
    ('JM3KFBDM6J0436995', 'sess_004', 23200.00, 86.0, 21800.00, 24600.00, 'market',
     '{"mileage": 42500, "condition": "good", "location": "98101"}'::jsonb,
     '[{"type": "mileage", "adjustment": 200, "explanation": "Average mileage for year"}]'::jsonb,
     15, 85.0, 'Based on 15 comparable vehicles. Mileage and condition align well with market expectations.'),
     
    ('2HKRM4H75NH123456', 'sess_005', 30100.00, 89.5, 28600.00, 31600.00, 'market',
     '{"mileage": 25200, "condition": "excellent", "location": "80201"}'::jsonb,
     '[{"type": "condition", "adjustment": 1100, "explanation": "Excellent condition premium"}, {"type": "mileage", "adjustment": 300, "explanation": "Low mileage for year"}]'::jsonb,
     22, 91.0, 'Based on 22 comparable vehicles. Excellent condition and below-average mileage result in strong market position.')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 7. SAMPLE FUEL PRICE HISTORY
-- =====================================================

INSERT INTO fuel_price_history (region, fuel_type, price_per_gallon, price_date, source) VALUES 
    ('US_NATIONAL', 'Regular_Gasoline', 3.45, CURRENT_DATE, 'EIA'),
    ('US_NATIONAL', 'Regular_Gasoline', 3.48, CURRENT_DATE - 1, 'EIA'),
    ('US_NATIONAL', 'Regular_Gasoline', 3.42, CURRENT_DATE - 2, 'EIA'),
    ('US_NATIONAL', 'Regular_Gasoline', 3.40, CURRENT_DATE - 3, 'EIA'),
    ('US_NATIONAL', 'Regular_Gasoline', 3.38, CURRENT_DATE - 4, 'EIA'),
    ('US_NATIONAL', 'Regular_Gasoline', 3.35, CURRENT_DATE - 5, 'EIA'),
    ('US_NATIONAL', 'Regular_Gasoline', 3.33, CURRENT_DATE - 6, 'EIA'),
    
    -- Regional variations
    ('CA', 'Regular_Gasoline', 4.15, CURRENT_DATE, 'EIA'),
    ('TX', 'Regular_Gasoline', 3.05, CURRENT_DATE, 'EIA'),
    ('NY', 'Regular_Gasoline', 3.65, CURRENT_DATE, 'EIA'),
    ('FL', 'Regular_Gasoline', 3.25, CURRENT_DATE, 'EIA')
ON CONFLICT (region, fuel_type, price_date) DO NOTHING;

-- =====================================================
-- 8. REFRESH MATERIALIZED VIEW
-- =====================================================

-- Refresh the materialized view to include sample data
REFRESH MATERIALIZED VIEW vehicle_profiles;

-- =====================================================
-- 9. VERIFICATION QUERIES
-- =====================================================

-- These are for testing - comment out for production
/*
SELECT 'Vehicle Profiles Count' as test, COUNT(*) as result FROM vehicle_profiles;
SELECT 'Market Listings Count' as test, COUNT(*) as result FROM market_listings;
SELECT 'Valuations Count' as test, COUNT(*) as result FROM valuation_history;

-- Test comparable vehicles function
SELECT 'Comparable Vehicles Test' as test, COUNT(*) as result 
FROM get_comparable_vehicles('5YFB4MDE8SP33B447', 3, 10, 150);

-- Test market statistics function
SELECT 'Market Stats Test' as test, 
       (get_market_statistics('TOYOTA', 'RAV4', 2023, 2)->>'listing_count')::int as result;
*/
