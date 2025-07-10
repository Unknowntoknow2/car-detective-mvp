// Data validation utilities for valuation system
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateVin(vin: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!vin || typeof vin !== 'string') {
    errors.push('VIN is required');
    return { isValid: false, errors, warnings };
  }

  const cleanVin = vin.trim().toUpperCase();
  
  if (cleanVin.length !== 17) {
    errors.push('VIN must be exactly 17 characters');
  }

  if (!/^[A-HJ-NPR-Z0-9]+$/.test(cleanVin)) {
    errors.push('VIN contains invalid characters');
  }

  if (cleanVin.includes('I') || cleanVin.includes('O') || cleanVin.includes('Q')) {
    errors.push('VIN cannot contain letters I, O, or Q');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateMileage(mileage: number): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (typeof mileage !== 'number' || isNaN(mileage)) {
    errors.push('Mileage must be a valid number');
    return { isValid: false, errors, warnings };
  }

  if (mileage < 0) {
    errors.push('Mileage cannot be negative');
  }

  if (mileage > 500000) {
    warnings.push('Mileage is unusually high (>500k miles)');
  }

  if (mileage < 100) {
    warnings.push('Mileage is unusually low');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateZipCode(zipCode: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!zipCode || typeof zipCode !== 'string') {
    errors.push('ZIP code is required');
    return { isValid: false, errors, warnings };
  }

  const cleanZip = zipCode.trim();
  
  if (!/^\d{5}(-\d{4})?$/.test(cleanZip)) {
    errors.push('ZIP code must be in format 12345 or 12345-6789');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateMarketListings(listings: any[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(listings)) {
    errors.push('Listings must be an array');
    return { isValid: false, errors, warnings };
  }

  const validListings = listings.filter(listing => 
    listing && 
    typeof listing.price === 'number' && 
    listing.price > 0
  );

  if (validListings.length === 0 && listings.length > 0) {
    errors.push('No valid market listings found');
  }

  if (validListings.length < 3) {
    warnings.push('Limited market data may affect accuracy');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateFuelPrice(price: number): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (typeof price !== 'number' || isNaN(price)) {
    errors.push('Fuel price must be a valid number');
    return { isValid: false, errors, warnings };
  }

  if (price <= 0) {
    errors.push('Fuel price must be positive');
  }

  if (price < 2.0 || price > 8.0) {
    warnings.push('Fuel price seems unusual (outside $2-8 range)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}