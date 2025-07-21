
/**
 * Enterprise Valuation System
 *
 * Exports all components of the enterprise-level valuation system.
 * NOTE: calculateFinalValuation has been moved to unifiedValuationEngine.ts
 */

export * from "./marketData";
export * from "./featureAdjustments";

// ⚠️ DEPRECATED: Use calculateUnifiedValuation from src/services/valuationEngine.ts instead
export { calculateUnifiedValuation as calculateFinalValuation } from "../../services/valuationEngine";
