import pytest
import json
from src.vin_decoder_abstraction import decode_and_map, fetch_nhtsa_recalls, data_quality_score

TEST_VIN = "4T1G11AK4NU714632"  # Example: 2022 Toyota Camry

def test_decode_and_map_success():
    result = decode_and_map(TEST_VIN)
    assert isinstance(result, dict)
    assert "VIN" in result and result["VIN"] == TEST_VIN
    # At least some core fields must be present
    assert "Make" in result
    assert "Model" in result
    assert "Model Year" in result

def test_decode_and_map_invalid():
    result = decode_and_map("INVALIDVIN1234567")
    assert isinstance(result, dict)
    assert "error" in result or "Make" not in result

def test_fetch_nhtsa_recalls_success():
    recalls = fetch_nhtsa_recalls(TEST_VIN)
    assert isinstance(recalls, list)
    # Structure check; recall list may be empty

def test_data_quality_score():
    sample = {"Make": "Toyota", "Model": "Camry", "Model Year": "2022", "VIN": TEST_VIN}
    score = data_quality_score(sample)
    assert 0 <= score <= 100
    assert score < 50

    full_sample = {field: "test" for field in sample.keys()}
    full_sample["VIN"] = TEST_VIN
    score_full = data_quality_score(full_sample)
    assert score_full <= 100

def test_decode_and_map_output_json():
    result = decode_and_map(TEST_VIN)
    json_str = json.dumps(result)
    loaded = json.loads(json_str)
    assert isinstance(loaded, dict)
