-- Create audit + listings tables for AIN market ingestion

create table if not exists public.ingest_runs (
  id uuid primary key default gen_random_uuid(),
  run_id text not null,                 -- client-provided id (e.g., timestamp-random)
  source text[],                        -- list of hostnames/domains queried
  model text not null,                  -- openai model name
  status text not null default 'running',-- running | success | error
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  urls int default 0,                   -- attempted URLs
  listings_found int default 0,         -- total extracted before dedupe
  listings_upserted int default 0,      -- rows actually upserted
  token_input bigint default 0,
  token_output bigint default 0,
  notes jsonb default '{}'::jsonb
);

create index if not exists ingest_runs_run_id_idx on public.ingest_runs (run_id);
create index if not exists ingest_runs_started_at_idx on public.ingest_runs (started_at);

create table if not exists public.market_listings (
  id uuid primary key default gen_random_uuid(),
  vin text,
  make text not null,
  model text not null,
  year int,
  price numeric,
  mileage numeric,
  zip text,
  dealer text,
  dealer_phone text,
  url text not null,
  image text,
  source text not null,
  fetched_at timestamptz not null,
  dedupe_key text not null,             -- vin or composite stable hash
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- unique index to prevent duplicates on the dedupe key (per-source uniqueness)
create unique index if not exists market_listings_dedupe_key_uidx
  on public.market_listings (dedupe_key);

-- simple helpers
create index if not exists market_listings_vin_idx on public.market_listings (vin);
create index if not exists market_listings_make_model_idx on public.market_listings (make, model);
create index if not exists market_listings_source_idx on public.market_listings (source);
