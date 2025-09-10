-- PR G: QA & Ops Golden VINs Database Schema
-- Comprehensive Quality Assurance and Operations monitoring system
-- Created: 2025-08-11

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Golden VIN test datasets table
CREATE TABLE IF NOT EXISTS golden_vins (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vin text NOT NULL UNIQUE,
    test_category text NOT NULL CHECK (test_category IN ('core', 'edge_case', 'performance', 'regional')),
    expected_results jsonb NOT NULL,
    description text,
    priority integer DEFAULT 1 CHECK (priority BETWEEN 1 AND 4), -- 1=critical, 2=high, 3=medium, 4=low
    manufacturer text,
    model_year integer CHECK (model_year BETWEEN 1980 AND 2030),
    make text,
    model text,
    is_active boolean DEFAULT true,
    tags text[], -- Additional categorization tags
    complexity_score integer DEFAULT 1 CHECK (complexity_score BETWEEN 1 AND 10),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid, -- Reference to auth.users if needed
    notes text
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_golden_vins_vin ON golden_vins(vin);
CREATE INDEX IF NOT EXISTS idx_golden_vins_category ON golden_vins(test_category);
CREATE INDEX IF NOT EXISTS idx_golden_vins_priority ON golden_vins(priority);
CREATE INDEX IF NOT EXISTS idx_golden_vins_active ON golden_vins(is_active);
CREATE INDEX IF NOT EXISTS idx_golden_vins_manufacturer ON golden_vins(manufacturer);
CREATE INDEX IF NOT EXISTS idx_golden_vins_model_year ON golden_vins(model_year);

-- QA test execution tracking table
CREATE TABLE IF NOT EXISTS qa_test_runs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    run_type text NOT NULL CHECK (run_type IN ('manual', 'scheduled', 'ci_cd', 'regression', 'performance')),
    status text NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
    total_tests integer NOT NULL DEFAULT 0,
    passed_tests integer NOT NULL DEFAULT 0,
    failed_tests integer NOT NULL DEFAULT 0,
    skipped_tests integer NOT NULL DEFAULT 0,
    execution_time_ms integer,
    trigger_source text, -- 'github_action', 'manual', 'cron', 'api'
    test_suite_version text,
    environment text DEFAULT 'production' CHECK (environment IN ('development', 'staging', 'production')),
    started_at timestamptz DEFAULT now(),
    completed_at timestamptz,
    error_summary text,
    detailed_results jsonb,
    configuration jsonb, -- Test run configuration
    git_commit_hash text,
    triggered_by uuid -- Reference to auth.users if needed
);

-- Add indexes for qa_test_runs
CREATE INDEX IF NOT EXISTS idx_qa_test_runs_status ON qa_test_runs(status);
CREATE INDEX IF NOT EXISTS idx_qa_test_runs_type ON qa_test_runs(run_type);
CREATE INDEX IF NOT EXISTS idx_qa_test_runs_started_at ON qa_test_runs(started_at);
CREATE INDEX IF NOT EXISTS idx_qa_test_runs_environment ON qa_test_runs(environment);

-- Individual test results table
CREATE TABLE IF NOT EXISTS qa_test_results (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    test_run_id uuid REFERENCES qa_test_runs(id) ON DELETE CASCADE,
    golden_vin_id uuid REFERENCES golden_vins(id) ON DELETE SET NULL,
    vin text NOT NULL,
    test_name text NOT NULL,
    test_type text NOT NULL CHECK (test_type IN ('decoder', 'safety', 'market', 'valuation', 'ui', 'integration')),
    status text NOT NULL CHECK (status IN ('passed', 'failed', 'skipped', 'error', 'timeout')),
    expected_result jsonb,
    actual_result jsonb,
    execution_time_ms integer,
    error_message text,
    error_code text,
    confidence_score decimal(5,4) CHECK (confidence_score BETWEEN 0 AND 1),
    accuracy_score decimal(5,4) CHECK (accuracy_score BETWEEN 0 AND 1),
    performance_score decimal(5,4) CHECK (performance_score BETWEEN 0 AND 1),
    created_at timestamptz DEFAULT now(),
    retry_count integer DEFAULT 0,
    stack_trace text,
    metadata jsonb -- Additional test-specific data
);

