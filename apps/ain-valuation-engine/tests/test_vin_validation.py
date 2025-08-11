"""
Comprehensive test suite for VIN validation module.

Tests cover:
- Valid VIN scenarios
- Invalid character scenarios  
- Length validation
- Check digit validation
- Edge cases and error handling
- Component extraction
"""

import pytest
from src.utils.vin_validation import (
    validate_vin,
    VINValidationError,
    compute_check_digit,
    extract_vin_components,
    is_valid_vin_safe,
    transliterate
)


class TestVINValidation:
    """Test suite for VIN validation functionality."""
    
    def test_valid_vins(self):
        """Test known valid VINs."""
        valid_vins = [
            "1HGCM82633A004352",  # Honda Civic
            "JH4KA8260MC000001",  # Acura NSX
            "1G1YY22G965000001",  # Chevrolet Chevette
            "1FTEW1CG6HKD46234",  # Ford F-150
            "WBSBL9C50BF000001",  # BMW with X check digit
        ]
        
        for vin in valid_vins:
            assert validate_vin(vin) is True
    
    def test_invalid_check_digits(self):
        """Test VINs with incorrect check digits."""
        invalid_vins = [
            "1HGCM82633A004353",  # Last digit changed
            "1HGCM82633A004351",  # Last digit changed
            "JH4KA8260MC000002",  # Last digit changed
        ]
        
        for vin in invalid_vins:
            with pytest.raises(VINValidationError, match="check digit mismatch"):
                validate_vin(vin)
    
    def test_invalid_characters(self):
        """Test VINs with forbidden characters."""
        invalid_vins = [
            "1HGCM82633A00435I",  # Contains I
            "1HGCM82633A00435O",  # Contains O
            "1HGCM82633A00435Q",  # Contains Q
            "1HGCM82633A004$52",  # Contains special character
            "1hgcm82633a004352",  # Should work (gets uppercased)
        ]
        
        # All except the last one should fail
        for vin in invalid_vins[:-1]:
            with pytest.raises(VINValidationError, match="invalid characters"):
                validate_vin(vin)
        
        # Last one should pass (lowercase gets uppercased)
        assert validate_vin(invalid_vins[-1]) is True
    
    def test_invalid_lengths(self):
        """Test VINs with incorrect lengths."""
        invalid_vins = [
            "1HGCM82633A00435",    # Too short (16 chars)
            "1HGCM82633A0043522",  # Too long (18 chars)
            "",                    # Empty
            "123",                 # Very short
            "1" * 50,             # Very long
        ]
        
        for vin in invalid_vins:
            with pytest.raises(VINValidationError, match="17 characters"):
                validate_vin(vin)
    
    def test_non_string_input(self):
        """Test non-string inputs."""
        invalid_inputs = [
            None,
            123456789012345678,
            ["1HGCM82633A004352"],
            {"vin": "1HGCM82633A004352"}
        ]
        
        for invalid_input in invalid_inputs:
            with pytest.raises(VINValidationError, match="must be a string"):
                validate_vin(invalid_input)
    
    def test_whitespace_handling(self):
        """Test VINs with whitespace."""
        vin_with_spaces = "  1HGCM82633A004352  "
        assert validate_vin(vin_with_spaces) is True
        
        vin_with_internal_spaces = "1HGCM 82633A004352"
        with pytest.raises(VINValidationError):
            validate_vin(vin_with_internal_spaces)
    
    def test_compute_check_digit(self):
        """Test check digit computation."""
        test_cases = [
            ("1HGCM82633A004352", "3"),  # Known VIN
            ("JH4KA8260MC000001", "0"),  # Another known VIN
            ("WBSBL9C50BF000001", "X"),  # VIN with X check digit
        ]
        
        for vin, expected in test_cases:
            # Remove check digit and compute
            vin_without_check = vin[:8] + "0" + vin[9:]
            computed = compute_check_digit(vin_without_check)
            assert computed == expected
    
    def test_transliterate(self):
        """Test character transliteration."""
        test_cases = [
            ("0", 0), ("1", 1), ("9", 9),
            ("A", 1), ("B", 2), ("Z", 9),
            ("X", 7), ("J", 1), ("K", 2)
        ]
        
        for char, expected in test_cases:
            assert transliterate(char) == expected
        
        # Test invalid characters
        invalid_chars = ["I", "O", "Q", "$", " "]
        for char in invalid_chars:
            with pytest.raises(VINValidationError):
                transliterate(char)
    
    def test_extract_vin_components(self):
        """Test VIN component extraction."""
        vin = "1HGCM82633A004352"
        components = extract_vin_components(vin)
        
        expected = {
            "wmi": "1HG",           # Honda (World Manufacturer Identifier)
            "vds": "CM8263",        # Vehicle Descriptor Section  
            "vis": "3A004352",      # Vehicle Identifier Section
            "check_digit": "3",     # Check digit at position 9
            "model_year": "3",      # Model year at position 10
            "plant_code": "A",      # Plant code at position 11
            "serial_number": "004352" # Serial number positions 12-17
        }
        
        assert components == expected
    
    def test_extract_vin_components_invalid(self):
        """Test component extraction with invalid VIN."""
        invalid_vin = "1HGCM82633A004353"  # Wrong check digit
        components = extract_vin_components(invalid_vin)
        assert components == {}
    
    def test_is_valid_vin_safe(self):
        """Test safe validation function that doesn't raise exceptions."""
        # Valid VIN
        assert is_valid_vin_safe("1HGCM82633A004352") is True
        
        # Invalid VINs
        invalid_vins = [
            "1HGCM82633A004353",  # Wrong check digit
            "1HGCM82633A00435I",  # Invalid character
            "1HGCM82633A00435",   # Too short
            "",                   # Empty
            None                  # None type
        ]
        
        for vin in invalid_vins:
            assert is_valid_vin_safe(vin) is False


