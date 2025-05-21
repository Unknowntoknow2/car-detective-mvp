
import { AICondition, PhotoScore, PhotoScoringResult } from '@/types/photo';

/**
 * Analyzes vehicle photos and returns condition assessment
 */
export async function analyzeVehiclePhotos(
  photoUrls: string[],
  valuationId: string
): Promise<PhotoScoringResult> {
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

  try {
    // In a real implementation, this would call an AI service
    
    // Mock implementation: simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock scores for each photo
    const individualScores: PhotoScore[] = photoUrls.map(url => ({
      url,
      score: 0.5 + Math.random() * 0.5, // Score between 0.5 and 1
      isPrimary: false // Will set primary later
    }));
    
    // Sort by score and mark the highest as primary
    individualScores.sort((a, b) => b.score - a.score);
    if (individualScores.length > 0) {
      individualScores[0].isPrimary = true;
    }
    
    // Calculate average score
    const avgScore = individualScores.reduce((sum, photo) => sum + photo.score, 0) / individualScores.length;
    
    // Determine condition based on average score
    let condition = 'Poor';
    if (avgScore > 0.8) condition = 'Excellent';
    else if (avgScore > 0.6) condition = 'Good';
    else if (avgScore > 0.4) condition = 'Fair';
    
    // Create mock AI condition assessment
    const aiCondition: AICondition = {
      condition,
      confidenceScore: Math.round(avgScore * 100),
      issuesDetected: getRandomIssues(condition),
      summary: `Vehicle appears to be in ${condition.toLowerCase()} condition overall.`
    };
    
    return {
      photoScore: Math.round(avgScore * 100),
      score: Math.round(avgScore * 100),
      photoUrls,
      individualScores,
      bestPhotoUrl: individualScores[0]?.url,
      aiCondition
    };
  } catch (error) {
    console.error('Error analyzing photos:', error);
    return {
      photoScore: 0,
      score: 0,
      photoUrls,
      individualScores: [],
      aiCondition: {
        condition: 'Unknown',
        confidenceScore: 0,
        issuesDetected: [],
        summary: 'Error occurred during photo analysis'
      }
    };
  }
}

// Helper function to generate random issues based on condition
function getRandomIssues(condition: string): string[] {
  const excellentIssues = [
    'Minor dust on surfaces',
    'Slight wear on tires'
  ];
  
  const goodIssues = [
    'Light scratches on paint',
    'Minor wear on driver seat',
    'Small scuffs on wheels'
  ];
  
  const fairIssues = [
    'Visible scratches on multiple panels',
    'Moderate interior wear',
    'Faded paint in some areas',
    'Scuffed bumpers'
  ];
  
  const poorIssues = [
    'Significant paint damage',
    'Visible rust spots',
    'Heavy interior wear',
    'Dashboard cracks',
    'Damaged bumpers'
  ];
  
  // Select random subset of issues based on condition
  let issuePool: string[] = [];
  switch (condition) {
    case 'Excellent':
      issuePool = excellentIssues;
      break;
    case 'Good':
      issuePool = goodIssues;
      break;
    case 'Fair':
      issuePool = fairIssues;
      break;
    case 'Poor':
      issuePool = poorIssues;
      break;
    default:
      return [];
  }
  
  // Select random number of issues
  const numIssues = Math.floor(Math.random() * Math.min(3, issuePool.length)) + 1;
  const shuffled = [...issuePool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numIssues);
}
