
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { photos, valuationId } = await req.json()
    
    if (!photos || photos.length === 0 || !valuationId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: photos, valuationId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Processing ${photos.length} photos for valuation ${valuationId}`)
    
    // Since we can't directly process the image in the mock edge function,
    // we'll simulate AI scoring with a randomized but sensible response
    const conditions = ['Excellent', 'Good', 'Fair', 'Poor']
    const conditionWeights = [0.2, 0.5, 0.2, 0.1] // 20% excellent, 50% good, etc.
    
    let selectedCondition = 'Good'
    const randomValue = Math.random()
    let cumulativeWeight = 0
    
    for (let i = 0; i < conditions.length; i++) {
      cumulativeWeight += conditionWeights[i]
      if (randomValue <= cumulativeWeight) {
        selectedCondition = conditions[i]
        break
      }
    }
    
    // Generate confidence score (70-95%)
    const confidenceScore = Math.floor(70 + Math.random() * 25)
    
    // Generate common issues based on condition
    const possibleIssues = [
      'Minor scratches',
      'Light wear on interior',
      'Faded paint',
      'Dent on passenger door',
      'Worn tires',
      'Cracked windshield',
      'Rust spots',
      'Interior stains',
      'Bumper damage'
    ]
    
    // More severe conditions have more issues
    const numIssues = selectedCondition === 'Excellent' ? 0 :
                     selectedCondition === 'Good' ? Math.floor(Math.random() * 2) + 1 :
                     selectedCondition === 'Fair' ? Math.floor(Math.random() * 3) + 2 :
                     Math.floor(Math.random() * 4) + 3
    
    // Shuffle and pick random issues
    const shuffledIssues = [...possibleIssues].sort(() => 0.5 - Math.random())
    const issuesDetected = shuffledIssues.slice(0, numIssues)
    
    // Create AI condition summary based on condition and issues
    let aiSummary = ''
    if (selectedCondition === 'Excellent') {
      aiSummary = 'Vehicle appears to be in excellent condition with minimal signs of wear.'
    } else if (selectedCondition === 'Good') {
      aiSummary = 'Vehicle is in good overall condition with minor cosmetic issues that don\'t affect functionality.'
    } else if (selectedCondition === 'Fair') {
      aiSummary = 'Vehicle shows signs of normal wear with some cosmetic issues that may require attention.'
    } else {
      aiSummary = 'Vehicle has significant wear and may require repairs to restore to good condition.'
    }
    
    // Assign scores to individual photos (60-100%)
    const photoScores = photos.map((_, index) => ({
      url: `photo_${index + 1}.jpg`, // Mock URL since we don't have real ones
      score: Math.round(60 + Math.random() * 40) / 100,
      isPrimary: index === 0 // First photo is primary
    }))
    
    // Store results in the database
    const metadata = {
      condition: selectedCondition,
      confidenceScore,
      issuesDetected,
      aiSummary
    }
    
    // Save to photo_scores table
    await supabase
      .from('photo_scores')
      .insert({
        valuation_id: valuationId,
        score: confidenceScore / 100,
        metadata
      })
    
    // Update the valuation with the condition score
    await supabase
      .from('valuations')
      .update({
        condition_score: selectedCondition === 'Excellent' ? 90 :
                        selectedCondition === 'Good' ? 75 :
                        selectedCondition === 'Fair' ? 60 : 40
      })
      .eq('id', valuationId)
    
    return new Response(
      JSON.stringify({
        aiCondition: metadata,
        photoScores,
        overallScore: confidenceScore / 100
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in score-image function:', error)
    
    return new Response(
      JSON.stringify({ error: 'Failed to score images', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
