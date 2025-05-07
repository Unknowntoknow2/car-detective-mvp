
import { validateVin, validateVinCheckDigit, isValidVIN } from './vin-validation-helpers';

describe('VIN Validation', () => {
  // Valid VIN test cases
  test('isValidVIN returns true for valid VIN', () => {
    expect(isValidVIN('1HGCM82633A004352')).toBe(true);
    expect(isValidVIN('5TFEV54198X063405')).toBe(true);
  });

  test('isValidVIN returns false for invalid VIN', () => {
    expect(isValidVIN('')).toBe(false);
    expect(isValidVIN('12345')).toBe(false);
    expect(isValidVIN('ABCDEFGHIJKLMNOPQ')).toBe(false);
    expect(isValidVIN('ABCDEFGH#JKLMNOPQ')).toBe(false);
  });

  // validateVin test cases
  test('validateVin passes valid VINs', () => {
    expect(validateVin('1HGCM82633A004352').valid).toBe(true);
    expect(validateVin('5TFEV54198X063405').valid).toBe(true);
  });

  test('validateVin fails empty VIN', () => {
    const result = validateVin('');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('VIN is required');
  });

  test('validateVin fails VIN with incorrect length', () => {
    const result = validateVin('1HGCM8263');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('VIN must be exactly 17 characters');
  });

  test('validateVin fails VIN with I, O, or Q', () => {
    const result = validateVin('1HGCM82I33A004352');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('VIN cannot contain letters I, O, or Q');
  });

  test('validateVin fails VIN with invalid characters', () => {
    const result = validateVin('1HGCM826#3A004352');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('VIN can only contain letters A-H, J-N, P, R-Z and numbers 0-9');
  });

  // Check digit validation tests
  test('validateVinCheckDigit correctly validates check digit', () => {
    expect(validateVinCheckDigit('1HGCM82633A004352')).toBe(true);
    expect(validateVinCheckDigit('5TFEV54198X063405')).toBe(true);
  });

  test('validateVinCheckDigit fails invalid check digit', () => {
    expect(validateVinCheckDigit('1HGCM82643A004352')).toBe(false); // Changed '3' to '4' at position 9
  });

  test('validateVinCheckDigit handles X check digit correctly', () => {
    // This is a fabricated example where the check digit should be X
    expect(validateVinCheckDigit('11111111X11111111')).toBe(true);
  });
});
