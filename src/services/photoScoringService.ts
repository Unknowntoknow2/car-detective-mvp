
import { PhotoScore, PhotoScoringResult, AICondition, PhotoAnalysisResult } from '@/types/photo';

/**
 * Mock photo scoring service
 * In a real application, this would call an API to analyze and score photos
 */
export async function scorePhotos(photoUrls: string[]): Promise<PhotoScoringResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate random scores for each photo
  const individualScores: PhotoScore[] = photoUrls.map((url, index) => {
    // Create random score between 0.65 and 0.95
    const score = Math.round((0.65 + Math.random() * 0.3) * 100) / 100;
    
    return {
      url,
      score,
      isPrimary: index === 0 // Mark first photo as primary
    };
  });
  
  // Calculate overall photo score (average of individual scores)
  const photoScore = individualScores.reduce((sum, item) => sum + item.score, 0) / 
    Math.max(individualScores.length, 1);
  
  // Generate mock AI condition data
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];
  const conditionIndex = Math.min(
    Math.floor((1 - photoScore) * 4), 
    conditions.length - 1
  );
  
  const aiCondition: AICondition = {
    condition: conditions[conditionIndex],
    confidenceScore: Math.round(photoScore * 100),
    issuesDetected: [],
    summary: `Vehicle appears to be in ${conditions[conditionIndex]} condition based on photos.`
  };
  
  // Find the best photo (highest score)
  const bestPhoto = [...individualScores].sort((a, b) => b.score - a.score)[0];
  
  return {
    photoScore,
    score: photoScore,
    individualScores,
    photoUrls,
    bestPhotoUrl: bestPhoto?.url,
    aiCondition
  };
}

export async function analyzePhotos(
  photoUrls: string[], 
  valuationId: string
): Promise<PhotoAnalysisResult> {
  // Reuse the scoring logic
  const scoringResult = await scorePhotos(photoUrls);
  
  return {
    photoUrls,
    score: scoringResult.photoScore,
    aiCondition: scoringResult.aiCondition,
    individualScores: scoringResult.individualScores
  };
}
