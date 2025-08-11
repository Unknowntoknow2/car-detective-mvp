# Vehicle Specifications Schema

This document describes the core `vehicle_specs` table structure and related schema components that form the foundation of the AIN Valuation Engine's vehicle data model.

## Table: vehicle_specs

The `vehicle_specs` table is the primary repository for vehicle specification data derived from VIN decoding and external automotive APIs.

### Schema Definition

```sql
CREATE TABLE vehicle_specs (
    vin VARCHAR(17) PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    trim VARCHAR(100),
    body_class VARCHAR(50),
    engine_cylinders INTEGER,
    displacement_cc INTEGER,
    fuel_type_primary VARCHAR(50),
    drive_type VARCHAR(20),
    transmission_style VARCHAR(50),
    manufacturer VARCHAR(100),
    doors INTEGER,
    gvwr INTEGER,
    safety_equipment JSONB,
    airbags JSONB,
    lighting JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Field Descriptions

| Field | Type | Description | Source | Required |
|-------|------|-------------|---------|----------|
| `vin` | VARCHAR(17) | Vehicle Identification Number (primary key) | User Input | Yes |
| `make` | VARCHAR(50) | Vehicle manufacturer (e.g., "Toyota", "Honda") | vPIC API | Yes |
| `model` | VARCHAR(100) | Vehicle model name (e.g., "Camry", "Civic") | vPIC API | Yes |
| `year` | INTEGER | Model year (e.g., 2023) | vPIC API | Yes |
| `trim` | VARCHAR(100) | Trim level (e.g., "LE", "Sport", "Limited") | vPIC API | No |
| `body_class` | VARCHAR(50) | Body style (e.g., "Sedan", "SUV", "Truck") | vPIC API | No |
| `engine_cylinders` | INTEGER | Number of engine cylinders | vPIC API | No |
| `displacement_cc` | INTEGER | Engine displacement in cubic centimeters | vPIC API | No |
| `fuel_type_primary` | VARCHAR(50) | Primary fuel type (e.g., "Gasoline", "Electric") | vPIC API | No |
| `drive_type` | VARCHAR(20) | Drive configuration (e.g., "AWD", "FWD", "RWD") | vPIC API | No |
| `transmission_style` | VARCHAR(50) | Transmission type (e.g., "Manual", "Automatic") | vPIC API | No |
| `manufacturer` | VARCHAR(100) | Full manufacturer name | vPIC API | No |
| `doors` | INTEGER | Number of doors | vPIC API | No |
| `gvwr` | INTEGER | Gross Vehicle Weight Rating (lbs) | vPIC API | No |
| `safety_equipment` | JSONB | Safety systems and equipment details | vPIC API | No |
| `airbags` | JSONB | Airbag configuration and locations | vPIC API | No |
| `lighting` | JSONB | Lighting system specifications | vPIC API | No |
| `created_at` | TIMESTAMP | Record creation timestamp | System | Yes |
| `updated_at` | TIMESTAMP | Last update timestamp | System | Yes |

## JSONB Field Structures

### safety_equipment
```json
{
  "abs": true,
  "esc": true,
  "traction_control": true,
  "dynamic_brake_support": false,
  "cib": true,
  "adaptive_cruise_control": true,
  "forward_collision_warning": true,
  "lane_departure_warning": true,
  "lane_keep_system": true,
  "lane_centering_assistance": false,
  "pedestrian_aeb": true,
  "rear_visibility_system": true,
  "rear_aeb": false,
  "rear_cross_traffic_alert": true,
  "park_assist": false,
  "tpms": true,
  "edr": true,
  "blind_spot_monitoring": true
}
```

### airbags
```json
{
  "front": true,
  "side": true,
  "curtain": true,
  "knee": true,
  "seat_cushion": false,
  "pretensioner": true,
  "locations": {
    "front": "1st Row (Driver & Passenger)",
    "side": "1st Row (Driver & Passenger)",
    "curtain": "1st and 2nd Rows",
    "knee": "Driver"
  }
}
```

### lighting
```json
{
  "daytime_running_lights": true,
  "lower_beam_source": "LED",
  "upper_beam_source": "LED",
  "adaptive_headlights": false,
  "automatic_high_beams": true,
  "fog_lights": true,
  "cornering_lights": false
}
```

## Indexes

### Primary Indexes
```sql
-- Primary key index (automatic)
CREATE UNIQUE INDEX vehicle_specs_pkey ON vehicle_specs (vin);

