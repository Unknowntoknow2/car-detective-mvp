import { supabase } from "@/integrations/supabase/client";

export interface ValuationExplanationInput {
  vin?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  estimated_value: number;
  confidence_score: number;
  data_sources: string[];
  valuation_notes: string[];
  adjustments: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  baseMSRP?: number;
  msrpSource?: string;
  marketListingsCount?: number;
  marketListings?: Array<{
    price: number;
    title: string;
    source: string;
    url?: string;
  }>;
}

export async function generateValuationExplanation(
  input: ValuationExplanationInput
): Promise<string> {
  try {
    // Call the existing generate-explanation edge function
    const { data, error } = await supabase.functions.invoke('generate-explanation', {
      body: {
        make: input.make,
        model: input.model,
        year: input.year,
        mileage: input.mileage || 0,
        condition: input.condition || 'unknown',
        zipCode: input.zipCode || '',
        baseMarketValue: input.baseMSRP || input.estimated_value,
        finalValuation: input.estimated_value,
        adjustments: input.adjustments.map(adj => ({
          type: adj.factor,
          amount: adj.impact,
          description: adj.description || adj.factor
        })),
        // Additional context for AI explanation
        confidenceScore: input.confidence_score,
        dataSources: input.data_sources,
        valuationNotes: input.valuation_notes,
        marketListingsCount: input.marketListingsCount || 0,
        msrpSource: input.msrpSource || 'unknown',
        marketListings: input.marketListings || []
      }
    });

    if (error) {
      return generateFallbackExplanation(input);
    }

    return data?.explanation || generateFallbackExplanation(input);
  } catch (error) {
    return generateFallbackExplanation(input);
  }
}

function generateFallbackExplanation(input: ValuationExplanationInput): string {
  const hasRealMarketData = input.data_sources.includes('market_listings');
  const isFallbackMSRP = input.data_sources.includes('fallback_msrp');
  const hasOpenAIListings = input.marketListings && input.marketListings.length > 0;
  
  let explanation = `This valuation for your ${input.year} ${input.make} ${input.model}`;
  
  if (input.trim) {
    explanation += ` ${input.trim}`;
  }
  
  explanation += ` is estimated at $${input.estimated_value.toLocaleString()}.`;

  // Market Listing Intelligence Section
  if (hasOpenAIListings) {
    const avgPrice = Math.round(input.marketListings!.reduce((sum, listing) => sum + listing.price, 0) / input.marketListings!.length);
    explanation += ` 🏷️ **Market Listing Intelligence:** We found ${input.marketListings!.length} real-world listings near ZIP ${input.zipCode}, averaging $${avgPrice.toLocaleString()}. These listings replaced our fallback MSRP estimate and include:`;
    
    // Show top 3 listings
    const topListings = input.marketListings!.slice(0, 3);
    topListings.forEach(listing => {
      explanation += ` • ${listing.title} — $${listing.price.toLocaleString()}`;
    });
    
    explanation += ` (Source: OpenAI Web Search)`;
  }
  // Original data source explanation
  else if (hasRealMarketData) {
    explanation += ` This estimate is based on real market listings and comparable vehicles currently for sale.`;
  } else if (isFallbackMSRP) {
    explanation += ` This estimate uses adjusted MSRP data as no recent market listings were available for this specific vehicle.`;
  } else {
    explanation += ` This estimate is calculated using available vehicle data and market trends.`;
  }

  // Confidence explanation
  if (input.confidence_score >= 75) {
    explanation += ` We have high confidence in this estimate due to comprehensive data availability.`;
  } else if (input.confidence_score >= 50) {
    explanation += ` We have moderate confidence in this estimate. Adding more vehicle details could improve accuracy.`;
  } else {
    explanation += ` This estimate has limited confidence due to insufficient data. Consider providing more details like mileage, condition, and location for a more accurate valuation.`;
  }

  // Improvement suggestions
  if (!input.mileage || input.mileage === 0) {
    explanation += ` Providing actual mileage would significantly improve accuracy.`;
  }
  
  if (!input.zipCode || !/^\d{5}$/.test(input.zipCode)) {
    explanation += ` Adding your ZIP code would account for regional market variations.`;
  }

  return explanation;
}