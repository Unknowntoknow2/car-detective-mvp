
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from "https://deno.sh/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const ImageScoringRequestSchema = z.object({
  valuation_id: z.string().uuid(),
  image_url: z.string().url()
});

async function analyzeImage(imageUrl: string): Promise<{ score: number; thumbnailUrl: string }> {
  // TODO: Implement actual vision API call here
  // For now, return mock data
  return {
    score: Math.random(),
    thumbnailUrl: imageUrl // In real implementation, this would be a processed thumbnail
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const body = await req.json();
    const validatedData = ImageScoringRequestSchema.parse(body);

    // Analyze image using vision API
    const { score, thumbnailUrl } = await analyzeImage(validatedData.image_url);

    // Store results in photo_scores table
    const { data, error } = await supabase
      .from('photo_scores')
      .insert({
        valuation_id: validatedData.valuation_id,
        score,
        thumbnail_url: thumbnailUrl,
        metadata: {
          original_url: validatedData.image_url,
          analysis_timestamp: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing photo score:', error);
      throw error;
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in score-image function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
