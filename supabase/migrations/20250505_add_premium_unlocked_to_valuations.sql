
-- Migration: Add premium_unlocked column to valuations table
ALTER TABLE IF EXISTS public.valuations 
ADD COLUMN IF NOT EXISTS premium_unlocked BOOLEAN DEFAULT false;

-- Add RLS policies for orders table if not already added
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can view their own orders'
  ) THEN
    ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
    
    -- Users can view their own orders
    CREATE POLICY "Users can view their own orders" 
    ON public.orders FOR SELECT 
    USING (auth.uid() = user_id);
    
    -- Allow edge functions to create and update orders
    CREATE POLICY "Edge functions can create orders" 
    ON public.orders FOR INSERT 
    WITH CHECK (true);
    
    CREATE POLICY "Edge functions can update orders" 
    ON public.orders FOR UPDATE 
    USING (true);
  END IF;
END
$$;
