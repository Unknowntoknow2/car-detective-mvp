import { supabase } from '@/integrations/supabase/client';
import { EnhancedValuationResult, ValuationInput } from '@/types/valuation';
import { MarketListing } from '@/types/marketListing';

export interface ValuationExplanationInput {
  result: EnhancedValuationResult;
  input: ValuationInput;
  marketListings?: MarketListing[];
  adjustments?: Array<{
    type: string;
    label: string;
    amount: number;
  }>;
}

/**
 * 🎯 REQUIREMENT 1: Generate AI-powered confidence explanation
 * Takes a full valuation result and generates natural-language rationale
 */
export async function generateAIConfidenceExplanation(
  data: ValuationExplanationInput
): Promise<string> {
  try {
    const { result, input, marketListings = [], adjustments = [] } = data;
    
    console.log('🤖 Generating AI confidence explanation for valuation:', {
      vin: input.vin,
      confidence: result.confidence_score,
      estimatedValue: result.estimated_value
    });

    const prompt = buildExplanationPrompt(result, input, marketListings, adjustments);
    
    // Use OpenAI through Supabase Edge Function
    const { data: aiResponse, error } = await supabase.functions.invoke('openai-web-search', {
      body: {
        query: prompt,
        model: 'gpt-4.1-2025-04-14', // Use latest GPT model
        max_tokens: 400,
        saveToDb: false,
        vehicleData: null
      }
    });

    if (error) {
      console.error('❌ Error generating AI explanation:', error);
      return generateFallbackExplanation(result, input, marketListings);
    }

    const explanation = aiResponse?.content?.trim() || generateFallbackExplanation(result, input, marketListings);
    
    console.log('✅ AI explanation generated:', explanation.substring(0, 100) + '...');
    return explanation;

  } catch (error) {
    console.error('❌ AI explanation generation failed:', error);
    return generateFallbackExplanation(data.result, data.input, data.marketListings);
  }
}

/**
 * Build the detailed prompt for AI explanation generation
 */
function buildExplanationPrompt(
  result: EnhancedValuationResult, 
  input: ValuationInput, 
  marketListings: MarketListing[], 
  adjustments: Array<{type: string; label: string; amount: number}>
): string {
  const adjustmentsText = adjustments.map(adj => 
    `- ${adj.label}: ${adj.amount >= 0 ? '+' : ''}$${adj.amount.toLocaleString()}`
  ).join('\n') || 'No adjustments applied';

  const exactVinMatch = result.sources?.includes('exact_vin_match') || false;
  const marketListingsCount = marketListings?.length || 0;

  return `You are an expert vehicle pricing analyst. Explain to a consumer why this valuation is accurate and trustworthy.

Vehicle: ${input.year} ${input.make} ${input.model} ${input.vin ? `(VIN: ${input.vin})` : ''}
Price: $${result.estimated_value?.toLocaleString() || 'N/A'}
Confidence Score: ${result.confidence_score}%
Exact VIN Match: ${exactVinMatch ? 'Yes' : 'No'}
Market Listings Found: ${marketListingsCount}
Mileage: ${input.mileage?.toLocaleString() || 'Unknown'} miles
ZIP Code: ${input.zipCode || 'Unknown'}

Price Breakdown:
${adjustmentsText}

Data Sources Used: ${result.sources?.join(', ') || 'Standard valuation'}

Provide a clear, 2–3 sentence explanation of why this price is trustworthy. Mention confidence factors, exact VIN match if present, and whether live market data supports it. Be professional but accessible to consumers.`;
}

/**
 * Generate fallback explanation when AI is unavailable
 */
function generateFallbackExplanation(
  result: EnhancedValuationResult, 
  input: ValuationInput, 
  marketListings?: MarketListing[]
): string {
  const confidence = result.confidence_score || 0;
  const estimatedValue = result.estimated_value || 0;
  const exactVinMatch = result.sources?.includes('exact_vin_match') || false;
  const marketListingsCount = marketListings?.length || 0;

  // High confidence with exact VIN match
  if (confidence >= 92 && exactVinMatch) {
    return `This ${confidence}% confidence valuation of $${estimatedValue.toLocaleString()} is highly trustworthy due to an exact VIN match with a verified dealer listing. The confidence score reflects strong market support with ${marketListingsCount} comparable listings and comprehensive vehicle data validation.`;
  }
  
  // High confidence without exact VIN match
  if (confidence >= 85) {
    return `This ${confidence}% confidence valuation of $${estimatedValue.toLocaleString()} is based on comprehensive market analysis including ${marketListingsCount} comparable listings and verified vehicle specifications. The estimate reflects current market conditions with strong data support from multiple trusted sources.`;
  }
  
  // Moderate confidence
  if (confidence >= 70) {
    return `This ${confidence}% confidence valuation of $${estimatedValue.toLocaleString()} draws from available market data and vehicle specifications across ${marketListingsCount} listings. While reliable for general guidance, the confidence level indicates some data limitations that may affect precision.`;
  }

  // Low confidence
  if (confidence >= 50) {
    return `This ${confidence}% confidence valuation of $${estimatedValue.toLocaleString()} is based on limited but relevant market data. The moderate confidence score suggests additional market research would be beneficial for critical financial decisions.`;
  }

  // Very low confidence
  return `This ${confidence}% confidence valuation of $${estimatedValue.toLocaleString()} provides directional guidance based on available data. The lower confidence score indicates significant data limitations, and supplemental market research is strongly recommended for important decisions.`;
}