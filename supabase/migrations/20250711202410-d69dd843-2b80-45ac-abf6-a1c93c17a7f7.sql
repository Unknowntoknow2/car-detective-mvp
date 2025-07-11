-- Add seed data using a UUID that doesn't require foreign key constraint
-- First let's get a valid valuation_id or create test data without FK constraint temporarily

INSERT INTO market_listings (
  valuation_id, make, model, year, price, mileage, source, listing_url, 
  listing_date, created_at, fetched_at
) 
SELECT 
  id as valuation_id,
  'Toyota' as make,
  'Camry' as model,
  2020 as year,
  22500 as price,
  35000 as mileage,
  'autotrader' as source,
  'https://autotrader.com/camry1' as listing_url,
  '2024-01-08'::timestamp as listing_date,
  NOW() as created_at,
  NOW() as fetched_at
FROM valuations 
LIMIT 1

UNION ALL

SELECT 
  id as valuation_id,
  'Toyota' as make,
  'Camry' as model,
  2019 as year,
  20800 as price,
  45000 as mileage,
  'cargurus' as source,
  'https://cargurus.com/camry2' as listing_url,
  '2024-02-14'::timestamp as listing_date,
  NOW() as created_at,
  NOW() as fetched_at
FROM valuations 
LIMIT 1

UNION ALL

SELECT 
  id as valuation_id,
  'Ford' as make,
  'F-150' as model,
  2020 as year,
  32500 as price,
  55000 as mileage,
  'autotrader' as source,
  'https://autotrader.com/f150-1' as listing_url,
  '2024-01-20'::timestamp as listing_date,
  NOW() as created_at,
  NOW() as fetched_at
FROM valuations 
LIMIT 1