-- Add indexes for qa_test_results
CREATE INDEX IF NOT EXISTS idx_qa_test_results_run_id ON qa_test_results(test_run_id);
CREATE INDEX IF NOT EXISTS idx_qa_test_results_vin ON qa_test_results(vin);
CREATE INDEX IF NOT EXISTS idx_qa_test_results_status ON qa_test_results(status);
CREATE INDEX IF NOT EXISTS idx_qa_test_results_test_type ON qa_test_results(test_type);
CREATE INDEX IF NOT EXISTS idx_qa_test_results_created_at ON qa_test_results(created_at);

-- Operational metrics tracking table
CREATE TABLE IF NOT EXISTS operational_metrics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name text NOT NULL,
    metric_value decimal NOT NULL,
    metric_unit text, -- 'ms', 'count', 'percentage', 'bytes', 'requests_per_second'
    category text NOT NULL CHECK (category IN ('performance', 'accuracy', 'usage', 'error_rate', 'resource')),
    source_component text NOT NULL, -- 'vin_decoder', 'market_signals', 'valuation_engine', 'ui_dashboard'
    aggregation_period text DEFAULT 'instant' CHECK (aggregation_period IN ('instant', 'minute', 'hour', 'day')),
    recorded_at timestamptz DEFAULT now(),
    metadata jsonb,
    tags text[],
    threshold_min decimal,
    threshold_max decimal,
    is_within_threshold boolean GENERATED ALWAYS AS (
        CASE 
            WHEN threshold_min IS NOT NULL AND threshold_max IS NOT NULL THEN
                metric_value BETWEEN threshold_min AND threshold_max
            WHEN threshold_min IS NOT NULL THEN
                metric_value >= threshold_min
            WHEN threshold_max IS NOT NULL THEN
                metric_value <= threshold_max
            ELSE true
        END
    ) STORED
);

-- Add indexes for operational_metrics
CREATE INDEX IF NOT EXISTS idx_operational_metrics_name ON operational_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_operational_metrics_category ON operational_metrics(category);
CREATE INDEX IF NOT EXISTS idx_operational_metrics_component ON operational_metrics(source_component);
CREATE INDEX IF NOT EXISTS idx_operational_metrics_recorded_at ON operational_metrics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_operational_metrics_threshold ON operational_metrics(is_within_threshold);

-- Data validation rules table
CREATE TABLE IF NOT EXISTS validation_rules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_name text NOT NULL UNIQUE,
    rule_category text NOT NULL CHECK (rule_category IN ('data_quality', 'business_logic', 'performance', 'security')),
    validation_query text NOT NULL,
    expected_result text NOT NULL,
    severity text NOT NULL DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    is_active boolean DEFAULT true,
    description text,
    remediation_steps text,
    auto_fix_query text, -- SQL to automatically fix the issue if possible
    execution_frequency text DEFAULT 'daily' CHECK (execution_frequency IN ('continuous', 'hourly', 'daily', 'weekly')),
    last_executed_at timestamptz,
    last_result text,
    consecutive_failures integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    tags text[]
);

-- Add indexes for validation_rules
CREATE INDEX IF NOT EXISTS idx_validation_rules_category ON validation_rules(rule_category);
CREATE INDEX IF NOT EXISTS idx_validation_rules_severity ON validation_rules(severity);
CREATE INDEX IF NOT EXISTS idx_validation_rules_active ON validation_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_validation_rules_frequency ON validation_rules(execution_frequency);

-- Validation rule execution results
CREATE TABLE IF NOT EXISTS validation_executions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id uuid REFERENCES validation_rules(id) ON DELETE CASCADE,
    execution_status text NOT NULL CHECK (execution_status IN ('passed', 'failed', 'error', 'skipped')),
    actual_result text,
    execution_time_ms integer,
    error_message text,
    records_affected integer,
    executed_at timestamptz DEFAULT now(),
    executed_by text DEFAULT 'system', -- 'system', 'manual', 'scheduled'
    metadata jsonb
);

