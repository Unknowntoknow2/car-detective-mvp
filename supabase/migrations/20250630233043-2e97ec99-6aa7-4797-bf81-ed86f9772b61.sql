
-- Add MSRP column to model_trims table
ALTER TABLE model_trims ADD COLUMN IF NOT EXISTS msrp NUMERIC;

-- Add some realistic MSRP data for common makes/models/years as placeholders
-- Toyota models
UPDATE model_trims 
SET msrp = CASE 
  WHEN trim_name ILIKE '%camry%' THEN 25000 + (year - 2020) * 500
  WHEN trim_name ILIKE '%corolla%' THEN 22000 + (year - 2020) * 400
  WHEN trim_name ILIKE '%prius%' THEN 28000 + (year - 2020) * 600
  WHEN trim_name ILIKE '%highlander%' THEN 35000 + (year - 2020) * 800
  WHEN trim_name ILIKE '%rav4%' THEN 30000 + (year - 2020) * 700
  ELSE 27000 + (year - 2020) * 500
END
WHERE model_id IN (
  SELECT m.id FROM models m 
  JOIN makes mk ON m.make_id = mk.id 
  WHERE mk.make_name = 'Toyota'
) AND msrp IS NULL;

-- Honda models
UPDATE model_trims 
SET msrp = CASE 
  WHEN trim_name ILIKE '%accord%' THEN 26000 + (year - 2020) * 500
  WHEN trim_name ILIKE '%civic%' THEN 23000 + (year - 2020) * 400
  WHEN trim_name ILIKE '%cr-v%' THEN 28000 + (year - 2020) * 600
  WHEN trim_name ILIKE '%pilot%' THEN 36000 + (year - 2020) * 800
  ELSE 26000 + (year - 2020) * 500
END
WHERE model_id IN (
  SELECT m.id FROM models m 
  JOIN makes mk ON m.make_id = mk.id 
  WHERE mk.make_name = 'Honda'
) AND msrp IS NULL;

-- BMW models (premium pricing)
UPDATE model_trims 
SET msrp = CASE 
  WHEN trim_name ILIKE '%3 series%' OR trim_name ILIKE '%320%' OR trim_name ILIKE '%330%' THEN 42000 + (year - 2020) * 1000
  WHEN trim_name ILIKE '%5 series%' OR trim_name ILIKE '%530%' OR trim_name ILIKE '%540%' THEN 55000 + (year - 2020) * 1200
  WHEN trim_name ILIKE '%x3%' THEN 45000 + (year - 2020) * 1000
  WHEN trim_name ILIKE '%x5%' THEN 60000 + (year - 2020) * 1200
  ELSE 50000 + (year - 2020) * 1000
END
WHERE model_id IN (
  SELECT m.id FROM models m 
  JOIN makes mk ON m.make_id = mk.id 
  WHERE mk.make_name = 'BMW'
) AND msrp IS NULL;

-- Mercedes-Benz models (premium pricing)
UPDATE model_trims 
SET msrp = CASE 
  WHEN trim_name ILIKE '%c-class%' OR trim_name ILIKE '%c300%' THEN 43000 + (year - 2020) * 1000
  WHEN trim_name ILIKE '%e-class%' OR trim_name ILIKE '%e350%' THEN 58000 + (year - 2020) * 1200
  WHEN trim_name ILIKE '%glc%' THEN 47000 + (year - 2020) * 1000
  WHEN trim_name ILIKE '%gle%' THEN 62000 + (year - 2020) * 1200
  ELSE 52000 + (year - 2020) * 1000
END
WHERE model_id IN (
  SELECT m.id FROM models m 
  JOIN makes mk ON m.make_id = mk.id 
  WHERE mk.make_name = 'Mercedes-Benz'
) AND msrp IS NULL;

-- Ford models
UPDATE model_trims 
SET msrp = CASE 
  WHEN trim_name ILIKE '%f-150%' THEN 32000 + (year - 2020) * 700
  WHEN trim_name ILIKE '%mustang%' THEN 28000 + (year - 2020) * 600
  WHEN trim_name ILIKE '%explorer%' THEN 35000 + (year - 2020) * 800
  WHEN trim_name ILIKE '%escape%' THEN 26000 + (year - 2020) * 500
  ELSE 28000 + (year - 2020) * 600
END
WHERE model_id IN (
  SELECT m.id FROM models m 
  JOIN makes mk ON m.make_id = mk.id 
  WHERE mk.make_name = 'Ford'
) AND msrp IS NULL;

-- Chevrolet models
UPDATE model_trims 
SET msrp = CASE 
  WHEN trim_name ILIKE '%silverado%' THEN 31000 + (year - 2020) * 700
  WHEN trim_name ILIKE '%malibu%' THEN 24000 + (year - 2020) * 500
  WHEN trim_name ILIKE '%equinox%' THEN 26000 + (year - 2020) * 500
  WHEN trim_name ILIKE '%tahoe%' THEN 52000 + (year - 2020) * 1000
  ELSE 27000 + (year - 2020) * 500
END
WHERE model_id IN (
  SELECT m.id FROM models m 
  JOIN makes mk ON m.make_id = mk.id 
  WHERE mk.make_name = 'Chevrolet'
) AND msrp IS NULL;

-- Set reasonable defaults for any remaining NULL values
UPDATE model_trims 
SET msrp = 30000 + (year - 2020) * 600
WHERE msrp IS NULL AND year >= 2015;

-- Set older vehicle defaults
UPDATE model_trims 
SET msrp = 25000
WHERE msrp IS NULL AND year < 2015;
