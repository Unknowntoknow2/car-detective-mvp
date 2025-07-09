-- Fix dataSource column naming mismatch
-- PostgreSQL converts unquoted column names to lowercase, so we need to use snake_case
-- Drop the incorrectly named column if it exists and recreate with proper naming
ALTER TABLE public.valuations 
DROP COLUMN IF EXISTS datasource,
DROP COLUMN IF EXISTS "dataSource";

-- Add the column with snake_case naming (PostgreSQL convention)
ALTER TABLE public.valuations 
ADD COLUMN IF NOT EXISTS data_source JSONB DEFAULT '{}'::jsonb;

-- Add index for the renamed column
CREATE INDEX IF NOT EXISTS idx_valuations_data_source ON public.valuations USING GIN(data_source);