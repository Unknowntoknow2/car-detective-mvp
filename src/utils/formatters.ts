
// Re-export all formatters from the formatters directory
// This file exists for backward compatibility with existing imports

import { 
  formatCurrency, 
  formatDate, 
  formatNumber, 
  formatRelativeTime,
  manualEntryToJson
} from './formatters/index';

export {
  formatCurrency,
  formatDate,
  formatNumber,
  formatRelativeTime,
  manualEntryToJson
};

// Add deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  console.warn(
    'Warning: Importing from @/utils/formatters.ts is deprecated. ' +
    'Please import from @/utils/formatters/index.ts or specific formatter files instead.'
  );
}
