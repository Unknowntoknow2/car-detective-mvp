export function validateVIN(vin: string): boolean {
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin);
}

export function validateMileage(mileage: number): boolean {
  return mileage >= 0 && mileage < 1_000_000;
}
