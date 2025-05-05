
-- Function to update premium_unlocked field for a user's valuations
CREATE OR REPLACE FUNCTION update_premium_unlocked(user_id_param UUID, premium_unlocked_value BOOLEAN)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.valuations
  SET premium_unlocked = premium_unlocked_value
  WHERE user_id = user_id_param
    AND (premium_unlocked IS NULL OR premium_unlocked = FALSE);
END;
$$;
