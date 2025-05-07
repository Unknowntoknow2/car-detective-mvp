
import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Component to provide VIN information guidance to users
 */
export const VinInfoMessage: React.FC = () => {
  return (
    <div className="text-xs text-slate-500 flex items-start gap-2">
      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
      <p>
        Find your 17-character VIN on your vehicle registration, insurance card, or on the driver's side dashboard.
      </p>
    </div>
  );
};

/**
 * Validates a VIN
 * @param vin - The VIN to validate
 * @returns An object with validation result and error message if invalid
 */
export const validateVin = (vin: string): { valid: boolean; message?: string } => {
  if (!vin) {
    return { valid: false, message: 'VIN is required' };
  }

  // Remove any spaces and make uppercase
  const cleanVin = vin.replace(/\s+/g, '').toUpperCase();

  if (cleanVin.length !== 17) {
    return { valid: false, message: 'VIN must be exactly 17 characters' };
  }

  // Check for invalid characters (I, O, Q are not used in VINs)
  if (/[IOQ]/.test(cleanVin)) {
    return { valid: false, message: 'VIN cannot contain letters I, O, or Q' };
  }

  // Check for valid VIN format (only certain letters and numbers)
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(cleanVin)) {
    return { valid: false, message: 'VIN can only contain letters A-H, J-N, P, R-Z and numbers 0-9' };
  }

  return { valid: true };
};
