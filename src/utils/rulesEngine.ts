
import { RulesEngine as RulesEngineImplementation } from './rules/RulesEngine';

// Create and export an instance of the rules engine
export const RulesEngine = RulesEngineImplementation;

// Export types
export interface ValuationAuditTrail {
  factor: string;
  impact: number;
  description: string;
}
