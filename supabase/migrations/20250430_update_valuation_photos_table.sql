
-- Update the existing valuation_photos table to ensure it has all the columns we need
ALTER TABLE IF EXISTS public.valuation_photos
ADD COLUMN IF NOT EXISTS photo_url TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS score DECIMAL(3,2) NOT NULL,
ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add RLS policies if needed
-- Note: This assumes the RLS policies already exist from the 20250429_create_valuation_photos_table.sql migration
