export interface CarfaxData {
  accidentsReported: number;
  owners: number;
  serviceRecords: number;
  salvageTitle: boolean;
  reportUrl: string;
  titleEvents: string[]; // Required property
  damageSeverity?: string; // Optional property for VehicleInfoCard.tsx
}

<<<<<<< HEAD
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
=======
export async function getCarfaxReport(vin: string): Promise<CarfaxData> {
  // In a real implementation, this would call the CARFAX API
  // For now, we'll return mock data based on the VIN

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate deterministic mock data based on the VIN
  const lastChar = vin.charAt(vin.length - 1);
  const accidentsReported = "01234".includes(lastChar) ? 0 : 1;
  const owners = parseInt(lastChar, 16) % 3 + 1;
  const salvageTitle = lastChar === "X";

  return {
    accidentsReported,
    damageSeverity: accidentsReported > 0 ? "Minor" : undefined,
    owners,
    serviceRecords: parseInt(lastChar, 16) % 10 + 3,
    salvageTitle,
    titleEvents: salvageTitle ? ["Salvage title"] : ["Clean title"],
    reportUrl: `https://www.carfax.com/VehicleHistory/p/Report.cfx?vin=${vin}`,
    lastReported: accidentsReported > 0 ? "05/2022" : undefined,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };
};

// Add alias for backward compatibility
export const getCarfaxReport = fetchCarfaxReport;
