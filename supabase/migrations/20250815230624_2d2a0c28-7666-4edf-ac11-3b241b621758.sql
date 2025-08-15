-- market_search_audit: expand with API + stage visibility
alter table public.market_search_audit
  add column if not exists api_http_status int,
  add column if not exists api_ok boolean,
  add column if not exists api_error text,
  add column if not exists retry_attempts int default 0,
  add column if not exists stage_status jsonb,          -- { decode:true, market_search:true, normalize:true, match:false, ... }
  add column if not exists exclusion_reason text,       -- why THIS listing not included
  add column if not exists trust_tier text,             -- Tier1/Tier2/Tier3
  add column if not exists quality_score int,           -- 0..100
  add column if not exists included_in_comp_set boolean;

-- valuation_audit_logs: capture final method + range
alter table public.valuation_audit_logs
  add column if not exists final_method text,           -- market_based | fallback_pricing | broadened_search | manual_match
  add column if not exists confidence_capped_at numeric,
  add column if not exists value_range jsonb;           -- {low: 13600, high: 16600, pct: 0.15}

-- optional: dedicated table to store the normalized snapshot we audited
create table if not exists public.listing_audit_snapshots (
  id uuid primary key default gen_random_uuid(),
  valuation_id uuid references public.valuations(id) on delete cascade,
  listing_url text,
  source text,
  captured_at timestamptz default now(),
  snapshot jsonb,                -- full listing JSON we used
  created_at timestamptz default now()
);

-- RLS policies for new table
alter table public.listing_audit_snapshots enable row level security;

create policy "Service role can manage listing audit snapshots"
  on public.listing_audit_snapshots
  for all
  using (auth.role() = 'service_role');

create policy "Users can view their own listing audit snapshots"
  on public.listing_audit_snapshots
  for select
  using (
    exists (
      select 1 from public.valuations v
      where v.id = listing_audit_snapshots.valuation_id
      and v.user_id = auth.uid()
    )
  );