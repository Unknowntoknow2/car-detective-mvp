
// Main utilities export file - consolidated services
export * from './pdfService';
export * from './lookupService';
export * from './photoService';

// Legacy re-exports for backward compatibility
export { 
  generateValuationPdf as generatePdf,
  downloadValuationPdf as downloadPdf,
  uploadValuationPdf as uploadPdf 
} from './pdfService';

export { 
  lookupByVin as vinLookup,
  lookupByPlate as plateLookup
} from './lookupService';

// AIN-only implementation - no legacy valuation engines

export { 
  uploadAndAnalyzePhoto as uploadPhoto,
  analyzePhotoCondition as analyzePhoto 
} from './photoService';
