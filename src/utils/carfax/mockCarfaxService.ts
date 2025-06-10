
export interface CarfaxData {
  vin: string;
  accidents: number;
  accidentsReported: number;
  owners: number;
  serviceRecords: number;
  title: string;
  salvageTitle: boolean;
  reportUrl: string;
}

export const mockCarfaxService = {
  getCarfaxData: async (vin: string): Promise<CarfaxData | null> => {
    // Mock implementation for MVP
    return {
      vin,
      accidents: 0,
      accidentsReported: 0,
      owners: 1,
      serviceRecords: 5,
      title: 'Clean',
      salvageTitle: false,
      reportUrl: '#'
    };
  },
  
  getCarfaxReport: async (vin: string): Promise<CarfaxData | null> => {
    return mockCarfaxService.getCarfaxData(vin);
  }
};
