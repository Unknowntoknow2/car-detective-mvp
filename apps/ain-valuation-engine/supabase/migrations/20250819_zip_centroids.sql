-- ZIP centroid table (US). Extend for CA/EU later.
create table if not exists public.zip_centroids (
  zip text primary key,
  lat double precision not null,
  lon double precision not null,
  updated_at timestamptz default now()
);
create index if not exists idx_zip_centroids_latlon on public.zip_centroids (lat, lon);
