import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { photoUrls, valuationId } = await req.json();

    if (!photoUrls || !Array.isArray(photoUrls) || photoUrls.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'No photo URLs provided' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`🔍 Analyzing ${photoUrls.length} photos for valuation ${valuationId}`);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Process photos in batches to avoid API limits
    const batchSize = 3;
    const individualScores = [];
    let overallDamage = [];
    let overallQuality = [];

    for (let i = 0; i < photoUrls.length; i += batchSize) {
      const batch = photoUrls.slice(i, i + batchSize);
      
      // Prepare image messages for OpenAI
      const imageMessages = batch.map(url => ({
        type: "image_url",
        image_url: {
          url: url,
          detail: "high"
        }
      }));

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: `You are an expert automotive inspector analyzing vehicle photos for valuation purposes. 

Analyze each photo and return a JSON response with this exact structure:
{
  "photos": [
    {
      "index": 0,
      "score": 85,
      "condition": "Good",
      "explanation": "Clear exterior shot showing minor wear",
      "damageDetected": ["minor scratches on bumper"],
      "qualityIssues": ["slight blur in corner"],
      "isPrimary": true
    }
  ],
  "overallAssessment": {
    "condition": "Good",
    "confidence": 85,
    "description": "Vehicle shows normal wear consistent with age and mileage",
    "damageAssessment": {
      "exterior": ["minor paint scratches"],
      "interior": ["light seat wear"],
      "mechanical": []
    }
  }
}

Scoring criteria:
- 90-100: Excellent condition, like new
- 75-89: Good condition, minor cosmetic issues
- 60-74: Fair condition, noticeable wear
- 40-59: Poor condition, significant issues
- Below 40: Major damage or problems

Focus on: paint condition, body damage, interior wear, tire condition, mechanical visible issues.`
            },
            {
              role: 'user',
              content: [
                {
                  type: "text",
                  text: `Please analyze these ${batch.length} vehicle photos and assess their condition, damage, and overall quality. Return detailed JSON analysis.`
                },
                ...imageMessages
              ]
            }
          ],
          max_completion_tokens: 1000,
          temperature: 0.3
        }),
      });

      if (!response.ok) {
        console.error(`❌ OpenAI API error: ${response.status}`);
        // Add fallback scores for this batch
        batch.forEach((url, idx) => {
          individualScores.push({
            url,
            score: 70,
            isPrimary: i + idx === 0,
            explanation: "AI analysis unavailable - estimated score",
            damageDetected: [],
            qualityIssues: ["AI analysis failed"]
          });
        });
        continue;
      }

      const aiResult = await response.json();
      const content = aiResult.choices[0]?.message?.content;

      if (content) {
        try {
          // Extract JSON from the response
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            
            // Process individual photo scores
            if (analysis.photos) {
              analysis.photos.forEach((photo: any, idx: number) => {
                individualScores.push({
                  url: batch[idx],
                  score: photo.score || 70,
                  isPrimary: i + idx === 0 || photo.isPrimary,
                  explanation: photo.explanation || "Analysis completed",
                  damageDetected: photo.damageDetected || [],
                  qualityIssues: photo.qualityIssues || []
                });
              });
            }

            // Aggregate damage and quality issues
            if (analysis.overallAssessment?.damageAssessment) {
              const damage = analysis.overallAssessment.damageAssessment;
              overallDamage.push(...(damage.exterior || []), ...(damage.interior || []), ...(damage.mechanical || []));
            }
          }
        } catch (parseError) {
          console.warn('⚠️ Failed to parse AI response, using fallback');
          // Add fallback for this batch
          batch.forEach((url, idx) => {
            individualScores.push({
              url,
              score: 70,
              isPrimary: i + idx === 0,
              explanation: "AI parsing failed - estimated score"
            });
          });
        }
      }

      // Rate limiting delay
      if (i + batchSize < photoUrls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Calculate overall score and condition
    const avgScore = individualScores.reduce((sum, s) => sum + s.score, 0) / individualScores.length;
    
    let condition: "Excellent" | "Good" | "Fair" | "Poor";
    let confidence = Math.min(95, 60 + (individualScores.length * 8)); // Higher confidence with more photos

    if (avgScore >= 90) {
      condition = "Excellent";
    } else if (avgScore >= 75) {
      condition = "Good";
    } else if (avgScore >= 60) {
      condition = "Fair";
    } else {
      condition = "Poor";
    }

    const result = {
      overallScore: Math.round(avgScore),
      individualScores,
      aiCondition: {
        condition,
        confidence,
        description: `AI analysis of ${photoUrls.length} photos. ${condition} condition with ${overallDamage.length > 0 ? `noted issues: ${overallDamage.slice(0, 3).join(', ')}` : 'no major issues detected'}.`,
        damageAssessment: overallDamage.length > 0 ? {
          exterior: overallDamage.filter(d => d.includes('paint') || d.includes('body') || d.includes('bumper')),
          interior: overallDamage.filter(d => d.includes('seat') || d.includes('dashboard') || d.includes('interior')),
          mechanical: overallDamage.filter(d => d.includes('engine') || d.includes('tire') || d.includes('mechanical'))
        } : undefined
      }
    };

    // Store analysis in database
    try {
      await supabase.from('ai_photo_analysis').insert({
        valuation_id: valuationId,
        photo_urls: photoUrls,
        analysis_results: result,
        confidence_score: confidence,
        condition_score: avgScore,
        features_detected: { photo_count: photoUrls.length, ai_enabled: true },
        damage_detected: overallDamage.length > 0 ? { damage_list: overallDamage } : {}
      });
    } catch (dbError) {
      console.warn('⚠️ Failed to store analysis in database:', dbError);
    }

    console.log(`✅ Photo analysis completed: ${Math.round(avgScore)} overall score`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 Photo analysis failed:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Photo analysis failed',
      overallScore: 60,
      individualScores: [],
      aiCondition: {
        condition: "Fair",
        confidence: 30,
        description: "Analysis unavailable - please try again"
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});