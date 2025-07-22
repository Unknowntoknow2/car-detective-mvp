-- Create a simple edge function to handle market listing searches using OpenAI
-- This will be the backend for our real-time market search agent

-- First, create a table to cache search results if needed
CREATE TABLE IF NOT EXISTS public.market_search_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_query TEXT NOT NULL,
  search_params JSONB NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 hour')
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_market_search_cache_query ON public.market_search_cache(search_query);
CREATE INDEX IF NOT EXISTS idx_market_search_cache_expires ON public.market_search_cache(expires_at);

-- Enable RLS
ALTER TABLE public.market_search_cache ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now since this is market data)
CREATE POLICY "Allow read access to market search cache" ON public.market_search_cache FOR SELECT USING (true);
CREATE POLICY "Allow insert access to market search cache" ON public.market_search_cache FOR INSERT WITH CHECK (true);