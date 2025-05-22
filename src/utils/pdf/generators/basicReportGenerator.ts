
import PDFDocument from 'pdfkit';
import { ReportData } from '../types';
import { drawHeaderSection } from '../sections/headerSection';
import { drawFooterSection } from '../sections/footerSection';
import { drawVehicleInfoSection } from '../sections/vehicleInfoSection';
import { drawValuationSummary } from '../sections/valuationSummary';
import { drawPhotoAssessmentSection } from '../sections/photoAssessmentSection';
import { drawDisclaimerSection } from '../sections/disclaimerSection';
import { safeString } from '@/utils/pdf/sections/sectionHelper';

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

  // Header Section
  drawHeaderSection(doc, { 
    reportTitle: 'Vehicle Valuation Report',
    logo: 'path/to/logo.png' 
  });

  // Vehicle Information Section
  drawVehicleInfoSection(doc, {
    year: data.year,
    make: safeString(data.make),
    model: safeString(data.model),
    trim: safeString(data.trim),
    vin: safeString(data.vin),
    licensePlate: data.licensePlate ? safeString(data.licensePlate) : undefined,
    bodyType: safeString(data.bodyType),
    color: safeString(data.color),
    engine: data.engine ? safeString(data.engine) : undefined,
    transmission: safeString(data.transmission),
    fuelType: safeString(data.fuelType),
    doors: data.doors
  });

  // Valuation Summary Section
  drawValuationSummary(doc, {
    estimatedValue: data.estimatedValue,
    valuationDate: new Date(),
    marketTrend: 'Stable',
    confidenceLevel: 'High'
  });

  // Photo Assessment Section
  drawPhotoAssessmentSection(doc, {
    photoUrl: data.photoUrl || data.bestPhotoUrl,
    photoScore: data.photoScore,
    conditionSummary: 'Good condition with minor wear and tear'
  });

  // Disclaimer Section
  drawDisclaimerSection(doc, {
    disclaimerText: 'This valuation is an estimate and may not reflect actual market conditions.'
  });

  // Footer Section
  drawFooterSection(doc, {
    reportDate: new Date(),
    companyName: 'CarDetective',
    website: 'www.cardetective.com'
  });

  return doc;
};
