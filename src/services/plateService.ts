
import { PlateLookupInfo } from '@/types/vehicle';

interface PlateLookupResponse {
  success: boolean;
  data?: PlateLookupInfo;
  error?: string;
}

export async function mockPlateLookup(
  plate: string,
  state: string
): Promise<PlateLookupResponse> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock data
    const mockData: PlateLookupInfo = {
      plate,
      state,
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      color: 'Silver',
      estimatedValue: 24500,
      vin: '1HGBH41JXMN109186'
    };

    return {
      success: true,
      data: mockData
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Plate lookup failed'
    };
  }
}
