
export interface VinValidationResult {
  isValid: boolean;
  message: string;
}

export function validateVin(vin: string): VinValidationResult {
  if (!vin) {
    return { isValid: false, message: "VIN is required" };
  }

  if (vin.length !== 17) {
    return { isValid: false, message: "VIN must be exactly 17 characters" };
  }

  if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
    return { isValid: false, message: "VIN contains invalid characters" };
  }

  return { isValid: true, message: "" };
}
