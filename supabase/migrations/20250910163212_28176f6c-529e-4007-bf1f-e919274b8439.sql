-- CRITICAL SECURITY FIX Phase 2: Secure sensitive tables (handle existing policies)
-- Drop all existing policies first, then create secure ones

-- =============================================
-- FIX 1: Secure valuations table - Drop all existing policies first
-- =============================================

-- Drop ALL existing policies on valuations table
DROP POLICY IF EXISTS "Public can read valuations" ON public.valuations;
DROP POLICY IF EXISTS "Anonymous users can create valuations" ON public.valuations;
DROP POLICY IF EXISTS "Allow anonymous valuation creation" ON public.valuations;
DROP POLICY IF EXISTS "Users can view their own valuations only" ON public.valuations;
DROP POLICY IF EXISTS "Authenticated users can create their own valuations" ON public.valuations;
DROP POLICY IF EXISTS "Users can update their own valuations" ON public.valuations;
DROP POLICY IF EXISTS "Admins can manage all valuations" ON public.valuations;
DROP POLICY IF EXISTS "Users can view own valuations" ON public.valuations;
DROP POLICY IF EXISTS "Users can insert own valuations" ON public.valuations;

-- Create NEW secure policies for valuations
CREATE POLICY "Secure: Users view own valuations only" 
ON public.valuations 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Secure: Users create own valuations only" 
ON public.valuations 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Secure: Users update own valuations only" 
ON public.valuations 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Secure: Admins manage all valuations" 
ON public.valuations 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- =============================================
-- FIX 2: Secure competitor_prices - Drop existing, create secure
-- =============================================

DROP POLICY IF EXISTS "Allow public read access to competitor prices" ON public.competitor_prices;
DROP POLICY IF EXISTS "Allow service role to manage competitor prices" ON public.competitor_prices;

CREATE POLICY "Secure: Premium users view competitor prices only" 
ON public.competitor_prices 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND (role IN ('premium', 'dealer', 'admin') OR is_premium_dealer = true)
    )
  )
);

CREATE POLICY "Secure: Service role manages competitor prices" 
ON public.competitor_prices 
FOR ALL 
USING (auth.role() = 'service_role');

-- =============================================
-- SUCCESS: Log security hardening completion
-- =============================================

INSERT INTO compliance_audit_log (
  entity_type, entity_id, action, 
  input_data, compliance_flags, created_at
) VALUES (
  'security_hardening', gen_random_uuid(), 'critical_rls_secured', 
  '{"secured_tables": ["valuations", "competitor_prices"], "policies_updated": 6}',
  ARRAY['data_protection', 'access_control', 'competitor_intelligence'], now()
);