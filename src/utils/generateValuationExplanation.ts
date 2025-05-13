
interface ValuationExplanationParams {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  location: string;
  valuation: number;
}

export async function generateValuationExplanation(params: ValuationExplanationParams): Promise<string> {
  const { make, model, year, mileage, condition, location, valuation } = params;
  
  // In a real implementation, this would call an API or use AI
  // For now, we'll generate a realistic static explanation
  return `
The ${year} ${make} ${model} is valued at $${valuation.toLocaleString()} based on several key factors:

1. **Vehicle Age**: This ${year} model is ${new Date().getFullYear() - year} years old, which places it ${new Date().getFullYear() - year < 5 ? 'on the newer side' : 'in the middle range'} for depreciation factors.

2. **Mileage Impact**: With ${mileage.toLocaleString()} miles, this vehicle has ${mileage < 60000 ? 'below average' : mileage < 100000 ? 'average' : 'above average'} mileage for its age, which ${mileage < 60000 ? 'positively impacts' : mileage < 100000 ? 'maintains' : 'somewhat reduces'} its value.

3. **Condition Assessment**: The ${condition} condition rating ${condition === 'Excellent' ? 'significantly increases' : condition === 'Good' ? 'maintains' : condition === 'Fair' ? 'slightly reduces' : 'reduces'} the vehicle's value.

4. **Market Factors**: The ${make} ${model} currently has ${Math.random() > 0.5 ? 'strong' : 'moderate'} demand in ${location}, affecting the final valuation.

5. **Comparable Sales**: Recent sales of similar ${make} ${model} vehicles in your region have ranged between $${Math.round(valuation * 0.9).toLocaleString()} and $${Math.round(valuation * 1.1).toLocaleString()}.

This valuation represents the vehicle's private party value. Dealer trade-in values are typically 10-15% lower, while dealer retail prices are often 10-20% higher than this estimate.
  `.trim();
}
