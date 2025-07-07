-- Update the follow-up mileage to the user-entered value and link to valuation
UPDATE follow_up_answers 
SET 
  mileage = 34812,
  valuation_id = '1b8761f9-2db5-4e74-9bda-930624b8bea9',
  updated_at = now()
WHERE vin = '1FTFW1E82NFB42108';

-- Also update the valuation_results to have the correct VIN for proper linking
UPDATE valuation_results 
SET vin = '1FTFW1E82NFB42108'
WHERE id = '1b8761f9-2db5-4e74-9bda-930624b8bea9';