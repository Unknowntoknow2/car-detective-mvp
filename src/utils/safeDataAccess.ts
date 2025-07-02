// Defensive utility for safe property access
export function safeGet<T, K extends keyof T>(obj: T | undefined | null, key: K): T[K] | undefined {
  return obj?.[key];
}

export function safeGetNested<T>(obj: any, path: string, defaultValue?: T): T | undefined {
  try {
    return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

export function safeVehicleData(data: any) {
  return {
    make: safeGet(data, 'make') || 'Unknown',
    model: safeGet(data, 'model') || 'Unknown',
    year: safeGet(data, 'year') || new Date().getFullYear(),
    trim: safeGet(data, 'trim') || '',
    vin: safeGet(data, 'vin') || '',
    mileage: safeGet(data, 'mileage') || 0,
    condition: safeGet(data, 'condition') || 'good',
    bodyType: safeGet(data, 'bodyType') || safeGet(data, 'bodytype') || '',
    fuelType: safeGet(data, 'fuelType') || safeGet(data, 'fueltype') || '',
    transmission: safeGet(data, 'transmission') || '',
    drivetrain: safeGet(data, 'drivetrain') || ''
  };
}

export function validateRequiredVehicleData(data: any): { valid: boolean; missing: string[] } {
  const required = ['make', 'model', 'year'];
  const missing = required.filter(field => !safeGet(data, field));
  
  return {
    valid: missing.length === 0,
    missing
  };
}

export function withDefaults<T>(obj: Partial<T>, defaults: T): T {
  return { ...defaults, ...obj };
}