-- Add indexes for validation_executions
CREATE INDEX IF NOT EXISTS idx_validation_executions_rule_id ON validation_executions(rule_id);
CREATE INDEX IF NOT EXISTS idx_validation_executions_status ON validation_executions(execution_status);
CREATE INDEX IF NOT EXISTS idx_validation_executions_executed_at ON validation_executions(executed_at);

-- Error tracking and analysis table
CREATE TABLE IF NOT EXISTS error_tracking (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    error_type text NOT NULL,
    error_code text,
    error_message text NOT NULL,
    component_name text NOT NULL,
    function_name text,
    vin text,
    request_payload jsonb,
    response_payload jsonb,
    stack_trace text,
    user_agent text,
    ip_address inet,
    session_id text,
    user_id uuid,
    frequency_count integer DEFAULT 1,
    severity text DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    first_occurred_at timestamptz DEFAULT now(),
    last_occurred_at timestamptz DEFAULT now(),
    resolution_status text DEFAULT 'open' CHECK (resolution_status IN ('open', 'investigating', 'resolved', 'ignored', 'duplicate')),
    resolution_notes text,
    assigned_to uuid,
    resolved_at timestamptz,
    tags text[],
    impact_assessment text,
    related_errors uuid[] -- Array of related error IDs
);

-- Add indexes for error_tracking
CREATE INDEX IF NOT EXISTS idx_error_tracking_type ON error_tracking(error_type);
CREATE INDEX IF NOT EXISTS idx_error_tracking_component ON error_tracking(component_name);
CREATE INDEX IF NOT EXISTS idx_error_tracking_vin ON error_tracking(vin);
CREATE INDEX IF NOT EXISTS idx_error_tracking_status ON error_tracking(resolution_status);
CREATE INDEX IF NOT EXISTS idx_error_tracking_occurred_at ON error_tracking(last_occurred_at);
CREATE INDEX IF NOT EXISTS idx_error_tracking_severity ON error_tracking(severity);

-- System health checks table
CREATE TABLE IF NOT EXISTS health_checks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    check_name text NOT NULL,
    check_type text NOT NULL CHECK (check_type IN ('database', 'api', 'external_service', 'file_system', 'memory', 'cpu')),
    status text NOT NULL CHECK (status IN ('healthy', 'degraded', 'unhealthy', 'unknown')),
    response_time_ms integer,
    details jsonb,
    threshold_warning decimal,
    threshold_critical decimal,
    checked_at timestamptz DEFAULT now(),
    next_check_at timestamptz,
    check_interval_seconds integer DEFAULT 300, -- 5 minutes default
    consecutive_failures integer DEFAULT 0,
    last_healthy_at timestamptz,
    metadata jsonb
);

-- Add indexes for health_checks
CREATE INDEX IF NOT EXISTS idx_health_checks_name ON health_checks(check_name);
CREATE INDEX IF NOT EXISTS idx_health_checks_type ON health_checks(check_type);
CREATE INDEX IF NOT EXISTS idx_health_checks_status ON health_checks(status);
CREATE INDEX IF NOT EXISTS idx_health_checks_checked_at ON health_checks(checked_at);
CREATE INDEX IF NOT EXISTS idx_health_checks_next_check ON health_checks(next_check_at);

-- Create materialized view for test summary statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS qa_test_summary AS
SELECT 
    DATE(tr.started_at) as test_date,
    tr.run_type,
    tr.environment,
    COUNT(*) as total_runs,
    SUM(tr.total_tests) as total_tests,
    SUM(tr.passed_tests) as passed_tests,
    SUM(tr.failed_tests) as failed_tests,
    SUM(tr.skipped_tests) as skipped_tests,
    ROUND(AVG(tr.execution_time_ms)) as avg_execution_time_ms,
    ROUND((SUM(tr.passed_tests)::decimal / NULLIF(SUM(tr.total_tests), 0)) * 100, 2) as pass_rate_percentage
FROM qa_test_runs tr
WHERE tr.status = 'completed'
GROUP BY DATE(tr.started_at), tr.run_type, tr.environment
ORDER BY test_date DESC, tr.run_type;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_qa_test_summary_date ON qa_test_summary(test_date);

