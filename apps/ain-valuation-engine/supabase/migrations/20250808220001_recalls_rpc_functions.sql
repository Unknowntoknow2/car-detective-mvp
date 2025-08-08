-- Migration: Add RPC functions for recalls ingestion
-- Created: 2025-08-08
-- Purpose: Support NHTSA recalls API integration with caching and upsert functionality

-- Enhanced RPC function to upsert recalls data
CREATE OR REPLACE FUNCTION rpc_upsert_recalls(
    vin_param VARCHAR(17),
    recalls_payload JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result_data JSONB;
    recall_record JSONB;
    inserted_count INTEGER := 0;
    updated_count INTEGER := 0;
    total_count INTEGER := 0;
BEGIN
    -- Validate VIN
    IF vin_param IS NULL OR length(vin_param) != 17 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Invalid VIN length',
            'vin', vin_param
        );
    END IF;

    -- Validate payload
    IF recalls_payload IS NULL OR jsonb_typeof(recalls_payload) != 'array' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Invalid recalls payload format',
            'vin', vin_param
        );
    END IF;

    -- Get total count of recalls in payload
    total_count := jsonb_array_length(recalls_payload);

    -- Process each recall in the payload
    FOR recall_record IN SELECT * FROM jsonb_array_elements(recalls_payload)
    LOOP
        -- Insert or update recall record
        INSERT INTO nhtsa_recalls (
            vin,
            recall_id,
            nhtsa_campaign_number,
            component,
            summary,
            consequence,
            remedy,
            report_date,
            manufacturer,
            remedy_status
        )
        VALUES (
            vin_param,
            COALESCE(recall_record->>'campaign_number', 'UNKNOWN'),
            recall_record->>'campaign_number',
            recall_record->>'component',
            recall_record->>'summary',
            recall_record->>'consequence',
            recall_record->>'remedy',
            CASE 
                WHEN recall_record->>'report_received_date' IS NOT NULL 
                THEN (recall_record->>'report_received_date')::DATE
                ELSE NULL
            END,
            recall_record->>'manufacturer',
            CASE 
                WHEN (recall_record->>'is_open')::boolean = true THEN 'Open'
                WHEN (recall_record->>'is_open')::boolean = false THEN 'Closed'
                ELSE 'Unknown'
            END
        )
        ON CONFLICT (vin, recall_id)
        DO UPDATE SET
            nhtsa_campaign_number = EXCLUDED.nhtsa_campaign_number,
            component = EXCLUDED.component,
            summary = EXCLUDED.summary,
            consequence = EXCLUDED.consequence,
            remedy = EXCLUDED.remedy,
            report_date = EXCLUDED.report_date,
            manufacturer = EXCLUDED.manufacturer,
            remedy_status = EXCLUDED.remedy_status,
            updated_at = NOW();

        -- Check if this was an insert or update
        GET DIAGNOSTICS inserted_count = ROW_COUNT;
        
        IF inserted_count > 0 THEN
            IF EXISTS (
                SELECT 1 FROM nhtsa_recalls 
                WHERE vin = vin_param 
                AND recall_id = COALESCE(recall_record->>'campaign_number', 'UNKNOWN')
                AND created_at = updated_at
            ) THEN
                inserted_count := inserted_count + 1;
            ELSE
                updated_count := updated_count + 1;
            END IF;
        END IF;
    END LOOP;

    -- Return success response
    RETURN jsonb_build_object(
        'success', true,
        'vin', vin_param,
        'total_recalls', total_count,
        'inserted', inserted_count,
        'updated', updated_count,
        'timestamp', NOW()
    );

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'vin', vin_param,
            'timestamp', NOW()
        );
END;
$$;

-- Function to get cached recall data
CREATE OR REPLACE FUNCTION get_cached_recall_data(vin_param VARCHAR(17))
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result_data JSONB;
BEGIN
    SELECT jsonb_agg(
        jsonb_build_object(
            'campaign_number', nhtsa_campaign_number,
            'component', component,
            'summary', summary,
            'consequence', consequence,
            'remedy', remedy,
            'report_received_date', report_date,
            'is_open', CASE 
                WHEN remedy_status = 'Open' THEN true
                WHEN remedy_status = 'Closed' THEN false
                ELSE null
            END,
            'source', 'nhtsa',
            'manufacturer', manufacturer
        )
    ) INTO result_data
    FROM nhtsa_recalls
    WHERE vin = vin_param;

    RETURN COALESCE(result_data, '[]'::jsonb);
END;
$$;

-- Function to cache recall data with TTL simulation
CREATE OR REPLACE FUNCTION cache_recall_data(
    vin_param VARCHAR(17),
    recalls_data JSONB,
    ttl_seconds INTEGER DEFAULT 3600
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result_data JSONB;
BEGIN
    -- For this implementation, we'll use the database as cache
    -- In a production system, you might use Redis or similar
    
    -- Clear existing recalls for this VIN (if doing a full refresh)
    -- DELETE FROM nhtsa_recalls WHERE vin = vin_param;
    
    -- Insert new recalls data
    SELECT rpc_upsert_recalls(vin_param, recalls_data) INTO result_data;
    
    RETURN result_data;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION rpc_upsert_recalls(VARCHAR, JSONB) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION get_cached_recall_data(VARCHAR) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION cache_recall_data(VARCHAR, JSONB, INTEGER) TO authenticated, anon, service_role;

-- Add helpful comments
COMMENT ON FUNCTION rpc_upsert_recalls(VARCHAR, JSONB) IS 'Upserts NHTSA recall data for a given VIN with deduplication';
COMMENT ON FUNCTION get_cached_recall_data(VARCHAR) IS 'Retrieves cached recall data for a VIN from the database';
COMMENT ON FUNCTION cache_recall_data(VARCHAR, JSONB, INTEGER) IS 'Caches recall data in the database with TTL simulation';
