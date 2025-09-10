-- CRITICAL SECURITY FIX: Remove dangerous public access to valuation audit logs
-- This prevents competitors from accessing proprietary valuation algorithms and business logic

-- Drop the dangerous policy that exposes internal audit logs to all users
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.valuation_audit_logs;

-- Drop anonymous creation policy (should be service-only)
DROP POLICY IF EXISTS "Anonymous users can create audit logs" ON public.valuation_audit_logs;

-- Create secure policies for valuation audit logs

-- 1. Users can ONLY view audit logs that are explicitly assigned to them (non-null user_id)
CREATE POLICY "Users can view their own assigned audit logs only" 
ON public.valuation_audit_logs 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id AND user_id IS NOT NULL);

-- 2. Only authenticated users can create audit logs (with proper ownership)
CREATE POLICY "Authenticated users can create audit logs" 
ON public.valuation_audit_logs 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id AND user_id IS NOT NULL);

-- 3. Users can only update their own assigned audit logs
CREATE POLICY "Users can update their own assigned audit logs only" 
ON public.valuation_audit_logs 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id AND user_id IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id AND user_id IS NOT NULL);

-- 4. Admins can view ALL audit logs (including internal system logs)
CREATE POLICY "Admins can view all audit logs" 
ON public.valuation_audit_logs 
FOR SELECT 
USING (EXISTS ( 
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- 5. Admins can manage ALL audit logs
CREATE POLICY "Admins can manage all audit logs" 
ON public.valuation_audit_logs 
FOR ALL 
USING (EXISTS ( 
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Add security documentation
COMMENT ON TABLE public.valuation_audit_logs IS 
'CONFIDENTIAL: Contains proprietary valuation algorithms, processing steps, and business logic. 
Access strictly restricted to data owners and administrators only. 
NEVER allow public access to system audit logs (user_id IS NULL records).
These contain trade secrets and competitive intelligence.';

-- Create index for performance on user_id lookups
CREATE INDEX IF NOT EXISTS idx_valuation_audit_logs_user_id ON public.valuation_audit_logs(user_id) 
WHERE user_id IS NOT NULL;