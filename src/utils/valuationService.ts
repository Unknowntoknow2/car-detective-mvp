
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
