-- Migration: Add RPC functions for enhanced VIN decoding with safety equipment
-- Created: 2025-08-08
-- Purpose: Support vPIC API integration with safety equipment, airbags, and lighting data

-- Enhanced RPC function to upsert vehicle specs with safety equipment
CREATE OR REPLACE FUNCTION rpc_upsert_specs(
    vin_param VARCHAR(17),
    make_param VARCHAR(100) DEFAULT NULL,
    model_param VARCHAR(100) DEFAULT NULL,
    year_param INTEGER DEFAULT NULL,
    trim_param VARCHAR(100) DEFAULT NULL,
    body_class_param VARCHAR(100) DEFAULT NULL,
    engine_cylinders_param INTEGER DEFAULT NULL,
    displacement_cc_param DECIMAL(6,1) DEFAULT NULL,
    fuel_type_primary_param VARCHAR(50) DEFAULT NULL,
    drive_type_param VARCHAR(20) DEFAULT NULL,
    transmission_style_param VARCHAR(50) DEFAULT NULL,
    manufacturer_param VARCHAR(200) DEFAULT NULL,
    plant_country_param VARCHAR(100) DEFAULT NULL,
    plant_state_param VARCHAR(100) DEFAULT NULL,
    vehicle_type_param VARCHAR(100) DEFAULT NULL,
    gvwr_param DECIMAL(8,2) DEFAULT NULL,
    doors_param INTEGER DEFAULT NULL,
    series_param VARCHAR(100) DEFAULT NULL,
    safety_equipment_param JSONB DEFAULT '{}'::jsonb,
    airbags_param JSONB DEFAULT '{}'::jsonb,
    lighting_param JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result_data JSONB;
BEGIN
    -- Validate VIN
    IF vin_param IS NULL OR length(vin_param) != 17 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Invalid VIN length'
        );
    END IF;

    -- Validate year if provided
    IF year_param IS NOT NULL AND (year_param < 1980 OR year_param > 2030) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Invalid year range'
        );
    END IF;

    -- Upsert vehicle specs with safety equipment
    INSERT INTO vehicle_specs (
        vin, make, model, year, trim, body_class, engine_cylinders, 
        displacement_cc, fuel_type_primary, drive_type, transmission_style,
        manufacturer, plant_country, plant_state, vehicle_type, gvwr, 
        doors, series, safety_equipment, airbags, lighting, updated_at
    ) VALUES (
        vin_param, make_param, model_param, year_param, trim_param, 
        body_class_param, engine_cylinders_param, displacement_cc_param,
        fuel_type_primary_param, drive_type_param, transmission_style_param,
        manufacturer_param, plant_country_param, plant_state_param,
        vehicle_type_param, gvwr_param, doors_param, series_param,
        safety_equipment_param, airbags_param, lighting_param, 
        CURRENT_TIMESTAMP
    )
    ON CONFLICT (vin) 
    DO UPDATE SET
        make = COALESCE(EXCLUDED.make, vehicle_specs.make),
        model = COALESCE(EXCLUDED.model, vehicle_specs.model),
        year = COALESCE(EXCLUDED.year, vehicle_specs.year),
        trim = COALESCE(EXCLUDED.trim, vehicle_specs.trim),
        body_class = COALESCE(EXCLUDED.body_class, vehicle_specs.body_class),
        engine_cylinders = COALESCE(EXCLUDED.engine_cylinders, vehicle_specs.engine_cylinders),
        displacement_cc = COALESCE(EXCLUDED.displacement_cc, vehicle_specs.displacement_cc),
        fuel_type_primary = COALESCE(EXCLUDED.fuel_type_primary, vehicle_specs.fuel_type_primary),
        drive_type = COALESCE(EXCLUDED.drive_type, vehicle_specs.drive_type),
        transmission_style = COALESCE(EXCLUDED.transmission_style, vehicle_specs.transmission_style),
        manufacturer = COALESCE(EXCLUDED.manufacturer, vehicle_specs.manufacturer),
        plant_country = COALESCE(EXCLUDED.plant_country, vehicle_specs.plant_country),
        plant_state = COALESCE(EXCLUDED.plant_state, vehicle_specs.plant_state),
        vehicle_type = COALESCE(EXCLUDED.vehicle_type, vehicle_specs.vehicle_type),
        gvwr = COALESCE(EXCLUDED.gvwr, vehicle_specs.gvwr),
        doors = COALESCE(EXCLUDED.doors, vehicle_specs.doors),
        series = COALESCE(EXCLUDED.series, vehicle_specs.series),
        safety_equipment = COALESCE(EXCLUDED.safety_equipment, vehicle_specs.safety_equipment),
        airbags = COALESCE(EXCLUDED.airbags, vehicle_specs.airbags),
        lighting = COALESCE(EXCLUDED.lighting, vehicle_specs.lighting),
        updated_at = CURRENT_TIMESTAMP;

    -- Return success with updated data
    SELECT jsonb_build_object(
        'success', true,
        'vin', vin_param,
        'operation', CASE WHEN xmax = 0 THEN 'inserted' ELSE 'updated' END,
        'timestamp', CURRENT_TIMESTAMP
    ) INTO result_data
    FROM vehicle_specs 
    WHERE vin = vin_param;

    RETURN result_data;
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'error_code', SQLSTATE
        );
END;
$$;

-- Function to get cached VIN data
CREATE OR REPLACE FUNCTION get_cached_vin_data(vin_input VARCHAR(17))
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    cache_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'cached_at', created_at,
        'data', response_data,
        'hit_count', hit_count
    ) INTO cache_result
    FROM api_cache 
    WHERE cache_key = 'vpic:' || vin_input
      AND expires_at > timezone('utc', now())
    ORDER BY created_at DESC
    LIMIT 1;

    -- Update hit count if found
    IF cache_result IS NOT NULL THEN
        UPDATE api_cache 
        SET hit_count = hit_count + 1, 
            last_accessed = timezone('utc', now())
        WHERE cache_key = 'vpic:' || vin_input;
    END IF;

    RETURN cache_result;
END;
$$;

-- Function to cache VIN data
CREATE OR REPLACE FUNCTION cache_vin_data(
    vin_input VARCHAR(17),
    data_input JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO api_cache (
        cache_key,
        response_data,
        expires_at,
        cache_type,
        source
    ) VALUES (
        'vpic:' || vin_input,
        data_input,
        timezone('utc', now()) + INTERVAL '24 hours',
        'vin_decode',
        'vpic_api'
    )
    ON CONFLICT (cache_key) 
    DO UPDATE SET
        response_data = EXCLUDED.response_data,
        expires_at = EXCLUDED.expires_at,
        hit_count = 1,
        last_accessed = timezone('utc', now()),
        created_at = timezone('utc', now());

    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION rpc_upsert_specs TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_upsert_specs TO service_role;
GRANT EXECUTE ON FUNCTION get_cached_vin_data TO authenticated;
GRANT EXECUTE ON FUNCTION get_cached_vin_data TO service_role;
GRANT EXECUTE ON FUNCTION cache_vin_data TO authenticated;
GRANT EXECUTE ON FUNCTION cache_vin_data TO service_role;
