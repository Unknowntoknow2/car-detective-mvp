
-- Create email_logs table
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  email_type TEXT NOT NULL,
  email TEXT NOT NULL,
  valuation_id UUID REFERENCES public.valuations,
  status TEXT NOT NULL,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Allow authorized users to view their own email logs
CREATE POLICY "Users can view their own email logs"
  ON public.email_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow admin users to view all email logs
CREATE POLICY "Admins can view all email logs"
  ON public.email_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create index on user_id and email_type for performance
CREATE INDEX IF NOT EXISTS email_logs_user_id_email_type_idx
  ON public.email_logs (user_id, email_type);

-- Create index on email_type and created_at for reporting
CREATE INDEX IF NOT EXISTS email_logs_email_type_created_at_idx
  ON public.email_logs (email_type, created_at);

-- Add profiles.last_active column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'last_active'
  ) THEN
    ALTER TABLE public.profiles
    ADD COLUMN last_active TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;
END
$$;
