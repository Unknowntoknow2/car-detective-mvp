
// Re-export everything from the consolidated PDF service
export * from '../pdfService';

// Maintain backward compatibility with existing imports
export {
  generateValuationPdf,
  downloadValuationPdf,
  uploadValuationPdf,
  convertVehicleInfoToReportData,
  downloadPdf
} from '../pdfService';

export type { ReportData, PdfOptions } from '../pdfService';
