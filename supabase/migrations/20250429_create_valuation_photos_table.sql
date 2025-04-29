
-- Create table for storing valuation photos and AI scoring results
CREATE TABLE IF NOT EXISTS public.valuation_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  valuation_id UUID NOT NULL,
  photo_url TEXT NOT NULL,
  score DECIMAL(3,2) NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_valuation
    FOREIGN KEY(valuation_id)
    REFERENCES public.valuations(id)
    ON DELETE CASCADE
);

-- Add index for faster lookup
CREATE INDEX IF NOT EXISTS idx_valuation_photos_valuation_id ON public.valuation_photos(valuation_id);

-- Set up RLS policies
ALTER TABLE public.valuation_photos ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own photos
CREATE POLICY "Users can view their own photos"
  ON public.valuation_photos
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.valuations v
      WHERE v.id = valuation_photos.valuation_id
      AND v.user_id = auth.uid()
    )
  );

-- Allow users to insert their own photos
CREATE POLICY "Users can insert their own photos"
  ON public.valuation_photos
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.valuations v
      WHERE v.id = valuation_photos.valuation_id
      AND v.user_id = auth.uid()
    )
  );

-- Allow users to update their own photos
CREATE POLICY "Users can update their own photos"
  ON public.valuation_photos
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.valuations v
      WHERE v.id = valuation_photos.valuation_id
      AND v.user_id = auth.uid()
    )
  );

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own photos"
  ON public.valuation_photos
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.valuations v
      WHERE v.id = valuation_photos.valuation_id
      AND v.user_id = auth.uid()
    )
  );
