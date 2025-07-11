-- Add additional test data using the existing valuation ID
INSERT INTO market_listings (
  valuation_id, make, model, year, price, mileage, source, listing_url, 
  listing_date, created_at, fetched_at
) VALUES 
('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Toyota', 'Camry', 2020, 22500, 35000, 'autotrader', 'https://autotrader.com/camry1', '2024-01-08', NOW(), NOW()),
('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Toyota', 'Camry', 2019, 20800, 45000, 'cargurus', 'https://cargurus.com/camry2', '2024-02-14', NOW(), NOW()),
('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Toyota', 'Camry', 2021, 24200, 28000, 'cars.com', 'https://cars.com/camry3', '2024-03-22', NOW(), NOW()),
('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Ford', 'F-150', 2020, 32500, 55000, 'autotrader', 'https://autotrader.com/f150-1', '2024-01-20', NOW(), NOW()),
('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Ford', 'F-150', 2019, 29800, 65000, 'cargurus', 'https://cargurus.com/f150-2', '2024-02-28', NOW(), NOW()),
('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'BMW', '3 Series', 2020, 28500, 42000, 'autotrader', 'https://autotrader.com/bmw1', '2024-01-12', NOW(), NOW()),
('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'BMW', '3 Series', 2019, 25800, 55000, 'cargurus', 'https://cargurus.com/bmw2', '2024-02-25', NOW(), NOW())