// AI Explanation Service for Valuation Results
import { supabase } from "@/integrations/supabase/client";

export interface ExplanationInput {
  baseValue: number;
  adjustments: Array<{
    label: string;
    amount: number;
    reason: string;
  }>;
  finalValue: number;
  vehicle: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    fuelType?: string;
  };
  zip: string;
  mileage: number;
  listings?: any[];
  confidenceScore: number;
}

/**
 * Generate AI-powered explanation for valuation result
 */
export async function generateAIExplanation(input: ExplanationInput): Promise<string> {
  try {
    console.log('🤖 Generating AI explanation for valuation...');
    
    // Prepare structured data for AI
    const explanationData = {
      vehicle: `${input.vehicle.year} ${input.vehicle.make} ${input.vehicle.model}${input.vehicle.trim ? ` ${input.vehicle.trim}` : ''}`,
      baseValue: input.baseValue,
      finalValue: input.finalValue,
      adjustments: input.adjustments.map(adj => ({
        factor: adj.label,
        amount: adj.amount,
        reason: adj.reason,
        impact: adj.amount > 0 ? 'positive' : 'negative'
      })),
      mileage: input.mileage,
      location: input.zip,
      confidenceScore: input.confidenceScore,
      marketData: (input.listings?.length || 0) > 0,
      fuelType: input.vehicle.fuelType
    };
    
    // Call OpenAI edge function for explanation generation
    const { data, error } = await supabase.functions.invoke('generate-explanation', {
      body: explanationData
    });
    
    if (error) {
      console.error('AI explanation service error:', error);
      return generateFallbackExplanation(input);
    }
    
    if (data?.explanation) {
      console.log('✅ AI explanation generated successfully');
      return data.explanation;
    }
    
    return generateFallbackExplanation(input);
    
  } catch (error) {
    console.error('Error generating AI explanation:', error);
    return generateFallbackExplanation(input);
  }
}

/**
 * Generate fallback explanation when AI service fails
 */
function generateFallbackExplanation(input: ExplanationInput): string {
  const { vehicle, baseValue, finalValue, adjustments, mileage, confidenceScore } = input;
  
  const positiveAdjustments = adjustments.filter(adj => adj.amount > 0);
  const negativeAdjustments = adjustments.filter(adj => adj.amount < 0);
  
  let explanation = `This ${vehicle.year} ${vehicle.make} ${vehicle.model} has been valued at $${finalValue.toLocaleString()}, starting from a base value of $${baseValue.toLocaleString()}.`;
  
  if (positiveAdjustments.length > 0) {
    explanation += ` Positive factors include: ${positiveAdjustments.map(adj => `${adj.label.toLowerCase()} (+$${Math.abs(adj.amount).toLocaleString()})`).join(', ')}.`;
  }
  
  if (negativeAdjustments.length > 0) {
    explanation += ` Value reductions are due to: ${negativeAdjustments.map(adj => `${adj.label.toLowerCase()} (-$${Math.abs(adj.amount).toLocaleString()})`).join(', ')}.`;
  }
  
  explanation += ` With ${mileage.toLocaleString()} miles, this vehicle's condition and market positioning result in a confidence score of ${confidenceScore}%.`;
  
  if (confidenceScore >= 80) {
    explanation += " This is a highly reliable valuation based on comprehensive market data.";
  } else if (confidenceScore >= 60) {
    explanation += " This valuation is based on available market data with good confidence.";
  } else {
    explanation += " This estimate has limited confidence due to incomplete market data.";
  }
  
  return explanation;
}