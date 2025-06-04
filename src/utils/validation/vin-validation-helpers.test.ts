import {
  isValidVIN,
  validateVin,
  validateVinCheckDigit,
} from "./vin-validation";

<<<<<<< HEAD
import { validateVIN, validateVinCheckDigit, isValidVIN } from './vin-validation';

describe('VIN Validation', () => {
=======
describe("VIN Validation", () => {
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  // Valid VIN test cases
  test("isValidVIN returns true for valid VIN", () => {
    expect(isValidVIN("1HGCM82633A004352")).toBe(true);
    expect(isValidVIN("5TFEV54198X063405")).toBe(true);
  });

  test("isValidVIN returns false for invalid VIN", () => {
    expect(isValidVIN("")).toBe(false);
    expect(isValidVIN("12345")).toBe(false);
    expect(isValidVIN("ABCDEFGHIJKLMNOPQ")).toBe(false);
    expect(isValidVIN("ABCDEFGH#JKLMNOPQ")).toBe(false);
  });

<<<<<<< HEAD
  // validateVIN test cases
  test('validateVIN passes valid VINs', () => {
    expect(validateVIN('1HGCM82633A004352').isValid).toBe(true);
    expect(validateVIN('5TFEV54198X063405').isValid).toBe(true);
  });

  test('validateVIN fails empty VIN', () => {
    const result = validateVIN('');
=======
  // validateVin test cases
  test("validateVin passes valid VINs", () => {
    expect(validateVin("1HGCM82633A004352").isValid).toBe(true);
    expect(validateVin("5TFEV54198X063405").isValid).toBe(true);
  });

  test("validateVin fails empty VIN", () => {
    const result = validateVin("");
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("VIN is required");
  });

<<<<<<< HEAD
  test('validateVIN fails VIN with incorrect length', () => {
    const result = validateVIN('1HGCM8263');
=======
  test("validateVin fails VIN with incorrect length", () => {
    const result = validateVin("1HGCM8263");
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(
      "VIN must be exactly 17 characters (currently 9)",
    );
  });

<<<<<<< HEAD
  test('validateVIN fails VIN with invalid characters', () => {
    const result = validateVIN('1HGCM826#3A004352');
=======
  test("validateVin fails VIN with invalid characters", () => {
    const result = validateVin("1HGCM826#3A004352");
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(
      "VIN contains invalid characters (only letters A-Z except O,I,Q and numbers 0-9 are allowed)",
    );
  });

  // Check digit validation tests
  test("validateVinCheckDigit correctly validates check digit", () => {
    expect(validateVinCheckDigit("1HGCM82633A004352")).toBe(true);
    expect(validateVinCheckDigit("5TFEV54198X063405")).toBe(true);
  });

  test("validateVinCheckDigit fails invalid check digit", () => {
    expect(validateVinCheckDigit("1HGCM82643A004352")).toBe(false); // Changed '3' to '4' at position 9
  });

  test("validateVinCheckDigit handles X check digit correctly", () => {
    // This is a fabricated example where the check digit should be X
    expect(validateVinCheckDigit("11111111X11111111")).toBe(true);
  });
});
