
import { validateVIN, validateVinCheckDigit, isValidVIN } from '../vin-validation-helpers';

describe('VIN Validation', () => {
  // ✅ isValidVIN
  test('isValidVIN returns true for valid VINs', () => {
    expect(isValidVIN('1HGCM82633A004352')).toBe(true);
    expect(isValidVIN('5TFEV54198X063405')).toBe(true);
  });

  test('isValidVIN returns false for invalid VINs', () => {
    expect(isValidVIN('')).toBe(false);
    expect(isValidVIN('12345')).toBe(false);
    expect(isValidVIN('ABCDEFGHIJKLMNOPQ')).toBe(false);
    expect(isValidVIN('ABCDEFGH#JKLMNOPQ')).toBe(false);
  });

  // ✅ validateVIN
  test('validateVIN allows valid VINs', () => {
    expect(validateVIN('1HGCM82633A004352').isValid).toBe(true);
    expect(validateVIN('5TFEV54198X063405').isValid).toBe(true);
  });

  test('validateVIN fails empty VIN', () => {
    const result = validateVIN('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('VIN is required');
  });

  test('validateVIN fails short VIN', () => {
    const result = validateVIN('1HGCM8263');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('VIN must be exactly 17 characters');
  });

  test('validateVIN fails if VIN contains I, O, or Q', () => {
    const result = validateVIN('1HGCM82I33A004352');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('VIN cannot contain letters I, O, or Q');
  });

  test('validateVIN fails if VIN has invalid characters', () => {
    const result = validateVIN('1HGCM826#3A004352');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('VIN must only contain letters');
  });

  // ✅ validateVinCheckDigit
  test('validateVinCheckDigit works with correct digit', () => {
    expect(validateVinCheckDigit('1HGCM82633A004352')).toBe(true);
    expect(validateVinCheckDigit('5TFEV54198X063405')).toBe(true);
  });

  test('validateVinCheckDigit fails with wrong digit', () => {
    expect(validateVinCheckDigit('1HGCM82643A004352')).toBe(false); // changed check digit at pos 9
  });

  test('validateVinCheckDigit passes X check digit', () => {
    expect(validateVinCheckDigit('11111111X11111111')).toBe(true);
  });
});
