<<<<<<< HEAD

import { DecodedVehicleInfo } from '@/types/vehicle';
import { supabase } from '@/integrations/supabase/client';
=======
import type { DecodedVehicleInfo } from "@/types/vehicle";
import { VinDecoderResponse } from "@/types/api";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export interface VinDecodeResponse {
  success: boolean;
  data?: DecodedVehicleInfo;
  error?: string;
}

export const decodeVin = async (vin: string): Promise<VinDecodeResponse> => {
  try {
<<<<<<< HEAD
    console.log('VIN Service: Calling unified-decode for VIN:', vin);
    
    // Validate VIN length
    if (!vin || vin.length !== 17) {
      return {
        success: false,
        error: 'Invalid VIN format. VIN must be 17 characters long.'
      };
    }
    
    // Call the unified-decode edge function
    const { data, error } = await supabase.functions.invoke('unified-decode', {
      body: { vin: vin.toUpperCase() }
    });

    if (error) {
      console.error('VIN Service: Edge function error:', error);
      return {
        success: false,
        error: 'Service temporarily unavailable. Please try again.'
      };
    }

    if (!data || !data.success) {
      console.error('VIN Service: Decode failed:', data?.error);
      return {
        success: false,
        error: data?.error || 'Failed to decode VIN'
      };
    }

    // Convert the response to our format
    const vehicleData = convertToVehicleInfo(data.decoded);
    
    console.log('VIN Service: Successfully decoded VIN:', vehicleData);
    
    return {
      success: true,
      data: vehicleData
    };
    
  } catch (error) {
    console.error('VIN Service: Unexpected error:', error);
    return {
      success: false,
      error: 'Failed to decode VIN due to network or service error'
=======
    // For MVP we'll mock the API call
    // In the real implementation, this would call a Supabase Edge Function
    const response = await mockVinDecoder(vin);

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data returned from VIN decoder");
    }

    return response.data;
  } catch (error) {
    console.error("Error decoding VIN:", error);
    throw error;
  }
}

// Mock function for MVP (would be replaced with actual API call)
async function mockVinDecoder(vin: string): Promise<VinDecoderResponse> {
  // Basic VIN validation
  if (!vin || vin.length !== 17 || !/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
    return {
      error:
        "Invalid VIN format. VIN must be 17 characters and contain only alphanumeric characters (excluding I, O, Q).",
    };
  }

  // Mock delay to simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Different mock responses based on first character of VIN
  const firstChar = vin.charAt(0).toUpperCase();

  // Sample data
  if (firstChar === "1") {
    return {
      data: {
        vin,
        make: "Toyota",
        model: "Camry",
        year: 2020,
        trim: "SE",
        engine: "2.5L I4",
        transmission: "Automatic",
        drivetrain: "FWD",
        bodyType: "Sedan",
      },
    };
  } else if (firstChar === "2") {
    return {
      data: {
        vin,
        make: "Honda",
        model: "Civic",
        year: 2021,
        trim: "Sport",
        engine: "1.5L I4 Turbo",
        transmission: "CVT",
        drivetrain: "FWD",
        bodyType: "Sedan",
      },
    };
  } else if (firstChar === "3") {
    return {
      data: {
        vin,
        make: "Ford",
        model: "F-150",
        year: 2019,
        trim: "XLT",
        engine: "5.0L V8",
        transmission: "Automatic",
        drivetrain: "4WD",
        bodyType: "Pickup",
      },
    };
  } else if (firstChar === "4") {
    return {
      data: {
        vin,
        make: "Chevrolet",
        model: "Equinox",
        year: 2022,
        trim: "LT",
        engine: "1.5L I4 Turbo",
        transmission: "Automatic",
        drivetrain: "AWD",
        bodyType: "SUV",
      },
    };
  } else if (firstChar === "5") {
    return {
      data: {
        vin,
        make: "BMW",
        model: "3 Series",
        year: 2020,
        trim: "330i",
        engine: "2.0L I4 Turbo",
        transmission: "Automatic",
        drivetrain: "RWD",
        bodyType: "Sedan",
      },
    };
  } else {
    return {
      data: {
        vin,
        make: "Nissan",
        model: "Altima",
        year: 2018,
        trim: "SV",
        engine: "2.5L I4",
        transmission: "CVT",
        drivetrain: "FWD",
        bodyType: "Sedan",
      },
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    };
  }
};

function convertToVehicleInfo(decoded: any): DecodedVehicleInfo {
  // Generate estimated values (in real app, this would come from pricing API)
  const vinHash = decoded.vin?.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) || 0;
  const baseValue = Math.max(5000, 15000 + (vinHash % 35000)); // $5k to $50k range
  const mileage = Math.max(1000, 20000 + (vinHash % 150000)); // 1k to 170k miles
  
  return {
    vin: decoded.vin || '',
    year: decoded.year || new Date().getFullYear(),
    make: decoded.make || 'Unknown',
    model: decoded.model || 'Unknown',
    trim: decoded.trim || 'Base',
    engine: decoded.engine || 'Unknown',
    transmission: decoded.transmission || 'Unknown',
    bodyType: decoded.bodyType || 'Unknown',
    fuelType: decoded.fuelType || 'Unknown',
    drivetrain: decoded.drivetrain || 'Unknown',
    exteriorColor: 'Unknown', // Not provided by NHTSA
    estimatedValue: baseValue,
    confidenceScore: 85, // Based on NHTSA data quality
    mileage,
    condition: 'Good',
    valuationId: crypto.randomUUID(),
    engineCylinders: decoded.engineCylinders,
    displacementL: decoded.displacementL,
    seats: decoded.seats,
    doors: decoded.doors
  };
}
