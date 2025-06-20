
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ReportData, PdfOptions } from '@/types/valuation';

export async function generateValuationPdf(
  data: ReportData, 
  options: PdfOptions = {}
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { width, height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Header
  page.drawText('Vehicle Valuation Report', {
    x: 50,
    y: height - 50,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // Vehicle info
  page.drawText(`${data.year} ${data.make} ${data.model}`, {
    x: 50,
    y: height - 100,
    size: 16,
    font: boldFont,
  });
  
  // Valuation
  page.drawText(`Estimated Value: $${data.estimatedValue.toLocaleString()}`, {
    x: 50,
    y: height - 130,
    size: 14,
    font: font,
  });
  
  page.drawText(`Confidence Score: ${data.confidenceScore}%`, {
    x: 50,
    y: height - 150,
    size: 14,
    font: font,
  });
  
  // Adjustments
  if (data.adjustments && data.adjustments.length > 0) {
    page.drawText('Price Adjustments:', {
      x: 50,
      y: height - 190,
      size: 14,
      font: boldFont,
    });
    
    data.adjustments.forEach((adj, index) => {
      const yPos = height - 220 - (index * 20);
      page.drawText(`${adj.factor}: ${adj.impact > 0 ? '+' : ''}$${adj.impact}`, {
        x: 70,
        y: yPos,
        size: 12,
        font: font,
      });
    });
  }
  
  return await pdfDoc.save();
}

export async function downloadValuationPdf(reportData: ReportData, options?: PdfOptions): Promise<void> {
  const pdfData = await generateValuationPdf(reportData, options);
  const blob = new Blob([pdfData], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `valuation-${reportData.vin || reportData.id || 'report'}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
