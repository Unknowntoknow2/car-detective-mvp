
-- Step 1: Clean up backup and temporary tables
DROP TABLE IF EXISTS public.makes_backup CASCADE;
DROP TABLE IF EXISTS public.models_backup CASCADE;
DROP TABLE IF EXISTS public.makes_temp CASCADE;
DROP TABLE IF EXISTS public.model_trims_temp_enriched CASCADE;

-- Step 2: Add proper foreign key constraints (if they don't exist)
DO $$
BEGIN
    -- Add foreign key constraint between models and makes if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_models_make_id'
    ) THEN
        ALTER TABLE public.models 
        ADD CONSTRAINT fk_models_make_id 
        FOREIGN KEY (make_id) REFERENCES public.makes(id) 
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    -- Add foreign key constraint between model_trims and models if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_model_trims_model_id'
    ) THEN
        ALTER TABLE public.model_trims 
        ADD CONSTRAINT fk_model_trims_model_id 
        FOREIGN KEY (model_id) REFERENCES public.models(id) 
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;

-- Step 3: Fix the "Unknown Make" data corruption
-- Create a temporary mapping table for model corrections
CREATE TEMP TABLE model_corrections AS
WITH known_models AS (
  SELECT 
    model_name,
    CASE 
      WHEN model_name IN ('Accord', 'Civic', 'CR-V', 'Pilot', 'Odyssey', 'Fit', 'HR-V', 'Passport', 'Ridgeline', 'Insight') THEN 'Honda'
      WHEN model_name IN ('Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Sienna', 'Tacoma', 'Tundra', '4Runner', 'Avalon') THEN 'Toyota'
      WHEN model_name IN ('F-150', 'Escape', 'Explorer', 'Focus', 'Mustang', 'Edge', 'Expedition', 'Ranger', 'Bronco', 'Fusion') THEN 'Ford'
      WHEN model_name IN ('Silverado', 'Equinox', 'Malibu', 'Tahoe', 'Suburban', 'Traverse', 'Camaro', 'Corvette', 'Cruze', 'Impala') THEN 'Chevrolet'
      WHEN model_name IN ('3 Series', '5 Series', 'X3', 'X5', 'X1', '7 Series', '4 Series', 'X7', 'Z4', '2 Series') THEN 'BMW'
      WHEN model_name IN ('C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'GLS', 'A-Class', 'CLA', 'G-Class') THEN 'Mercedes-Benz'
      WHEN model_name IN ('A4', 'A6', 'Q5', 'Q7', 'A3', 'Q3', 'A8', 'TT', 'R8', 'Q8') THEN 'Audi'
      WHEN model_name IN ('Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Murano', 'Maxima', 'Titan', 'Frontier', '370Z', 'GT-R') THEN 'Nissan'
      WHEN model_name IN ('Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Accent', 'Genesis', 'Palisade', 'Kona', 'Veloster') THEN 'Hyundai'
      WHEN model_name IN ('Optima', 'Forte', 'Sorento', 'Sportage', 'Soul', 'Stinger', 'Telluride', 'Rio', 'Cadenza') THEN 'Kia'
      WHEN model_name IN ('Outback', 'Forester', 'Impreza', 'Legacy', 'Crosstrek', 'Ascent', 'WRX', 'BRZ') THEN 'Subaru'
      WHEN model_name IN ('Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'CX-3', 'MX-5 Miata', 'CX-30') THEN 'Mazda'
      WHEN model_name IN ('Model S', 'Model 3', 'Model X', 'Model Y') THEN 'Tesla'
      WHEN model_name IN ('tC', 'xB', 'xD', 'FR-S', 'iQ') THEN 'Scion'
      ELSE NULL
    END as correct_make_name
  FROM (SELECT DISTINCT model_name FROM public.models WHERE make_id IN (SELECT id FROM public.makes WHERE make_name = 'Unknown Make')) sub
)
SELECT 
  km.model_name,
  km.correct_make_name,
  m.id as correct_make_id
FROM known_models km
JOIN public.makes m ON m.make_name = km.correct_make_name
WHERE km.correct_make_name IS NOT NULL;

-- Update models to point to correct makes, but only if the target doesn't already exist
UPDATE public.models 
SET make_id = mc.correct_make_id
FROM model_corrections mc
WHERE models.model_name = mc.model_name 
  AND models.make_id IN (SELECT id FROM public.makes WHERE make_name = 'Unknown Make')
  AND NOT EXISTS (
    SELECT 1 FROM public.models existing 
    WHERE existing.model_name = mc.model_name 
    AND existing.make_id = mc.correct_make_id
  );

-- Delete any remaining duplicate models that couldn't be moved
DELETE FROM public.models 
WHERE make_id IN (SELECT id FROM public.makes WHERE make_name = 'Unknown Make')
AND model_name IN (SELECT model_name FROM model_corrections);

-- Step 4: Add missing makes if they don't exist
INSERT INTO public.makes (make_name) VALUES 
  ('Subaru'), ('Mazda'), ('Volkswagen'), ('Jeep'), ('Ram'), 
  ('GMC'), ('Buick'), ('Cadillac'), ('Lincoln'), ('Acura'),
  ('Infiniti'), ('Lexus'), ('Volvo'), ('Land Rover'), ('Porsche'),
  ('Tesla'), ('Mitsubishi'), ('Chrysler'), ('Dodge')
ON CONFLICT (make_name) DO NOTHING;

-- Step 5: Add missing models using INSERT ... ON CONFLICT to handle duplicates
-- Scion models
INSERT INTO public.models (make_id, model_name) 
SELECT m.id, model_name FROM public.makes m 
CROSS JOIN (VALUES ('tC'), ('xB'), ('xD'), ('FR-S'), ('iQ')) AS models(model_name)
WHERE m.make_name = 'Scion'
ON CONFLICT (model_name, make_id) DO NOTHING;

-- Subaru models
INSERT INTO public.models (make_id, model_name) 
SELECT m.id, model_name FROM public.makes m 
CROSS JOIN (VALUES 
  ('Outback'), ('Forester'), ('Impreza'), ('Legacy'), ('Crosstrek'), 
  ('Ascent'), ('WRX'), ('BRZ')
) AS models(model_name)
WHERE m.make_name = 'Subaru'
ON CONFLICT (model_name, make_id) DO NOTHING;

-- Tesla models
INSERT INTO public.models (make_id, model_name) 
SELECT m.id, model_name FROM public.makes m 
CROSS JOIN (VALUES 
  ('Model S'), ('Model 3'), ('Model X'), ('Model Y')
) AS models(model_name)
WHERE m.make_name = 'Tesla'
ON CONFLICT (model_name, make_id) DO NOTHING;

-- Step 6: Clean up any remaining orphaned models pointing to non-existent makes
DELETE FROM public.models 
WHERE make_id NOT IN (SELECT id FROM public.makes);

-- Step 7: Remove the "Unknown Make" entry if it has no models left
DELETE FROM public.makes 
WHERE make_name = 'Unknown Make' 
  AND id NOT IN (SELECT DISTINCT make_id FROM public.models WHERE make_id IS NOT NULL);

-- Step 8: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_models_make_id ON public.models(make_id);
CREATE INDEX IF NOT EXISTS idx_model_trims_model_id ON public.model_trims(model_id);
CREATE INDEX IF NOT EXISTS idx_makes_make_name ON public.makes(make_name);
CREATE INDEX IF NOT EXISTS idx_models_model_name ON public.models(model_name);
