
/**
 * Enterprise Valuation Examples
 * 
 * Demonstrates the usage of the enterprise-level valuation system
 * with exact calculations and precise results.
 */

import { calculateFinalValuation, ValuationInput, ValuationOutput } from './calculateFinalValuation';

/**
 * Example usage of the precise valuation calculator
 * @returns A Promise resolving to a detailed valuation example
 */
export async function valuationExample(): Promise<ValuationOutput> {
  const sampleInput: ValuationInput = {
    baseMarketValue: 25000,
    vehicleYear: 2019,
    make: 'Toyota',
    model: 'RAV4',
    mileage: 45000,
    condition: 'Good',
    zipCode: '98101', // Seattle
    features: ['Leather Seats', 'Navigation System', 'Backup Camera']
  };

  return await calculateFinalValuation(sampleInput);
}

/**
 * Displays the valuation example in a formatted way
 * @returns Formatted string with valuation details
 */
export async function printValuationExample(): Promise<string> {
  const result = await valuationExample();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  let output = '=== PRECISE VEHICLE VALUATION ===\n\n';
  output += `Base Market Value: ${formatCurrency(result.adjustedMarketValue)}\n\n`;
  output += 'Adjustments:\n';
  output += `- Mileage Adjustment: ${formatCurrency(result.adjustments.mileageAdjustment)}\n`;
  output += `- Condition Adjustment: ${formatCurrency(result.adjustments.conditionAdjustment)}\n`;
  output += `- Regional Market Adjustment: ${formatCurrency(result.adjustments.regionalAdjustment)}\n`;
  output += '- Feature Adjustments:\n';
  
  Object.entries(result.adjustments.featureAdjustments).forEach(([feature, value]) => {
    output += `  * ${feature}: ${formatCurrency(value)}\n`;
  });
  
  output += `\nTotal Adjustments: ${formatCurrency(result.totalAdjustments)}\n`;
  output += `Final Valuation: ${formatCurrency(result.finalValuation)}\n`;
  
  return output;
}

/**
 * Log valuation example to console
 */
export async function logValuationExample(): Promise<void> {
  console.log(await printValuationExample());
}
