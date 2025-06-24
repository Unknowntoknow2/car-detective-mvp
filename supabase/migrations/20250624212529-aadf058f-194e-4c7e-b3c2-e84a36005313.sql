
-- First, let's remove duplicate entries, keeping only the most recent one for each VIN
WITH ranked_entries AS (
  SELECT id, vin, 
         ROW_NUMBER() OVER (PARTITION BY vin ORDER BY updated_at DESC) as rn
  FROM follow_up_answers
)
DELETE FROM follow_up_answers 
WHERE id IN (
  SELECT id FROM ranked_entries WHERE rn > 1
);

-- Now add the unique constraint
ALTER TABLE follow_up_answers 
ADD CONSTRAINT follow_up_answers_vin_unique UNIQUE (vin);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_follow_up_answers_vin ON follow_up_answers (vin);
