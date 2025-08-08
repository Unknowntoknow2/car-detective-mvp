import unittest
from val_engine.main import run_valuation

class TestValuationEngine(unittest.TestCase):
    def test_basic_valuation(self):
        sample = {
            "year": 2019,
            "mileage": 60000,
            "make": "Honda",
            "model": "Civic",
            "zipcode": 94103,
            "condition": "Excellent"
        }
        result = run_valuation(sample)
        self.assertIn("estimated_value", result)
        self.assertIn("adjustments", result)
        self.assertIn("summary", result)

if __name__ == "__main__":
    unittest.main()
