
import { PlateLookupInfo } from '@/types/lookup';
import { PlateLookupResponse } from '@/types/api';

export async function lookupPlate(plate: string, state: string): Promise<PlateLookupInfo> {
  try {
    // For MVP we'll mock the API call
    // In the real implementation, this would call a Supabase Edge Function
    const response = await mockPlateLookup(plate, state);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    if (!response.data) {
      throw new Error('No data returned from plate lookup');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error looking up plate:', error);
    throw error;
  }
}

// Mock function for MVP (would be replaced with actual API call)
async function mockPlateLookup(plate: string, state: string): Promise<PlateLookupResponse> {
  // Basic validation
  if (!plate || plate.length < 2 || plate.length > 8) {
    return { error: 'Invalid plate format. Plate must be between 2-8 characters.' };
  }
  
  if (!state || state.length !== 2) {
    return { error: 'Invalid state format. State must be a 2-letter code (e.g., CA, NY, TX).' };
  }
  
  // Mock delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Sample data based on first character of plate
  const firstChar = plate.charAt(0).toUpperCase();
  const colors = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Gray'];
  const colorIndex = Math.floor(Math.random() * colors.length);
  
  if (firstChar >= 'A' && firstChar <= 'F') {
    return {
      data: {
        plate,
        state,
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        color: colors[colorIndex]
      }
    };
  } else if (firstChar >= 'G' && firstChar <= 'L') {
    return {
      data: {
        plate,
        state,
        make: 'Honda',
        model: 'Accord',
        year: 2021,
        color: colors[colorIndex]
      }
    };
  } else if (firstChar >= 'M' && firstChar <= 'R') {
    return {
      data: {
        plate,
        state,
        make: 'Ford',
        model: 'Mustang',
        year: 2019,
        color: colors[colorIndex]
      }
    };
  } else {
    return {
      data: {
        plate,
        state,
        make: 'Chevrolet',
        model: 'Malibu',
        year: 2018,
        color: colors[colorIndex]
      }
    };
  }
}
