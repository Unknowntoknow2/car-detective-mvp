
import { ExplanationRequest } from './types.ts';

/**
 * Generates a deterministic explanation without using AI
 * @param data The valuation data 
 * @returns A formatted explanation string
 */
export function generateDetailedExplanation(data: ExplanationRequest): string {
  const { 
    make, model, year, mileage, condition, zipCode = data.location, 
    baseMarketValue, finalValuation, adjustments = [],
    mileageAdj = 0, conditionAdj = 0, zipAdj = 0, featureAdjTotal = 0
  } = data;

  // Format numbers for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Generate condition text
  const getConditionText = () => {
    switch (condition.toLowerCase()) {
      case 'excellent':
        return 'excellent condition, which positively affects its value';
      case 'good':
        return 'good condition, which is typical for a vehicle of this age';
      case 'fair':
        return 'fair condition, which slightly reduces its value';
      case 'poor':
        return 'poor condition, which significantly affects its value';
      default:
        return `${condition} condition`;
    }
  };

  // Generate mileage text
  const getMileageText = () => {
    const avgMileage = (year ? (new Date().getFullYear() - year) * 12000 : 60000);
    
    if (mileage < avgMileage * 0.7) {
      return `lower than average mileage (${mileage.toLocaleString()} miles), which increases its value`;
    } else if (mileage > avgMileage * 1.3) {
      return `higher than average mileage (${mileage.toLocaleString()} miles), which decreases its value`;
    } else {
      return `average mileage (${mileage.toLocaleString()} miles) for a vehicle of this age`;
    }
  };

  // Build the explanation paragraphs
  const paragraphs = [];

  // Paragraph 1: Base market value and overview
  paragraphs.push(
    `Your ${year} ${make} ${model} has a base market value of approximately ${formatCurrency(baseMarketValue)}. This baseline value is derived from recent sales data for similar vehicles in the national market, considering the make, model, year, and current market trends.`
  );

  // Paragraph 2: Key adjustments
  let adjustmentText = `The valuation has been adjusted based on several factors specific to your vehicle. It has ${getMileageText()} and is in ${getConditionText()}.`;
  
  // Add regional adjustment text if significant
  if (Math.abs(zipAdj) > 100) {
    if (zipAdj > 0) {
      adjustmentText += ` The vehicle market in your location (${zipCode}) typically commands higher prices, adding ${formatCurrency(zipAdj)} to your valuation.`;
    } else {
      adjustmentText += ` The vehicle market in your location (${zipCode}) typically sees lower prices, reducing your valuation by ${formatCurrency(Math.abs(zipAdj))}.`;
    }
  }
  
  // Add feature adjustment text if significant
  if (featureAdjTotal > 0) {
    adjustmentText += ` Your vehicle's special features and options add ${formatCurrency(featureAdjTotal)} to its overall value.`;
  }
  
  paragraphs.push(adjustmentText);

  // Paragraph 3: Final recommendation
  paragraphs.push(
    `Based on all these factors, the estimated value of your ${year} ${make} ${model} is ${formatCurrency(finalValuation)}. This valuation reflects current market conditions and the specific details you've provided about your vehicle. It represents a fair market value that could be expected in a private party sale under typical circumstances.`
  );

  return paragraphs.join('\n\n');
}
