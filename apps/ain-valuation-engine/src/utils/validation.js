export function validateVIN(vin) {
    return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin);
}
export function validateMileage(mileage) {
    return mileage >= 0 && mileage < 1_000_000;
}
