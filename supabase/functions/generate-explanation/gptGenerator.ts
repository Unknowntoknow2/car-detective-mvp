
import { ExplanationRequest } from './types.ts';

/**
 * Generates an explanation using OpenAI's GPT-4o model
 * @param data The valuation data
 * @returns A professional explanation string from GPT-4o
 */
export async function generateGPT4Explanation(data: ExplanationRequest): Promise<string> {
  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    const { 
      make, model, year, mileage, condition, zipCode = data.location, 
      baseMarketValue, finalValuation, adjustments,
      mileageAdj = 0, conditionAdj = 0, zipAdj = 0, featureAdjTotal = 0
    } = data;
    
    // Create system prompt for professional tone
    const systemPrompt = `
You are a world-class vehicle pricing analyst. Your job is to explain clearly, honestly, and concisely why a car received the valuation it did. You must sound neutral, professional, and trustworthy.

Avoid hype or fluff — this is for a user who may sell a $20,000+ asset. Show them that the pricing is thoughtful, not random.

Return the explanation in 3 paragraphs:

1. Base market price and overview.
2. Key adjustments (mileage, condition, ZIP, features).
3. Final recommendation or insight.

End the explanation with a confident tone that this valuation is fair and market-based.
`;

    // Create user prompt with structured data
    const userPrompt = `
Vehicle: ${year} ${make} ${model}
Mileage: ${mileage.toLocaleString()} miles
Condition: ${condition}
ZIP Code: ${zipCode}
Base Market Price: $${baseMarketValue.toLocaleString()}

Adjustments:
* Mileage Adjustment: $${mileageAdj.toLocaleString()}
* Condition Adjustment: $${conditionAdj.toLocaleString()}
* ZIP Regional Adjustment: $${zipAdj.toLocaleString()}
* Feature Adjustments: $${featureAdjTotal.toLocaleString()}

Final Valuation: $${finalValuation.toLocaleString()}

Explain this to a car owner with transparency, so they understand how the price was formed.
`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    return result.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating GPT-4o explanation:', error);
    return "We're unable to generate the explanation right now. Please try again later.";
  }
}
