
-- Add driving profile columns to valuations table
ALTER TABLE public.valuations
ADD COLUMN driving_profile TEXT DEFAULT 'Normal',
ADD COLUMN driving_profile_multiplier FLOAT DEFAULT 1.0;
