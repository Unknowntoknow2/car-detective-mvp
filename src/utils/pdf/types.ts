
import PDFDocument from 'pdfkit';

export interface ReportData {
  year: number;
  make: string;
  model: string;
  trim?: string;
  vin: string;
  color?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  mileage?: number;
  estimatedValue: number;
  photoScore?: number;
  bestPhotoUrl?: string;
  photoUrl?: string;
  licensePlate?: string;
  engine?: string;
  doors?: number;
  aiCondition?: {
    summary: string;
    score: number;
  };
}

export interface SectionParams {
  doc: PDFDocument;
  data: any;
  pageWidth: number;
  pageHeight: number;
  margin?: number;
}

export interface ReportOptions {
  pageSize: string;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  includePageNumbers: boolean;
  includePhotos: boolean;
  includeSimilarVehicles: boolean;
  companyInfo: {
    name: string;
    logo: string | null;
    website: string;
    phone: string;
  };
}
