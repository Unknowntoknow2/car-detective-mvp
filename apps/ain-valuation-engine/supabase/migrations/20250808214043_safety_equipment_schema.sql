-- Migration: Add safety equipment, airbags, and lighting JSONB columns
-- Created: 2025-08-08
-- Purpose: Expand vehicle_specs with safety, airbag, and lighting equipment data

-- Add JSONB columns for safety equipment, airbags, and lighting
ALTER TABLE vehicle_specs 
ADD COLUMN IF NOT EXISTS safety_equipment JSONB NOT NULL DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS airbags JSONB NOT NULL DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS lighting JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Add comments describing normalization rules
COMMENT ON COLUMN vehicle_specs.safety_equipment IS 
'JSONB object storing safety equipment features as boolean flags. 
Normalization rules:
- Keys: lowercase_with_underscores (e.g., "anti_lock_brakes", "electronic_stability_control")
- Values: boolean true/false only
- Standard keys: anti_lock_brakes, electronic_stability_control, traction_control, 
  blind_spot_monitoring, lane_departure_warning, forward_collision_warning, 
  automatic_emergency_braking, adaptive_cruise_control, parking_sensors, backup_camera';

COMMENT ON COLUMN vehicle_specs.airbags IS 
'JSONB object storing airbag coverage as boolean flags.
Normalization rules:
- Keys: lowercase_with_underscores (e.g., "driver_airbag", "passenger_airbag")  
- Values: boolean true/false only
- Standard keys: driver_airbag, passenger_airbag, front_side_airbags, rear_side_airbags,
  head_curtain_airbags, knee_airbags, seat_mounted_side_airbags, driver_knee_airbag,
  passenger_knee_airbag';

COMMENT ON COLUMN vehicle_specs.lighting IS 
'JSONB object storing lighting equipment as boolean flags.
Normalization rules:
- Keys: lowercase_with_underscores (e.g., "halogen_headlights", "led_headlights")
- Values: boolean true/false only  
- Standard keys: halogen_headlights, xenon_headlights, led_headlights, laser_headlights,
  automatic_headlights, fog_lights, daytime_running_lights, adaptive_headlights,
  cornering_lights, high_intensity_discharge';

-- Add indexes for JSONB columns to improve query performance
CREATE INDEX IF NOT EXISTS idx_vehicle_specs_safety_equipment_gin 
ON vehicle_specs USING gin (safety_equipment);

CREATE INDEX IF NOT EXISTS idx_vehicle_specs_airbags_gin 
ON vehicle_specs USING gin (airbags);

CREATE INDEX IF NOT EXISTS idx_vehicle_specs_lighting_gin 
ON vehicle_specs USING gin (lighting);

-- Insert sample data to demonstrate the new columns
INSERT INTO vehicle_specs (
    vin, make, model, year, trim, body_class, engine_cylinders, displacement_cc,
    fuel_type_primary, drive_type, transmission_style, manufacturer,
    safety_equipment, airbags, lighting
) VALUES 
(
    'SAMPLE123456789AB', 
    'Toyota', 
    'Camry', 
    2023, 
    'XLE', 
    'Sedan', 
    4,
    2500.0,
    'Gasoline', 
    'FWD', 
    'CVT', 
    'Toyota Motor Corporation',
    '{
        "anti_lock_brakes": true,
        "electronic_stability_control": true,
        "traction_control": true,
        "blind_spot_monitoring": true,
        "lane_departure_warning": true,
        "forward_collision_warning": true,
        "automatic_emergency_braking": true,
        "adaptive_cruise_control": false,
        "parking_sensors": true,
        "backup_camera": true
    }'::jsonb,
    '{
        "driver_airbag": true,
        "passenger_airbag": true,
        "front_side_airbags": true,
        "rear_side_airbags": false,
        "head_curtain_airbags": true,
        "knee_airbags": true,
        "seat_mounted_side_airbags": false,
        "driver_knee_airbag": true,
        "passenger_knee_airbag": false
    }'::jsonb,
    '{
        "halogen_headlights": false,
        "xenon_headlights": false,
        "led_headlights": true,
        "laser_headlights": false,
        "automatic_headlights": true,
        "fog_lights": true,
        "daytime_running_lights": true,
        "adaptive_headlights": false,
        "cornering_lights": false,
        "high_intensity_discharge": false
    }'::jsonb
) ON CONFLICT (vin) DO UPDATE SET
    safety_equipment = EXCLUDED.safety_equipment,
    airbags = EXCLUDED.airbags,
    lighting = EXCLUDED.lighting,
    updated_at = CURRENT_TIMESTAMP;
