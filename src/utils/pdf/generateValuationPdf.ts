
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { ReportData } from "./types";

export async function generateValuationPdf(data: ReportData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const { width, height } = page.getSize();
  const margin = 50;
  let yPosition = height - margin;

  // Title
  page.drawText('Vehicle Valuation Report', {
    x: margin,
    y: yPosition,
    size: 20,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  yPosition -= 40;

  // Vehicle Information
  const vehicleInfo = [
    ['VIN:', data.vin || 'N/A'],
    ['Year:', data.year?.toString() || 'N/A'],
    ['Make:', data.make || 'N/A'],
    ['Model:', data.model || 'N/A'],
    ['Mileage:', data.mileage?.toLocaleString() || 'N/A'],
    ['Condition:', data.condition || 'N/A'],
    ['ZIP Code:', data.zipCode || 'N/A'],
  ];

  vehicleInfo.forEach(([label, value]) => {
    page.drawText(label, {
      x: margin,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });
    
    page.drawText(value, {
      x: margin + 120,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 20;
  });

  // Valuation Results
  yPosition -= 20;
  page.drawText('Valuation Results', {
    x: margin,
    y: yPosition,
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  yPosition -= 30;

  page.drawText(`Estimated Value: $${data.estimatedValue?.toLocaleString() || '0'}`, {
    x: margin,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: rgb(0, 0.5, 0),
  });
  yPosition -= 25;

  if (data.priceRange && Array.isArray(data.priceRange)) {
    page.drawText(`Price Range: $${data.priceRange[0]?.toLocaleString()} - $${data.priceRange[1]?.toLocaleString()}`, {
      x: margin,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;
  }

  page.drawText(`Confidence Score: ${data.confidenceScore || 0}%`, {
    x: margin,
    y: yPosition,
    size: 12,
    font: font,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export async function downloadValuationPdf(data: ReportData): Promise<void> {
  const pdfBuffer = await generateValuationPdf(data);
  
  const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `valuation-${data.make}-${data.model}-${data.year}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