-- Performance indexes
CREATE INDEX idx_vehicle_specs_make_model_year ON vehicle_specs (make, model, year);
CREATE INDEX idx_vehicle_specs_year ON vehicle_specs (year);
CREATE INDEX idx_vehicle_specs_body_class ON vehicle_specs (body_class);
CREATE INDEX idx_vehicle_specs_updated_at ON vehicle_specs (updated_at);
```

### JSONB Indexes
```sql
-- JSONB field indexes for safety equipment queries
CREATE INDEX idx_vehicle_specs_safety_equipment_gin ON vehicle_specs USING GIN (safety_equipment);
CREATE INDEX idx_vehicle_specs_airbags_gin ON vehicle_specs USING GIN (airbags);
CREATE INDEX idx_vehicle_specs_lighting_gin ON vehicle_specs USING GIN (lighting);
```

## Constraints

### Data Validation
```sql
-- VIN format validation
ALTER TABLE vehicle_specs ADD CONSTRAINT valid_vin 
  CHECK (vin ~ '^[A-HJ-NPR-Z0-9]{17}$');

-- Year range validation
ALTER TABLE vehicle_specs ADD CONSTRAINT valid_year 
  CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 2);

-- GVWR validation
ALTER TABLE vehicle_specs ADD CONSTRAINT valid_gvwr 
  CHECK (gvwr IS NULL OR gvwr > 0);

-- Engine cylinders validation
ALTER TABLE vehicle_specs ADD CONSTRAINT valid_cylinders 
  CHECK (engine_cylinders IS NULL OR engine_cylinders BETWEEN 1 AND 16);
```

## Related Tables

### safety_ratings
Links to vehicle safety rating information:
```sql
CREATE TABLE safety_ratings (
    id SERIAL PRIMARY KEY,
    vin VARCHAR(17) REFERENCES vehicle_specs(vin),
    overall_rating INTEGER,
    frontal_crash_rating INTEGER,
    side_crash_rating INTEGER,
    rollover_rating INTEGER,
    fetched_at TIMESTAMP DEFAULT NOW()
);
```

### fuel_economy
EPA fuel economy data:
```sql
CREATE TABLE fuel_economy (
    id SERIAL PRIMARY KEY,
    vin VARCHAR(17) REFERENCES vehicle_specs(vin),
    city_mpg INTEGER,
    highway_mpg INTEGER,
    combined_mpg INTEGER,
    annual_fuel_cost INTEGER,
    co2_emissions INTEGER,
    fetched_at TIMESTAMP DEFAULT NOW()
);
```

### market_listings
Current market listing data:
```sql
CREATE TABLE market_listings (
    id SERIAL PRIMARY KEY,
    vin VARCHAR(17) REFERENCES vehicle_specs(vin),
    listing_price INTEGER,
    mileage INTEGER,
    condition VARCHAR(20),
    location VARCHAR(100),
    source VARCHAR(50),
    listed_at TIMESTAMP,
    fetched_at TIMESTAMP DEFAULT NOW()
);
```

## Materialized View: vehicle_profiles

Combines data from multiple tables for performance:

```sql
CREATE MATERIALIZED VIEW vehicle_profiles AS
SELECT 
    vs.vin,
    vs.make,
    vs.model,
    vs.year,
    vs.trim,
    vs.body_class,
    vs.engine_cylinders,
    vs.displacement_cc,
    vs.fuel_type_primary,
    vs.drive_type,
    vs.transmission_style,
    vs.manufacturer,
    vs.doors,
    vs.gvwr,
    vs.safety_equipment,
    vs.airbags,
    vs.lighting,
    
    -- Safety ratings
    sr.overall_rating as safety_overall,
    sr.frontal_crash_rating as safety_frontal,
    sr.side_crash_rating as safety_side,
    sr.rollover_rating as safety_rollover,
    
    -- Fuel economy
    fe.city_mpg,
    fe.highway_mpg,
    fe.combined_mpg,
    fe.annual_fuel_cost,
    fe.co2_emissions,
    
    -- Market statistics
    ml_stats.avg_listing_price,
    ml_stats.min_listing_price,
    ml_stats.max_listing_price,
    ml_stats.listing_count,
    ml_stats.avg_mileage as market_avg_mileage
    