-- Create materialized view for operational metrics summary
CREATE MATERIALIZED VIEW IF NOT EXISTS operational_metrics_summary AS
SELECT 
    DATE(om.recorded_at) as metric_date,
    om.metric_name,
    om.category,
    om.source_component,
    COUNT(*) as measurement_count,
    AVG(om.metric_value) as avg_value,
    MIN(om.metric_value) as min_value,
    MAX(om.metric_value) as max_value,
    STDDEV(om.metric_value) as stddev_value,
    COUNT(*) FILTER (WHERE NOT om.is_within_threshold) as threshold_violations
FROM operational_metrics om
GROUP BY DATE(om.recorded_at), om.metric_name, om.category, om.source_component
ORDER BY metric_date DESC, om.metric_name;

-- Create index on operational metrics materialized view
CREATE INDEX IF NOT EXISTS idx_operational_metrics_summary_date ON operational_metrics_summary(metric_date);

-- Create materialized view for error analysis
CREATE MATERIALIZED VIEW IF NOT EXISTS error_analysis_summary AS
SELECT 
    DATE(et.last_occurred_at) as error_date,
    et.error_type,
    et.component_name,
    et.severity,
    et.resolution_status,
    COUNT(*) as occurrence_count,
    SUM(et.frequency_count) as total_frequency,
    COUNT(DISTINCT et.vin) FILTER (WHERE et.vin IS NOT NULL) as unique_vins_affected,
    MIN(et.first_occurred_at) as first_occurrence,
    MAX(et.last_occurred_at) as last_occurrence
FROM error_tracking et
GROUP BY DATE(et.last_occurred_at), et.error_type, et.component_name, et.severity, et.resolution_status
ORDER BY error_date DESC, occurrence_count DESC;

-- Create index on error analysis materialized view
CREATE INDEX IF NOT EXISTS idx_error_analysis_summary_date ON error_analysis_summary(error_date);

-- Create function to refresh all materialized views
CREATE OR REPLACE FUNCTION refresh_qa_materialized_views()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY qa_test_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY operational_metrics_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY error_analysis_summary;
END;
$$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_golden_vins_updated_at 
    BEFORE UPDATE ON golden_vins 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_validation_rules_updated_at 
    BEFORE UPDATE ON validation_rules 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create RLS policies for security
ALTER TABLE golden_vins ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_test_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE operational_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_checks ENABLE ROW LEVEL SECURITY;

-- Create policies (allow authenticated users to read, service role to write)
CREATE POLICY "Allow authenticated read access" ON golden_vins FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow service role full access" ON golden_vins FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow authenticated read access" ON qa_test_runs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow service role full access" ON qa_test_runs FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow authenticated read access" ON qa_test_results FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow service role full access" ON qa_test_results FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow authenticated read access" ON operational_metrics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow service role full access" ON operational_metrics FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow authenticated read access" ON validation_rules FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow service role full access" ON validation_rules FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow authenticated read access" ON validation_executions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow service role full access" ON validation_executions FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow authenticated read access" ON error_tracking FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow service role full access" ON error_tracking FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow authenticated read access" ON health_checks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow service role full access" ON health_checks FOR ALL USING (auth.role() = 'service_role');

