"""
Unit tests for vin_decoder_abstraction.py
Covers: multi-provider fallback, error handling, canonical mapping, enrichment hooks, and provenance fields.
"""
import pytest
import requests
from vin_decoder_abstraction import decode_and_map, VinDecoder, NHTSAProvider, CommercialProvider, VinAuditProvider

def test_decode_and_map_valid_nhtsa():
    vin = "4T1C11AK3PU162087"
    result = decode_and_map(vin)
    assert result["VIN"] == vin
    assert result["make"] is not None or result["Make"] is not None
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
        def provider_name(self): return "NHTSA"
    class MockVinAuditProvider(VinAuditProvider):
        def decode(self, vin):
            if vin == "BADVIN":
                return {"error": "Invalid VIN format."}
            return {
                "VIN": vin,
                "Make": "TOYOTA",
                "Model": "Camry",
                "Model Year": "2023",
                "Trim": "LE",
                "Engine Displacement (L)": "2.5",
                "Fuel Type Primary": "Gasoline",
                "Body Class": "Sedan"
            }
        def provider_name(self): return "VinAudit"
    decoder = VinDecoder([FailingNHTSAProvider(), MockVinAuditProvider(), CommercialProvider()])
    result = decoder.decode("4T1C11AK3PU162087")
    assert result["Make"] == "TOYOTA"
    assert result["provenance"][0]["provider"] == "NHTSA"
    assert result["provenance"][1]["provider"] == "VinAudit"
    result2 = decoder.decode("BADVIN")
    assert "error" in result2
    assert result2["provenance"][1]["provider"] == "VinAudit"

def test_vinaudit_env_missing(monkeypatch):
    monkeypatch.delenv("VINAUDIT_API_KEY", raising=False)
    provider = VinAuditProvider()
    result = provider.decode("4T1C11AK3PU162087")
    assert "error" in result and ("API key" in result["error"] or "not set" in result["error"])

def test_vinaudit_timeout(mocker):
    provider = VinAuditProvider()
    mocker.patch("requests.get", side_effect=requests.Timeout)
    result = provider.decode("4T1C11AK3PU162087")
    assert "error" in result
    assert "timeout" in result["error"].lower()

def test_decode_and_map_provenance_fields():
    vin = "4T1C11AK3PU162087"
    result = decode_and_map(vin)
    assert "provenance" in result
    assert isinstance(result["provenance"], list)
    for entry in result["provenance"]:
        assert "provider" in entry
        assert "timestamp" in entry
        assert "success" in entry
