import unittest
import os
from export_utils import export_to_pdf

class TestExportPDF(unittest.TestCase):
    def setUp(self):
        self.data = {
            "VIN": "1HGCM82633A004352",
            "Make": "HONDA",
            "Model": "ACCORD",
            "Model Year": "2003",
            "geo_lat": 37.422,
            "geo_lon": -122.084
        }
        self.pdf_path = "test_export.pdf"

    def tearDown(self):
        if os.path.exists(self.pdf_path):
            os.remove(self.pdf_path)

    def test_export_to_pdf(self):
        export_to_pdf(self.data, self.pdf_path)
        self.assertTrue(os.path.exists(self.pdf_path))
        # Check file size is reasonable (not empty)
        self.assertGreater(os.path.getsize(self.pdf_path), 100)

if __name__ == "__main__":
    unittest.main()
