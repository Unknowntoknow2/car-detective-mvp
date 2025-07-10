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
  
  // Generate structured markdown explanation
  let explanation = `## 📊 Valuation Breakdown\n\n`;
  
  explanation += `- **Base Value:** $${baseValue.toLocaleString()} (estimated MSRP)\n`;
  
  // Add each adjustment as a bullet point
  adjustments.forEach(adj => {
    const sign = adj.amount >= 0 ? '+' : '';
    explanation += `- **${adj.label}:** ${sign}$${adj.amount.toLocaleString()} (${adj.reason})\n`;
  });
  
  explanation += `\n### 🎯 Final Value: **$${finalValue.toLocaleString()}**\n\n`;
  explanation += `### 🤖 Confidence: ${confidenceScore}%\n\n`;
  
  if (confidenceScore >= 80) {
    explanation += "**Reasoning:** High confidence valuation based on comprehensive data analysis.\n\n";
  } else if (confidenceScore >= 60) {
    explanation += "**Reasoning:** Good confidence valuation with available market data.\n\n";
  } else {
    explanation += "**Reasoning:** Limited confidence due to incomplete market data availability.\n\n";
  }
  
  explanation += `---\n\n**Data Sources:**\n`;
  explanation += `- VIN Decode (Vehicle Specifications)\n`;
  explanation += `- Market Analysis (Regional Adjustments)\n`;
  explanation += `- Condition Assessment\n`;
  explanation += `- Mileage Impact Analysis\n`;
  
  return explanation;
}