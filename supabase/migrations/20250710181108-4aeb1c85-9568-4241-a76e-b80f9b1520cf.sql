-- Create table to track PDF downloads for analytics
CREATE TABLE public.pdf_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  valuation_id UUID,
  vin TEXT,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  file_size INTEGER,
  download_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pdf_downloads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own PDF downloads" 
ON public.pdf_downloads 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage PDF downloads" 
ON public.pdf_downloads 
FOR ALL 
USING (auth.role() = 'service_role'::text);