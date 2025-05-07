
import { PDFDocument } from 'pdf-lib';
import { ReportData, ReportOptions } from './types';

// Mock function to generate the template HTML
function generateTemplateHtml(templateHtml: string, data: any): string {
  let html = templateHtml;
  for (const key in data) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, data[key] || '');
  }
  return html;
}

// Mock function to convert HTML to PDF for browser environments
async function html2pdf(html: string, outputPath: string, options: any = {}, callback?: (pdfDoc: PDFDocument) => void): Promise<Uint8Array> {
  console.log('Creating PDF from HTML in browser environment');
  
  // Since we can't use puppeteer in the browser, we'll create a simple PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Letter size
  
  // Add a simple message to the PDF
  page.drawText('PDF generation in browser is limited. Server-side generation required for full functionality.', {
    x: 50,
    y: 700,
    size: 12,
  });
  
  page.drawText(`Content that would be rendered: ${html.substring(0, 100)}...`, {
    x: 50,
    y: 650,
    size: 10,
  });
  
  // Call callback if provided
  if (callback) {
    callback(pdfDoc);
  }
  
  // Return the PDF as bytes
  return pdfDoc.save();
}

// Main function to generate the PDF
export async function generatePdf(
  data: ReportData, 
  template: string = 'valuation-report', 
  outputPath: string = '', 
  options: ReportOptions = {
    includeBranding: true,
    includeAIScore: true,
    includeFooter: true,
    includeTimestamp: true,
    includePhotoAssessment: true
  }, 
  callback?: (pdfDoc: PDFDocument) => void
): Promise<Uint8Array> {
  try {
    // In a browser environment, we'll use a simplified approach
    // We're creating a mock HTML based on the template name
    const mockTemplateHtml = `
      <html>
        <head><title>${template}</title></head>
        <body>
          <h1>Vehicle Valuation Report</h1>
          <p>VIN: {{vin}}</p>
          <p>Make: {{make}}</p>
          <p>Model: {{model}}</p>
          <p>Year: {{year}}</p>
          <p>Estimated Value: {{estimatedValue}}</p>
        </body>
      </html>
    `;
    
    const html = generateTemplateHtml(mockTemplateHtml, data);
    
    // Generate PDF 
    const pdfBuffer = await html2pdf(html, outputPath, options, callback);
    
    return pdfBuffer;
  } catch (error) {
    console.error(`Error generating PDF: ${error}`);
    throw error;
  }
}
