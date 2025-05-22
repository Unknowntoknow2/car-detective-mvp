import PDFDocument from 'pdfkit';
import { ReportData } from '../types';
import { drawHeaderSection } from '../sections/headerSection';
import { drawFooterSection } from '../sections/footerSection';
import { drawVehicleInfoSection } from '../sections/vehicleInfoSection';
import { drawValuationSummary } from '../sections/valuationSummary';
import { drawPhotoAssessmentSection } from '../sections/photoAssessmentSection';
import { drawDisclaimerSection } from '../sections/disclaimerSection';
import { safeString } from '@/utils/pdf/sections/sectionHelper';

// Add a type definition for SectionParams to match what's expected by the section functions
interface SectionParams {
  doc: PDFDocument;
  data: any;
  pageWidth: number;
  pageHeight: number;
  margin?: number;
}

export const generateBasicValuationReport = async (data: ReportData): Promise<typeof PDFDocument> => {
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
    data: {
      year: data.year,
      make: safeString(data.make),
      model: safeString(data.model),
      trim: safeString(data.trim),
      vin: safeString(data.vin),
      bodyType: safeString(data.bodyType),
      color: safeString(data.color),
      transmission: safeString(data.transmission),
      fuelType: safeString(data.fuelType),
      // Optional properties with safe access
      licensePlate: data.licensePlate ? safeString(data.licensePlate) : undefined,
      engine: data.engine ? safeString(data.engine) : undefined,
      doors: data.doors
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
      photoUrl: data.photoUrl || data.bestPhotoUrl,
      photoScore: data.photoScore,
      conditionSummary: 'Good condition with minor wear and tear'
    },
    pageWidth,
    pageHeight,
    margin
  });

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
