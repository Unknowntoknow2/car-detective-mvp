
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
}

interface ConditionAssessment {
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  confidenceScore: number;
  issuesDetected: string[];
  aiSummary: string;
  bestPhotoUrl?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { photoUrls, valuationId, individualScores } = await req.json();

    if (!photoUrls || !Array.isArray(photoUrls) || photoUrls.length === 0) {
      return new Response(
        JSON.stringify({ error: "No photo URLs provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!valuationId) {
      return new Response(
        JSON.stringify({ error: "Missing valuation ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Analyzing ${photoUrls.length} photos for valuation: ${valuationId}`);

    // Set up admin client for database operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // In a production environment, we would analyze images using a vision API
    // For now, use a simulated analysis function
    let assessment: ConditionAssessment;
    
    try {
      // If we have individual scores, use them to calculate a weighted condition
      if (individualScores && Array.isArray(individualScores) && individualScores.length > 0) {
        assessment = await analyzeWithScores(individualScores);
      } else {
        // Fallback to basic simulation
        assessment = await simulateConditionAssessment(photoUrls);
      }
    } catch (analyzeError) {
      console.error("Error during analysis:", analyzeError);
      assessment = await simulateConditionAssessment(photoUrls);
    }
    
    // Store the assessment in the database
    const { error: storeError } = await adminClient
      .from('photo_condition_scores')
      .upsert({
        valuation_id: valuationId,
        condition_score: getConditionScore(assessment.condition),
        confidence_score: assessment.confidenceScore,
        issues: assessment.issuesDetected || [],
        summary: assessment.aiSummary
      });

    if (storeError) {
      console.error("Error storing condition assessment:", storeError);
    }

    // Return the assessment
    return new Response(
      JSON.stringify(assessment),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-vehicle-condition function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to analyze vehicle condition", 
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Analyzes vehicle condition based on individual photo scores
 */
async function analyzeWithScores(scores: PhotoScore[]): Promise<ConditionAssessment> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find the best photo (highest score)
  const bestPhoto = [...scores].sort((a, b) => b.score - a.score)[0];
  
  // Calculate average score
  const avgScore = scores.reduce((sum, score) => sum + score.score, 0) / scores.length;
  
  // Determine condition based on average score
  let condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  if (avgScore >= 0.85) condition = 'Excellent';
  else if (avgScore >= 0.70) condition = 'Good';
  else if (avgScore >= 0.50) condition = 'Fair';
  else condition = 'Poor';
  
  // Generate confidence score (higher if scores are consistent)
  const scoreVariance = getVariance(scores.map(s => s.score));
  const confidenceScore = Math.min(95, Math.max(30, 100 - (scoreVariance * 100) - (5 * (5 - scores.length))));
  
  // Generate random issues based on condition
  const issuesDetected = generateRandomIssues(condition);
  
  // Generate summary
  const aiSummary = generateConditionSummary(condition, issuesDetected);
  
  return {
    condition,
    confidenceScore,
    issuesDetected,
    aiSummary,
    bestPhotoUrl: bestPhoto?.url
  };
}

/**
 * Simulates analyzing vehicle condition when individual scores aren't available
 */
async function simulateConditionAssessment(photoUrls: string[]): Promise<ConditionAssessment> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Randomly select a condition, but bias toward better conditions
  const conditions: Array<'Excellent' | 'Good' | 'Fair' | 'Poor'> = ['Excellent', 'Good', 'Good', 'Fair', 'Poor'];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  
  // Generate confidence score (60-90%)
  const confidenceScore = 60 + Math.floor(Math.random() * 30);
  
  // Generate random issues based on condition
  const issuesDetected = generateRandomIssues(condition);
  
  // Generate summary
  const aiSummary = generateConditionSummary(condition, issuesDetected);
  
  // Select a random photo as "best"
  const bestPhotoUrl = photoUrls[Math.floor(Math.random() * photoUrls.length)];
  
  return {
    condition,
    confidenceScore,
    issuesDetected,
    aiSummary,
    bestPhotoUrl
  };
}

/**
 * Generate random condition issues based on vehicle condition
 */
function generateRandomIssues(condition: string): string[] {
  const excellentIssues = [
    "Minor dirt or dust present",
    "Very light scratches only visible at certain angles",
    "Minimal wear on tire tread",
    "Light interior wear appropriate for age"
  ];
  
  const goodIssues = [
    "Small scratches on exterior",
    "Minor door dings or dents",
    "Slight fading on paint",
    "Normal tire wear",
    "Some interior wear on high-touch areas"
  ];
  
  const fairIssues = [
    "Visible scratches and paint chips",
    "Minor dents on multiple panels",
    "Noticeable paint fading",
    "Moderate tire wear",
    "Visible wear on seats and interior trim",
    "Some dashboard cracks"
  ];
  
  const poorIssues = [
    "Multiple noticeable dents and scratches",
    "Significant paint damage or rust",
    "Heavy tire wear",
    "Damaged or cracked glass",
    "Torn upholstery",
    "Dashboard cracks and interior damage",
    "Visible fluid leaks"
  ];
  
  let possibleIssues: string[] = [];
  
  switch (condition) {
    case 'Excellent':
      possibleIssues = excellentIssues;
      break;
    case 'Good':
      possibleIssues = goodIssues;
      break;
    case 'Fair':
      possibleIssues = fairIssues;
      break;
    case 'Poor':
      possibleIssues = poorIssues;
      break;
    default:
      possibleIssues = goodIssues;
  }
  
  // Select 0-3 issues for Excellent, 1-3 for Good, 2-4 for Fair, 3-5 for Poor
  let numIssues = 0;
  switch (condition) {
    case 'Excellent':
      numIssues = Math.floor(Math.random() * 3);
      break;
    case 'Good':
      numIssues = 1 + Math.floor(Math.random() * 3);
      break;
    case 'Fair':
      numIssues = 2 + Math.floor(Math.random() * 3);
      break;
    case 'Poor':
      numIssues = 3 + Math.floor(Math.random() * 3);
      break;
  }
  
  // Shuffle and take required number of issues
  shuffleArray(possibleIssues);
  return possibleIssues.slice(0, numIssues);
}

/**
 * Generate a summary based on condition and detected issues
 */
function generateConditionSummary(condition: string, issues: string[]): string {
  const summaries = {
    'Excellent': [
      "Vehicle appears to be in excellent condition with minimal wear.",
      "This vehicle shows exceptional care and maintenance.",
      "Overall condition is excellent with only minor cosmetic issues noted."
    ],
    'Good': [
      "Vehicle is in good condition with normal wear for its age.",
      "Overall, the vehicle presents well with only minor issues noted.",
      "Good overall condition with some normal signs of use."
    ],
    'Fair': [
      "Vehicle shows expected wear and would benefit from some maintenance.",
      "Fair condition with several cosmetic and wear issues noted.",
      "Vehicle has multiple minor issues but appears to be mechanically sound."
    ],
    'Poor': [
      "Vehicle condition is below average with multiple issues detected.",
      "Poor overall condition with significant wear and damage noted.",
      "Vehicle requires substantial cosmetic repairs and maintenance."
    ]
  };
  
  // Select a random base summary for the condition
  const baseSummaries = summaries[condition as keyof typeof summaries] || summaries['Good'];
  const baseSummary = baseSummaries[Math.floor(Math.random() * baseSummaries.length)];
  
  // Add issues if present
  if (issues.length > 0) {
    return `${baseSummary} Specific issues include: ${issues.join(', ')}.`;
  }
  
  return baseSummary;
}

/**
 * Converts a condition string to a numeric score
 */
function getConditionScore(condition: string): number {
  switch (condition) {
    case 'Excellent': return 95;
    case 'Good': return 75;
    case 'Fair': return 50;
    case 'Poor': return 25;
    default: return 75; // Default to Good
  }
}

/**
 * Calculate variance of an array of numbers
 */
function getVariance(arr: number[]): number {
  if (arr.length <= 1) return 0;
  
  const mean = arr.reduce((sum, val) => sum + val, 0) / arr.length;
  const squareDiffs = arr.map(val => Math.pow(val - mean, 2));
  const variance = squareDiffs.reduce((sum, val) => sum + val, 0) / arr.length;
  
  return variance;
}

/**
 * Shuffle array in-place using Fisher-Yates algorithm
 */
function shuffleArray(array: any[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
