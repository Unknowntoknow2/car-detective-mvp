
-- Create a storage bucket for vehicle photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-photos', 'Vehicle Photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up a policy to allow authenticated users to upload photos
CREATE POLICY "Allow users to upload their photos" 
ON storage.objects 
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vehicle-photos');

-- Set up a policy to allow users to view their own photos
CREATE POLICY "Allow users to view photos" 
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'vehicle-photos');

-- Set up a policy to allow users to delete their own photos
CREATE POLICY "Allow users to delete their photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'vehicle-photos');
