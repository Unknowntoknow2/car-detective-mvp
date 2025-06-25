
// Valuation Components - Consolidated Export

// Core Valuation Components
export { PhotoUploadAndScore } from './PhotoUploadAndScore';
export { QrCodeDownload } from './QrCodeDownload';
export { ValuationEmptyState } from './ValuationEmptyState';
export { AIConditionBadge } from './AIConditionBadge';
export { DealerOffersSection } from './DealerOffersSection';
export { MarketTrendSection } from './MarketTrendSection';

// Valuation Core
export { default as ValuationComplete } from './valuation-complete/ValuationComplete';
export { ValuationProvider, useValuationContext } from './valuation-core/ValuationContext';

// Condition Assessment
export { ConditionSlider } from './condition/ConditionSlider';
export { ConditionTips } from './condition/ConditionTips';

// Legacy re-exports for backward compatibility
export { PhotoUploadAndScore as PhotoUpload } from './PhotoUploadAndScore';
export { ValuationEmptyState as EmptyState } from './ValuationEmptyState';
export { AIConditionBadge as ConditionBadge } from './AIConditionBadge';
