
-- Check if the bucket exists first to avoid errors on reapplying
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'vehicle-photos'
  ) THEN
    INSERT INTO storage.buckets (id, name, public, avif_autodetection)
    VALUES ('vehicle-photos', 'vehicle-photos', true, false);
    
    -- Set up RLS policies to make files accessible
    INSERT INTO storage.policies (name, definition, bucket_id, operation)
    VALUES 
    ('Public Read Access', '() => true', 'vehicle-photos', 'SELECT'),
    ('Authenticated Users Insert', '(auth.uid() = auth.uid())', 'vehicle-photos', 'INSERT'),
    ('Owner Update Access', '(auth.uid() = auth.uid())', 'vehicle-photos', 'UPDATE'),
    ('Owner Delete Access', '(auth.uid() = auth.uid())', 'vehicle-photos', 'DELETE');
  END IF;
END $$;
