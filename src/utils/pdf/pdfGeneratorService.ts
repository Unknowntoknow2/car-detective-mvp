
import { ReportData } from './types';
import { PDFDocument, rgb, StandardFonts, PDFFont, degrees } from 'pdf-lib';
import { drawSectionHeading, drawHorizontalLine, initializePdf } from './components/pdfCommon';
import { drawVehicleInfoSection } from './sections/vehicleInfoSection';
import { drawValuationSection } from './sections/valuationSection';
import { drawCommentarySection } from './sections/commentarySection';
import { drawAIConditionSection } from './sections/aiConditionSection';

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
  
  // Add discrete sections
  
  // Vehicle Information Section
  currentY = await drawVehicleInfoSection(
    page, 
    reportData, 
    currentY, 
    fonts, 
    constants
  );
  currentY = currentY - 15;
  
  // Valuation Section
  currentY = await drawValuationSection(
    page, 
    reportData, 
    currentY, 
    fonts, 
    constants
  );
  currentY = currentY - 20;
  
  // AI Condition Section (if available)
  if (reportData.aiCondition) {
    const conditionParams = {
      aiCondition: reportData.aiCondition,
      bestPhotoUrl: reportData.bestPhotoUrl,
      photoExplanation: reportData.photoExplanation
    };
    
    const sectionParams = {
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
    
    currentY = await drawAIConditionSection(conditionParams, sectionParams);
    currentY = currentY - 15;
  }
  
  // GPT Commentary Section (if available)
  if (reportData.explanation) {
    currentY = await drawCommentarySection(
      page,
      reportData.explanation,
      currentY,
      fonts,
      constants
    );
    currentY = currentY - 15;
  }
  
  // Draw watermark diagonally across the page
  const watermarkFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  page.drawText('Car Detective Valuation Report', {
    x: 150,
    y: 300,
    size: 60,
    font: watermarkFont,
    color: rgb(0.85, 0.85, 0.85), // Light gray
    opacity: 0.3,
    rotate: degrees(-45),
  });
  
  // Add footer with page number, date and disclaimer
  const footerY = 30;
  
  // Draw footer line
  drawHorizontalLine(page, margin, width - margin, footerY + 20);
  
  // Draw footer text
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  page.drawText(`Generated on ${dateString} • Car Detective LLC • Page 1 of 1`, {
    x: margin,
    y: footerY,
    size: 8,
    font: regular,
    color: rgb(0.4, 0.4, 0.4)
  });
  
  // Draw QR code placeholder for verification (would be replaced with actual QR in production)
  page.drawRectangle({
    x: width - margin - 50,
    y: footerY - 10,
    width: 50,
    height: 50,
    borderColor: rgb(0.7, 0.7, 0.7),
    borderWidth: 1,
  });
  
  page.drawText('QR', {
    x: width - margin - 35,
    y: footerY + 10,
    size: 16,
    font: bold,
    color: rgb(0.7, 0.7, 0.7)
  });
  
  // Generate PDF bytes
  return await pdfDoc.save();
}
