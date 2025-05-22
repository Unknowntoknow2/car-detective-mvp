
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
      summary: 'Overall good condition with minor cosmetic issues'
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

// Add missing functions for useValuationHistory.ts
export async function getUserValuations(userId: string) {
  console.log('Fetching valuations for user:', userId);
  // Return mock data for demonstration purposes
  return [
    {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      mileage: 35000,
      vin: 'JT2BF22K1W0123456',
      estimatedValue: 22500,
      photoUrl: 'https://example.com/camry.jpg',
      photoScore: 0.85,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      make: 'Honda',
      model: 'Accord',
      year: 2019,
      mileage: 42000,
      vin: 'JH4KA7660PC003114',
      estimatedValue: 21000,
      photoUrl: 'https://example.com/accord.jpg',
      photoScore: 0.82,
      createdAt: new Date().toISOString()
    }
  ];
}

export async function getSavedValuations(userId: string) {
  return [];
}

export async function getPremiumValuations(userId: string) {
  return [];
}

export async function getValuationHistory(userId: string) {
  return getUserValuations(userId);
}