-- Create function to add operational metric
CREATE OR REPLACE FUNCTION add_operational_metric(
    p_metric_name text,
    p_metric_value decimal,
    p_metric_unit text DEFAULT NULL,
    p_category text DEFAULT 'performance',
    p_source_component text DEFAULT 'system',
    p_metadata jsonb DEFAULT NULL,
    p_tags text[] DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
    metric_id uuid;
BEGIN
    INSERT INTO operational_metrics (
        metric_name,
        metric_value,
        metric_unit,
        category,
        source_component,
        metadata,
        tags
    ) VALUES (
        p_metric_name,
        p_metric_value,
        p_metric_unit,
        p_category,
        p_source_component,
        p_metadata,
        p_tags
    ) RETURNING id INTO metric_id;
    
    RETURN metric_id;
END;
$$;

-- Create function to log error
CREATE OR REPLACE FUNCTION log_error(
    p_error_type text,
    p_error_message text,
    p_component_name text,
    p_error_code text DEFAULT NULL,
    p_vin text DEFAULT NULL,
    p_request_payload jsonb DEFAULT NULL,
    p_stack_trace text DEFAULT NULL,
    p_severity text DEFAULT 'medium'
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
    error_id uuid;
    existing_error_id uuid;
BEGIN
    -- Check if similar error exists in last 24 hours
    SELECT id INTO existing_error_id
    FROM error_tracking
    WHERE error_type = p_error_type
      AND component_name = p_component_name
      AND error_message = p_error_message
      AND (p_vin IS NULL OR vin = p_vin)
      AND last_occurred_at > now() - interval '24 hours'
    LIMIT 1;
    
    IF existing_error_id IS NOT NULL THEN
        -- Update existing error
        UPDATE error_tracking
        SET frequency_count = frequency_count + 1,
            last_occurred_at = now()
        WHERE id = existing_error_id;
        
        RETURN existing_error_id;
    ELSE
        -- Insert new error
        INSERT INTO error_tracking (
            error_type,
            error_message,
            component_name,
            error_code,
            vin,
            request_payload,
            stack_trace,
            severity
        ) VALUES (
            p_error_type,
            p_error_message,
            p_component_name,
            p_error_code,
            p_vin,
            p_request_payload,
            p_stack_trace,
            p_severity
        ) RETURNING id INTO error_id;
        
        RETURN error_id;
    END IF;
END;
$$;

-- Create function to run health check
CREATE OR REPLACE FUNCTION run_health_check(
    p_check_name text,
    p_check_type text,
    p_status text,
    p_response_time_ms integer DEFAULT NULL,
    p_details jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO health_checks (
        check_name,
        check_type,
        status,
        response_time_ms,
        details,
        next_check_at
    ) VALUES (
        p_check_name,
        p_check_type,
        p_status,
        p_response_time_ms,
        p_details,
        now() + interval '5 minutes'
    )
    ON CONFLICT (check_name) DO UPDATE SET
        check_type = EXCLUDED.check_type,
        status = EXCLUDED.status,
        response_time_ms = EXCLUDED.response_time_ms,
        details = EXCLUDED.details,
        checked_at = now(),
        next_check_at = now() + interval '5 minutes',
        consecutive_failures = CASE 
            WHEN EXCLUDED.status = 'healthy' THEN 0
            ELSE health_checks.consecutive_failures + 1
        END,
        last_healthy_at = CASE 
            WHEN EXCLUDED.status = 'healthy' THEN now()
            ELSE health_checks.last_healthy_at
        END;
END;
$$;

-- Add unique constraint on health check names
ALTER TABLE health_checks ADD CONSTRAINT unique_health_check_name UNIQUE (check_name);

-- Add comments for documentation
COMMENT ON TABLE golden_vins IS 'Curated test VIN dataset with expected results for QA validation';
COMMENT ON TABLE qa_test_runs IS 'Automated test execution tracking and results';
COMMENT ON TABLE qa_test_results IS 'Individual test case results with detailed metrics';
COMMENT ON TABLE operational_metrics IS 'Real-time system performance and health metrics';
COMMENT ON TABLE validation_rules IS 'Configurable data quality and business logic validation rules';
COMMENT ON TABLE validation_executions IS 'Execution history of validation rules';
COMMENT ON TABLE error_tracking IS 'Comprehensive error logging and analysis system';
COMMENT ON TABLE health_checks IS 'System health monitoring and alerting';

COMMENT ON FUNCTION add_operational_metric IS 'Add operational metric with automatic categorization';
COMMENT ON FUNCTION log_error IS 'Log error with automatic deduplication and frequency tracking';
COMMENT ON FUNCTION run_health_check IS 'Execute health check and update monitoring status';
COMMENT ON FUNCTION refresh_qa_materialized_views IS 'Refresh all QA-related materialized views for reporting';
