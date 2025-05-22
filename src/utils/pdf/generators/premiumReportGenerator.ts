
import PDFDocument from 'pdfkit';
import { ReportData } from '../types';
import { drawHeaderSection } from '../sections/headerSection';
import { drawFooterSection } from '../sections/footerSection';
import { drawVehicleInfoSection } from '../sections/vehicleInfoSection';
import { drawValuationSummary } from '../sections/valuationSummary';
import { drawPhotoAssessmentSection } from '../sections/photoAssessmentSection';
import { drawMarketAnalysisSection } from '../sections/marketAnalysisSection';
import { drawDealerOffersSection } from '../sections/dealerOffersSection';
import { drawCarfaxReportSection } from '../sections/carfaxReportSection';
import { safeString } from '@/utils/pdf/sections/sectionHelper';

// Add stubs for missing sections
import { drawValuePredictionSection } from '../sections/valuePredictionSection';
import { drawProfessionalOpinionSection } from '../sections/professionalOpinionSection';

// Add a type definition for SectionParams to match what's expected by the section functions
interface SectionParams {
  doc: PDFDocument;
  data: any;
  pageWidth: number;
  pageHeight: number;
  margin?: number;
}

export const generatePremiumReport = async (data: ReportData): Promise<typeof PDFDocument> => {
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
      reportTitle: 'Premium Valuation Report',
      logo: 'path/to/your/logo.png'
    },
    pageWidth,
    pageHeight,
    margin
  });

  // Vehicle Information Section with basic properties
  drawVehicleInfoSection({
    doc,
    data: {
      year: data.year,
      make: safeString(data.make),
      model: safeString(data.model),
      trim: safeString(data.trim),
      vin: safeString(data.vin),
      bodyType: safeString(data.bodyType),
      color: safeString(data.color),
      transmission: safeString(data.transmission),
      fuelType: safeString(data.fuelType)
    },
    pageWidth,
    pageHeight,
    margin
  });

  // Valuation Summary Section
  drawValuationSummary({
    doc,
    data: {
      estimatedValue: data.estimatedValue,
      valuationDate: new Date(),
      marketTrend: 'Stable',
      confidenceLevel: 'High'
    },
    pageWidth,
    pageHeight,
    margin
  });

  // Photo Assessment Section
  drawPhotoAssessmentSection({
    doc,
    data: {
      photoUrl: data.bestPhotoUrl || data.photoUrl,
      photoScore: data.photoScore || 0,
      conditionSummary: data.aiCondition?.summary || 'Good condition with minor wear and tear'
    },
    pageWidth,
    pageHeight,
    margin
  });

  // Market Analysis Section
  drawMarketAnalysisSection({
    doc,
    data,
    pageWidth,
    pageHeight,
    margin
  });

  // Dealer Offers Section
  drawDealerOffersSection({
    doc,
    data,
    pageWidth,
    pageHeight,
    margin
  });

  // Value Prediction Section
  drawValuePredictionSection({
    doc,
    data,
    pageWidth,
    pageHeight,
    margin
  });

  // Professional Opinion Section
  drawProfessionalOpinionSection({
    doc,
    data,
    pageWidth,
    pageHeight,
    margin
  });

  // Carfax Report Section
  drawCarfaxReportSection({
    doc,
    data,
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
