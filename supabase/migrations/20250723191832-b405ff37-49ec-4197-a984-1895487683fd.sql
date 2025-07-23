-- Clean up invalid valuation records with zero values
DELETE FROM valuations 
WHERE estimated_value = 0 
   OR confidence_score = 0 
   OR estimated_value IS NULL;