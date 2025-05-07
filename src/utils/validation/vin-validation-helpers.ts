
import React from 'react';
import { InfoIcon } from 'lucide-react';

/**
 * Displays an informational message about VIN numbers
 */
export const VinInfoMessage: React.FC = () => {
  return (
    <div className="flex items-start gap-2 text-xs text-slate-500">
      <InfoIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
      <p>
        Find your 17-character VIN on your vehicle registration, insurance card, or on the driver's side dashboard.
      </p>
    </div>
  );
};

/**
 * Extracts the make and model from a decoded VIN
 * @param decodedVIN The decoded VIN data from an API 
 * @returns Object containing make and model
 */
export const extractVehicleInfoFromVIN = (decodedVIN: any): { make: string; model: string } => {
  // This is a simplified example - real implementation would depend on the API response format
  return {
    make: decodedVIN?.Results?.[0]?.Make || "",
    model: decodedVIN?.Results?.[0]?.Model || ""
  };
};

/**
 * Checks whether a VIN string is valid based on standard VIN rules.
 * @param vin - The Vehicle Identification Number to validate
 * @returns true if valid, false otherwise
 */
export function isValidVIN(vin: string): boolean {
  if (!vin) return false;
  
  // VIN must be 17 characters, alphanumeric, excluding I, O, Q
  const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;
  return VIN_REGEX.test(vin.toUpperCase());
}
