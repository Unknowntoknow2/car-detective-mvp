
-- Fix 1: Remove duplicate servicehistory column (keep serviceHistory)
ALTER TABLE public.follow_up_answers DROP COLUMN IF EXISTS servicehistory;

-- Fix 2: Clean up existing boolean data in JSONB fields
UPDATE public.follow_up_answers 
SET accidents = jsonb_set(
  accidents,
  '{frameDamage}',
  CASE 
    WHEN accidents->>'frameDamage' IN ('true', 'True', 'TRUE') THEN 'true'::jsonb
    WHEN accidents->>'frameDamage' IN ('false', 'False', 'FALSE') THEN 'false'::jsonb
    ELSE 'null'::jsonb
  END
)
WHERE accidents ? 'frameDamage' AND accidents->>'frameDamage' NOT IN ('true', 'false');

UPDATE public.follow_up_answers 
SET accidents = jsonb_set(
  accidents,
  '{repaired}',
  CASE 
    WHEN accidents->>'repaired' IN ('true', 'True', 'TRUE') THEN 'true'::jsonb
    WHEN accidents->>'repaired' IN ('false', 'False', 'FALSE') THEN 'false'::jsonb
    ELSE 'null'::jsonb
  END
)
WHERE accidents ? 'repaired' AND accidents->>'repaired' NOT IN ('true', 'false');

-- Fix 3: Clean up RLS policies on follow_up_answers (remove conflicting ones)
DROP POLICY IF EXISTS "Allow all insert" ON public.follow_up_answers;
DROP POLICY IF EXISTS "Allow all read" ON public.follow_up_answers;
DROP POLICY IF EXISTS "Anyone can create follow_up answers" ON public.follow_up_answers;
DROP POLICY IF EXISTS "Anyone can view follow_up answers" ON public.follow_up_answers;
DROP POLICY IF EXISTS "Users can delete their own follow-up answers" ON public.follow_up_answers;
DROP POLICY IF EXISTS "Users can view their own follow-up answers" ON public.follow_up_answers;

-- Create 3 clean, non-conflicting RLS policies
CREATE POLICY "Users can read their follow_up_answers" 
ON public.follow_up_answers 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their follow_up_answers" 
ON public.follow_up_answers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their follow_up_answers" 
ON public.follow_up_answers 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Fix 4: Add validation trigger for boolean fields in JSONB
CREATE OR REPLACE FUNCTION validate_follow_up_booleans()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate boolean fields in accidents JSONB
  IF NEW.accidents IS NOT NULL THEN
    IF NEW.accidents ? 'frameDamage' AND NEW.accidents->>'frameDamage' NOT IN ('true', 'false', '') AND NEW.accidents->>'frameDamage' IS NOT NULL THEN
      RAISE EXCEPTION 'frameDamage must be boolean (true/false), got: %', NEW.accidents->>'frameDamage';
    END IF;
    
    IF NEW.accidents ? 'repaired' AND NEW.accidents->>'repaired' NOT IN ('true', 'false', '') AND NEW.accidents->>'repaired' IS NOT NULL THEN
      RAISE EXCEPTION 'repaired must be boolean (true/false), got: %', NEW.accidents->>'repaired';
    END IF;
  END IF;
  
  -- Validate boolean fields in modifications JSONB
  IF NEW.modifications IS NOT NULL THEN
    IF NEW.modifications ? 'modified' AND NEW.modifications->>'modified' NOT IN ('true', 'false', '') AND NEW.modifications->>'modified' IS NOT NULL THEN
      RAISE EXCEPTION 'modified must be boolean (true/false), got: %', NEW.modifications->>'modified';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_follow_up_booleans_trigger
  BEFORE INSERT OR UPDATE ON public.follow_up_answers
  FOR EACH ROW EXECUTE FUNCTION validate_follow_up_booleans();

-- Fix 5: Ensure VIN constraint exists for proper upserts
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'unique_vin_follow_up_answers'
  ) THEN
    ALTER TABLE public.follow_up_answers 
    ADD CONSTRAINT unique_vin_follow_up_answers UNIQUE (vin);
  END IF;
END $$;
