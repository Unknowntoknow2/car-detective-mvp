"""
Integration test for vin_decoder_pipeline_integration.py
Ensures output is persisted, complete, and ready for downstream pipeline.
"""
import os
import json
import subprocess

def test_pipeline_integration():
    vin = "4T1C11AK3PU162087"
    output_file = "db_output.json"
    if os.path.exists(output_file):
        os.remove(output_file)
    result = subprocess.run(["python3", "vin_decoder_pipeline_integration.py", vin], capture_output=True, text=True)
    assert result.returncode == 0
    assert os.path.exists(output_file)
    with open(output_file) as f:
        data = json.load(f)
    assert data["VIN"] == vin
    assert "provenance" in data
    assert "compliance_log" in data
    assert "recalls" in data
    assert "geo" in data
    assert "fuel" in data
    assert "explainability" in data
