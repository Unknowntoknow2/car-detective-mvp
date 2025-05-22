
import PDFDocument from 'pdfkit';
import { ReportData } from '../types';
import { drawHeaderSection } from '../sections/headerSection';
import { drawFooterSection } from '../sections/footerSection';
import { drawVehicleInfoSection } from '../sections/vehicleInfoSection';
import { drawValuationSummary } from '../sections/valuationSummary';
import { drawPhotoAssessmentSection } from '../sections/photoAssessmentSection';
import { drawDisclaimerSection } from '../sections/disclaimerSection';
import { safeString } from '@/utils/pdf/sections/sectionHelper';

// Generate a basic valuation report
export const generateBasicValuationReport = async (data: ReportData): Promise<PDFDocument> => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: 40,
      bottom: 40,
      left: 40,
      right: 40,
    },
  });

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const margin = 40;

  // Header Section
  drawHeaderSection({
    doc,
    data: { 
      reportTitle: 'Vehicle Valuation Report',
      logo: 'path/to/logo.png'
    },
    pageWidth,
    pageHeight,
    margin
  });

  // Vehicle Information Section
  drawVehicleInfoSection({
    doc,
    data,
    pageWidth,
    pageHeight,
    margin
  });

  // Valuation Summary Section
  drawValuationSummary({
    doc,
    data,
    pageWidth,
    pageHeight,
    margin
  });

  // Photo Assessment Section if photo URL exists
  if (data.photoUrl || data.bestPhotoUrl) {
    drawPhotoAssessmentSection({
      doc,
      data,
      pageWidth,
      pageHeight,
      margin
    });
  }

  // Disclaimer Section
  drawDisclaimerSection({
    doc,
    data: {
      disclaimerText: 'This valuation is an estimate and may not reflect actual market conditions.'
    },
    pageWidth,
    pageHeight,
    margin
  });

  // Footer Section
  drawFooterSection({
    doc,
    data: {
      reportDate: new Date(),
      companyName: 'CarDetective',
      website: 'www.cardetective.com'
    },
    pageWidth,
    pageHeight,
    margin
  });

  return doc;
};
