-- Create valuation_feedback table for user feedback on valuation accuracy
CREATE TABLE public.valuation_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vin TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  feedback TEXT NOT NULL CHECK (feedback IN ('accurate', 'off', 'far_off')),
  estimated_value NUMERIC,
  confidence_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.valuation_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can insert their own feedback" 
ON public.valuation_feedback 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback" 
ON public.valuation_feedback 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for admins to view all feedback
CREATE POLICY "Admins can view all feedback" 
ON public.valuation_feedback 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_valuation_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_valuation_feedback_updated_at
BEFORE UPDATE ON public.valuation_feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_valuation_feedback_updated_at();