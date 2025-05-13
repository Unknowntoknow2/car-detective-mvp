
export interface ValuationAdjustment {
  factor: string;
  impact: number;
  description: string; // Make description required
}

// Export the type to be used across the application
export type { ValuationAdjustment };

// This file re-exports from the other files in this directory
export * from './types';
export { calculateFinalValuation } from './calculateFinalValuation';
