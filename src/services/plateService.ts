export interface PlateServiceResponse {
  vehicle: {
    make: string;
    model: string;
    year: number;
    vin?: string;
  };
  success: boolean;
  error?: string;
}

export const plateService = {
  lookupPlate: async (plateNumber: string, state: string): Promise<PlateServiceResponse> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      vehicle: {
        make: "Toyota",
        model: "Camry",
        year: 2020,
        vin: "MOCK123456789"
      },
      success: true
    };
  }
};

export const mockPlateLookup = plateService.lookupPlate;
