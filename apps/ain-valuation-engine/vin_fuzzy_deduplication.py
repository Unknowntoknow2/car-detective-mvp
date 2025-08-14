"""
Advanced Fuzzy Deduplication for VINs
- Uses Levenshtein distance and field similarity for near-duplicate VIN/entity resolution.
- Ready for ML-based extension.
"""
import difflib
from typing import List, Dict, Any

# Optionally: pip install python-Levenshtein for faster distance
try:
    from Levenshtein import distance as levenshtein_distance
except ImportError:
    def levenshtein_distance(a, b):
        return sum(1 for i, j in zip(a, b) if i != j) + abs(len(a) - len(b))

def vin_similarity(vin1: str, vin2: str) -> float:
    """Return similarity score between 0 and 1 for two VINs."""
    if len(vin1) != len(vin2):
        return 0.0
    dist = levenshtein_distance(vin1, vin2)
    return 1.0 - dist / max(len(vin1), 1)

def deduplicate_vins(records: List[Dict[str, Any]], threshold: float = 0.95) -> List[Dict[str, Any]]:
    """
    Deduplicate VIN records using fuzzy matching.
    Returns a list of unique records.
    """
    unique = []
    seen = set()
    for rec in records:
        vin = rec.get('VIN')
        if not vin:
            continue
        is_dup = False
        for u in unique:
            if vin_similarity(vin, u.get('VIN', '')) >= threshold:
                is_dup = True
                break
        if not is_dup:
            unique.append(rec)
            seen.add(vin)
    return unique

def test_deduplication():
    records = [
        {"VIN": "1HGCM82633A004352", "Make": "HONDA"},
        {"VIN": "1HGCM82633A004353", "Make": "HONDA"},
        {"VIN": "1HGCM82633A004352", "Make": "HONDA"},
        {"VIN": "1HGCM82633A00435X", "Make": "HONDA"},
    ]
    deduped = deduplicate_vins(records, threshold=0.95)
    print(f"Deduplicated: {deduped}")

if __name__ == "__main__":
    test_deduplication()
