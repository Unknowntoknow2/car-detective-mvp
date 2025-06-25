
// Valuation Components - Consolidated Export

// Note: PhotoUpload is now only exported from the main components index with unique naming
// to avoid conflicts. Use PhotoUploadAndScore or ValuationPhotoUpload from the main index.

export { ValuationEmptyState } from './ValuationEmptyState';

// Re-export EmptyState for backward compatibility  
export { ValuationEmptyState as EmptyState } from './ValuationEmptyState';

// Legacy re-exports for backward compatibility
export { ValuationEmptyState as ErrorState } from './ValuationEmptyState';
