-- Migration: Create NHTSA complaints and investigations tables
-- File: 20250808225001_nhtsa_complaints_investigations.sql
-- Purpose: NHTSA complaints and investigations data for enhanced safety analysis

-- Create NHTSA complaints table
CREATE TABLE IF NOT EXISTS nhtsa_complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nhtsa_id TEXT NOT NULL UNIQUE,
    odi_number TEXT,
    incident_date DATE,
    report_date DATE,
    component_category TEXT,
    component_description TEXT,
    summary TEXT,
    failure_description TEXT,
    consequence_description TEXT,
    corrective_action TEXT,
    model_year SMALLINT,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    vin TEXT,
    mileage INTEGER,
    crash_occurred BOOLEAN DEFAULT FALSE,
    fire_occurred BOOLEAN DEFAULT FALSE,
    injury_occurred BOOLEAN DEFAULT FALSE,
    death_occurred BOOLEAN DEFAULT FALSE,
    num_injuries INTEGER DEFAULT 0,
    num_deaths INTEGER DEFAULT 0,
    consumer_location TEXT,
    vehicle_speed_mph INTEGER,
    complaint_type TEXT,
    severity_level TEXT,
    raw_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source TEXT NOT NULL DEFAULT 'NHTSA_API'
);

-- Indexes for nhtsa_complaints
CREATE INDEX IF NOT EXISTS idx_complaints_nhtsa_id ON nhtsa_complaints (nhtsa_id);
CREATE INDEX IF NOT EXISTS idx_complaints_vehicle_lookup ON nhtsa_complaints (model_year, make, model);
CREATE INDEX IF NOT EXISTS idx_complaints_vin ON nhtsa_complaints (vin) WHERE vin IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_complaints_dates ON nhtsa_complaints (incident_date, report_date);
CREATE INDEX IF NOT EXISTS idx_complaints_severity ON nhtsa_complaints (crash_occurred, fire_occurred, injury_occurred, death_occurred);
CREATE INDEX IF NOT EXISTS idx_complaints_component ON nhtsa_complaints (component_category);

-- Create NHTSA investigations table
CREATE TABLE IF NOT EXISTS nhtsa_investigations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nhtsa_id TEXT NOT NULL UNIQUE,
    investigation_type TEXT NOT NULL, -- PE (Preliminary Evaluation), EA (Engineering Analysis), etc.
    investigation_number TEXT NOT NULL,
    open_date DATE,
    close_date DATE,
    status TEXT, -- OPEN, CLOSED, etc.
    subject TEXT,
    summary TEXT,
    action TEXT,
    closure_type TEXT,
    model_year_start SMALLINT,
    model_year_end SMALLINT,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    potential_units_affected INTEGER,
    death_count INTEGER DEFAULT 0,
    injury_count INTEGER DEFAULT 0,
    crash_count INTEGER DEFAULT 0,
    fire_count INTEGER DEFAULT 0,
    component_category TEXT,
    defect_category TEXT,
    consequence_category TEXT,
    raw_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source TEXT NOT NULL DEFAULT 'NHTSA_API'
);

-- Indexes for nhtsa_investigations
CREATE INDEX IF NOT EXISTS idx_investigations_nhtsa_id ON nhtsa_investigations (nhtsa_id);
CREATE INDEX IF NOT EXISTS idx_investigations_number ON nhtsa_investigations (investigation_number);
CREATE INDEX IF NOT EXISTS idx_investigations_vehicle_lookup ON nhtsa_investigations (model_year_start, model_year_end, make, model);
CREATE INDEX IF NOT EXISTS idx_investigations_type ON nhtsa_investigations (investigation_type);
CREATE INDEX IF NOT EXISTS idx_investigations_status ON nhtsa_investigations (status);
CREATE INDEX IF NOT EXISTS idx_investigations_dates ON nhtsa_investigations (open_date, close_date);
CREATE INDEX IF NOT EXISTS idx_investigations_severity ON nhtsa_investigations (death_count, injury_count, crash_count, fire_count);

-- Enable RLS
ALTER TABLE nhtsa_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE nhtsa_investigations ENABLE ROW LEVEL SECURITY;

-- RLS policies for read access
CREATE POLICY "Allow read access to nhtsa_complaints" ON nhtsa_complaints
    FOR SELECT USING (true);

CREATE POLICY "Allow read access to nhtsa_investigations" ON nhtsa_investigations
    FOR SELECT USING (true);

-- Add helpful comments
COMMENT ON TABLE nhtsa_complaints IS 'NHTSA consumer complaints and safety concerns for vehicles';
COMMENT ON TABLE nhtsa_investigations IS 'NHTSA safety investigations and defect evaluations';

