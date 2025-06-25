
// Main Components Export - All consolidated components

// UI Components
export * from './ui';

// Feature Components by Domain
export * from './valuation';
export * from './premium';
export * from './lookup';
export * from './dealer';
export * from './followup';

// Layout & Navigation
export * from './layout/Header';
export * from './layout/Footer';
export * from './layout/Navbar';
export * from './layout/MobileMenu';

// Common Components
export * from './common';

// Marketing Components
export * from './marketing';

// Navbar (consolidated)
export * from './navbar';

// Legacy domain re-exports
export * from './ui-kit';

// Resolve specific conflicts by explicitly importing and re-exporting
export { EmptyState as ValuationEmptyState } from './valuation';
export { PhotoUploadAndScore as ValuationPhotoUpload } from './valuation';
