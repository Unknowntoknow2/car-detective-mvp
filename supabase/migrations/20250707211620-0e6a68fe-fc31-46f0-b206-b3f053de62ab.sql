-- Configure ain-full-market-orchestrator function to not require JWT for internal calls
ALTER TABLE IF EXISTS valuation_requests ADD COLUMN IF NOT EXISTS request_source TEXT DEFAULT 'web';
ALTER TABLE IF EXISTS valuation_requests ADD COLUMN IF NOT EXISTS vin TEXT;

-- Update market_comps to ensure all required columns exist and have proper types
ALTER TABLE IF EXISTS market_comps 
  ALTER COLUMN listing_url SET DEFAULT '#',
  ALTER COLUMN confidence_score SET DEFAULT 85;

-- Ensure audit logs can track orchestration properly
ALTER TABLE IF EXISTS valuation_audit_logs 
  ADD COLUMN IF NOT EXISTS run_by TEXT DEFAULT 'system',
  ADD COLUMN IF NOT EXISTS event TEXT;

-- Create index for faster VIN lookups in cached valuation checks
CREATE INDEX IF NOT EXISTS idx_valuation_requests_vin_status ON valuation_requests(vin, status, created_at);
CREATE INDEX IF NOT EXISTS idx_market_comps_request_source ON market_comps(valuation_request_id, source);
CREATE INDEX IF NOT EXISTS idx_valuation_audit_logs_request ON valuation_audit_logs(valuation_request_id, action);