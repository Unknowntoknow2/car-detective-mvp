
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ReportData, ReportOptions, SectionParams } from '../types';
import { drawHeader } from '../sections/header';
import { drawSummary } from '../sections/summary';
import { drawBreakdown } from '../sections/breakdown';
import { drawFooter } from '../sections/footer';
import { drawExplanation } from '../sections/explanation';
import { drawConditionAssessment } from '../sections/conditionAssessment';
import { drawComparables } from '../sections/comparables';
import { drawWatermark } from '../sections/watermark';

export async function generatePremiumReport(data: ReportData, customOptions: Partial<ReportOptions> = {}): Promise<Uint8Array> {
  // Set default options
  const options: ReportOptions = {
    includeBranding: true,
    includeExplanation: true,
    includePhotoAssessment: true,
    watermark: data.isSample ? 'SAMPLE REPORT' : false,
    fontSize: 10,
    pdfQuality: 'standard',
    isPremium: true,
    ...customOptions
  };

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page to the document
  const page = pdfDoc.addPage([612, 792]); // Letter size
  const { width, height } = page.getSize();
  
  // Define margins
  const margin = 50;
  const contentWidth = width - (margin * 2);
  
  // Load fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  // Define colors
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0.05, 0.4, 0.65); // Primary blue color
  
  // Initialize the current Y position for drawing
  let startY = height - margin;
  
  // Setup the section parameters
  const sectionParams: SectionParams = {
    page,
    startY,
    width: contentWidth,
    margin,
    data,
    options,
    textColor,
    primaryColor,
    fonts: {
      regular: fontRegular,
      bold: fontBold,
      italic: fontItalic
    }
  };
  
  // Draw the report header section
  startY = drawHeader(sectionParams);
  
  // Add some spacing
  startY -= 20;
  
  // Draw the summary section
  startY = drawSummary({ ...sectionParams, startY });
  
  // Add some spacing
  startY -= 25;
  
  // Draw the breakdown section
  startY = drawBreakdown({ ...sectionParams, startY });
  
  // Check if we need a new page for the explanation
  if (options.includeExplanation && startY < 300) {
    // Add a new page
    const newPage = pdfDoc.addPage([612, 792]);
    
    // Reset the startY for the new page
    startY = height - margin;
    
    // Update the page in the section params
    sectionParams.page = newPage;
  }
  
  // Add some spacing
  startY -= 25;
  
  // Draw the explanation section if included
  if (options.includeExplanation) {
    startY = drawExplanation({ ...sectionParams, startY });
  }
  
  // Check if we need a new page for the condition assessment
  if (options.includePhotoAssessment && data.aiCondition && startY < 300) {
    // Add a new page
    const newPage = pdfDoc.addPage([612, 792]);
    
    // Reset the startY for the new page
    startY = height - margin;
    
    // Update the page in the section params
    sectionParams.page = newPage;
  }
  
  // Add some spacing
  startY -= 25;
  
  // Draw the condition assessment section if included and if we have AI condition data
  if (options.includePhotoAssessment && data.aiCondition) {
    startY = drawConditionAssessment({ ...sectionParams, startY });
  }
  
  // Check if we need a new page for the comparables
  if (startY < 200) {
    // Add a new page
    const newPage = pdfDoc.addPage([612, 792]);
    
    // Reset the startY for the new page
    startY = height - margin;
    
    // Update the page in the section params
    sectionParams.page = newPage;
  }
  
  // Add some spacing
  startY -= 25;
  
  // Draw the comparables section
  startY = drawComparables({ ...sectionParams, startY });
  
  // Add the footer to all pages
  const pages = pdfDoc.getPages();
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const pageHeight = page.getSize().height;
    
    // Draw the footer
    drawFooter({
      ...sectionParams,
      page,
      startY: 50, // Footer always at the bottom
      height: pageHeight
    });
    
    // Add the watermark if enabled
    if (options.watermark) {
      drawWatermark({
        ...sectionParams,
        page
      }, typeof options.watermark === 'string' ? options.watermark : 'DRAFT');
    }
    
    // Add page numbers
    const pageText = `Page ${i + 1} of ${pages.length}`;
    const textWidth = fontRegular.widthOfTextAtSize(pageText, 9);
    
    page.drawText(pageText, {
      x: width - margin - textWidth,
      y: 30,
      size: 9,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5)
    });
    
    // Add the company logo/name to the top right of each page (except first)
    if (i > 0) {
      const companyName = 'Car Detective';
      page.drawText(companyName, {
        x: width - margin - fontBold.widthOfTextAtSize(companyName, 12),
        y: pageHeight - 30,
        size: 12,
        font: fontBold,
        color: primaryColor,
        rotate: {
          type: 'degrees',
          angle: 0
        }
      });
    }
    
    // Add a subtle branded background element to each page
    page.drawText('PREMIUM REPORT', {
      x: margin,
      y: 40,
      size: 9,
      font: fontBold,
      color: rgb(0.9, 0.9, 0.9), // Very light gray
      rotate: {
        type: 'degrees',
        angle: 0
      }
    });
  }
  
  // Serialize the PDFDocument to bytes
  return pdfDoc.save();
}
