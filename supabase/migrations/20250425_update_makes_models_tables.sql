
-- Add NHTSA ID columns to makes and models tables
ALTER TABLE IF EXISTS public.makes ADD COLUMN IF NOT EXISTS nhtsa_make_id integer UNIQUE;
ALTER TABLE IF EXISTS public.models ADD COLUMN IF NOT EXISTS nhtsa_model_id integer UNIQUE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_makes_nhtsa_make_id ON public.makes(nhtsa_make_id);
CREATE INDEX IF NOT EXISTS idx_models_nhtsa_model_id ON public.models(nhtsa_model_id);
CREATE INDEX IF NOT EXISTS idx_models_make_id ON public.models(make_id);
