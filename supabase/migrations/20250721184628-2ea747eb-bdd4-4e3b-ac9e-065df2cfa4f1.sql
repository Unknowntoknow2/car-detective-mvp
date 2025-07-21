-- Enable RLS and fix policies for key tables that are missing RLS

-- Enable RLS on critical tables that are missing it
ALTER TABLE public.valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_answers ENABLE ROW LEVEL SECURITY;

-- Fix valuations table policies to allow users to access their data and anonymous access
DROP POLICY IF EXISTS "Users can view own valuations" ON public.valuations;
DROP POLICY IF EXISTS "Users can read their own valuations" ON public.valuations;
DROP POLICY IF EXISTS "Service role can manage all valuations" ON public.valuations;
DROP POLICY IF EXISTS "Users can update their own valuations" ON public.valuations;
DROP POLICY IF EXISTS "Users can delete own valuations" ON public.valuations;

-- Create comprehensive valuations policies
CREATE POLICY "Users can view their own valuations" ON public.valuations
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    user_id IS NULL OR 
    auth.role() = 'service_role'
  );

CREATE POLICY "Users can insert their own valuations" ON public.valuations
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id OR 
    user_id IS NULL OR 
    auth.role() = 'service_role'
  );

CREATE POLICY "Users can update their own valuations" ON public.valuations
  FOR UPDATE 
  USING (
    auth.uid() = user_id OR 
    user_id IS NULL OR 
    auth.role() = 'service_role'
  );

CREATE POLICY "Service role can manage all valuations" ON public.valuations
  FOR ALL 
  USING (auth.role() = 'service_role');

-- Fix market_listings policies
CREATE POLICY "Users can view market listings for their valuations" ON public.market_listings
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.valuations v 
      WHERE v.id = market_listings.valuation_id 
      AND (v.user_id = auth.uid() OR v.user_id IS NULL OR auth.role() = 'service_role')
    ) OR 
    auth.role() = 'service_role'
  );

CREATE POLICY "Service role can manage market listings" ON public.market_listings
  FOR ALL 
  USING (auth.role() = 'service_role');

-- Fix follow_up_answers policies
DROP POLICY IF EXISTS "Users can manage their own follow_up_answers" ON public.follow_up_answers;
DROP POLICY IF EXISTS "Service role can manage all follow_up_answers" ON public.follow_up_answers;

CREATE POLICY "Users can view their own follow_up_answers" ON public.follow_up_answers
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    user_id IS NULL OR 
    auth.role() = 'service_role'
  );

CREATE POLICY "Users can insert their own follow_up_answers" ON public.follow_up_answers
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id OR 
    user_id IS NULL OR 
    auth.role() = 'service_role'
  );

CREATE POLICY "Users can update their own follow_up_answers" ON public.follow_up_answers
  FOR UPDATE 
  USING (
    auth.uid() = user_id OR 
    user_id IS NULL OR 
    auth.role() = 'service_role'
  );

CREATE POLICY "Service role can manage all follow_up_answers" ON public.follow_up_answers
  FOR ALL 
  USING (auth.role() = 'service_role');