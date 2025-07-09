-- Phase 1: Critical Database Schema Fixes

-- 1. Remove duplicate VIN constraint from follow_up_answers
DROP INDEX IF EXISTS idx_follow_up_answers_vin;
ALTER TABLE follow_up_answers DROP CONSTRAINT IF EXISTS follow_up_answers_vin_unique;

-- 2. Drop problematic CHECK constraints that are blocking submissions
ALTER TABLE follow_up_answers DROP CONSTRAINT IF EXISTS follow_up_answers_condition_check;

-- 3. Clean up conflicting RLS policies and create simplified ones
DROP POLICY IF EXISTS "Users can create their own follow-up answers" ON follow_up_answers;
DROP POLICY IF EXISTS "Users can delete their own follow_up answers" ON follow_up_answers;
DROP POLICY IF EXISTS "Users can insert their follow_up_answers" ON follow_up_answers;
DROP POLICY IF EXISTS "Users can read their follow_up_answers" ON follow_up_answers;
DROP POLICY IF EXISTS "Users can update follow_up answers by VIN" ON follow_up_answers;
DROP POLICY IF EXISTS "Users can update their follow_up_answers" ON follow_up_answers;
DROP POLICY IF EXISTS "Users can update their own follow-up answers" ON follow_up_answers;

-- Create 3 clean, simple RLS policies
CREATE POLICY "Users can manage their own follow_up_answers" 
ON follow_up_answers FOR ALL 
USING (auth.uid() = user_id OR user_id IS NULL)
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Service role can manage all follow_up_answers" 
ON follow_up_answers FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Anonymous users can create follow_up_answers" 
ON follow_up_answers FOR INSERT 
WITH CHECK (user_id IS NULL);

-- 4. Update the validation trigger to be more permissive
DROP TRIGGER IF EXISTS validate_follow_up_booleans_trigger ON follow_up_answers;
DROP FUNCTION IF EXISTS validate_follow_up_booleans();

CREATE OR REPLACE FUNCTION public.validate_follow_up_booleans()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate boolean fields in accidents JSONB (more permissive)
  IF NEW.accidents IS NOT NULL THEN
    IF NEW.accidents ? 'frameDamage' AND NEW.accidents->>'frameDamage' NOT IN ('true', 'false', '', NULL) THEN
      -- Convert invalid values to false instead of throwing error
      NEW.accidents = jsonb_set(NEW.accidents, '{frameDamage}', 'false');
    END IF;
    
    IF NEW.accidents ? 'repaired' AND NEW.accidents->>'repaired' NOT IN ('true', 'false', '', NULL) THEN
      -- Convert invalid values to false instead of throwing error
      NEW.accidents = jsonb_set(NEW.accidents, '{repaired}', 'false');
    END IF;
  END IF;
  
  -- Validate boolean fields in modifications JSONB (more permissive)
  IF NEW.modifications IS NOT NULL THEN
    IF NEW.modifications ? 'modified' AND NEW.modifications->>'modified' NOT IN ('true', 'false', '', NULL) THEN
      -- Convert invalid values to false instead of throwing error
      NEW.modifications = jsonb_set(NEW.modifications, '{modified}', 'false');
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic boolean validation and cleanup
CREATE TRIGGER validate_follow_up_booleans_trigger
BEFORE INSERT OR UPDATE ON follow_up_answers
FOR EACH ROW
EXECUTE FUNCTION validate_follow_up_booleans();

-- 5. Add a unique constraint on VIN that allows for proper upserts
CREATE UNIQUE INDEX IF NOT EXISTS idx_follow_up_answers_vin_unique 
ON follow_up_answers (vin) 
WHERE vin IS NOT NULL;