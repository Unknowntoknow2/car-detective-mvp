
export interface CarfaxData {
  accidentsReported: number;
  owners: number;
  serviceRecords: number;
  salvageTitle: boolean;
  titleEvents: string[];
  reportUrl: string;
  damageSeverity?: string;
}

export const getCarfaxReport = async (vin: string): Promise<CarfaxData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock data based on VIN
  const mockData: CarfaxData = {
    accidentsReported: Math.floor(Math.random() * 3),
    owners: Math.floor(Math.random() * 4) + 1,
    serviceRecords: Math.floor(Math.random() * 10) + 1,
    salvageTitle: Math.random() < 0.1,
    titleEvents: ['Clean Title'],
    reportUrl: `https://www.carfax.com/vehicle/${vin}`,
    damageSeverity: Math.random() < 0.3 ? 'minor' : undefined
  };
  
  return mockData;
};
