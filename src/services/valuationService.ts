
import { supabase } from '@/integrations/supabase/client';
import { ValuationResult } from '@/types/valuation';
import { calculateFinalValuation } from '@/utils/valuation/calculateFinalValuation';
import { AICondition, PhotoScore } from '@/types/photo';

interface FetchValuationOptions {
  includePremiumDetails?: boolean;
}

export async function fetchValuation(
  valuationId: string, 
  options: FetchValuationOptions = {}
): Promise<ValuationResult | null> {
  try {
    const { data, error } = await supabase
      .from('valuations')
      .select(`
        *,
        photo_scores:photo_scores(*),
        photo_condition:photo_condition_scores(*),
        vehicle_features:vehicle_features(feature_id)
      `)
      .eq('id', valuationId)
      .single();

    if (error) {
      console.error('Error fetching valuation:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Map database columns to ValuationResult fields
    const valuation: ValuationResult = {
      id: data.id,
      make: data.make || '',
      model: data.model || '',
      year: data.year || 0,
      mileage: data.mileage || 0,
      condition: data.condition || data.condition_score?.toString() || 'Good',
      zipCode: data.zip || data.state || '',
      zip: data.zip || data.state || '',
      fuelType: data.fuel_type || data.fuelType || '',
      bestPhotoUrl: data.photo_url || '',
      estimatedValue: data.estimated_value || 0,
      confidenceScore: data.confidence_score || 80,
      priceRange: [
        Math.floor((data.estimated_value || 0) * 0.95), 
        Math.ceil((data.estimated_value || 0) * 1.05)
      ],
      features: data.vehicle_features?.map((vf: any) => vf.feature_id) || []
    };

    // Add premium details if requested and available
    if (options.includePremiumDetails && data.premium_unlocked) {
      const premiumDetails = await fetchPremiumDetails(valuationId);
      
      if (premiumDetails) {
        valuation.adjustments = premiumDetails.adjustments;
        valuation.explanation = premiumDetails.explanation;
      }
    }

    return valuation;
  } catch (error) {
    console.error('Error in fetchValuation:', error);
    return null;
  }
}

export async function fetchPremiumDetails(valuationId: string) {
  try {
    // Mocked data until we have the proper tables
    return {
      adjustments: [
        {
          factor: "Mileage",
          impact: -1200,
          description: "Based on average mileage for this vehicle type and year"
        },
        {
          factor: "Condition",
          impact: 800,
          description: "Based on reported vehicle condition"
        },
        {
          factor: "Market Demand",
          impact: 1500,
          description: "Current market trends for this make/model"
        }
      ],
      explanation: "This valuation is based on current market trends and condition factors."
    };
  } catch (error) {
    console.error('Error in fetchPremiumDetails:', error);
    return null;
  }
}

export async function getBestPhotoAssessment(valuationId: string) {
  try {
    // Query for photo score data
    const { data: photoScores, error: photoError } = await supabase
      .from('photo_scores')
      .select('*')
      .eq('valuation_id', valuationId)
      .order('score', { ascending: false });

    if (photoError) {
      console.error('Error fetching photo scores:', photoError);
      return { photoScores: [] };
    }

    // Query for AI condition assessment
    const { data: aiConditionData, error: aiError } = await supabase
      .from('photo_condition_scores')
      .select('*')
      .eq('valuation_id', valuationId)
      .single();

    if (aiError && aiError.code !== 'PGRST116') {
      console.error('Error fetching AI condition data:', aiError);
    }

    // Format photo scores to match the PhotoScore type
    const formattedPhotoScores: PhotoScore[] = photoScores.map((score: any) => ({
      url: score.thumbnail_url || '',
      score: score.score || 0,
      isPrimary: false,
      issues: score.metadata?.issues || []
    }));

    // Format AI condition data if available
    let aiCondition: AICondition | null = null;
    if (aiConditionData) {
      aiCondition = {
        condition: aiConditionData.condition_score >= 85 ? 'Excellent' :
                  aiConditionData.condition_score >= 70 ? 'Good' :
                  aiConditionData.condition_score >= 50 ? 'Fair' : 'Poor',
        confidenceScore: aiConditionData.confidence_score || 0,
        issuesDetected: aiConditionData.issues || [],
        aiSummary: aiConditionData.summary || '',
        bestPhotoUrl: formattedPhotoScores[0]?.url
      };
    }

    return {
      photoScores: formattedPhotoScores,
      aiCondition
    };
  } catch (error) {
    console.error('Error in getBestPhotoAssessment:', error);
    return { photoScores: [] };
  }
}

// Add missing functions for useValuationHistory.ts
export async function getUserValuations(userId: string) {
  return [];
}

export async function getSavedValuations(userId: string) {
  return [];
}

export async function getPremiumValuations(userId: string) {
  return [];
}

export async function getValuationByToken(token: string) {
  return null;
}
