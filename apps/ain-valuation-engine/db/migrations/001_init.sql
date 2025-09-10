-- Feature flags table
create table if not exists feature_flags (
  key text primary key,
  enabled boolean not null default false,
  note text,
  updated_at timestamptz default now()
);
insert into feature_flags(key,enabled,note) values
('PHOTO_AI', false, 'Enable photo AI scoring')
  on conflict (key) do nothing;
insert into feature_flags(key,enabled,note) values
('ML_REGRESSOR', false, 'Enable XGBoost path')
  on conflict (key) do nothing;
insert into feature_flags(key,enabled,note) values
('LLM_EXPLAIN', true, 'Use LLM for narratives')
  on conflict (key) do nothing;

-- Vehicles
create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  vin text unique,
  year int, make text, model text, trim text,
  engine text, drivetrain text, body text, fuel_type text,
  created_at timestamptz default now()
);

-- Valuation requests & results
create table if not exists valuations (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id),
  zip text, mileage int, method text, value numeric,
  range_low numeric, range_high numeric,
  confidence numeric, confidence_label text,
  factors jsonb,
  created_at timestamptz default now()
);

-- Comps used/excluded
create table if not exists comps (
  id uuid primary key default gen_random_uuid(),
  valuation_id uuid references valuations(id),
  source text, url text, price numeric, mileage int, zip text,
  included boolean, exclusion_reason text, trust_tier text,
  quality_score numeric, fetched_at timestamptz
);

-- Audit
create table if not exists valuation_audit (
  id uuid primary key default gen_random_uuid(),
  valuation_id uuid references valuations(id),
  stage text, status text, http_status int, error text, meta jsonb,
  created_at timestamptz default now()
);
