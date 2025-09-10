# Canonical required keys for comps
CANON_REQUIRED = ["source","year","make","model","price","mileage"]

def _to_int(x, default=0):
    try:
        return int(str(x).replace(",", "").strip())
    except Exception:
        return default

def _strip(x):
    return str(x).strip() if x is not None else ""

def _canonize_one(raw: dict) -> dict:
    # Make all keys lower-case for robust mapping
    r = {k.lower(): v for k, v in (raw or {}).items()}
    # aliasing
    if "mileage" not in r and "miles" in r:
        r["mileage"] = r.pop("miles")
    if "price" in r:
        r["price"] = _to_int(r["price"])
    if "mileage" in r:
        r["mileage"] = _to_int(r["mileage"])
    if "year" in r:
        r["year"] = _to_int(r["year"])
    # always preserve/canonicalize 'source'
    if "source" in r and r["source"] is not None:
        r["source"] = _strip(r["source"])
    else:
        # fallback: try to infer from known fields (e.g., if 'dealer' or 'platform' present)
        if "dealer" in r and r["dealer"]:
            r["source"] = _strip(r["dealer"])
        elif "platform" in r and r["platform"]:
            r["source"] = _strip(r["platform"])
        else:
            print(f"[DEBUG] No 'source' found in record, setting to 'UNKNOWN'. Keys: {sorted(r.keys())}")
            r["source"] = "UNKNOWN"
    # strings
    for k in ["make","model","trim","city","state","zip","vin","fuel_type","drive_type","transmission"]:
        if k in r and r[k] is not None:
            r[k] = _strip(r[k])
    # defaults
    r.setdefault("features", [])
    r.setdefault("certified_pre_owned", False)
    # finalize
    return r

def normalize_listing(raw):
    """
    Accept:
      - single record dict
      - {"listings":[...]} dict
      - list of records
    Return:
      - single canonical record if input was a single dict
      - list of canonical records if input was list-like
    """
    if raw is None:
        raise ValueError("empty record")
    if isinstance(raw, dict) and "listings" in raw and isinstance(raw["listings"], list):
        normed = [_canonize_one(x) for x in raw["listings"]]
        for rec in normed:
            if "source" not in rec or not rec["source"]:
                print(f"[DEBUG] [Google-level] 'source' missing after normalization: {rec}")
        return normed
    if isinstance(raw, list):
        normed = [_canonize_one(x) for x in raw]
        for rec in normed:
            if "source" not in rec or not rec["source"]:
                print(f"[DEBUG] [Google-level] 'source' missing after normalization: {rec}")
        return normed
    if isinstance(raw, dict):
        rec = _canonize_one(raw)
        if "source" not in rec or not rec["source"]:
            print(f"[DEBUG] [Google-level] 'source' missing after normalization: {rec}")
        return rec
    raise ValueError(f"unsupported input type: {type(raw)}")
"""
Utility to normalize raw vehicle listings (CarGurus, CarMax, AutoTrader, etc.)
into the canonical VehicleDataForValuation schema for direct ingestion by the
valuation engine.

Usage:
    from val_engine.utils.normalize_listing import normalize_listing
    norm = normalize_listing(raw_listing_dict)

Optionally, use the CLI to batch-process a JSON file:
    python -m val_engine.utils.normalize_listing input.json output.json
"""
import re
from datetime import datetime


if __name__ == "__main__":
    import sys, json
    if len(sys.argv) != 3:
        print("Usage: python -m val_engine.utils.normalize_listing input.json output.json")
        sys.exit(1)
    with open(sys.argv[1]) as f:
        listings = json.load(f)
    if isinstance(listings, dict) and "listings" in listings:
        listings = listings["listings"]
    normed = [normalize_listing(l) for l in listings]
    with open(sys.argv[2], "w") as f:
        json.dump(normed, f, indent=2, default=str)
    print(f"Wrote {len(normed)} normalized listings to {sys.argv[2]}")
