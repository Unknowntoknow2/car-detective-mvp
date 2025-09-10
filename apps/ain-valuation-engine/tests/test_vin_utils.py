import unittest
from vin_utils import is_valid_vin

class TestVinValidation(unittest.TestCase):
    def test_valid_vin(self):
        self.assertTrue(is_valid_vin('1HGCM82633A004352'))

    def test_invalid_vin(self):
        self.assertFalse(is_valid_vin('INVALIDVIN1234'))

if __name__ == '__main__':
    unittest.main()
