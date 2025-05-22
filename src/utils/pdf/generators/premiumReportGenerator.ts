
import PDFDocument from 'pdfkit';
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

export const generatePremiumReport = async (data: ReportData): Promise<PDFDocument> => {
  const doc = new PDFDocument({
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
    reportTitle: 'Premium Valuation Report',
    logo: 'path/to/your/logo.png'
  });

  let currentY = 120; // Starting Y position after the header

  // Vehicle Information Section with basic properties
  const vehicleInfoData = {
    year: data.year,
    make: safeString(data.make),
    model: safeString(data.model),
    trim: safeString(data.trim),
    vin: safeString(data.vin),
    bodyType: safeString(data.bodyType),
    color: safeString(data.color),
    transmission: safeString(data.transmission),
    fuelType: safeString(data.fuelType),
  };
  
  currentY = drawVehicleInfoSection(doc, vehicleInfoData);

  // Valuation Summary Section
  const valuationData = {
    estimatedValue: data.estimatedValue,
    valuationDate: new Date(),
    marketTrend: 'Stable',
    confidenceLevel: 'High'
  };
  
  currentY = drawValuationSummary(doc, valuationData);

  // Photo Assessment Section
  const photoData = {
    photoUrl: data.bestPhotoUrl || data.photoUrl,
    photoScore: data.photoScore || 0,
    conditionSummary: data.aiCondition?.summary || 'Good condition with minor wear and tear'
  };
  
  currentY = drawPhotoAssessmentSection(doc, photoData);

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
    companyName: 'CarDetective',
    website: 'www.cardetective.com'
  });

  return doc;
};
