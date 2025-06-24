
-- Phase 1: Add missing columns to follow_up_answers table
ALTER TABLE follow_up_answers 
ADD COLUMN IF NOT EXISTS loan_balance numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS payoff_amount numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS transmission text DEFAULT 'automatic';

-- Update existing records to have default values for new columns
UPDATE follow_up_answers 
SET 
  loan_balance = COALESCE(loan_balance, 0),
  payoff_amount = COALESCE(payoff_amount, 0),
  transmission = COALESCE(transmission, 'automatic')
WHERE 
  loan_balance IS NULL 
  OR payoff_amount IS NULL 
  OR transmission IS NULL;

-- Add missing serviceHistory column with correct casing to match the code
ALTER TABLE follow_up_answers 
ADD COLUMN IF NOT EXISTS "serviceHistory" jsonb DEFAULT '{"hasRecords": false, "frequency": "unknown", "dealerMaintained": false, "description": "", "services": []}'::jsonb;

-- Migrate data from servicehistory to serviceHistory if needed
UPDATE follow_up_answers 
SET "serviceHistory" = COALESCE(servicehistory, '{"hasRecords": false, "frequency": "unknown", "dealerMaintained": false, "description": "", "services": []}'::jsonb)
WHERE "serviceHistory" IS NULL;
