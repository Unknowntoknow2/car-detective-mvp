
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ReportData, ReportOptions } from './types';
import { addHeaderSection } from './sections/headerSection';
import { addVehicleInfoSection } from './sections/vehicleInfoSection';
import { addValuationSection } from './sections/valuationSection';
import { addExplanationSection } from './sections/explanationSection';
import { addFooterSection } from './sections/footerSection';
import { addAIConditionSection } from './sections/aiConditionSection';
import { addPhotoAssessmentSection } from './sections/photoAssessmentSection';

/**
 * Generates a PDF report for a vehicle valuation
 * @param data Report data object
 * @param options Report generation options
 * @returns Promise resolving to PDF document as Uint8Array
 */
export async function generatePdf(
  data: ReportData,
  options: ReportOptions = {}
): Promise<Uint8Array> {
  // Set default options
  const opts = {
    includeBranding: true,
    includeAIScore: true,
    includeFooter: true,
    includeTimestamp: true,
    includePhotoAssessment: true,
    ...options,
  };

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Embed fonts
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Add a page
  const page = pdfDoc.addPage([612, 792]); // Letter size
  const { width, height } = page.getSize();

  // Create font bundle
  const fonts = {
    regular: helveticaFont,
    bold: helveticaBold,
    italic: helveticaOblique,
  };

  // Start position for content (from top of page)
  let currentPosition = height - 50;

  // Add header
  if (opts.includeBranding) {
    const headerHeight = addHeaderSection(page, fonts, currentPosition, width);
    currentPosition -= headerHeight + 10;
  }

  // Add title: Vehicle Valuation Report
  page.drawText('Vehicle Valuation Report', {
    x: 50,
    y: currentPosition,
    size: 24,
    font: fonts.bold,
    color: rgb(0.1, 0.1, 0.4),
  });
  currentPosition -= 40;

  // Add vehicle information section
  const vehicleInfoHeight = addVehicleInfoSection(page, fonts, data, currentPosition, width);
  currentPosition -= vehicleInfoHeight + 30;

  // Add valuation section
  const valuationHeight = addValuationSection(page, fonts, data, currentPosition, width);
  currentPosition -= valuationHeight + 30;

  // Add AI photo assessment if available and option is enabled
  if (opts.includePhotoAssessment && (data.bestPhotoUrl || data.photoExplanation)) {
    const photoAssessmentHeight = await addPhotoAssessmentSection(
      page,
      pdfDoc,
      data,
      fonts,
      currentPosition,
      width
    );
    currentPosition -= photoAssessmentHeight + 30;
  }

  // Add AI condition assessment if available
  if (data.aiCondition && opts.includeAIScore) {
    const aiConditionHeight = addAIConditionSection(
      page,
      fonts,
      data.aiCondition,
      currentPosition,
      width
    );
    currentPosition -= aiConditionHeight + 30;
  }

  // Add explanation section
  const explanationHeight = addExplanationSection(
    page,
    fonts,
    data.explanation,
    currentPosition,
    width
  );
  currentPosition -= explanationHeight + 30;

  // Add footer
  if (opts.includeFooter) {
    addFooterSection(page, fonts, height, width, opts.includeTimestamp);
  }

  // Serialize the PDF document
  return await pdfDoc.save();
}

/**
 * A simplified version of the PDF generator
 */
export async function generateBasicPdf(data: ReportData): Promise<Uint8Array> {
  return generatePdf(data, {
    includeAIScore: false,
    includeBranding: false,
    includeFooter: true,
    includeTimestamp: true,
    includePhotoAssessment: false
  });
}

/**
 * A premium version of the PDF generator with all features
 */
export async function generatePremiumPdf(data: ReportData): Promise<Uint8Array> {
  return generatePdf(data, {
    includeAIScore: true,
    includeBranding: true,
    includeFooter: true,
    includeTimestamp: true,
    includePhotoAssessment: true
  });
}
