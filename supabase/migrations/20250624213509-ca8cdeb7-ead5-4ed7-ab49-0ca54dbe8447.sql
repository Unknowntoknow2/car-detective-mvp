
-- Enable Row Level Security on follow_up_answers table
ALTER TABLE public.follow_up_answers ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view follow-up answers for any VIN (for public valuations)
CREATE POLICY "Anyone can view follow_up answers" 
ON public.follow_up_answers 
FOR SELECT 
USING (true);

-- Policy 2: Anyone can insert follow-up answers (for anonymous valuations)
CREATE POLICY "Anyone can create follow_up answers" 
ON public.follow_up_answers 
FOR INSERT 
WITH CHECK (true);

-- Policy 3: Users can update answers they created or by VIN matching
CREATE POLICY "Users can update follow_up answers by VIN" 
ON public.follow_up_answers 
FOR UPDATE 
USING (
  -- Allow if user owns the record OR if no user_id is set (anonymous)
  user_id IS NULL OR user_id = auth.uid()
);

-- Policy 4: Users can delete their own answers
CREATE POLICY "Users can delete their own follow_up answers" 
ON public.follow_up_answers 
FOR DELETE 
USING (
  user_id IS NULL OR user_id = auth.uid()
);