COMMENT ON COLUMN nhtsa_complaints.nhtsa_id IS 'NHTSA complaint identifier';
COMMENT ON COLUMN nhtsa_complaints.odi_number IS 'Office of Defects Investigation number';
COMMENT ON COLUMN nhtsa_complaints.severity_level IS 'Computed severity based on crashes, fires, injuries, deaths';

COMMENT ON COLUMN nhtsa_investigations.investigation_type IS 'PE, EA, IR, etc.';
COMMENT ON COLUMN nhtsa_investigations.potential_units_affected IS 'Estimated number of vehicles affected';

-- Create RPC function for upserting complaints
CREATE OR REPLACE FUNCTION rpc_upsert_complaints(p_payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_nhtsa_id TEXT;
    v_result JSONB;
    v_count INTEGER := 0;
    complaint_record JSONB;
BEGIN
    -- Process array of complaints
    FOR complaint_record IN SELECT jsonb_array_elements(p_payload)
    LOOP
        v_nhtsa_id := complaint_record->>'nhtsa_id';
        
        -- Validate required fields
        IF v_nhtsa_id IS NULL OR 
           (complaint_record->>'make') IS NULL OR 
           (complaint_record->>'model') IS NULL THEN
            CONTINUE; -- Skip invalid records
        END IF;

        -- Upsert complaint
        INSERT INTO nhtsa_complaints (
            nhtsa_id, odi_number, incident_date, report_date,
            component_category, component_description, summary,
            failure_description, consequence_description, corrective_action,
            model_year, make, model, vin, mileage,
            crash_occurred, fire_occurred, injury_occurred, death_occurred,
            num_injuries, num_deaths, consumer_location, vehicle_speed_mph,
            complaint_type, severity_level, raw_payload, source, updated_at
        ) VALUES (
            v_nhtsa_id,
            complaint_record->>'odi_number',
            (complaint_record->>'incident_date')::DATE,
            (complaint_record->>'report_date')::DATE,
            complaint_record->>'component_category',
            complaint_record->>'component_description',
            complaint_record->>'summary',
            complaint_record->>'failure_description',
            complaint_record->>'consequence_description',
            complaint_record->>'corrective_action',
            (complaint_record->>'model_year')::SMALLINT,
            UPPER(TRIM(complaint_record->>'make')),
            UPPER(TRIM(complaint_record->>'model')),
            complaint_record->>'vin',
            (complaint_record->>'mileage')::INTEGER,
            COALESCE((complaint_record->>'crash_occurred')::BOOLEAN, FALSE),
            COALESCE((complaint_record->>'fire_occurred')::BOOLEAN, FALSE),
            COALESCE((complaint_record->>'injury_occurred')::BOOLEAN, FALSE),
            COALESCE((complaint_record->>'death_occurred')::BOOLEAN, FALSE),
            COALESCE((complaint_record->>'num_injuries')::INTEGER, 0),
            COALESCE((complaint_record->>'num_deaths')::INTEGER, 0),
            complaint_record->>'consumer_location',
            (complaint_record->>'vehicle_speed_mph')::INTEGER,
            complaint_record->>'complaint_type',
            CASE 
                WHEN COALESCE((complaint_record->>'death_occurred')::BOOLEAN, FALSE) THEN 'CRITICAL'
                WHEN COALESCE((complaint_record->>'injury_occurred')::BOOLEAN, FALSE) THEN 'HIGH'
                WHEN COALESCE((complaint_record->>'crash_occurred')::BOOLEAN, FALSE) OR 
                     COALESCE((complaint_record->>'fire_occurred')::BOOLEAN, FALSE) THEN 'MEDIUM'
                ELSE 'LOW'
            END,
            complaint_record,
            COALESCE(complaint_record->>'source', 'NHTSA_API'),
            NOW()
        )
        ON CONFLICT (nhtsa_id)
        DO UPDATE SET
            odi_number = EXCLUDED.odi_number,
            incident_date = EXCLUDED.incident_date,
            component_category = EXCLUDED.component_category,
            summary = EXCLUDED.summary,
            raw_payload = EXCLUDED.raw_payload,
            updated_at = NOW();

        v_count := v_count + 1;
    END LOOP;

    v_result := jsonb_build_object(
        'success', true,
        'processed_count', v_count,
        'timestamp', NOW()
    );

    RETURN v_result;

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'timestamp', NOW()
        );
END;
$$;

