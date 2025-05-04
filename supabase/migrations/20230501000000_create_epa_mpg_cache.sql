
CREATE TABLE IF NOT EXISTS public.epa_mpg_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  city_mpg INTEGER NOT NULL,
  highway_mpg INTEGER NOT NULL,
  combined_mpg INTEGER NOT NULL,
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Create a unique constraint to prevent duplicate entries
  UNIQUE(year, make, model)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS epa_mpg_cache_year_make_model_idx ON public.epa_mpg_cache (year, make, model);
CREATE INDEX IF NOT EXISTS epa_mpg_cache_fetched_at_idx ON public.epa_mpg_cache (fetched_at);

-- Add RLS policies
ALTER TABLE public.epa_mpg_cache ENABLE ROW LEVEL SECURITY;

-- Everyone can read the cache
CREATE POLICY "Anyone can read EPA MPG cache" 
ON public.epa_mpg_cache 
FOR SELECT 
USING (true);

-- Only service role can insert or update
CREATE POLICY "Only service role can insert EPA MPG cache" 
ON public.epa_mpg_cache 
FOR INSERT 
WITH CHECK (auth.jwt() ->> 'role' = 'service_role'); 

CREATE POLICY "Only service role can update EPA MPG cache" 
ON public.epa_mpg_cache 
FOR UPDATE 
USING (auth.jwt() ->> 'role' = 'service_role');
