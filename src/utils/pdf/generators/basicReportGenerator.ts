
import { RGB, rgb } from 'pdf-lib';
import { ReportData, ReportOptions, ReportGeneratorParams } from '../types';
import { drawHeaderSection } from '../sections/headerSection';
import { drawVehicleInfoSection } from '../sections/vehicleInfoSection';
import { drawValuationSection } from '../sections/valuationSection';
import { drawFooterSection } from '../sections/footerSection';
import { drawWatermark } from '../sections/watermark';

/**
 * Generate a basic valuation report with standard sections
 */
export async function generateBasicReport({ data, options, document }: ReportGeneratorParams): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await document.create();
  
  // Add a page to the document
  const page = pdfDoc.addPage();
  
  // Get page dimensions
  const { width, height } = page.getSize();
  const margin = 50;
  const contentWidth = width - (margin * 2);
  
  // Load fonts
  const helveticaFont = await pdfDoc.embedFont('Helvetica');
  const helveticaBoldFont = await pdfDoc.embedFont('Helvetica-Bold');
  
  // Define colors
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0, 0.4, 0.8);
  
  // Initialize vertical position for content
  let y = height - margin;
  
  // Draw header section
  y = drawHeaderSection({
    data,
    page,
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
    page,
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
    page,
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
  
  // Draw footer section
  drawFooterSection({
    data,
    page,
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
  
  // Add watermark if specified in options
  if (options.watermark) {
    drawWatermark({
      data,
      page,
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
