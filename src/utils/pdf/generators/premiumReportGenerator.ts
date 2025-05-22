
import { RGB, rgb } from 'pdf-lib';
import { ReportData, ReportOptions, ReportGeneratorParams } from '../types';
import { drawHeaderSection } from '../sections/headerSection';
import { drawVehicleInfoSection } from '../sections/vehicleInfoSection';
import { drawValuationSection } from '../sections/valuationSection';
import { drawPhotoAssessmentSection } from '../sections/photoAssessmentSection';
import { drawExplanationSection } from '../sections/explanationSection';
import { drawFooterSection } from '../sections/footerSection';
import { drawWatermark } from '../sections/watermark';

/**
 * Generate a premium valuation report with all available sections
 */
export async function generatePremiumReport({ data, options, document }: ReportGeneratorParams): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await document.create();
  
  // Add pages to the document
  const page1 = pdfDoc.addPage();
  const page2 = pdfDoc.addPage();
  
  // Get page dimensions
  const { width, height } = page1.getSize();
  const margin = 50;
  const contentWidth = width - (margin * 2);
  
  // Load fonts
  const helveticaFont = await pdfDoc.embedFont('Helvetica');
  const helveticaBoldFont = await pdfDoc.embedFont('Helvetica-Bold');
  
  // Define colors
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0, 0.4, 0.8);
  
  // Initialize vertical position for content on page 1
  let y = height - margin;
  
  // Draw header section
  y = drawHeaderSection({
    data,
    page: page1,
    y,
    width,
    margin,
    contentWidth,
    regularFont: helveticaFont,
    boldFont: helveticaBoldFont,
    textColor,
    primaryColor,
    height
  });
  
  // Draw vehicle info section
  y = drawVehicleInfoSection({
    data,
    page: page1,
    y,
    width,
    margin,
    contentWidth,
    regularFont: helveticaFont,
    boldFont: helveticaBoldFont,
    textColor,
    primaryColor,
    height
  });
  
  // Draw valuation section
  y = drawValuationSection({
    data,
    page: page1,
    y,
    width,
    margin,
    contentWidth,
    regularFont: helveticaFont,
    boldFont: helveticaBoldFont,
    textColor,
    primaryColor,
    height
  });
  
  // Page 2: Additional premium content
  y = height - margin;
  
  // Draw photo assessment section if included in options
  if (options.includePhotoAssessment && data.photoAssessment) {
    y = drawPhotoAssessmentSection({
      data,
      page: page2,
      y,
      width,
      margin,
      contentWidth,
      regularFont: helveticaFont,
      boldFont: helveticaBoldFont,
      textColor,
      primaryColor,
      height
    });
  }
  
  // Draw explanation section if included in options
  if (options.includeExplanation && data.explanation) {
    y = drawExplanationSection({
      data,
      page: page2,
      y,
      width,
      margin,
      contentWidth,
      regularFont: helveticaFont,
      boldFont: helveticaBoldFont,
      textColor,
      primaryColor,
      height
    });
  }
  
  // Draw footer on both pages
  drawFooterSection({
    data,
    page: page1,
    y: 30,
    width,
    margin,
    contentWidth,
    regularFont: helveticaFont,
    boldFont: helveticaBoldFont,
    textColor,
    primaryColor,
    height
  });
  
  drawFooterSection({
    data,
    page: page2,
    y: 30,
    width,
    margin,
    contentWidth,
    regularFont: helveticaFont,
    boldFont: helveticaBoldFont,
    textColor,
    primaryColor,
    height
  });
  
  // Add watermark if specified in options
  if (options.watermark) {
    drawWatermark({
      data,
      page: page1,
      y: height / 2,
      width,
      margin,
      contentWidth,
      regularFont: helveticaFont,
      boldFont: helveticaBoldFont,
      textColor,
      primaryColor,
      height
    });
    
    drawWatermark({
      data,
      page: page2,
      y: height / 2,
      width,
      margin,
      contentWidth,
      regularFont: helveticaFont,
      boldFont: helveticaBoldFont,
      textColor,
      primaryColor,
      height
    });
  }
  
  // Return the PDF as a byte array
  return pdfDoc.save();
}
