// OpenAI Agent - AI-powered fallback valuation
import { ValuationInput, EnhancedValuationResult } from "@/types/valuation";

// Re-export the AI explanation service
export { generateAIExplanation } from "@/services/aiExplanationService";

export async function generateOpenAIFallbackValuation(input: ValuationInput): Promise<EnhancedValuationResult> {
  try {
    console.log('🤖 OpenAI Agent: Generating AI fallback valuation for:', {
      vin: input.vin,
      make: input.make,
      model: input.model,
      year: input.year,
      mileage: input.mileage
    });

    // Call OpenAI edge function for intelligent valuation
    const { data, error } = await fetch('/functions/v1/generate-explanation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vin: input.vin,
        make: input.make,
        model: input.model,
        year: input.year,
        mileage: input.mileage || 50000,
        condition: input.condition || 'good',
        zipCode: input.zipCode
      })
    }).then(res => res.json());

    if (error) {
      console.error('❌ OpenAI Agent error:', error);
      throw new Error('Failed to generate AI valuation');
    }

    // Parse AI response and create structured valuation result
    const aiValuation = data.valuation || {};
    const baseValue = aiValuation.estimated_value || calculateFallbackValue(input);
    
    return {
      estimatedValue: baseValue,
      estimated_value: baseValue,
      base_value_source: "openai_ai_estimate",
      mileage_adjustment: aiValuation.mileage_adjustment || -2000,
      depreciation: aiValuation.depreciation || -5000,
      value_breakdown: {
        base_value: baseValue + 7000, // Reverse calculate base
        total_adjustments: (aiValuation.depreciation || -5000) + (aiValuation.mileage_adjustment || -2000),
        depreciation: aiValuation.depreciation || -5000,
        mileage: aiValuation.mileage_adjustment || -2000,
        condition: 0,
        ownership: 0,
        usageType: 0,
        marketSignal: 0,
        fuelCost: 0,
        marketComps: 0,
        fuelType: 0
      },
      confidenceScore: 25, // Low confidence for AI fallback
      confidence_score: 25,
      valuation_explanation: data.explanation || `AI-estimated value for ${input.year} ${input.make} ${input.model}. This estimate is based on market trends and vehicle specifications, but has lower confidence due to limited market data.`,
      marketListings: [],
      sources: ['openai_agent'],
      isFallbackMethod: true
    };

  } catch (error) {
    console.error('❌ OpenAI Agent failed, using basic fallback:', error);
    
    // Final fallback calculation
    const fallbackValue = calculateFallbackValue(input);
    const depreciation = Math.min((new Date().getFullYear() - input.year) * 15, 70);
    const mileageAdjustment = (input.mileage || 50000) > 100000 ? -3000 : -1000;
    
    return {
      estimatedValue: fallbackValue,
      estimated_value: fallbackValue,
      base_value_source: 'fallback_depreciation_model',
      value_breakdown: {
        base_value: fallbackValue,
        total_adjustments: 0,
        depreciation: depreciation,
        mileage: mileageAdjustment,
        condition: 0,
        ownership: 0,
        usageType: 0,
        marketSignal: 0,
        fuelCost: 0,
        marketComps: 0,
        fuelType: 0
      },
      confidenceScore: 45,
      confidence_score: 45,
      valuation_explanation: `Fallback valuation using ${depreciation}% depreciation model. Limited market data available for ${input.year} ${input.make} ${input.model}.`,
      marketListings: [],
      sources: ['fallback_model'],
      isFallbackMethod: true
    };
  }
}

function calculateFallbackValue(input: ValuationInput): number {
  // Simple depreciation model as last resort
  const currentYear = new Date().getFullYear();
  const age = currentYear - input.year;
  const basePrice = getBasePriceByMake(input.make);
  const depreciation = Math.min(age * 0.15, 0.7); // Max 70% depreciation
  
  return Math.round(basePrice * (1 - depreciation));
}

function getBasePriceByMake(make: string): number {
  const makeBasePrices: { [key: string]: number } = {
    'Toyota': 30000,
    'Honda': 28000,
    'Ford': 32000,
    'Chevrolet': 29000,
    'BMW': 45000,
    'Mercedes-Benz': 50000,
    'Audi': 42000,
    'Lexus': 40000,
    'Nissan': 26000,
    'Hyundai': 24000,
    'Kia': 23000,
    'Subaru': 27000,
    'Mazda': 25000
  };
  
  return makeBasePrices[make] || 25000;
}