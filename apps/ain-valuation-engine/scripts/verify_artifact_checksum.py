#!/usr/bin/env python3
"""
Verifies SHA-256 of artifacts/model_bundle.joblib against artifacts/model_bundle.joblib.sha256.
If the .sha256 file doesn't exist, exits non-zero (treat as misconfigured build).
"""
from __future__ import annotations
import hashlib
from pathlib import Path
import sys

BUNDLE = Path("artifacts/model_bundle.joblib")
SUMFILE = Path(str(BUNDLE) + ".sha256")

def sha256_file(p: Path) -> str:
    h = hashlib.sha256()
    with p.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def main() -> int:
    if not BUNDLE.exists():
        print(f"[ERROR] Bundle missing at {BUNDLE.resolve()}", file=sys.stderr)
        return 2
    if not SUMFILE.exists():
        print(f"[ERROR] Checksum file missing at {SUMFILE.resolve()}", file=sys.stderr)
        return 3

    actual = sha256_file(BUNDLE)
    expected = SUMFILE.read_text().strip().split()[0]
    if actual != expected:
        print("[ERROR] SHA-256 mismatch:")
        print(f"  expected: {expected}")
        print(f"  actual  : {actual}")
        return 4
    print("Checksum OK")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
