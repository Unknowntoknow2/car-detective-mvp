
// Consolidated photo and AI condition assessment service
export interface PhotoAnalysisResult {
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  confidenceScore: number;
  issuesDetected: string[];
  aiSummary: string;
  photoScore: number;
  recommendations: string[];
}

export interface PhotoUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  analysisResult?: PhotoAnalysisResult;
}

// Photo upload and processing
export async function uploadAndAnalyzePhoto(file: File): Promise<PhotoUploadResult> {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size must be less than 10MB');
    }
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock URL
    const url = `https://example.com/photos/${Date.now()}-${file.name}`;
    
    // Simulate AI analysis
    const analysisResult = await analyzePhotoCondition(url);
    
    return {
      success: true,
      url,
      analysisResult
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

// AI photo condition analysis
export async function analyzePhotoCondition(photoUrl: string): Promise<PhotoAnalysisResult> {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock AI analysis results
  const conditions: ('Excellent' | 'Good' | 'Fair' | 'Poor')[] = ['Excellent', 'Good', 'Fair', 'Poor'];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  
  const issuesByCondition: Record<string, string[]> = {
    'Excellent': ['Minor dust on surface'],
    'Good': ['Light scratches on bumper', 'Small paint chip on door'],
    'Fair': ['Dent on rear panel', 'Scratched headlight', 'Worn tire tread'],
    'Poor': ['Rust on wheel wells', 'Cracked windshield', 'Damaged bumper', 'Faded paint']
  };
  
  const recommendationsByCondition: Record<string, string[]> = {
    'Excellent': ['Regular maintenance will preserve value'],
    'Good': ['Consider touch-up paint for small chips', 'Professional detailing recommended'],
    'Fair': ['Address visible damage before selling', 'Professional assessment recommended'],
    'Poor': ['Significant repairs needed', 'Consider professional restoration', 'Get multiple repair quotes']
  };
  
  const issuesDetected = issuesByCondition[condition] || [];
  const recommendations = recommendationsByCondition[condition] || [];
  
  const confidenceScore = Math.floor(Math.random() * 20) + 75; // 75-95%
  const photoScore = Math.floor(Math.random() * 30) + 70; // 70-100
  
  const aiSummary = generateAISummary(condition, issuesDetected, confidenceScore);
  
  return {
    condition,
    confidenceScore,
    issuesDetected,
    aiSummary,
    photoScore,
    recommendations
  };
}

// Generate AI summary text
function generateAISummary(condition: string, issues: string[], confidence: number): string {
  const summaryTemplates: Record<string, string> = {
    'Excellent': `This vehicle appears to be in excellent condition with minimal wear. AI analysis shows ${confidence}% confidence in this assessment.`,
    'Good': `This vehicle shows typical wear for its age but remains in good overall condition. ${issues.length} minor issues detected with ${confidence}% confidence.`,
    'Fair': `This vehicle shows moderate wear and some areas requiring attention. ${issues.length} issues identified with ${confidence}% confidence in assessment.`,
    'Poor': `This vehicle shows significant wear and multiple issues requiring immediate attention. ${issues.length} major concerns identified with ${confidence}% confidence.`
  };
  
  return summaryTemplates[condition] || `Vehicle condition assessed as ${condition} with ${confidence}% confidence.`;
}

// Photo scoring for marketplace visibility
export function calculatePhotoScore(analysisResult: PhotoAnalysisResult): number {
  let score = 50; // Base score
  
  // Condition impact
  const conditionScores = {
    'Excellent': 25,
    'Good': 15,
    'Fair': 5,
    'Poor': -10
  };
  
  score += conditionScores[analysisResult.condition];
  
  // Confidence impact
  score += (analysisResult.confidenceScore - 75) * 0.5;
  
  // Issues impact
  score -= analysisResult.issuesDetected.length * 3;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

// Batch photo analysis
export async function analyzeBatchPhotos(photoUrls: string[]): Promise<PhotoAnalysisResult[]> {
  const results = await Promise.all(
    photoUrls.map(url => analyzePhotoCondition(url))
  );
  
  return results;
}

// Get best photo from analysis results
export function getBestPhoto(results: { url: string; analysis: PhotoAnalysisResult }[]): string | null {
  if (results.length === 0) return null;
  
  const bestResult = results.reduce((best, current) => {
    const bestScore = calculatePhotoScore(best.analysis);
    const currentScore = calculatePhotoScore(current.analysis);
    return currentScore > bestScore ? current : best;
  });
  
  return bestResult.url;
}

// Photo condition to valuation adjustment
export function getConditionAdjustment(condition: string): number {
  const adjustments: Record<string, number> = {
    'Excellent': 0.05,  // +5%
    'Good': 0,          // 0%
    'Fair': -0.10,      // -10%
    'Poor': -0.25       // -25%
  };
  
  return adjustments[condition] || 0;
}

// Legacy exports for backward compatibility
export const uploadPhoto = uploadAndAnalyzePhoto;
export const analyzePhoto = analyzePhotoCondition;
export const scorePhoto = calculatePhotoScore;
