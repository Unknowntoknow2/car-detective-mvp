
// Main utilities export file - consolidated services
export * from './pdfService';
export * from './lookupService';
export * from './valuationService';
export * from './photoService';

// Legacy re-exports for backward compatibility
export { 
  generateValuationPdf as generatePdf,
  downloadValuationPdf as downloadPdf,
  uploadValuationPdf as uploadPdf 
} from './pdfService';

export { 
  lookupByVin as vinLookup,
  lookupByPlate as plateLookup,
  processManualEntry as manualLookup 
} from './lookupService';

export { 
  calculateValuation as getValuation,
  convertToReportData as createReportData 
} from './valuationService';

export { 
  uploadAndAnalyzePhoto as uploadPhoto,
  analyzePhotoCondition as analyzePhoto 
} from './photoService';
