import fs from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import puppeteer from 'puppeteer';

// Function to generate the template HTML
function generateTemplateHtml(templateHtml: string, data: any): string {
  let html = templateHtml;
  for (const key in data) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, data[key] || '');
  }
  return html;
}

// Function to convert HTML to PDF using Puppeteer
async function html2pdf(html: string, outputPath: string, options: any = {}, callback?: (pdfDoc: PDFDocument) => void): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: 'networkidle2',
  });

  // Update this function call with all required parameters
  const pdfBuffer = await page.pdf({ 
    path: outputPath, 
    format: 'A4', 
    printBackground: true,
    margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
  });

  await browser.close();
  return pdfBuffer;
}

// Main function to generate the PDF
export async function generatePdf(data: any, template: string, outputPath: string, options: any = {}, callback?: (pdfDoc: PDFDocument) => void): Promise<Buffer> {
  const templatePath = path.join(process.cwd(), 'templates', `${template}.html`);
  
  try {
    const templateHtml = await fs.readFile(templatePath, 'utf8');
    const html = generateTemplateHtml(templateHtml, data);
    
    // Update this function call with all required parameters
    const pdfBuffer = await html2pdf(html, outputPath, options, callback);
    
    return pdfBuffer;
  } catch (error) {
    console.error(`Error generating PDF: ${error}`);
    throw error;
  }
}
