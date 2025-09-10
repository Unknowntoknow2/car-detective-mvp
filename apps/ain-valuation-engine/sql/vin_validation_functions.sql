-- ===============================================
-- VIN Validation Functions (ISO 3779 Standard)
-- ===============================================
-- Copy-paste ready for GitHub issues

-- Regex excludes I,O,Q and enforces 17 chars
CREATE OR REPLACE FUNCTION fn_validate_vin_format(vin text)
RETURNS boolean 
LANGUAGE sql 
IMMUTABLE AS $$
  SELECT vin ~ '^[A-HJ-NPR-Z0-9]{17}$'
$$;

-- Transliteration for check digit calculation
CREATE OR REPLACE FUNCTION fn_vin_char_value(c char)
RETURNS int 
LANGUAGE sql 
IMMUTABLE AS $$
  SELECT CASE upper(c)
    WHEN 'A' THEN 1 WHEN 'B' THEN 2 WHEN 'C' THEN 3 WHEN 'D' THEN 4 WHEN 'E' THEN 5
    WHEN 'F' THEN 6 WHEN 'G' THEN 7 WHEN 'H' THEN 8
    WHEN 'J' THEN 1 WHEN 'K' THEN 2 WHEN 'L' THEN 3 WHEN 'M' THEN 4 WHEN 'N' THEN 5
    WHEN 'P' THEN 7 WHEN 'R' THEN 9
    WHEN 'S' THEN 2 WHEN 'T' THEN 3 WHEN 'U' THEN 4 WHEN 'V' THEN 5 WHEN 'W' THEN 6
    WHEN 'X' THEN 7 WHEN 'Y' THEN 8 WHEN 'Z' THEN 9
    WHEN '0' THEN 0 WHEN '1' THEN 1 WHEN '2' THEN 2 WHEN '3' THEN 3 WHEN '4' THEN 4
    WHEN '5' THEN 5 WHEN '6' THEN 6 WHEN '7' THEN 7 WHEN '8' THEN 8 WHEN '9' THEN 9
  END
$$;

-- Weights by position 1..17, skipping 9th (check digit)
CREATE OR REPLACE FUNCTION fn_vin_weight(pos int)
RETURNS int 
LANGUAGE sql 
IMMUTABLE AS $$
  SELECT CASE pos
    WHEN 1 THEN 8 WHEN 2 THEN 7 WHEN 3 THEN 6 WHEN 4 THEN 5 WHEN 5 THEN 4
    WHEN 6 THEN 3 WHEN 7 THEN 2 WHEN 8 THEN 10
    WHEN 9 THEN 0
    WHEN 10 THEN 9 WHEN 11 THEN 8 WHEN 12 THEN 7 WHEN 13 THEN 6
    WHEN 14 THEN 5 WHEN 15 THEN 4 WHEN 16 THEN 3 WHEN 17 THEN 2
  END
$$;

-- Calculate expected check digit for VIN
CREATE OR REPLACE FUNCTION fn_vin_expected_check_digit(vin text)
RETURNS text 
LANGUAGE plpgsql 
IMMUTABLE AS $$
DECLARE 
  sum int := 0; 
  ch char; 
  val int; 
  w int; 
  r int;
BEGIN
  IF NOT fn_validate_vin_format(vin) THEN 
    RETURN NULL; 
  END IF;
  
  FOR i IN 1..17 LOOP
    ch := substr(upper(vin), i, 1);
    val := fn_vin_char_value(ch);
    w := fn_vin_weight(i);
    sum := sum + (val * w);
  END LOOP;
  
  r := sum % 11;
  RETURN CASE WHEN r = 10 THEN 'X' ELSE r::text END;
END
$$;

-- Main VIN validation function (format + check digit)
CREATE OR REPLACE FUNCTION fn_validate_vin(vin text)
RETURNS boolean 
LANGUAGE plpgsql 
IMMUTABLE AS $$
DECLARE 
  exp text; 
  chk text;
BEGIN
  IF NOT fn_validate_vin_format(vin) THEN 
    RETURN false; 
  END IF;
  
  exp := fn_vin_expected_check_digit(vin);
  chk := substr(upper(vin), 9, 1);
  
  RETURN exp IS NOT NULL AND chk = exp;
END
$$;

-- VIN normalization function
CREATE OR REPLACE FUNCTION fn_normalize_vin(vin text)
RETURNS text
LANGUAGE sql
IMMUTABLE AS $$
  SELECT upper(trim(vin))
$$;

-- Example constraint usage (uncomment to apply)
-- ALTER TABLE vehicle_specs ADD CONSTRAINT vin_format_chk 
--   CHECK (fn_validate_vin_format(vin));

-- Example trigger for auto-normalization
-- CREATE OR REPLACE FUNCTION trigger_normalize_vin()
-- RETURNS trigger AS $$
-- BEGIN
--   NEW.vin := fn_normalize_vin(NEW.vin);
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER normalize_vin_trigger
--   BEFORE INSERT OR UPDATE ON vehicle_specs
--   FOR EACH ROW EXECUTE FUNCTION trigger_normalize_vin();

-- Test cases for validation
-- SELECT fn_validate_vin('1HGCM82633A004352'); -- Should return true
-- SELECT fn_validate_vin('1HGCM82633A004353'); -- Should return false (bad check digit)
-- SELECT fn_validate_vin('123');                -- Should return false (too short)
-- SELECT fn_validate_vin('1HGCM82633A00435O'); -- Should return false (contains O)
