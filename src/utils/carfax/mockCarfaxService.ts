
export interface CarfaxData {
  vin: string;
  accidents: number;
  owners: number;
  serviceRecords: number;
  title: string;
}

export const mockCarfaxService = {
  getCarfaxData: async (vin: string): Promise<CarfaxData | null> => {
    // Mock implementation for MVP
    return {
      vin,
      accidents: 0,
      owners: 1,
      serviceRecords: 5,
      title: 'Clean'
    };
  }
};
