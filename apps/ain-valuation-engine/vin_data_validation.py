"""
Automated Data Validation and Trust Scoring for VIN Decoder Pipeline
- Validates completeness, consistency, and trust for decoded/enriched records.
- Flags low-trust or incomplete data for review.
"""
from typing import Dict, Any, List

REQUIRED_FIELDS = [
    "VIN", "Make", "Model", "Model Year", "Body Class", "Drive Type", "Engine Displacement (L)", "Fuel Type Primary"
]

TRUST_THRESHOLDS = {
    "min_completeness": 0.8,
    "min_consistency": 0.9,
}

def validate_record(record: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate a decoded/enriched VIN record for completeness, consistency, and trust.
    Returns validation results and trust score.
    """
    # Completeness: fraction of required fields present and non-empty
    filled = sum(1 for f in REQUIRED_FIELDS if record.get(f) not in (None, '', 'NA', 'N/A'))
    completeness = filled / len(REQUIRED_FIELDS)
    # Consistency: check for logical field relationships (e.g., Model Year is 4 digits, VIN length is 17)
    consistency = 1.0
    if record.get("VIN") and len(str(record["VIN"])) != 17:
        consistency -= 0.5
    if record.get("Model Year") and (not str(record["Model Year"]).isdigit() or len(str(record["Model Year"])) != 4):
        consistency -= 0.2
    # Trust: weighted average of completeness and consistency
    trust = 0.7 * completeness + 0.3 * consistency
    # Flag if below thresholds
    flags = []
    if completeness < TRUST_THRESHOLDS["min_completeness"]:
        flags.append("low_completeness")
    if consistency < TRUST_THRESHOLDS["min_consistency"]:
        flags.append("low_consistency")
    if trust < 0.85:
        flags.append("low_trust")
    return {
        "completeness": completeness,
        "consistency": consistency,
        "trust": trust,
        "flags": flags
    }

def validate_batch(records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [validate_record(r) for r in records]

if __name__ == "__main__":
    sample = {
        "VIN": "1HGCM82633A004352",
        "Make": "HONDA",
        "Model": "ACCORD",
        "Model Year": "2003",
        "Body Class": "Sedan/Saloon",
        "Drive Type": "4x2",
        "Engine Displacement (L)": "2.4",
        "Fuel Type Primary": "Gasoline"
    }
    print(validate_record(sample))
