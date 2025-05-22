import PDFKit from 'pdfkit';
import { ReportData } from '../types';
import { drawHeaderSection } from '../sections/headerSection';
import { drawFooterSection } from '../sections/footerSection';
import { drawVehicleInfoSection } from '../sections/vehicleInfoSection';
import { drawValuationSummary } from '../sections/valuationSummary';
import { drawPhotoAssessmentSection } from '../sections/photoAssessmentSection';
import { drawMarketAnalysisSection } from '../sections/marketAnalysisSection';
import { drawDealerOffersSection } from '../sections/dealerOffersSection';
import { drawValuePredictionSection } from '../sections/valuePredictionSection';
import { drawProfessionalOpinionSection } from '../sections/professionalOpinionSection';
import { drawCarfaxReportSection } from '../sections/carfaxReportSection';
import { safeString } from '@/utils/pdf/sections/sectionHelper';

export const generatePremiumReport = async (data: ReportData): Promise<PDFKit.PDFDocument> => {
  const doc = new PDFKit({
    size: 'A4',
    margins: {
      top: 40,
      bottom: 40,
      left: 40,
      right: 40,
    },
  });

  // Header Section
  drawHeaderSection(doc, {
    title: 'Premium Valuation Report',
    logo: 'path/to/your/logo.png',
  });

  let currentY = 120; // Starting Y position after the header

  // Vehicle Information Section
  currentY = drawVehicleInfoSection(doc, data, currentY);

  // Valuation Summary Section
  currentY = drawValuationSummary(doc, data, currentY);

  // Photo Assessment Section
  currentY = drawPhotoAssessmentSection(doc, data, currentY);

  // Market Analysis Section
  currentY = drawMarketAnalysisSection(doc, data, currentY);

  // Dealer Offers Section
  currentY = drawDealerOffersSection(doc, data, currentY);

  // Value Prediction Section
  currentY = drawValuePredictionSection(doc, data, currentY);

  // Professional Opinion Section
  currentY = drawProfessionalOpinionSection(doc, data, currentY);

  // Carfax Report Section
  currentY = drawCarfaxReportSection(doc, data, currentY);

  // Footer Section
  drawFooterSection(doc, {
    reportDate: new Date(),
    disclaimer: 'This valuation is an estimate and may vary.',
  });

  return doc;
};
