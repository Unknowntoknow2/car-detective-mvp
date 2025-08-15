import pytest
from src.utils.vin_validation import validate_vin, VINValidationError, is_valid_vin_safe

def test_valid_vin():
    assert validate_vin("1HGCM82633A004352") is True

def test_invalid_vin_length():
    with pytest.raises(VINValidationError):
        validate_vin("1234567890123456")

def test_invalid_vin_character():
    with pytest.raises(VINValidationError):
        validate_vin("1HGCM82633A0O4352")  # Contains an 'O'

def test_invalid_check_digit():
    with pytest.raises(VINValidationError):
        validate_vin("1HGCM82633A004353")  # Bad check digit

def test_safe_valid():
    assert is_valid_vin_safe("1HGCM82633A004352") is True

def test_safe_invalid():
    assert is_valid_vin_safe("1HGCM82633A004353") is False
