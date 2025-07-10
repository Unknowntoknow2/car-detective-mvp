// VIN Metadata Parser - Extract trim, fuel type, and engine from decoded VIN data

export interface VehicleMetadata {
  trim: string | null;
  fuelType: 'Gasoline' | 'Diesel' | 'Hybrid' | 'Electric' | 'Unknown';
  engine: string | null;
}

/**
 * Parses vehicle metadata from decoded VIN data
 * Handles various field naming conventions from different decode sources
 */
export function parseVehicleMetadata(decoded: Record<string, any>): VehicleMetadata {
  // Extract trim - check multiple possible field names
  const trim = decoded?.trim || 
               decoded?.model_trim || 
               decoded?.trim_level ||
               decoded?.series ||
               decoded?.style ||
               null;

  // Extract and classify fuel type
  const rawFuel = (
    decoded?.fuel_type || 
    decoded?.fuelType || 
    decoded?.fueltype ||
    decoded?.engine_type || 
    decoded?.fuel_primary ||
    decoded?.engine ||
    ""
  ).toString().toLowerCase();

  let fuelType: VehicleMetadata['fuelType'] = 'Unknown';
  
  if (/hybrid/i.test(rawFuel)) {
    fuelType = 'Hybrid';
  } else if (/electric|ev|battery/i.test(rawFuel)) {
    fuelType = 'Electric';
  } else if (/diesel/i.test(rawFuel)) {
    fuelType = 'Diesel';
  } else if (/gas|gasoline|petrol|regular/i.test(rawFuel)) {
    fuelType = 'Gasoline';
  }

  // Extract engine information
  const engine = decoded?.engine || 
                decoded?.engine_type || 
                decoded?.displacement ||
                decoded?.engine_displacement ||
                decoded?.displacementl ||
                null;

  return {
    trim: trim ? String(trim).trim() : null,
    fuelType,
    engine: engine ? String(engine).trim() : null,
  };
}

/**
 * Estimates MPG based on vehicle metadata
 * Used as fallback when EPA data is unavailable
 */
export function estimateMpgFromMetadata(
  make: string, 
  model: string, 
  year: number, 
  fuelType: VehicleMetadata['fuelType'],
  engine?: string | null
): number | null {
  const makeLower = make.toLowerCase();
  const modelLower = model.toLowerCase();
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - year;
  
  // Electric vehicles - use eMPG equivalent
  if (fuelType === 'Electric') {
    if (makeLower.includes('tesla')) return 120;
    if (modelLower.includes('leaf')) return 110;
    if (modelLower.includes('bolt')) return 115;
    return 100; // Default EV efficiency
  }

  // Hybrid vehicles
  if (fuelType === 'Hybrid') {
    if (makeLower.includes('toyota')) {
      if (modelLower.includes('prius')) return Math.max(45, 50 - vehicleAge);
      if (modelLower.includes('camry')) return Math.max(40, 44 - vehicleAge);
      if (modelLower.includes('highlander')) return Math.max(32, 36 - vehicleAge);
    }
    if (makeLower.includes('honda')) {
      if (modelLower.includes('accord')) return Math.max(42, 46 - vehicleAge);
      if (modelLower.includes('insight')) return Math.max(48, 52 - vehicleAge);
    }
    return Math.max(35, 40 - vehicleAge); // Default hybrid
  }

  // Gasoline vehicles by category
  if (fuelType === 'Gasoline') {
    // Trucks and large SUVs
    if (modelLower.includes('f-150') || 
        modelLower.includes('silverado') || 
        modelLower.includes('ram') ||
        modelLower.includes('tahoe') ||
        modelLower.includes('suburban')) {
      return Math.max(15, 20 - Math.floor(vehicleAge / 2));
    }
    
    // Mid-size SUVs
    if (modelLower.includes('explorer') ||
        modelLower.includes('pilot') ||
        modelLower.includes('highlander') ||
        modelLower.includes('cr-v') ||
        modelLower.includes('rav4')) {
      return Math.max(20, 26 - Math.floor(vehicleAge / 3));
    }
    
    // Compact/Mid-size cars
    if (modelLower.includes('camry') ||
        modelLower.includes('accord') ||
        modelLower.includes('altima') ||
        modelLower.includes('civic') ||
        modelLower.includes('corolla')) {
      return Math.max(25, 32 - Math.floor(vehicleAge / 4));
    }
    
    // Luxury/Sports cars
    if (makeLower.includes('bmw') ||
        makeLower.includes('mercedes') ||
        makeLower.includes('audi') ||
        makeLower.includes('lexus') ||
        modelLower.includes('mustang') ||
        modelLower.includes('corvette')) {
      return Math.max(18, 24 - Math.floor(vehicleAge / 3));
    }
    
    // Default gasoline vehicle
    return Math.max(22, 28 - Math.floor(vehicleAge / 4));
  }

  // Diesel vehicles
  if (fuelType === 'Diesel') {
    if (modelLower.includes('f-250') || 
        modelLower.includes('f-350') ||
        modelLower.includes('ram 2500') ||
        modelLower.includes('silverado 2500')) {
      return Math.max(15, 20 - Math.floor(vehicleAge / 3));
    }
    return Math.max(25, 30 - Math.floor(vehicleAge / 4)); // Default diesel
  }

  return null; // Unknown fuel type
}

/**
 * Enhanced metadata parser with MPG estimation
 */
export function parseVehicleMetadataWithMpg(
  decoded: Record<string, any>,
  make: string,
  model: string,
  year: number
): VehicleMetadata & { estimatedMpg: number | null } {
  const metadata = parseVehicleMetadata(decoded);
  const estimatedMpg = estimateMpgFromMetadata(make, model, year, metadata.fuelType, metadata.engine);
  
  return {
    ...metadata,
    estimatedMpg,
  };
}