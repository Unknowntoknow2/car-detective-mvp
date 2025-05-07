
// VIN validation rules based on ISO 3779 standard
export function validateVIN(vin: string): { isValid: boolean; error?: string } {
  if (!vin) {
    return { isValid: false, error: "VIN is required" };
  }

  if (vin.length !== 17) {
    return { isValid: false, error: "VIN must be exactly 17 characters" };
  }

  // Check for valid characters (no I,O,Q)
  if (/[IOQ]/i.test(vin)) {
    return { isValid: false, error: "VIN cannot contain letters I, O, or Q" };
  }

  // Basic format validation (alphanumeric only, excluding I,O,Q already above)
  if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
    return { isValid: false, error: "VIN must contain only valid alphanumeric characters" };
  }

  try {
    if (!validateVinCheckDigit(vin)) {
      return { isValid: false, error: "Invalid VIN check digit (position 9)" };
    }
  } catch (e) {
    console.warn("VIN check digit validation failed:", e);
    // Still allow VIN if check digit validation crashes
  }

  return { isValid: true };
}

// Calculate and validate the VIN check digit
export function validateVinCheckDigit(vin: string): boolean {
  const transliterationValues: { [key: string]: number } = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4,
    '5': 5, '6': 6, '7': 7, '8': 8, '9': 9
  };

  const weightFactors = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

  if (vin.length !== 17) return false;

  const upperVin = vin.toUpperCase();
  const checkDigit = upperVin[8];
  let sum = 0;

  for (let i = 0; i < 17; i++) {
    const char = upperVin[i];
    const value = transliterationValues[char];
    if (value === undefined) return false;
    sum += value * weightFactors[i];
  }

  const remainder = sum % 11;
  const expectedCheckDigit = remainder === 10 ? 'X' : remainder.toString();

  return checkDigit === expectedCheckDigit;
}

// JSX info message
import React from "react";
import { AlertCircle } from 'lucide-react';

export function VinInfoMessage() {
  return (
    <div className="flex items-start gap-2 text-xs text-slate-500">
      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
      <p>
        Find your 17-character VIN on your vehicle registration, insurance card, or on the driver's side dashboard.
      </p>
    </div>
  );
}
