
/**
 * Mock CARFAX service that returns sample vehicle history data
 * This will be replaced with actual API calls once CARFAX API access is obtained
 */

export interface CarfaxData {
  accidentsReported: number;
  damageSeverity?: "minor" | "moderate" | "severe";
  owners: number;
  serviceRecords: number;
  salvageTitle: boolean;
  brandedTitle?: string;
  vin: string;
}

// Mock responses for different VINs to simulate different vehicle histories
const MOCK_RESPONSES: Record<string, Partial<CarfaxData>> = {
  // Clean vehicle with good service history
  "1HGCM82633A123456": {
    accidentsReported: 0,
    damageSeverity: undefined,
    owners: 1,
    serviceRecords: 12,
    salvageTitle: false
  },
  // Vehicle with accident history
  "JH4KA7661NC036794": {
    accidentsReported: 1,
    damageSeverity: "moderate",
    owners: 3,
    serviceRecords: 9,
    salvageTitle: false
  },
  // Problematic vehicle with salvage title
  "1G1JC524417236742": {
    accidentsReported: 2,
    damageSeverity: "severe",
    owners: 4,
    serviceRecords: 3,
    salvageTitle: true,
    brandedTitle: "Salvage"
  }
};

// Default response for any VIN not in our mock database
const DEFAULT_RESPONSE: Partial<CarfaxData> = {
  accidentsReported: 0,
  owners: 2,
  serviceRecords: 7,
  salvageTitle: false
};

/**
 * Get mock CARFAX data for a VIN
 * @param vin Vehicle Identification Number
 * @returns Promise that resolves to mock CARFAX data
 */
export async function getCarfaxReport(vin: string): Promise<CarfaxData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data based on VIN or default response
  const mockData = MOCK_RESPONSES[vin] || DEFAULT_RESPONSE;
  
  return {
    ...mockData,
    vin
  } as CarfaxData;
}

/**
 * Check if a VIN has a CARFAX report available (mock implementation)
 * @param vin Vehicle Identification Number
 * @returns Promise that resolves to true if a report is available
 */
export async function isCarfaxReportAvailable(vin: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // For mock purposes, return true for most VINs except specific test cases
  return vin !== "NO_CARFAX_TEST_VIN";
}
