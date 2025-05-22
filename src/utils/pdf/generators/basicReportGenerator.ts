import PDFKit from 'pdfkit';
import { ReportData } from '../types';
import { drawHeaderSection } from '../sections/headerSection';
import { drawFooterSection } from '../sections/footerSection';
import { drawVehicleInfoSection } from '../sections/vehicleInfoSection';
import { drawValuationSummary } from '../sections/valuationSummary';
import { drawPhotoAssessmentSection } from '../sections/photoAssessmentSection';
import { drawDisclaimerSection } from '../sections/disclaimerSection';
import { safeString } from '@/utils/pdf/sections/sectionHelper';

export const generateBasicValuationReport = async (data: ReportData): Promise<PDFKit.PDFDocument> => {
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
  drawHeaderSection(doc, { logo: 'path/to/logo.png', reportTitle: 'Vehicle Valuation Report' });

  // Vehicle Information Section
  drawVehicleInfoSection(doc, {
    year: data.year,
    make: safeString(data.make),
    model: safeString(data.model),
    trim: safeString(data.trim),
    vin: safeString(data.vin),
    licensePlate: safeString(data.licensePlate),
    bodyType: safeString(data.bodyType),
    color: safeString(data.color),
    engine: safeString(data.engine),
    transmission: safeString(data.transmission),
    fuelType: safeString(data.fuelType),
    doors: data.doors,
  });

  // Valuation Summary Section
  drawValuationSummary(doc, {
    estimatedValue: data.estimatedValue,
    valuationDate: new Date(),
    marketTrend: 'Stable',
    confidenceLevel: 'High',
  });

  // Photo Assessment Section
  drawPhotoAssessmentSection(doc, {
    photoUrl: data.photoUrl,
    photoScore: data.photoScore,
    conditionSummary: 'Good condition with minor wear and tear',
  });

  // Disclaimer Section
  drawDisclaimerSection(doc, {
    disclaimerText: 'This valuation is an estimate and may not reflect actual market conditions.',
  });

  // Footer Section
  drawFooterSection(doc, {
    reportDate: new Date(),
    companyName: 'CarDetective',
    website: 'www.cardetective.com',
  });

  return doc;
};
