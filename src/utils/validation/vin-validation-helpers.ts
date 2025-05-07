
// VIN validation rules based on ISO 3779 standard
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

/**
 * Checks whether a VIN string is valid based on standard VIN rules.
 * @param vin - The Vehicle Identification Number to validate
 * @returns true if valid, false otherwise
 */
export function isValidVIN(vin: string): boolean {
  if (!vin || vin.length !== 17) return false;
  return VIN_REGEX.test(vin.toUpperCase());
}

/**
 * Validates a full VIN string and returns structured feedback.
 * @param vin - The Vehicle Identification Number to validate
 * @returns isValid + optional error message
 */
export function validateVIN(vin: string): { isValid: boolean; error?: string } {
  if (!vin) {
    return { isValid: false, error: "VIN is required" };
  }

  if (vin.length !== 17) {
    return { isValid: false, error: "VIN must be exactly 17 characters" };
  }

  if (/[IOQ]/.test(vin.toUpperCase())) {
    return { isValid: false, error: "VIN cannot contain letters I, O, or Q" };
  }

  if (!VIN_REGEX.test(vin.toUpperCase())) {
    return {
      isValid: false,
      error:
        "VIN must only contain letters A–H, J–N, P, R–Z and digits 0–9 (excluding I, O, Q)",
    };
  }

  try {
    if (!validateVinCheckDigit(vin)) {
      return { isValid: false, error: "Invalid VIN check digit (position 9)" };
    }
  } catch (e) {
    console.warn("VIN check digit validation failed, skipping strict check:", e);
  }

  return { isValid: true };
}

/**
 * Validates the VIN check digit per ISO 3779.
 * @param vin - The Vehicle Identification Number
 * @returns true if the check digit matches, false otherwise
 */
export function validateVinCheckDigit(vin: string): boolean {
  const transliteration: { [key: string]: number } = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4,
    '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  };

  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

  const vinUpper = vin.toUpperCase();
  let sum = 0;

  for (let i = 0; i < vinUpper.length; i++) {
    const char = vinUpper[i];
    const value = transliteration[char];

    if (value === undefined) return false;
    sum += value * weights[i];
  }

  const remainder = sum % 11;
  const expectedCheck = remainder === 10 ? "X" : remainder.toString();

  return vinUpper[8] === expectedCheck;
}

import React from "react";
import { AlertCircle } from 'lucide-react';

/**
 * A helpful UI component that explains how to locate your VIN.
 */
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