FROM vehicle_specs vs
LEFT JOIN safety_ratings sr ON vs.vin = sr.vin
LEFT JOIN fuel_economy fe ON vs.vin = fe.vin
LEFT JOIN (
    SELECT 
        vin,
        AVG(listing_price) as avg_listing_price,
        MIN(listing_price) as min_listing_price,
        MAX(listing_price) as max_listing_price,
        COUNT(*) as listing_count,
        AVG(mileage) as avg_mileage
    FROM market_listings 
    WHERE listed_at >= NOW() - INTERVAL '30 days'
    GROUP BY vin
) ml_stats ON vs.vin = ml_stats.vin;
```

## Common Queries

### Basic Vehicle Lookup
```sql
SELECT * FROM vehicle_specs WHERE vin = '1HGCM82633A123456';
```

### Search by Make/Model/Year
```sql
SELECT * FROM vehicle_specs 
WHERE make = 'Toyota' 
  AND model = 'Camry' 
  AND year = 2023;
```

### Safety Equipment Query
```sql
SELECT vin, make, model, year, safety_equipment
FROM vehicle_specs 
WHERE safety_equipment->>'adaptive_cruise_control' = 'true'
  AND year >= 2020;
```

### Performance Query with Profile
```sql
SELECT vp.*, COUNT(ml.id) as listing_count
FROM vehicle_profiles vp
LEFT JOIN market_listings ml ON vp.vin = ml.vin
WHERE vp.make = 'Honda' 
  AND vp.year = 2023
GROUP BY vp.vin
ORDER BY vp.safety_overall DESC, vp.combined_mpg DESC;
```

## Data Sources

### Primary Sources
1. **NHTSA vPIC API**: Vehicle specifications and safety equipment
2. **EPA Fuel Economy API**: MPG and emissions data
3. **NHTSA SafetyRatings API**: Crash test ratings
4. **Market Data Providers**: Current listing prices and inventory

### Update Frequency
- **Vehicle Specs**: Updated on first VIN decode, rarely changes
- **Safety Ratings**: Updated monthly or when new ratings released
- **Market Data**: Updated daily for active listings
- **Fuel Economy**: Updated annually with EPA releases

## Performance Considerations

### Query Optimization
- Use indexes for frequently queried fields
- Consider partitioning by year for very large datasets
- Regular VACUUM and ANALYZE on high-update tables
- Monitor JSONB query performance

### Caching Strategy
- VIN decode results cached for 24 hours
- Market data cached for 1 hour
- Safety ratings cached for 7 days
- Materialized view refreshed every 6 hours

## Data Quality

### Validation Rules
1. VIN must be exactly 17 characters and pass check digit validation
2. Year must be reasonable (1900 to current year + 2)
3. Make/model must be non-empty strings
4. Numeric fields must be positive when present

### Monitoring
- Daily data quality reports
- Alert on VIN decode failure rate > 5%
- Monitor JSONB field completeness
- Track data freshness metrics

## Compliance

### Data Privacy
- VINs are considered PII in some jurisdictions
- Implement data retention policies
- Support data deletion requests
- Audit access to sensitive fields

### Regulatory Requirements
- Maintain audit logs for all data changes
- Support regulatory reporting requirements
- Ensure data accuracy for financial applications
- Implement data lineage tracking