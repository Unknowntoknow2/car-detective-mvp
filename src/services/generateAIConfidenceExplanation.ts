import { supabase } from '@/integrations/supabase/client';

export interface ValuationExplanationContext {
  vin: string;
  confidenceScore: number;
  marketListings: any[];
  exactVinMatch: boolean;
  photoCondition?: {
    score: number;
    issues: string[];
  };
  adjustments: Array<{
    type: string;
    label: string;
    amount: number;
  }>;
  sources: string[];
  finalValue: number;
  originalMsrp?: number;
}

/**
 * Generate AI-powered explanation of valuation confidence and methodology
 */
export async function generateAIConfidenceExplanation(
  context: ValuationExplanationContext
): Promise<string> {
  try {
    console.log('🤖 Generating AI confidence explanation for VIN:', context.vin);

    const prompt = buildExplanationPrompt(context);
    
    const { data, error } = await supabase.functions.invoke('openai-web-search', {
      body: {
        query: prompt,
        model: 'gpt-4o-mini',
        max_tokens: 500,
        saveToDb: false,
        vehicleData: null
      }
    });

    if (error) {
      console.error('❌ Error generating AI explanation:', error);
      return generateFallbackExplanation(context);
    }

    return data?.content || generateFallbackExplanation(context);
  } catch (error) {
    console.error('❌ AI explanation generation failed:', error);
    return generateFallbackExplanation(context);
  }
}

/**
 * Build the prompt for AI explanation generation
 */
function buildExplanationPrompt(context: ValuationExplanationContext): string {
  const {
    vin,
    confidenceScore,
    marketListings,
    exactVinMatch,
    photoCondition,
    adjustments,
    sources,
    finalValue,
    originalMsrp
  } = context;

  return `As a vehicle valuation expert, explain this valuation in 2-3 sentences for a consumer:

VIN: ${vin}
Final Value: $${finalValue.toLocaleString()}
Confidence: ${confidenceScore}%
${originalMsrp ? `Original MSRP: $${originalMsrp.toLocaleString()}` : ''}

Data Sources:
- Market Listings: ${marketListings.length} found
- Exact VIN Match: ${exactVinMatch ? 'YES' : 'NO'}
- Photo Analysis: ${photoCondition ? `${photoCondition.score}% condition` : 'Not available'}
- Sources Used: ${sources.join(', ')}

Key Adjustments:
${adjustments.map(adj => `- ${adj.label}: ${adj.amount >= 0 ? '+' : ''}$${adj.amount.toLocaleString()}`).join('\n')}

Explain:
1. Why this confidence level is justified
2. What data anchored the valuation
3. How trustworthy this estimate is
Keep it professional but accessible to consumers.`;
}

/**
 * Generate fallback explanation when AI is unavailable
 */
function generateFallbackExplanation(context: ValuationExplanationContext): string {
  const {
    confidenceScore,
    marketListings,
    exactVinMatch,
    sources,
    finalValue
  } = context;

  if (confidenceScore >= 92 && exactVinMatch) {
    return `This ${confidenceScore}% confidence valuation of $${finalValue.toLocaleString()} is anchored to an exact VIN match from a verified dealer listing. With ${marketListings.length} market listings and comprehensive vehicle data, this represents a highly reliable market-based estimate.`;
  }
  
  if (confidenceScore >= 85) {
    return `This ${confidenceScore}% confidence valuation of $${finalValue.toLocaleString()} is based on ${marketListings.length} comparable listings and verified vehicle specifications. The estimate reflects current market conditions with strong data support.`;
  }
  
  if (confidenceScore >= 70) {
    return `This ${confidenceScore}% confidence valuation of $${finalValue.toLocaleString()} draws from available market data and vehicle specifications. While reliable for general guidance, additional market research is recommended for critical decisions.`;
  }

  return `This ${confidenceScore}% confidence valuation of $${finalValue.toLocaleString()} is based on limited data availability. The estimate provides directional guidance but should be supplemented with additional market research for important financial decisions.`;
}