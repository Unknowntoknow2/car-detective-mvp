
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
