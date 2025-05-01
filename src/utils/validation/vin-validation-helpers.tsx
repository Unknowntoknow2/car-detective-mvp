
import { AlertCircle } from 'lucide-react';
import { VinSchema } from '@/utils/validation/schemas';

// Validate the VIN and return the result
export function validateVin(vin: string) {
  try {
    VinSchema.parse(vin);
    return { isValid: true, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Invalid VIN';
    return { isValid: false, error: errorMessage };
  }
}

// Show a helpful VIN info message
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
