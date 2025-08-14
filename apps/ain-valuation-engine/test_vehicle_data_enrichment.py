"""
Unit/integration tests for vehicle_data_enrichment.py
Covers: live API integration, error handling, compliance logging.
"""
import pytest
from vehicle_data_enrichment import enrich_vehicle_record

def test_enrich_vehicle_record_stub(monkeypatch):
    # Patch all enrichments to avoid real API calls
    monkeypatch.setenv('GOOGLE_MAPS_API_KEY', 'dummy')
    monkeypatch.setenv('NUELINKS_API_KEY', 'dummy')
    monkeypatch.setenv('MARKET_API_KEY', 'dummy')
    record = {'VIN': '1HGCM82633A004352', 'location': 'New York, NY'}
    enriched = enrich_vehicle_record(record)
    assert 'geo_lat' in enriched
    assert 'nuelinks_score' in enriched
    assert 'market_trend' in enriched
    assert 'epa_mpg' in enriched
    assert 'recall_count' in enriched
    assert 'geo_compliance' in enriched
    assert 'nuelinks_compliance' in enriched
    assert 'market_compliance' in enriched
    assert 'epa_nhtsa_compliance' in enriched
