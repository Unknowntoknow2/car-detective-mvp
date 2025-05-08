
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
      condition: data.condition_score ? data.condition_score.toString() : 'Good',
      zipCode: data.state || '',
      zip: data.state || '',
      fuelType: data.fuelType || '',
      bestPhotoUrl: data.photo_scores?.length > 0 ? data.photo_scores[0].url : '',
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
    // For compatibility with existing code, provide mock data
    // Note: In a real implementation, you'd fetch this from your database
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
    // Mock photo scores data for compatibility
    const mockPhotoScores = [
      {
        url: "https://example.com/photo1.jpg",
        score: 85,
        isPrimary: true,
        issues: []
      }
    ];

    // Mock AI condition data
    const mockAiCondition = {
      condition: "Good",
      confidenceScore: 80,
      issuesDetected: [],
      aiSummary: "Vehicle appears to be in good condition based on photo analysis.",
      bestPhotoUrl: "https://example.com/photo1.jpg"
    };

    return {
      photoScores: mockPhotoScores,
      aiCondition: mockAiCondition
    };
  } catch (error) {
    console.error('Error in getBestPhotoAssessment:', error);
    return { photoScores: [] };
  }
}

// Add functions for valuation history
export async function getUserValuations(userId: string): Promise<ValuationResult[]> {
  // For now, return an empty array to satisfy type compatibility
  return [];
}

export async function getSavedValuations(userId: string): Promise<ValuationResult[]> {
  return [];
}

export async function getPremiumValuations(userId: string): Promise<ValuationResult[]> {
  return [];
}

export async function getValuationByToken(token: string): Promise<ValuationResult | null> {
  return null;
}