-- Create RPC function for upserting investigations
CREATE OR REPLACE FUNCTION rpc_upsert_investigations(p_payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_nhtsa_id TEXT;
    v_result JSONB;
    v_count INTEGER := 0;
    investigation_record JSONB;
BEGIN
    -- Process array of investigations
    FOR investigation_record IN SELECT jsonb_array_elements(p_payload)
    LOOP
        v_nhtsa_id := investigation_record->>'nhtsa_id';
        
        -- Validate required fields
        IF v_nhtsa_id IS NULL OR 
           (investigation_record->>'make') IS NULL OR 
           (investigation_record->>'model') IS NULL OR
           (investigation_record->>'investigation_type') IS NULL THEN
            CONTINUE; -- Skip invalid records
        END IF;

        -- Upsert investigation
        INSERT INTO nhtsa_investigations (
            nhtsa_id, investigation_type, investigation_number,
            open_date, close_date, status, subject, summary,
            action, closure_type, model_year_start, model_year_end,
            make, model, potential_units_affected,
            death_count, injury_count, crash_count, fire_count,
            component_category, defect_category, consequence_category,
            raw_payload, source, updated_at
        ) VALUES (
            v_nhtsa_id,
            investigation_record->>'investigation_type',
            investigation_record->>'investigation_number',
            (investigation_record->>'open_date')::DATE,
            (investigation_record->>'close_date')::DATE,
            investigation_record->>'status',
            investigation_record->>'subject',
            investigation_record->>'summary',
            investigation_record->>'action',
            investigation_record->>'closure_type',
            (investigation_record->>'model_year_start')::SMALLINT,
            (investigation_record->>'model_year_end')::SMALLINT,
            UPPER(TRIM(investigation_record->>'make')),
            UPPER(TRIM(investigation_record->>'model')),
            (investigation_record->>'potential_units_affected')::INTEGER,
            COALESCE((investigation_record->>'death_count')::INTEGER, 0),
            COALESCE((investigation_record->>'injury_count')::INTEGER, 0),
            COALESCE((investigation_record->>'crash_count')::INTEGER, 0),
            COALESCE((investigation_record->>'fire_count')::INTEGER, 0),
            investigation_record->>'component_category',
            investigation_record->>'defect_category',
            investigation_record->>'consequence_category',
            investigation_record,
            COALESCE(investigation_record->>'source', 'NHTSA_API'),
            NOW()
        )
        ON CONFLICT (nhtsa_id)
        DO UPDATE SET
            status = EXCLUDED.status,
            close_date = EXCLUDED.close_date,
            summary = EXCLUDED.summary,
            action = EXCLUDED.action,
            raw_payload = EXCLUDED.raw_payload,
            updated_at = NOW();

        v_count := v_count + 1;
    END LOOP;

    v_result := jsonb_build_object(
        'success', true,
        'processed_count', v_count,
        'timestamp', NOW()
    );

    RETURN v_result;

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'timestamp', NOW()
        );
END;
$$;

-- Create helper functions for complaints analysis
CREATE OR REPLACE FUNCTION get_complaints_summary(
    p_year INTEGER,
    p_make TEXT,
    p_model TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'vehicle', jsonb_build_object(
            'year', p_year,
            'make', p_make,
            'model', p_model
        ),
        'total_complaints', COUNT(*),
        'critical_complaints', COUNT(*) FILTER (WHERE severity_level = 'CRITICAL'),
        'high_complaints', COUNT(*) FILTER (WHERE severity_level = 'HIGH'),
        'medium_complaints', COUNT(*) FILTER (WHERE severity_level = 'MEDIUM'),
        'low_complaints', COUNT(*) FILTER (WHERE severity_level = 'LOW'),
        'crash_related', COUNT(*) FILTER (WHERE crash_occurred = true),
        'fire_related', COUNT(*) FILTER (WHERE fire_occurred = true),
        'injury_related', COUNT(*) FILTER (WHERE injury_occurred = true),
        'death_related', COUNT(*) FILTER (WHERE death_occurred = true),
        'total_injuries', COALESCE(SUM(num_injuries), 0),
        'total_deaths', COALESCE(SUM(num_deaths), 0),
        'common_components', (
            SELECT jsonb_agg(jsonb_build_object('component', component_category, 'count', cnt))
            FROM (
                SELECT component_category, COUNT(*) as cnt
                FROM nhtsa_complaints 
                WHERE model_year = p_year 
                  AND UPPER(make) = UPPER(p_make) 
                  AND UPPER(model) = UPPER(p_model)
                  AND component_category IS NOT NULL
                GROUP BY component_category
                ORDER BY cnt DESC
                LIMIT 5
            ) top_components
        ),
        'recent_complaints', (
            SELECT jsonb_agg(jsonb_build_object(
                'date', report_date,
                'summary', LEFT(summary, 100),
                'component', component_category,
                'severity', severity_level
            ))
            FROM (
                SELECT report_date, summary, component_category, severity_level
                FROM nhtsa_complaints 
                WHERE model_year = p_year 
                  AND UPPER(make) = UPPER(p_make) 
                  AND UPPER(model) = UPPER(p_model)
                ORDER BY report_date DESC
                LIMIT 5
            ) recent
        )
    )
    INTO v_result
    FROM nhtsa_complaints
    WHERE model_year = p_year 
      AND UPPER(make) = UPPER(p_make) 
      AND UPPER(model) = UPPER(p_model);

    RETURN COALESCE(v_result, jsonb_build_object(
        'vehicle', jsonb_build_object('year', p_year, 'make', p_make, 'model', p_model),
        'total_complaints', 0,
        'message', 'No complaints found'
    ));