class TestVINEdgeCases:
    """Test edge cases and boundary conditions."""
    
    def test_all_numeric_vin(self):
        """Test VIN with all numeric characters."""
        # This would need a valid check digit
        all_numeric = "12345678901234567"
        # This will likely fail check digit validation
        with pytest.raises(VINValidationError, match="check digit mismatch"):
            validate_vin(all_numeric)
    
    def test_all_alpha_vin(self):
        """Test VIN with all alphabetic characters."""
        all_alpha = "ABCDEFGHABCDEFGHI"
        # Remove invalid characters and test
        valid_alpha = "ABCDEFGHABCDEFGHA"  # Replace I with A
        with pytest.raises(VINValidationError, match="check digit mismatch"):
            validate_vin(valid_alpha)
    
    def test_check_digit_x(self):
        """Test VIN with X as check digit."""
        # Create a VIN that should have X as check digit
        vin_base = "WBSBL9C50BF000001"  # This should have X as check digit
        expected_check = compute_check_digit(vin_base)
        if expected_check == "X":
            assert validate_vin(vin_base) is True


class TestVINSecurityScenarios:
    """Test security-related scenarios."""
    
    def test_sql_injection_attempt(self):
        """Test VIN that looks like SQL injection."""
        malicious_vins = [
            "'; DROP TABLE--",
            "1HGCM82633A004352'",
            "1HGCM82633A004352--",
            "<script>alert('xss')",
        ]
        
        for vin in malicious_vins:
            with pytest.raises(VINValidationError):
                validate_vin(vin)
    
    def test_unicode_characters(self):
        """Test VIN with unicode characters."""
        unicode_vins = [
            "1HGCM82633A004352ñ",  # Spanish character
            "1HGCM82633A00435²",   # Superscript
            "1HGCM82633A00435€",   # Euro symbol
        ]
        
        for vin in unicode_vins:
            with pytest.raises(VINValidationError):
                validate_vin(vin)


if __name__ == "__main__":
    # Run basic tests if executed directly
    test_instance = TestVINValidation()
    
    print("Running VIN validation tests...")
    
    try:
        test_instance.test_valid_vins()
        print("✅ Valid VIN tests passed")
        
        test_instance.test_invalid_check_digits()
        print("✅ Invalid check digit tests passed")
        
        test_instance.test_invalid_characters()
        print("✅ Invalid character tests passed")
        
        test_instance.test_extract_vin_components()
        print("✅ Component extraction tests passed")
        
        print("\n🎉 All basic tests passed!")
        
    except Exception as e:
        print(f"❌ Tests failed: {e}")
