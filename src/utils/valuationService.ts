
import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from '@/utils/error-handling';
import type { Valuation } from "@/types/valuation-history";
import type { PhotoScore, AICondition } from "@/types/photo";

export async function getUserValuations(userId: string): Promise<Valuation[]> {
  try {
    if (!userId) {
      throw new Error('User ID is required to fetch valuations');
    }

    // Get all valuations for the user
    const { data: userValuations, error: valuationsError } = await supabase
      .from('valuations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (valuationsError) {
      console.error('Error fetching valuations:', valuationsError.message);
      throw valuationsError;
    }

    return userValuations || [];
  } catch (error) {
    errorHandler.handle(error, 'valuations-fetch');
    return [];
  }
}

export async function getSavedValuations(userId: string): Promise<Valuation[]> {
  try {
    if (!userId) {
      throw new Error('User ID is required to fetch saved valuations');
    }

    // Get saved valuations for the user
    const { data: savedValuations, error: savedError } = await supabase
      .from('saved_valuations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (savedError) {
      console.error('Error fetching saved valuations:', savedError.message);
      throw savedError;
    }

    return savedValuations || [];
  } catch (error) {
    errorHandler.handle(error, 'saved-valuations-fetch');
    return [];
  }
}

export async function getPremiumValuations(userId: string): Promise<Valuation[]> {
  try {
    if (!userId) {
      throw new Error('User ID is required to fetch premium valuations');
    }

    // Get premium valuations through completed orders
    const { data: premiumOrders, error: ordersError } = await supabase
      .from('orders')
      .select('*, valuations(*)')
      .eq('user_id', userId)
      .eq('status', 'paid');
    
    if (ordersError) {
      console.error('Error fetching premium orders:', ordersError.message);
      throw ordersError;
    }
    
    // Format premium valuations
    const premiumValuations = premiumOrders
      ?.filter(order => order.valuations)
      .map(order => ({
        id: order.valuations.id,
        created_at: order.created_at,
        make: order.valuations.make,
        model: order.valuations.model,
        year: order.valuations.year,
        vin: order.valuations.vin,
        plate: order.valuations.plate,
        state: order.valuations.state,
        estimated_value: order.valuations.estimated_value,
        is_premium: true,
        premium_unlocked: true
      })) || [];
      
    return premiumValuations;
  } catch (error) {
    errorHandler.handle(error, 'premium-valuations-fetch');
    return [];
  }
}

// Get the best quality photo assessment for a valuation
export async function getBestPhotoAssessment(valuationId: string): Promise<{
  aiCondition: AICondition | null;
  photoScores: PhotoScore[];
}> {
  try {
    if (!valuationId) {
      return { aiCondition: null, photoScores: [] };
    }
    
    // Get all photo scores for this valuation
    const { data: photoScores, error: scoresError } = await supabase
      .from('photo_condition_scores')
      .select('*')
      .eq('valuation_id', valuationId)
      .order('confidence_score', { ascending: false });
      
    if (scoresError) {
      console.error('Error fetching photo scores:', scoresError.message);
      return { aiCondition: null, photoScores: [] };
    }
    
    if (!photoScores || photoScores.length === 0) {
      return { aiCondition: null, photoScores: [] };
    }
    
    // Find the score with highest confidence that meets our threshold (70%)
    const bestScore = photoScores.find(score => score.confidence_score >= 0.7);
    
    if (!bestScore) {
      // If no score meets our threshold, return null condition but still return scores
      const mappedScores = photoScores.map(score => {
        // Get the correct image URL field based on the schema
        const imageUrl = 'photo_url' in score ? score.photo_url : 
                         'image_url' in score ? score.image_url : '';
        
        return {
          url: imageUrl || '',
          score: score.condition_score
        };
      });
      
      return { 
        aiCondition: null, 
        photoScores: mappedScores 
      };
    }
    
    // Create the AI condition from the best score
    const aiCondition: AICondition = {
      condition: bestScore.condition_score >= 0.8 ? 'Excellent' : 
                 bestScore.condition_score >= 0.6 ? 'Good' : 
                 bestScore.condition_score >= 0.4 ? 'Fair' : 'Poor',
      confidenceScore: Math.round(bestScore.confidence_score * 100),
      issuesDetected: Array.isArray(bestScore.issues) ? bestScore.issues : [],
      aiSummary: bestScore.summary || undefined
    };
    
    // Map the photo scores to the expected format
    const mappedScores = photoScores.map(score => {
      // Get the correct image URL field based on the schema
      const imageUrl = 'photo_url' in score ? score.photo_url : 
                       'image_url' in score ? score.image_url : '';
      
      return {
        url: imageUrl || '',
        score: score.condition_score
      };
    });
    
    return { 
      aiCondition, 
      photoScores: mappedScores 
    };
  } catch (error) {
    console.error('Error getting best photo assessment:', error);
    return { aiCondition: null, photoScores: [] };
  }
}

// Add a function to create a test valuation entry (for testing purposes)
export function createTestValuation(overrides: Partial<Valuation> = {}): Valuation {
  return {
    id: `test-${Math.random().toString(36).substring(2, 9)}`,
    created_at: new Date().toISOString(),
    make: 'Test Make',
    model: 'Test Model',
    year: 2023,
    vin: 'TEST12345678901234',
    estimated_value: 20000,
    is_premium: false,
    premium_unlocked: false,
    ...overrides
  };
}
