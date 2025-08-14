"""
VIN Decoder Pipeline Integration Script
- Runs the Python VIN decoder abstraction
- Persists output to db_output.json for downstream enrichment/valuation pipeline
- FAANG-level: robust, logged, ready for scheduler/CI/CD
"""
import sys
import json
import logging
from vin_decoder_abstraction import decode_and_map

def persist_to_db_output(data, path="db_output.json"):
    try:
        with open(path, "w") as f:
            json.dump(data, f, indent=2)
        logging.info(f"Persisted decoded VIN data to {path}")
    except Exception as e:
        logging.error(f"Failed to persist data: {e}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python vin_decoder_pipeline_integration.py <VIN>")
        sys.exit(1)
    vin = sys.argv[1]
    result = decode_and_map(vin)
    print(json.dumps(result, indent=2))
    persist_to_db_output(result)

if __name__ == "__main__":
    main()
