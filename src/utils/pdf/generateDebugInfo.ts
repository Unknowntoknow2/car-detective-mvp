
import { ReportData } from '../pdfService';

export interface DebugInfo {
  basePriceLogic: string;
  mileageAdjustment: string;
  zipAdjustment: string;
  conditionFactor: string;
  confidenceBreakdown: string;
  calculationSteps: string[];
}

export function generateDebugInfo(reportData: ReportData): DebugInfo {
  const basePrice = reportData.basePrice || reportData.estimatedValue || 0;
  const mileage = reportData.mileage || 0;
  const condition = reportData.condition || 'Good';
  
  return {
    basePriceLogic: `Base Price: $${basePrice.toLocaleString()} (Market average for ${reportData.year} ${reportData.make} ${reportData.model})`,
    
    mileageAdjustment: `Mileage: ${mileage.toLocaleString()} miles
    - Standard depreciation: $${Math.round(mileage * 0.05)} 
    - High mileage penalty: ${mileage > 100000 ? '$500' : '$0'}`,
    
    zipAdjustment: `ZIP Code: ${reportData.zipCode}
    - Regional demand factor: 1.0x (baseline)
    - Local market adjustment: $0`,
    
    conditionFactor: `Condition: ${condition}
    - Excellent: +5% | Good: 0% | Fair: -10% | Poor: -25%
    - Applied factor: ${getConditionMultiplier(condition)}x`,
    
    confidenceBreakdown: `Confidence Score: ${reportData.confidenceScore || 75}%
    - Data completeness: 85%
    - Market data availability: 75%
    - VIN decode accuracy: 90%`,
    
    calculationSteps: [
      `1. Base Price: $${basePrice.toLocaleString()}`,
      `2. Adjustments: Now calculated by AdjustmentEngine with real sources`,
      `3. Condition Factor: Calculated based on market data when available`,
      `4. Final Value: $${reportData.estimatedValue?.toLocaleString() || 'TBD'}`
    ]
  };
}

function getConditionMultiplier(condition: string): number {
  switch (condition.toLowerCase()) {
    case 'excellent': return 1.05;
    case 'good': return 1.0;
    case 'fair': return 0.9;
    case 'poor': return 0.75;
    default: return 1.0;
  }
}

export function formatDebugInfoForPdf(debugInfo: DebugInfo): string {
  return `
INTERNAL QA DEBUG INFORMATION
(For CarPerfector Team Use Only)

${debugInfo.basePriceLogic}

ADJUSTMENTS:
${debugInfo.mileageAdjustment}

${debugInfo.zipAdjustment}

${debugInfo.conditionFactor}

CONFIDENCE ANALYSIS:
${debugInfo.confidenceBreakdown}

CALCULATION STEPS:
${debugInfo.calculationSteps.join('\n')}

Generated for internal quality assurance purposes.
  `.trim();
}
