import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateExplanationRequest {
  valuation_request_id: string;
  force_regenerate?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { valuation_request_id, force_regenerate }: GenerateExplanationRequest = await req.json();
    
    console.log(`🧠 Generating explanation for valuation request: ${valuation_request_id}`);

    // Check if explanation already exists
    if (!force_regenerate) {
      const { data: existing } = await supabaseClient
        .from('valuation_explanations')
        .select('*')
        .eq('valuation_request_id', valuation_request_id)
        .single();

      if (existing) {
        console.log(`✅ Using existing explanation for request: ${valuation_request_id}`);
        return new Response(JSON.stringify({ 
          success: true, 
          data: existing,
          regenerated: false 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Get valuation request data
    const { data: requestData } = await supabaseClient
      .from('valuation_requests')
      .select('*')
      .eq('id', valuation_request_id)
      .single();

    if (!requestData) {
      throw new Error('Valuation request not found');
    }

    // Get valuation result
    const { data: resultData } = await supabaseClient
      .from('valuation_results')
      .select('*')
      .eq('valuation_request_id', valuation_request_id)
      .single();

    // Get market comps used
    const { data: compsData } = await supabaseClient
      .from('market_comps')
      .select('*')
      .eq('valuation_request_id', valuation_request_id)
      .order('confidence_score', { ascending: false })
      .limit(10);

    // Get VIN enrichment data if available
    const { data: vinEnrichment } = await supabaseClient
      .from('vin_enrichment_data')
      .select('*')
      .eq('vin', requestData.vin || '')
      .single();

    // Calculate source weights based on comp data
    const sourceWeights = {};
    const sourceBreakdown = {};
    let totalComps = 0;

    if (compsData && compsData.length > 0) {
      compsData.forEach(comp => {
        const sourceType = comp.source_type || 'unknown';
        if (!sourceWeights[sourceType]) {
          sourceWeights[sourceType] = 0;
          sourceBreakdown[sourceType] = { count: 0, avg_price: 0, total_price: 0 };
        }
        sourceWeights[sourceType] += comp.confidence_score || 85;
        sourceBreakdown[sourceType].count += 1;
        sourceBreakdown[sourceType].total_price += comp.price || 0;
        totalComps += 1;
      });

      // Normalize weights
      Object.keys(sourceWeights).forEach(source => {
        sourceWeights[source] = sourceWeights[source] / totalComps / 100;
        sourceBreakdown[source].avg_price = sourceBreakdown[source].total_price / sourceBreakdown[source].count;
      });
    }

    // Get top influential comps
    const influentialComps = compsData?.slice(0, 5).map(comp => ({
      id: comp.id,
      source: comp.source,
      source_type: comp.source_type,
      price: comp.price,
      mileage: comp.mileage,
      year: comp.year,
      make: comp.make,
      model: comp.model,
      condition: comp.condition,
      location: comp.location,
      listing_url: comp.listing_url,
      confidence_score: comp.confidence_score,
      price_difference: comp.price - (resultData?.estimated_value || 0),
    })) || [];

    // Calculate adjustment factors
    const adjustmentFactors = {
      mileage: {
        vehicle_mileage: requestData.mileage,
        typical_mileage: requestData.year ? (new Date().getFullYear() - requestData.year) * 12000 : null,
        adjustment: requestData.mileage && requestData.year 
          ? ((new Date().getFullYear() - requestData.year) * 12000 - requestData.mileage) * 0.10 
          : 0
      },
      condition: {
        reported_condition: requestData.condition,
        condition_impact: requestData.condition === 'excellent' ? 0.05 : 
                          requestData.condition === 'good' ? 0 :
                          requestData.condition === 'fair' ? -0.05 : -0.15
      },
      location: {
        zip_code: requestData.zip_code,
        market_adjustment: 0 // Could be calculated from market_adjustments table
      },
      features: {
        selected_features: requestData.features || [],
        estimated_value_add: (requestData.features || []).length * 500 // Simplified
      }
    };

    // Generate AI explanation using OpenAI
    const explanationPrompt = `
Generate a comprehensive valuation explanation for this vehicle:

Vehicle: ${requestData.year} ${requestData.make} ${requestData.model}${requestData.trim ? ` ${requestData.trim}` : ''}
VIN: ${requestData.vin || 'Not provided'}
Estimated Value: $${resultData?.estimated_value?.toLocaleString() || 'N/A'}
Confidence: ${resultData?.confidence_score || 'N/A'}%
Mileage: ${requestData.mileage?.toLocaleString() || 'Not provided'}
Condition: ${requestData.condition || 'Not specified'}
Location: ${requestData.zip_code || 'Not provided'}

Data Sources Used:
${Object.entries(sourceBreakdown).map(([source, data]: [string, any]) => 
  `- ${source}: ${data.count} listings, avg price $${data.avg_price.toLocaleString()}`
).join('\n')}

Top Comparable Sales:
${influentialComps.slice(0, 3).map((comp, i) => 
  `${i + 1}. ${comp.year} ${comp.make} ${comp.model} - $${comp.price.toLocaleString()} (${comp.source})`
).join('\n')}

Generate a markdown explanation that includes:

1. **Valuation Summary**: Brief overview of the estimate and confidence level
2. **Data Sources**: How different sources contributed to the valuation
3. **Key Adjustments**: Impact of mileage, condition, location, and features
4. **Market Context**: How this vehicle compares to similar listings
5. **Comparable Sales**: Specific examples that influenced the pricing
6. **Confidence Factors**: What makes this estimate more or less certain
7. **Price Range**: Expected range and why the price might vary

Make it professional but accessible to consumers. Use specific numbers and percentages where possible.
`;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert automotive appraiser creating detailed valuation explanations for vehicle owners.'
          },
          {
            role: 'user',
            content: explanationPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    const openaiData = await openaiResponse.json();
    const explanationMarkdown = openaiData.choices[0].message.content;

    // Generate price range explanation
    const priceRangeExplanation = resultData?.price_range_low && resultData?.price_range_high 
      ? `Based on market data, this vehicle's value typically ranges from $${resultData.price_range_low.toLocaleString()} to $${resultData.price_range_high.toLocaleString()}. The estimated value of $${resultData.estimated_value.toLocaleString()} represents the most likely market value based on current conditions.`
      : 'Price range analysis not available with current data.';

    // Calculate confidence breakdown
    const confidenceBreakdown = {
      data_quality: Math.min(100, (compsData?.length || 0) * 10), // More comps = higher confidence
      source_diversity: Math.min(100, Object.keys(sourceBreakdown).length * 25), // More sources = higher confidence  
      vehicle_specificity: vinEnrichment ? 90 : 60, // VIN data available
      market_coverage: requestData.zip_code ? 85 : 50, // Location provided
      overall_confidence: resultData?.confidence_score || 75
    };

    // Store explanation
    const { data: explanationData, error } = await supabaseClient
      .from('valuation_explanations')
      .upsert({
        valuation_request_id,
        explanation_markdown: explanationMarkdown,
        source_weights: sourceWeights,
        influential_comps: influentialComps,
        adjustment_factors: adjustmentFactors,
        confidence_breakdown: confidenceBreakdown,
        price_range_explanation: priceRangeExplanation,
      }, {
        onConflict: 'valuation_request_id'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log(`✅ Explanation generated successfully for request: ${valuation_request_id}`);

    return new Response(JSON.stringify({ 
      success: true, 
      data: explanationData,
      regenerated: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in explainable-ai-engine function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});