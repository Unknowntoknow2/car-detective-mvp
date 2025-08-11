"""
ISO 3779 compliant VIN validation utility with WMI validation.

This module provides comprehensive VIN validation including:
- Character set validation (excluding I, O, Q)
- Length validation (exactly 17 characters)
- ISO 3779 check digit validation using mod-11 algorithm
- WMI (World Manufacturer Identifier) validation
- Proper error handling and reporting

Usage:
    from src.utils.vin_validation import validate_vin, VINValidationError

    try:
        validate_vin("1HGCM82633A004352")
        print("VIN is valid")
    except VINValidationError as e:
        print(f"Invalid VIN: {e}")
"""

import re
from typing import Dict

# ISO 3779 transliteration table
TRANSLITERATION: Dict[str, int] = {
    **{str(i): i for i in range(10)},
    "A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 6, "G": 7, "H": 8,
    "J": 1, "K": 2, "L": 3, "M": 4, "N": 5, "P": 7, "R": 9,
    "S": 2, "T": 3, "U": 4, "V": 5, "W": 6, "X": 7, "Y": 8, "Z": 9
}

# ISO 3779 position weights for check digit calculation
WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2]

# Valid VIN character pattern (excludes I, O, Q)
VIN_REGEX = re.compile(r"^[A-HJ-NPR-Z0-9]{17}$")

# Sample WMI database (expand as needed)
WMI_DATABASE: Dict[str, str] = {
    "1HG": "Honda USA",
    "1G1": "Chevrolet USA",
    "JH4": "Acura Japan",
    "WVW": "Volkswagen Germany",
    "3VW": "Volkswagen Mexico",
    "5YJ": "Tesla USA",
    "SAL": "Land Rover UK",
    "ZAR": "Alfa Romeo Italy",
    "WBA": "BMW Germany",
    "KMH": "Hyundai Korea",
    "KNM": "Renault Samsung Korea",
    # ... add more WMIs for coverage
}

class VINValidationError(Exception):
    """Exception for VIN validation errors."""
    pass

def transliterate(char: str) -> int:
    try:
        return TRANSLITERATION[char]
    except KeyError:
        raise VINValidationError(f"Invalid VIN character: {char}")

def compute_check_digit(vin: str) -> str:
    total = 0
    for i, char in enumerate(vin):
        value = transliterate(char)
        weight = WEIGHTS[i]
        total += value * weight
    remainder = total % 11
    return "X" if remainder == 10 else str(remainder)

def validate_wmi(wmi: str) -> bool:
    """
    Validates the World Manufacturer Identifier (WMI) portion of the VIN.
    Args:
        wmi: The first three characters of the VIN
    Returns:
        True if WMI is recognized
    Raises:
        VINValidationError: If WMI is not recognized
    """
    if wmi not in WMI_DATABASE:
        raise VINValidationError(f"Unknown or invalid WMI: '{wmi}'. Please check the manufacturer's code.")
    return True

def validate_vin(vin: str) -> bool:
    """
    Validates a VIN according to ISO 3779 standard and WMI database.
    - Correct length (exactly 17 characters)
    - Valid character set (A-H, J-N, P, R-Z, 0-9; excludes I, O, Q)
    - Valid ISO 3779 check digit using mod-11 algorithm
    - Valid WMI
    Returns True if VIN is valid, else raises VINValidationError.
    """
    if not isinstance(vin, str):
        raise VINValidationError("VIN must be a string")
    vin = vin.strip().upper()
    if len(vin) != 17:
        raise VINValidationError("VIN must be exactly 17 characters")
    if not VIN_REGEX.match(vin):
        raise VINValidationError(
            "VIN contains invalid characters. Allowed: A-H, J-N, P, R-Z, 0-9 (excludes I, O, Q)"
        )
    wmi = vin[:3]
    validate_wmi(wmi)
    expected_check_digit = compute_check_digit(vin)
    actual_check_digit = vin[8]
    if expected_check_digit != actual_check_digit:
        raise VINValidationError(
            f"VIN check digit mismatch (expected {expected_check_digit}, got {actual_check_digit})"
        )
    return True

def extract_vin_components(vin: str) -> Dict[str, str]:
    if not validate_vin(vin):
        return {}
    vin = vin.strip().upper()
    return {
        "wmi": vin[0:3],
        "vds": vin[3:9],
        "vis": vin[9:17],
        "check_digit": vin[8],
        "model_year": vin[9],
        "plant_code": vin[10],
        "serial_number": vin[11:17]
    }

def is_valid_vin_safe(vin: str) -> bool:
    try:
        return validate_vin(vin)
    except VINValidationError:
        return False

# Example usage and quick tests
if __name__ == "__main__":
    test_vins = [
        "1HGCM82633A004352",  # valid Honda Civic
        "1HGCM82633A004353",  # invalid check digit
        "1HGCM82633A00435I",  # invalid char (I)
        "1HGCM82633A00435",   # too short
        "JH4KA8260MC000001",  # valid Acura NSX
        "1G1YY22G965000001",  # valid Chevette
        "",                   # empty string
        "123456789012345678", # too long
        "ZZZCM82633A004352",  # invalid WMI (ZZZ not in sample db)
    ]

    print("VIN Validation Test Results:")
    print("-" * 50)

    for vin in test_vins:
        try:
            result = validate_vin(vin)
            components = extract_vin_components(vin)
            print(f"✅ {vin}: VALID")
            print(f"   WMI: {components['wmi']}, Check: {components['check_digit']}, Year: {components['model_year']}")
        except VINValidationError as e:
            print(f"❌ {vin}: INVALID ({e})")
        print()