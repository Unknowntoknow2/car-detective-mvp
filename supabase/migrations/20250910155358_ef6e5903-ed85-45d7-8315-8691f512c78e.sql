-- Fix critical security issue: Restrict access to follow_up_answers table
-- Remove overly permissive policies that expose customer data

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Anonymous users can create follow_up_answers" ON public.follow_up_answers;
DROP POLICY IF EXISTS "Users can manage their own follow_up_answers" ON public.follow_up_answers;
DROP POLICY IF EXISTS "Service role can manage all follow_up_answers" ON public.follow_up_answers;

-- Create secure policies that protect customer data
-- 1. Users can only see their own follow-up answers
CREATE POLICY "Users can view their own follow_up_answers" 
ON public.follow_up_answers 
FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Users can only create follow-up answers for themselves
CREATE POLICY "Users can create their own follow_up_answers" 
ON public.follow_up_answers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Users can only update their own follow-up answers
CREATE POLICY "Users can update their own follow_up_answers" 
ON public.follow_up_answers 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Users can only delete their own follow-up answers
CREATE POLICY "Users can delete their own follow_up_answers" 
ON public.follow_up_answers 
FOR DELETE 
USING (auth.uid() = user_id);

-- 5. Service role can manage all records (for system operations)
CREATE POLICY "Service role can manage all follow_up_answers" 
ON public.follow_up_answers 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 6. Allow anonymous users to create temporary records (but they can't read them back)
-- This supports the anonymous valuation flow while maintaining security
CREATE POLICY "Anonymous users can create temporary follow_up_answers" 
ON public.follow_up_answers 
FOR INSERT 
WITH CHECK (user_id IS NULL AND auth.uid() IS NULL);

-- Ensure RLS is enabled
ALTER TABLE public.follow_up_answers ENABLE ROW LEVEL SECURITY;

-- Add a comment explaining the security model
COMMENT ON TABLE public.follow_up_answers IS 
'Contains sensitive customer vehicle and financial data. RLS policies ensure users can only access their own data. Anonymous submissions are allowed for creation only but cannot be retrieved, maintaining security while supporting the anonymous valuation flow.';