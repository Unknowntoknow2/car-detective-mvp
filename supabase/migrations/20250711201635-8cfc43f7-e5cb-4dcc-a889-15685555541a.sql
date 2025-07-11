-- Seed market_listings with realistic test data for common vehicles
INSERT INTO market_listings (
  valuation_id, make, model, year, price, mileage, source, listing_url, 
  listing_date, created_at, fetched_at
) VALUES 
-- Honda Civic data (expanding existing)
('00000000-0000-0000-0000-000000000001', 'Honda', 'Civic', 2020, 15500, 45000, 'autotrader', 'https://autotrader.com/listing1', '2024-01-15', NOW(), NOW()),
('00000000-0000-0000-0000-000000000001', 'Honda', 'Civic', 2020, 15800, 42000, 'cargurus', 'https://cargurus.com/listing2', '2024-02-20', NOW(), NOW()),
('00000000-0000-0000-0000-000000000001', 'Honda', 'Civic', 2019, 14200, 55000, 'cars.com', 'https://cars.com/listing3', '2024-03-10', NOW(), NOW()),
('00000000-0000-0000-0000-000000000001', 'Honda', 'Civic', 2021, 17300, 35000, 'autotrader', 'https://autotrader.com/listing4', '2024-04-05', NOW(), NOW()),
('00000000-0000-0000-0000-000000000001', 'Honda', 'Civic', 2020, 16100, 48000, 'cargurus', 'https://cargurus.com/listing5', '2024-05-12', NOW(), NOW()),

-- Toyota Camry data
('00000000-0000-0000-0000-000000000002', 'Toyota', 'Camry', 2020, 22500, 35000, 'autotrader', 'https://autotrader.com/camry1', '2024-01-08', NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', 'Toyota', 'Camry', 2019, 20800, 45000, 'cargurus', 'https://cargurus.com/camry2', '2024-02-14', NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', 'Toyota', 'Camry', 2021, 24200, 28000, 'cars.com', 'https://cars.com/camry3', '2024-03-22', NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', 'Toyota', 'Camry', 2020, 23100, 38000, 'autotrader', 'https://autotrader.com/camry4', '2024-04-18', NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', 'Toyota', 'Camry', 2019, 21500, 42000, 'cargurus', 'https://cargurus.com/camry5', '2024-05-25', NOW(), NOW()),

-- Ford F-150 data  
('00000000-0000-0000-0000-000000000003', 'Ford', 'F-150', 2020, 32500, 55000, 'autotrader', 'https://autotrader.com/f150-1', '2024-01-20', NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', 'Ford', 'F-150', 2019, 29800, 65000, 'cargurus', 'https://cargurus.com/f150-2', '2024-02-28', NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', 'Ford', 'F-150', 2021, 35200, 45000, 'cars.com', 'https://cars.com/f150-3', '2024-03-15', NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', 'Ford', 'F-150', 2020, 33800, 52000, 'autotrader', 'https://autotrader.com/f150-4', '2024-04-22', NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', 'Ford', 'F-150', 2019, 30500, 58000, 'cargurus', 'https://cargurus.com/f150-5', '2024-05-30', NOW(), NOW()),

-- BMW 3 Series data
('00000000-0000-0000-0000-000000000004', 'BMW', '3 Series', 2020, 28500, 42000, 'autotrader', 'https://autotrader.com/bmw1', '2024-01-12', NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', 'BMW', '3 Series', 2019, 25800, 55000, 'cargurus', 'https://cargurus.com/bmw2', '2024-02-25', NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', 'BMW', '3 Series', 2021, 31200, 35000, 'cars.com', 'https://cars.com/bmw3', '2024-03-18', NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', 'BMW', '3 Series', 2020, 29800, 48000, 'autotrader', 'https://autotrader.com/bmw4', '2024-04-10', NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', 'BMW', '3 Series', 2019, 26500, 52000, 'cargurus', 'https://cargurus.com/bmw5', '2024-05-15', NOW(), NOW())