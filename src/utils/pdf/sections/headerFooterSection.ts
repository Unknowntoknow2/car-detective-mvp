
import { PDFPage, rgb } from 'pdf-lib';
import { PdfFonts, PdfConstants } from '../components/pdfCommon';
import { getCurrentDate } from '../helpers/textUtils';
import QRCode from 'qrcode';

/**
 * Draw header section on the PDF
 * Returns the new Y position after drawing the header
 */
export function drawHeaderSection(
  page: PDFPage,
  yPos: number,
  fonts: PdfFonts,
  constants: PdfConstants
): number {
  const { margin, width, titleFontSize, smallFontSize } = constants;
  const { regular: regularFont, bold: boldFont } = fonts;
  
  // Set up title
  page.drawText('Vehicle Valuation Report', {
    x: margin,
    y: yPos,
    size: titleFontSize,
    font: boldFont,
    color: rgb(0, 0, 0.8)
  });
  
  // Add current date and version tag
  const currentDate = getCurrentDate();
  page.drawText(`Generated on: ${currentDate}`, {
    x: width - margin - 150,
    y: yPos,
    size: smallFontSize,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4)
  });
  
  page.drawText(`Valuation Engine: v1.0.0 (GPT-4o)`, {
    x: width - margin - 150,
    y: yPos - smallFontSize - 5,
    size: smallFontSize,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4)
  });
  
  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: yPos - titleFontSize - 15 },
    end: { x: width - margin, y: yPos - titleFontSize - 15 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  return yPos - titleFontSize - 50;
}

/**
 * Draw footer section on the PDF
 */
export function drawFooterSection(
  page: PDFPage,
  fonts: PdfFonts,
  constants: PdfConstants
): void {
  const { margin, width, smallFontSize } = constants;
  const { regular: regularFont } = fonts;
  
  // Disclaimer text
  const footerText = "This valuation is an estimate based on current market data and may vary.";
  page.drawText(footerText, {
    x: margin,
    y: margin - 20,
    size: smallFontSize,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  // Branding footer
  const brandingText = "Powered by CarDetective AI | www.cardetective.com";
  const brandingWidth = regularFont.widthOfTextAtSize(brandingText, smallFontSize);
  
  page.drawText(brandingText, {
    x: (width - brandingWidth) / 2, // Center horizontally
    y: margin - 40,
    size: smallFontSize,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4)
  });
}

/**
 * Draw signature and QR code on the last page
 */
export async function drawSignatureAndQR(
  page: PDFPage,
  fonts: PdfFonts,
  constants: PdfConstants,
  valuationId?: string
): Promise<void> {
  const { margin, width, height, smallFontSize, normalFontSize } = constants;
  const { regular: regularFont, bold: boldFont } = fonts;
  
  // Draw signature line
  const signatureY = margin + 60;
  
  page.drawText("Authorized Signature:", {
    x: margin,
    y: signatureY,
    size: normalFontSize,
    font: regularFont,
    color: rgb(0, 0, 0)
  });
  
  // Draw signature line
  page.drawLine({
    start: { x: margin + 150, y: signatureY },
    end: { x: width - margin - 150, y: signatureY },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  // Add Report ID if valuationId is available
  if (valuationId) {
    page.drawText(`Report ID: GPT4-VAL-${valuationId}`, {
      x: margin,
      y: signatureY - 20,
      size: smallFontSize,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    // Generate and draw QR code
    try {
      const qrCodeUrl = `https://cardetective.com/valuation/${valuationId}`;
      const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, {
        margin: 1,
        width: 200,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      // Strip the data URL prefix to get just the Base64 data
      const qrData = qrCodeDataUrl.replace('data:image/png;base64,', '');
      
      // QR code position - bottom right of the page
      const qrSize = 80;
      const qrX = width - margin - qrSize;
      const qrY = margin + 100;
      
      // Add QR code to the PDF
      const qrImage = await page.doc.embedPng(qrData);
      page.drawImage(qrImage, {
        x: qrX,
        y: qrY,
        width: qrSize,
        height: qrSize,
      });
      
      // Add QR code caption
      page.drawText("Scan to verify this report online", {
        x: qrX - 40,
        y: qrY - 15,
        size: smallFontSize,
        font: regularFont,
        color: rgb(0.3, 0.3, 0.3)
      });
      
      // Add "DO NOT ALTER" notice
      page.drawText("DO NOT ALTER - OFFICIAL REPORT", {
        x: margin,
        y: height - 20,
        size: smallFontSize,
        font: boldFont,
        color: rgb(0.7, 0.1, 0.1)
      });
      
    } catch (error) {
      console.error("Error generating QR code:", error);
      // Fail silently - continue PDF generation without QR code
    }
  }
}
