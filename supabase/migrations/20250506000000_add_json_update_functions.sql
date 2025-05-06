
-- Function to update a valuation's best photo URL
CREATE OR REPLACE FUNCTION update_valuation_best_photo(valuation_id uuid, photo_url text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE valuations
  SET data = COALESCE(data, '{}'::jsonb) || jsonb_build_object('best_photo_url', photo_url)
  WHERE id = valuation_id;
END;
$$;

-- Function to update a valuation's AI condition assessment
CREATE OR REPLACE FUNCTION update_valuation_ai_condition(valuation_id uuid, condition_data jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE valuations
  SET data = COALESCE(data, '{}'::jsonb) || jsonb_build_object('ai_condition', condition_data)
  WHERE id = valuation_id;
END;
$$;

-- Ensure valuations have a data JSONB column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'valuations'
    AND column_name = 'data'
  ) THEN
    ALTER TABLE valuations ADD COLUMN data JSONB;
  END IF;
END
$$;
