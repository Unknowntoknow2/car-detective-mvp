
import { ReportData } from './types';
import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib';
import { drawSectionHeading, drawHorizontalLine, initializePdf } from './components/pdfCommon';
import { drawVehicleInfoSection } from './sections/vehicleInfoSection';
import { drawValuationSection } from './sections/valuationSection';
import { drawCommentarySection } from './sections/commentarySection';
import { drawAIConditionSection } from './sections/aiConditionSection';
import { applyWatermark } from './sections/watermark';
import { drawValuationSummary } from './sections/valuationSummary';

/**
 * Generates a PDF for the valuation report
 * @param reportData The data to include in the PDF
 * @returns The PDF as a Uint8Array
 */
export async function generateValuationPdf(reportData: ReportData): Promise<Uint8Array> {
  console.log('Generating PDF with data:', reportData);
  
  // Initialize PDF document and resources
  const { pdfDoc, page, fonts, constants } = await initializePdf();
  const { regular, bold } = fonts;
  const { margin, width, height } = constants;
  
  // Create section params for use with watermark and other sections
  const sectionParams = {
    page,
    width,
    height,
    margin,
    regularFont: regular,
    boldFont: bold,
    contentWidth: width - margin * 2
  };
  
  // Apply watermark if it's a premium report
  if (reportData.isPremium) {
    applyWatermark(sectionParams, "Car Detective™ • Premium Report");
  }
  
  // Set up current Y position tracker (starts from top)
  let currentY = height - margin;
  
  // Draw header with logo and title
  page.drawRectangle({
    x: 0,
    y: height - 100,
    width: width,
    height: 100,
    color: rgb(0.15, 0.15, 0.3),
  });
  
  // Draw logo text (in lieu of an actual image)
  page.drawText('CAR DETECTIVE', {
    x: margin,
    y: height - 50,
    size: 24,
    font: bold,
    color: rgb(1, 1, 1)
  });
  
  // Draw report title
  page.drawText('VEHICLE VALUATION REPORT', {
    x: margin,
    y: height - 75,
    size: 16,
    font: bold,
    color: rgb(1, 1, 1)
  });
  
  // Add premium badge if it's a premium report
  if (reportData.isPremium) {
    const badgeWidth = 150;
    const badgeHeight = 30;
    const badgeX = width - badgeWidth - margin;
    const badgeY = height - 60;
    
    // Draw premium badge background
    page.drawRectangle({
      x: badgeX,
      y: badgeY,
      width: badgeWidth,
      height: badgeHeight,
      color: rgb(0.54, 0.27, 0.9),
      borderColor: rgb(1, 1, 1),
      borderWidth: 1,
      opacity: 0.9,
      borderOpacity: 0.8,
    });
    
    // Draw premium badge text
    page.drawText('🔒 PREMIUM REPORT', {
      x: badgeX + 15,
      y: badgeY + 10,
      size: 12,
      font: bold,
      color: rgb(1, 1, 1)
    });
  }
  
  // Start main content below header
  currentY = height - 120;
  
  // If we have a narrative summary, add it first
  if (reportData.narrative) {
    currentY = drawValuationSummary(sectionParams, reportData.narrative, currentY);
    currentY = currentY - 15;
  }
  
  // Vehicle Information Section
  currentY = drawVehicleInfoSection(
    sectionParams, 
    reportData, 
    currentY
  );
  currentY = currentY - 15;
  
  // Valuation Section
  currentY = drawValuationSection(
    sectionParams, 
    reportData, 
    currentY
  );
  currentY = currentY - 20;
  
  // AI Condition Section (if available)
  if (reportData.aiCondition) {
    const conditionParams = {
      aiCondition: reportData.aiCondition,
      bestPhotoUrl: reportData.bestPhotoUrl,
      photoExplanation: reportData.photoExplanation
    };
    
    const aiSectionParams = {
      page,
      yPosition: currentY,
      margin,
      width,
      fonts: { 
        regular, 
        bold, 
        italic: regular // Fallback when italic not available
      }
    };
    
    try {
      // Handle async operation correctly with proper parameters
      const newYPosition = await drawAIConditionSection(
        conditionParams, 
        aiSectionParams
      );
      
      // Update yPosition only if we got a valid number back
      if (typeof newYPosition === 'number') {
        currentY = newYPosition - 15;
      }
    } catch (error) {
      console.error("Error drawing AI condition section:", error);
      // If there's an error, don't update currentY
    }
  }
  
  // GPT Commentary Section (if available)
  if (reportData.explanation) {
    currentY = drawCommentarySection(
      sectionParams,
      reportData.explanation,
      currentY
    );
    currentY = currentY - 15;
  }
  
  // Draw footer with updated parameters
  drawFooterSection(
    sectionParams,
    true, // includeTimestamp
    1,    // pageNumber
    1,    // totalPages
    reportData.isPremium // includeWatermark based on premium status
  );
  
  // Generate PDF bytes
  return await pdfDoc.save();
}
