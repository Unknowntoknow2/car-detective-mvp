-- Create a test valuation and related market listings for forecast testing
WITH test_valuation AS (
  INSERT INTO valuations (
    vin, 
    make, 
    model, 
    year, 
    mileage, 
    estimated_value, 
    confidence_score, 
    state, 
    value_breakdown,
    market_data
  ) VALUES (
    'JH4DC54855S008363',
    'Honda',
    'Civic', 
    2019,
    45000,
    14000,
    78,
    '10001',
    '{"baseValue": 16000, "finalValue": 14000, "adjustments": [{"label": "Mileage", "amount": -2000, "reason": "45,000 miles"}]}'::jsonb,
    '{"listingCount": 0, "listingRange": {"min": 12000, "max": 16000}, "source": "test_data"}'::jsonb
  )
  RETURNING id
)
INSERT INTO market_listings (make, model, price, listing_date, source, source_type, valuation_id, fetched_at)
SELECT 
  'Honda', 
  'Civic', 
  price,
  listing_date::timestamp with time zone,
  'test_data',
  'franchise_dealer',
  test_valuation.id,
  now()
FROM test_valuation,
(VALUES 
  (14500, '2024-02-15'),
  (13800, '2024-03-10'),
  (14200, '2024-04-05'),
  (13900, '2024-05-20'),
  (14100, '2024-06-12'),
  (13700, '2024-07-08'),
  (14000, '2024-08-03'),
  (13600, '2024-09-15'),
  (13950, '2024-10-22'),
  (13500, '2024-11-18'),
  (13850, '2024-12-05'),
  (13400, '2025-01-10')
) AS market_data(price, listing_date);