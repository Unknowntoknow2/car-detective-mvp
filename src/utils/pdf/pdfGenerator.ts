
import { PDFDocument, PDFPage } from 'pdf-lib';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { initializePdf } from './components/pdfCommon';
import { drawHeaderSection, drawFooterSection, drawSignatureAndQR } from './sections/headerFooterSection';
import { drawVehicleDetailsSection } from './sections/vehicleDetailsSection';
import { drawValuationSection } from './sections/valuationSection';
import { drawCommentarySection } from './sections/commentarySection';
import { drawComparablesSection } from './sections/comparablesSection';

interface GeneratePdfParams {
  vehicle: DecodedVehicleInfo;
  valuation: number;
  explanation: string;
  explanationText?: string;
  comparables?: { source: string; price: number; date: string }[];
  valuationId?: string; // Added valuationId parameter
}

/**
 * Main function to generate a PDF valuation report for a vehicle
 * @param params Object containing vehicle information, valuation, explanation and comparable listings
 * @returns Promise resolving to PDF document as Uint8Array
 */
export async function generateValuationPdf(params: GeneratePdfParams): Promise<Uint8Array> {
  const { vehicle, valuation, explanation, explanationText, comparables = [], valuationId } = params;
  
  // Initialize PDF document, fonts, and constants
  const { pdfDoc, page, fonts, constants } = await initializePdf();
  
  // Initial y position at the top of the page
  let yPos = constants.height - constants.margin;
  
  // Draw header section
  yPos = drawHeaderSection(page, yPos, fonts, constants);
  
  // Draw vehicle details section
  yPos = drawVehicleDetailsSection(page, vehicle, yPos, fonts, constants);
  
  // Add some spacing
  yPos -= 20;
  
  // Draw valuation section
  yPos = drawValuationSection(page, valuation, yPos, fonts, constants);
  
  // Draw expert valuation commentary section
  const commentaryText = explanationText || explanation;
  yPos = drawCommentarySection(page, commentaryText, yPos, fonts, constants);
  
  // Draw comparables section if available
  let currentPage = page;
  if (comparables.length > 0) {
    const result = drawComparablesSection(pdfDoc, currentPage, comparables, yPos, fonts, constants);
    currentPage = result.page;
    yPos = result.yPos;
  }
  
  // Draw footer on all pages
  const pageCount = pdfDoc.getPageCount();
  for (let i = 0; i < pageCount; i++) {
    drawFooterSection(pdfDoc.getPage(i), fonts, constants);
  }
  
  // Draw signature and QR code on the last page
  await drawSignatureAndQR(currentPage, fonts, constants, valuationId);
  
  // Serialize the PDFDocument to bytes
  return await pdfDoc.save();
}
