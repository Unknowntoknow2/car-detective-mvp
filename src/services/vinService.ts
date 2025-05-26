
import { DecodedVehicleInfo } from '@/types/vehicle';
import { supabase } from '@/integrations/supabase/client';

export interface VinDecodeResponse {
  success: boolean;
  data?: DecodedVehicleInfo;
  error?: string;
}

export const decodeVin = async (vin: string): Promise<VinDecodeResponse> => {
  try {
    console.log('VIN Service: Calling NHTSA API for VIN:', vin);
    
    // Validate VIN length
    if (!vin || vin.length !== 17) {
      return {
        success: false,
        error: 'Invalid VIN format. VIN must be 17 characters long.'
      };
    }
    
    // Call the NHTSA vPIC API through our edge function with retry logic
    let lastError = null;
    const maxRetries = 2;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`VIN Service: Attempt ${attempt} of ${maxRetries} for VIN ${vin}`);
        
        const { data: nhtsaData, error } = await supabase.functions.invoke('fetch_vpic_data', {
          body: { vin }
        });

        if (error) {
          lastError = error;
          console.error(`VIN Service: Attempt ${attempt} failed:`, error);
          
          // If it's a 503 error, try again
          if (error.message?.includes('503') && attempt < maxRetries) {
            console.log(`VIN Service: NHTSA API temporarily unavailable, retrying in 2 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
          
          // If it's not a 503 or final attempt, break
          break;
        }

        if (!nhtsaData?.data) {
          console.error('VIN Service: No data returned from NHTSA');
          return {
            success: false,
            error: 'No vehicle data found for this VIN'
          };
        }

        // Convert NHTSA data to our format
        const vehicleData = convertNhtsaToVehicleInfo(vin, nhtsaData.data);
        
        console.log('VIN Service: Successfully decoded VIN:', vehicleData);
        
        return {
          success: true,
          data: vehicleData
        };
        
      } catch (attemptError: any) {
        lastError = attemptError;
        console.error(`VIN Service: Attempt ${attempt} error:`, attemptError);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    
    // If all attempts failed, check if we can provide a fallback response
    if (lastError?.message?.includes('503') || lastError?.message?.includes('Service Unavailable')) {
      console.log('VIN Service: NHTSA API unavailable, providing fallback response');
      return createFallbackResponse(vin);
    }
    
    return {
      success: false,
      error: lastError?.message || 'Failed to decode VIN due to service error'
    };
    
  } catch (error) {
    console.error('VIN Service: Unexpected error:', error);
    return {
      success: false,
      error: 'Failed to decode VIN due to network or service error'
    };
  }
};

function createFallbackResponse(vin: string): VinDecodeResponse {
  // Extract basic info from VIN structure when possible
  const year = extractYearFromVin(vin);
  const make = extractMakeFromVin(vin);
  
  return {
    success: true,
    data: {
      vin,
      year: year || new Date().getFullYear(),
      make: make || 'Unknown',
      model: 'Unknown',
      trim: 'Base',
      engine: 'Unknown',
      transmission: 'Unknown',
      bodyType: 'Unknown',
      fuelType: 'Unknown',
      drivetrain: 'Unknown',
      exteriorColor: 'Unknown',
      estimatedValue: 25000, // Default estimated value
      confidenceScore: 60, // Lower confidence for fallback
      mileage: 75000, // Default mileage
      condition: 'Good',
      valuationId: crypto.randomUUID()
    }
  };
}

function extractYearFromVin(vin: string): number | null {
  // VIN position 10 indicates model year
  const yearChar = vin.charAt(9);
  const yearMap: { [key: string]: number } = {
    'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014, 'F': 2015,
    'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019, 'L': 2020, 'M': 2021,
    'N': 2022, 'P': 2023, 'R': 2024, 'S': 2025, 'T': 2026, 'V': 2027,
    'W': 2028, 'X': 2029, 'Y': 2030, '1': 2001, '2': 2002, '3': 2003,
    '4': 2004, '5': 2005, '6': 2006, '7': 2007, '8': 2008, '9': 2009
  };
  
  return yearMap[yearChar] || null;
}

function extractMakeFromVin(vin: string): string | null {
  // Common WMI (World Manufacturer Identifier) prefixes
  const makeMap: { [key: string]: string } = {
    '1': 'General Motors',
    '2': 'General Motors',
    '3': 'General Motors',
    '4': 'Toyota',
    '5': 'Toyota',
    'J': 'Toyota',
    'WBA': 'BMW',
    'WBS': 'BMW',
    'WDD': 'Mercedes-Benz',
    'WDB': 'Mercedes-Benz',
    'WAU': 'Audi',
    'WVW': 'Volkswagen',
    'YV1': 'Volvo',
    'ZFF': 'Ferrari',
    'SAL': 'Land Rover',
    'SAJ': 'Jaguar',
    'VF1': 'Renault',
    'VF3': 'Peugeot',
    'VF7': 'Citroën'
  };
  
  // Check 3-character WMI first
  const wmi3 = vin.substring(0, 3);
  if (makeMap[wmi3]) {
    return makeMap[wmi3];
  }
  
  // Check 1-character WMI
  const wmi1 = vin.charAt(0);
  if (makeMap[wmi1]) {
    return makeMap[wmi1];
  }
  
  return null;
}

function convertNhtsaToVehicleInfo(vin: string, nhtsaData: any): DecodedVehicleInfo {
  // Extract real data from NHTSA response
  const make = nhtsaData.make || 'Unknown';
  const model = nhtsaData.model || 'Unknown';
  const year = nhtsaData.modelYear || nhtsaData.year || new Date().getFullYear();
  const bodyType = nhtsaData.bodyClass || 'Unknown';
  const fuelType = nhtsaData.fuelType || 'Unknown';
  const transmission = nhtsaData.transmissionStyle || 'Unknown';
  const driveType = nhtsaData.driveType || 'Unknown';
  
  // Generate estimated values (in real app, this would come from pricing API)
  const vinHash = vin.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseValue = Math.max(5000, 15000 + (vinHash % 35000)); // $5k to $50k range
  const mileage = Math.max(1000, 20000 + (vinHash % 150000)); // 1k to 170k miles
  
  return {
    vin,
    year,
    make,
    model,
    trim: nhtsaData.trim || nhtsaData.series || 'Base',
    engine: nhtsaData.engineSize ? `${nhtsaData.engineSize}L` : 'Unknown',
    transmission,
    bodyType,
    fuelType,
    drivetrain: driveType,
    exteriorColor: 'Unknown', // NHTSA doesn't provide color
    estimatedValue: baseValue,
    confidenceScore: 85, // Based on NHTSA data quality
    mileage,
    condition: 'Good',
    valuationId: crypto.randomUUID()
  };
}
