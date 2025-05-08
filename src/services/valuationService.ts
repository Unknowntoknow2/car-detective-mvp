
import { AICondition } from '@/types/photo';

/**
 * Get the best photo assessment for a valuation
 */
export async function getBestPhotoAssessment(valuationId: string) {
  // This would normally fetch from an API or database
  console.log('Getting photo assessment for:', valuationId);
  
  // Return mock data for now
  return {
    aiCondition: {
      condition: 'Good',
      confidenceScore: 85,
      issuesDetected: ['Minor scratches'],
      aiSummary: 'Overall good condition with minor cosmetic issues'
    } as AICondition,
    photoScores: [
      {
        url: 'https://example.com/photo1.jpg',
        score: 0.85,
        isPrimary: true
      },
      {
        url: 'https://example.com/photo2.jpg',
        score: 0.75
      }
    ]
  };
}

// Add getValuationById missing function
export async function getValuationById(id: string) {
  // Mock implementation
  const mockData = {
    accident_count: 0,
    auction_avg_price: 15000,
    base_price: 18000,
    body_style: 'Sedan',
    body_type: 'Sedan',
    color: 'Blue',
    condition_score: 85,
    confidence_score: 92,
    created_at: new Date().toISOString(),
    estimated_value: 17500,
    id: id,
    make: 'Toyota',
    model: 'Camry',
    vehicle_features: [],
    year: 2018,
    mileage: 45000,
    fuel_type: 'Gasoline' // ensure this property exists
  };

  // Access properties safely
  return {
    ...mockData,
    // Parse safely for fuel_type
    fuelType: mockData.fuel_type || 'Unknown',
    // Ensure photoUrl is properly handled
    photoUrl: typeof mockData.photo_url === 'string' ? mockData.photo_url : undefined
  };
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
