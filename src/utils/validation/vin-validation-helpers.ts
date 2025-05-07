
// VIN must be 17 characters, alphanumeric, excluding I, O, Q
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

/**
 * Checks whether a VIN string is valid based on standard VIN rules.
 * @param vin - The Vehicle Identification Number to validate
 * @returns true if valid, false otherwise
 */
export function isValidVIN(vin: string): boolean {
  if (!vin) return false;
  return VIN_REGEX.test(vin.toUpperCase());
}

/**
 * A helper component for displaying VIN-related information messages
 */
export function VinInfoMessage() {
  return (
    <div className="flex items-start gap-2 text-xs text-slate-500">
      <p>Find your 17-character VIN on your vehicle registration, insurance card, or on the driver's side dashboard.</p>
    </div>
  );
}
