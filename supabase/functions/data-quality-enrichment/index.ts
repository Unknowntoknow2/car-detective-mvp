import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VINEnrichmentRequest {
  vin: string;
  listing_id?: string;
  force_refresh?: boolean;
}

interface PhotoAnalysisRequest {
  listing_id: string;
  vin?: string;
  photo_urls: string[];
  force_reprocess?: boolean;
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

    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    switch (action) {
      case 'enrich-vin': {
        const { vin, listing_id, force_refresh }: VINEnrichmentRequest = await req.json();
        
        console.log(`🔍 Enriching VIN: ${vin}`);
        
        // Check if we already have enriched data and it's recent
        if (!force_refresh) {
          const { data: existing } = await supabaseClient
            .from('vin_enrichment_data')
            .select('*')
            .eq('vin', vin)
            .gte('last_enriched_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // 24 hours
            .single();

          if (existing) {
            console.log(`✅ Using cached enrichment data for VIN: ${vin}`);
            return new Response(JSON.stringify({ 
              success: true, 
              data: existing,
              cached: true 
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        }

        // Call VPIC API for VIN decoding
        const vpicResponse = await fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`
        );
        const vpicData = await vpicResponse.json();

        // Extract relevant build data
        const buildData = {
          make: vpicData.Results?.find((r: any) => r.Variable === 'Make')?.Value || null,
          model: vpicData.Results?.find((r: any) => r.Variable === 'Model')?.Value || null,
          year: vpicData.Results?.find((r: any) => r.Variable === 'Model Year')?.Value || null,
          trim: vpicData.Results?.find((r: any) => r.Variable === 'Trim')?.Value || null,
          engine: vpicData.Results?.find((r: any) => r.Variable === 'Engine Model')?.Value || null,
          transmission: vpicData.Results?.find((r: any) => r.Variable === 'Transmission Style')?.Value || null,
          drivetrain: vpicData.Results?.find((r: any) => r.Variable === 'Drive Type')?.Value || null,
          body_type: vpicData.Results?.find((r: any) => r.Variable === 'Body Class')?.Value || null,
          fuel_type: vpicData.Results?.find((r: any) => r.Variable === 'Fuel Type - Primary')?.Value || null,
          doors: vpicData.Results?.find((r: any) => r.Variable === 'Doors')?.Value || null,
          seats: vpicData.Results?.find((r: any) => r.Variable === 'Seat Belts (All Positions)')?.Value || null,
        };

        // Calculate enrichment score (0-100)
        const fields = Object.values(buildData);
        const filledFields = fields.filter(field => field && field !== 'Not Applicable').length;
        const enrichmentScore = Math.round((filledFields / fields.length) * 100);

        // Store enrichment data
        const { data: enrichmentData, error } = await supabaseClient
          .from('vin_enrichment_data')
          .upsert({
            vin,
            source: 'vpic',
            decoded_data: vpicData,
            build_data: buildData,
            enrichment_score: enrichmentScore,
            last_enriched_at: new Date().toISOString(),
          }, {
            onConflict: 'vin,source'
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        console.log(`✅ VIN enriched successfully: ${vin} (Score: ${enrichmentScore}%)`);

        return new Response(JSON.stringify({ 
          success: true, 
          data: enrichmentData,
          cached: false 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'analyze-photos': {
        const { listing_id, vin, photo_urls, force_reprocess }: PhotoAnalysisRequest = await req.json();
        
        console.log(`📸 Analyzing photos for listing: ${listing_id}`);

        // Check if we already have analysis and it's recent
        if (!force_reprocess) {
          const { data: existing } = await supabaseClient
            .from('ai_photo_analysis')
            .select('*')
            .eq('listing_id', listing_id)
            .gte('processed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // 7 days
            .single();

          if (existing) {
            console.log(`✅ Using cached photo analysis for listing: ${listing_id}`);
            return new Response(JSON.stringify({ 
              success: true, 
              data: existing,
              cached: true 
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        }

        if (!photo_urls || photo_urls.length === 0) {
          throw new Error('No photo URLs provided');
        }

        // Use OpenAI Vision to analyze the first few photos
        const photosToAnalyze = photo_urls.slice(0, 5); // Limit to 5 photos for cost control
        
        const analysisPrompt = `
Analyze these vehicle photos and provide a detailed assessment in JSON format:

{
  "condition_score": 0-100,
  "condition_rating": "excellent|good|fair|poor",
  "damage_detected": {
    "accident_damage": boolean,
    "rust": boolean,
    "dents": boolean,
    "scratches": boolean,
    "paint_issues": boolean,
    "interior_wear": boolean
  },
  "features_detected": {
    "sunroof": boolean,
    "leather_seats": boolean,
    "navigation": boolean,
    "premium_wheels": boolean,
    "spoiler": boolean,
    "tinted_windows": boolean
  },
  "assessment_notes": "Brief description of overall condition and notable features"
}

Focus on visible damage, wear patterns, and premium features. Be conservative in scoring.
`;

        const messages = [
          {
            role: 'system',
            content: 'You are an expert automotive appraiser analyzing vehicle photos for condition and features.'
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: analysisPrompt },
              ...photosToAnalyze.map(url => ({
                type: 'image_url',
                image_url: { url }
              }))
            ]
          }
        ];

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages,
            max_tokens: 1000,
            temperature: 0.1,
          }),
        });

        const openaiData = await openaiResponse.json();
        let analysisResults = {};
        let conditionScore = 75; // Default
        let confidenceScore = 85;

        try {
          const responseText = openaiData.choices[0].message.content;
          // Try to extract JSON from the response
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            analysisResults = JSON.parse(jsonMatch[0]);
            conditionScore = analysisResults.condition_score || 75;
          }
        } catch (parseError) {
          console.warn('Failed to parse OpenAI response as JSON:', parseError);
          analysisResults = { error: 'Failed to parse AI response', raw_response: openaiData };
          confidenceScore = 50;
        }

        // Store photo analysis
        const { data: photoAnalysis, error } = await supabaseClient
          .from('ai_photo_analysis')
          .upsert({
            listing_id,
            vin,
            photo_urls,
            analysis_results: analysisResults,
            condition_score: conditionScore,
            damage_detected: analysisResults.damage_detected || {},
            features_detected: analysisResults.features_detected || {},
            confidence_score: confidenceScore,
            processed_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        console.log(`✅ Photos analyzed successfully for listing: ${listing_id} (Score: ${conditionScore})`);

        return new Response(JSON.stringify({ 
          success: true, 
          data: photoAnalysis,
          cached: false 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'detect-fraud': {
        const { listing_id }: { listing_id: string } = await req.json();
        
        console.log(`🚨 Running fraud detection for listing: ${listing_id}`);

        // Get listing data
        const { data: listing } = await supabaseClient
          .from('market_comps')
          .select('*')
          .eq('id', listing_id)
          .single();

        if (!listing) {
          throw new Error('Listing not found');
        }

        const flags = [];

        // Price anomaly detection
        if (listing.price && listing.year && listing.make && listing.model) {
          // Get similar listings for comparison
          const { data: similarListings } = await supabaseClient
            .from('market_comps')
            .select('price')
            .eq('make', listing.make)
            .eq('model', listing.model)
            .gte('year', listing.year - 2)
            .lte('year', listing.year + 2)
            .gte('price', 1000)
            .limit(50);

          if (similarListings && similarListings.length > 5) {
            const prices = similarListings.map(l => l.price).sort((a, b) => a - b);
            const median = prices[Math.floor(prices.length / 2)];
            const percentDiff = ((listing.price - median) / median) * 100;

            if (percentDiff < -50) {
              flags.push({
                flag_type: 'price_anomaly',
                flag_reason: `Price is ${Math.abs(percentDiff).toFixed(1)}% below market median`,
                confidence_score: Math.min(90, Math.abs(percentDiff)),
              });
            }
          }
        }

        // Duplicate detection (same VIN, very similar price)
        if (listing.vin) {
          const { data: duplicates } = await supabaseClient
            .from('market_comps')
            .select('id, price, source')
            .eq('vin', listing.vin)
            .neq('id', listing_id)
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

          if (duplicates && duplicates.length > 0) {
            const samePriceDuplicates = duplicates.filter(d => 
              Math.abs(d.price - listing.price) < (listing.price * 0.05)
            );

            if (samePriceDuplicates.length > 0) {
              flags.push({
                flag_type: 'duplicate',
                flag_reason: `Same VIN found ${samePriceDuplicates.length} times with similar prices`,
                confidence_score: 70,
              });
            }
          }
        }

        // Zero mile check for older vehicles
        if (listing.mileage === 0 && listing.year && listing.year < new Date().getFullYear() - 1) {
          flags.push({
            flag_type: 'fake_mileage',
            flag_reason: `${new Date().getFullYear() - listing.year} year old vehicle with 0 miles`,
            confidence_score: 85,
          });
        }

        // Store fraud flags
        for (const flag of flags) {
          await supabaseClient
            .from('fraud_detection_flags')
            .insert({
              listing_id,
              vin: listing.vin,
              ...flag,
            });
        }

        console.log(`✅ Fraud detection completed for listing: ${listing_id} (${flags.length} flags)`);

        return new Response(JSON.stringify({ 
          success: true, 
          flags_detected: flags.length,
          flags 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in data-quality-enrichment function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});