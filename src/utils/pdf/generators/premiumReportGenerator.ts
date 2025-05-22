
import PDFDocument from 'pdfkit';
import { ReportData } from '../types';
import { safeString, formatCurrency } from '@/utils/pdf/sections/sectionHelper';
import { drawHeaderSection } from '../sections/headerSection';
import { drawFooterSection } from '../sections/footerSection';
import { drawVehicleInfoSection } from '../sections/vehicleInfoSection';
import { drawValuationSummary } from '../sections/valuationSummary';
import { drawAdjustmentTable } from '../sections/adjustmentTable';
import { drawExplanationSection } from '../sections/explanationSection';
import { drawPhotoAssessmentSection } from '../sections/photoAssessmentSection';
import { drawDisclaimerSection } from '../sections/disclaimerSection';

// Generate a premium valuation report with enhanced features
export const generatePremiumReport = async (data: ReportData): Promise<PDFDocument> => {
  // Create a new PDF document
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

  // Header Section with premium branding
  drawHeaderSection({
    doc,
    data: { 
      reportTitle: 'Premium Vehicle Valuation Report',
      logo: 'path/to/premium-logo.png'
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

  // Adjustments Table Section if adjustments exist
  if (data.adjustments && data.adjustments.length > 0) {
    drawAdjustmentTable({
      doc,
      data,
      pageWidth,
      pageHeight,
      margin
    });
  }

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

  // Market Analysis/Explanation Section
  if (data.explanation) {
    drawExplanationSection({
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
      disclaimerText: 'This premium valuation report includes enhanced data analysis and market insights. ' +
                      'While we strive for accuracy, actual vehicle value may vary based on specific vehicle ' +
                      'condition, local market dynamics, and other factors.'
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
      companyName: 'CarDetective Premium',
      website: 'www.cardetective.com/premium'
    },
    pageWidth,
    pageHeight,
    margin
  });

  return doc;
};
