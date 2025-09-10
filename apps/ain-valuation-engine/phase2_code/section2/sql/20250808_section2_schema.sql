-- Section 2 migration: add tables for IIHS ratings, OEM features,
-- NHTSA complaints/investigations, market signals, and valuation weights.

create table if not exists public.iihs_ratings (
  id uuid primary key default gen_random_uuid(),
  program text default 'IIHS' not null,
  model_year smallint not null,
  make text not null,
  model text not null,
  trim text,
  crashworthiness jsonb,
  crash_prevention jsonb,
  headlights text,
  raw_payload jsonb,
  fetched_at timestamptz default now() not null,
  source text,
  unique(program, model_year, make, model, coalesce(trim, ''))
);

create table if not exists public.oem_features (
  vin text primary key references vehicle_specs(vin) on delete cascade,
  features_json jsonb not null,
  confidence numeric(3,2),
  fetched_at timestamptz default now(),
  source text,
  raw_payload jsonb
);

create table if not exists public.nhtsa_complaints (
  id uuid primary key default gen_random_uuid(),
  vin text,
  model_year smallint,
  make text,
  model text,
  category text,
  description text,
  incident_date date,
  received_date date,
  state text,
  raw_payload jsonb,
  fetched_at timestamptz default now(),
  source text
);
create index if not exists idx_complaints_vin on public.nhtsa_complaints(vin);
create index if not exists idx_complaints_model on public.nhtsa_complaints(make, model, model_year);

create table if not exists public.nhtsa_investigations (
  id uuid primary key default gen_random_uuid(),
  make text not null,
  model text not null,
  model_year smallint not null,
  action_number text not null,
  component text,
  summary text,
  opened date,
  closed date,
  raw_payload jsonb,
  fetched_at timestamptz default now(),
  source text,
  unique(make, model, model_year, action_number)
);

create table if not exists public.sales_volume (
  id uuid primary key default gen_random_uuid(),
  model_year smallint not null,
  make text not null,
  model text not null,
  month date not null,
  units int,
  source text,
  fetched_at timestamptz default now(),
  raw_payload jsonb,
  unique(model_year, make, model, month)
);

create table if not exists public.dom_metrics (
  model_year smallint not null,
  make text not null,
  model text not null,
  region text not null,
  days_on_market numeric(6,2),
  as_of date not null,
  source text,
  fetched_at timestamptz default now(),
  raw_payload jsonb,
  unique(model_year, make, model, region, as_of)
);

create table if not exists public.demand_score (
  model_year smallint not null,
  make text not null,
  model text not null,
  region text not null,
  score numeric(4,2),
  as_of date not null,
  source text,
  fetched_at timestamptz default now(),
  unique(model_year, make, model, region, as_of)
);

create table if not exists public.valuation_weights (
  key text primary key,
  value numeric,
  updated_at timestamptz default now()
);

-- Seed default weights for valuation adjusters v2
insert into public.valuation_weights (key, value)
  values
    ('adj.recall_per_open_pct', -1),
    ('adj.recall_cap_pct', -3),
    ('adj.iihs_top_safety_pick_plus', 0.3),
    ('adj.iihs_low_grade', -0.3),
    ('adj.oem.premium_audio', 0.5),
    ('adj.oem.pano_roof', 0.7),
    ('adj.oem.tow_pkg', 1.5),
    ('adj.oem.heated_ventilated', 0.6),
    ('adj.complaints.high_z', -0.8),
    ('adj.macro.max_abs', 0.5)
on conflict do nothing;

-- TODO: extend vehicle_profiles view to join these tables.
