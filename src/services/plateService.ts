import { PlateLookupInfo } from "@/types/lookup";
import { PlateLookupResponse } from "@/types/api";

<<<<<<< HEAD
import { PlateLookupInfo } from '@/types/lookup';
import { ApiResponse } from '@/types/api';

export interface PlateLookupResponse extends ApiResponse<PlateLookupInfo> {}

export interface PlateLookupOptions {
  tier?: 'free' | 'premium';
  includePremiumFeatures?: boolean;
}

export const lookupPlate = async (
  plate: string,
  state: string,
  options: PlateLookupOptions = {}
): Promise<PlateLookupResponse> => {
  const { tier = 'free', includePremiumFeatures = false } = options;
  
  try {
    // Simulate API delay based on tier
    const delay = tier === 'premium' ? 1500 : 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Base mock data
    const baseData: PlateLookupInfo = {
      plate,
      state,
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      vin: 'JT2BF22K1W0123456',
      color: 'Silver',
      mileage: 45000,
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      bodyType: 'Sedan',
      estimatedValue: 18500,
      zipCode: '90210',
      condition: 'Good'
    };

    // Enhanced data for premium tier
    if (tier === 'premium' || includePremiumFeatures) {
      const premiumData = {
        ...baseData,
        // Premium-specific enhancements
        detailedSpecs: {
          engine: '2.5L 4-Cylinder',
          drivetrain: 'FWD',
          safety: ['ABS', 'Airbags', 'Stability Control'],
          features: ['Bluetooth', 'Backup Camera', 'Cruise Control']
        },
        marketData: {
          averagePrice: 18500,
          priceRange: [16650, 20350] as [number, number],
          daysOnMarket: 28,
          priceHistory: [
            { date: '2024-01', price: 19200 },
            { date: '2024-02', price: 18800 },
            { date: '2024-03', price: 18500 }
          ]
        },
        historyReport: {
          accidents: 0,
          owners: 2,
          serviceRecords: 12,
          recalls: 1
        },
        confidenceScore: 92
      };
      
      return {
        success: true,
        data: premiumData
      };
    }

    return {
      success: true,
      data: baseData
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to lookup license plate'
=======
export async function lookupPlate(
  plate: string,
  state: string,
): Promise<PlateLookupInfo> {
  try {
    // For MVP we'll mock the API call
    // In the real implementation, this would call a Supabase Edge Function
    const response = await mockPlateLookup(plate, state);

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data returned from plate lookup");
    }

    return response.data;
  } catch (error) {
    console.error("Error looking up plate:", error);
    throw error;
  }
}

// Export the mockPlateLookup function
export async function mockPlateLookup(
  plate: string,
  state: string,
): Promise<PlateLookupResponse> {
  // Basic validation
  if (!plate || plate.length < 2 || plate.length > 8) {
    return {
      error: "Invalid plate format. Plate must be between 2-8 characters.",
    };
  }

  if (!state || state.length !== 2) {
    return {
      error:
        "Invalid state format. State must be a 2-letter code (e.g., CA, NY, TX).",
    };
  }

  // Mock delay to simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Sample data based on first character of plate
  const firstChar = plate.charAt(0).toUpperCase();
  const colors = ["Black", "White", "Silver", "Red", "Blue", "Gray"];
  const colorIndex = Math.floor(Math.random() * colors.length);

  // Generate a basic mileage value for each vehicle
  const mileage = Math.floor(Math.random() * 100000) + 10000;

  if (firstChar >= "A" && firstChar <= "F") {
    return {
      data: {
        vin: "JT2BK1BA" +
          Math.random().toString(36).substring(2, 10).toUpperCase(),
        plate: plate,
        state: state,
        make: "Toyota",
        model: "Camry",
        year: 2020,
        color: colors[colorIndex],
        mileage: mileage,
      },
    };
  } else if (firstChar >= "G" && firstChar <= "L") {
    return {
      data: {
        vin: "1HGCM82" +
          Math.random().toString(36).substring(2, 10).toUpperCase(),
        plate: plate,
        state: state,
        make: "Honda",
        model: "Accord",
        year: 2021,
        color: colors[colorIndex],
        mileage: mileage,
      },
    };
  } else if (firstChar >= "M" && firstChar <= "R") {
    return {
      data: {
        vin: "1FA6P8CF" +
          Math.random().toString(36).substring(2, 10).toUpperCase(),
        plate: plate,
        state: state,
        make: "Ford",
        model: "Mustang",
        year: 2019,
        color: colors[colorIndex],
        mileage: mileage,
      },
    };
  } else {
    return {
      data: {
        vin: "1G1ZD5ST" +
          Math.random().toString(36).substring(2, 10).toUpperCase(),
        plate: plate,
        state: state,
        make: "Chevrolet",
        model: "Malibu",
        year: 2018,
        color: colors[colorIndex],
        mileage: mileage,
      },
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    };
  }
};

// Utility function for state-specific plate formatting
export const formatPlateForState = (plate: string, state: string): string => {
  const cleanPlate = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
  
  // State-specific formatting rules
  switch (state) {
    case 'CA':
      return cleanPlate.replace(/(\d{1})([A-Z]{3})(\d{3})/, '$1$2$3');
    case 'NY':
      return cleanPlate.replace(/([A-Z]{3})(\d{4})/, '$1-$2');
    case 'TX':
      return cleanPlate.replace(/([A-Z]{3})(\d{4})/, '$1 $2');
    default:
      return cleanPlate;
  }
};

// Get plate validation rules for specific state
export const getStatePlateInfo = (state: string) => {
  const stateInfo: Record<string, { format: string; example: string }> = {
    CA: { format: '1ABC123', example: '7ABC123' },
    NY: { format: 'ABC-1234', example: 'ABC-1234' },
    TX: { format: 'ABC 1234', example: 'ABC 1234' },
    FL: { format: 'ABC 12D', example: 'ABC 12D' }
  };
  
  return stateInfo[state] || { format: 'ABC123', example: 'ABC123' };
};
