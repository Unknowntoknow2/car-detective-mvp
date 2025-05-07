
// ✅ TS check passed
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ReportData, ReportOptions, SectionParams } from './types';
import { drawVehicleInfoSection } from './sections/vehicleInfoSection';
import { drawValuationSection } from './sections/valuationSection';
import { drawExplanationSection } from './sections/explanationSection';
import { drawFooterSection } from './sections/footerSection';
import { drawAIConditionSection } from './sections/aiConditionSection';
import { applyWatermark } from './sections/watermark';
import { drawValuationSummary } from './sections/valuationSummary';

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
  
  // Add a page to the document (Letter size in points: 8.5 x 11 inches)
  const page = pdfDoc.addPage([612, 792]); // Letter size in points
  const { width, height } = page.getSize();
  
  // Embed fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Set drawing parameters
  const margin = 50;
  const contentWidth = width - margin * 2;
  
  // Create a unified params object to pass to all section drawing functions
  const sectionParams: SectionParams = {
    page,
    width,
    height,
    margin,
    regularFont,
    boldFont,
    contentWidth
  };
  
  // Apply watermark if branding is included
  if (options.includeBranding) {
    applyWatermark(sectionParams, "Car Detective™ • Premium Report");
  }
  
  // Track the vertical position as we add content
  let yPosition = height - margin;
  
  // Draw header section (custom implementation)
  // Header with title and basic info
  page.drawRectangle({
    x: margin,
    y: height - margin - 50,
    width: contentWidth,
    height: 50,
    color: rgb(0.95, 0.95, 0.95),
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1,
  });
  
  page.drawText("Vehicle Valuation Report", {
    x: margin + 10,
    y: height - margin - 30,
    size: 18,
    font: boldFont
  });
  
  yPosition -= 70; // Move down after header
  
  // Add valuation summary if available
  if (data.narrative) {
    yPosition = drawValuationSummary(sectionParams, data.narrative, yPosition);
    yPosition -= 20; // Add space after summary
  }
  
  // Add vehicle info section
  yPosition = drawVehicleInfoSection(sectionParams, data, yPosition);
  
  // Add main valuation section
  yPosition = drawValuationSection(sectionParams, data, yPosition);
  
  // If there's a best photo available and photo assessment is enabled
  if (data.bestPhotoUrl && options.includePhotoAssessment) {
    const conditionParams = {
      aiCondition: data.aiCondition,
      bestPhotoUrl: data.bestPhotoUrl,
      photoExplanation: data.photoExplanation
    };
    
    try {
      // Update to correctly handle the returned yPosition
      const aiSectionParams = {
        page,
        yPosition,
        margin,
        width,
        fonts: { 
          regular: regularFont, 
          bold: boldFont
        }
      };
      
      const newYPosition = await drawAIConditionSection(
        conditionParams, 
        aiSectionParams
      );
      
      // Update yPosition safely
      if (typeof newYPosition === 'number') {
        yPosition = newYPosition;
      }
    } catch (error) {
      console.error("Error drawing AI condition section:", error);
      // If there's an error, don't update yPosition
    }
  }
  
  // Add explanation section if available
  if (data.explanation) {
    yPosition = drawExplanationSection(
      sectionParams,
      data.explanation,
      yPosition
    );
  }
  
  // Add footer with updated parameters
  if (options.includeFooter) {
    drawFooterSection(
      sectionParams,
      options.includeTimestamp,
      1,  // Current page (hardcoded to 1 for now)
      1,  // Total pages (hardcoded to 1 for now)
      options.includeBranding  // Use branding option for watermark
    );
  }
  
  // Serialize the PDF to bytes
  return pdfDoc.save();
}
