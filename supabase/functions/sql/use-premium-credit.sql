
-- This will be run via migrations separately
CREATE OR REPLACE FUNCTION public.use_premium_credit(
  user_id_param UUID,
  valuation_id_param UUID
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  access_record RECORD;
BEGIN
  -- Find the user's premium access record
  SELECT * INTO access_record
  FROM premium_access
  WHERE user_id = user_id_param
  ORDER BY updated_at DESC
  LIMIT 1;
  
  -- Check if user has credits
  IF access_record IS NULL OR access_record.credits_remaining <= 0 THEN
    RETURN false;
  END IF;
  
  -- Check if premium access is expired
  IF access_record.expires_at IS NOT NULL AND access_record.expires_at < now() THEN
    RETURN false;
  END IF;
  
  -- Begin transaction
  BEGIN
    -- Deduct a credit
    UPDATE premium_access
    SET credits_remaining = credits_remaining - 1
    WHERE id = access_record.id;
    
    -- Mark this valuation as premium for this user
    INSERT INTO premium_valuations (user_id, valuation_id)
    VALUES (user_id_param, valuation_id_param)
    ON CONFLICT (user_id, valuation_id) DO NOTHING;
    
    RETURN true;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN false;
  END;
END;
$$;
