# AIN Valuation Engine - Database Schema Documentation

## Overview

The AIN Valuation Engine uses PostgreSQL with Supabase for its database layer, implementing enterprise-grade security with Row Level Security (RLS) and comprehensive data normalization.

## Core Tables

### `vehicle_specs`

Primary table storing vehicle specification data decoded from VINs and enriched with additional attributes.

#### Base Columns
- `id` (BIGSERIAL PRIMARY KEY): Auto-incrementing unique identifier
- `vin` (VARCHAR(17) UNIQUE NOT NULL): Vehicle Identification Number
- `make` (VARCHAR(50)): Vehicle manufacturer
- `model` (VARCHAR(50)): Vehicle model name  
- `year` (INTEGER): Model year
- `trim` (VARCHAR(100)): Trim level/package
- `body_style` (VARCHAR(50)): Body configuration (sedan, SUV, etc.)
- `engine_type` (VARCHAR(100)): Engine specification
- `transmission` (VARCHAR(100)): Transmission type
- `drivetrain` (VARCHAR(20)): Drive configuration (FWD, AWD, etc.)
- `fuel_type` (VARCHAR(30)): Primary fuel type
- `mpg_city` (INTEGER): EPA city fuel economy rating
- `mpg_highway` (INTEGER): EPA highway fuel economy rating
- `msrp` (INTEGER): Manufacturer's Suggested Retail Price (USD)
- `created_at` (TIMESTAMPTZ): Record creation timestamp
- `updated_at` (TIMESTAMPTZ): Last modification timestamp

#### Enhanced JSONB Columns (Added 2025-08-08)

##### `safety_equipment` (JSONB)
Stores safety equipment features as boolean flags.

**Normalization Rules:**
- Keys: `lowercase_with_underscores` format
- Values: Boolean `true`/`false` only
- Standard keys include:
  - `anti_lock_brakes`
  - `electronic_stability_control`
  - `traction_control`
  - `blind_spot_monitoring`
  - `lane_departure_warning`
  - `forward_collision_warning`
  - `automatic_emergency_braking`
  - `adaptive_cruise_control`
  - `parking_sensors`
  - `backup_camera`

##### `airbags` (JSONB)
Stores airbag coverage as boolean flags.

**Normalization Rules:**
- Keys: `lowercase_with_underscores` format
- Values: Boolean `true`/`false` only
- Standard keys include:
  - `driver_airbag`
  - `passenger_airbag`
  - `front_side_airbags`
  - `rear_side_airbags`
  - `head_curtain_airbags`
  - `knee_airbags`
  - `seat_mounted_side_airbags`
  - `driver_knee_airbag`
  - `passenger_knee_airbag`

##### `lighting` (JSONB)
Stores lighting equipment as boolean flags.

**Normalization Rules:**
- Keys: `lowercase_with_underscores` format
- Values: Boolean `true`/`false` only
- Standard keys include:
  - `halogen_headlights`
  - `xenon_headlights`
  - `led_headlights`
  - `laser_headlights`
  - `automatic_headlights`
  - `fog_lights`
  - `daytime_running_lights`
  - `adaptive_headlights`
  - `cornering_lights`
  - `high_intensity_discharge`

#### Indexes
- Primary key on `id`
- Unique constraint on `vin`
- Composite index on `(make, model, year)` for efficient lookups
- GIN indexes on JSONB columns for feature queries:
  - `idx_vehicle_specs_safety_equipment_gin`
  - `idx_vehicle_specs_airbags_gin`
  - `idx_vehicle_specs_lighting_gin`

### Other Tables

#### `api_cache`
Caches external API responses with TTL and SWR (Stale While Revalidate) support.

#### `vin_history`
Tracks VIN decode requests and results for analytics and debugging.

#### `user_queries`
Stores user interaction data and follow-up responses.

## Views

### `vehicle_profiles`

Enhanced read-only view of vehicle data with computed feature counts.

**Additional Computed Columns:**
- `safety_feature_count`: Count of enabled safety features
- `airbag_coverage_count`: Count of available airbag types
- `lighting_feature_count`: Count of advanced lighting features
- `total_safety_score`: Combined safety + airbag feature count

**Usage:**
```sql
-- Get vehicles with high safety scores
SELECT vin, make, model, year, total_safety_score 
FROM vehicle_profiles 
WHERE total_safety_score >= 10
ORDER BY total_safety_score DESC;

-- Find vehicles with specific safety features
SELECT vin, make, model, year
FROM vehicle_profiles 
WHERE safety_equipment->>'adaptive_cruise_control' = 'true'
  AND airbags->>'head_curtain_airbags' = 'true';
```

## Security Model

### Row Level Security (RLS)
- **Anonymous users**: Can only read via views, no direct table access
- **Authenticated users**: Full CRUD on owned records via RPC functions
- **Service role**: Administrative access for system operations

### Access Patterns
- Public data access through `vehicle_profiles` view
- Write operations through secure RPC functions with `SECURITY DEFINER`
- All API responses include correlation IDs for request tracking

## Performance Considerations

### JSONB Query Optimization
Use GIN indexes for efficient JSONB queries:
```sql
-- Efficient: Uses GIN index
WHERE safety_equipment ? 'anti_lock_brakes'

-- Efficient: Uses GIN index with boolean check
WHERE safety_equipment->>'anti_lock_brakes' = 'true'

-- Less efficient: Avoid complex nested queries
WHERE jsonb_array_length(jsonb_object_keys(safety_equipment)) > 5
```

### Feature Count Queries
The view pre-computes feature counts for efficient analytics:
```sql
-- Fast: Uses pre-computed counts
SELECT AVG(safety_feature_count) FROM vehicle_profiles WHERE year >= 2020;

-- Slower: Computed on-demand
SELECT AVG((SELECT COUNT(*) FROM jsonb_each_text(safety_equipment) WHERE value::boolean = true))
FROM vehicle_specs WHERE year >= 2020;
```

## Migration History

- `20250808000001_create_core_tables.sql`: Initial schema
- `20250808000002_create_views_and_functions.sql`: Views and RPC functions  
- `20250808000003_insert_sample_data.sql`: Sample data for testing
- `20250808213006_safety_airbags_lighting.sql`: Enhanced safety/airbag/lighting columns

## Future Schema Enhancements

Planned additions include:
- Market listing integration tables
- Photo/video analysis results storage
- User preference and history tracking
- Advanced valuation model metadata
