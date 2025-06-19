
export interface CarfaxData {
  accidents: number;
  owners: number;
  serviceRecords: number;
  title: string;
  reportUrl: string;
  accidentsReported: number;
  salvageTitle: boolean;
}

// Placeholder service - replace with actual Carfax integration
export const carfaxService = {
  getCarfaxData: async (vin: string): Promise<CarfaxData | null> => {
    // This would integrate with actual Carfax API
    return null;
  }
};
