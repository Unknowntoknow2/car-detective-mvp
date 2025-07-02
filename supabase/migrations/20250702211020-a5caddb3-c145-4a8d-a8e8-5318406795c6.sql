-- Fix existing invalid condition data
UPDATE follow_up_answers 
SET condition = 'good' 
WHERE condition = '' OR condition IS NULL;

-- Add check constraint to prevent future invalid condition values
ALTER TABLE follow_up_answers 
ADD CONSTRAINT follow_up_answers_condition_check 
CHECK (condition IN ('excellent', 'good', 'fair', 'poor'));