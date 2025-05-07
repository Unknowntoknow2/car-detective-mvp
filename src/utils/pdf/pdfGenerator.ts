
import { PDFDocument, PageSizes, rgb, StandardFonts, PDFFont } from 'pdf-lib';
import { ReportData, ReportOptions } from './types';
import { drawHeaderSection } from './sections/headerSection';
import { drawVehicleInfoSection } from './sections/vehicleInfoSection';
import { drawValuationSection } from './sections/valuationSection';
import { drawExplanationSection } from './sections/explanationSection';
import { drawFooterSection } from './sections/footerSection';
import { drawAIConditionSection } from './sections/aiConditionSection';

/**
 * Generates a PDF report based on the provided data
 * @param data The vehicle and valuation data to include in the report
 * @returns Promise resolving to PDF document as Uint8Array
 */
export async function generatePdf(
  data: ReportData,
  options: ReportOptions = {
    includeBranding: true,
    includeAIScore: true,
    includeFooter: true,
    includeTimestamp: true,
    includePhotoAssessment: true
  }
): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page to the document
  const page = pdfDoc.addPage(PageSizes.LETTER);
  const { width, height } = page.getSize();
  
  // Embed fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Set drawing parameters
  const margin = 50;
  const contentWidth = width - margin * 2;
  
  // Track the vertical position as we add content
  let yPosition = height - margin;
  
  // Add header with logo and title
  yPosition = await drawHeaderSection(pdfDoc, page, {
    yPosition,
    width,
    margin,
    regularFont,
    boldFont,
    includeBranding: options.includeBranding
  });
  
  // Add vehicle info section
  yPosition = await drawVehicleInfoSection(pdfDoc, page, {
    yPosition,
    width,
    margin,
    regularFont,
    boldFont,
    data
  });
  
  // Add main valuation section
  yPosition = await drawValuationSection(pdfDoc, page, {
    yPosition,
    width,
    margin,
    regularFont,
    boldFont,
    data
  });
  
  // If there's a best photo available and photo assessment is enabled
  if (data.bestPhotoUrl && options.includePhotoAssessment) {
    yPosition = await drawAIConditionSection(pdfDoc, page, {
      yPosition,
      width,
      margin,
      regularFont,
      boldFont,
      data
    });
  }
  
  // Add explanation section
  yPosition = await drawExplanationSection(pdfDoc, page, {
    yPosition,
    width,
    margin,
    regularFont,
    boldFont,
    data
  });
  
  // Add footer
  if (options.includeFooter) {
    await drawFooterSection(pdfDoc, page, {
      width,
      height,
      margin,
      regularFont,
      includeTimestamp: options.includeTimestamp
    });
  }
  
  // Serialize the PDF to bytes
  return pdfDoc.save();
}
