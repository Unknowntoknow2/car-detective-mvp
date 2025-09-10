#!/usr/bin/env python3
import argparse, json, os, glob, statistics
from typing import Any, Dict, List
import pandas as pd

# Your normalizer now maps miles -> mileage and handles list/single
from val_engine.utils.normalize_listing import normalize_listing

REQ_KEYS = ["source","year","make","model","price","mileage"]
MIN_YEAR, MAX_YEAR = 1990, 2100
MIN_PRICE, MAX_PRICE = 1000, 200000
MIN_MILES, MAX_MILES = 0, 400000

def read_json(p: str) -> List[Dict[str, Any]]:
    with open(p) as f:
        obj = json.load(f)
    if isinstance(obj, dict) and "listings" in obj and isinstance(obj["listings"], list):
        return obj["listings"]
    if isinstance(obj, dict):
        return [obj]
    if isinstance(obj, list):
        return obj
    return []

def read_csv(p: str) -> List[Dict[str, Any]]:
    df = pd.read_csv(p, low_memory=False)
    return df.to_dict(orient="records")

def iter_inputs(paths: List[str]) -> List[Dict[str, Any]]:
    recs: List[Dict[str, Any]] = []
    files: List[str] = []
    for inp in paths:
        if os.path.isdir(inp):
            files += glob.glob(os.path.join(inp, "**", "*.*"), recursive=True)
        else:
            files.append(inp)
    for p in files:
        ext = os.path.splitext(p)[1].lower()
        try:
            if ext == ".json":
                recs += read_json(p)
            elif ext == ".csv":
                recs += read_csv(p)
        except Exception as e:
            print(f"[WARN] skipped {p}: {e}")
    return recs

def _to_int(x, default=0):
    try:
        return int(str(x).replace(",", "").strip())
    except Exception:
        return default

def has_keys(r: Dict[str, Any]) -> bool:
    missing = [k for k in REQ_KEYS if k not in r]
    if missing:
        print(f"[DEBUG] Record missing keys: {missing}\n  Record keys: {sorted(r.keys())}")
        return False
    return True

def valid_ranges(r: Dict[str, Any]) -> bool:
    year = _to_int(r.get("year"))
    price = _to_int(r.get("price"))
    miles = _to_int(r.get("mileage"))
    if not (MIN_YEAR <= year <= MAX_YEAR): return False
    if not (MIN_PRICE <= price <= MAX_PRICE): return False
    if not (MIN_MILES <= miles <= MAX_MILES): return False
    return True

def dedupe_key(rec: Dict[str, Any]) -> tuple:
    vin = (rec.get("vin") or "").strip().upper()
    if vin:
        return ("VIN", vin)
    return (
        "CMP",
        (rec.get("source") or "").strip().lower(),
        _to_int(rec.get("year")),
        (rec.get("trim") or "").strip().upper(),
        _to_int(rec.get("price")),
        _to_int(rec.get("mileage")),
        (rec.get("city") or "").strip().upper(),
    )

