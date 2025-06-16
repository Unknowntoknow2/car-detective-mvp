
export interface PlateServiceResponse {
  vehicle?: {
    make: string;
    model: string;
    year: number;
    vin?: string;
  };
  data?: {
    make: string;
    model: string;
    year: number;
    vin?: string;
    estimatedValue?: number;
  };
  success: boolean;
  error?: string;
}

export const plateService = {
  lookupPlate: async (plateNumber: string, state: string): Promise<PlateServiceResponse> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockVehicle = {
      make: "Toyota",
      model: "Camry",
      year: 2020,
      vin: "MOCK123456789",
      estimatedValue: 24500
    };
    
    return {
      vehicle: mockVehicle,
      data: mockVehicle,
      success: true
    };
  }
};

export const mockPlateLookup = plateService.lookupPlate;
