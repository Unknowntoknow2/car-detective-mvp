
export interface CarfaxData {
  accidentsReported: number;
  owners: number;
  serviceRecords: number;
  salvageTitle: boolean;
  reportUrl: string;
  titleEvents: string[]; // Required property
  damageSeverity?: string; // Optional property for VehicleInfoCard.tsx
}

export const fetchCarfaxReport = async (vin: string): Promise<CarfaxData | null> => {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For demo purposes, return mock data
  return {
    accidentsReported: Math.random() > 0.7 ? 1 : 0,
    owners: Math.floor(Math.random() * 3) + 1,
    serviceRecords: Math.floor(Math.random() * 10) + 2,
    salvageTitle: Math.random() > 0.9,
    reportUrl: `https://example.com/carfax/${vin}`,
    titleEvents: ["Clean Title Issued", "Registration Renewed"], // Add example title events
    damageSeverity: Math.random() > 0.7 ? 'Minor' : 'None' // Add damage severity
  };
};

// Add alias for backward compatibility
export const getCarfaxReport = fetchCarfaxReport;
