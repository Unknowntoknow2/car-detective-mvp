
import { PhotoScoringResult, AICondition } from '@/types/photo';

/**
 * Mock analysis of photos for vehicle condition scoring
 * In a real application, this would use a computer vision API
 */
export function analyzeCondition(photoUrls: string[]): PhotoScoringResult {
  if (!photoUrls.length) {
    return {
      photoScore: 0,
      score: 0,
      photoUrls: [],
      individualScores: [],
      aiCondition: {
        condition: 'Unknown',
        confidenceScore: 0,
        issuesDetected: [],
        summary: 'No photos provided for analysis'
      }
    };
  }
  
  // Generate mock scores for each photo
  const individualScores = photoUrls.map(url => {
    // Create a random score between 0.6 and 0.95
    const score = 0.6 + Math.random() * 0.35;
    return {
      url,
      score
    };
  });
  
  // Calculate overall photo score
  const photoScore = individualScores.reduce((sum, item) => sum + item.score, 0) / individualScores.length;
  
  // Determine condition based on score
  let condition: string;
  if (photoScore > 0.85) {
    condition = 'Excellent';
  } else if (photoScore > 0.7) {
    condition = 'Good';
  } else if (photoScore > 0.5) {
    condition = 'Fair';
  } else {
    condition = 'Poor';
  }
  
  const aiCondition: AICondition = {
    condition,
    confidenceScore: Math.round(photoScore * 100),
    issuesDetected: [],
    summary: `Based on photo analysis, the vehicle appears to be in ${condition} condition.`
  };
  
  if (condition === 'Fair' || condition === 'Poor') {
    aiCondition.issuesDetected.push(
      'Visible wear and tear on exterior',
      'Minor scratches detected'
    );
  }
  
  return {
    photoScore,
    score: photoScore,
    individualScores,
    photoUrls,
    aiCondition
  };
}

/**
 * Analyze a single exterior photo
 */
export function analyzeExteriorPhoto(photoUrl: string): PhotoScoringResult {
  // Random score between 0.6 and 0.9
  const score = 0.6 + Math.random() * 0.3;
  
  // Determine condition based on score
  let condition: string;
  if (score > 0.85) {
    condition = 'Excellent';
  } else if (score > 0.7) {
    condition = 'Good';
  } else if (score > 0.55) {
    condition = 'Fair';
  } else {
    condition = 'Poor';
  }
  
  const aiCondition: AICondition = {
    condition,
    confidenceScore: Math.round(score * 100),
    issuesDetected: [],
    summary: `Exterior appears to be in ${condition} condition.`
  };
  
  return {
    photoScore: score,
    score,
    individualScores: [{ url: photoUrl, score }],
    photoUrls: [photoUrl],
    aiCondition
  };
}

/**
 * Analyze a single interior photo
 */
export function analyzeInteriorPhoto(photoUrl: string): PhotoScoringResult {
  // Random score between 0.65 and 0.95
  const score = 0.65 + Math.random() * 0.3;
  
  // Determine condition based on score
  let condition: string;
  if (score > 0.85) {
    condition = 'Excellent';
  } else if (score > 0.75) {
    condition = 'Good';
  } else if (score > 0.6) {
    condition = 'Fair';
  } else {
    condition = 'Poor';
  }
  
  const aiCondition: AICondition = {
    condition,
    confidenceScore: Math.round(score * 100),
    issuesDetected: [],
    summary: `Interior appears to be in ${condition} condition.`
  };
  
  return {
    photoScore: score,
    score,
    individualScores: [{ url: photoUrl, score }],
    photoUrls: [photoUrl],
    aiCondition
  };
}
