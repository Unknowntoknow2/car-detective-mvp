import json, yaml, sys
from pathlib import Path

"""
Usage:
  python -m tests.assert_acceptance \
    --accept configs/acceptance.v1.yaml \
    --runs runs/2025-08-ain-v1/
"""

def load_json(p: Path):
    with p.open() as f:
        return json.load(f)

def load_yaml(p: Path):
    with p.open() as f:
        return yaml.safe_load(f)

def assert_bound(name, value, cmp, bound):
    if cmp == "max":
        assert value <= bound, f"{name}: {value} > {bound}"
    elif cmp == "min":
        assert value >= bound, f"{name}: {value} < {bound}"
    else:
        raise ValueError(cmp)

def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--accept", required=True)
    ap.add_argument("--runs", required=True)
    args = ap.parse_args()

    acc = load_yaml(Path(args.accept))
    base = Path(args.runs)

    overall = load_json(base / "metrics_overall.json")
    per_fuel = load_json(base / "metrics_by_fuel.json")

    # Overall gates
    gates = acc["metrics"]["overall"]
    assert_bound("overall.MAE",  overall["mae"],  "max", gates["mae_max_usd"])
    assert_bound("overall.RMSE", overall["rmse"], "max", gates["rmse_max_usd"])
    assert_bound("overall.MAPE", overall["mape"], "max", gates["mape_max_pct"])
    assert_bound("overall.R2",   overall["r2"],   "min", gates["r2_min"])
    assert_bound("overall.COVER",overall["coverage"], "min", gates["coverage_min_pct"])

    # Per-fuel gates
    fg = acc["metrics"]["by_fuel"]
    for fuel in ["gas", "hybrid", "ev"]:
        m = per_fuel[fuel]
        assert_bound(f"{fuel}.MAE",  m["mae"],  "max", fg[fuel]["mae_max_usd"])
        assert_bound(f"{fuel}.MAPE", m["mape"], "max", fg[fuel]["mape_max_pct"])

    # Fallback-only gate (optional file if present)
    fb_path = base / "metrics_fallback_only.json"
    if fb_path.exists():
        fb = load_json(fb_path)
        assert_bound("fallback.MAPE", fb["mape"], "max", acc["metrics"]["fallback_only"]["mape_max_pct"])

    print("✅ Acceptance passed.")

if __name__ == "__main__":
    main()
