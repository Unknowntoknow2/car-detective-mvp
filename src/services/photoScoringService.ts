
import { AICondition, PhotoAnalysisResult, PhotoScore, PhotoScoringResult } from '@/types/photo';

// Mock photo scoring service implementation
export const scorePhotos = async (
  photoUrls: string[],
  valuationId: string
): Promise<PhotoScoringResult> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate random scores for photos with proper PhotoScore structure
  const scores: PhotoScore[] = photoUrls.map(url => ({
    url,
    score: Math.floor(Math.random() * 30) + 70, // Score between 70-100
    overall: Math.floor(Math.random() * 30) + 70,
    clarity: Math.floor(Math.random() * 30) + 70,
    angle: Math.floor(Math.random() * 30) + 70,
    lighting: Math.floor(Math.random() * 30) + 70,
    condition: Math.floor(Math.random() * 30) + 70,
    isPrimary: false
  }));
  
  // Mark the first photo as primary
  if (scores.length > 0) {
    scores[0].isPrimary = true;
  }
  
  // Create mock condition assessment
  const aiCondition: AICondition = {
    condition: 'Good',
    confidence: 0.85,
    description: 'Vehicle is in good condition with minor cosmetic issues',
    issuesDetected: ['Minor scratches on rear bumper', 'Small dent on driver door'],
    summary: 'Vehicle is in good condition with minor cosmetic issues'
  };
  
  const overallScore = Math.floor(scores.reduce((sum, s) => sum + s.score, 0) / scores.length);
  
  // Return scoring result
  return {
    photoUrl: scores.length > 0 ? scores[0].url : '',
    score: overallScore,
    confidence: 0.85,
    photoUrls,
    individualScores: scores,
    aiCondition,
    overallScore,
    issues: aiCondition.issuesDetected || [],
    summary: aiCondition.summary || ''
  };
};

// Convert PhotoScoringResult to PhotoAnalysisResult format
export const convertToPhotoAnalysisResult = (
  result: PhotoScoringResult
): PhotoAnalysisResult => {
  return {
    confidence: result.confidence || 0.85,
    issues: result.issues || [],
    url: result.photoUrl || (result.photoUrls && result.photoUrls.length > 0 ? result.photoUrls[0] : ''),
    photoUrls: result.photoUrls,
    overallScore: result.overallScore || 0,
    aiCondition: result.aiCondition,
    individualScores: result.individualScores || [],
    recommendations: []
  };
};

// Enhanced photo scoring with detailed analysis
export const enhancedPhotoScoring = async (
  photoUrls: string[],
  valuationId: string
): Promise<PhotoAnalysisResult> => {
  // Simulate enhanced scoring
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate detailed scores with explanations
  const individualScores: PhotoScore[] = photoUrls.map((url, index) => {
    const score = Math.floor(Math.random() * 30) + 70;
    const isPrimary = index === 0;
    
    return {
      url,
      score,
      overall: score,
      clarity: Math.floor(Math.random() * 30) + 70,
      angle: Math.floor(Math.random() * 30) + 70,
      lighting: Math.floor(Math.random() * 30) + 70,
      condition: Math.floor(Math.random() * 30) + 70,
      isPrimary,
      explanation: getScoreExplanation(score)
    };
  });
  
  // Create comprehensive condition assessment
  const aiCondition: AICondition = {
    condition: getConditionFromScore(individualScores),
    confidence: 0.9,
    description: 'Comprehensive analysis of multiple vehicle photos shows overall good condition with some normal wear and tear.',
    issuesDetected: generateRandomIssues(),
    summary: 'Comprehensive analysis of multiple vehicle photos shows overall good condition with some normal wear and tear.'
  };
  
  const avgScore = calculateAverageScore(individualScores);
  
  return {
    confidence: 0.9,
    issues: aiCondition.issuesDetected || [],
    url: photoUrls[0],
    photoUrls,
    overallScore: avgScore,
    aiCondition,
    individualScores,
    recommendations: []
  };
};

// Helper function to get explanation based on score
function getScoreExplanation(score: number): string {
  if (score >= 90) return 'Excellent photo showing vehicle in great condition';
  if (score >= 80) return 'Good photo quality showing vehicle details clearly';
  if (score >= 70) return 'Acceptable photo with adequate vehicle details';
  return 'Photo quality could be improved for better assessment';
}

// Helper function to determine condition from scores
function getConditionFromScore(scores: PhotoScore[]): string {
  const avgScore = calculateAverageScore(scores);
  
  if (avgScore >= 90) return 'Excellent';
  if (avgScore >= 80) return 'Good';
  if (avgScore >= 70) return 'Fair';
  return 'Poor';
}

// Helper function to calculate average score
function calculateAverageScore(scores: PhotoScore[]): number {
  if (scores.length === 0) return 0;
  
  const sum = scores.reduce((total, item) => total + item.score, 0);
  return Math.round(sum / scores.length);
}

// Helper function to generate random issues
function generateRandomIssues(): string[] {
  const possibleIssues = [
    'Minor scratches on exterior',
    'Light wear on driver seat',
    'Small dent on passenger door',
    'Normal tire wear',
    'Minor dashboard wear',
    'Slight discoloration on paint',
    'Small chips on front bumper'
  ];
  
  const numIssues = Math.floor(Math.random() * 3) + 1; // 1-3 issues
  const selectedIssues: string[] = [];
  
  for (let i = 0; i < numIssues; i++) {
    const randomIndex = Math.floor(Math.random() * possibleIssues.length);
    selectedIssues.push(possibleIssues[randomIndex]);
    possibleIssues.splice(randomIndex, 1); // Remove to avoid duplicates
  }
  
  return selectedIssues;
}
