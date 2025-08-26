import json
import subprocess
import sys
from pathlib import Path

BUNDLE = Path("artifacts/model_bundle.joblib")

def test_main_cli_runs_and_outputs_json():
    assert BUNDLE.exists(), "Bundle missing; run training before tests."
    cmd = [sys.executable, "val_engine/main.py", "--bundle", str(BUNDLE)]
    out = subprocess.check_output(cmd).decode("utf-8").strip()
    data = json.loads(out)
    assert data["status"] == "ok"
    assert "predictions" in data and isinstance(data["predictions"], list)
    assert "bundle" in data and "bundle_keys" in data["bundle"]
