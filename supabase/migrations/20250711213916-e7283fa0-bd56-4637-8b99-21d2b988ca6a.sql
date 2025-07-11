-- Add the real market listing you provided to improve valuation accuracy
INSERT INTO market_listings (
  valuation_id,
  make,
  model,
  year,
  mileage,
  price,
  source,
  source_type,
  location,
  listing_url,
  condition,
  created_at,
  fetched_at
) VALUES (
  '5c0cecfd-b51d-4bf9-806e-eb1c645b1a4b',
  'TOYOTA',
  'Camry',
  2019,
  122615,
  15840,
  'Hoblit Chrysler Dodge Jeep Ram',
  'dealer',
  'Woodland, CA 95695',
  'https://www.hoblitcdjr.com/used-2019-toyota-camry-l-sedan',
  'good',
  now(),
  now()
);