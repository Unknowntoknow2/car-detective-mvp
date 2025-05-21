
import { PhotoScoringResult, AICondition, PhotoScore } from '@/types/photo';

/**
 * Score photos from provided URLs
 */
export async function scorePhotos(
  photoUrls: string[],
  valuationId: string
): Promise<PhotoScoringResult> {
  try {
    // Mock implementation since we have no real API
    const mockScores: PhotoScore[] = photoUrls.map((url, index) => ({
      url,
      score: 0.5 + Math.random() * 0.5, // Random score between 0.5 and 1.0
      isPrimary: index === 0 // First photo is primary
    }));

    // Sort by score and select highest scoring image as best
    const sortedScores = [...mockScores].sort((a, b) => b.score - a.score);
    const bestPhotoUrl = sortedScores[0]?.url;

    // Mock AI condition assessment
    const aiCondition: AICondition = {
      condition: 'Good',
      confidenceScore: 85,
      issuesDetected: ['Minor scratches on front bumper', 'Light wear on driver seat'],
      summary: 'Vehicle appears to be in good condition overall with minor cosmetic issues.'
    };

    const averageScore = mockScores.reduce((sum, item) => sum + item.score, 0) / mockScores.length;

    return {
      photoScore: averageScore * 100, // Convert to 0-100 scale
      score: averageScore * 100,
      individualScores: mockScores,
      photoUrls,
      bestPhotoUrl,
      aiCondition
    };
  } catch (error) {
    console.error('Error in photo scoring:', error);
    
    // Return a default error result
    const mockAICondition: AICondition = {
      condition: 'Unknown',
      confidenceScore: 0,
      issuesDetected: [],
      summary: 'Could not analyze photos'
    };
    
    return {
      photoScore: 0,
      score: 0,
      individualScores: [],
      photoUrls,
      aiCondition: mockAICondition,
      error: error instanceof Error ? error.message : 'Unknown error in photo scoring'
    };
  }
}

/**
 * Upload and analyze photos for a vehicle
 */
export async function uploadAndAnalyzePhotos(
  files: File[],
  valuationId: string
): Promise<PhotoScoringResult> {
  try {
    // In a real implementation, you would upload the files to storage first
    console.log(`Uploading ${files.length} photos for valuation ${valuationId}`);
    
    // Then create mock URLs as if they were uploaded
    const photoUrls = files.map((_, index) => 
      `https://example.com/storage/vehicle-photos/${valuationId}/${index}.jpg`
    );
    
    // Then score the uploaded photos
    return await scorePhotos(photoUrls, valuationId);
  } catch (error) {
    console.error('Error in photo upload and analysis:', error);
    
    const mockAICondition: AICondition = {
      condition: 'Unknown',
      confidenceScore: 0,
      issuesDetected: [],
      summary: 'Could not analyze photos'
    };
    
    return {
      photoScore: 0,
      score: 0,
      individualScores: [],
      photoUrls: [],
      aiCondition: mockAICondition,
      error: error instanceof Error ? error.message : 'Unknown error in photo upload'
    };
  }
}
