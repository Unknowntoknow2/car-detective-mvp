
import { DecodedVehicleInfo } from '@/types/vehicle';
import { generateValuationPdf as generatePdf } from './pdf/pdfGenerator';

/**
 * Generates a PDF valuation report for a vehicle
 * @param params Object containing vehicle information, valuation, explanation and comparable listings
 * @returns Promise resolving to PDF document as Uint8Array
 */
export async function generateValuationPdf(params: {
  vehicle: DecodedVehicleInfo;
  valuation: number;
  explanation: string;
  explanationText?: string;
  comparables?: { source: string; price: number; date: string }[];
}): Promise<Uint8Array> {
  return generatePdf(params);
}
