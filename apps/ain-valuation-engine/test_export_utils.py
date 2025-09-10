import unittest
import json
import pandas as pd
import os

def export_to_json(data, out_path):
    with open(out_path, 'w') as f:
        json.dump(data, f, indent=2)

def export_to_csv(data, out_path):
    df = pd.DataFrame([data] if isinstance(data, dict) else data)
    df.to_csv(out_path, index=False)

class TestExportUtils(unittest.TestCase):
    def setUp(self):
        self.data = {
            "VIN": "1HGCM82633A004352",
            "Make": "HONDA",
            "Model": "ACCORD",
            "Model Year": "2003",
            "geo_lat": 37.422,
            "geo_lon": -122.084
        }
        self.json_path = "test_export.json"
        self.csv_path = "test_export.csv"

    def tearDown(self):
        for path in [self.json_path, self.csv_path]:
            if os.path.exists(path):
                os.remove(path)

    def test_export_to_json(self):
        export_to_json(self.data, self.json_path)
        self.assertTrue(os.path.exists(self.json_path))
        with open(self.json_path) as f:
            loaded = json.load(f)
        self.assertEqual(loaded["VIN"], self.data["VIN"])

    def test_export_to_csv(self):
        export_to_csv(self.data, self.csv_path)
        self.assertTrue(os.path.exists(self.csv_path))
        df = pd.read_csv(self.csv_path)
        self.assertEqual(df.iloc[0]["VIN"], self.data["VIN"])

if __name__ == "__main__":
    unittest.main()
