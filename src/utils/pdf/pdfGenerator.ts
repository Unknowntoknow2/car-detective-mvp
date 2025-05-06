
import { ReportData } from './types';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { drawAIConditionSection } from './sections/aiConditionSection';

/**
 * Generates a valuation PDF report
 * @param data The report data
 * @returns A promise resolving to the PDF as a Uint8Array
 */
export async function generateValuationPdf(data: ReportData): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page to the document
  const page = pdfDoc.addPage([612, 792]); // Letter size
  const { width, height } = page.getSize();
  
  // Embed fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  const margin = 50;
  
  // Draw header with title
  page.drawText('Vehicle Valuation Report', {
    x: margin,
    y: height - margin,
    size: 24,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.6)
  });
  
  // Draw vehicle details
  let yPosition = height - margin - 50;
  
  page.drawText(`${data.year} ${data.make} ${data.model}`, {
    x: margin,
    y: yPosition,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0)
  });
  
  yPosition -= 30;
  
  // Draw estimated value
  page.drawText(`Estimated Value: $${data.estimatedValue.toLocaleString()}`, {
    x: margin,
    y: yPosition,
    size: 16,
    font: boldFont,
    color: rgb(0, 0.5, 0)
  });
  
  yPosition -= 40;
  
  // Draw vehicle details
  const details = [
    { label: 'VIN:', value: data.vin || 'Not specified' },
    { label: 'Mileage:', value: `${data.mileage} miles` },
    { label: 'Condition:', value: data.condition || 'Not specified' },
    { label: 'Location:', value: data.zipCode || 'Not specified' }
  ];
  
  details.forEach(detail => {
    page.drawText(detail.label, {
      x: margin,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    page.drawText(detail.value, {
      x: margin + 100,
      y: yPosition,
      size: 12,
      font: regularFont,
      color: rgb(0, 0, 0)
    });
    
    yPosition -= 20;
  });
  
  yPosition -= 20;
  
  // Draw AI condition assessment if available
  if (data.aiCondition) {
    yPosition = drawAIConditionSection(
      data.aiCondition, 
      {
        page,
        yPosition,
        margin,
        width,
        fonts: {
          regular: regularFont,
          bold: boldFont,
          italic: italicFont
        }
      }
    );
    
    yPosition -= 30;
  }
  
  // Draw explanation if available
  if (data.explanation) {
    page.drawText('Valuation Commentary:', {
      x: margin,
      y: yPosition,
      size: 16,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.6)
    });
    
    yPosition -= 20;
    
    // Split explanation into lines
    const words = data.explanation.split(' ');
    let line = '';
    const maxWidth = width - (margin * 2);
    
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      const textWidth = regularFont.widthOfTextAtSize(testLine, 12);
      
      if (textWidth > maxWidth && line) {
        page.drawText(line, {
          x: margin,
          y: yPosition,
          size: 12,
          font: regularFont,
          color: rgb(0, 0, 0)
        });
        
        yPosition -= 16;
        line = word;
      } else {
        line = testLine;
      }
    }
    
    if (line) {
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: 12,
        font: regularFont,
        color: rgb(0, 0, 0)
      });
    }
  }
  
  // Add footer
  page.drawText('Generated on ' + new Date().toLocaleDateString(), {
    x: margin,
    y: 30,
    size: 10,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  // Add premium badge if applicable
  if (data.isPremium) {
    page.drawRectangle({
      x: width - 150,
      y: height - 80,
      width: 100,
      height: 30,
      color: rgb(0.9, 0.6, 0.1),
      borderColor: rgb(0.8, 0.5, 0),
      borderWidth: 1,
    });
    
    page.drawText('PREMIUM', {
      x: width - 135,
      y: height - 65,
      size: 16,
      font: boldFont,
      color: rgb(1, 1, 1)
    });
  }
  
  // Return PDF as Uint8Array
  return await pdfDoc.save();
}
