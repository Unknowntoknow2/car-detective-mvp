
interface ValuationParams {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  location: string;
  valuation: number;
}

/**
 * Generates a human-readable explanation for a vehicle valuation result
 * @param params The vehicle and valuation parameters
 * @returns A string explanation of the valuation
 */
export async function generateValuationExplanation(params: ValuationParams): Promise<string> {
  // In a real application, this might call an AI service or API
  // For now, we'll generate a basic explanation based on the provided parameters
  
  const currentYear = new Date().getFullYear();
  const age = currentYear - params.year;
  
  // Generate explanation for mileage impact
  let mileageComment = '';
  if (params.mileage < 50000) {
    mileageComment = 'which is considered low mileage and positively impacts the value';
  } else if (params.mileage < 100000) {
    mileageComment = 'which is average mileage for a vehicle of this age';
  } else {
    mileageComment = 'which is above average and somewhat reduces the value';
  }
  
  // Generate explanation for condition impact
  let conditionComment = '';
  switch (params.condition.toLowerCase()) {
    case 'excellent':
      conditionComment = 'The excellent condition significantly boosts the value compared to similar vehicles.';
      break;
    case 'good':
      conditionComment = 'The good condition meets market expectations for a vehicle of this age.';
      break;
    case 'fair':
      conditionComment = 'The fair condition slightly reduces the value compared to well-maintained alternatives.';
      break;
    case 'poor':
      conditionComment = 'The poor condition substantially impacts the value, as significant repairs may be needed.';
      break;
    default:
      conditionComment = `The ${params.condition} condition affects the valuation accordingly.`;
  }
  
  // Generate explanation for location impact
  const locationComment = `Market demand in ${params.location} also factors into this valuation.`;
  
  // Create a holistic explanation
  return `This ${params.year} ${params.make} ${params.model} is ${age} years old with ${params.mileage.toLocaleString()} miles, ${mileageComment}. ${conditionComment} ${locationComment} Based on recent comparable sales and market trends, the estimated value is $${params.valuation.toLocaleString()}.`;
}
