-- Seed proper historical market data for forecast system
INSERT INTO market_listings (valuation_id, make, model, price, listing_date, mileage, condition, location, source, source_type, fetched_at) VALUES
  -- Honda Civic data over 12 months (ascending chronological order)
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Honda', 'Civic', 16200, '2024-01-15', 45000, 'good', 'Los Angeles, CA', 'autotrader', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Honda', 'Civic', 16800, '2024-02-10', 42000, 'good', 'Orange County, CA', 'cars.com', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Honda', 'Civic', 15900, '2024-03-08', 48000, 'fair', 'San Diego, CA', 'cargurus', 'private', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Honda', 'Civic', 16500, '2024-04-12', 44000, 'good', 'Riverside, CA', 'autotrader', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Honda', 'Civic', 16100, '2024-05-18', 46000, 'good', 'San Bernardino, CA', 'cars.com', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Honda', 'Civic', 15700, '2024-06-25', 49000, 'fair', 'Ventura, CA', 'autotrader', 'private', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Honda', 'Civic', 15400, '2024-07-30', 51000, 'fair', 'Bakersfield, CA', 'cargurus', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Honda', 'Civic', 15200, '2024-08-15', 52000, 'good', 'Fresno, CA', 'cars.com', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Honda', 'Civic', 14900, '2024-09-20', 54000, 'fair', 'Stockton, CA', 'autotrader', 'private', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Honda', 'Civic', 14600, '2024-10-10', 55000, 'good', 'Modesto, CA', 'cargurus', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Honda', 'Civic', 14300, '2024-11-18', 57000, 'fair', 'Sacramento, CA', 'cars.com', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Honda', 'Civic', 14000, '2024-12-05', 58000, 'good', 'San Jose, CA', 'autotrader', 'dealer', now()),
  
  -- Toyota Camry data over 12 months  
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Toyota', 'Camry', 24800, '2024-01-20', 35000, 'excellent', 'Los Angeles, CA', 'autotrader', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Toyota', 'Camry', 25200, '2024-02-15', 33000, 'excellent', 'Orange County, CA', 'cars.com', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Toyota', 'Camry', 24600, '2024-03-10', 36000, 'good', 'San Diego, CA', 'cargurus', 'private', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Toyota', 'Camry', 24400, '2024-04-18', 37000, 'good', 'Riverside, CA', 'autotrader', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Toyota', 'Camry', 24100, '2024-05-25', 38000, 'good', 'San Bernardino, CA', 'cars.com', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Toyota', 'Camry', 23800, '2024-06-30', 39000, 'fair', 'Ventura, CA', 'autotrader', 'private', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Toyota', 'Camry', 23500, '2024-07-22', 40000, 'good', 'Bakersfield, CA', 'cargurus', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Toyota', 'Camry', 23200, '2024-08-28', 41000, 'good', 'Fresno, CA', 'cars.com', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Toyota', 'Camry', 22900, '2024-09-15', 42000, 'fair', 'Stockton, CA', 'autotrader', 'private', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Toyota', 'Camry', 22600, '2024-10-20', 43000, 'good', 'Modesto, CA', 'cargurus', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Toyota', 'Camry', 22300, '2024-11-25', 44000, 'good', 'Sacramento, CA', 'cars.com', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Toyota', 'Camry', 22000, '2024-12-10', 45000, 'fair', 'San Jose, CA', 'autotrader', 'dealer', now()),
  
  -- Ford F-150 data over 12 months
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Ford', 'F-150', 33500, '2024-01-25', 25000, 'excellent', 'Los Angeles, CA', 'autotrader', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Ford', 'F-150', 33800, '2024-02-20', 24000, 'excellent', 'Orange County, CA', 'cars.com', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Ford', 'F-150', 33200, '2024-03-15', 26000, 'good', 'San Diego, CA', 'cargurus', 'private', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Ford', 'F-150', 32900, '2024-04-22', 27000, 'good', 'Riverside, CA', 'autotrader', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Ford', 'F-150', 32600, '2024-05-30', 28000, 'good', 'San Bernardino, CA', 'cars.com', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Ford', 'F-150', 32300, '2024-06-18', 29000, 'fair', 'Ventura, CA', 'autotrader', 'private', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Ford', 'F-150', 32000, '2024-07-25', 30000, 'good', 'Bakersfield, CA', 'cargurus', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Ford', 'F-150', 31700, '2024-08-12', 31000, 'good', 'Fresno, CA', 'cars.com', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Ford', 'F-150', 31400, '2024-09-28', 32000, 'fair', 'Stockton, CA', 'autotrader', 'private', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Ford', 'F-150', 31100, '2024-10-15', 33000, 'good', 'Modesto, CA', 'cargurus', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Ford', 'F-150', 30800, '2024-11-20', 34000, 'good', 'Sacramento, CA', 'cars.com', 'dealer', now()),
  ('7cd2c8d5-2cb1-4cd2-b754-c9d25b83937b', 'Ford', 'F-150', 30500, '2024-12-15', 35000, 'fair', 'San Jose, CA', 'autotrader', 'dealer', now());