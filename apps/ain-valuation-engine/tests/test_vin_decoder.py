import pytest
from src.api_integrations.vin_decoder import decode_vin

def test_decode_vin_real():
    vin = "1HGCM82633A004352"
    data = decode_vin(vin)
    assert data["make"] == "HONDA"
    assert data["year"] == "2003"

def test_decode_vin_invalid():
    with pytest.raises(ValueError):
        decode_vin("INVALIDVIN123")
