<<<<<<< HEAD

// Import and re-export result components
export { LoadingState } from './result/LoadingState';
export { ErrorState } from './result/ErrorState';

// Export other valuation components
export { default as ValuationResult } from './ValuationResult';
export { default as ValuationResultLayout } from './ValuationResultLayout';
export { ValuationContext, ValuationProvider, useValuationContext } from './context/ValuationContext';
=======
// Export valuation components
export * from "./header";
export * from "./condition";
export * from "./photo-upload";
// Re-export with unique names to avoid conflicts
export {
  CompletionHeader,
  CompletionValuationHeader,
  NextStepsCard,
} from "./valuation-complete";
export * from "./result";
export * from "./free";
export * from "./form";
export * from "./report";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
