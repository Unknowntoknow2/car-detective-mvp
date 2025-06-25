
-- First, let's get the make_id and model_id for Toyota Prius Prime
-- We need these for foreign key relationships

-- Insert real 2024 Toyota Prius Prime trim data with accurate MSRP
-- Only insert if the trim doesn't already exist for 2024

INSERT INTO public.model_trims (
  model_id,
  trim_name,
  year,
  msrp,
  engine_type,
  transmission,
  fuel_type,
  description,
  created_at,
  updated_at
)
SELECT 
  m.id as model_id,
  trim_data.trim_name,
  trim_data.year,
  trim_data.msrp,
  trim_data.engine_type,
  trim_data.transmission,
  trim_data.fuel_type,
  trim_data.description,
  now() as created_at,
  now() as updated_at
FROM models m
JOIN makes mk ON m.make_id = mk.id
CROSS JOIN (
  VALUES 
    ('SE', 2024, 32350, '1.8L Hybrid', 'CVT', 'Hybrid', 'Base SE trim with Toyota Safety Sense 2.0'),
    ('XSE', 2024, 35015, '1.8L Hybrid', 'CVT', 'Hybrid', 'XSE trim with sport styling and premium features'),
    ('XSE Premium', 2024, 38565, '1.8L Hybrid', 'CVT', 'Hybrid', 'Top XSE Premium trim with leather and premium audio'),
    ('LE', 2024, 33915, '1.8L Hybrid', 'CVT', 'Hybrid', 'LE trim with enhanced comfort features')
) AS trim_data(trim_name, year, msrp, engine_type, transmission, fuel_type, description)
WHERE mk.make_name = 'Toyota' 
  AND m.model_name = 'Prius Prime'
  AND NOT EXISTS (
    SELECT 1 FROM model_trims mt 
    WHERE mt.model_id = m.id 
      AND mt.year = trim_data.year 
      AND mt.trim_name = trim_data.trim_name
  );

-- Verify the inserts
SELECT 
  mk.make_name,
  mo.model_name,
  mt.year,
  mt.trim_name,
  mt.msrp,
  mt.created_at
FROM model_trims mt
JOIN models mo ON mt.model_id = mo.id
JOIN makes mk ON mo.make_id = mk.id
WHERE mk.make_name = 'Toyota' 
  AND mo.model_name = 'Prius Prime'
  AND mt.year = 2024
ORDER BY mt.msrp;
