<<<<<<< HEAD
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ReportData, ReportOptions, DocumentFonts } from '../types';
import { defaultReportOptions } from '../defaultReportOptions';
=======
import { PDFDocument, PDFFont, PDFPage, rgb } from "pdf-lib";
import { ReportData } from "../types";

interface BasicReportGeneratorProps {
  pdfDoc: PDFDocument;
  page: PDFPage;
  width: number;
  height: number;
  margin: number;
  regularFont: PDFFont;
  boldFont: PDFFont;
  reportData: ReportData;
}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

/**
 * Generate a basic PDF report for a vehicle valuation
 * @param data Vehicle valuation data
 * @param options Report generation options
 * @returns Promise resolving to Uint8Array containing PDF data
 */
export async function generateBasicReport(
<<<<<<< HEAD
  data: ReportData,
  options: Partial<ReportOptions> = {}
): Promise<Uint8Array> {
  // Merge with default options
  const mergedOptions: ReportOptions = {
    ...defaultReportOptions,
    ...options
  };

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Embed standard fonts
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Create fonts object
  const fonts: DocumentFonts = {
    regular: helveticaFont,
    bold: helveticaBoldFont
  };

  // Add the first page
  const page = pdfDoc.addPage([612, 792]); // US Letter size
  const { width, height } = page.getSize();
  
  // Set page margins
  const margin = 50;
  const contentWidth = width - (margin * 2);
  
  // Draw header
  page.drawText('Vehicle Valuation Report', {
=======
  props: BasicReportGeneratorProps,
): Promise<void> {
  const {
    pdfDoc,
    page,
    width,
    height,
    margin,
    regularFont,
    boldFont,
    reportData,
  } = props;
  let currentY = height - margin;

  // Add header
  page.drawText("Vehicle Valuation Report", {
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    x: margin,
    y: height - margin,
    size: 24,
    font: fonts.bold,
  });
  
  page.drawText(`${data.year} ${data.make} ${data.model}`, {
    x: margin,
    y: height - margin - 30,
    size: 18,
<<<<<<< HEAD
    font: fonts.bold,
  });
  
  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: height - margin - 40 },
    end: { x: width - margin, y: height - margin - 40 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Draw vehicle details section
  let yPos = height - margin - 80;
  
  page.drawText('Vehicle Details', {
    x: margin,
    y: yPos,
    size: 16,
    font: fonts.bold,
  });
  
  yPos -= 25;
  
  // Two column layout for details
  const col1 = margin;
  const col2 = margin + contentWidth / 2;
  
  // Column 1
  page.drawText('Year:', {
    x: col1,
    y: yPos,
    size: 12,
    font: fonts.regular,
  });
  
  page.drawText(data.year.toString(), {
    x: col1 + 100,
    y: yPos,
    size: 12,
    font: fonts.bold,
  });
  
  yPos -= 20;
  
  page.drawText('Make:', {
    x: col1,
    y: yPos,
    size: 12,
    font: fonts.regular,
  });
  
  page.drawText(data.make, {
    x: col1 + 100,
    y: yPos,
    size: 12,
    font: fonts.bold,
  });
  
  yPos -= 20;
  
  page.drawText('Model:', {
    x: col1,
    y: yPos,
    size: 12,
    font: fonts.regular,
  });
  
  page.drawText(data.model, {
    x: col1 + 100,
    y: yPos,
    size: 12,
    font: fonts.bold,
  });
  
  // Reset Y position for column 2
  yPos = height - margin - 105;
  
  page.drawText('Mileage:', {
    x: col2,
    y: yPos,
    size: 12,
    font: fonts.regular,
  });
  
  page.drawText(`${data.mileage.toLocaleString()} miles`, {
    x: col2 + 100,
    y: yPos,
    size: 12,
    font: fonts.bold,
  });
  
  yPos -= 20;
  
  page.drawText('Condition:', {
    x: col2,
    y: yPos,
    size: 12,
    font: fonts.regular,
  });
  
  page.drawText(data.condition, {
    x: col2 + 100,
    y: yPos,
    size: 12,
    font: fonts.bold,
  });
  
  yPos -= 20;
  
  if (data.zipCode) {
    page.drawText('Location:', {
      x: col2,
      y: yPos,
      size: 12,
      font: fonts.regular,
    });
    
    page.drawText(data.zipCode, {
      x: col2 + 100,
      y: yPos,
      size: 12,
      font: fonts.bold,
=======
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  currentY -= 20;

  // Add vehicle details
  page.drawText(
    `Vehicle: ${reportData.year} ${reportData.make} ${reportData.model}`,
    {
      x: margin,
      y: currentY,
      size: 12,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3),
    },
  );
  currentY -= 15;

  page.drawText(`VIN: ${reportData.vin}`, {
    x: margin,
    y: currentY,
    size: 10,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5),
  });
  currentY -= 15;

  // Add valuation details
  page.drawText(`Estimated Value: $${reportData.estimatedValue}`, {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: rgb(0.2, 0.7, 0.2),
  });
  currentY -= 20;

  // Add explanation
  const explanationLines = wrapText(
    reportData.explanation,
    regularFont,
    10,
    width - margin * 2,
  );
  page.drawText("Explanation:", {
    x: margin,
    y: currentY,
    size: 12,
    font: boldFont,
    color: rgb(0.3, 0.3, 0.3),
  });
  currentY -= 15;

  for (const line of explanationLines) {
    page.drawText(line, {
      x: margin,
      y: currentY,
      size: 10,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3),
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    });
  }
<<<<<<< HEAD
  
  // Draw valuation section
  yPos = height - margin - 200;
  
  page.drawText('Valuation Results', {
    x: margin,
    y: yPos,
    size: 16,
    font: fonts.bold,
  });
  
  yPos -= 25;
  
  page.drawText('Estimated Value:', {
    x: margin,
    y: yPos,
    size: 14,
    font: fonts.regular,
  });
  
  page.drawText(`$${data.estimatedValue.toLocaleString()}`, {
    x: margin + 150,
    y: yPos,
    size: 16,
    font: fonts.bold,
    color: rgb(0.2, 0.6, 0.2),
  });
  
  yPos -= 25;
  
  // Handle price range
  if (data.priceRange) {
    let priceRangeValues: [number, number];
    
    if (Array.isArray(data.priceRange)) {
      priceRangeValues = [data.priceRange[0], data.priceRange[1]];
=======
}

/**
 * Wraps text to fit within a given width
 */
function wrapText(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);

    if (width <= maxWidth) {
      currentLine = testLine;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    } else {
      // Fallback - use estimated value with +/- 5%
      const value = data.estimatedValue;
      priceRangeValues = [Math.floor(value * 0.95), Math.ceil(value * 1.05)];
    }
    
    page.drawText('Value Range:', {
      x: margin,
      y: yPos,
      size: 14,
      font: fonts.regular,
    });
    
    page.drawText(`$${priceRangeValues[0].toLocaleString()} - $${priceRangeValues[1].toLocaleString()}`, {
      x: margin + 150,
      y: yPos,
      size: 14,
      font: fonts.bold,
    });
    
    yPos -= 25;
  }
  
  page.drawText('Confidence Score:', {
    x: margin,
    y: yPos,
    size: 14,
    font: fonts.regular,
  });
  
  page.drawText(`${data.confidenceScore}%`, {
    x: margin + 150,
    y: yPos,
    size: 14,
    font: fonts.bold,
  });
  
  // Add disclaimer at the bottom
  const disclaimerY = 100;
  
  page.drawText('Disclaimer:', {
    x: margin,
    y: disclaimerY,
    size: 10,
    font: fonts.bold,
  });
  
  const disclaimer = 'This valuation is based on the information provided and current market data. Actual sale prices may vary based on detailed vehicle inspection, negotiation, and local market conditions.';
  
  page.drawText(disclaimer, {
    x: margin,
    y: disclaimerY - 15,
    size: 8,
    font: fonts.regular,
    lineHeight: 10,
    maxWidth: contentWidth,
  });
  
  // Add footer with generation date
  const footerY = 50;
  
  page.drawLine({
    start: { x: margin, y: footerY + 10 },
    end: { x: width - margin, y: footerY + 10 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  const generateDate = new Date(data.generatedAt).toLocaleDateString();
  const footerText = `Generated by Car Detective | ${generateDate}`;
  
  page.drawText(footerText, {
    x: width / 2 - 100,
    y: footerY,
    size: 8,
    font: fonts.regular,
    color: rgb(0.5, 0.5, 0.5),
  });
  
  // Return the PDF as a Uint8Array
  return await pdfDoc.save();
}
