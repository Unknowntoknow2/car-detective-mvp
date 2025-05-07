// src/utils/validation/enhanced-validation.ts
import React from 'react';
import { z } from 'zod';

export const EnhancedManualEntrySchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.number().min(0),
  condition: z.string().min(1, "Condition is required"),
  zipCode: z.string().regex(/^\d{5}$/, "ZIP code must be 5 digits"),
  trim: z.string().optional(),
  color: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  bodyType: z.string().optional(),
  features: z.array(z.string()).optional(),
  accidentCount: z.number().min(0).optional(),
  vin: z.string().regex(/^[A-HJ-NPR-Z0-9]{17}$/, "Invalid VIN format").optional(),
});

export const VinInfoMessage: React.FC = () => {
  return (
    <div className="text-sm text-gray-500">
      <p>A valid VIN:</p>
      <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
        <li>Exactly 17 characters</li>
        <li>No I, O, or Q</li>
        <li>Only letters A–H, J–N, P, R–Z, and digits 0–9</li>
      </ul>
    </div>
  );
};
