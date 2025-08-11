/**
 * Simple JavaScript test for VIN validation
 * Tests core VIN validation logic without TypeScript complications
 */

// VIN check digit weights for validation
const VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

// Valid VIN characters and their numeric values for checksum calculation
const VIN_VALUES = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'J': 1,
  'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9, 'S': 2, 'T': 3, 'U': 4,
  'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9
};

// Characters that are NOT allowed in VINs (I, O, Q)
const INVALID_VIN_CHARS = /[IOQ]/i;

// Valid VIN character pattern (17 alphanumeric, excluding I, O, Q)
const VALID_VIN_PATTERN = /^[ABCDEFGHJKLMNPRSTUVWXYZ0-9]{17}$/;

function validateVinChecksum(vin) {
  try {
    let sum = 0;
    
    for (let i = 0; i < 17; i++) {
      const char = vin[i];
      const value = VIN_VALUES[char];
      
      if (value === undefined) {
        return false; // Invalid character
      }
      
      sum += value * VIN_WEIGHTS[i];
    }
    
    const calculatedCheckDigit = sum % 11;
    const actualCheckDigit = vin[8]; // 9th position (0-indexed)
    
    // Check digit can be 0-9 or X (representing 10)
    const expectedCheckDigit = calculatedCheckDigit === 10 ? 'X' : calculatedCheckDigit.toString();
    
    return actualCheckDigit === expectedCheckDigit;
  } catch (error) {
    return false;
  }
}

function validateVIN(vin) {
  if (!vin || typeof vin !== 'string') {
    return {
      valid: false,
      error: 'VIN must be a non-empty string'
    };
  }

  const cleanVin = vin.trim().toUpperCase();
  
  // Check length
  if (cleanVin.length !== 17) {
    return {
      valid: false,
      error: `VIN must be exactly 17 characters, got ${cleanVin.length}`
    };
  }

  // Check for invalid characters (I, O, Q)
  if (INVALID_VIN_CHARS.test(cleanVin)) {
    return {
      valid: false,
      error: 'VIN contains invalid characters (I, O, Q are not allowed)'
    };
  }

  // Check overall character pattern
  if (!VALID_VIN_PATTERN.test(cleanVin)) {
    return {
      valid: false,
      error: 'VIN contains invalid characters or format'
    };
  }

  // Calculate and verify checksum (9th digit)
  if (!validateVinChecksum(cleanVin)) {
    return {
      valid: false,
      error: 'VIN checksum is invalid (9th digit does not match calculated value)'
    };
  }

  return { valid: true };
}

// Test the validation
console.log('🧪 Testing VIN Validation...\n');

const testCases = [
  { vin: '1HGBH41JXMN109186', expected: true, label: 'Valid Honda Accord VIN' },
  { vin: '1G1BE5SM7H7114533', expected: true, label: 'Valid Chevrolet Cruze VIN' },  // Fixed VIN
  { vin: '123', expected: false, label: 'Too short VIN' },
  { vin: '1HGBH41JXMN109IOQ', expected: false, label: 'VIN with invalid characters' },
  { vin: '1HGBH41JXMN109187', expected: false, label: 'VIN with wrong checksum' },
  { vin: '', expected: false, label: 'Empty VIN' }
];

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const result = validateVIN(testCase.vin);
  const success = result.valid === testCase.expected;
  
  console.log(`${index + 1}. ${testCase.label}: ${success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   VIN: "${testCase.vin}"`);
  console.log(`   Expected: ${testCase.expected}, Got: ${result.valid}`);
  if (!result.valid) {
    console.log(`   Error: ${result.error}`);
  }
  console.log('');
  
  if (success) {
    passed++;
  } else {
    failed++;
  }
});

console.log(`🎯 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All VIN validation tests passed!');
} else {
  console.log('❌ Some tests failed');
}

// Export for ES modules
export { validateVIN, validateVinChecksum };
