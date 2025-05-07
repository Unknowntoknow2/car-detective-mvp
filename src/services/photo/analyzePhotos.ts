
import { AICondition, Photo, PhotoScore } from '@/types/photo';
import { generateUniqueId } from '@/utils/helpers';

/**
 * Analyzes photos to detect vehicle condition
 */
export async function analyzePhotos(photos: Photo[]): Promise<{
  score: number;
  aiCondition: AICondition;
  individualScores: PhotoScore[];
}> {
  // This is a mock implementation for now
  // In a real app, this would call an AI service to analyze the photos
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate individual scores
  const individualScores: PhotoScore[] = photos.map((photo, index) => {
    const score = Math.random() * 0.3 + 0.6; // Random score between 0.6 and 0.9
    
    return {
      url: photo.url,
      score,
      isPrimary: index === 0, // First photo is primary by default
      explanation: getRandomExplanation(score)
    };
  });
  
  // Calculate overall score
  const overallScore = individualScores.reduce((total, item) => total + item.score, 0) / individualScores.length;
  
  // Generate AI condition assessment
  const aiCondition = generateConditionFromScore(overallScore);
  
  return {
    score: overallScore,
    aiCondition,
    individualScores
  };
}

// Helper functions
function getRandomExplanation(score: number): string {
  if (score > 0.85) {
    return "This photo shows the vehicle in excellent condition with no visible damage.";
  } else if (score > 0.7) {
    return "The vehicle appears to be in good condition with minor signs of wear.";
  } else if (score > 0.5) {
    return "This image shows some moderate wear and potential issues that may need attention.";
  } else {
    return "This photo indicates significant damage or wear that will impact the vehicle's value.";
  }
}

function generateConditionFromScore(score: number): AICondition {
  let condition: "Excellent" | "Good" | "Fair" | "Poor";
  let issues: string[] = [];
  
  if (score > 0.85) {
    condition = "Excellent";
    issues = [];
  } else if (score > 0.7) {
    condition = "Good";
    issues = ["Minor exterior scratches detected"];
  } else if (score > 0.5) {
    condition = "Fair";
    issues = ["Moderate exterior wear", "Possible interior issues"];
  } else {
    condition = "Poor";
    issues = ["Significant damage detected", "Multiple repair areas identified"];
  }
  
  return {
    condition,
    confidenceScore: Math.round(score * 100),
    issuesDetected: issues,
    aiSummary: `Based on the photos provided, this vehicle appears to be in ${condition.toLowerCase()} condition with a confidence score of ${Math.round(score * 100)}%.`
  };
}
