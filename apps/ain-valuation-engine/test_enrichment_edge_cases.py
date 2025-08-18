import unittest
from vehicle_data_enrichment import enrich_with_geocoding, enrich_with_epa_nhtsa, enrich_with_market_signals

class TestEnrichmentEdgeCases(unittest.TestCase):
    def test_geo_enrichment_missing_address(self):
        record = {"VIN": "1HGCM82633A004352"}
        enriched = enrich_with_geocoding(record)
        self.assertEqual(enriched["geo_compliance"], "missing_api_key_or_address")

    def test_epa_nhtsa_enrichment_missing_vin(self):
        record = {"Make": "HONDA"}
        enriched = enrich_with_epa_nhtsa(record)
        self.assertEqual(enriched["epa_nhtsa_compliance"], "missing_vin")

    def test_market_enrichment_missing_vin(self):
        record = {"Make": "HONDA"}
        enriched = enrich_with_market_signals(record)
        self.assertIn("missing_api_key_or_vin", enriched["market_compliance"])

if __name__ == "__main__":
    unittest.main()