END;
$$;

-- Create helper function for investigations analysis
CREATE OR REPLACE FUNCTION get_investigations_summary(
    p_year INTEGER,
    p_make TEXT,
    p_model TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'vehicle', jsonb_build_object(
            'year', p_year,
            'make', p_make,
            'model', p_model
        ),
        'total_investigations', COUNT(*),
        'open_investigations', COUNT(*) FILTER (WHERE status = 'OPEN'),
        'closed_investigations', COUNT(*) FILTER (WHERE status = 'CLOSED'),
        'preliminary_evaluations', COUNT(*) FILTER (WHERE investigation_type = 'PE'),
        'engineering_analyses', COUNT(*) FILTER (WHERE investigation_type = 'EA'),
        'total_units_affected', COALESCE(SUM(potential_units_affected), 0),
        'total_deaths', COALESCE(SUM(death_count), 0),
        'total_injuries', COALESCE(SUM(injury_count), 0),
        'total_crashes', COALESCE(SUM(crash_count), 0),
        'total_fires', COALESCE(SUM(fire_count), 0),
        'recent_investigations', (
            SELECT jsonb_agg(jsonb_build_object(
                'number', investigation_number,
                'type', investigation_type,
                'status', status,
                'subject', LEFT(subject, 100),
                'open_date', open_date,
                'close_date', close_date
            ))
            FROM (
                SELECT investigation_number, investigation_type, status, subject, open_date, close_date
                FROM nhtsa_investigations 
                WHERE (model_year_start <= p_year AND model_year_end >= p_year)
                  AND UPPER(make) = UPPER(p_make) 
                  AND UPPER(model) = UPPER(p_model)
                ORDER BY open_date DESC
                LIMIT 5
            ) recent
        )
    )
    INTO v_result
    FROM nhtsa_investigations
    WHERE (model_year_start <= p_year AND model_year_end >= p_year)
      AND UPPER(make) = UPPER(p_make) 
      AND UPPER(model) = UPPER(p_model);

    RETURN COALESCE(v_result, jsonb_build_object(
        'vehicle', jsonb_build_object('year', p_year, 'make', p_make, 'model', p_model),
        'total_investigations', 0,
        'message', 'No investigations found'
    ));
END;
$$;

-- Insert sample data for testing
INSERT INTO nhtsa_complaints (
    nhtsa_id, odi_number, incident_date, report_date,
    component_category, summary, model_year, make, model,
    crash_occurred, fire_occurred, injury_occurred, severity_level, source
) VALUES 
(
    'COMP_10001', 'ODI-2023-001', '2023-05-15', '2023-05-20',
    'ENGINE AND ENGINE COOLING', 'Engine stalled while driving on highway causing near miss accident',
    2023, 'TOYOTA', 'CAMRY',
    false, false, false, 'MEDIUM', 'NHTSA_API'
),
(
    'COMP_10002', 'ODI-2023-002', '2023-06-10', '2023-06-12',
    'SERVICE BRAKES', 'Brake pedal went to floor, vehicle crashed into barrier',
    2023, 'HONDA', 'CIVIC',
    true, false, true, 'HIGH', 'NHTSA_API'
),
(
    'COMP_10003', 'ODI-2023-003', '2023-07-08', '2023-07-10',
    'ELECTRICAL SYSTEM', 'Vehicle caught fire in driveway due to electrical fault',
    2023, 'FORD', 'F-150',
    false, true, false, 'HIGH', 'NHTSA_API'
)
ON CONFLICT (nhtsa_id) DO NOTHING;

INSERT INTO nhtsa_investigations (
    nhtsa_id, investigation_type, investigation_number,
    open_date, status, subject, model_year_start, model_year_end,
    make, model, potential_units_affected, source
) VALUES 
(
    'INV_20001', 'PE', 'PE23-001', '2023-08-01', 'OPEN',
    'Engine stall complaints in certain model year vehicles',
    2022, 2023, 'TOYOTA', 'CAMRY', 125000, 'NHTSA_API'
),
(
    'INV_20002', 'EA', 'EA23-002', '2023-09-15', 'OPEN',
    'Brake system failure investigation',
    2023, 2024, 'HONDA', 'CIVIC', 89000, 'NHTSA_API'
),
(
    'INV_20003', 'PE', 'PE23-003', '2023-07-20', 'CLOSED',
    'Electrical fire investigation concluded',
    2022, 2023, 'FORD', 'F-150', 200000, 'NHTSA_API'
)
ON CONFLICT (nhtsa_id) DO NOTHING;
