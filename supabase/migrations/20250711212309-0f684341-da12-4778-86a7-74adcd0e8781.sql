-- Create a simple test valuation for forecast testing
INSERT INTO valuations (
  vin, 
  make, 
  model, 
  year, 
  mileage, 
  estimated_value, 
  confidence_score, 
  state
) VALUES (
  'JH4DC54855S008363',
  'Honda',
  'Civic', 
  2019,
  45000,
  14000,
  78,
  '10001'
);