def iqr_trim_by_bucket(records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Optional: price IQR trim per (year, trim) bucket; requires >=8 per bucket."""
    if not records:
        return records
    buckets: Dict[tuple, List[Dict[str, Any]]] = {}
    for r in records:
        b = (_to_int(r.get("year")), (r.get("trim") or "").upper())
        buckets.setdefault(b, []).append(r)
    kept: List[Dict[str, Any]] = []
    for b, items in buckets.items():
        ps = sorted(_to_int(i["price"]) for i in items)
        if len(ps) >= 8:
            q1 = statistics.quantiles(ps, n=4)[0]
            q3 = statistics.quantiles(ps, n=4)[2]
            iqr = q3 - q1
            lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr
            for i in items:
                p = _to_int(i["price"])
                if lo <= p <= hi:
                    kept.append(i)
        else:
            kept.extend(items)
    return kept

def main():
    ap = argparse.ArgumentParser(description="Merge & normalize vehicle comps into one canonical JSON.")
    ap.add_argument("inputs", nargs="+", help="Files or folders (JSON/CSV or dirs)")
    ap.add_argument("--out", required=True, help="Output path, e.g. in_out/merged_camry_comps.json")
    ap.add_argument("--expect-make", default="", help="Filter to make (e.g., TOYOTA)")
    ap.add_argument("--expect-model", default="", help="Filter to model (e.g., CAMRY)")
    ap.add_argument("--drop-outliers", action="store_true", help="Trim price outliers (IQR) per (year,trim)")
    args = ap.parse_args()

    # 1) Gather raw rows
    raw = iter_inputs(args.inputs)
    if not raw:
        raise SystemExit("No inputs found.")

    # 2) Normalize (normalizer may return list or single)
    normalized: List[Dict[str, Any]] = []
    norm_fail: List[Dict[str, Any]] = []
    dropped_missing: List[Dict[str, Any]] = []
    dropped_range: List[Dict[str, Any]] = []

    for r in raw:
        print(f"[DEBUG] Raw record keys: {sorted(r.keys())}")
        try:
            n = normalize_listing(r)
            items = n if isinstance(n, list) else [n]
            for rec in items:
                print(f"[DEBUG] Normalized record keys: {sorted(rec.keys())}")
                # Enforce filters (make/model) after normalization
                if args.expect_make and (rec.get("make", "").upper() != args.expect_make.upper()):
                    continue
                if args.expect_model and (rec.get("model", "").upper() != args.expect_model.upper()):
                    continue
                if not has_keys(rec):
                    dropped_missing.append(rec)
                    continue
                if not valid_ranges(rec):
                    dropped_range.append(rec)
                    continue
                normalized.append(rec)
        except Exception as e:
            norm_fail.append({"error": str(e), "record": r})

    # 3) Optional outlier trim (after we have a clean, canonical set)
    if args.drop_outliers and normalized:
        normalized = iqr_trim_by_bucket(normalized)


    unique: List[Dict[str, Any]] = []
    if normalized:
        seen = set()
        for rec in normalized:
            k = dedupe_key(rec)
            if k not in seen:
                unique.append(rec)
                seen.add(k)

    # 5) Save
    os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
    with open(args.out, "w") as f:
        json.dump({"listings": unique}, f, indent=2)

    # 6) Debug summary
    print(
        f"Saved {args.out} | inputs={len(raw)} "
        f"normalized_accepted={len(normalized)} unique={len(unique)} "
        f"norm_fail={len(norm_fail)} dropped_missing={len(dropped_missing)} dropped_range={len(dropped_range)}"
    )
    if norm_fail:
        print(f"[DEBUG] normalize_failed: {len(norm_fail)} (showing up to 3)")
        for x in norm_fail[:3]:
            print("  -", x["error"])
    if dropped_missing:
        print(f"[DEBUG] dropped_missing_keys: {len(dropped_missing)} (e.g., first)")
        dm = dropped_missing[0]
        print("   sample keys:", sorted(dm.keys()))
    if dropped_range:
        print(f"[DEBUG] dropped_bad_ranges: {len(dropped_range)} (e.g., first)")
        dr = dropped_range[0]
        print("   sample:", {"year": dr.get("year"), "price": dr.get("price"), "mileage": dr.get("mileage")})

if __name__ == "__main__":
    main()
#!/usr/bin/env python3

import argparse, json, os, glob, statistics
from typing import Any, Dict, List
import pandas as pd

# Require your normalizer
from val_engine.utils.normalize_listing import normalize_listing  # must be importable

REQ_KEYS = ["source","year","make","model","price","mileage"]
MIN_YEAR, MAX_YEAR = 1990, 2100
MIN_PRICE, MAX_PRICE = 1000, 200000
MIN_MILES, MAX_MILES = 0, 400000

def read_json(p:str)->List[Dict[str,Any]]:
    with open(p) as f:
        obj=json.load(f)
    if isinstance(obj, dict) and "listings" in obj and isinstance(obj["listings"], list):
        return obj["listings"]
    if isinstance(obj, dict):
        return [obj]
    if isinstance(obj, list):
        return obj
    return []

def read_csv(p:str)->List[Dict[str,Any]]:
    df=pd.read_csv(p, low_memory=False)
    return df.to_dict(orient="records")

def iter_inputs(paths:List[str])->List[Dict[str,Any]]:
    recs=[]
    files=[]
    for inp in paths:
        if os.path.isdir(inp):
            files += glob.glob(os.path.join(inp, "**", "*.*"), recursive=True)
        else:
            files.append(inp)
    for p in files:
        ext=os.path.splitext(p)[1].lower()
        try:
            if ext==".json": recs+=read_json(p)
            elif ext==".csv": recs+=read_csv(p)
        except Exception as e:
            print(f"[WARN] skipped {p}: {e}")
    return recs

def _to_int(x, default=0):
    try: return int(str(x).replace(",",""))
    except: return default

def valid_ranges(r:Dict[str,Any])->bool:
    year=_to_int(r.get("year")); price=_to_int(r.get("price")); mileage=_to_int(r.get("mileage"))
    if not (MIN_YEAR <= year <= MAX_YEAR): return False
    if not (MIN_PRICE <= price <= MAX_PRICE): return False
    if not (MIN_MILES <= mileage <= MAX_MILES): return False
    return True

def has_keys(r:Dict[str,Any])->bool:
    return all(k in r for k in REQ_KEYS)

def key(rec:Dict[str,Any])->tuple:
    vin=(rec.get("vin") or "").strip().upper()
    if vin: return ("VIN", vin)
    # fallback composite key (deterministic)
    return ("CMP",
            (rec.get("source") or "").strip().lower(),
            _to_int(rec.get("year")), (rec.get("trim") or "").strip().upper(),
            _to_int(rec.get("price")), _to_int(rec.get("mileage")),
            (rec.get("city") or "").strip().upper())

def main():
    # ...existing code...
    ap=argparse.ArgumentParser(description="Merge & normalize vehicle comps into one canonical JSON.")
    ap.add_argument("inputs", nargs="+", help="Files or folders (JSON/CSV or dirs)")
    ap.add_argument("--out", required=True, help="Output path, e.g. in_out/merged_camry_comps.json")
    ap.add_argument("--expect-make", default="", help="Filter to make (e.g., TOYOTA)")
    ap.add_argument("--expect-model", default="", help="Filter to model (e.g., CAMRY)")
    ap.add_argument("--drop-outliers", action="store_true", help="Trim price outliers (IQR) after normalization")
    args=ap.parse_args()

    raw=iter_inputs(args.inputs)
    if not raw:
        raise SystemExit("No inputs found.")

    normalized=[]
    dropped_missing=[]
    dropped_range=[]
    norm_fail=[]
    for r in raw:
        try:
            n=normalize_listing(r)
            items = n if isinstance(n, list) else [n]
            for rec in items:
                if args.expect_make and rec.get("make","").upper()!=args.expect_make.upper(): 
                    continue
                if args.expect_model and rec.get("model","").upper()!=args.expect_model.upper(): 
                    continue
                if not has_keys(rec):
                    dropped_missing.append(rec)
                    continue
                if not valid_ranges(rec):
                    dropped_range.append(rec)
                    continue
                normalized.append(rec)
        except Exception as e:
            norm_fail.append({"error":str(e),"record":r})

    # dedupe (after normalization and outlier trim)
    seen=set(); out_list=[]
    for n in normalized:
        k=key(n)
        if k not in seen:
            out_list.append(n); seen.add(k)

    # optional outlier trim by price IQR (per year/trim bucket)
    if args.drop_outliers and normalized:
        by_bucket={}
        for n in normalized:
            b=(n.get("year"), (n.get("trim") or "").upper())
            by_bucket.setdefault(b, []).append(n)
        kept=[]
        for b, items in by_bucket.items():
            ps=[_to_int(i["price"]) for i in items]
            ps_sorted=sorted(ps)
            if len(ps_sorted)>=8:
                q1=statistics.quantiles(ps_sorted, n=4)[0]
                q3=statistics.quantiles(ps_sorted, n=4)[2]
                iqr=q3-q1
                lo, hi = q1-1.5*iqr, q3+1.5*iqr
                for i in items:
                    p=_to_int(i["price"])
                    if lo<=p<=hi: kept.append(i)
            else:
                kept.extend(items)
        normalized=[]
        dropped_missing=[]; dropped_range=[]; norm_fail=[]
        for r in raw:
            try:
                n=normalize_listing(r)
                items = n if isinstance(n, list) else [n]
                for rec in items:
                    if args.expect_make and rec.get("make","").upper()!=args.expect_make.upper(): 
                        continue
                    if args.expect_model and rec.get("model","").upper()!=args.expect_model.upper(): 
                        continue
                    if not has_keys(rec):
                        dropped_missing.append(rec); 
                        continue
                    if not valid_ranges(rec):
                        dropped_range.append(rec); 
                        continue
                    normalized.append(rec)
            except Exception as e:
                norm_fail.append({"error":str(e),"record":r})

        # optional outlier trim by price IQR (per year/trim bucket)
        if args.drop_outliers and normalized:
            by_bucket={}
            for n in normalized:
                b=(n.get("year"), (n.get("trim") or "").upper())
                by_bucket.setdefault(b, []).append(n)
            kept=[]
            for b, items in by_bucket.items():
                ps=[_to_int(i["price"]) for i in items]
                ps_sorted=sorted(ps)
                if len(ps_sorted)>=8:
                    q1=statistics.quantiles(ps_sorted, n=4)[0]
                    q3=statistics.quantiles(ps_sorted, n=4)[2]
                    iqr=q3-q1
                    lo, hi = q1-1.5*iqr, q3+1.5*iqr
                    for i in items:
                        p=_to_int(i["price"])
                        if lo<=p<=hi: kept.append(i)
                else:
                    kept.extend(items)
            normalized=kept

    # Debug summary
    print(f"Saved {args.out} | inputs={len(raw)} normalized_accepted={len(normalized)} unique={len(out_list)}")
    if norm_fail:
        print(f"[DEBUG] normalize_failed: {len(norm_fail)} (showing up to 3)")
        for x in norm_fail[:3]:
            print("  -", x["error"])
    if dropped_missing:
        print(f"[DEBUG] dropped_missing_keys: {len(dropped_missing)} (e.g., first)")
        dm = dropped_missing[0]
        print("   sample keys:", sorted(dm.keys()))
    if dropped_range:
        print(f"[DEBUG] dropped_bad_ranges: {len(dropped_range)} (e.g., first)")
        dr = dropped_range[0]
        print("   sample:", {"year":dr.get("year"),"price":dr.get("price"),"mileage":dr.get("mileage")})
if __name__=="__main__":
    main()
