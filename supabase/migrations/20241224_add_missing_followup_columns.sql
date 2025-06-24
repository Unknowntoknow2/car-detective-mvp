
-- Add missing columns to follow_up_answers table
ALTER TABLE follow_up_answers 
ADD COLUMN IF NOT EXISTS additional_notes text,
ADD COLUMN IF NOT EXISTS exterior_condition text DEFAULT 'good',
ADD COLUMN IF NOT EXISTS interior_condition text DEFAULT 'good', 
ADD COLUMN IF NOT EXISTS brake_condition text DEFAULT 'good',
ADD COLUMN IF NOT EXISTS features jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS serviceHistory jsonb DEFAULT '{"hasRecords": false, "frequency": "unknown", "dealerMaintained": false, "description": "", "services": []}'::jsonb;

-- Update existing records to have default values for new columns
UPDATE follow_up_answers 
SET 
  exterior_condition = COALESCE(exterior_condition, 'good'),
  interior_condition = COALESCE(interior_condition, 'good'),
  brake_condition = COALESCE(brake_condition, 'good'),
  features = COALESCE(features, '[]'::jsonb),
  additional_notes = COALESCE(additional_notes, ''),
  serviceHistory = COALESCE(serviceHistory, '{"hasRecords": false, "frequency": "unknown", "dealerMaintained": false, "description": "", "services": []}'::jsonb)
WHERE 
  exterior_condition IS NULL 
  OR interior_condition IS NULL 
  OR brake_condition IS NULL 
  OR features IS NULL 
  OR additional_notes IS NULL
  OR serviceHistory IS NULL;
