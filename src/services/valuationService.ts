<<<<<<< HEAD

import { FormData } from '@/types/premium-valuation';
import { supabase } from '@/integrations/supabase/client';
=======
import { AICondition } from "@/types/photo";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

/**
 * Creates a premium valuation based on the provided form data
 */
<<<<<<< HEAD
export async function createPremiumValuation(data: FormData) {
  // In a real implementation, this would make an API call to create the valuation
  console.log('Creating premium valuation with data:', data);
  
  // Mock implementation - return a mock response
  return {
    id: `premium-${Date.now()}`,
    ...data,
    estimatedValue: 25000 + Math.floor(Math.random() * 5000),
    confidenceScore: 85,
    createdAt: new Date().toISOString()
=======
export async function getBestPhotoAssessment(valuationId: string) {
  // This would normally fetch from an API or database
  console.log("Getting photo assessment for:", valuationId);

  // Return mock data for now
  return {
    aiCondition: {
      condition: "Good",
      confidenceScore: 85,
      issuesDetected: ["Minor scratches"],
      aiSummary: "Overall good condition with minor cosmetic issues",
    } as AICondition,
    photoScores: [
      {
        url: "https://example.com/photo1.jpg",
        score: 0.85,
        isPrimary: true,
      },
      {
        url: "https://example.com/photo2.jpg",
        score: 0.75,
      },
    ],
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };
}

/**
 * Gets premium valuations for the current user
 */
export async function getPremiumValuations() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    // Get all premium valuations for this user
    const { data, error } = await supabase
      .from('premium_valuations')
      .select(`
        valuation_id,
        valuations (*)
      `)
      .eq('user_id', user.id);
      
    if (error) throw error;
    
    return data?.map((item: any) => item.valuations) || [];
  } catch (error) {
    console.error('Error getting premium valuations:', error);
    return [];
  }
}

/**
 * Gets a valuation by ID
 */
export async function getValuationById(id: string) {
<<<<<<< HEAD
  try {
    const { data, error } = await supabase
      .from('valuations')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    // Check if this is a premium valuation
    const { data: premiumData } = await supabase
      .from('premium_valuations')
      .select('*')
      .eq('valuation_id', id)
      .maybeSingle();
    
    const isPremium = !!premiumData || data.premium_unlocked;
    
    return {
      ...data,
      estimatedValue: data.estimated_value,
      confidenceScore: data.confidence_score,
      isPremium,
      // Add placeholder data for the result page
      adjustments: [
        { factor: 'Mileage', impact: -500, description: `Based on ${data.mileage?.toLocaleString() || 'unknown'} miles` },
        { factor: 'Condition', impact: 1500, description: `${data.condition || 'Good'} condition` },
        { factor: 'Market Demand', impact: 1500, description: 'Based on current market conditions' }
      ],
      priceRange: [
        Math.round(data.estimated_value * 0.95),
        Math.round(data.estimated_value * 1.05)
      ]
    };
  } catch (error) {
    console.error('Error getting valuation by ID:', error);
    throw error;
  }
=======
  // Mock implementation
  const mockData = {
    accident_count: 0,
    auction_avg_price: 15000,
    base_price: 18000,
    body_style: "Sedan",
    body_type: "Sedan",
    color: "Blue",
    condition_score: 85,
    confidence_score: 92,
    created_at: new Date().toISOString(),
    estimated_value: 17500,
    id: id,
    make: "Toyota",
    model: "Camry",
    vehicle_features: [],
    year: 2018,
    mileage: 45000,
    fuel_type: "Gasoline",
  };

  // Access properties safely
  return {
    ...mockData,
    // Parse safely for fuel_type
    fuelType: mockData.fuel_type || "Unknown",
    // Ensure photoUrl is properly handled
    photoUrl: undefined, // Fixed missing photo_url access
  };
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
}

/**
 * Alias for getValuationById to support legacy code
 */
export const fetchValuation = getValuationById;
