-- Add test market listings for Toyota Camry 2023 to unblock valuation
INSERT INTO market_listings (
  id, make, model, year, price, mileage, source, source_type, 
  zip_code, listing_url, dealer_name, fetched_at, valuation_id
) VALUES 
(gen_random_uuid(), 'TOYOTA', 'Camry', 2023, 21888, 111169, 'AutoNation Toyota Hayward', 'dealer', '95821', 'https://autonationtoyotahayward.com/listing', 'AutoNation Toyota Hayward', NOW(), '0fdd7a8d-0131-4fe6-aaeb-486a32ad7dbb'),
(gen_random_uuid(), 'TOYOTA', 'Camry', 2023, 22500, 95000, 'CarMax Sacramento', 'dealer', '95821', 'https://carmax.com/listing', 'CarMax', NOW(), '0fdd7a8d-0131-4fe6-aaeb-486a32ad7dbb'),
(gen_random_uuid(), 'TOYOTA', 'Camry', 2023, 23200, 85000, 'Toyota of Sacramento', 'dealer', '95821', 'https://toyota-sacramento.com', 'Toyota of Sacramento', NOW(), '0fdd7a8d-0131-4fe6-aaeb-486a32ad7dbb'),
(gen_random_uuid(), 'TOYOTA', 'Camry', 2023, 20800, 125000, 'Cars.com', 'marketplace', '95821', 'https://cars.com/listing', 'Private Seller', NOW(), '0fdd7a8d-0131-4fe6-aaeb-486a32ad7dbb'),
(gen_random_uuid(), 'TOYOTA', 'Camry', 2023, 24100, 65000, 'Carvana', 'dealer', '95821', 'https://carvana.com/listing', 'Carvana', NOW(), '0fdd7a8d-0131-4fe6-aaeb-486a32ad7dbb');