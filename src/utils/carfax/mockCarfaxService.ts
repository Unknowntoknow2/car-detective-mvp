
export interface CarfaxData {
  accidentsReported: number;
  damageSeverity?: string;
  owners: number;
  serviceRecords: number;
  salvageTitle: boolean;
  titleEvents: string[];
  reportUrl: string;
  lastReported?: string;
}

export async function getCarfaxReport(vin: string): Promise<CarfaxData> {
  // In a real implementation, this would call the CARFAX API
  // For now, we'll return mock data based on the VIN
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate deterministic mock data based on the VIN
  const lastChar = vin.charAt(vin.length - 1);
  const accidentsReported = '01234'.includes(lastChar) ? 0 : 1;
  const owners = parseInt(lastChar, 16) % 3 + 1;
  const salvageTitle = lastChar === 'X';
  
  return {
    accidentsReported,
    damageSeverity: accidentsReported > 0 ? 'Minor' : undefined,
    owners,
    serviceRecords: parseInt(lastChar, 16) % 10 + 3,
    salvageTitle,
    titleEvents: salvageTitle ? ['Salvage title'] : ['Clean title'],
    reportUrl: `https://www.carfax.com/VehicleHistory/p/Report.cfx?vin=${vin}`,
    lastReported: accidentsReported > 0 ? '05/2022' : undefined
  };
}
