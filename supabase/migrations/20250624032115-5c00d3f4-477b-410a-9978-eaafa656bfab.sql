
-- Allow public read access to makes table
CREATE POLICY "Allow public read access to makes" ON public.makes
FOR SELECT USING (true);

-- Allow public read access to models table  
CREATE POLICY "Allow public read access to models" ON public.models
FOR SELECT USING (true);
