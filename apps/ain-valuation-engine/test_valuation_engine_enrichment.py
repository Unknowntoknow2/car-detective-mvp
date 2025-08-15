import unittest
from vin_decoder_abstraction import VinDecoder, NHTSAProvider
from vehicle_data_enrichment import enrich_with_geocoding, enrich_with_epa_nhtsa, enrich_with_market_signals
import os

class TestValuationEngineEnrichment(unittest.TestCase):
    def setUp(self):
        self.vin = "1HGCM82633A004352"
        self.providers = [NHTSAProvider()]
        self.decoder = VinDecoder(self.providers)
        self.sample_record = {
            "VIN": self.vin,
            "Make": "HONDA",
            "Model": "ACCORD",
            "Model Year": "2003",
            "location": "1600 Amphitheatre Parkway, Mountain View, CA"
        }

    def test_geo_enrichment_success(self):
        # Requires GOOGLE_MAPS_API_KEY in env for real test
        record = enrich_with_geocoding(self.sample_record.copy())
        self.assertIn("geo_compliance", record)

    def test_epa_nhtsa_enrichment_success(self):
        record = enrich_with_epa_nhtsa(self.sample_record.copy())
        self.assertIn("epa_nhtsa_compliance", record)

    def test_market_enrichment_missing_key(self):
        # MARKET_API_KEY not set, should fail gracefully
        record = enrich_with_market_signals(self.sample_record.copy())
        self.assertIn("market_compliance", record)
        self.assertIn("missing_api_key", record["market_compliance"])

    def test_decoder_compliance_log(self):
        result = self.decoder.decode(self.vin)
        self.assertIn("compliance_log", result)
        self.assertTrue(isinstance(result["compliance_log"], list))

    def test_decoder_error_handling(self):
        bad_vin = "INVALIDVIN123"
        result = self.decoder.decode(bad_vin)
        self.assertIn("error", result)

if __name__ == "__main__":
    unittest.main()
