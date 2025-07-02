-- Fix existing invalid condition data
UPDATE follow_up_answers 
SET condition = 'good' 
WHERE condition = '' OR condition IS NULL;