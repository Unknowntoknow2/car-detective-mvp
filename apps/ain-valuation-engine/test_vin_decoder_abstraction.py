"""
Unit tests for vin_decoder_abstraction.py
Covers: multi-provider fallback, error handling, canonical mapping, enrichment hooks, and provenance fields.
"""
import pytest
from vin_decoder_abstraction import decode_and_map, VinDecoder, NHTSAProvider, CommercialProvider

def test_decode_and_map_valid_nhtsa():
    vin = "4T1C11AK3PU162087"  # Valid Toyota VIN
    result = decode_and_map(vin)
    assert result["VIN"] == vin
    assert result["Make"] is not None
    assert "provenance" in result
    assert "recalls" in result
    assert result["provenance"][0]["provider"] == "NHTSA"

def test_decode_and_map_invalid_vin():
    vin = "INVALIDVIN123"
    result = decode_and_map(vin)
    assert "error" in result
    assert "provenance" in result

def test_decode_and_map_commercial_fallback(monkeypatch):
    class FailingNHTSAProvider(NHTSAProvider):
        def decode(self, vin):
            return {"error": "Simulated failure"}
    decoder = VinDecoder([FailingNHTSAProvider(), CommercialProvider()])
    result = decoder.decode("4T1C11AK3PU162087")
    assert "error" in result  # CommercialProvider is not implemented
    assert result["provenance"][0]["provider"] == "NHTSA"
    assert result["provenance"][1]["provider"] == "Commercial"

def test_decode_and_map_provenance_fields():
    vin = "4T1C11AK3PU162087"
    result = decode_and_map(vin)
    assert "provenance" in result
    assert isinstance(result["provenance"], list)
    for entry in result["provenance"]:
        assert "provider" in entry
        assert "timestamp" in entry
        assert "success" in entry
