-- Add test market listings data without foreign key constraint
INSERT INTO market_listings (make, model, price, listing_date, source, source_type, fetched_at) VALUES
-- Honda Civic data for the last 12 months (without valuation_id)
('Honda', 'Civic', 14500, '2024-02-15', 'test_data', 'franchise_dealer', now()),
('Honda', 'Civic', 13800, '2024-03-10', 'test_data', 'franchise_dealer', now()),
('Honda', 'Civic', 14200, '2024-04-05', 'test_data', 'franchise_dealer', now()),
('Honda', 'Civic', 13900, '2024-05-20', 'test_data', 'franchise_dealer', now()),
('Honda', 'Civic', 14100, '2024-06-12', 'test_data', 'franchise_dealer', now()),
('Honda', 'Civic', 13700, '2024-07-08', 'test_data', 'franchise_dealer', now()),
('Honda', 'Civic', 14000, '2024-08-03', 'test_data', 'franchise_dealer', now()),
('Honda', 'Civic', 13600, '2024-09-15', 'test_data', 'franchise_dealer', now()),
('Honda', 'Civic', 13950, '2024-10-22', 'test_data', 'franchise_dealer', now()),
('Honda', 'Civic', 13500, '2024-11-18', 'test_data', 'franchise_dealer', now()),
('Honda', 'Civic', 13850, '2024-12-05', 'test_data', 'franchise_dealer', now()),
('Honda', 'Civic', 13400, '2025-01-10', 'test_data', 'franchise_dealer', now()),

-- Toyota Camry data for the last 12 months  
('Toyota', 'Camry', 18500, '2024-02-20', 'test_data', 'franchise_dealer', now()),
('Toyota', 'Camry', 18200, '2024-03-15', 'test_data', 'franchise_dealer', now()),
('Toyota', 'Camry', 18800, '2024-04-10', 'test_data', 'franchise_dealer', now()),
('Toyota', 'Camry', 18300, '2024-05-25', 'test_data', 'franchise_dealer', now()),
('Toyota', 'Camry', 18600, '2024-06-18', 'test_data', 'franchise_dealer', now()),
('Toyota', 'Camry', 18100, '2024-07-12', 'test_data', 'franchise_dealer', now()),
('Toyota', 'Camry', 18400, '2024-08-08', 'test_data', 'franchise_dealer', now()),
('Toyota', 'Camry', 18000, '2024-09-20', 'test_data', 'franchise_dealer', now()),
('Toyota', 'Camry', 18350, '2024-10-28', 'test_data', 'franchise_dealer', now()),
('Toyota', 'Camry', 17900, '2024-11-25', 'test_data', 'franchise_dealer', now()),
('Toyota', 'Camry', 18250, '2024-12-12', 'test_data', 'franchise_dealer', now()),
('Toyota', 'Camry', 17800, '2025-01-15', 'test_data', 'franchise_dealer', now()),

-- Ford F-150 data for the last 12 months
('Ford', 'F-150', 25500, '2024-02-25', 'test_data', 'franchise_dealer', now()),
('Ford', 'F-150', 25800, '2024-03-20', 'test_data', 'franchise_dealer', now()),
('Ford', 'F-150', 25200, '2024-04-15', 'test_data', 'franchise_dealer', now()),
('Ford', 'F-150', 25600, '2024-05-30', 'test_data', 'franchise_dealer', now()),
('Ford', 'F-150', 25100, '2024-06-22', 'test_data', 'franchise_dealer', now()),
('Ford', 'F-150', 25400, '2024-07-18', 'test_data', 'franchise_dealer', now()),
('Ford', 'F-150', 25000, '2024-08-12', 'test_data', 'franchise_dealer', now()),
('Ford', 'F-150', 25300, '2024-09-25', 'test_data', 'franchise_dealer', now()),
('Ford', 'F-150', 24900, '2024-10-30', 'test_data', 'franchise_dealer', now()),
('Ford', 'F-150', 25150, '2024-11-28', 'test_data', 'franchise_dealer', now()),
('Ford', 'F-150', 24800, '2024-12-18', 'test_data', 'franchise_dealer', now()),
('Ford', 'F-150', 25050, '2025-01-20', 'test_data', 'franchise_dealer', now());