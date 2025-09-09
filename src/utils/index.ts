
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

// Legacy valuation exports removed - use unifiedValuationEngine.ts directly

export { 
  uploadAndAnalyzePhoto as uploadPhoto,
  analyzePhotoCondition as analyzePhoto 
} from './photoService';
