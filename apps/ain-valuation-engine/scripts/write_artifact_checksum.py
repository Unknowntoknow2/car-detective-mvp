#!/usr/bin/env python3
"""
Writes SHA-256 for artifacts/model_bundle.joblib into artifacts/model_bundle.joblib.sha256.
Run this right after training.
"""
from __future__ import annotations
import hashlib
from pathlib import Path

BUNDLE = Path("artifacts/model_bundle.joblib")
SUMFILE = Path(str(BUNDLE) + ".sha256")

def sha256_file(p: Path) -> str:
    h = hashlib.sha256()
    with p.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def main() -> None:
    if not BUNDLE.exists():
        raise SystemExit(f"Bundle missing at {BUNDLE.resolve()}")
    digest = sha256_file(BUNDLE)
    SUMFILE.write_text(digest + "  " + BUNDLE.name + "\n")
    print("Wrote", SUMFILE)

if __name__ == "__main__":
    main()
